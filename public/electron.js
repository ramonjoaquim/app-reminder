const electron = require('electron');
const { autoUpdater } = require('electron-updater');
const { ipcMain, app, Menu, Tray, Notification, dialog, shell } = electron;
const { BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const operationanSystem = require('os');
const CronJob = require('cron').CronJob;

if (isDev) {
  global.PATH_DB = {value: 'src/db/reminder.db'};
} else {
  global.PATH_DB = {value: app.getPath('userData')+'/reminder.db'};
}

let mainWindow;
let appIcon = null;
let loadingScreen;
const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(
    Object.assign({
      /// define width and height for the window
      width: 200,
      height: 400,
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
  appIcon = new Tray(iconPath);

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
      enabled:false
    },
    {
      type:'separator'
    },
    {
      label: 'Quit app',
      click: () => {
        if (appIcon) {
          appIcon.destroy();
        }

        app.quit();
      }
    }]);

  appIcon.setToolTip('Reminder app')
  appIcon.setContextMenu(contextMenu);
  mainWindow.hide();
  showNotification('Running on background...');

  appIcon.on('click', () => {
    appIcon.destroy();
    mainWindow.show();
  });
});

ipcMain.on('remove-tray', () => {
  appIcon.destroy();
});

ipcMain.handle('window-is-trayed', async (event) => {
  if (appIcon != null) {
    return true;
  } else {
    return false;
  } 
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
  autoUpdater.quitAndInstall();
});

//App listeners
//app.on('ready', createWindow);

app.on('ready', () => {
  createLoadingScreen();
  setTimeout(() => {
    createWindow();
  }, 7000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (appIcon) appIcon.destroy()
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

//functions
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

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
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
    }, 5000);
    
  });

}

//crons
var setRemindersToDay = new CronJob('0 0 * * *',  function() {
   //chamar aqui toda meia noite os reminders do dia
  mainWindow.webContents.send("set-reminders-off-day", "");
}, null, true, 'America/Sao_Paulo');

var getShedule = new CronJob('* * * * *',  function() {
  //chamar aqui a cada minuto
 if (mainWindow) {
  mainWindow.webContents.send("get-schedule", "");
 }

}, null, true, 'America/Sao_Paulo');


setRemindersToDay.start();
getShedule.start();
