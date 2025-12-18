/**
 * 게임 설정 및 전역 상수
 */

// 기본 설정
const defaultConfig = {
  game_title: "TACTICAL STRIKE",
  controls_guide: "WASD: 이동 | 마우스: 조준 | 클릭: 발사 | R: 재장전",
  background_color: "#0f172a",
  player_color: "#22d3ee",
  enemy_color: "#ef4444",
  bullet_color: "#fbbf24",
  ui_accent: "#a855f7"
};

// 난이도별 설정
const difficultySettings = {
  easy: {
    enemyHealthMultiplier: 0.6,        // 적 체력 60%
    enemySpeedMultiplier: 0.7,         // 적 이동 속도 70%
    enemyDamageMultiplier: 0.6,        // 적 공격력 60%
    spawnDelayMultiplier: 1.5,         // 생성 간격 150%
    shootDelayMultiplier: 1.5          // 발사 간격 150%
  },
  normal: {
    enemyHealthMultiplier: 1,          // 적 체력 100%
    enemySpeedMultiplier: 1,           // 적 이동 속도 100%
    enemyDamageMultiplier: 1,          // 적 공격력 100%
    spawnDelayMultiplier: 1,           // 생성 간격 100%
    shootDelayMultiplier: 1            // 발사 간격 100%
  },
  hard: {
    enemyHealthMultiplier: 2.2,        // 적 체력 220%
    enemySpeedMultiplier: 1.6,         // 적 이동 속도 160%
    enemyDamageMultiplier: 1.8,        // 적 공격력 180%
    spawnDelayMultiplier: 0.6,         // 생성 간격 60%
    shootDelayMultiplier: 0.6          // 발사 간격 60%
  }
};

// 무기 정보
const weaponConfigs = [
  { 
    id: 'assault', 
    name: '돌격 소총', 
    desc: '균형 잡힌 성능', 
    ammo: '30발', 
    speed: '보통', 
    bgStyle: 'background: linear-gradient(135deg, #164e63 0%, #083344 100%);', 
    borderColor: '#22d3ee', 
    textColor: '#22d3ee',
    cost: 0  // 기본 무기
  },
  { 
    id: 'burst', 
    name: '점사총', 
    desc: '3발 빠른 점사', 
    ammo: '24발', 
    speed: '빠름', 
    bgStyle: 'background: linear-gradient(135deg, #1e3a8a 0%, #1e3a8a 100%);', 
    borderColor: '#3b82f6', 
    textColor: '#3b82f6',
    cost: 300 
  },
  { 
    id: 'plasma', 
    name: '플라즈마총', 
    desc: '에너지 연사!', 
    ammo: '35발', 
    speed: '빠름', 
    bgStyle: 'background: linear-gradient(135deg, #115e59 0%, #042f2e 100%);', 
    borderColor: '#14b8a6', 
    textColor: '#14b8a6',
    cost: 400 
  },
  { 
    id: 'doubleshot', 
    name: '2연발 총', 
    desc: '한 번에 2발 발사!', 
    ammo: '20발', 
    speed: '보통', 
    bgStyle: 'background: linear-gradient(135deg, #831843 0%, #500724 100%);', 
    borderColor: '#ec4899', 
    textColor: '#ec4899',
    cost: 500 
  },
  { 
    id: 'sniper', 
    name: '저격총', 
    desc: '5배 데미지!', 
    ammo: '5발', 
    speed: '매우 느림', 
    bgStyle: 'background: linear-gradient(135deg, #14532d 0%, #052e16 100%);', 
    borderColor: '#22c55e', 
    textColor: '#22c55e',
    cost: 600 
  },
  { 
    id: 'tripleshot', 
    name: '3연발 총', 
    desc: '한 번에 3발 발사!', 
    ammo: '18발', 
    speed: '보통', 
    bgStyle: 'background: linear-gradient(135deg, #581c87 0%, #3b0764 100%);', 
    borderColor: '#a855f7', 
    textColor: '#a855f7',
    cost: 700 
  },
  { 
    id: 'laser', 
    name: '레이저건', 
    desc: '관통 레이저!', 
    ammo: '30발', 
    speed: '보통', 
    bgStyle: 'background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);', 
    borderColor: '#10b981', 
    textColor: '#10b981',
    cost: 800 
  },
  { 
    id: 'minigun', 
    name: '미니건', 
    desc: '초고속 연사!', 
    ammo: '100발', 
    speed: '매우 빠름', 
    bgStyle: 'background: linear-gradient(135deg, #7c2d12 0%, #431407 100%);', 
    borderColor: '#f97316', 
    textColor: '#f97316',
    cost: 900 
  },
  { 
    id: 'rocket', 
    name: '로켓 런처', 
    desc: '폭발 범위 공격!', 
    ammo: '4발', 
    speed: '느림', 
    bgStyle: 'background: linear-gradient(135deg, #881337 0%, #4c0519 100%);', 
    borderColor: '#f43f5e', 
    textColor: '#f43f5e',
    cost: 1000 
  },
  { 
    id: 'railgun', 
    name: '레일건', 
    desc: '즉사 관통탄!', 
    ammo: '3발', 
    speed: '매우 느림', 
    bgStyle: 'background: linear-gradient(135deg, #3730a3 0%, #1e1b4b 100%);', 
    borderColor: '#6366f1', 
    textColor: '#6366f1',
    cost: 1200 
  }
];
