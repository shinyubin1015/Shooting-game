/**
 * UI 관련 함수들
 * HUD 업데이트, 화면 표시, 히트마커 등
 */

/**
 * HUD (체력, 탄약, 처치, 레벨 등) 업데이트
 * @param {Object} gameState - 게임 상태 객체
 */
function updateHUD(gameState) {
  const { player, kills, currentLevel, coins } = gameState;
  
  if (!player) return;
  
  // 체력 표시 업데이트
  document.getElementById('healthDisplay').textContent = Math.max(0, player.health);
  document.getElementById('healthFill').style.width = Math.max(0, player.health) + '%';
  
  // 탄약 표시 업데이트
  document.getElementById('currentAmmo').textContent = player.ammo;
  document.getElementById('reserveAmmo').textContent = player.reserveAmmo;
  
  // 처치, 레벨, 코인 표시 업데이트
  document.getElementById('killCount').textContent = kills;
  document.getElementById('levelDisplay').textContent = currentLevel;
  document.getElementById('coinDisplay').textContent = coins;
  document.getElementById('mainMenuCoins').textContent = coins;
  document.getElementById('shopCoinsDisplay').textContent = coins;
}

/**
 * 일시정지 화면 통계 업데이트
 * @param {Object} gameState - 게임 상태 객체
 */
function updatePauseStats(gameState) {
  const { player, kills, currentLevel, coins } = gameState;
  
  document.getElementById('pauseKills').textContent = kills;
  document.getElementById('pauseLevel').textContent = currentLevel;
  document.getElementById('pauseHealth').textContent = Math.max(0, player ? player.health : 0);
  document.getElementById('pauseCoins').textContent = coins;
}

/**
 * 재장전 텍스트 및 진행률 표시/숨김
 * @param {boolean} show - 표시 여부
 * @param {number} progress - 재장전 진행률 (0-1)
 */
function showReloadText(show, progress = 0) {
  const reloadText = document.getElementById('reloadText');
  const reloadBarContainer = document.getElementById('reloadBarContainer');
  const reloadBar = document.getElementById('reloadBar');
  
  if (show) {
    reloadText.classList.remove('hidden');
    reloadBarContainer.classList.remove('hidden');
    
    // 진행률 퍼센티지 표시
    const percentage = Math.floor(progress * 100);
    reloadText.textContent = `재장전 중... ${percentage}%`;
    
    // 진행 바 업데이트
    reloadBar.style.width = (progress * 100) + '%';
  } else {
    reloadText.classList.add('hidden');
    reloadBarContainer.classList.add('hidden');
    reloadText.textContent = '재장전 중...';
    reloadBar.style.width = '0%';
  }
}

/**
 * 히트마커 표시 (적 명중 시)
 * @param {number} x - 화면 X 좌표
 * @param {number} y - 화면 Y 좌표
 */
function showHitMarker(x, y) {
  const marker = document.createElement('div');
  marker.className = 'absolute hitmarker';
  marker.style.left = x + 'px';
  marker.style.top = y + 'px';
  marker.style.width = '30px';
  marker.style.height = '30px';
  marker.innerHTML = `
    <div class="absolute w-3 h-0.5 bg-white" style="left: 0; top: 50%; transform: translateY(-50%) rotate(45deg);"></div>
    <div class="absolute w-3 h-0.5 bg-white" style="right: 0; top: 50%; transform: translateY(-50%) rotate(-45deg);"></div>
    <div class="absolute w-0.5 h-3 bg-white" style="left: 50%; top: 0; transform: translateX(-50%) rotate(45deg);"></div>
    <div class="absolute w-0.5 h-3 bg-white" style="left: 50%; bottom: 0; transform: translateX(-50%) rotate(-45deg);"></div>
  `;
  document.getElementById('hitMarkers').appendChild(marker);
  
  // 300ms 후 제거
  setTimeout(() => marker.remove(), 300);
}

/**
 * 데미지 플래시 효과
 */
function showDamageFlash() {
  const damageFlash = document.getElementById('damageFlash');
  damageFlash.style.opacity = '0.3';
  damageFlash.classList.remove('damage-flash');
  void damageFlash.offsetWidth; // 리플로우 강제
  damageFlash.classList.add('damage-flash');
  setTimeout(() => damageFlash.style.opacity = '0', 200);
}

/**
 * 게임 오버 화면 표시
 * @param {Object} gameState - 게임 상태 객체
 */
function showGameOver(gameState) {
  const { kills, currentDifficulty } = gameState;
  
  document.getElementById('finalKills').textContent = kills;
  
  // 난이도 배지 설정
  const difficultyBadge = document.getElementById('difficultyBadge');
  if (currentDifficulty === 'easy') {
    difficultyBadge.textContent = '😊 이지 모드';
    difficultyBadge.className = 'inline-block px-6 py-2 rounded-full text-xl font-bold mb-3 bg-green-600 text-white';
  } else if (currentDifficulty === 'normal') {
    difficultyBadge.textContent = '😎 보통 모드';
    difficultyBadge.className = 'inline-block px-6 py-2 rounded-full text-xl font-bold mb-3 bg-cyan-600 text-white';
  } else if (currentDifficulty === 'hard') {
    difficultyBadge.textContent = '😈 하드 모드';
    difficultyBadge.className = 'inline-block px-6 py-2 rounded-full text-xl font-bold mb-3 bg-red-600 text-white';
  }
  
  // 버튼 초기화
  const saveBtn = document.getElementById('saveScoreBtn');
  saveBtn.disabled = false;
  saveBtn.textContent = '기록 저장';
  
  document.getElementById('gameOver').classList.remove('hidden');
}

/**
 * 무기 업그레이드 화면 표시
 * @param {Array} unlockedWeapons - 잠금 해제된 무기 목록
 */
function showUpgradeScreen(unlockedWeapons) {
  const weaponSelection = document.getElementById('weaponSelection');
  weaponSelection.innerHTML = '';
  
  // 잠금 해제된 무기만 필터링
  const unlockedConfigs = weaponConfigs.filter(weapon => unlockedWeapons.includes(weapon.id));
  
  // 각 무기 버튼 생성
  unlockedConfigs.forEach(weapon => {
    const btn = document.createElement('button');
    btn.className = 'upgrade-btn pointer-events-auto cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105';
    btn.style.cssText = weapon.bgStyle + ` border-color: ${weapon.borderColor};`;
    btn.setAttribute('data-weapon', weapon.id);
    btn.innerHTML = `
      <div style="color: ${weapon.textColor};" class="text-3xl font-bold mb-2">${weapon.name}</div>
      <div class="text-white text-base mb-2">${weapon.desc}</div>
      <div class="text-gray-300 text-sm">탄창: ${weapon.ammo}</div>
      <div class="text-gray-300 text-sm">연사 속도: ${weapon.speed}</div>
    `;
    weaponSelection.appendChild(btn);
  });
  
  document.getElementById('upgradeScreen').classList.remove('hidden');
}

/**
 * 무기 업그레이드 화면 숨김
 */
function hideUpgradeScreen() {
  document.getElementById('upgradeScreen').classList.add('hidden');
}

/**
 * 난이도 이름 가져오기
 * @param {string} difficulty - 난이도 (easy, normal, hard)
 * @returns {string} - 난이도 표시 이름
 */
function getDifficultyName(difficulty) {
  if (difficulty === 'easy') return '😊 이지';
  if (difficulty === 'normal') return '😎 보통';
  if (difficulty === 'hard') return '😈 하드';
  return '😎 보통';
}
