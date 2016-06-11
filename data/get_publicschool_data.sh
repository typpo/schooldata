#!/bin/bash

echo "Downloading..."

wget https://nces.ed.gov/ccd/Data/zip/sc132a_txt.zip -O publicschools_20132014.zip
unzip publicschools_20132014.zip

echo "Working..."

mv sc132a.txt publicschools_20132014.tsv
cat publicschools_20132014.tsv | ./tsv_to_csv.py > publicschools_20132014.csv

echo "Wrote publicschools_20132014.csv"
echo "Done."
