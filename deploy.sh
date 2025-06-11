#!/bin/bash

cd /home/ubuntu/nextjs-crud
git pull origin main
npm install
npm run build
pm2 restart nextjs-crud || pm2 start npm --name "nextjs-crud" -- start