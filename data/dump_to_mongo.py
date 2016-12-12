#!/usr/bin/env python
# Usage: ./dump.py dbname collectionname foo/bar/baz.csv
import json
import os
import pandas as pd
import pymongo
import sys

def import_content(db, collection, filepath):
    print 'Dumping %s to %s:%s' % (filepath, db, collection)
    mng_client = pymongo.MongoClient('localhost', 27017)
    mng_db = mng_client[db]
    db_cm = mng_db[collection]
    cdir = os.path.dirname(__file__)
    file_res = os.path.join(cdir, filepath)

    data = pd.read_csv(file_res)
    data_json = json.loads(data.to_json(orient='records'))
    db_cm.remove()
    db_cm.insert(data_json)

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print 'Usage: dump.py dbname collectionname path/to/file.csv'
        sys.exit(1)
    import_content(sys.argv[1], sys.argv[2], sys.argv[3])
