import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { app as electronApp } from 'electron';

// Types pour les routes de base
interface User {
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

interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export class EmbeddedServer {
  private app: express.Application;
  private server: any;
  private port: number = 0; // Port dynamique
  private users: Map<string, any> = new Map(); // Base de données en mémoire

  constructor() {
    this.app = express();
    this.initializeUsers();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private initializeUsers() {
    // Initialiser avec les utilisateurs de démonstration
    this.users.set('demo@sc-companion.com', {
      id: 1,
      handle: 'demo_user',
      displayName: 'Demo User',
      email: 'demo@sc-companion.com',
      password: 'demo123',
      bio: 'Utilisateur de démonstration SC Companion',
      location: 'Stanton System',
      avatar: undefined,
      rsi_handle: 'DemoUser',
      rsi_geid: 'GEID_Demo_12345',
      role: 'user',
      xp: 1500,
      level: Math.floor(Math.sqrt(1500 / 100)) + 1,
      isActive: true,
      isPremium: false,
      isBanned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    this.users.set('admin@demo.com', {
      id: 2,
      handle: 'admin_demo',
      displayName: 'Admin Demo',
      email: 'admin@demo.com',
      password: 'admin123',
      bio: 'Administrateur de démonstration',
      location: 'Terra System',
      avatar: undefined,
      rsi_handle: 'AdminDemo',
      rsi_geid: 'GEID_Admin_67890',
      role: 'admin',
      xp: 5000,
      level: Math.floor(Math.sqrt(5000 / 100)) + 1,
      isActive: true,
      isPremium: true,
      isBanned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  private setupMiddleware() {
    // Sécurité basique
    this.app.use(helmet({ crossOriginEmbedderPolicy: false }));
    
    // CORS permissif pour Electron
    this.app.use(cors({
      origin: true,
      credentials: true
    }));

    // Parsing JSON
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private setupRoutes() {
    // Route de santé
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: electronApp.getVersion()
      });
    });

    // Routes utilisateur de base
    this.app.post('/api/users/login', (req, res) => {
      const { email, password } = req.body;
      console.log('🔐 Tentative de connexion:', { email, password: '***' });

      const user = this.users.get(email);
      
      if (user && user.password === password) {
        console.log('✅ Connexion réussie pour:', user.displayName);
        
        // Créer une copie sans le mot de passe
        const userResponse = { ...user };
        delete userResponse.password;
        
        const response: LoginResponse = {
          message: 'Connexion réussie',
          user: userResponse,
          token: 'demo-jwt-token-' + Date.now()
        };

        res.json(response);
      } else {
        console.log('❌ Identifiants invalides pour:', email);
        res.status(401).json({ error: 'Identifiants invalides' });
      }
    });

    this.app.post('/api/users/register', (req, res) => {
      const { handle, displayName, email, password, bio, location, rsi_handle } = req.body;
      console.log('📝 Tentative d\'inscription:', { handle, displayName, email });

      // Vérifier si l'utilisateur existe déjà
      if (this.users.has(email)) {
        console.log('❌ Email déjà utilisé:', email);
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      // Vérifier si le handle existe déjà
      const existingHandle = Array.from(this.users.values()).find(u => u.handle === handle);
      if (existingHandle) {
        console.log('❌ Handle déjà utilisé:', handle);
        return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
      }

      // Créer le nouvel utilisateur
      const newUser = {
        id: Date.now(),
        handle,
        displayName,
        email,
        password,
        bio: bio || '',
        location: location || '',
        avatar: undefined,
        rsi_handle: rsi_handle || '',
        rsi_geid: '',
        role: 'user',
        xp: 0,
        level: 1,
        isActive: true,
        isPremium: false,
        isBanned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Ajouter à notre "base de données"
      this.users.set(email, newUser);
      console.log('✅ Nouveau compte créé pour:', displayName);

      // Créer une copie sans le mot de passe
      const userResponse = { ...newUser };
      delete userResponse.password;

      const response: LoginResponse = {
        message: 'Inscription réussie',
        user: userResponse,
        token: 'demo-jwt-token-' + Date.now()
      };

      res.json(response);
    });

    this.app.get('/api/users/me', (req, res) => {
      // Retourner l'utilisateur demo par défaut
      const user: User = {
        id: 1,
        handle: 'demo_user',
        displayName: 'Demo User',
        email: 'demo@sc-companion.com',
        bio: 'Utilisateur de démonstration SC Companion',
        location: 'Stanton System',
        avatar: undefined,
        rsi_handle: 'DemoUser',
        rsi_geid: 'GEID_Demo_12345',
        role: 'user',
        xp: 1500,
        level: Math.floor(Math.sqrt(1500 / 100)) + 1,
        isActive: true,
        isPremium: false,
        isBanned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.json({ user });
    });

    this.app.put('/api/users/profile', (req, res) => {
      // Simulation de mise à jour de profil
      const updates = req.body;
      
      const user: User = {
        id: 1,
        handle: 'demo_user',
        displayName: updates.displayName || 'Demo User',
        email: 'demo@sc-companion.com',
        bio: updates.bio || 'Utilisateur de démonstration SC Companion',
        location: updates.location || 'Stanton System',
        avatar: undefined,
        rsi_handle: updates.rsi_handle || 'DemoUser',
        rsi_geid: 'GEID_Demo_12345',
        role: 'user',
        xp: 1500,
        level: Math.floor(Math.sqrt(1500 / 100)) + 1,
        isActive: true,
        isPremium: false,
        isBanned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.json({ user, message: 'Profil mis à jour avec succès' });
    });

    // Mock posts routes
    this.app.get('/api/posts/feed', (req, res) => {
      const mockPosts = [
        {
          id: 1,
          user: {
            id: 1,
            handle: 'demo_user',
            displayName: 'Demo User',
            avatar: undefined,
            level: 4,
            isPremium: false,
            rsi_handle: 'DemoUser'
          },
          content: 'Bienvenue dans SC Companion ! Cette application fonctionne maintenant de manière autonome.',
          likesCount: 5,
          createdAt: new Date().toISOString(),
          isLiked: false
        },
        {
          id: 2,
          user: {
            id: 2,
            handle: 'system',
            displayName: 'SC Companion',
            avatar: undefined,
            level: 10,
            isPremium: true,
            rsi_handle: 'SCCompanion'
          },
          content: 'Fonctionnalités disponibles : Feed social, gestion de profil, et plus encore à venir !',
          likesCount: 12,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isLiked: true
        }
      ];

      res.json({
        posts: mockPosts,
        hasMore: false,
        nextCursor: null
      });
    });

    this.app.post('/api/posts', (req, res) => {
      const { content } = req.body;
      
      const post = {
        id: Date.now(),
        user: {
          id: 1,
          handle: 'demo_user',
          displayName: 'Demo User',
          avatar: undefined,
          level: 4,
          isPremium: false,
          rsi_handle: 'DemoUser'
        },
        content,
        likesCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false
      };

      res.json({ post, message: 'Post créé avec succès' });
    });
  }

  async start(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(0, '127.0.0.1', () => {
        this.port = this.server.address()?.port || 0;
        console.log(`🚀 Embedded API server running on port ${this.port}`);
        resolve(this.port);
      });

      this.server.on('error', (error: any) => {
        console.error('❌ Failed to start embedded server:', error);
        reject(error);
      });
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('🛑 Embedded API server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  getPort(): number {
    return this.port;
  }

  getBaseUrl(): string {
    return `http://127.0.0.1:${this.port}`;
  }
}