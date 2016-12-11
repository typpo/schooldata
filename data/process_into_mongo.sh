#!/bin/bash -e

echo 'Processing output to processed_output.csv...'
pushd `dirname $0`
cat publicschools_20132014.tsv | ./transform.py > processed_output.csv

echo 'Dumping into mongo...'
mongo categories --eval "db.schools.drop()"
mongoimport -d schools -c schools --type csv --file processed_output.csv --headerline

echo 'Cleaning up...'
rm processed_output.csv

popd

echo 'Done.'
