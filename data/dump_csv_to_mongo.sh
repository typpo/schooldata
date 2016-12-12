#!/bin/bash
# Usage: ./dump mydata.csv

mongo school --eval "db.schools.drop()"
mongoimport -d schools -c schools --type csv --file $1 --headerline

echo 'Done.'
