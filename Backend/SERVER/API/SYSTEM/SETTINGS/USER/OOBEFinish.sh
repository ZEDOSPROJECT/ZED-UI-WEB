#!/bin/bash

username=$1
password=$2

useradd -m ${username} -p ${password}
cp -f /home/zed/* /home/${username}/
pgrep -u zed
ps -fp $(pgrep -u zed)
killall -KILL -u zed
userdel -r zed