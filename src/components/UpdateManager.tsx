import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

interface UpdateManagerProps {
  className?: string;
}

type UpdateState = 'checking' | 'available' | 'downloading' | 'ready' | 'none';

export const UpdateManager: React.FC<UpdateManagerProps> = ({ className }) => {
  const [updateState, setUpdateState] = useState<UpdateState>('none');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Écouter les événements d'update depuis le main process
    const handleUpdateAvailable = () => setUpdateState('available');
    const handleUpdateDownloading = (event: any, progressInfo: any) => {
      setUpdateState('downloading');
      setProgress(Math.round(progressInfo.percent));
    };
    const handleUpdateReady = () => setUpdateState('ready');

    window.electronAPI?.on('update-available', handleUpdateAvailable);
    window.electronAPI?.on('update-downloading', handleUpdateDownloading);
    window.electronAPI?.on('update-ready', handleUpdateReady);

    return () => {
      window.electronAPI?.off('update-available', handleUpdateAvailable);
      window.electronAPI?.off('update-downloading', handleUpdateDownloading);
      window.electronAPI?.off('update-ready', handleUpdateReady);
    };
  }, []);

  const handleRestartAndUpdate = () => {
    window.electronAPI?.restartApp();
  };

  const handleDownloadUpdate = () => {
    setUpdateState('downloading');
    window.electronAPI?.downloadUpdate();
  };

  if (updateState === 'none') return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white px-4 py-2 ${className}`}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          {updateState === 'available' && (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Une nouvelle mise à jour est disponible !
              </span>
            </>
          )}
          
          {updateState === 'downloading' && (
            <>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Téléchargement en cours... {progress}%
              </span>
              <div className="w-32 bg-blue-800 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </>
          )}
          
          {updateState === 'ready' && (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">
                Mise à jour prête ! Redémarrez pour appliquer les changements.
              </span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {updateState === 'available' && (
            <Button
              onClick={handleDownloadUpdate}
              size="sm"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Télécharger
            </Button>
          )}
          
          {updateState === 'ready' && (
            <Button
              onClick={handleRestartAndUpdate}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white font-medium"
            >
              Redémarrer et mettre à jour
            </Button>
          )}
          
          {updateState !== 'downloading' && (
            <button
              onClick={() => setUpdateState('none')}
              className="text-white/70 hover:text-white text-xs px-2 py-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};