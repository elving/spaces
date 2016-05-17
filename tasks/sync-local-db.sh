#!/bin/bash

mkdir ./dump
ssh root@joinspaces.co 'dokku mongo:export mongo_joinspaces' > ./dump/export.tar
tar -xf ./dump/export.tar -C ./dump
mongorestore -d spacesdb ./dump/mongo_joinspaces/ --drop
rm -rf ./dump
