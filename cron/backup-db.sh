#!/bin/bash

timestamp=$(date +%F-%H%S)

mkdir ./$timestamp
dokku mongo:export next > ./$timestamp/$timestamp.tar
aws s3 sync ./$timestamp s3://next.joinspaces.co/dumps/
rm -rf ./$timestamp
