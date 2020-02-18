#!/bin/bash

sleep 1

username=$1
password=$2

useradd -m $username -p $password
usermod -s /bin/bash $username
echo -e "${password}\n${password}\n" | passwd
cp -fr /home/zed/* /home/$username/
reboot