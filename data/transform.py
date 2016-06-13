#!/usr/bin/env python2.7
# Converts raw CSV to our database format.
#
# See https://nces.ed.gov/ccd/Data/txt/sc132alay.txt for raw CSV field
# definitions.

import csv
import sys
from collections import OrderedDict

from slugify import slugify

def capitalize_first_letters(words):
    splits = words.split(' ')
    return ' '.join([word[0].upper() + word[1:].lower() for word in splits])

class Transformer(object):
    def __init__(self):
        self.TRANSFORMS = OrderedDict({
            'slug': self.get_slug,

            'name': self.get_name,
            'street_address': self.get_street_address,
            'mailing_address': self.get_mailing_address,
            'city': self.get_city,
            'state': self.get_state,
            'zip': self.get_zip,
            'phone': self.get_phone,
            'agency': self.get_agency,
            'type': self.get_type,
            'lat': self.get_lat,
            'lng': self.get_lng,

            'locale_type': self.get_locale_type,

            # TODO(ian): status.
        })

    def get_slug(self, row):
        return slugify(self.get_name(row))

    def get_name(self, row):
        REPLACE_TOKENS = {
            'SCH': 'School',
            'ALT': 'Alternative',
            'ELEM': 'Elementary',
        }
        name = row['SCHNAM']
        tokens = name.split()

        return ' '.join([
                capitalize_first_letters(REPLACE_TOKENS.get(token, token)) \
                        for token in tokens])

    def get_street_address(self, row):
        return capitalize_first_letters(row['LSTREE'])

    def get_mailing_address(self, row):
        return capitalize_first_letters(row['MSTREE'])

    def get_phone(self, row):
        return row['PHONE']

    def get_city(self, row):
        return capitalize_first_letters(row['LCITY'])

    def get_state(self, row):
        return row['LSTATE']

    def get_zip(self, row):
        return row['LZIP']

    def get_agency(self, row):
        return capitalize_first_letters(row['LEANM'])

    def get_type(self, row):
        school_type = int(row['TYPE'])
        types = ['regular', 'special education', 'vocational', 'other/alternative', 'reportable']
        return types[school_type - 1]

    def get_locale_type(self, row):
        try:
            parsed = int(row['ULOCAL'])
        except ValueError:
            return None
        types = {
	    11: 'City, Large',
	    12: 'City, Mid-size',
	    13: 'City, Small',
	    21: 'Suburb, Large',
	    22: 'Suburb, Mid-size',
	    23: 'Suburb, Small',
	    31: 'Town, Fringe',
	    32: 'Town, Distant',
	    33: 'Town, Remote',
	    41: 'Rural, Fringe',
	    42: 'Rural, Distant',
	    43: 'Rural, Remote',
        }
        return types[parsed]

    def get_lat(self, row):
        return float(row['LATCOD'])

    def get_lng(self, row):
        return float(row['LONCOD'])

    def process(self, instream, outstream):
        tabin = csv.DictReader(instream, dialect=csv.excel_tab)
        commaout = csv.writer(outstream, dialect=csv.excel)
        commaout.writerow(self.TRANSFORMS.keys())
        for row in tabin:
            outrow = []
            for key, transform in self.TRANSFORMS.items():
                outrow.append(transform(row))

            commaout.writerow(outrow)

if __name__ == '__main__':
    tt = Transformer()
    tt.process(sys.stdin, sys.stdout)
