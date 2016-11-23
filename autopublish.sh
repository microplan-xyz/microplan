#!/bin/bash -e
echo "==========> Starting autopublish"
echo "is this a PR ? $IS_PULL_REQUEST"
if [ "$IS_PULL_REQUEST" != "true" ] ; then
  echo "configure npm with token"
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
  echo "calling autopublish module"
  ./node_modules/.bin/autopublish .
fi
echo "==========> End of autopublish"
