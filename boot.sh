#!/bin/bash

cd Backend
./startBackend.sh&
cd ..
if [ -e ".branch" ]
then
   if ping -q -c 1 -W 1 8.8.8.8 >/dev/null; then
      git checkout "$(<.branch)"
      rm .branch
   fi
fi

if ping -q -c 1 -W 1 8.8.8.8 >/dev/null; then
   cd updateInstaller
   npm start&
   cd ..
   git stash
   if ! git pull
   then
      git checkout Backend/SERVER/API/SYSTEM/SETTINGS/USER/SETTINGS.json
      git pull
   fi
   ./updateInstaller/postUpdate.sh
   git stash pop
   killall electron
fi
cd Frontend
npm install
npm run electron&
sleep 1
npm start&
cd Backend
cd SERVER
cd API
cd APPS
while [ true ]
do
	php updateApps.php
	sleep 30m
done