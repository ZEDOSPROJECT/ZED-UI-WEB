#!/bin/bash

if [ -e ".branch" ]
then
   git checkout "$(<.branch)"
   rm .branch
fi
git stash
git pull
git stash pop
cd Backend
./startBackend.sh&
cd ..
cd Frontend
npm install
npm run electron&
sleep 1
npm start&
