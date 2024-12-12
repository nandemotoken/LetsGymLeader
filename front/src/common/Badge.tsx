import React from 'react';

export interface Badge {
  id: number;
  name: string;
  gym: string;
  leader: string;
  url: string;
  color: string;
  hours: string;
  contractAddress: string;
  GymLeaderAddress: string[]
  svg: React.FC;
}


export const badges: Badge[] = [
  { 
    id: 1, 
    name: 'マジックバッジ', 
    gym: 'マジックジム', 
    leader: 'なんでもトークン', 
    url: 'https://app.gather.town/app/7IQBpxNhAIni5UfR/TokenGym',
    color: 'bg-purple-600',
    hours: '平日 22:00-22:30',
    contractAddress: '0x3bC4930D0192439De245bC2C94dE04c768306b27',
    GymLeaderAddress: ['0x290c78BB40d532671ACbccF0988deCe12bff3CB3'],
    svg:() => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  { 
    id: 2, 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym2',
    color: 'bg-blue-600',
    hours: '毎日 20:00-21:00',
    contractAddress: '0x2345678901234567890123456789012345678901',
    GymLeaderAddress: [''],
    svg:() => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  },
  { 
    id: 3, 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym3',
    color: 'bg-yellow-500',
    hours: '水-月 19:00-20:00',
    contractAddress: '0x3456789012345678901234567890123456789012',
    GymLeaderAddress: [''],
    svg:() => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" 
              fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  },
  { 
    id: 4, 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym4',
    color: 'bg-green-600',
    hours: '土日祝 10:00-17:00',
    contractAddress: '0x4567890123456789012345678901234567890123',
    GymLeaderAddress: [''],
    svg:() => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
        <path d="M12 6l3.09 6.31L22 13.5l-5 4.87 1.18 6.88L12 21.5l-6.18 3.75L7 18.37l-5-4.87 6.91-1.19L12 6z" 
              fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  },
  { 
    id: 5, 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym5',
    color: 'bg-stone-600',
    hours: '年中無休 24時間',
    contractAddress: '0x5678901234567890123456789012345678901234',
    GymLeaderAddress: [''],
    svg:() => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M5 5h14v14H5z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  { 
    id: 6, 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym6',
    color: 'bg-orange-600',
    hours: '火木土 13:00-18:00',
    contractAddress: '0x6789012345678901234567890123456789012345',
    GymLeaderAddress: [''],
    svg:() => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 2 L17 7 L22 7 L22 12 L17 17 L12 22 L7 17 L2 12 L2 7 L7 7 L12 2" 
              fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  },
  { 
    id: 7, 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym7',
    color: 'bg-rose-600',
    hours: '月水金 9:00-15:00',
    contractAddress: '0x7890123456789012345678901234567890123456',
    GymLeaderAddress: [''],
    svg:() => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M7 12 L17 12 M12 7 L12 17" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    )
  },
  { 
    id: 8, 
    name: '？？？バッジ', 
    gym: '？？？ジム', 
    leader: '？？？', 
    url: 'https://example.com/gym8',
    color: 'bg-cyan-600',
    hours: '土日 12:00-18:00',
    contractAddress: '0x8901234567890123456789012345678901234567',
    GymLeaderAddress: [''],
    svg:() => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 2 A10 10 0 0 1 22 12 A10 10 0 0 1 12 22 A10 10 0 0 1 2 12 A10 10 0 0 1 12 2" 
              fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7 L17 12 L12 17 L7 12 Z" 
              fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  },
];

