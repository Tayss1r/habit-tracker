const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let loginWindow = null;
let dashboardWindow = null;

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 500,
    height: 700,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  loginWindow.loadFile("renderer/login.html");
  // loginWindow.webContents.openDevTools();

  loginWindow.on("closed", () => {
    loginWindow = null;
  });
}

function createDashboardWindow() {
  // Close login window if it exists
  if (loginWindow) {
    loginWindow.close();
    loginWindow = null;
  }

  dashboardWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  dashboardWindow.loadFile("renderer/dashboard.html");
  // dashboardWindow.webContents.openDevTools();

  dashboardWindow.on("closed", () => {
    dashboardWindow = null;
  });
}

function createAdminDashboardWindow() {
  // Close login window if it exists
  if (loginWindow) {
    loginWindow.close();
    loginWindow = null;
  }

  dashboardWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  dashboardWindow.loadFile("renderer/admin-dashboard.html");

  dashboardWindow.on("closed", () => {
    dashboardWindow = null;
  });
}

// IPC handlers
ipcMain.on("open-dashboard", () => {
  createDashboardWindow();
});

ipcMain.on("open-admin-dashboard", () => {
  createAdminDashboardWindow();
});

ipcMain.on("logout", () => {
  if (dashboardWindow) {
    dashboardWindow.close();
    dashboardWindow = null;
  }
  createLoginWindow();
});

ipcMain.on("close-current", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});

app.whenReady().then(createLoginWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createLoginWindow();
  }
});
