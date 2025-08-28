import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Settings, User, Link, Shield, Palette, Bell } from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateUser, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    rsi_handle: user?.rsi_handle || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      // Success feedback could be added here
    } catch (error) {
      // Error is handled by the store
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'rsi', label: 'Compte RSI', icon: Link },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
          <Settings size={32} />
          Paramètres
        </h1>
        <p className="text-base-content/70">Gérez votre profil et vos préférences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="sc-card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-content'
                        : 'text-base-content hover:bg-base-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="sc-card p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Informations du profil</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    name="displayName"
                    label="Nom d'affichage"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Votre nom d'affichage"
                    required
                  />

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Bio</span>
                    </label>
                    <textarea
                      name="bio"
                      className="textarea textarea-bordered bg-base-100 border-base-300"
                      placeholder="Parlez-nous de vous..."
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/70">
                        {formData.bio.length}/500 caractères
                      </span>
                    </label>
                  </div>

                  <Input
                    name="location"
                    label="Localisation"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Stanton System, ArcCorp..."
                  />

                  <div className="flex justify-end">
                    <Button type="submit" loading={isLoading}>
                      Sauvegarder
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'rsi' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Compte Star Citizen</h2>
                <div className="space-y-6">
                  <div className="alert alert-info">
                    <span>
                      Liez votre compte RSI pour une meilleure intégration avec Star Citizen.
                      Votre GEID sera automatiquement détecté quand vous jouerez.
                    </span>
                  </div>

                  <Input
                    name="rsi_handle"
                    label="Handle RSI"
                    value={formData.rsi_handle}
                    onChange={handleChange}
                    placeholder="VotreHandleRSI"
                    helperText="Votre pseudo sur le site de Roberts Space Industries"
                  />

                  {user.rsi_geid && (
                    <div className="sc-card bg-success/10 border border-success/20 p-4">
                      <h3 className="font-semibold text-success mb-2">Compte RSI Lié ✓</h3>
                      <p className="text-sm">
                        GEID: <code className="text-xs bg-base-300 px-2 py-1 rounded">{user.rsi_geid}</code>
                      </p>
                      <p className="text-xs text-base-content/70 mt-2">
                        Dernière synchronisation: Automatique via les logs de jeu
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} loading={isLoading}>
                      Mettre à jour
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Confidentialité</h2>
                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Profil public</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                    <div className="text-sm text-base-content/70 ml-0">
                      Permet aux autres utilisateurs de voir votre profil
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Afficher le handle RSI</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                    <div className="text-sm text-base-content/70 ml-0">
                      Affiche votre handle RSI sur votre profil
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Statistiques publiques</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                    <div className="text-sm text-base-content/70 ml-0">
                      Permet aux autres de voir vos statistiques de jeu
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Apparence</h2>
                <div className="space-y-6">
                  <div>
                    <label className="label">
                      <span className="label-text">Thème</span>
                    </label>
                    <select className="select select-bordered w-full bg-base-100">
                      <option value="sccompanion">SC Companion (Défaut)</option>
                      <option value="dark">Sombre</option>
                      <option value="light">Clair</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Animations fluides</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Mode compact</span>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Notifications</h2>
                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Nouveaux followers</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Likes sur mes posts</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Demandes d'amis</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Événements communautaires</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Notifications système</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};