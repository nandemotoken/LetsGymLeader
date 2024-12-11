import React, { useState, useEffect } from 'react';
import { Map, User, Award, Clock } from 'lucide-react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

export interface Badge {
  id: string;
  name: string;
  gym: string;
  leader: string;
  url: string;
  color: string;
  hours: string;
  contractAddress: string;
}

// バッジコンポーネントの定義
const Badge1: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Badge2: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Badge3: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" 
          fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Badge4: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
    <path d="M12 6l3.09 6.31L22 13.5l-5 4.87 1.18 6.88L12 21.5l-6.18 3.75L7 18.37l-5-4.87 6.91-1.19L12 6z" 
          fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const Badge5: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M5 5h14v14H5z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Badge6: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2 L17 7 L22 7 L22 12 L17 17 L12 22 L7 17 L2 12 L2 7 L7 7 L12 2" 
          fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Badge7: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M7 12 L17 12 M12 7 L12 17" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const Badge8: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2 A10 10 0 0 1 22 12 A10 10 0 0 1 12 22 A10 10 0 0 1 2 12 A10 10 0 0 1 12 2" 
          fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7 L17 12 L12 17 L7 12 Z" 
          fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const BadgeComponents: Record<string, React.FC> = {
  badge1: Badge1,
  badge2: Badge2,
  badge3: Badge3,
  badge4: Badge4,
  badge5: Badge5,
  badge6: Badge6,
  badge7: Badge7,
  badge8: Badge8,
};

export const badges: Badge[] = [
  { 
    id: 'badge1', 
    name: 'トークンバッジ', 
    gym: 'なんでもジム', 
    leader: 'なんでもトークン', 
    url: 'https://app.gather.town/app/7IQBpxNhAIni5UfR/TokenGym',
    color: 'bg-stone-600',
    hours: '平日 22:00-22:30',
    contractAddress: '0x1234567890123456789012345678901234567890'
  },
  { 
    id: 'badge2', 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym2',
    color: 'bg-blue-600',
    hours: '毎日 20:00-21:00',
    contractAddress: '0x2345678901234567890123456789012345678901'
  },
  { 
    id: 'badge3', 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym3',
    color: 'bg-yellow-500',
    hours: '水-月 19:00-20:00',
    contractAddress: '0x3456789012345678901234567890123456789012'
  },
  { 
    id: 'badge4', 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym4',
    color: 'bg-green-600',
    hours: '土日祝 10:00-17:00',
    contractAddress: '0x4567890123456789012345678901234567890123'
  },
  { 
    id: 'badge5', 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym5',
    color: 'bg-purple-600',
    hours: '年中無休 24時間',
    contractAddress: '0x5678901234567890123456789012345678901234'
  },
  { 
    id: 'badge6', 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym6',
    color: 'bg-orange-600',
    hours: '火木土 13:00-18:00',
    contractAddress: '0x6789012345678901234567890123456789012345'
  },
  { 
    id: 'badge7', 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym7',
    color: 'bg-rose-600',
    hours: '月水金 9:00-15:00',
    contractAddress: '0x7890123456789012345678901234567890123456'
  },
  { 
    id: 'badge8', 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym8',
    color: 'bg-cyan-600',
    hours: '土日 12:00-18:00',
    contractAddress: '0x8901234567890123456789012345678901234567'
  },
];

interface CustomLoginButtonProps {
  userInfo: any;
  onLoginSuccess: (userInfo: any) => void;
  onLogout: () => void;
}

