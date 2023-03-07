#!/bin/bash
cd /var/www/paymentsapp
npm install
npm run build
pm2 start npm --name "next" -- start