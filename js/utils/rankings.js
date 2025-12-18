/**
 * 랭킹 시스템
 * 기록 저장, 표시, 삭제 등 관리
 */

// 전역 랭킹 데이터
let allRankings = [];
let dataInitialized = false;
let currentPlayerName = '';

/**
 * Data SDK 초기화
 */
async function initDataSdk() {
  const dataHandler = {
    onDataChanged(data) {
      allRankings = data || [];
      
      // 게임 오버 화면이 열려있으면 랭킹 업데이트
      const gameOverVisible = !document.getElementById('gameOver').classList.contains('hidden');
      const rankingsVisible = !document.getElementById('rankingsScreen').classList.contains('hidden');
      
      if (gameOverVisible) {
        displayRankings(window.gameState);
      }
      
      if (rankingsVisible) {
        displayMainRankings(window.viewingDifficulty);
      }
    }
  };
  
  if (window.dataSdk) {
    const result = await window.dataSdk.init(dataHandler);
    if (result.isOk) {
      dataInitialized = true;
    } else {
      console.error('Data SDK 초기화 실패');
    }
  } else {
    // Data SDK가 없으면 로컬 스토리지 사용
    try {
      const localRanks = JSON.parse(localStorage.getItem('tactical_rankings') || '[]');
      if (Array.isArray(localRanks)) {
        allRankings = localRanks;
      }
    } catch (err) {
      console.warn('로컬 랭킹 로드 실패', err);
      allRankings = [];
    }
  }
}

/**
 * 게임 오버 화면에 랭킹 표시
 * @param {Object} gameState - 게임 상태 객체
 */
function displayRankings(gameState) {
  const rankingsList = document.getElementById('rankingsList');
  const currentRankings = allRankings.filter(r => r.difficulty === gameState.currentDifficulty);
  
  // 처치수 > 레벨 순으로 정렬
  currentRankings.sort((a, b) => {
    if (b.kills !== a.kills) return b.kills - a.kills;
    return b.level - a.level;
  });
  
  if (currentRankings.length === 0) {
    rankingsList.innerHTML = '<div class="text-gray-400 text-center py-4 text-lg">아직 기록이 없습니다</div>';
    return;
  }
  
  let html = '';
  // 상위 10명만 표시
  currentRankings.slice(0, 10).forEach((rank, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    const diffBadge = getDifficultyName(rank.difficulty || gameState.currentDifficulty);
    const isCurrentPlayer = rank.name === currentPlayerName;
    const deleteBtn = isCurrentPlayer && rank.__backendId ? 
      `<button class="delete-rank-btn pointer-events-auto cursor-pointer bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm ml-3 transition-all" data-rank-id="${rank.__backendId}">삭제</button>` : '';
    html += `
      <div class="flex justify-between items-center py-3 px-4 mb-2 bg-gray-800 bg-opacity-50 rounded ${index < 3 ? 'border border-yellow-600' : ''}">
        <div class="flex items-center gap-3">
          <span class="text-2xl w-10">${medal}</span>
          <span class="text-white text-xl font-bold">${rank.name}</span>
          <span class="text-gray-400 text-sm">${diffBadge}</span>
          ${deleteBtn}
        </div>
        <div class="flex gap-6">
          <span class="text-yellow-400 text-lg">${rank.kills} 처치</span>
          <span class="text-green-400 text-lg">Lv.${rank.level}</span>
        </div>
      </div>
    `;
  });
  rankingsList.innerHTML = html;
  
  // 삭제 버튼 이벤트 리스너 추가
  document.querySelectorAll('.delete-rank-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const rankId = btn.getAttribute('data-rank-id');
      const rankToDelete = allRankings.find(r => r.__backendId === rankId);
      
      if (rankToDelete && window.dataSdk && dataInitialized) {
        btn.disabled = true;
        btn.textContent = '삭제 중...';
        const result = await window.dataSdk.delete(rankToDelete);
        if (!result.isOk) {
          btn.disabled = false;
          btn.textContent = '삭제';
        }
      }
    });
  });
}

/**
 * 메인 랭킹 화면에 랭킹 표시
 * @param {string} difficulty - 표시할 난이도
 */
