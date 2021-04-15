#!/bin/bash
while [ True ]
do
	FILE=/var/tmp/shutdown
    if test -f "$FILE"; then
        shutdown -h now
    fi

    FILE=/var/tmp/reset
    if test -f "$FILE"; then
        shutdown -r now
    fi

    sleep 1
done