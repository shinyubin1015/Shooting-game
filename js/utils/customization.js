/**
 * 캐릭터 커스터마이징 시스템
 * 플레이어 색상 변경 및 미리보기
 */

/**
 * 미리보기 캔버스에 캐릭터 그리기
 */
function drawPreviewCharacter() {
  const previewCanvas = document.getElementById('previewCanvas');
  const previewCtx = previewCanvas.getContext('2d');
  const customization = window.gameState.playerCustomization;
  
  // 배경 지우기
  previewCtx.fillStyle = '#0f172a';
  previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
  
  const centerX = previewCanvas.width / 2;
  const centerY = previewCanvas.height / 2;
  const size = 50;
  const angle = 0;
  
  previewCtx.save();
  previewCtx.translate(centerX, centerY);
  previewCtx.rotate(angle);
  
  // 플레이어 본체 (로봇 형태)
  previewCtx.fillStyle = customization.mainColor;
  previewCtx.shadowBlur = 20;
  previewCtx.shadowColor = customization.mainColor;
  previewCtx.beginPath();
  previewCtx.moveTo(size * 1.2, 0);
  previewCtx.lineTo(size * 0.5, size * 0.6);
  previewCtx.lineTo(-size * 0.8, size * 0.6);
  previewCtx.lineTo(-size * 1.2, 0);
  previewCtx.lineTo(-size * 0.8, -size * 0.6);
  previewCtx.lineTo(size * 0.5, -size * 0.6);
  previewCtx.closePath();
  previewCtx.fill();
  
  previewCtx.shadowBlur = 0;
  previewCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  previewCtx.lineWidth = 3;
  previewCtx.stroke();
  
  // 헬멧
  previewCtx.fillStyle = customization.secondaryColor;
  previewCtx.beginPath();
  previewCtx.arc(-size * 0.5, 0, size * 0.4, 0, Math.PI * 2);
  previewCtx.fill();
  
  // 바이저
  previewCtx.fillStyle = customization.mainColor;
  previewCtx.globalAlpha = 0.8;
  previewCtx.beginPath();
  previewCtx.arc(-size * 0.5, 0, size * 0.25, 0, Math.PI * 2);
  previewCtx.fill();
  previewCtx.globalAlpha = 1;
  
  // 어깨
  previewCtx.fillStyle = customization.secondaryColor;
  previewCtx.beginPath();
  previewCtx.ellipse(size * 0.2, -size * 0.5, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
  previewCtx.fill();
  previewCtx.beginPath();
  previewCtx.ellipse(size * 0.2, size * 0.5, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
  previewCtx.fill();
  
  // 무기
  previewCtx.fillStyle = customization.secondaryColor;
  previewCtx.fillRect(size * 0.8, -10, 48, 20);
  
  previewCtx.fillStyle = customization.secondaryColor;
  previewCtx.fillRect(size * 0.5, -6, 20, 12);
  
  previewCtx.fillStyle = '#0f172a';
  previewCtx.fillRect(size * 0.8 + 48, -6, 12, 12);
  
  previewCtx.fillStyle = '#94a3b8';
  previewCtx.fillRect(size * 0.8 + 16, -16, 16, 6);
  
  previewCtx.fillStyle = customization.mainColor;
  previewCtx.fillRect(size * 0.8 + 4, -8, 36, 4);
  
  previewCtx.restore();
}

/**
 * 커스터마이징 이벤트 리스너 설정
 */
function setupCustomizationEventListeners() {
  const state = window.gameState;
  
  // 커스터마이징 화면 열기
  document.getElementById('customizeBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('customizeScreen').classList.remove('hidden');
    drawPreviewCharacter();
  });
  
  // 색상 버튼들
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const color = btn.getAttribute('data-color');
      const type = btn.getAttribute('data-type');
      
      // 같은 타입의 다른 버튼들 스타일 초기화
      document.querySelectorAll(`.color-btn[data-type="${type}"]`).forEach(b => {
        b.classList.remove('border-white');
        b.classList.add('border-gray-600');
      });
      
      // 선택된 버튼 강조
      btn.classList.remove('border-gray-600');
      btn.classList.add('border-white');
      
      // 색상 적용
      if (type === 'main') {
        state.playerCustomization.mainColor = color;
      } else if (type === 'secondary') {
        state.playerCustomization.secondaryColor = color;
      }
      
      // 미리보기 업데이트
      drawPreviewCharacter();
    });
  });
  
  // 저장 버튼
  document.getElementById('saveCustomizationBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('customizeScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
  });
  
  // 뒤로 가기 버튼
  document.getElementById('backToMenuBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('customizeScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
  });
}
