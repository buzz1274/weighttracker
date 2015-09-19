#!/usr/bin/env bash

npm install
bower install --allow-root
ember build --environment production

