# Tactical Strike FPS

모듈형 아키텍처를 갖춘 브라우저 기반 탑다운 슈팅 게임. 순수 HTML5 Canvas와 Vanilla JavaScript로 제작되었으며, 고급 비주얼 효과, 다양한 무기 타입, 포괄적인 진행 시스템을 특징으로 합니다.

## 개요

Tactical Strike는 모듈형 아키텍처를 가진 액션 슈팅 게임으로, 12종 이상의 고유 무기, 3단계 난이도, 실시간 시각 피드백, 정교한 코인 경제 시스템을 특징으로 합니다. 이 게임은 클래스 기반 OOP, 상태 관리, 깔끔한 관심사 분리를 통해 현대적인 JavaScript 패턴을 보여줍니다.

## 주요 기능

### 핵심 게임플레이
- **60 FPS 부드러운 게임플레이** - 최적화된 렌더링
- **3단계 난이도** - 이지, 노멀, 하드 동적 스케일링
- **점진적 레벨 시스템** - 진행할수록 적이 강해짐
- **웨이브 기반 스포닝** - 전략적 적 생성
- **고급 시각 피드백** - 히트마커, 데미지 플래시, 파티클 효과
- **탄약 관리** - 진행률 표시가 있는 재장전 메커니즘

### 무기 라인업 (12종)
1. **AR-47 Phantom** - 균형잡힌 돌격 소총 (기본)
2. **산탄총** - 근거리 확산 공격 (8발)
3. **기관단총(SMG)** - 높은 연사속도 (40발)
4. **점사총** - 3발 점사 (300 코인)
5. **플라즈마건** - 에너지 발사체 (400 코인)
6. **2연발 총** - 동시에 2발 발사 (500 코인)
7. **저격총** - 5배 데미지 정밀 사격 (600 코인)
8. **3연발 총** - 3방향 발사 (700 코인)
9. **레이저건** - 관통 빔 (800 코인)
10. **미니건** - 초고속 연사 (900 코인)
11. **로켓 런처** - 범위 폭발 (1000 코인)
12. **레일건** - 즉사 관통 (1200 코인)

### 비주얼 강화
- **총알 궤적 표시** - 무기별 색상의 그라디언트 페이드 효과
- **조준선 미리보기** - 발사 전 총알 경로 표시
- **재장전 진행 바** - 실시간 퍼센티지 표시
- **파워업 시각 표시** - 실드, 속도 부스트, 데미지 배율
- **폭발 효과** - 로켓 런처 명중 시
- **파티클 시스템** - 총구 섬광, 피 튀김, 아이템 획득

### 경제 & 진행 시스템
- **코인 시스템** - 20킬당 10 코인 획득
- **무기 상점** - 레벨 사이에 업그레이드 구매
- **캐릭터 커스터마이징** - 메인 컬러 8종, 보조 컬러 8종
- **리더보드** - Data SDK 통합 클라우드 기반 랭킹
- **영구 저장** - 해금된 무기 유지

### 파워업 (40% 드롭률)
- 🏥 **체력 팩** (15% 드롭) - HP +35 회복
- 💨 **속도 부스트** - 10초간 이동 속도 50% 증가
- 🔥 **데미지 배율** - 10초간 공격력 2배
- 🛡️ **실드** - 10초간 받는 피해 50% 감소
- 💥 **3연발** - 10초간 한 번에 3발 발사
- 🎯 **2연발** - 10초간 한 번에 2발 발사

## 시작하기

### 사전 요구사항
- 최신 웹 브라우저 (Chrome, Firefox, Safari, Edge)
- JavaScript 활성화 필요

### 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/shinyubin1015/Shooting-game.git
cd Shooting-game
```

2. 게임 실행
```bash
# Python 3 사용
python -m http.server 8000

# Node.js http-server 사용
npx http-server

# 또는 브라우저에서 index.html 직접 열기
```

3. 브라우저에서 `http://localhost:8000` 접속

## 조작 방법

| 키 | 동작 |
|-----|--------|
| W/A/S/D | 이동 |
| 마우스 | 조준 |
| 좌클릭 | 발사 |
| R | 재장전 |
| 일시정지 버튼 | 게임 일시정지 |

## 기술 상세

### 사용 기술
- HTML5 Canvas (렌더링)
- Vanilla JavaScript (ES6+)
- Tailwind CSS (UI 스타일링)
- 커스텀 애니메이션 시스템

### 아키텍처

#### 설계 원칙
- **모듈형 아키텍처** - 조직화된 파일 구조로 관심사 분리
- **객체 지향 설계** - 모든 게임 엔티티에 ES6 클래스 사용
- **상태 관리** - 불변 패턴을 사용한 중앙 집중식 게임 상태
- **이벤트 기반 입력** - 분리된 입력 처리 시스템
- **의존성 주입** - 느슨한 결합을 위해 gameState를 엔티티에 전달
- **성능 우선** - 최적화된 충돌 감지로 60fps 목표

