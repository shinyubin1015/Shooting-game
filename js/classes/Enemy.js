/**
 * Enemy 클래스 - 적 캐릭터 관리
 * 화면 가장자리에서 스폰되어 플레이어를 추적하고 공격
 */
class Enemy {
  /**
   * @param {number} canvasWidth - 캔버스 너비
   * @param {number} canvasHeight - 캔버스 높이
   * @param {number} currentLevel - 현재 게임 레벨
   * @param {string} currentDifficulty - 현재 난이도
   * @param {Object} difficultySettings - 난이도별 설정
   */
  constructor(canvasWidth, canvasHeight, currentLevel, currentDifficulty, difficultySettings) {
    // 화면 가장자리 4방향 중 랜덤 선택
    const side = Math.floor(Math.random() * 4);
    const margin = 50;
    
    if (side === 0) { // 위쪽
      this.x = Math.random() * canvasWidth;
      this.y = -margin;
    } else if (side === 1) { // 오른쪽
      this.x = canvasWidth + margin;
      this.y = Math.random() * canvasHeight;
    } else if (side === 2) { // 아래쪽
      this.x = Math.random() * canvasWidth;
      this.y = canvasHeight + margin;
    } else { // 왼쪽
      this.x = -margin;
      this.y = Math.random() * canvasHeight;
    }
    
    // 난이도 설정 적용
    const difficulty = difficultySettings[currentDifficulty];
    
    this.size = 20;
    // 레벨이 높아질수록 이동 속도 증가
    this.speed = (1.5 + Math.random() * 0.8 + (currentLevel * 0.08)) * difficulty.enemySpeedMultiplier;
    // 레벨이 높아질수록 체력 증가
    this.health = Math.ceil((2 + Math.floor(currentLevel / 5)) * difficulty.enemyHealthMultiplier);
    this.maxHealth = this.health;
    // 발사 쿨다운
    this.shootCooldown = 0;
    // 발사 딜레이 (레벨이 높아질수록 더 빠르게 발사)
    this.shootDelay = (Math.max(60, 100 - currentLevel * 3) + Math.random() * 60) * difficulty.shootDelayMultiplier;
    // 공격력
    this.damage = 5 * difficulty.enemyDamageMultiplier;
  }
  
  /**
   * 적 행동 업데이트 (이동 및 공격)
   * @param {Object} player - 플레이어 객체
   * @param {Array} bullets - 총알 배열
   */
  update(player, bullets) {
    if (!player) return;
    
    // 플레이어 방향 계산
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // 플레이어와 일정 거리 이상일 때만 이동 (150픽셀)
    if (dist > 150) {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
    
    // 발사 로직
    this.shootCooldown--;
    // 플레이어가 사거리 내(400픽셀)에 있고 쿨다운이 끝났을 때 발사
    if (this.shootCooldown <= 0 && dist < 400) {
      const angle = Math.atan2(dy, dx);
      // 랜덤 오차 추가 (정확도 감소)
      const spread = (Math.random() - 0.5) * 0.3;
      bullets.push(new Bullet(this.x, this.y, angle + spread, false, 'normal', 1));
      this.shootCooldown = this.shootDelay;
    }
  }
  
  /**
   * 적을 캔버스에 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   * @param {Object} player - 플레이어 객체 (조준용)
   * @param {Object} config - 게임 설정
   */
  draw(ctx, player, config) {
    // 플레이어 방향으로 회전
    const angle = player ? Math.atan2(player.y - this.y, player.x - this.x) : 0;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);
    
    // 적 본체 (빨간색 사각형)
    ctx.fillStyle = config.enemy_color || '#ef4444';
    ctx.shadowBlur = 15;
    ctx.shadowColor = config.enemy_color || '#ef4444';
    ctx.fillRect(-this.size, -this.size/2, this.size * 2.2, this.size);
    
    // 무기 (갈색 사각형)
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(this.size * 0.8, -3, 16, 6);
    
    ctx.restore();
    
    // 체력이 감소했을 때만 체력바 표시
    if (this.health < this.maxHealth) {
      const barWidth = 40;
      const barHeight = 4;
      const barX = this.x - barWidth / 2;
      const barY = this.y - this.size - 15;
      
      // 체력바 배경 (검은색)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // 체력바 (현재 체력 비율)
      const healthPercent = this.health / this.maxHealth;
      ctx.fillStyle = config.enemy_color || '#ef4444';
      ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }
  }
  
  /**
   * 적이 데미지를 받았을 때 처리
   * @param {number} amount - 받은 데미지량
   * @param {number} x - 피격 위치 X
   * @param {number} y - 피격 위치 Y
   * @returns {boolean} - 적이 죽었는지 여부
   */
  takeDamage(amount, x, y) {
    this.health -= amount;
    
    // 피격 파티클 생성
    if (window.particles) {
      for (let i = 0; i < 8; i++) {
        window.particles.push(new Particle(x || this.x, y || this.y, 'rgb(239, 68, 68)'));
      }
    }
    
    return this.health <= 0;
  }
}
