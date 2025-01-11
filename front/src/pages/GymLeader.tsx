import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import {
  parseAbi, PublicClient, WalletClient, createPublicClient, createWalletClient, custom, getContract, http
,isAddress } from 'viem'
import { optimism } from 'viem/chains'
import { badges, Badge  } from "./../common/Badge"

interface GymLeaderStatus {
  isAvailable: boolean;
  message: string;
  walletAddress?: string;
  battleMessage?: string;
  imageUrl?: string;
}

function useViemClients() {
  const { wallets } = useWallets();
  const [clients, setClients] = useState<{
    walletClient: WalletClient | null;
    //viem型定義のほうがおかしいかも
    publicClient: any;
  }>({
    walletClient: null,
    publicClient: null
  });

  useEffect(() => {
    async function setupClients() {
      const wallet = wallets[0];
      if (!wallet) return;

      try {
        await wallet.switchChain(optimism.id);
        const provider = await wallet.getEthereumProvider();

        const walletClient = createWalletClient({
          chain: optimism,
          transport: custom(provider),
        });

        const publicClient = createPublicClient({
          chain: optimism,
          transport: http()
        });

        setClients({ walletClient, publicClient });
      } catch (error) {
        console.error('Failed to setup viem clients:', error);
        setClients({ walletClient: null, publicClient: null });
      }
    }

    setupClients();
  }, [wallets]);

  return clients;
}


