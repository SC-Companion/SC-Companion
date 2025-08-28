import { app, BrowserWindow, Menu, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import fs from 'fs';
import { EmbeddedServer } from './embedded-server';

// Configuration
const isDev = process.env.NODE_ENV === 'development';
const isWin = process.platform === 'win32';

class SCCompanionApp {
  private mainWindow: BrowserWindow | null = null;
  private embeddedServer: EmbeddedServer;
  private serverPort: number = 0;

  constructor() {
    this.embeddedServer = new EmbeddedServer();
    this.setupApp();
  }

  private setupApp(): void {
    // App event handlers
    app.whenReady().then(async () => {
      try {
        // Démarrer le serveur embarqué
        this.serverPort = await this.embeddedServer.start();
        console.log(`✅ Serveur API embarqué démarré sur le port ${this.serverPort}`);
        
        await this.createMainWindow();
        this.setupMenu();
        this.setupAutoUpdater();
        this.setupIPC();
      } catch (error) {
        console.error('❌ Erreur lors du démarrage:', error);
      }
    });

    app.on('window-all-closed', async () => {
      // Arrêter le serveur embarqué
      await this.embeddedServer.stop();
      
      if (!isWin) {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    // Security
    app.on('web-contents-created', (_, contents) => {
      contents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
      });
    });
  }

  private async createMainWindow(): Promise<void> {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 900,
      minHeight: 600,
      // icon: path.join(__dirname, '../../public/icon.png'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: !isDev, // Désactiver seulement en dev
      },
      titleBarStyle: 'default',
      show: false, // Show when ready to prevent visual flash
    });

    // Load the app
    const startUrl = isDev 
      ? 'http://localhost:5173' 
      : `file://${path.join(__dirname, '../web/index.html')}`;
    
    this.mainWindow.loadURL(startUrl);

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      
      // Ouvrir les DevTools pour déboguer (temporaire)
      this.mainWindow?.webContents.openDevTools();
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Handle external links
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });
  }

  private setupMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'SC Companion',
        submenu: [
          {
            label: 'About SC Companion',
            click: () => {
              this.mainWindow?.webContents.send('show-about');
            }
          },
          { type: 'separator' },
          {
            label: 'Preferences',
            accelerator: 'CmdOrCtrl+,',
            click: () => {
              this.mainWindow?.webContents.send('show-preferences');
            }
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: isWin ? 'Ctrl+Q' : 'CmdOrCtrl+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' }
        ]
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
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'SC Companion Documentation',
            click: () => {
              shell.openExternal('https://github.com/sc-companion/docs');
            }
          },
          {
            label: 'Report Issue',
            click: () => {
              shell.openExternal('https://github.com/sc-companion/issues');
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private setupAutoUpdater(): void {
    if (!isDev) {
      // Configuration de l'auto-updater
      autoUpdater.autoDownload = false; // Ne pas télécharger automatiquement
      autoUpdater.autoInstallOnAppQuit = true;
      
      // Vérifier les mises à jour au démarrage
      autoUpdater.checkForUpdatesAndNotify();
      
      // Événements d'auto-updater
      autoUpdater.on('checking-for-update', () => {
        console.log('🔍 Vérification des mises à jour...');
      });

      autoUpdater.on('update-available', (info) => {
        console.log('✨ Mise à jour disponible:', info.version);
        this.mainWindow?.webContents.send('update-available', info);
      });

      autoUpdater.on('update-not-available', () => {
        console.log('✅ Application à jour');
      });

      autoUpdater.on('error', (error) => {
        console.error('❌ Erreur lors de la mise à jour:', error);
        this.mainWindow?.webContents.send('update-error', error.message);
      });

      autoUpdater.on('download-progress', (progressInfo) => {
        console.log(`📥 Téléchargement: ${Math.round(progressInfo.percent)}%`);
        this.mainWindow?.webContents.send('update-downloading', progressInfo);
      });

      autoUpdater.on('update-downloaded', (info) => {
        console.log('✅ Mise à jour téléchargée:', info.version);
        this.mainWindow?.webContents.send('update-ready', info);
      });
    }
  }

  private setupIPC(): void {
    // API Server URL
    ipcMain.handle('get-api-url', async () => {
      return this.embeddedServer.getBaseUrl();
    });

    // Game log monitoring (future feature)
    ipcMain.handle('get-game-logs', async () => {
      // TODO: Implement game log parsing
      return [];
    });

    // System info
    ipcMain.handle('get-system-info', async () => {
      return {
        platform: process.platform,
        arch: process.arch,
        version: app.getVersion(),
        apiUrl: this.embeddedServer.getBaseUrl(),
      };
    });

    // Update handlers
    ipcMain.handle('restart-app', async () => {
      if (!isDev) {
        autoUpdater.quitAndInstall();
      }
    });

    ipcMain.handle('download-update', async () => {
      if (!isDev) {
        try {
          await autoUpdater.downloadUpdate();
        } catch (error) {
          console.error('Erreur lors du téléchargement:', error);
          throw error;
        }
      }
    });
  }
}

// Initialize app
new SCCompanionApp();