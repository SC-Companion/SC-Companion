import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Heart, MessageCircle, Share, User } from 'lucide-react';
import type { Post } from '../types/Post';

// Mock data - will be replaced with real API calls
const mockPosts: Post[] = [
  {
    id: 1,
    user: {
      id: 3,
      handle: 'citizen_alice',
      displayName: 'Alice StarWalker',
      avatar: null,
      level: 16,
      isPremium: false,
      rsi_handle: 'AliceStarWalker'
    },
    content: 'Just completed my first cargo run from ArcCorp to Hurston! The views along the way were absolutely breathtaking. Star Citizen never fails to amaze me with its beauty. 🚀 #StarCitizen #Trading',
    likesCount: 15,
    createdAt: '2024-01-10T10:30:00Z',
    isLiked: false
  },
  {
    id: 2,
    user: {
      id: 4,
      handle: 'pilot_bob',
      displayName: 'Bob "Ace" Johnson',
      avatar: null,
      level: 18,
      isPremium: true,
      rsi_handle: 'AcePilotBob'
    },
    content: 'Had an epic dogfight in my Gladius today! Three pirates vs me, and I managed to take them all down. Practice makes perfect! Who wants to join me for some combat training? 💪',
    likesCount: 23,
    createdAt: '2024-01-10T14:15:00Z',
    isLiked: true
  }
];

export const FeedPage = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        user: {
          id: user!.id,
          handle: user!.handle,
          displayName: user!.displayName,
          avatar: user!.avatar || null,
          level: user!.level,
          isPremium: user!.isPremium,
          rsi_handle: user!.rsi_handle || undefined
        },
        content: newPostContent,
        likesCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false
      };

      setPosts(prev => [newPost, ...prev]);
      setNewPostContent('');
      setIsPosting(false);
    }, 1000);
  };

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
        };
      }
      return post;
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Feed Communautaire</h1>
        <p className="text-base-content/70">Découvrez ce qui se passe dans l'univers SC Companion</p>
      </div>

      {/* Create Post */}
      <div className="sc-card p-6">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={20} className="text-primary-content" />
              )}
            </div>
            <div className="flex-1">
              <textarea
                placeholder={`Que se passe-t-il, ${user?.displayName} ?`}
                className="textarea textarea-bordered w-full bg-base-100 border-base-300 min-h-[100px]"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                maxLength={2000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-base-content/50">
                  {newPostContent.length}/2000
                </span>
                <Button
                  type="submit"
                  loading={isPosting}
                  disabled={!newPostContent.trim()}
                >
                  Publier
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="sc-card p-6">
            {/* Post header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                {post.user.avatar ? (
                  <img src={post.user.avatar} alt={post.user.displayName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={20} className="text-primary-content" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{post.user.displayName}</h4>
                  <span className="text-sm text-base-content/70">@{post.user.handle}</span>
                  <span className="text-sm text-primary">Niv. {post.user.level}</span>
                  {post.user.isPremium && (
                    <span className="badge badge-primary badge-xs">Premium</span>
                  )}
                </div>
                {post.user.rsi_handle && (
                  <p className="text-xs text-base-content/50">RSI: {post.user.rsi_handle}</p>
                )}
                <p className="text-xs text-base-content/50">{formatDate(post.createdAt)}</p>
              </div>
            </div>

            {/* Post content */}
            <div className="mb-4">
              <p className="text-base-content leading-relaxed">{post.content}</p>
            </div>

            {/* Post actions */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 transition-colors ${
                  post.isLiked ? 'text-error' : 'text-base-content/70 hover:text-error'
                }`}
              >
                <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                <span className="text-sm">{post.likesCount}</span>
              </button>

              <button className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors">
                <MessageCircle size={18} />
                <span className="text-sm">Répondre</span>
              </button>

              <button className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors">
                <Share size={18} />
                <span className="text-sm">Partager</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};