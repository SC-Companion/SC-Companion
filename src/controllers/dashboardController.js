const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const { BrowserWindow } = require("electron");

exports.renderDashboard = async (user) => {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/dashboard.ejs"),
      {
        title: "Dashboard",
        user: user || { username: "Utilisateur", id: Date.now() },
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
    console.error("Erreur lors du rendu du dashboard:", error);
    throw error;
  }
};
