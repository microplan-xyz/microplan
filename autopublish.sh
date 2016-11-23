#!/bin/bash -e
echo "==========> Starting autopublish"
echo "is pr $IS_PULL_REQUEST"
if [ "$IS_PULL_REQUEST" == "true" ] ; then
  ./node_modules/.bin/autopublish .
fi
echo "==========> End of autopublish"
