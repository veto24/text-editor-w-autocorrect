const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron');
const fs = require('fs');

const path = require('path'),
  isDev = require('electron-is-dev');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 320,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  const appUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.loadURL(appUrl);

  const isMac = process.platform === 'darwin';

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          click() {
            openFile();
          },
        },
        {
          label: 'Save As',
          accelerator: 'CmdOrCtrl+S',
          click() {
            saveFile();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
              },
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' },
            ]
          : [{ role: 'close' }]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.maximize();
  mainWindow.setFullScreen(false);
  mainWindow.on('closed', () => (mainWindow = null));
};

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

function openFile() {
  const files = dialog.showOpenDialogSync(mainWindow, {
    title: 'Select file to open',
    properties: ['openFile'],
    filters: [{ name: 'Text', extensions: ['txt'] }],
  });

  if (!files) return;
  const file = files[0];
  const fileContent = fs.readFileSync(file).toString();
  mainWindow.webContents.send('open-file-data', fileContent);
}

function saveFile() {
  mainWindow.webContents.send('save-file-request');
}

ipcMain.on('save-file-contents', (event, content) => {
  const file = dialog.showSaveDialogSync(mainWindow, {
    title: 'Select file path to save',
    defaultPath: path.join(__dirname, '../.txt'),
    buttonLabel: 'Save',
    filters: [{ name: 'Text', extensions: ['txt'] }],
  });

  if (file) {
    fs.writeFile(file, content, (err) => {
      if (err) throw err;
    });
  }
});
