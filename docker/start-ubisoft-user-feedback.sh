#!/usr/bin/env bash
#this script is meant to run inside the node docker

#give some time to mysql to warmup
sleep 15s


#run the app
cd /opt/user-feedback
echo "STARTING USER-FEEDBACK:"
npm run start


#stay awake doing nothing while node runs in background
tail -f /dev/null