#### 핵심 시스템
1. **렌더링 엔진** - 더블 버퍼링을 사용한 HTML5 Canvas
2. **물리 시스템** - 커스텀 충돌 감지 및 총알 궤적
3. **AI 시스템** - 적 경로 탐색 및 행동 트리
4. **입력 매니저** - 멀티 플랫폼 지원 (키보드/마우스/터치)
5. **상태 매니저** - 게임 흐름 및 씬 전환
6. **오디오/비주얼 효과** - 파티클 시스템 및 애니메이션

### 프로젝트 구조
```
Shooting-game/
├── css/
│   ├── animations.css    # 애니메이션 키프레임
│   └── styles.css        # 기본 스타일
├── js/
│   ├── classes/          # 게임 엔티티 클래스
│   │   ├── Particle.js   # 파티클 효과
│   │   ├── HealthPack.js # 체력 회복 아이템
│   │   ├── PowerUp.js    # 파워업 버프
│   │   ├── Explosion.js  # 폭발 효과
│   │   ├── Bullet.js     # 총알 발사체 (7종)
│   │   ├── Enemy.js      # 적 AI
│   │   └── Player.js     # 플레이어 캐릭터
│   ├── utils/            # 유틸리티 모듈
│   │   ├── config.js     # 게임 설정
│   │   ├── ui.js         # UI 관리
│   │   ├── input.js      # 입력 처리 (키보드/마우스/터치)
│   │   ├── collision.js  # 충돌 감지
│   │   ├── rankings.js   # 리더보드 시스템
│   │   ├── shop.js       # 무기 상점
│   │   └── customization.js # 캐릭터 커스터마이징
│   ├── game.js           # 메인 게임 루프
│   └── main.js           # 초기화
├── index.html            # 게임 UI 구조
└── README.md             # 문서
```

## 상세 아키텍처

### 시스템 개요

```
┌─────────────────────────────────────────────────────────────┐
│                    게임 루프 (60 FPS)                         │
│                       (game.js)                              │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐      ┌─────────┐
│  입력   │      │  상태   │
│ 매니저  │      │ 매니저  │
│(input.js)│     │(gameState)│
└─────────┘      └─────────┘
    │                 │
    │                 ▼
    │         ┌───────────────┐
    │         │   엔티티      │
    │         ├───────────────┤
    │         │ Player        │◄─────┐
    │         │ Enemy         │      │
    │         │ Bullet        │      │ 의존성 주입
    │         │ Particle      │      │ (gameState 참조)
    │         │ HealthPack    │      │
    │         │ PowerUp       │      │
    │         │ Explosion     │◄─────┘
    │         └───────────────┘
    │                 │
    └────────┬────────┘
             ▼
    ┌────────────────┐
    │   충돌 감지    │
    │ (collision.js) │
    └────────────────┘
             │
             ▼
    ┌────────────────┐
    │  UI 렌더러     │
    │    (ui.js)     │
    └────────────────┘
```

### 모듈 의존성 그래프

```
main.js (진입점)
  ├─→ game.js (게임 루프)
  │     ├─→ classes/Player.js
  │     ├─→ classes/Enemy.js
  │     ├─→ classes/Bullet.js
  │     ├─→ classes/Particle.js
  │     ├─→ classes/HealthPack.js
  │     ├─→ classes/PowerUp.js
  │     ├─→ classes/Explosion.js
  │     ├─→ utils/collision.js
  │     ├─→ utils/ui.js
  │     └─→ utils/config.js
  │
  ├─→ utils/input.js
  ├─→ utils/shop.js
  ├─→ utils/rankings.js
  └─→ utils/customization.js
```

### 클래스 계층 구조

```
엔티티 클래스 (상속 없음 - 컴포지션 패턴)
│
├─ Player
│  ├─ 속성: position, health, weapon, powerUps
│  ├─ 메서드: update(), draw(), shoot(), reload()
│  └─ 의존성: gameState (bullets, particles)
│
├─ Enemy
│  ├─ 속성: position, health, speed, difficulty
│  ├─ 메서드: update(), draw(), takeDamage()
│  └─ AI: 플레이어 추적, 거리 유지, 발사
│
├─ Bullet
│  ├─ 속성: position, angle, type, damage, trail
│  ├─ 타입: normal, sniper, laser, rocket, railgun, plasma
│  └─ 메서드: update(), draw(), physics
│
├─ Particle
│  ├─ 속성: position, velocity, color, lifetime
│  └─ 물리: 중력, 마찰, 알파 페이드
│
├─ HealthPack
│  ├─ 속성: position, lifetime
│  └─ 메서드: checkCollision(), draw()
│
├─ PowerUp
│  ├─ 속성: type, position, lifetime
│  └─ 타입: speed, damage, shield, multiburst, doubleburst
│
└─ Explosion
   ├─ 속성: position, radius, lifetime
   └─ 비주얼: 페이드 효과가 있는 확장 원
```

