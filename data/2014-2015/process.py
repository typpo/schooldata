#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import numpy as np
import csv
import json
import pymongo
from slugify import slugify

# Data files.
PAIRS = [
    ['./ccd_sch_029_1415_w_0216601a.txt', './2014-15 CCD Companion_SCH Directory_File_Layout.xlsx'],
    ['./ccd_rpgm_029_1415_w_0216161a.txt', './2014-15 CCD Companion_SCH Reportable Programs_File_Layout.xlsx'],
    ['./ccd_sch_052_1415_w_0216161a.txt', './2014-15 CCD Companion_School Membership_File_Layout.xlsx'],
    ['./ccd_sch_059_1415_w_0216161a.txt', './2014-15 CCD Companion_SCH Staff_File_Layout.xlsx'],
    ['./ccd_sch_129_1415_w_0216161a.txt', './2014-15 CCD Companion_SCH CCD School_File_Layout.xlsx'],
    ['./ccd_sch_033_1415_w_0216161a.txt', './2014-15 CCD Companion_SCH Free Lunch_File_Layout.xlsx'],
]

# Map from slugs to simplified slugs.
SLUG_MAPPINGS = {
    'school_name': 'name',
    'location_city': 'city',
    'location_state_two_letter_u_s_postal_service_abbreviation_see_state_codes_tab': 'state',
    'location_5_digit_zip_code': 'zip',
    'telephone_number': 'phone',
    'education_agency_name': 'agency',
    'school_type_description': 'type',
    'classroom_teachers_total_full_time_equivalent_classroom_teachers_full_time_equivalency_reported_to_the_nearest_hundredth_field_includes_two_explicit_decimal_places': 'classroom_teachers_total',
    'count_of_students_eligible_to_participate_in_the_free_lunch_program_under_the_national_school_lunch_act': 'num_free_lunch_eligible',
    'count_of_students_eligible_to_participate_in_the_reduced_price_lunch_program_under_the_national_school_lunch_act': 'num_reduced_lunch_eligible',
    'school_wide_title_i_this_flag_indicates_whether_a_school_is_eligible_for_participation_in_schoolwide_program_authorized_by_title_i_of_public_law_103_382': 'title_i_eligible',
}
    # 'street_address'
    # 'mailing_address'

    # lat,lng?

def get_desc(desc):
    period = desc.find('.')
    paren = desc.find('(')
    idx = period if period < paren else paren
    if idx > -1:
        return desc[:idx]
    return desc

def get_slug(colname, abbrevs_to_desc):
    slug = slugify(abbrevs_to_desc[colname], separator='_')
    return SLUG_MAPPINGS.get(slug, slug)

def load_annotated_dataframe(data_path, defs_path):
    data = pd.read_csv(data_path, delimiter='\t', dtype='unicode')
    defs = pd.read_excel(defs_path)
    abbrevs_to_desc = dict(zip(defs['Variable Name'].values, defs['Description'].values))
    data.columns = [get_slug(colname, abbrevs_to_desc) for colname in data.columns]

    # Concat NCES id.
    data['nces_uid'] = pd.Series([x[0] + x[1] \
            for x in zip(data['nces_school_identifier'].values, \
                         data['nces_agency_identification_number'].values)])

    data.set_index(['nces_uid'], inplace=True)
    return data

def compute_diversity(data):
    total = data['total_students_all_grades_includes_ae']
    target = 1 / 6.

    scores = []
    scores.append((data['all_students_white'] / total - target).abs())
    scores.append((data['all_students_american_indian_alaska_native'] / total - target).abs())
    scores.append((data['all_students_asian'] / total - target).abs())
    scores.append((data['all_students_black'] / total - target).abs())
    scores.append((data['all_students_hawaiian_native_pacific_islander'] / total - target).abs())
    scores.append((data['all_students_hispanic'] / total - target).abs())

    return reduce(lambda x,y: x + y, scores[1:], scores[0])

def postprocess(data):
    total = data['total_students_all_grades_includes_ae']

    # Slugs.
    if 'name' in data:
        data['slug'] = data['name'].map(lambda name: slugify(name, separator='_'))
    data['agency_slug'] = data['agency'].map(lambda name: slugify(name, separator='_'))

    # Compute student-teacher ratio.
    data['student_teacher_ratio'] = total / data['classroom_teachers_total']

    # Clean up some capitalization.
    if 'name' in data:
        data['name'] = data['name'].map(lambda s: s.title())
    data['agency'] = data['agency'].map(lambda s: s.title())
    data['city'] = data['city'].map(lambda s: s.title())

    # Diversity
    data['diversity_score'] = compute_diversity(data)

    # Percent free or reduced lunch
    data['free_or_reduced_lunch_ratio'] = (data['num_free_lunch_eligible'] + data['num_reduced_lunch_eligible']) / total

    return data

def insert_dataframe_to_mongo(data, dbname, collname):
    print 'Inserting to %s:%s...' % (dbname, collname)
    mng_client = pymongo.MongoClient('localhost', 27017)
    mng_db = mng_client[dbname]
    db_cm = mng_db[collname]
    db_cm.drop()
    db_cm.remove()

    batch = []
    for index, row in data.iterrows():
        batch.append(dict(zip(data.columns, row.values)))
        if len(batch) > 50000:
            db_cm.insert_many(batch)
            batch = []
    db_cm.insert_many(batch)

print 'Loading...'
dfs = [load_annotated_dataframe(pair[0], pair[1]) for pair in PAIRS]

print 'Combining...'
schools = pd.DataFrame()
for df in dfs:
    # See https://pandas-docs.github.io/pandas-docs-travis/basics.html#general-dataframe-combine
    schools = schools.combine_first(df)
print schools.shape

print 'Postprocessing...'
schools = postprocess(schools)

insert_dataframe_to_mongo(schools, 'schools', 'schools')

# Group into districts.
print 'Grouping by districts...'
districts_groupby = schools.groupby(['agency_slug', 'nces_agency_identification_number', 'agency', 'city', 'state'])
districts = districts_groupby.sum()
districts['school_count'] = districts_groupby['nces_agency_identification_number'].transform('count')
districts.reset_index(inplace=True)
print districts.shape
print 'Postprocessing...'
districts = postprocess(districts)
insert_dataframe_to_mongo(districts, 'schools', 'districts')

print 'Done.'

