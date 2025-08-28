import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage = () => {
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password123');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="sc-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="sc-gradient w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">SC</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">SC Companion</h1>
          <p className="text-base-content/70">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <Input
            type="email"
            label="Adresse email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
          >
            Se connecter
          </Button>
        </form>

        <div className="divider">ou</div>

        {/* Identifiants de démonstration */}
        <div className="alert alert-info mb-6">
          <div className="text-sm">
            <div className="font-semibold mb-2">🎮 Mode Démonstration</div>
            <div>Email: <code className="bg-base-200 px-1 rounded">demo@sc-companion.com</code></div>
            <div>Mot de passe: <code className="bg-base-200 px-1 rounded">demo123</code></div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-base-content/70 mb-4">
            Pas encore de compte ?
          </p>
          <Link to="/register">
            <Button variant="outline" fullWidth>
              Créer un compte
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <div className="text-sm text-base-content/50">
            <p>Comptes de test :</p>
            <p>alice@example.com / password123</p>
            <p>admin@sc-companion.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};