const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const auth = require("./src/controllers/authController");
const login = require("./src/controllers/loginController");
const dashboard = require("./src/controllers/dashboardController");

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    // titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#1a202c",
    },
    backgroundColor: "#1a202c",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      devTools: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  try {
    if (auth.isLoggedIn()) {
      const user = auth.getUser();
      await dashboard.renderDashboard(user);
    } else {
      await login.renderLogin();
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application:", error);
    // En cas d'erreur, afficher la page de connexion par défaut
    await login.renderLogin();
  }

  ipcMain.on("login", async (event, user) => {
    try {
      auth.login(user);
      await dashboard.renderDashboard(user);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      // En cas d'erreur, rester sur la page de connexion
      await login.renderLogin();
    }
  });

  // Gestion de la déconnexion
  ipcMain.on("logout", async () => {
    try {
      auth.logout();
      await login.renderLogin();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  });

  // Window control handlers
  ipcMain.on("window-minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.on("window-maximize", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("window-close", () => {
    mainWindow.close();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
