#!/bin/bash -e
echo "==========> Starting autopublish"
echo "is this a PR ? $IS_PULL_REQUEST"
if [ "$IS_PULL_REQUEST" != "true" ] ; then
  echo "calling autopublish module"
  ./node_modules/.bin/autopublish .
fi
echo "==========> End of autopublish"
