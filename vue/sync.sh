#!/bin/sh
yarn build
aws s3 sync dist/ s3://vue-liaishizi/
