#!/bin/bash

# Variables
LOCAL_BACKEND_DIR="backend"
REMOTE_USER="jamesgitere"
REMOTE_HOST="178.128.43.230"
REMOTE_DIR="~/recipe-genius"

# Sync the backend folder to the remote server
rsync -avz --delete -e ssh "$LOCAL_BACKEND_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

echo "Backend folder has been successfully deployed to $REMOTE_HOST."
