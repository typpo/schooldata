#!/bin/bash

echo "Downloading..."

wget https://nces.ed.gov/ccd/Data/zip/sc132a_txt.zip -O publicschools_20132014.zip
unzip publicschools_20132014.zip

echo "Working..."

mv sc132a.txt publicschools_20132014.tsv

echo "Now you probably want to run ./run_process.sh"
echo "Done."
