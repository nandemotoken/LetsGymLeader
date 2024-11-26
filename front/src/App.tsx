import React, { useState } from 'react';
import { Map, User, Award, Clock } from 'lucide-react';
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { badges, BadgeComponents, type Badge } from './Badges';

const MainContent: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [obtainedBadges, setObtainedBadges] = useState<Set<string>>(new Set(['badge2', 'badge3']));

  const handleGymVisit = (url: string): void => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-red-600 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-red-700 rounded-lg shadow-2xl overflow-hidden">
        <div className="p-4 bg-red-800 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">ジムバッジ図鑑</h1>
            <DynamicWidget />
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
                  onClick={() => setSelectedBadge(badge)}
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