### 데이터 흐름

```
사용자 입력
    │
    ▼
입력 매니저 (input.js)
    │
    ├─ 키보드 상태 (WASD, R)
    ├─ 마우스 상태 (위치, 클릭)
    └─ 터치 상태 (조이스틱)
    │
    ▼
게임 루프 (game.js의 gameLoop)
    │
    ├─→ Player.update(inputState)
    │      │
    │      ├─→ 이동 계산
    │      ├─→ 무기 쿨다운
    │      └─→ 파워업 타이머
    │
    ├─→ Player.shoot(mousePos)
    │      │
    │      └─→ gameState.bullets.push(new Bullet())
    │
    ├─→ Enemy.update(player, bullets)
    │      │
    │      ├─→ AI 경로 탐색
    │      └─→ 적 발사
    │
    ├─→ Bullet.update()
    │      │
    │      └─→ 위치 += 속도
    │
    ├─→ checkCollisions(gameState)
    │      │
    │      ├─→ 총알 vs 적
    │      ├─→ 총알 vs 플레이어
    │      ├─→ 플레이어 vs 아이템
    │      └─→ 적 vs 플레이어
    │
    ├─→ 모든 엔티티 .draw(ctx)
    │
    └─→ updateHUD(gameState)
```

### 상태 관리

```javascript
window.gameState = {
  // 게임 제어
  gameRunning: boolean,
  gamePaused: boolean,
  
  // 통계
  kills: number,
  currentLevel: number,
  coins: number,
  currentGameCoins: number,
  
  // 난이도
  currentDifficulty: 'easy' | 'normal' | 'hard',
  
  // 엔티티 (배열)
  player: Player,
  enemies: Enemy[],
  bullets: Bullet[],
  particles: Particle[],
  healthPacks: HealthPack[],
  powerUps: PowerUp[],
  explosions: Explosion[],
  
  // 진행 상황
  unlockedWeapons: string[],
  playerCustomization: {
    mainColor: string,
    secondaryColor: string
  },
  
  // 타이머
  spawnEnemyTimeout: number
}
```

### 주요 디자인 패턴

#### 1. 의존성 주입
```javascript
// Player가 gameState 참조를 받음
class Player {
  constructor(width, height, gameState) {
    this.gameState = gameState;
  }
  
  shoot(mousePos) {
    // 공유 상태에 직접 접근
    this.gameState.bullets.push(new Bullet(...));
    this.gameState.particles.push(new Particle(...));
  }
}
```

#### 2. 상태 동기화
```javascript
// game.js가 단일 진실의 원천 유지
function startGame() {
  state.player = new Player(width, height, state);
  // Player가 state 배열에 직접 참조
  // window.bullets 동기화 불필요
}
```

#### 3. 이벤트 기반 입력
```javascript
// input.js
const inputState = {
  keys: {},
  mouseX: 0,
  mouseY: 0,
  mouseDown: false
};

function getInputState() {
  return inputState; // 읽기 전용 접근
}
```

#### 4. 상속보다 컴포지션
```javascript
// 클래스 상속 없음 - 각 엔티티는 독립적
// 유틸리티 함수를 통한 공유 동작
function checkCollision(entity1, entity2) {
  const dx = entity1.x - entity2.x;
  const dy = entity1.y - entity2.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < entity1.size + entity2.size;
}
```

### 성능 최적화

1. **객체 풀링 고려사항**
   - 파티클과 총알은 filter()를 사용하지만 풀 사용 가능
   - 현재: 초당 ~5000개 객체 생성
   - 향후: 100+ 적에서 60fps 안정성을 위한 풀 구현

2. **공간 분할**
   - 현재: O(n²) 충돌 감지
   - 최적화 대상: <50개 동시 엔티티
   - 향후: >100개 엔티티를 위한 Quadtree

3. **렌더링 최적화**
   - 메모리 누수 방지를 위한 트레일 배열 제한
   - 프레임당 섀도우 블러 캐싱
   - 효율적인 캔버스 상태 저장/복원

4. **메모리 관리**
   - 매 프레임 배열 필터링 (불변 패턴)
   - updateHUD()에서 일괄 DOM 업데이트
   - 게임 종료 시 이벤트 리스너 정리

### 성능
- requestAnimationFrame을 사용한 최적화된 렌더링 파이프라인
- 효율적인 O(n²) 충돌 감지 (<50개 엔티티에 적합)
- 자동 정리 기능이 있는 트레일 시스템
- 수명 관리가 있는 파티클 시스템
- 최신 하드웨어에서 60 FPS 목표 유지

