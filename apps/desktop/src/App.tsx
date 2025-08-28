import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { FeedPage } from './pages/FeedPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AppInitializer } from './components/AppInitializer';
import { UpdateManager } from './components/UpdateManager';
import { useEffect, useState } from 'react';

function App() {
  return (
    <AppInitializer>
      <UpdateManager />
      <AppContent />
    </AppInitializer>
  );
}

function AppContent() {
  const { user, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initializeAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si l'utilisateur n'est pas connecté, afficher les pages d'auth
  if (!user) {
    return (
      <div className="min-h-screen bg-base-100">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<LoginPage />} />
        </Routes>
      </div>
    );
  }

  // Si l'utilisateur est connecté, afficher le dashboard
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile/:userId?" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;