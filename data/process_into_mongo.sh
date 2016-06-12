#!/bin/bash

cat publicschools_20132014.tsv | ./process.py > processed_output.csv

mongoimport -d categories -c schools --type csv --file processed_output.csv --headerline
