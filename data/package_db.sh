#!/bin/bash

mongodump -d schools -o schooldb
tar czvf schooldb.tar.gz schooldb/
rm -rf schooldb/