## 게임 메커니즘

### 점수 시스템
- 적을 처치하여 킬 수 증가
- 20킬당 10코인 보상
- 코인으로 새로운 무기 해금

### 난이도 진행
- 레벨에 따라 적 수 증가
- 더 높은 레벨은 웨이브당 더 많은 적 생성
- 동적 난이도 스케일링

### 전투 시스템
- 실시간 총알 물리
- 거리 기반 히트 감지
- 무기별 특정 데미지 값
- 쿨다운이 있는 재장전 메커니즘

## 개발 가이드

### 새 무기 추가하기

1. **`js/utils/config.js`에 무기 설정 정의**:
```javascript
{
  name: "새 무기",
  description: "설명",
  cost: 1000,
  borderColor: "#color",
  textColor: "#color"
}
```

2. **`Player.setWeapon()`에 무기 스탯 추가**:
```javascript
else if (weaponType === 'newweapon') {
  this.maxAmmo = 30;
  this.shootCooldownMax = 10;
  this.bulletType = 'normal';
  // ... 기타 스탯
}
```

3. **커스텀 타입인 경우 `Bullet.draw()`에서 총알 렌더링 처리**

### 새 파워업 추가하기

1. **`js/classes/PowerUp.js`의 PowerUp 타입에 추가**
2. **`Player.applyPowerUp()`에서 처리**
3. **타이머를 위해 `Player.update()`에서 업데이트**
4. **`Player.draw()`에 비주얼 효과 추가**

### 디버깅 팁

- 에러 로그를 위해 브라우저 콘솔 활성화
- 상태 검사를 위해 `window.gameState` 확인
- 독립 컴포넌트 테스트를 위해 `test.html` 사용
- 브라우저 DevTools로 FPS 모니터링

### 코드 스타일

- ES6+ 기능 사용 (클래스, 화살표 함수, const/let)
- 모든 함수에 JSDoc 주석
- 복잡한 로직에 한국어 주석
- 2칸 들여쓰기
- 명확한 변수명

## 브라우저 호환성

| 브라우저 | 지원 |
|---------|-----------|
| Chrome | 예 |
| Firefox | 예 |
| Safari | 예 |
| Edge | 예 |
| Opera | 예 |

## 알려진 이슈

- 일부 기기에서 모바일 컨트롤이 조정이 필요할 수 있음
- 높은 파티클 수 (>500)가 구형 브라우저의 성능에 영향을 줄 수 있음

## 로드맵

### 완료 ✅
- [x] 모듈형 아키텍처 리팩토링
- [x] 독특한 메커니즘을 가진 12+ 무기 타입
- [x] 총알 궤적 시각화
- [x] 조준선 미리보기 시스템
- [x] 재장전 진행 표시기
- [x] 파워업 시스템 (6종)
- [x] 난이도 레벨 (이지/노멀/하드)
- [x] 캐릭터 커스터마이징
- [x] Data SDK를 사용한 리더보드
- [x] 모바일 터치 컨트롤
- [x] 파티클 효과 시스템
- [x] 한국어 코드 문서화

### 진행 중 🚧
- [ ] 성능 최적화 (객체 풀링)
- [ ] 사운드 효과 통합
- [ ] 추가 비주얼 효과

### 계획됨 📋
- [ ] 다양한 적 타입 (빠른 적, 탱크, 사수)
- [ ] 10레벨마다 보스전
- [ ] 업적 시스템
- [ ] 서바이벌 모드 (무한 웨이브)
- [ ] 협동 멀티플레이어
- [ ] 맵 장애물 및 엄폐물 시스템
- [ ] 무기 개조 시스템
- [ ] 일일 챌린지

## 기여하기

기여를 환영합니다! 다음 가이드라인을 따라주세요:

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/멋진기능`)
3. 변경사항 커밋 (`git commit -m '멋진기능 추가'`)
4. 브랜치에 푸시 (`git push origin feature/멋진기능`)
5. Pull Request 열기

## 라이선스

이 프로젝트는 오픈소스이며 MIT 라이선스에 따라 사용 가능합니다.

## 크레딧

- **개발자**: shinyubin1015
- **게임 엔진**: 커스텀 HTML5 Canvas
- **UI 프레임워크**: Tailwind CSS
- **SDK 통합**: Element SDK, Data SDK

## 연락처

- GitHub: [@shinyubin1015](https://github.com/shinyubin1015)
- 저장소: [Shooting-game](https://github.com/shinyubin1015/Shooting-game)

---

**최종 업데이트**: 2025년 12월  
**버전**: 2.0.0 (모듈형 아키텍처 릴리스)
