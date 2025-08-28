import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

interface UpdateManagerProps {
  className?: string;
}

interface UpdateInfo {
  version?: string;
  releaseNotes?: string;
  releaseName?: string;
  releaseDate?: string;
}

type UpdateState = 'checking' | 'available' | 'downloading' | 'ready' | 'none';

export const UpdateManager: React.FC<UpdateManagerProps> = ({ className }) => {
  const [updateState, setUpdateState] = useState<UpdateState>('none');
  const [progress, setProgress] = useState(0);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({});
  const [showChangelog, setShowChangelog] = useState(false);

  useEffect(() => {
    // Écouter les événements d'update depuis le main process
    const handleUpdateAvailable = (event: any, info: any) => {
      setUpdateState('available');
      setUpdateInfo({
        version: info.version,
        releaseNotes: info.releaseNotes,
        releaseName: info.releaseName,
        releaseDate: info.releaseDate
      });
    };
    const handleUpdateDownloading = (event: any, progressInfo: any) => {
      setUpdateState('downloading');
      setProgress(Math.round(progressInfo.percent));
    };
    const handleUpdateReady = (event: any, info: any) => {
      setUpdateState('ready');
      setUpdateInfo(prev => ({ ...prev, ...info }));
    };

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
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white px-4 py-2 ${className}`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            {updateState === 'available' && (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {updateInfo.version ? `SC Companion ${updateInfo.version} disponible !` : 'Une nouvelle mise à jour est disponible !'}
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
                  {updateInfo.version ? `SC Companion ${updateInfo.version} prêt !` : 'Mise à jour prête !'} Redémarrez pour appliquer.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {(updateState === 'available' || updateState === 'ready') && updateInfo.releaseNotes && (
              <button
                onClick={() => setShowChangelog(!showChangelog)}
                className="text-white/80 hover:text-white text-xs px-2 py-1 border border-white/20 rounded hover:bg-white/10"
              >
                {showChangelog ? 'Masquer' : 'Notes de version'}
              </button>
            )}
            
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

      {/* Changelog Modal */}
      {showChangelog && updateInfo.releaseNotes && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white">
              <h3 className="font-semibold text-lg">
                🎉 Nouveautés v{updateInfo.version}
              </h3>
              <button
                onClick={() => setShowChangelog(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: updateInfo.releaseNotes.replace(/\n/g, '<br>') }}
              />
            </div>
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <Button
                onClick={() => setShowChangelog(false)}
                size="sm"
                className="mr-2"
                variant="outline"
              >
                Fermer
              </Button>
              {updateState === 'available' && (
                <Button
                  onClick={() => {
                    setShowChangelog(false);
                    handleDownloadUpdate();
                  }}
                  size="sm"
                >
                  Télécharger maintenant
                </Button>
              )}
              {updateState === 'ready' && (
                <Button
                  onClick={() => {
                    setShowChangelog(false);
                    handleRestartAndUpdate();
                  }}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  Redémarrer et mettre à jour
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};