#!/bin/bash

cd Backend
./startBackend.sh&
cd ..
cd Frontend
npm run electron&
sleep 1
npm start&
