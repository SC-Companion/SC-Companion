export interface ElectronAPI {
  getApiUrl: () => Promise<string>;
  getSystemInfo: () => Promise<{
    platform: string;
    arch: string;
    version: string;
    apiUrl: string;
  }>;
  getGameLogs: () => Promise<any[]>;
  restartApp: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  onShowAbout: (callback: () => void) => void;
  onShowPreferences: (callback: () => void) => void;
  on: (channel: string, callback: (...args: any[]) => void) => void;
  off: (channel: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};