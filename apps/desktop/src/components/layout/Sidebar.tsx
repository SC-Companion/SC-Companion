import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Home, 
  User, 
  Settings, 
  Users,
  TrendingUp,
  Shield,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';

const navigationItems = [
  { path: '/feed', label: 'Feed', icon: Home },
  { path: '/profile', label: 'Profil', icon: User },
  { path: '/leaderboard', label: 'Classement', icon: TrendingUp },
  { path: '/community', label: 'Communauté', icon: Users },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <div className="w-64 bg-base-200 border-r border-base-300 flex flex-col">
      {/* Logo & User info */}
      <div className="p-6 border-b border-base-300">
        <div className="sc-gradient w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <span className="text-xl font-bold text-white">SC</span>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{user.displayName}</h3>
          <p className="text-sm text-base-content/70">@{user.handle}</p>
          {user.rsi_handle && (
            <p className="text-xs text-primary">RSI: {user.rsi_handle}</p>
          )}
        </div>
        
        {/* Level & XP */}
        <div className="mt-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary font-medium">Niveau {user.level}</span>
            {user.isPremium && (
              <span className="badge badge-primary badge-xs">Premium</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/70 mt-1">
            <span>{user.xp.toLocaleString()} XP</span>
            {user.role !== 'user' && (
              <span className="badge badge-secondary badge-xs">{user.role}</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === '/profile' && location.pathname.startsWith('/profile'));
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive 
                      ? 'bg-primary text-primary-content shadow-lg' 
                      : 'text-base-content hover:bg-base-300'
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin panel (if admin/moderator) */}
      {(user.role === 'admin' || user.role === 'super_admin' || user.role === 'moderator') && (
        <div className="p-4 border-t border-base-300">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-warning hover:bg-base-300 transition-all duration-200"
          >
            <Shield size={20} />
            <span className="font-medium">Modération</span>
          </Link>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-base-300">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-base-300 transition-all duration-200 w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};