function displayMainRankings(difficulty) {
  const rankingsList = document.getElementById('mainRankingsList');
  const currentRankings = allRankings.filter(r => r.difficulty === difficulty);
  
  currentRankings.sort((a, b) => {
    if (b.kills !== a.kills) return b.kills - a.kills;
    return b.level - a.level;
  });
  
  if (currentRankings.length === 0) {
    rankingsList.innerHTML = '<div class="text-gray-400 text-center py-4 text-lg">아직 기록이 없습니다</div>';
    return;
  }
  
  let html = '';
  currentRankings.slice(0, 10).forEach((rank, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    const diffBadge = getDifficultyName(rank.difficulty || difficulty);
    html += `
      <div class="flex justify-between items-center py-3 px-4 mb-2 bg-gray-800 bg-opacity-50 rounded ${index < 3 ? 'border border-yellow-600' : ''}">
        <div class="flex items-center gap-3">
          <span class="text-2xl w-10">${medal}</span>
          <span class="text-white text-xl font-bold">${rank.name}</span>
          <span class="text-gray-400 text-sm">${diffBadge}</span>
        </div>
        <div class="flex gap-6">
          <span class="text-yellow-400 text-lg">${rank.kills} 처치</span>
          <span class="text-green-400 text-lg">Lv.${rank.level}</span>
        </div>
      </div>
    `;
  });
  rankingsList.innerHTML = html;
}

/**
 * 점수 저장
 * @param {Object} gameState - 게임 상태 객체
 * @param {boolean} replaceExisting - 기존 기록 대체 여부
 */
async function saveScore(gameState, replaceExisting = false) {
  const nameInput = document.getElementById('playerNameInput');
  const playerName = nameInput.value.trim() || '무명의 전사';
  currentPlayerName = playerName;

  const newRecord = {
    name: playerName,
    kills: gameState.kills,
    level: gameState.currentLevel,
    difficulty: gameState.currentDifficulty,
    date: new Date().toISOString()
  };

  // Data SDK 사용
  if (window.dataSdk && dataInitialized) {
    const currentRankings = allRankings.filter(r => r.difficulty === gameState.currentDifficulty);
    const existingRecord = currentRankings.find(r => r.name === playerName);

    if (existingRecord && !replaceExisting) {
      document.getElementById('duplicateNameWarning').classList.remove('hidden');
      return;
    }

    document.getElementById('duplicateNameWarning').classList.add('hidden');

    const saveBtn = document.getElementById('saveScoreBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = '저장 중...';

    if (replaceExisting && existingRecord && existingRecord.__backendId) {
      await window.dataSdk.delete(existingRecord);
    }

    const result = await window.dataSdk.create(newRecord);

    if (result.isOk) {
      nameInput.value = '';
    } else {
      saveBtn.disabled = false;
      saveBtn.textContent = '기록 저장';
    }

    return;
  }

  // 로컬 스토리지 사용
  try {
    const saveBtn = document.getElementById('saveScoreBtn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = '저장 중...';
    }

    let localRanks = JSON.parse(localStorage.getItem('tactical_rankings') || '[]');
    const existingRecordIdx = localRanks.findIndex(r => r.name === playerName && r.difficulty === gameState.currentDifficulty);

    if (existingRecordIdx !== -1 && !replaceExisting) {
      document.getElementById('duplicateNameWarning').classList.remove('hidden');
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '기록 저장'; }
      return;
    }

    document.getElementById('duplicateNameWarning').classList.add('hidden');

    if (existingRecordIdx !== -1 && replaceExisting) {
      localRanks[existingRecordIdx] = Object.assign({}, localRanks[existingRecordIdx], {
        kills: gameState.kills,
        level: gameState.currentLevel,
        date: new Date().toISOString()
      });
    } else {
      localRanks.push(Object.assign({}, newRecord, { __backendId: null }));
    }

    localStorage.setItem('tactical_rankings', JSON.stringify(localRanks));
    allRankings = localRanks;
    displayRankings(gameState);
    if (nameInput) nameInput.value = '';
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '기록 저장'; }
  } catch (err) {
    console.error('Local save failed', err);
    const saveBtn = document.getElementById('saveScoreBtn');
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '기록 저장'; }
  }
}
