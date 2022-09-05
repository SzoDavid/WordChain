#!/bin/sh
if [ ! -e /app/output/DELETE_THIS_FILE_TO_DEPLOY_COMMANDS ]; then
    touch /app/output/DELETE_THIS_FILE_TO_DEPLOY_COMMANDS

    node /app/deploy-commands.js
fi

node /app/index.js
