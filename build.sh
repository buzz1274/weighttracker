#!/usr/bin/env bash

DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"

cd "$DIR/api"
composer install
cd "$DIR"
npm install
bower install --allow-root
ember build --environment production

