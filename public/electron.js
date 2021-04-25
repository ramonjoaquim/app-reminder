const electron = require('electron');

const { ipcMain, app, Menu, Tray, Notification } = electron;
const { BrowserWindow } = electron;

const path = require('path');
const isDev = require('electron-is-dev');
const operationanSystem = require('os');

const {sqlite3} = require('sqlite3');
const Promise = require('bluebird');

//my variables

//
let mainWindow;

let appIcon = null

ipcMain.on('put-in-tray', (event) => {
  const iconPath = path.join(__dirname, 'icon.png');
  appIcon = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Reminder',
    submenu: [
      {
        label: 'Show App',
        click: () => {
          appIcon.destroy();
          mainWindow.show();
        }
      },
      {
        label: 'Quit app',
        click: () => {
          if (appIcon) {
            appIcon.destroy();
          }

          app.quit();
        }
      }
    ]
    
  }]);

  appIcon.setToolTip('Reminder app')
  appIcon.setContextMenu(contextMenu);
  mainWindow.hide();
  showNotification('Running on background...');
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

app.on('window-all-closed', () => {
  if (appIcon) appIcon.destroy()
});

ipcMain.on('notification', (_event, title, message) => {
  showNotification(title, message);
});

function showNotification (title, message) {
  const notification = {
    title: title,
    body: message,
    icon: path.join(__dirname, './icon.png')
  }
  new Notification(notification).show();
}


function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 800,
    height: 600,
    minHeight:600,
    minWidth:800,
    frame:false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
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
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
