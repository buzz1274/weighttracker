#!/usr/bin/env bash

cd /var/www/weighttracker.zz50.co.uk
npm install
bower install --allow-root
ember build --environment production

