#!/bin/bash

username=$1
password=$2

useradd -m $username -p $password -U
usermod -s /bin/bash $username
echo -e "${password}\n${password}\n" | passwd $username
cp -a /home/zed/Desktop /home/$username/Desktop
cp -a /home/zed/Documents /home/$username/Documents
cp -a /home/zed/Downloads /home/$username/Downloads
cp -a /home/zed/Music /home/$username/Music
cp -a /home/zed/Pictures /home/$username/Pictures
cp -a /home/zed/Public /home/$username/Public
cp -a /home/zed/Templates /home/$username/Templates
cp -a /home/zed/Videos /home/$username/Videos
cp -a /home/zed/ZED-UI-WEB /home/$username/ZED-UI-WEB
chown -R $username:$username /home/$username/
cp /home/zed/.config/openbox/autostart /etc/xdg/openbox/autostart
reboot