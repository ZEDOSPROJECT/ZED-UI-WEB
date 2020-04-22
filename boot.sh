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
   git stash
   git pull
   git stash pop
fi
cd Frontend
npm install
npm run electron&
sleep 1
npm start&