function GymLeader() {
  const { login, logout, authenticated, user } = usePrivy();
  const [address, setAddress] = useState<string>('');
  const { walletClient, publicClient: publicClient } = useViemClients();
  const { wallets } = useWallets();
  const [walletAddress, setWalletAddress] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [gymLeaderInfo, setGymLeaderInfo] = useState<Badge | null>(null);
  const [battleMessage, setBattleMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlHistory, setImageUrlHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('imageUrlHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem('imageUrlHistory');
    if (saved) {
      setImageUrlHistory(JSON.parse(saved));
    }
  }, []);

  const handleImageUrlUpdate = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async () => {
    console.log(walletAddress)

    if (!walletClient || !publicClient) {
      console.log("no client")
      return
    };

    if (!isAddress(walletAddress)) {
      throw("invalid address")
    }

    const accounts = await walletClient.getAddresses()
    const account = accounts[0]
    console.dir(`account:${account}`)

    const badge = badges.find(badge => 
      badge.GymLeaderAddress.includes(account)
    )

    const contractAddress = badge?.contractAddress;
    console.log(`contractAddress:${contractAddress}`)

    if (!contractAddress || !isAddress(contractAddress)) {
      throw("invalid gymLeader")      
    }

    console.log(`trainer address ${walletAddress}`)

    await walletClient.writeContract({
      address: contractAddress,
      abi: parseAbi(["function sendBadge(address _trainer) public", "function name() public view returns (string)"]),
      functionName: 'sendBadge',
      args: [walletAddress],
      account: account,
      chain: optimism
    })

  }


  useEffect(() => {
    async function fetchContractData() {
      if (!walletClient || !publicClient) {
        console.log("no client")
        return
      };

      try {
        const name = await publicClient.readContract({
          address: '0x3bC4930D0192439De245bC2C94dE04c768306b27',
          abi: parseAbi(["function sendBadge(address _trainer) public", "function name() public view returns (string)"]),
          functionName: 'name'
        })

        console.log(name)



      } catch (error) {
        console.error('Contract read error:', error);
      }
    }

    fetchContractData();
  }, [walletClient, publicClient]);


  // privyの標準機能を使ったユーザ情報の取得(コントラクト接続なし)
  const connectWallet = async () => {
    try {
      if (wallets && wallets.length > 0) {
        const wallet = wallets[0];
        await wallet.switchChain(optimism.id);
        const provider = await wallet.getEthersProvider();
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        console.log(user?.discord?.username);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  }

  // 認証状態が変更されたら自動的にウォレット接続を実行
  useEffect(() => {
    if (authenticated && wallets.length > 0) {
      connectWallet();
    }
  }, [authenticated, wallets]);

  const toggleAvailability = async () => {
    try {
      const accounts = await walletClient?.getAddresses();
      const account = accounts?.[0];
      
      if (!account) return;
      
      const badge = badges.find(badge => 
        badge.GymLeaderAddress.includes(account)
      );
      
      if (!badge) {
        console.error("Not a gym leader");
        return;
      }

      if (imageUrl && !imageUrlHistory.includes(imageUrl)) {
        const newHistory = Array.from(new Set([imageUrl, ...imageUrlHistory])).slice(0, 5);
        setImageUrlHistory(newHistory);
        localStorage.setItem('imageUrlHistory', JSON.stringify(newHistory));
      }

      const response = await fetch(
        'https://lubiqflmuevfpkdceisf.supabase.co/functions/v1/gymleaderstatus',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmlxZmxtdWV2ZnBrZGNlaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTYwMDgsImV4cCI6MjA0ODUzMjAwOH0.L8BhzPs6T6ewoHDQ9mCPPbPIjcXlR4rl7WpRySK7m94'
          },
          body: JSON.stringify({
            gymLeaderId: badge.id,
            isAvailable: !isAvailable,
            battleMessage: battleMessage,
            imageUrl: imageUrl
          })
        }
      );

      const data: GymLeaderStatus = await response.json();
      setIsAvailable(data.isAvailable);
      
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const accounts = await walletClient?.getAddresses();
        const account = accounts?.[0];
        
        if (!account) return;
        
        const badge = badges.find(badge => 
          badge.GymLeaderAddress.includes(account)
        );
        
        if (!badge) return;

        const response = await fetch(
          `https://lubiqflmuevfpkdceisf.supabase.co/functions/v1/gymleaderstatus?id=${badge.id}`,
          {
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmlxZmxtdWV2ZnBrZGNlaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTYwMDgsImV4cCI6MjA0ODUzMjAwOH0.L8BhzPs6T6ewoHDQ9mCPPbPIjcXlR4rl7WpRySK7m94'
            }
          }
        );
        const data: GymLeaderStatus = await response.json();
        setIsAvailable(data.isAvailable);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    if (walletClient) {
      fetchStatus();
    }
  }, [walletClient]);

  // ジムリーダー情報を取得する関数
  useEffect(() => {
    const fetchGymLeaderInfo = async () => {
      if (!walletClient) return;
      
      try {
        const accounts = await walletClient.getAddresses();
        const account = accounts[0];
        
        const badge = badges.find(badge => 
          badge.GymLeaderAddress.includes(account)
        );
        
        if (badge) {
          setGymLeaderInfo(badge);
        }
      } catch (error) {
        console.error('Error fetching gym leader info:', error);
      }
    };

    fetchGymLeaderInfo();
  }, [walletClient]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          ジムリーダー専用画面
        </h1>

        {authenticated ? (
          <div className="space-y-6">
            {gymLeaderInfo ? (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-800 mb-1">
                        {gymLeaderInfo.leader}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {gymLeaderInfo.gym} / {gymLeaderInfo.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">GYM_ID:</span>
                      <span className="ml-1 font-mono text-sm text-gray-700">{gymLeaderInfo.id}</span>
                    </div>
                  </div>
                </div>

                {/* ウォレットアドレスとステータス表示 */}
                {address && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      <span className="font-semibold">ウォレットアドレス:</span> {address}
                    </p>
                    <p className="text-gray-700 mt-2">
                      <span className="font-semibold">ステータス:</span>
                      <span className={`ml-2 px-3 py-1 rounded-full text-white ${
                        isAvailable ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isAvailable ? '現在対戦可' : '現在対戦不可'}
                      </span>
                    </p>
                  </div>
                )}

                {/* メッセージと画像URL入力 */}
                <div className="space-y-4 mb-8">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={battleMessage}
                      onChange={(e) => setBattleMessage(e.target.value)}
                      placeholder="対戦メッセージ"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => handleImageUrlUpdate(e.target.value)}
                          list="imageUrlList"
                          placeholder="画像URL"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {imageUrl && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <img 
                              src={imageUrl} 
                              alt="プレビュー"
                              className="h-6 w-6 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/24x24?text=X';
                              }}
                            />
                          </div>
                        )}
                        <datalist id="imageUrlList">
                          {imageUrlHistory.map((url, index) => (
                            <option key={index} value={url}>
                              {url}
                            </option>
                          ))}
                        </datalist>
                      </div>
                      <button 
                        onClick={toggleAvailability}
                        className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                      >
                        更新
                      </button>
                    </div>
                  </div>
                </div>

                {/* バッジ発行（既存のまま） */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    バッジ発行
                  </h2>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="トレーナーのアドレスを入力 (Discordで確認)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      バッジを発行
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <p className="text-gray-700 mb-4">
                  このDiscord IDはジムリーダーではありません。<br />
                  ジムリーダー登録/復活/システムサポートが必要な場合は、
                  <a 
                    href="https://x.com/GymBadgeNFT" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    x.com/GymBadgeNFT
                  </a>
                  へ連絡してください。
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={logout}
                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                ログアウト
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => login({ loginMethods: ['discord'] })}
              className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discordでログイン
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GymLeader