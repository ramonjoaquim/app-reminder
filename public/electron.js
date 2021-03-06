const electron = require('electron');
const { autoUpdater } = require('electron-updater');
const { ipcMain, app, Menu, Tray, Notification, dialog, shell } = electron;
const { BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const operationanSystem = require('os');
const CronJob = require('cron').CronJob;

isDev ? global.PATH_DB = {value: 'src/repository/reminder.db'} : global.PATH_DB = {value: app.getPath('userData')+'/reminder.db'};

global.tray = null;

let mainWindow;
let logWindow;
let loadingScreen;
const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(
    Object.assign({
      /// define width and height for the window
      width: 200,
      height: 250,
      /// remove the window frame, so it will become a frameless window
      frame: false,
      /// and set the transparency, to remove any window background color
      transparent: true
    })
  );
  loadingScreen.setResizable(false);
  loadingScreen.loadURL(
    'file://' + __dirname + '/loading/loading.html'
  );
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
};

//ipcMain listeners
ipcMain.on('put-in-tray', (event) => {
  const iconPath = path.join(__dirname, 'icon.png');

  if (global.tray != null && isLinux()) {
    mainWindow.hide();
    return;
  }

  global.tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Reminder App',
      enabled:false
    },
    {
      type:'separator'
    },
    {
      label: 'Check for updates...',
      enabled: false,
      click: () => {
        autoUpdater.checkForUpdatesAndNotify();
      }
    },
    {
      type:'separator'
    },
    {
      label: 'Show app',
      click: () => {
        if (global.tray) {
          if (!isLinux()) {
            global.tray.destroy();
          }
        }

        if (!global.tray.isDestroyed()) {
          if (!isLinux()) {
            global.tray.destroy();
          }
        }
        mainWindow.show();
      }
    },
    {
      label: 'Quit app',
      click: () => {
        if (global.tray) {
          if (!isLinux()) {
            global.tray.destroy();
          }
        }

        app.quit();
      }
    }]);

  global.tray.setToolTip('Reminder app')
  global.tray.setContextMenu(contextMenu);
  mainWindow.hide();
  showNotification('Running on background...');

  global.tray.on('click', () => {
    if (!isLinux()) {
      global.tray.destroy();
    }
    mainWindow.show();
  });
});

ipcMain.on('remove-tray', () => {
  if (!isLinux()) {
    global.tray.destroy();
  }
});

ipcMain.handle('window-is-trayed', async (_event) => {
    return global.tray != null;
});

ipcMain.on('maximise', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return; 
  }

  mainWindow.maximize();
});

ipcMain.on('minimise', () => {
  mainWindow.minimize();
});

ipcMain.on('notification', (_event, title, message) => {
  showNotification(title, message);
});

ipcMain.on('dialog-error', (event, message) => {
  const options = {
    type: 'error',
    title: 'Reminder validation',
    message: 'Ops, something wrong...',
    detail: message,
    icon: path.join(__dirname, './icon.png'),
    noLink:false,
    buttons: ['ok']
  }
  dialog.showMessageBoxSync(mainWindow, options, (index) => {
    event.sender.send('dialog-error', index)
  })
});

ipcMain.on('got-to-page', (_event, url) => {
  shell.openExternal(url);
});

ipcMain.on('restart_app', () => {
  const isSilent = true;
  const isForceRunAfter = true; 
  autoUpdater.quitAndInstall(isSilent, isForceRunAfter); 
});

ipcMain.on('check-updates', () => {
  autoUpdater.checkForUpdates();
  mainWindow.webContents.send('checking_updates');
})

ipcMain.on('force-set-reminders', () => {
  mainWindow.webContents.send('force_reminders');
  setTimeout(() => {
  mainWindow.webContents.send("set-reminders-off-day", true);
  }, 3000);

})

ipcMain.on('show-prompt', (_event, args) => {
  if (logWindow) return;
  windowLog(args);
  logWindow.once('ready-to-show', () => {
    logWindow.show();
  })
});

ipcMain.on('show-popUp', (_event, args) => {
  let data = {
    title: args.title,
    data: args.data
  };
  mainWindow.webContents.send('pop_up', data);
});

ipcMain.on('get-next-reminder', (_event) => {
  mainWindow.webContents.send("next-reminder");
});

ipcMain.on('close-log-window',() => {
  logWindow.close();
  logWindow = null;
})

//App listeners
app.on('ready', () => {
  createLoadingScreen();
  setTimeout(() => {
    createWindow();
  }, 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (!global.tray) return;
  if (isLinux()) return;
  global.tray.destroy();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('update_not_available');
});


//functions
function isLinux() {
  return !!(process.platform === 'linux');
}

function showNotification (title, message) {
  const notification = {
    title: title,
    body: message,
    icon: path.join(__dirname, './icon.png'),
    sound: path.join(__dirname, './sounds/notification-levi.mp3')
  }
  new Notification(notification).show();
}

function createWindow() {
  const iconPath = path.join(__dirname, 'icon.png');
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    frame: false,
    icon: iconPath,
    resizable: isDev ? true : false,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      enableRemoteModule: true
    },
    show: false
  });

  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.resolve(__dirname, '..', 'build', 'index.html')}`,
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  if (operationanSystem.platform() === "win32") {
    app.setAppUserModelId("Reminder app");
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    /// then close the loading screen window and show the main window
    if (loadingScreen) {
      loadingScreen.close();
    }
    mainWindow.show();
    setTimeout(() => {
      mainWindow.webContents.send("init-db");
      mainWindow.webContents.send("set-reminders-off-day", "");
    }, 3000);
    
  });

}

function windowLog(args) {
  const iconPath = path.join(__dirname, 'icon.png');
  logWindow = new BrowserWindow({
    title: args.title,
    titleBarStyle: 'hiddenInset',
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    frame: false,
    icon: iconPath,
    resizable: isDev ? true : false,
    fullscreen: false,
    parent: 'top', 
    modal: true, 
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      enableRemoteModule: true
    },
  });

  if (isDev) {
    logWindow.webContents.openDevTools();
  }

  logWindow.on('closed', () => {
    logWindow = null;
  });

  logWindow.setResizable(false);

  global.varsForWindow = {
    dataLog: args.data
  };
  logWindow.loadURL('file://' + __dirname + '/common/window/log.html');
}

//crons
var setRemindersToDay = new CronJob('0 */1 * * *',  () => {
   //Cron job every 1 hours.
  mainWindow.webContents.send("set-reminders-off-day", "");
}, null, true, 'America/Sao_Paulo');

var getShedule = new CronJob('* * * * *',  () => {
  //Cron job every minute.
  if (mainWindow) {
    mainWindow.webContents.send("get-schedule", "");
  }
  
}, null, true, 'America/Sao_Paulo');

var getUpdates = new CronJob('0 0 * * *',  () => {
  //Cron job every 1 hours.
 autoUpdater.checkForUpdates();
}, null, true, 'America/Sao_Paulo');


setRemindersToDay.start();
getShedule.start();
getUpdates.start();
