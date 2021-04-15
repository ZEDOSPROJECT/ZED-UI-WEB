How to add services at boot

Use a crontab option to make your script run after reboot,

you can do it by adding @reboot code in cron

Open crontab by root user:

$ sudo crontab -e

Add the next record at the bottom:

@reboot yourScriptPath 

