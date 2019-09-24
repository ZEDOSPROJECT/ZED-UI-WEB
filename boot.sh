#!/bin/bash


if [ -f "branch" ]
then
   value="git checkout $(<.branch)"
   bash -c $value
fi
git stash
git pull
git stash pop
cd Backend
./startBackend.sh&
cd ..
cd Frontend
npm run electron&
sleep 1
npm start&
