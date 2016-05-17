#!/bin/bash

aws s3 sync ./build/public s3://prod.joinspaces.co/assets/ --acl public-read --profile spaces
