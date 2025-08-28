import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, MapPin, Calendar, Trophy, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuthStore();
  
  // Si pas d'userId, afficher le profil de l'utilisateur connecté
  const isOwnProfile = !userId || parseInt(userId) === user?.id;
  const profileUser = user; // TODO: Fetch other user's profile if userId provided

  if (!profileUser) return null;

  const nextLevelXP = Math.pow(profileUser.level, 2) * 100;
  const currentLevelXP = Math.pow(profileUser.level - 1, 2) * 100;
  const xpInLevel = profileUser.xp - currentLevelXP;
  const xpForNextLevel = nextLevelXP - currentLevelXP;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="sc-card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-4">
              {profileUser.avatar ? (
                <img 
                  src={profileUser.avatar} 
                  alt={profileUser.displayName} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <User size={48} className="text-primary-content" />
              )}
            </div>
            
            {/* Level Badge */}
            <div className="sc-gradient px-4 py-2 rounded-full text-center">
              <div className="text-white font-bold text-lg">Niveau {profileUser.level}</div>
              <div className="text-white/80 text-sm">{profileUser.xp.toLocaleString()} XP</div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profileUser.displayName}</h1>
                  {profileUser.isPremium && (
                    <div className="badge badge-primary">
                      <Star size={12} className="mr-1" />
                      Premium
                    </div>
                  )}
                </div>
                <p className="text-lg text-base-content/70 mb-1">@{profileUser.handle}</p>
                {profileUser.rsi_handle && (
                  <p className="text-primary font-medium">RSI: {profileUser.rsi_handle}</p>
                )}
              </div>

              {isOwnProfile ? (
                <Button variant="outline">
                  Modifier le profil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button>Suivre</Button>
                  <Button variant="outline">Message</Button>
                </div>
              )}
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-base-content leading-relaxed mb-4">{profileUser.bio}</p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-sm text-base-content/70 mb-4">
              {profileUser.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{profileUser.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Membre depuis {new Date(profileUser.createdAt).toLocaleDateString('fr')}</span>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progression niveau {profileUser.level + 1}</span>
                <span className="text-sm text-base-content/70">
                  {xpInLevel.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
                </span>
              </div>
              <div className="w-full bg-base-300 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(xpInLevel / xpForNextLevel) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">42</div>
                <div className="text-sm text-base-content/70">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">156</div>
                <div className="text-sm text-base-content/70">Suiveurs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">89</div>
                <div className="text-sm text-base-content/70">Suivis</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="sc-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="text-primary" size={24} />
          Succès & Récompenses
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-base-300 rounded-lg">
            <div className="text-3xl mb-2">🚀</div>
            <div className="font-medium">Premier Vol</div>
            <div className="text-xs text-base-content/70">Première connexion</div>
          </div>
          <div className="text-center p-4 bg-base-300 rounded-lg">
            <div className="text-3xl mb-2">✍️</div>
            <div className="font-medium">Première Publication</div>
            <div className="text-xs text-base-content/70">Premier post</div>
          </div>
          <div className="text-center p-4 bg-base-300 rounded-lg opacity-50">
            <div className="text-3xl mb-2">👥</div>
            <div className="font-medium">Social</div>
            <div className="text-xs text-base-content/70">10 amis</div>
          </div>
          <div className="text-center p-4 bg-base-300 rounded-lg opacity-50">
            <div className="text-3xl mb-2">💫</div>
            <div className="font-medium">Vétéran</div>
            <div className="text-xs text-base-content/70">Niveau 50</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="sc-card p-6">
        <h2 className="text-xl font-bold mb-4">Activité Récente</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-base-100 rounded-lg">
            <div className="text-primary">🎯</div>
            <div>
              <p className="font-medium">Quête terminée: Transport de marchandises</p>
              <p className="text-sm text-base-content/70">+50 XP • Il y a 2h</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-base-100 rounded-lg">
            <div className="text-primary">❤️</div>
            <div>
              <p className="font-medium">Post apprécié par 15 citoyens</p>
              <p className="text-sm text-base-content/70">+30 XP • Il y a 4h</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-base-100 rounded-lg">
            <div className="text-primary">⬆️</div>
            <div>
              <p className="font-medium">Niveau supérieur atteint!</p>
              <p className="text-sm text-base-content/70">Niveau {profileUser.level} • Il y a 1j</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};