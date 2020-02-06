#!/bin/bash

if [ -e ".branch" ]
then
   echo -e "GET http://google.com HTTP/1.0\n\n" | nc google.com 80 > /dev/null 2>&1
   if [ $? -eq 0 ]; then
      git checkout "$(<.branch)"
      rm .branch
   fi
fi

echo -e "GET http://google.com HTTP/1.0\n\n" | nc google.com 80 > /dev/null 2>&1

if [ $? -eq 0 ]; then
   git stash
   git pull
   git stash pop
fi
cd Backend
./startBackend.sh&
cd ..
cd Frontend
npm install
npm run electron&
sleep 1
npm start&
