/**
 * 메인 게임 로직
 * 게임 루프, 상태 관리, 적 생성, 게임 시작/종료
 */

// 전역 게임 상태
window.gameState = {
  // 게임 실행 상태
  gameRunning: false,
  gamePaused: false,
  
  // 게임 통계
  kills: 0,
  currentLevel: 1,
  coins: 0,
  currentGameCoins: 0,
  
  // 난이도
  currentDifficulty: 'normal',
  
  // 엔티티 배열
  player: null,
  enemies: [],
  bullets: [],
  particles: [],
  healthPacks: [],
  powerUps: [],
  explosions: [],
  
  // 무기 및 커스터마이징
  unlockedWeapons: ['assault', 'shotgun', 'smg'],
  playerCustomization: { mainColor: '#22d3ee', secondaryColor: '#1e293b' },
  
  // 적 생성 타이머
  spawnEnemyTimeout: null
};

// 캔버스 전역 참조
window.gameCanvas = null;
window.gameCtx = null;
window.gameRunning = false;

/**
 * 캔버스 크기 조정
 */
function resizeCanvas() {
  const canvas = window.gameCanvas;
  if (canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
}

/**
 * 적 생성
 */
function spawnEnemy() {
  const { gameRunning, currentLevel, currentDifficulty, enemies } = window.gameState;
  
  if (!gameRunning) return;
  
  const canvas = window.gameCanvas;
  
  // 레벨에 따라 한 번에 생성되는 적 수 증가 (최대 4마리)
  const enemiesPerSpawn = Math.min(1 + Math.floor(currentLevel / 3), 4);
  for (let i = 0; i < enemiesPerSpawn; i++) {
    enemies.push(new Enemy(canvas.width, canvas.height, currentLevel, currentDifficulty, difficultySettings));
  }
  
  // 다음 생성 시간 설정 (레벨이 높을수록 빠르게 생성)
  const difficulty = difficultySettings[currentDifficulty];
  const baseDelay = Math.max(400, 1200 - currentLevel * 50) * difficulty.spawnDelayMultiplier;
  const randomDelay = Math.random() * 300;
  window.gameState.spawnEnemyTimeout = setTimeout(spawnEnemy, baseDelay + randomDelay);
}

/**
 * 게임 루프
 */
function gameLoop() {
  const state = window.gameState;
  
  if (!state.gameRunning || state.gamePaused) return;
  
  const canvas = window.gameCanvas;
  const ctx = window.gameCtx;
  const config = window.elementSdk?.config || defaultConfig;
  const inputState = getInputState();
  
  // 배경 그리기
  ctx.fillStyle = config.background_color || defaultConfig.background_color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 그리드 그리기
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 60) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
  
  // 파티클 업데이트 및 그리기
  state.particles = state.particles.filter(p => {
    const dead = p.update();
    if (!dead) p.draw(ctx);
    return !dead;
  });
  
  // 폭발 업데이트 및 그리기
  state.explosions = state.explosions.filter(exp => {
    const dead = exp.update();
    if (!dead) exp.draw(ctx);
    return !dead;
  });
  
  // 체력팩 업데이트 및 그리기
  state.healthPacks = state.healthPacks.filter(pack => {
    const expired = pack.update();
    if (!expired) pack.draw(ctx);
    return !expired;
  });
  
  // 파워업 업데이트 및 그리기
  state.powerUps = state.powerUps.filter(powerUp => {
    const expired = powerUp.update();
    if (!expired) powerUp.draw(ctx);
    return !expired;
  });
  
  // 플레이어 업데이트 및 그리기
  if (state.player) {
    const mousePos = {
      x: inputState.isMobile && inputState.rightJoystick.active ? 
        state.player.x + Math.cos(Math.atan2(inputState.rightJoystick.y, inputState.rightJoystick.x)) * 200 :
        inputState.mouseX,
      y: inputState.isMobile && inputState.rightJoystick.active ?
        state.player.y + Math.sin(Math.atan2(inputState.rightJoystick.y, inputState.rightJoystick.x)) * 200 :
        inputState.mouseY
    };
    
    state.player.update(
      inputState.keys,
      mousePos,
      inputState.mouseDown,
      inputState.isMobile ? inputState.leftJoystick : null,
      canvas.width,
      canvas.height
    );
    
    // 재장전 UI 업데이트 (진행률 포함)
    if (state.player.reloading) {
      // 재장전 진행률 계산 (0-1)
      const progress = 1 - (state.player.reloadTime / state.player.reloadTimeMax);
      showReloadText(true, progress);
    } else {
      showReloadText(false, 0);
    }
    
    // 조준선 그리기 (플레이어 뒤에)
    state.player.drawAimLine(ctx, mousePos);
    
    // 마우스 클릭 또는 조이스틱으로 발사
    if (inputState.mouseDown || (inputState.isMobile && inputState.rightJoystick.shooting)) {
      state.player.shoot(mousePos);
    }
    
    state.player.draw(ctx, mousePos, inputState.keys, state.playerCustomization);
    
    // 탄약이 모두 소진되면 레벨 업
    if (state.player.ammo === 0 && state.player.reserveAmmo === 0 && !state.player.reloading) {
      showUpgradeScreen(state.unlockedWeapons);
      state.gameRunning = false;
    }
    
    // 플레이어가 죽으면 게임 오버
    if (state.player.health <= 0) {
      endGame();
    }
  }
  
  // 적 업데이트 및 그리기
  state.enemies.forEach(enemy => {
    enemy.update(state.player, state.bullets);
    enemy.draw(ctx, state.player, config);
  });
  
  // 총알 업데이트 및 그리기
  state.bullets = state.bullets.filter(bullet => {
    const outOfBounds = bullet.update();
    if (!outOfBounds) bullet.draw(ctx, config);
    return !outOfBounds;
  });
  
  // 충돌 감지
  checkCollisions(state);
  
  // HUD 업데이트
  updateHUD(state);
  
  // 다음 프레임 요청
  requestAnimationFrame(gameLoop);
}

