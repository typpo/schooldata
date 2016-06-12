#!/bin/bash

pushd `dirname $0`

cat publicschools_20132014.tsv | ./process.py > processed_output.csv
mongoimport -d categories -c schools --type csv --file processed_output.csv --headerline
rm processed_output.csv

popd
