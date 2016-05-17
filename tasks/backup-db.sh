#!/bin/bash

timestamp=$(date +%F-%H%S)
s3BucketFolder="s3://prod.joinspaces.co/backups/production/"

mkdir ./$timestamp
ssh root@joinspaces.co 'dokku mongo:export mongo_joinspaces > export.tar'
ssh root@joinspaces.co 'cat export.tar' > ./$timestamp/$timestamp.tar
ssh root@joinspaces.co 'rm -rf export.tar'
aws s3 sync ./$timestamp s3://prod.joinspaces.co/backups/production/ --profile spaces
rm -rf ./$timestamp
