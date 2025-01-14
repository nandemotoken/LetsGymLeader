import React, { useState, useEffect } from 'react';
import { Map, User, Award, Clock } from 'lucide-react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { badges, Badge } from '../common/Badge';
import { 
  BrowserProvider, 
  Contract, 
  Interface,
  JsonRpcProvider,
  Provider 
} from 'ethers';
import { Link } from 'react-router-dom';

interface GymLeaderStatus {
  isAvailable: boolean;
  message: string;
  walletAddress?: string;
}

interface CustomLoginButtonProps {
  userInfo: any;
  onLoginSuccess: (userInfo: any) => void;
  onLogout: () => void;
}

const POLLING_INTERVAL = 60000; // 1 minute in milliseconds

const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)"
];

export async function checkBadgeOwnership(
  walletAddress: string,
  badges: Badge[],
  provider: Provider
): Promise<Set<number>> {
  const obtainedBadges = new Set<number>();

  for (const badge of badges) {
    try {
      const contract = new Contract(
        badge.contractAddress,
        ERC721_ABI,
        provider
      );

      const balance = await contract.balanceOf(walletAddress);
      
      if (balance > 0n) {
        obtainedBadges.add(badge.id);
        console.log(`trainer has ${(badge.id)}`)
      } else {
        console.log(`trainer doesn't have ${(badge.id)}`)
      }
    } catch (error) {
      console.error(`Error checking badge ${badge.id}:`, error);
    }
  }

  return obtainedBadges;
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
  obtainedBadges: Set<number>;
}

const MainContent: React.FC<MainContentProps> = ({ userInfo, obtainedBadges }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const { wallets } = useWallets();
  const [availableGyms, setAvailableGyms] = useState<Set<number>>(new Set());
  const [gymStatus, setGymStatus] = useState<GymLeaderStatus | null>(null);

  useEffect(() => {
    const checkGymLeaderStatus = async () => {
      const newAvailableGyms = new Set<number>();
      
      for (let id = 1; id <= 8; id++) {
        try {
          const response = await fetch(
            `https://lubiqflmuevfpkdceisf.supabase.co/functions/v1/gymleaderstatus?id=${id}`,
            {
              headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmlxZmxtdWV2ZnBrZGNlaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTYwMDgsImV4cCI6MjA0ODUzMjAwOH0.L8BhzPs6T6ewoHDQ9mCPPbPIjcXlR4rl7WpRySK7m94'
              }
            }
          );
          const data: GymLeaderStatus = await response.json();
          
          if (data.isAvailable) {
            newAvailableGyms.add(id);
          }
        } catch (error) {
          console.error(`Error checking gym ${id} status:`, error);
        }
      }
      
      setAvailableGyms(newAvailableGyms);
    };

    checkGymLeaderStatus();
    const intervalId = setInterval(checkGymLeaderStatus, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchGymStatus = async () => {
      if (!selectedBadge) return;

      try {
        const response = await fetch(
          `https://lubiqflmuevfpkdceisf.supabase.co/functions/v1/gymleaderstatus?id=${selectedBadge.id}`,
          {
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmlxZmxtdWV2ZnBrZGNlaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTYwMDgsImV4cCI6MjA0ODUzMjAwOH0.L8BhzPs6T6ewoHDQ9mCPPbPIjcXlR4rl7WpRySK7m94'
            }
          }
        );
        const data = await response.json();
        setGymStatus(data);
      } catch (error) {
        console.error('Error fetching gym status:', error);
      }
    };

    fetchGymStatus();
  }, [selectedBadge]);

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
            discordUsername: discordUsername,
            gymNumber: selectedBadge?.id
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
          const isAvailable = availableGyms.has(badge.id);
          return (
            <div
              key={badge.id}
              className={`
                aspect-square relative cursor-pointer
                ${selectedBadge?.id === badge.id ? 'ring-2 ring-yellow-400' : ''}
                ${isAvailable && !isObtained ? 'animate-pulse' : ''}
              `}
              onClick={() => setSelectedBadge(badge)}
            >
              <div className={`
                w-full h-full rounded-lg flex items-center justify-center p-3
                ${isObtained ? badge.color : 'bg-slate-700'}
                ${isAvailable && !isObtained ? 'ring-2 ring-green-400' : ''}
                transition-colors duration-300 hover:opacity-90
              `}>
                <badge.svg />
              </div>
              <div className={`
                absolute -top-1 -right-1 w-3 h-3 rounded-full
                ${isObtained ? 'bg-green-500' : isAvailable ? 'bg-yellow-500 animate-ping' : 'bg-gray-600'}
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
                <selectedBadge.svg />
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
              {/* <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{selectedBadge.hours}</span>
              </div> */}
            </div>

            {obtainedBadges.has(selectedBadge.id) ? (
              <button
                onClick={() => handleGymVisit(selectedBadge.url)}
                disabled={!userInfo}
                className={`
                  mt-4 w-full p-2 rounded-lg text-center
                  bg-green-600 hover:bg-green-700
                  text-white transition-colors duration-300
                  ${!userInfo && 'opacity-50 cursor-not-allowed'}
                `}
              >
                獲得済み
              </button>
            ) : (
              userInfo ? (
                <Link
                  to={gymStatus?.isAvailable ? "/battle" : "https://discord.gg/XZS58vfHc9"}
                  target={gymStatus?.isAvailable ? undefined : "_blank"}
                  rel={gymStatus?.isAvailable ? undefined : "noopener noreferrer"}
                  className={`
                    mt-4 w-full p-2 rounded-lg text-center inline-block
                    ${gymStatus?.isAvailable 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-red-500 hover:bg-red-600'}
                    text-white transition-colors duration-300
                  `}
                >
                  {gymStatus?.isAvailable ? 'ジムに向かう' : 'ジムからのお知らせを見る'}
                </Link>
              ) : (
                <div className="mt-4 w-full p-2 rounded-lg text-center
                  bg-gray-500 cursor-not-allowed
                  text-white"
                >
                  Discord接続(右上)
                </div>
              )
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
  const { wallets } = useWallets();
  const [obtainedBadges, setObtainedBadges] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (authenticated && user) {
      setUserInfo(user);

      const checkBadges = async () => {
        if (!wallets.length) return;
        
        try {
          const wallet = wallets[0];
          await wallet.switchChain(1);
          const provider = await wallet.getEthersProvider()
          const signer = await provider.getSigner(); 
          const walletAddress = await signer.getAddress();
          const jsonRPC = new JsonRpcProvider("https://optimism-rpc.publicnode.com")

          const ownedBadges = await checkBadgeOwnership(
            walletAddress,
            badges,
            jsonRPC
          );

          setObtainedBadges(ownedBadges);
        } catch (error) {
          console.error('Failed to check badge ownership:', error);
        }
      };

      checkBadges();
    } else {
      setUserInfo(null);
      setObtainedBadges(new Set());
    }
  }, [authenticated, user, wallets]);

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
            <span>獲得数: {obtainedBadges.size}</span>
            <span>総数: {badges.length}</span>
          </div>
        </div>
        <MainContent 
          userInfo={userInfo} 
          obtainedBadges={obtainedBadges}
        />
      </div>
    </div>
  );
};

export default Index;