/**
 * 메인 초기화 파일
 * 게임 시작 시 모든 시스템을 초기화하고 이벤트 리스너 설정
 */

// 전역 변수
window.viewingDifficulty = 'easy';

/**
 * 페이지 로드 시 초기화
 */
window.addEventListener('DOMContentLoaded', () => {
  // 캔버스 초기화
  window.gameCanvas = document.getElementById('gameCanvas');
  window.gameCtx = window.gameCanvas.getContext('2d');
  
  // 캔버스 크기 조정
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // 입력 시스템 초기화
  initializeInput(window.gameCanvas);
  
  // Data SDK 초기화
  initDataSdk();
  
  // 코인 표시 초기화
  document.getElementById('mainMenuCoins').textContent = window.gameState.coins;
  
  // 모든 이벤트 리스너 설정
  setupGameEventListeners();
  setupShopEventListeners(window.gameState);
  setupRankingsEventListeners();
  setupCustomizationEventListeners();
  setupDifficultyEventListeners();
  setupPauseEventListeners();
  
  // Element SDK 초기화
  initializeElementSDK();
});

/**
 * 게임 관련 이벤트 리스너 설정
 */
function setupGameEventListeners() {
  const state = window.gameState;
  
  // 게임 시작 버튼
  document.getElementById('startGameBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('difficultyScreen').classList.remove('hidden');
  });
  
  // 재시작 버튼 (게임 오버)
  document.getElementById('restartBtn').addEventListener('click', (e) => {
    e.preventDefault();
    startGame();
  });
  
  // 홈으로 버튼
  document.getElementById('backToHomeBtn').addEventListener('click', (e) => {
    e.preventDefault();
    backToHome();
  });
  
  // 무기 업그레이드 선택 (동적으로 생성되므로 이벤트 위임 사용)
  document.getElementById('weaponSelection').addEventListener('click', (e) => {
    const btn = e.target.closest('.upgrade-btn');
    if (btn) {
      e.preventDefault();
      const weaponType = btn.getAttribute('data-weapon');
      upgradeWeapon(weaponType);
    }
  });
  
  // 키보드 R키로 재장전
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'r' || e.key === 'R') && state.gameRunning && state.player) {
      state.player.reload();
    }
  });
  
  // 모바일 재장전 이벤트
  window.addEventListener('mobileReload', () => {
    if (state.player && state.gameRunning) {
      state.player.reload();
    }
  });
}

/**
 * 난이도 선택 이벤트 리스너 설정
 */
function setupDifficultyEventListeners() {
  const state = window.gameState;
  
  // 이지 모드
  document.getElementById('easyModeBtn').addEventListener('click', (e) => {
    e.preventDefault();
    state.currentDifficulty = 'easy';
    document.getElementById('difficultyScreen').classList.add('hidden');
    startGame();
  });
  
  // 보통 모드
  document.getElementById('normalModeBtn').addEventListener('click', (e) => {
    e.preventDefault();
    state.currentDifficulty = 'normal';
    document.getElementById('difficultyScreen').classList.add('hidden');
    startGame();
  });
  
  // 하드 모드
  document.getElementById('hardModeBtn').addEventListener('click', (e) => {
    e.preventDefault();
    state.currentDifficulty = 'hard';
    document.getElementById('difficultyScreen').classList.add('hidden');
    startGame();
  });
  
  // 뒤로 가기
  document.getElementById('backFromDifficultyBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('difficultyScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
  });
}

/**
 * 랭킹 화면 이벤트 리스너 설정
 */
function setupRankingsEventListeners() {
  const state = window.gameState;
  
  // 랭킹 화면 열기
  document.getElementById('viewRankingsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('rankingsScreen').classList.remove('hidden');
    window.viewingDifficulty = 'easy';
    displayMainRankings(window.viewingDifficulty);
    updateDifficultyTabs();
  });
  
  // 랭킹 화면 닫기
  document.getElementById('backFromRankingsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('rankingsScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
  });
  
  // 난이도 탭 전환
  document.getElementById('easyTab').addEventListener('click', (e) => {
    e.preventDefault();
    window.viewingDifficulty = 'easy';
    displayMainRankings(window.viewingDifficulty);
    updateDifficultyTabs();
  });
  
  document.getElementById('normalTab').addEventListener('click', (e) => {
    e.preventDefault();
    window.viewingDifficulty = 'normal';
    displayMainRankings(window.viewingDifficulty);
    updateDifficultyTabs();
  });
  
  document.getElementById('hardTab').addEventListener('click', (e) => {
    e.preventDefault();
    window.viewingDifficulty = 'hard';
    displayMainRankings(window.viewingDifficulty);
    updateDifficultyTabs();
  });
  
  // 점수 저장
  document.getElementById('saveScoreBtn').addEventListener('click', (e) => {
    e.preventDefault();
    saveScore(state, false);
  });
  
  // 기록 갱신
  document.getElementById('updateRecordBtn').addEventListener('click', (e) => {
    e.preventDefault();
    saveScore(state, true);
  });
  
  // 둘 다 유지
  document.getElementById('keepBothBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    document.getElementById('duplicateNameWarning').classList.add('hidden');
    
    if (!window.dataSdk || !dataInitialized) return;
    
    const nameInput = document.getElementById('playerNameInput');
    const playerName = nameInput.value.trim() || '무명의 전사';
    
    const saveBtn = document.getElementById('saveScoreBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = '저장 중...';
    
    const newRecord = {
      name: playerName,
      kills: state.kills,
      level: state.currentLevel,
      difficulty: state.currentDifficulty,
      date: new Date().toISOString()
    };
    
    const result = await window.dataSdk.create(newRecord);
    
    if (result.isOk) {
      nameInput.value = '';
    } else {
      saveBtn.disabled = false;
      saveBtn.textContent = '기록 저장';
    }
  });
}

