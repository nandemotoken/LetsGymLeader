import React, { useState } from 'react';
import { Map, User, Award, Clock } from 'lucide-react';
import {
  DynamicContextProvider,
  DynamicWidget,
  useDynamicContext
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { badges, BadgeComponents, type Badge } from './Badges';

const CustomLoginButton: React.FC = () => {
  const { setShowAuthFlow } = useDynamicContext();
  
  return (
    <button
      onClick={() => setShowAuthFlow(true)}
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
      <span>START</span>
      <svg 
        className="w-5 h-5" 
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* モンスターボールの上半分（赤） */}
        <path 
          d="M12 2C6.477 2 2 6.477 2 12H22C22 6.477 17.523 2 12 2Z" 
          fill="#FF0000"
        />
        {/* モンスターボールの下半分（白） */}
        <path 
          d="M2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12H2Z" 
          fill="#FFFFFF"
        />
        {/* 中央の線 */}
        <path 
          d="M2 11H22V13H2V11Z" 
          fill="#000000"
        />
        {/* 中央の円 */}
        <circle 
          cx="12" 
          cy="12" 
          r="3" 
          fill="#000000" 
          stroke="#FFFFFF" 
          strokeWidth="1"
        />
        {/* 中央の小さい円 */}
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

const MainContent: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [obtainedBadges, setObtainedBadges] = useState<Set<string>>(new Set(['badge2', 'badge3']));

  const callApi = async () => {
    try {
      const response = await fetch(
        'https://lubiqflmuevfpkdceisf.supabase.co/functions/v1/api',
        {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmlxZmxtdWV2ZnBrZGNlaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTYwMDgsImV4cCI6MjA0ODUzMjAwOH0.L8BhzPs6T6ewoHDQ9mCPPbPIjcXlR4rl7WpRySK7m94'
          }
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
      // まずAPIを呼び出し
      await callApi();
      // その後URLを開く
      window.open(url, '_blank');
    } catch (error) {
      console.error('API call failed:', error);
      // エラーがあってもURLは開く
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-red-600 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-red-700 rounded-lg shadow-2xl overflow-hidden">
        <div className="p-4 bg-red-800 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">ジムバッジ図鑑</h1>
            <CustomLoginButton />
            <div className="hidden">
              <DynamicWidget />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span>獲得数: {obtainedBadges.size}</span>
            <span>総数: {badges.length}</span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* コンパクトなバッジグリッド */}
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
                  onClick={async () => {
                    setSelectedBadge(badge);
                  }}
                >
                  <div className={`
                    w-full h-full rounded-lg flex items-center justify-center p-3
                    ${isObtained ? badge.color : 'bg-slate-700'}
                    transition-colors duration-300 hover:opacity-90
                  `}>
                    <BadgeIcon />
                  </div>
                  {/* 獲得状態インジケーター */}
                  <div className={`
                    absolute -top-1 -right-1 w-3 h-3 rounded-full
                    ${isObtained ? 'bg-green-500' : 'bg-gray-600'}
                    border-2 border-slate-800
                  `} />
                </div>
              );
            })}
          </div>

          {/* バッジ詳細パネル */}
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
                    className="mt-4 w-full p-2 rounded-lg text-center bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                  >
                    ジムに向かう
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
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "28351dce-984f-4ae2-9624-1264f9470f06",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <MainContent />
    </DynamicContextProvider>
  );
};

export default App;