#!/bin/bash

isLive=$(which ubiquity)

if [ -z $isLive ]; then
   # is installed

   ZED_FOLDER=~/.ZED
   if [ ! -d "$ZED_FOLDER" ]; then
      mkdir ~/.ZED
      mkdir ~/.ZED/smartDesktop
      cd Backend/SERVER/API/SYSTEM/SETTINGS/USER/
      php updateSettings.php
      cd ../../../../../../
   fi

   BRANCH_FILE=~/.ZED/.branch
   if [ -e "$BRANCH_FILE" ]
   then
      if ping -q -c 1 -W 1 8.8.8.8 >/dev/null; then
         git checkout "$(<$BRANCH_FILE)"
         rm $BRANCH_FILE
      fi
   fi

   changed=0
   git remote update && git status -uno | grep -q 'Your branch is behind' && changed=1
   if [ $changed = 1 ]; then
      cd updateInstaller
      npm start&
      cd ..
      git checkout .
      git pull
      cd Backend/SERVER/API/SYSTEM/SETTINGS/USER/
      php updateSettings.php
      cd ../../../../../../
      ./updateInstaller/postUpdate.sh
      cd Frontend
      npm install
      cd ..
      killall electron
      sleep 1
   fi

   if ping -q -c 1 -W 1 8.8.8.8 >/dev/null; then
      Xaxis=$(xrandr --current | grep '*' | uniq | awk '{print $1}' | cut -d 'x' -f1)
      Yaxis=$(xrandr --current | grep '*' | uniq | awk '{print $1}' | cut -d 'x' -f2)
      if [ ! -d "~/.ZED/onlineImage.jpg" ]; then
         wget https://picsum.photos/${Xaxis}/${Yaxis} -q -O ~/.ZED/onlineImage.jpg >/dev/null&
      fi
      if test `find "~/.ZED/onlineImage.jpg" -mmin +1440`; then
         wget https://picsum.photos/${Xaxis}/${Yaxis} -q -O ~/.ZED/onlineImage.jpg >/dev/null&
      fi
   fi

   cd Backend
   ./startBackend.sh&
   cd ..
   cd Frontend
   npm run electron&
   sleep 1
   npm start&
   cd Backend
   cd SERVER
   cd API
   cd APPS
   php updateApps.php
   sleep 10m
   while [ true ]
   do
      php updateApps.php
      sleep 30m
   done
else
   ubiquity
fi