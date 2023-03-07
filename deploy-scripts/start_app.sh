#!/bin/bash
cd /var/www/paymentsapp
rm -rf node_modules
npm install
pm2 start npm --name "PaymentsWeb" -- start
