/**
 * 입력 처리 모듈
 * 키보드, 마우스, 터치 입력 관리
 */

// 입력 상태 저장
const inputState = {
  keys: {},                    // 키보드 입력 상태
  mouseX: 0,                   // 마우스 X 좌표
  mouseY: 0,                   // 마우스 Y 좌표
  mouseDown: false,            // 마우스 버튼 눌림 상태
  isMobile: false,             // 모바일 여부
  leftJoystick: {              // 왼쪽 조이스틱 (이동용)
    active: false,
    x: 0,
    y: 0,
    identifier: null
  },
  rightJoystick: {             // 오른쪽 조이스틱 (조준/발사용)
    active: false,
    x: 0,
    y: 0,
    identifier: null,
    shooting: false
  }
};

/**
 * 모바일 기기 감지
 */
function detectMobile() {
  inputState.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

/**
 * 입력 시스템 초기화
 * @param {HTMLCanvasElement} canvas - 게임 캔버스
 */
function initializeInput(canvas) {
  detectMobile();
  
  // 마우스 이동 이벤트
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    inputState.mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    inputState.mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
  });
  
  // 마우스 버튼 이벤트
  canvas.addEventListener('mousedown', () => {
    inputState.mouseDown = true;
  });
  
  canvas.addEventListener('mouseup', () => {
    inputState.mouseDown = false;
  });
  
  canvas.addEventListener('mouseleave', () => {
    inputState.mouseDown = false;
  });
  
  // 키보드 이벤트
  document.addEventListener('keydown', (e) => {
    inputState.keys[e.key] = true;
  });
  
  document.addEventListener('keyup', (e) => {
    inputState.keys[e.key] = false;
  });
  
  // 모바일 조이스틱 초기화
  if (inputState.isMobile) {
    initializeMobileControls();
  }
  
  // 화면 크기 변경 시 모바일 감지 재실행
  window.addEventListener('resize', () => {
    detectMobile();
    updateMobileControlsVisibility();
  });
}

/**
 * 조이스틱 터치 처리
 * @param {Object} joystick - 조이스틱 상태 객체
 * @param {HTMLElement} knob - 조이스틱 노브 요소
 * @param {Touch} touch - 터치 이벤트
 * @param {DOMRect} rect - 조이스틱 베이스 위치
 */
function handleJoystickTouch(joystick, knob, touch, rect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  let dx = touch.clientX - centerX;
  let dy = touch.clientY - centerY;
  
  // 최대 반경 제한
  const maxRadius = rect.width / 2 - 32;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > maxRadius) {
    dx = (dx / distance) * maxRadius;
    dy = (dy / distance) * maxRadius;
  }
  
  // 정규화된 조이스틱 값 (-1 ~ 1)
  joystick.x = dx / maxRadius;
  joystick.y = dy / maxRadius;
  
  // 노브 위치 업데이트
  knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

/**
 * 조이스틱 리셋
 * @param {Object} joystick - 조이스틱 상태 객체
 * @param {HTMLElement} knob - 조이스틱 노브 요소
 */
function resetJoystick(joystick, knob) {
  joystick.active = false;
  joystick.x = 0;
  joystick.y = 0;
  joystick.identifier = null;
  joystick.shooting = false;
  knob.style.transform = 'translate(-50%, -50%)';
}

/**
 * 모바일 컨트롤 초기화
 */
function initializeMobileControls() {
  const leftJoystickBase = document.getElementById('leftJoystickBase');
  const leftJoystickKnob = document.getElementById('leftJoystickKnob');
  const rightJoystickBase = document.getElementById('rightJoystickBase');
  const rightJoystickKnob = document.getElementById('rightJoystickKnob');
  
  // 왼쪽 조이스틱 (이동)
  leftJoystickBase.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!inputState.leftJoystick.active) {
      const touch = e.changedTouches[0];
      inputState.leftJoystick.active = true;
      inputState.leftJoystick.identifier = touch.identifier;
      const rect = leftJoystickBase.getBoundingClientRect();
      handleJoystickTouch(inputState.leftJoystick, leftJoystickKnob, touch, rect);
    }
  });
  
  leftJoystickBase.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (inputState.leftJoystick.active) {
      for (let touch of e.changedTouches) {
        if (touch.identifier === inputState.leftJoystick.identifier) {
          const rect = leftJoystickBase.getBoundingClientRect();
          handleJoystickTouch(inputState.leftJoystick, leftJoystickKnob, touch, rect);
          break;
        }
      }
    }
  });
  
  leftJoystickBase.addEventListener('touchend', (e) => {
    e.preventDefault();
    for (let touch of e.changedTouches) {
      if (touch.identifier === inputState.leftJoystick.identifier) {
        resetJoystick(inputState.leftJoystick, leftJoystickKnob);
        break;
      }
    }
  });
  
  // 오른쪽 조이스틱 (조준/발사)
  rightJoystickBase.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!inputState.rightJoystick.active) {
      const touch = e.changedTouches[0];
      inputState.rightJoystick.active = true;
      inputState.rightJoystick.identifier = touch.identifier;
      inputState.rightJoystick.shooting = true;
      const rect = rightJoystickBase.getBoundingClientRect();
      handleJoystickTouch(inputState.rightJoystick, rightJoystickKnob, touch, rect);
    }
  });
  
  rightJoystickBase.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (inputState.rightJoystick.active) {
      for (let touch of e.changedTouches) {
        if (touch.identifier === inputState.rightJoystick.identifier) {
          const rect = rightJoystickBase.getBoundingClientRect();
          handleJoystickTouch(inputState.rightJoystick, rightJoystickKnob, touch, rect);
          break;
        }
      }
    }
  });
  
  rightJoystickBase.addEventListener('touchend', (e) => {
    e.preventDefault();
    for (let touch of e.changedTouches) {
      if (touch.identifier === inputState.rightJoystick.identifier) {
        resetJoystick(inputState.rightJoystick, rightJoystickKnob);
        break;
      }
    }
  });
  
  // 재장전 버튼
  document.getElementById('mobileReloadBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    // 재장전 이벤트는 game.js에서 처리
    window.dispatchEvent(new CustomEvent('mobileReload'));
  });
}

/**
 * 모바일 컨트롤 표시/숨김
 */
function updateMobileControlsVisibility() {
  const mobileControls = document.getElementById('mobileControls');
  if (inputState.isMobile && window.gameRunning) {
    mobileControls.classList.remove('hidden');
  } else {
    mobileControls.classList.add('hidden');
  }
}

/**
 * 입력 상태 가져오기
 * @returns {Object} - 입력 상태 객체
 */
function getInputState() {
  return inputState;
}
