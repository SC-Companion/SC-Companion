import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SCCompanionClient } from '../lib/api';

export interface User {
  id: number;
  handle: string;
  displayName: string;
  email: string;
  bio?: string;
  location?: string;
  avatar?: string;
  rsi_handle?: string;
  rsi_geid?: string;
  role: string;
  xp: number;
  level: number;
  isActive: boolean;
  isPremium: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  client: SCCompanionClient;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeClient: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Fonction pour créer le client avec l'URL dynamique
const createApiClient = async (): Promise<SCCompanionClient> => {
  if (window.electronAPI?.getApiUrl) {
    try {
      const apiUrl = await window.electronAPI.getApiUrl();
      console.log('🔧 Utilisation de l\'API embarquée:', apiUrl);
      return new SCCompanionClient(apiUrl);
    } catch (error) {
      console.warn('⚠️ Impossible de récupérer l\'URL de l\'API embarquée, utilisation de localhost');
    }
  }
  
  // Fallback pour le développement
  console.log('🔧 Utilisation de l\'API localhost (dev mode)');
  return new SCCompanionClient('http://localhost:3001');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      client: new SCCompanionClient('http://localhost:3001'), // Sera remplacé lors de l'initialisation
      isLoading: false,
      error: null,

      initializeClient: async () => {
        const newClient = await createApiClient();
        set({ client: newClient });
      },

      login: async (email: string, password: string) => {
        const { client } = get();
        set({ isLoading: true, error: null });

        try {
          const response = await client.login({ email, password });
          const { user, token } = response;
          
          // Calculate level from XP
          const level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
          const userWithLevel = { ...user, level };
          
          client.setToken(token);
          set({ 
            user: userWithLevel, 
            token, 
            isLoading: false 
          });
        } catch (error: any) {
          const message = error.response?.data?.error || error.message || 'Erreur de connexion';
          set({ 
            error: message, 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (userData: any) => {
        const { client } = get();
        set({ isLoading: true, error: null });

        try {
          const response = await client.register(userData);
          const { user, token } = response;
          
          // Calculate level from XP
          const level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
          const userWithLevel = { ...user, level };
          
          client.setToken(token);
          set({ 
            user: userWithLevel, 
            token, 
            isLoading: false 
          });
        } catch (error: any) {
          const message = error.response?.data?.error || error.message || 'Erreur d\'inscription';
          set({ 
            error: message, 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        const { client } = get();
        client.clearToken();
        set({ 
          user: null, 
          token: null, 
          error: null 
        });
      },

      checkAuth: async () => {
        const { token, client } = get();
        if (!token) return;

        set({ isLoading: true });
        
        try {
          client.setToken(token);
          const response = await client.getMe();
          const { user } = response;
          
          // Calculate level from XP
          const level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
          const userWithLevel = { ...user, level };
          
          set({ 
            user: userWithLevel, 
            isLoading: false 
          });
        } catch (error) {
          // Token invalide, déconnecter l'utilisateur
          get().logout();
          set({ isLoading: false });
        }
      },

      updateUser: async (userData: Partial<User>) => {
        const { client, user } = get();
        if (!user) return;

        set({ isLoading: true, error: null });

        try {
          const response = await client.updateProfile(userData);
          const updatedUser = response.user;
          
          // Calculate level from XP
          const level = Math.floor(Math.sqrt(updatedUser.xp / 100)) + 1;
          const userWithLevel = { ...updatedUser, level };
          
          set({ 
            user: userWithLevel, 
            isLoading: false 
          });
        } catch (error: any) {
          const message = error.response?.data?.error || error.message || 'Erreur de mise à jour';
          set({ 
            error: message, 
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'sc-companion-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);