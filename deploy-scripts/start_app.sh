#!/bin/bash
cd /var/www/paymentsapp
rm -rf node_modules
npm install
npm run start