/**
 * 게임 시작
 */
function startGame() {
  const state = window.gameState;
  const canvas = window.gameCanvas;
  
  // 상태 초기화
  state.gameRunning = true;
  state.gamePaused = false;
  state.kills = 0;
  state.currentLevel = 1;
  state.currentGameCoins = 0;
  state.enemies = [];
  state.bullets = [];
  state.particles = [];
  state.healthPacks = [];
  state.powerUps = [];
  state.explosions = [];
  // 플레이어 생성 시 gameState를 전달하여 직접 참조하도록
  state.player = new Player(canvas.width, canvas.height, state);
  
  // 하위 호환성을 위한 전역 참조 (test.html 등)
  window.gameState = state;
  window.particles = state.particles;
  window.bullets = state.bullets;
  
  window.gameRunning = true;
  
  updateHUD(state);
  updateMobileControlsVisibility();
  
  // 기존 타이머 정리
  if (state.spawnEnemyTimeout) {
    clearTimeout(state.spawnEnemyTimeout);
  }
  
  // 화면 정리
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('gameOver').classList.add('hidden');
  document.getElementById('upgradeScreen').classList.add('hidden');
  document.getElementById('duplicateNameWarning').classList.add('hidden');
  document.getElementById('weaponShopScreen').classList.add('hidden');
  
  // 1초 후 적 생성 시작
  setTimeout(spawnEnemy, 1000);
  
  // 게임 루프 시작
  gameLoop();
}

/**
 * 게임 일시정지
 */
function pauseGame() {
  window.gameState.gamePaused = true;
  window.gameState.gameRunning = false;
  updatePauseStats(window.gameState);
  document.getElementById('pauseMenuScreen').classList.remove('hidden');
}

/**
 * 게임 재개
 */
function resumeGame() {
  window.gameState.gamePaused = false;
  window.gameState.gameRunning = true;
  document.getElementById('pauseMenuScreen').classList.add('hidden');
  gameLoop();
}

/**
 * 게임 종료
 */
function endGame() {
  const state = window.gameState;
  state.gameRunning = false;
  window.gameRunning = false;
  
  document.getElementById('mobileControls').classList.add('hidden');
  
  showGameOver(state);
  displayRankings(state);
}

/**
 * 무기 업그레이드 (레벨 업)
 * @param {string} weaponType - 선택한 무기 타입
 */
function upgradeWeapon(weaponType) {
  const state = window.gameState;
  
  if (state.player) {
    state.player.setWeapon(weaponType, state.currentLevel);
    state.currentLevel++;
    updateHUD(state);
    hideUpgradeScreen();
    
    // 게임 재개
    state.gameRunning = true;
    window.gameRunning = true;
    spawnEnemy();
    gameLoop();
  }
}

/**
 * 홈 화면으로 돌아가기
 */
function backToHome() {
  document.getElementById('gameOver').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
  document.getElementById('mainMenuCoins').textContent = window.gameState.coins;
}
