#!/bin/bash

tar xzvf schooldb.tar.gz
mongorestore schooldb

echo "Delete schooldb/ ?"
read foo

rm -rf schooldb/
