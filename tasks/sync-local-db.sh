#!/bin/bash

mkdir ./dump
ssh root@joinspaces.co 'dokku mongo:export next' > ./dump/export.tar
tar -xf ./dump/export.tar -C ./dump
mongorestore -d spaces ./dump/next/ --drop
rm -rf ./dump
