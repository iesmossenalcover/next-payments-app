#!/bin/bash
cd /var/www/paymentsapp
npm install
systemctl enable paymentsapp.service
systemctl start paymentsapp.service