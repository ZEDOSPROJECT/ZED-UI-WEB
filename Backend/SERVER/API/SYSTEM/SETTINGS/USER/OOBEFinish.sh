#!/bin/bash

username=$1
password=$2

useradd -m $username -p $password
usermod -s /bin/bash $username
echo -e "${password}\n${password}\n" | passwd $username
cp -fr /home/zed /home/$username/
cp -a /home/zed/.config/{.,}* /home/$username/.config/
reboot