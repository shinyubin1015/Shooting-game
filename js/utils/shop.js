/**
 * 무기 상점 시스템
 * 무기 구매, 잠금 해제, UI 업데이트
 */

/**
 * 상점 화면 표시 업데이트
 * @param {Object} gameState - 게임 상태 객체
 */
function updateShopDisplay(gameState) {
  document.getElementById('shopCoinsDisplay').textContent = gameState.coins;
  document.getElementById('mainMenuCoins').textContent = gameState.coins;
  
  // 각 무기 버튼 상태 업데이트
  document.querySelectorAll('.buy-weapon-btn').forEach(btn => {
    const weapon = btn.getAttribute('data-weapon');
    const cost = parseInt(btn.getAttribute('data-cost'));
    const item = btn.closest('.weapon-shop-item');
    const overlay = item.querySelector('.locked-overlay');
    
    // 이미 구매한 무기
    if (gameState.unlockedWeapons.includes(weapon)) {
      btn.disabled = true;
      btn.textContent = '구매 완료';
      btn.classList.remove('bg-green-600', 'hover:bg-green-500');
      btn.classList.add('bg-gray-600');
      overlay.classList.remove('hidden');
    }
    // 코인 부족
    else if (gameState.coins < cost) {
      btn.disabled = true;
      btn.classList.remove('bg-green-600', 'hover:bg-green-500');
      btn.classList.add('bg-gray-600');
    }
    // 구매 가능
    else {
      btn.disabled = false;
      btn.classList.remove('bg-gray-600');
      btn.classList.add('bg-green-600', 'hover:bg-green-500');
    }
  });
}

/**
 * 무기 구매 처리
 * @param {Object} gameState - 게임 상태 객체
 * @param {string} weaponId - 무기 ID
 * @param {number} cost - 무기 가격
 * @returns {boolean} - 구매 성공 여부
 */
function buyWeapon(gameState, weaponId, cost) {
  // 이미 보유중이거나 코인이 부족하면 구매 불가
  if (gameState.unlockedWeapons.includes(weaponId) || gameState.coins < cost) {
    return false;
  }
  
  // 코인 차감 및 무기 잠금 해제
  gameState.coins -= cost;
  gameState.unlockedWeapons.push(weaponId);
  
  // 화면 업데이트
  updateShopDisplay(gameState);
  
  return true;
}

/**
 * 상점 이벤트 리스너 설정
 * @param {Object} gameState - 게임 상태 객체
 */
function setupShopEventListeners(gameState) {
  // 상점 열기 버튼
  document.getElementById('weaponShopBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('weaponShopScreen').classList.remove('hidden');
    updateShopDisplay(gameState);
  });
  
  // 상점 닫기 버튼
  document.getElementById('closeShopBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('weaponShopScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
  });
  
  // 무기 구매 버튼들
  document.querySelectorAll('.buy-weapon-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const weapon = btn.getAttribute('data-weapon');
      const cost = parseInt(btn.getAttribute('data-cost'));
      
      buyWeapon(gameState, weapon, cost);
    });
  });
}
