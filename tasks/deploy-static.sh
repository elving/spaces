#!/bin/bash

aws s3 sync ./build/public s3://assets.joinspaces.co/static/ --acl public-read --profile spaces
