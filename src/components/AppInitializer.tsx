import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LoadingScreen } from './ui/LoadingScreen';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initializeClient } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🚀 Initialisation de l\'application...');
        
        // Attendre un peu que l'API Electron soit prête
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialiser le client API
        await initializeClient();
        
        console.log('✅ Application initialisée avec succès');
        setIsInitialized(true);
      } catch (err) {
        console.error('❌ Erreur lors de l\'initialisation:', err);
        setError('Erreur lors de l\'initialisation de l\'application');
        
        // Continuer quand même avec le client par défaut
        setTimeout(() => {
          setIsInitialized(true);
        }, 2000);
      }
    };

    initialize();
  }, [initializeClient]);

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-error text-lg">⚠️ {error}</div>
          <div className="text-sm text-base-content/70 mb-4">
            L'application va continuer à charger...
          </div>
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <LoadingScreen 
        message="Initialisation de SC Companion..."
        submessage="Démarrage du serveur API embarqué"
      />
    );
  }

  return <>{children}</>;
};