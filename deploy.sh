#!/usr/bin/env bash

# This script sends the configuration defined in
# ./functions.env file to the cloud function.

ENVIRONMENT_FILE_PATH="./functions.env"
COMMAND=""

# Check if the environment file is present and not empty
if [ -f $ENVIRONMENT_FILE_PATH ] && [ -s $ENVIRONMENT_FILE_PATH ];
then
     FILE_CONTENT="$(cat $ENVIRONMENT_FILE_PATH | sed 's/$/ /g')"
     COMMAND="firebase functions:config:set $FILE_CONTENT && "
fi

# Append the function deployment command
COMMAND=$COMMAND"firebase deploy --only functions"

# run the command
eval $COMMAND
