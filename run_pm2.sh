#!/bin/bash -e

NODE_ENV=production pm2 start categories_entry.js --name 'schoolscout'
