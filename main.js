const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    title: "彩色氣球派對 🎈",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 隱藏選單列，讓遊戲畫面更乾淨
  win.setMenuBarVisibility(false);

  // 載入遊戲的 HTML 檔案
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
