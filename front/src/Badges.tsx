import React from 'react';

export interface Badge {
  id: string;
  name: string;
  gym: string;
  leader: string;
  url: string;
  color: string;
  hours: string;
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
    hours: '平日 夜10:00-10:30'
  },
  { 
    id: 'badge2', 
    name: 'テクニカルバッジ', 
    gym: 'テックジム', 
    leader: 'テックマスター', 
    url: 'https://example.com/gym2',
    color: 'bg-blue-600',
    hours: '毎日 20:00-21:00'
  },
  { 
    id: 'badge3', 
    name: 'スターバッジ', 
    gym: 'スタージム', 
    leader: 'スターマスター', 
    url: 'https://example.com/gym3',
    color: 'bg-yellow-500',
    hours: '水-月 19:00-20:00'
  },
  { 
    id: 'badge4', 
    name: 'エリートバッジ', 
    gym: 'エリートジム', 
    leader: 'エリートマスター', 
    url: 'https://example.com/gym4',
    color: 'bg-green-600',
    hours: '土日祝 10:00-17:00'
  },
  { 
    id: 'badge5', 
    name: 'バランスバッジ', 
    gym: 'バランスジム', 
    leader: 'バランスマスター', 
    url: 'https://example.com/gym5',
    color: 'bg-purple-600',
    hours: '年中無休 24時間'
  },
  { 
    id: 'badge6', 
    name: 'オクタゴンバッジ', 
    gym: '八角形ジム', 
    leader: 'オクタマスター', 
    url: 'https://example.com/gym6',
    color: 'bg-orange-600',
    hours: '火木土 13:00-18:00'
  },
  { 
    id: 'badge7', 
    name: 'クロスバッジ', 
    gym: 'クロスジム', 
    leader: 'クロスマスター', 
    url: 'https://example.com/gym7',
    color: 'bg-rose-600',
    hours: '月水金 9:00-15:00'
  },
  { 
    id: 'badge8', 
    name: 'サークルバッジ', 
    gym: 'サークルジム', 
    leader: 'サークルマスター', 
    url: 'https://example.com/gym8',
    color: 'bg-cyan-600',
    hours: '土日 12:00-18:00'
  },
];