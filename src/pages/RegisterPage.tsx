import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    handle: '',
    displayName: '',
    email: '',
    password: '',
    bio: '',
    location: '',
    rsi_handle: ''
  });
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await register(formData);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="sc-card w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="sc-gradient w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">SC</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Rejoindre SC Companion</h1>
          <p className="text-base-content/70">Créez votre compte de citoyen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="handle"
              label="Pseudo (handle)"
              placeholder="mon_pseudo"
              value={formData.handle}
              onChange={handleChange}
              helperText="3-30 caractères, lettres, chiffres et _ uniquement"
              required
            />

            <Input
              name="displayName"
              label="Nom d'affichage"
              placeholder="Mon Nom"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            name="email"
            type="email"
            label="Adresse email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            name="password"
            type="password"
            label="Mot de passe"
            placeholder="Minimum 8 caractères"
            value={formData.password}
            onChange={handleChange}
            helperText="Minimum 8 caractères"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="location"
              label="Localisation (optionnel)"
              placeholder="Stanton System"
              value={formData.location}
              onChange={handleChange}
            />

            <Input
              name="rsi_handle"
              label="Handle RSI (optionnel)"
              placeholder="MonHandleRSI"
              value={formData.rsi_handle}
              onChange={handleChange}
              helperText="Votre pseudo Star Citizen"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Bio (optionnel)</span>
            </label>
            <textarea
              name="bio"
              className="textarea textarea-bordered bg-base-200 border-base-300"
              placeholder="Parlez-nous de vous..."
              rows={3}
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
          >
            Créer mon compte
          </Button>
        </form>

        <div className="divider">ou</div>

        <div className="text-center">
          <p className="text-base-content/70 mb-4">
            Déjà un compte ?
          </p>
          <Link to="/">
            <Button variant="outline" fullWidth>
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};