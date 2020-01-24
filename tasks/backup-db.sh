#!/bin/bash

timestamp=$(date +%F-%H%S)
s3BucketFolder="s3://next.joinspaces.co/dumps/"

mkdir ./$timestamp
ssh root@joinspaces.co 'dokku mongo:export next > export.tar'
ssh root@joinspaces.co 'cat export.tar' > ./$timestamp/$timestamp.tar
ssh root@joinspaces.co 'rm -rf export.tar'
aws s3 sync ./$timestamp s3://next.joinspaces.co/dumps/ --profile spaces
rm -rf ./$timestamp
