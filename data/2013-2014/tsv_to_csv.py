#!/usr/bin/env python2.7

import sys
import csv

tabin = csv.reader(sys.stdin, dialect=csv.excel_tab)
commaout = csv.writer(sys.stdout, dialect=csv.excel)
for row in tabin:
  commaout.writerow(row)
