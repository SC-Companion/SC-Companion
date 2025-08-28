const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // API URL
  getApiUrl: () => ipcRenderer.invoke('get-api-url'),
  
  // System info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Game logs
  getGameLogs: () => ipcRenderer.invoke('get-game-logs'),
  
  // Updates
  restartApp: () => ipcRenderer.invoke('restart-app'),
  
  // Menu events
  onShowAbout: (callback) => ipcRenderer.on('show-about', callback),
  onShowPreferences: (callback) => ipcRenderer.on('show-preferences', callback),
  
  // Update events
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateReady: (callback) => ipcRenderer.on('update-ready', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// Prevent new window creation
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});