#!/bin/bash

username=$1
password=$2


usermod -m -d /home/${username} zed
echo "${password}" | passwd --stdin zed
usermod --login ${username} zed
reboot