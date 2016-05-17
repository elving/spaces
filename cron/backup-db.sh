#!/bin/bash

timestamp=$(date +%F-%H%S)

mkdir ./$timestamp
dokku mongo:export mongo_joinspaces > ./$timestamp/$timestamp.tar
aws s3 sync ./$timestamp s3://prod.joinspaces.co/backups/production/
rm -rf ./$timestamp
