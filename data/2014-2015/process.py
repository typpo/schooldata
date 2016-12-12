#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import numpy as np
import csv
import json
from slugify import slugify

PAIRS = [
    ['./ccd_sch_029_1415_w_0216601a.txt', './2014-15 CCD Companion_SCH Directory_File_Layout.xlsx'],
    ['./ccd_rpgm_029_1415_w_0216161a.txt', './2014-15 CCD Companion_SCH Reportable Programs_File_Layout.xlsx'],
    ['./ccd_sch_052_1415_w_0216161a.txt', './2014-15 CCD Companion_School Membership_File_Layout.xlsx'],
    ['./ccd_sch_059_1415_w_0216161a.txt', './2014-15 CCD Companion_SCH Staff_File_Layout.xlsx'],
    ['./ccd_sch_129_1415_w_0216161a.txt', './2014-15 CCD Companion_SCH CCD School_File_Layout.xlsx'],
    ['./ccd_sch_033_1415_w_0216161a.txt', './2014-15 CCD Companion_SCH Free Lunch_File_Layout.xlsx'],
]

def get_desc(desc):
    period = desc.find('.')
    paren = desc.find('(')
    idx = period if period < paren else paren
    if idx > -1:
        return desc[:idx]
    return desc

def load_annotated_dataframe(data_path, defs_path):
    data = pd.read_csv(data_path, delimiter='\t', dtype='unicode')
    defs = pd.read_excel(defs_path, verbose=True)
    abbrevs_to_desc = dict(zip(defs['Variable Name'].values, defs['Description'].values))
    data.columns = [slugify(abbrevs_to_desc[colname], separator='_') for colname in data.columns]
    data.set_index('nces_school_identifier')
    return data

print 'Loading...'
dfs = [load_annotated_dataframe(pair[0], pair[1]) for pair in PAIRS]

print 'Combining...'
x = pd.DataFrame()
for df in dfs:
    x = x.combine_first(df)
print x.shape

print 'Writing...'
x.to_csv('processed_data.csv')
print 'Done.'

