// // Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('path');

var HID = require('node-hid');
HID.setDriverType('libusb');

const run = (async () => {
  const headset = await HID.devicesAsync(5426, 1324)

//   console.log(headset)

//   console.log(headset[0].path)

  const accessHeadset = new HID.HID( headset[0].path )

  console.log(accessHeadset)

  const getBatteryPercentage = (device) => {
    try {
        device.getFeatureReport(0x0409, 0x10)
        const report = device.readTimeout(1000)[2];
        if (parseInt(report) > 1)
            return report;
        return null;

    } catch (error) {
        console.log(error)
        throw new Error('Cannot write to Headset.');
    }
  }

  const copy = accessHeadset

  getBatteryPercentage(copy)
})


run()
const usb = require('usb');

usb.useUsbDkBackend()

let windows = [];

const webusb = new usb.WebUSB({
    allowAllDevices: true
});

const showDevices = async () => {
    const devices = await webusb.getDevices();
    const text = devices.map(d => `${d.vendorId}\t${d.productId}\t${d.serialNumber || '<no serial>'}`);
    text.unshift('VID\tPID\tSerial\n-------------------------------------');

    windows.forEach(win => {
        if (win) {
            win.webContents.send('devices', text.join('\n'));
        }
    });

    const headset = devices.find((device) => device?.productName === 'Razer Kraken V3 Pro')

    // https://github.com/Tekk-Know/RazerBatteryTaskbar/blob/main/src/main.js

    // console.log(headset)

    await headset.open()

    if (headset.configuration === null) {
        // Manually found via console logging headset and looking at configurationValue
        headset.selectConfiguration(1)
    }

    // console.log(headset.configuration.interfaces)

    await headset.claimInterface(3);

    // const request = await headset.controlTransferOut({
    //     requestType: 'class',
    //     recipient: 'interface',
    //     request: 0x09,
    //     value: 0x300,
    //     index: 0x00
    // }, 'test')

    // console.log(request)
};

const createWindow = () => {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // and load the index.html of the app.
    win.loadFile('index.html');

    // Open the DevTools.
    // win.webContents.openDevTools()

    windows.push(win);
    showDevices();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    webusb.addEventListener('connect', showDevices);
    webusb.addEventListener('disconnect', showDevices);

    createWindow();

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    webusb.removeEventListener('connect', showDevices);
    webusb.removeEventListener('disconnect', showDevices);

    app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
