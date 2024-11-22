import React, { useState } from 'react';
import { Map, User, Award, Clock } from 'lucide-react';
import { useTorus } from './hooks/useTorus'

interface Badge {
  id: string;
  name: string;
  gym: string;
  leader: string;
  url: string;
  color: string;
  hours: string; // 営業時間を追加
}

type BadgeComponent = React.FC<{}>;

const Badge1: BadgeComponent = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Badge2: BadgeComponent = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Badge3: BadgeComponent = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" 
          fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Badge4: BadgeComponent = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
    <path d="M12 6l3.09 6.31L22 13.5l-5 4.87 1.18 6.88L12 21.5l-6.18 3.75L7 18.37l-5-4.87 6.91-1.19L12 6z" 
          fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const Badge5: BadgeComponent = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M5 5h14v14H5z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BadgeComponents: Record<string, React.FC> = {
  badge1: Badge1,
  badge2: Badge2,
  badge3: Badge3,
  badge4: Badge4,
  badge5: Badge5,
};

const App: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [obtainedBadges, setObtainedBadges] = useState<Set<string>>(new Set(['badge2', 'badge3']));

  //torus
  // const { isConnected, account, connect } = useTorus();


  const badges: Badge[] = [
    { 
      id: 'badge1', 
      name: 'トークンバッジ', 
      gym: 'なんでもジム', 
      leader: 'なんでもトークン', 
      url: 'https://app.gather.town/app/7IQBpxNhAIni5UfR/TokenGym',
      color: 'bg-stone-600',
      hours: '平日 夜10:00-10:30'
    },
    { 
      id: 'badge2', 
      name: 'バッジ２', 
      gym: 'ジム２', 
      leader: '？？？', 
      url: 'https://example.com/gym2',
      color: 'bg-blue-600',
      hours: '毎日 20:00-21:00'
    },
    { 
      id: 'badge3', 
      name: 'バッジ３', 
      gym: 'ジム３', 
      leader: '？？？', 
      url: 'https://example.com/gym3',
      color: 'bg-yellow-500',
      hours: '水-月 19:00-20:00'
    },
    { 
      id: 'badge4', 
      name: 'バッジ４', 
      gym: 'ジム４', 
      leader: '？？？', 
      url: 'https://example.com/gym4',
      color: 'bg-green-600',
      hours: '土日祝 10:00-17:00'
    },
    { 
      id: 'badge5', 
      name: 'バッジ５', 
      gym: 'ジム５', 
      leader: '？？？', 
      url: 'https://example.com/gym5',
      color: 'bg-purple-600',
      hours: '年中無休 24時間'
    },
  ];

  const handleGymVisit = (url: string): void => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-red-600 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-red-700 rounded-lg shadow-2xl overflow-hidden">
        <div className="p-4 bg-red-800 text-white">
          <h1 className="text-2xl font-bold text-center mb-2">ジムバッジ図鑑</h1>
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

export default App;