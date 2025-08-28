import { useState, useEffect } from 'react';
import { Bell, Search, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../ui/Button';

export const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [systemInfo, setSystemInfo] = useState<any>(null);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get system info if available (Electron)
    if (window.electronAPI) {
      window.electronAPI.getSystemInfo().then(setSystemInfo);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-base-200 border-b border-base-300 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={18} />
              <input
                type="text"
                placeholder="Rechercher des citoyens, posts..."
                className="input input-bordered pl-10 w-full bg-base-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm">
              Rechercher
            </Button>
          </form>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Connection status */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-2 text-success">
                <Wifi size={16} />
                <span className="text-sm">En ligne</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-error">
                <WifiOff size={16} />
                <span className="text-sm">Hors ligne</span>
              </div>
            )}
          </div>

          {/* System info (if Electron) */}
          {systemInfo && (
            <div className="text-xs text-base-content/50">
              v{systemInfo.version}
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <Bell size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};