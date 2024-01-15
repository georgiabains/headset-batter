# [Archive] Headset battery
Attempt to access headset battery information.

Fork of [Example Electron application for node-usb](https://github.com/node-usb/node-usb-example-electron) by [@thegecko](https://github.com/thegecko).


Update: 15/01/2024
I wasn't going to push the changes that I made as I ran into a pretty major blocker that stalled all progress, but maybe it'll help someone else!

I was trying to access the battery information from my Razer Kraken v3 Pro, because the low battery 'beep' played every 5s as soon as the low battery threshold was met, and I could not handle that. I wanted to create a visual percentage indicator (eventually displayed in the taskbar tray, or cast to an external screen/device) so that I could start charging it before the beeps.

Unfortunately, this Razer device is a HID USB which isn't compatible with `node-usb`. While there are ways to change these drivers, I didn't want to break my headset so decided against it! I did try to use `node-hid`, but unfortunately ran into errors when attempting to read more than its basic information (name, VID, PID).
