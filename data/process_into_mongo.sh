#!/bin/bash -e

pushd `dirname $0`

cat publicschools_20132014.tsv | ./transform.py > processed_output.csv
mongoimport -d categories -c schools --type csv --file processed_output.csv --headerline
rm processed_output.csv

popd
