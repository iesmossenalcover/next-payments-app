#!/bin/bash
cd /var/www/paymentsapp
npm install
npm run build
systemctl enable paymentsapp.service
systemctl start paymentsapp.service