/**
 * 난이도 탭 UI 업데이트
 */
function updateDifficultyTabs() {
  // 모든 탭 비활성화
  document.querySelectorAll('.difficulty-tab').forEach(tab => {
    tab.classList.remove('bg-green-600', 'bg-cyan-600', 'bg-red-600', 'border-green-400', 'border-cyan-400', 'border-red-400', 'text-white');
    tab.classList.add('bg-gray-700', 'border-gray-600', 'text-gray-300');
  });
  
  // 선택된 탭 활성화
  if (window.viewingDifficulty === 'easy') {
    document.getElementById('easyTab').classList.remove('bg-gray-700', 'border-gray-600', 'text-gray-300');
    document.getElementById('easyTab').classList.add('bg-green-600', 'border-green-400', 'text-white');
  } else if (window.viewingDifficulty === 'normal') {
    document.getElementById('normalTab').classList.remove('bg-gray-700', 'border-gray-600', 'text-gray-300');
    document.getElementById('normalTab').classList.add('bg-cyan-600', 'border-cyan-400', 'text-white');
  } else if (window.viewingDifficulty === 'hard') {
    document.getElementById('hardTab').classList.remove('bg-gray-700', 'border-gray-600', 'text-gray-300');
    document.getElementById('hardTab').classList.add('bg-red-600', 'border-red-400', 'text-white');
  }
}

/**
 * 일시정지 관련 이벤트 리스너 설정
 */
function setupPauseEventListeners() {
  // 일시정지 버튼
  document.getElementById('pauseBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (window.gameState.gameRunning && !window.gameState.gamePaused) {
      pauseGame();
    }
  });
  
  // 이어하기
  document.getElementById('resumeBtn').addEventListener('click', (e) => {
    e.preventDefault();
    resumeGame();
  });
  
  // 재시작
  document.getElementById('restartFromPauseBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('pauseMenuScreen').classList.add('hidden');
    window.gameState.gamePaused = false;
    startGame();
  });
  
  // 메인 페이지로
  document.getElementById('homeFromPauseBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('pauseMenuScreen').classList.add('hidden');
    window.gameState.gamePaused = false;
    window.gameState.gameRunning = false;
    
    if (window.gameState.spawnEnemyTimeout) {
      clearTimeout(window.gameState.spawnEnemyTimeout);
    }
    
    document.getElementById('startScreen').classList.remove('hidden');
    document.getElementById('mainMenuCoins').textContent = window.gameState.coins;
  });
}

/**
 * Element SDK 초기화
 */
function initializeElementSDK() {
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig: defaultConfig,
      onConfigChange: (config) => {
        const titleElement = document.getElementById('gameTitle');
        if (titleElement) {
          titleElement.textContent = config.game_title || defaultConfig.game_title;
        }
        
        const controlsElement = document.getElementById('controlsText');
        if (controlsElement) {
          controlsElement.textContent = config.controls_guide || defaultConfig.controls_guide;
        }
      },
      mapToCapabilities: (config) => ({
        recolorables: [
          {
            get: () => config.background_color || defaultConfig.background_color,
            set: (value) => {
              config.background_color = value;
              window.elementSdk.setConfig({ background_color: value });
            }
          },
          {
            get: () => config.player_color || defaultConfig.player_color,
            set: (value) => {
              config.player_color = value;
              window.elementSdk.setConfig({ player_color: value });
            }
          },
          {
            get: () => config.enemy_color || defaultConfig.enemy_color,
            set: (value) => {
              config.enemy_color = value;
              window.elementSdk.setConfig({ enemy_color: value });
            }
          },
          {
            get: () => config.bullet_color || defaultConfig.bullet_color,
            set: (value) => {
              config.bullet_color = value;
              window.elementSdk.setConfig({ bullet_color: value });
            }
          },
          {
            get: () => config.ui_accent || defaultConfig.ui_accent,
            set: (value) => {
              config.ui_accent = value;
              window.elementSdk.setConfig({ ui_accent: value });
            }
          }
        ],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
      }),
      mapToEditPanelValues: (config) => new Map([
        ["game_title", config.game_title || defaultConfig.game_title],
        ["controls_guide", config.controls_guide || defaultConfig.controls_guide]
      ])
    });
  }
}
