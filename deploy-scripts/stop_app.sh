#!/bin/bash
sudo service codedeploy-agent stop
rm -rf /opt/codedeploy-agent/deployment-root/*
sudo service codedeploy-agent start
pm2 stop PaymentsWeb