const CustomLoginButton: React.FC<CustomLoginButtonProps> = ({ userInfo, onLoginSuccess, onLogout }) => {
  const { login, logout } = usePrivy();

  const handleLogin = async () => {
    try {
      await login({ loginMethods: ['discord'] });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
      console.log('Logout success');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={userInfo ? handleLogout : handleLogin}
      className="
       px-4 py-1.5 rounded-full
       bg-white/10
       ring-1 ring-white/30
       text-white text-sm font-medium
       hover:bg-white/20 
       hover:ring-white/50
       hover:scale-105
       active:scale-95
       transition-all duration-200
       flex items-center gap-2
     "
    >
      <span>{userInfo ? 'PAUSE' : 'START'}</span>
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2C6.477 2 2 6.477 2 12H22C22 6.477 17.523 2 12 2Z"
          fill="#FF0000"
        />
        <path
          d="M2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12H2Z"
          fill="#FFFFFF"
        />
        <path
          d="M2 11H22V13H2V11Z"
          fill="#000000"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          fill="#000000"
          stroke="#FFFFFF"
          strokeWidth="1"
        />
        <circle
          cx="12"
          cy="12"
          r="1.5"
          fill="#FFFFFF"
        />
      </svg>
    </button>
  );
};

interface MainContentProps {
  userInfo: any;
}

const MainContent: React.FC<MainContentProps> = ({ userInfo }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [obtainedBadges, setObtainedBadges] = useState<Set<string>>(new Set(['badge2', 'badge3']));
  const { wallets } = useWallets();

  const callApi = async () => {
    if (!userInfo || !wallets.length) return;
    
    try {
      const wallet = wallets[0];
      await wallet.switchChain(1); // Ethereum Mainnet
      const provider = await wallet.getEthersProvider();
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      const discordUsername = userInfo?.discord?.username || '';

      if (!walletAddress) {
        console.error('Wallet address not found');
        return;
      }

      const response = await fetch(
        'https://lubiqflmuevfpkdceisf.supabase.co/functions/v1/api',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmlxZmxtdWV2ZnBrZGNlaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTYwMDgsImV4cCI6MjA0ODUzMjAwOH0.L8BhzPs6T6ewoHDQ9mCPPbPIjcXlR4rl7WpRySK7m94',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            walletAddress: walletAddress,
            discordUsername: discordUsername
          })
        }
      );
      const data = await response.json();
      console.log('API Response:', data);
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  const handleGymVisit = async (url: string): Promise<void> => {
    try {
      await callApi();
      window.open(url, '_blank');
    } catch (error) {
      console.error('API call failed:', error);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-2 bg-slate-800 rounded-lg p-4">
        {badges.map(badge => {
          const isObtained = obtainedBadges.has(badge.id);
          const BadgeIcon = BadgeComponents[badge.id];
          return (
            <div
              key={badge.id}
              className={`
               aspect-square relative cursor-pointer
               ${selectedBadge?.id === badge.id ? 'ring-2 ring-yellow-400' : ''}
             `}
              onClick={() => setSelectedBadge(badge)}
            >
              <div className={`
               w-full h-full rounded-lg flex items-center justify-center p-3
               ${isObtained ? badge.color : 'bg-slate-700'}
               transition-colors duration-300 hover:opacity-90
             `}>
                <BadgeIcon />
              </div>
              <div className={`
               absolute -top-1 -right-1 w-3 h-3 rounded-full
               ${isObtained ? 'bg-green-500' : 'bg-gray-600'}
               border-2 border-slate-800
             `} />
            </div>
          );
        })}
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        {selectedBadge ? (
          <div className="text-white space-y-4">
            <div className="flex justify-center mb-6">
              <div className={`
               w-24 h-24 rounded-full p-4
               ${selectedBadge.color}
               flex items-center justify-center
               shadow-lg
             `}>
                {React.createElement(BadgeComponents[selectedBadge.id])}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-4">{selectedBadge.name}</h2>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gray-400" />
                <span>{selectedBadge.gym}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span>{selectedBadge.leader}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{selectedBadge.hours}</span>
              </div>
            </div>

            {obtainedBadges.has(selectedBadge.id) ? (
              <div className="mt-4 p-2 rounded-lg text-center bg-green-600 text-white">
                獲得済み
              </div>
            ) : (
              <button
                onClick={() => handleGymVisit(selectedBadge.url)}
                disabled={!userInfo}
                className={`
                 mt-4 w-full p-2 rounded-lg text-center
                 ${userInfo
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-500 cursor-not-allowed'}
                 text-white transition-colors duration-300
               `}
              >
                {userInfo ? 'ジムに向かう' : 'Discord接続(右上)'}
              </button>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-20">
            バッジを選択してください
          </div>
        )}
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const { authenticated, user } = usePrivy();

  useEffect(() => {
    if (authenticated && user) {
      setUserInfo(user);
    } else {
      setUserInfo(null);
    }
  }, [authenticated, user]);

  return (
    <div className="bg-red-600 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-red-700 rounded-lg shadow-2xl overflow-hidden">
        <div className="p-4 bg-red-800 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">ジムバッジ図鑑</h1>
            <CustomLoginButton 
              userInfo={userInfo}
              onLoginSuccess={setUserInfo}
              onLogout={() => setUserInfo(null)}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>獲得数: {/* obtainedBadges.size */}</span>
            <span>総数: {badges.length}</span>
          </div>
        </div>
        <MainContent userInfo={userInfo} />
      </div>
    </div>
  );
};

export default Index;