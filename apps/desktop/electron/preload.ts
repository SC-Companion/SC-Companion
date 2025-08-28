import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // System info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getApiUrl: () => ipcRenderer.invoke('get-api-url'),

  // Game logs (future feature)
  getGameLogs: () => ipcRenderer.invoke('get-game-logs'),

  // Updates
  restartApp: () => ipcRenderer.invoke('restart-app'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  
  // Generic event listeners
  on: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, callback);
  },
  
  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.off(channel, callback);
  },
  
  // Legacy event listeners (pour compatibilité)
  onUpdateAvailable: (callback: () => void) => {
    ipcRenderer.on('update-available', callback);
  },
  
  onUpdateReady: (callback: () => void) => {
    ipcRenderer.on('update-ready', callback);
  },
  
  onShowAbout: (callback: () => void) => {
    ipcRenderer.on('show-about', callback);
  },
  
  onShowPreferences: (callback: () => void) => {
    ipcRenderer.on('show-preferences', callback);
  },

  // Cleanup
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      getSystemInfo: () => Promise<{
        platform: string;
        arch: string;
        version: string;
      }>;
      getGameLogs: () => Promise<any[]>;
      restartApp: () => Promise<void>;
      onUpdateAvailable: (callback: () => void) => void;
      onUpdateReady: (callback: () => void) => void;
      onShowAbout: (callback: () => void) => void;
      onShowPreferences: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}