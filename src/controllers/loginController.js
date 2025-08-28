const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const { BrowserWindow } = require("electron");

exports.renderLogin = async () => {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/login.ejs"),
      {
        title: "Login",
      }
    );

    // Obtenir la fenêtre principale et charger le HTML
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      mainWindow.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
      );
    } else {
      console.error("Aucune fenêtre principale trouvée");
    }
  } catch (error) {
    console.error("Erreur lors du rendu de la page de connexion:", error);
    throw error;
  }
};
