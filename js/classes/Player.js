/**
 * Player 클래스 - 플레이어 캐릭터 관리
 * 이동, 조준, 발사, 재장전, 무기 변경 등 모든 플레이어 액션 처리
 */
class Player {
  /**
   * @param {number} canvasWidth - 캔버스 너비
   * @param {number} canvasHeight - 캔버스 높이
   * @param {Object} gameState - 게임 상태 객체 (bullets, particles 배열 참조용)
   */
  constructor(canvasWidth, canvasHeight, gameState = null) {
    this.gameState = gameState;
    // 화면 중앙에 플레이어 배치
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.size = 22;
    this.speed = 5;
    this.baseSpeed = 5;
    this.health = 100;
    this.maxHealth = 100;
    // 기본 무기는 돌격 소총
    this.weapon = 'assault';
    this.setWeapon(this.weapon);
    // 재장전 상태
    this.reloading = false;
    this.reloadTime = 0;
    // 발사 쿨다운
    this.shootCooldown = 0;
    // 점사 관련 변수
    this.burstCount = 0;
    this.burstDelay = 0;
    // 파워업 효과 지속시간
    this.powerUps = {
      speed: 0,      // 속도 증가
      damage: 0,     // 공격력 2배
      shield: 0,     // 받는 피해 50% 감소
      multiburst: 0, // 3연발
      doubleburst: 0 // 2연발
    };
  }
  
  /**
   * 무기 변경 및 탄약 설정
   * @param {string} weaponType - 무기 타입
   * @param {number} currentLevel - 현재 레벨 (탄약 보너스)
   */
  setWeapon(weaponType, currentLevel = 1) {
    this.weapon = weaponType;
    // 레벨에 따른 예비 탄약 보너스
    const levelBonus = (currentLevel - 1) * 30;
    
    // 무기별 스탯 설정
    if (weaponType === 'assault') {
      // 돌격 소총: 균형잡힌 성능
      this.maxAmmo = 30;
      this.ammo = 30;
      this.reserveAmmo = 90 + levelBonus;
      this.shootCooldownMax = 8;
      this.reloadTimeMax = 90;
      this.bulletCount = 1;
      this.bulletSpread = 0;
      this.bulletType = 'normal';
    } else if (weaponType === 'shotgun') {
      // 산탄총: 근거리 광역 공격
      this.maxAmmo = 8;
      this.ammo = 8;
      this.reserveAmmo = 32 + levelBonus;
      this.shootCooldownMax = 25;
      this.reloadTimeMax = 120;
      this.bulletCount = 5;
      this.bulletSpread = 0.3;
      this.bulletType = 'normal';
    } else if (weaponType === 'smg') {
      // 기관단총: 빠른 연사
      this.maxAmmo = 40;
      this.ammo = 40;
      this.reserveAmmo = 120 + levelBonus;
      this.shootCooldownMax = 4;
      this.reloadTimeMax = 75;
      this.bulletCount = 1;
      this.bulletSpread = 0.1;
      this.bulletType = 'normal';
    } else if (weaponType === 'doubleshot') {
      // 2연발: 동시에 2발 발사
      this.maxAmmo = 20;
      this.ammo = 20;
      this.reserveAmmo = 80 + levelBonus;
      this.shootCooldownMax = 10;
      this.reloadTimeMax = 85;
      this.bulletCount = 2;
      this.bulletSpread = 0.05;
      this.bulletType = 'normal';
    } else if (weaponType === 'tripleshot') {
      // 3연발: 동시에 3발 발사
      this.maxAmmo = 18;
      this.ammo = 18;
      this.reserveAmmo = 72 + levelBonus;
      this.shootCooldownMax = 12;
      this.reloadTimeMax = 95;
      this.bulletCount = 3;
      this.bulletSpread = 0.08;
      this.bulletType = 'normal';
    } else if (weaponType === 'sniper') {
      // 저격총: 높은 데미지, 느린 연사
      this.maxAmmo = 5;
      this.ammo = 5;
      this.reserveAmmo = 20 + Math.floor(levelBonus / 3);
      this.shootCooldownMax = 40;
      this.reloadTimeMax = 110;
      this.bulletCount = 1;
      this.bulletSpread = 0;
      this.bulletType = 'sniper';
      this.bulletDamage = 5;
    } else if (weaponType === 'burst') {
      // 점사총: 3발 버스트
      this.maxAmmo = 24;
      this.ammo = 24;
      this.reserveAmmo = 72 + levelBonus;
      this.shootCooldownMax = 20;
      this.reloadTimeMax = 80;
      this.bulletCount = 1;
      this.bulletSpread = 0.02;
      this.bulletType = 'burst';
      this.burstSize = 3;
      this.burstDelayMax = 3;
    } else if (weaponType === 'minigun') {
      // 미니건: 초고속 연사
      this.maxAmmo = 100;
      this.ammo = 100;
      this.reserveAmmo = 200 + levelBonus * 2;
      this.shootCooldownMax = 2;
      this.reloadTimeMax = 150;
      this.bulletCount = 1;
      this.bulletSpread = 0.15;
      this.bulletType = 'normal';
    } else if (weaponType === 'laser') {
      // 레이저건: 관통 레이저
      this.maxAmmo = 30;
      this.ammo = 30;
      this.reserveAmmo = 90 + levelBonus;
      this.shootCooldownMax = 10;
      this.reloadTimeMax = 85;
      this.bulletCount = 1;
      this.bulletSpread = 0;
      this.bulletType = 'laser';
    } else if (weaponType === 'rocket') {
      // 로켓 런처: 폭발 범위 공격
      this.maxAmmo = 4;
      this.ammo = 4;
      this.reserveAmmo = 12 + Math.floor(levelBonus / 4);
      this.shootCooldownMax = 50;
      this.reloadTimeMax = 130;
      this.bulletCount = 1;
      this.bulletSpread = 0;
      this.bulletType = 'rocket';
    } else if (weaponType === 'railgun') {
      // 레일건: 즉사 관통
      this.maxAmmo = 3;
      this.ammo = 3;
      this.reserveAmmo = 9 + Math.floor(levelBonus / 5);
      this.shootCooldownMax = 60;
      this.reloadTimeMax = 140;
      this.bulletCount = 1;
      this.bulletSpread = 0;
      this.bulletType = 'railgun';
    } else if (weaponType === 'plasma') {
      // 플라즈마총: 에너지 연사
      this.maxAmmo = 35;
      this.ammo = 35;
      this.reserveAmmo = 105 + levelBonus;
      this.shootCooldownMax = 5;
      this.reloadTimeMax = 80;
      this.bulletCount = 1;
      this.bulletSpread = 0.05;
      this.bulletType = 'plasma';
    }
  }
  
  /**
   * 플레이어 상태 업데이트 (이동, 파워업, 발사 등)
   * @param {Object} keys - 키 입력 상태
   * @param {Object} mousePos - 마우스 위치
   * @param {boolean} mouseDown - 마우스 버튼 눌림 상태
   * @param {Object} joystick - 모바일 조이스틱 상태
   * @param {number} canvasWidth - 캔버스 너비
   * @param {number} canvasHeight - 캔버스 높이
   */
  update(keys, mousePos, mouseDown, joystick, canvasWidth, canvasHeight) {
    // 파워업 효과 시간 감소
    if (this.powerUps.speed > 0) {
      this.powerUps.speed--;
      this.speed = this.baseSpeed * 1.5; // 속도 50% 증가
    } else {
      this.speed = this.baseSpeed;
    }
    
    if (this.powerUps.damage > 0) this.powerUps.damage--;
    if (this.powerUps.shield > 0) this.powerUps.shield--;
    if (this.powerUps.multiburst > 0) this.powerUps.multiburst--;
    if (this.powerUps.doubleburst > 0) this.powerUps.doubleburst--;
    
    // 이동 처리
    let moveX = 0;
    let moveY = 0;
    
    // 모바일 조이스틱 또는 키보드 입력
    if (joystick && joystick.active) {
      moveX = joystick.x;
      moveY = joystick.y;
    } else {
      if (keys['w'] || keys['W']) moveY -= 1;
      if (keys['s'] || keys['S']) moveY += 1;
      if (keys['a'] || keys['A']) moveX -= 1;
      if (keys['d'] || keys['D']) moveX += 1;
    }
    
    // 대각선 이동 시 속도 보정
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.707;
      moveY *= 0.707;
    }
    
    // 위치 업데이트
    this.x += moveX * this.speed;
    this.y += moveY * this.speed;
    
    // 화면 경계 처리
    this.x = Math.max(this.size, Math.min(canvasWidth - this.size, this.x));
    this.y = Math.max(this.size, Math.min(canvasHeight - this.size, this.y));
    
    // 재장전 처리
    if (this.reloadTime > 0) {
      this.reloadTime--;
      if (this.reloadTime === 0) {
        const neededAmmo = this.maxAmmo - this.ammo;
        const ammoToReload = Math.min(neededAmmo, this.reserveAmmo);
        this.ammo += ammoToReload;
        this.reserveAmmo -= ammoToReload;
        this.reloading = false;
      }
    }
    
    // 발사 쿨다운 감소
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }
    
    // 점사 딜레이 처리
    if (this.burstDelay > 0) {
      this.burstDelay--;
      if (this.burstDelay === 0 && this.burstCount > 0) {
        this.shootBurst(mousePos);
      }
    }
  }
  
  /**
   * 체력 회복
   * @param {number} amount - 회복량
   */
  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    
    // 회복 파티클 생성
    if (window.particles) {
      for (let i = 0; i < 20; i++) {
        window.particles.push(new Particle(this.x, this.y, 'rgb(34, 197, 94)'));
      }
    }
  }
  
  /**
   * 파워업 적용
   * @param {string} type - 파워업 타입
   */
  applyPowerUp(type) {
    const duration = 600; // 10초
    this.powerUps[type] = duration;
    
    // 파워업 획득 파티클
    let color = 'rgb(168, 85, 247)';
    if (type === 'speed') color = 'rgb(59, 130, 246)';
    else if (type === 'damage') color = 'rgb(239, 68, 68)';
    else if (type === 'shield') color = 'rgb(251, 191, 36)';
    
    const particlesArray = this.gameState ? this.gameState.particles : window.particles;
    if (particlesArray) {
      for (let i = 0; i < 30; i++) {
        particlesArray.push(new Particle(this.x, this.y, color));
      }
    }
  }
  
  /**
   * 플레이어 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   * @param {Object} mousePos - 마우스 위치
   * @param {Object} keys - 키 입력 상태
   * @param {Object} customization - 플레이어 커스터마이징
   */
  draw(ctx, mousePos, keys, customization) {
    // 마우스 방향으로 회전
    const angle = Math.atan2(mousePos.y - this.y, mousePos.x - this.x);
    
    // 실드 파워업 효과 표시
    if (this.powerUps.shield > 0) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#fbbf24';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    // 이동 시 흔들림 효과
    const moveSpeed = Math.sqrt(
      (keys['w'] || keys['W'] || keys['s'] || keys['S'] ? 1 : 0) +
      (keys['a'] || keys['A'] || keys['d'] || keys['D'] ? 1 : 0)
    );
    const bobAmount = moveSpeed > 0 ? Math.sin(Date.now() * 0.01) * 3 : 0;
    const weaponBob = moveSpeed > 0 ? Math.sin(Date.now() * 0.01) * 2 : 0;
    
    ctx.save();
    ctx.translate(this.x, this.y + bobAmount);
    ctx.rotate(angle);
    
    // 파워업에 따른 색상 변경
    let mainColor = customization.mainColor;
    if (this.powerUps.speed > 0) mainColor = '#3b82f6';
    if (this.powerUps.damage > 0) mainColor = '#ef4444';
    
    // 플레이어 본체 (로봇 형태)
    ctx.fillStyle = mainColor;
    ctx.shadowBlur = 15;
    ctx.shadowColor = mainColor;
    ctx.beginPath();
    ctx.moveTo(this.size * 1.2, 0);
    ctx.lineTo(this.size * 0.5, this.size * 0.6);
    ctx.lineTo(-this.size * 0.8, this.size * 0.6);
    ctx.lineTo(-this.size * 1.2, 0);
    ctx.lineTo(-this.size * 0.8, -this.size * 0.6);
    ctx.lineTo(this.size * 0.5, -this.size * 0.6);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 헬멧 (어두운 원)
    ctx.fillStyle = customization.secondaryColor;
    ctx.beginPath();
    ctx.arc(-this.size * 0.5, 0, this.size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // 바이저 (밝은 원)
    ctx.fillStyle = mainColor;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(-this.size * 0.5, 0, this.size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // 어깨 (타원)
    ctx.fillStyle = customization.secondaryColor;
    ctx.beginPath();
    ctx.ellipse(this.size * 0.2, -this.size * 0.5, this.size * 0.3, this.size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(this.size * 0.2, this.size * 0.5, this.size * 0.3, this.size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 무기 (총)
    ctx.fillStyle = customization.secondaryColor;
    ctx.fillRect(this.size * 0.8, -5 + weaponBob, 24, 10);
    
    ctx.fillStyle = customization.secondaryColor;
    ctx.fillRect(this.size * 0.5, -3 + weaponBob, 10, 6);
    
    // 총구
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(this.size * 0.8 + 24, -3 + weaponBob, 6, 6);
    
    // 조준경
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(this.size * 0.8 + 8, -8 + weaponBob, 8, 3);
    
    // 무기 하이라이트
    ctx.fillStyle = mainColor;
    ctx.fillRect(this.size * 0.8 + 2, -4 + weaponBob, 18, 2);
    
    ctx.restore();
  }
  
  /**
   * 조준선 그리기 (총알 경로 미리보기)
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   * @param {Object} mousePos - 마우스 위치
   */
  drawAimLine(ctx, mousePos) {
    // 재장전 중이면 조준선 표시 안 함
    if (this.reloading) return;
    
    const angle = Math.atan2(mousePos.y - this.y, mousePos.x - this.x);
    const gunLength = 35;
    const gunX = this.x + Math.cos(angle) * gunLength;
    const gunY = this.y + Math.sin(angle) * gunLength;
    
    // 조준선 길이
    const lineLength = 800;
    const endX = gunX + Math.cos(angle) * lineLength;
    const endY = gunY + Math.sin(angle) * lineLength;
    
    // 무기 타입에 따른 색상 설정
    let lineColor = '#22d3ee';
    let lineWidth = 1;
    
    if (this.type === 'sniper') {
      lineColor = '#22c55e';
      lineWidth = 1.5;
    } else if (this.type === 'laser' || this.type === 'railgun') {
      lineColor = '#10b981';
      lineWidth = 2;
    } else if (this.type === 'rocket') {
      lineColor = '#ef4444';
      lineWidth = 2;
    } else if (this.type === 'plasma') {
      lineColor = '#14b8a6';
      lineWidth = 1.5;
    }
    
    // 파워업에 따른 색상 변경
    if (this.powerUps.damage > 0) {
      lineColor = '#ef4444';
    }
    
    ctx.save();
    
    // 산탄총이나 다중 발사 무기는 퍼짐 각도 표시
    if (this.bulletCount > 1 || this.powerUps.multiburst > 0 || this.powerUps.doubleburst > 0) {
      const shots = this.powerUps.multiburst > 0 ? 3 : (this.powerUps.doubleburst > 0 ? 2 : 1);
      const totalBullets = this.bulletCount * shots;
      
      // 각 총알의 퍼짐 범위 표시
      for (let i = 0; i < totalBullets; i++) {
        const spreadAngle = (i - (totalBullets - 1) / 2) * this.bulletSpread;
        const finalAngle = angle + spreadAngle;
        const spreadEndX = gunX + Math.cos(finalAngle) * lineLength;
        const spreadEndY = gunY + Math.sin(finalAngle) * lineLength;
        
        // 반투명 점선
        ctx.strokeStyle = lineColor;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([5, 10]);
        
        ctx.beginPath();
        ctx.moveTo(gunX, gunY);
        ctx.lineTo(spreadEndX, spreadEndY);
        ctx.stroke();
      }
    } else {
      // 단일 조준선 - 점선 효과
      ctx.strokeStyle = lineColor;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash([10, 5]);
      
      ctx.beginPath();
      ctx.moveTo(gunX, gunY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // 조준선 중간에 밝은 점들
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.4;
      for (let i = 100; i < lineLength; i += 100) {
        const dotX = gunX + Math.cos(angle) * i;
        const dotY = gunY + Math.sin(angle) * i;
        
        ctx.fillStyle = lineColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = lineColor;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
    
    // 총구에서 빛나는 효과
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = lineColor;
    ctx.shadowBlur = 20;
    ctx.shadowColor = lineColor;
    ctx.beginPath();
    ctx.arc(gunX, gunY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  /**
   * 점사 발사
   * @param {Object} mousePos - 마우스 위치
   */
  shootBurst(mousePos) {
    if (this.ammo > 0 && this.burstCount > 0) {
      const angle = Math.atan2(mousePos.y - this.y, mousePos.x - this.x);
      const gunLength = 35;
      const gunX = this.x + Math.cos(angle) * gunLength;
      const gunY = this.y + Math.sin(angle) * gunLength;
      
      const spread = (Math.random() - 0.5) * this.bulletSpread;
      
      // gameState가 있으면 사용, 없으면 window.bullets 사용
      const bulletsArray = this.gameState ? this.gameState.bullets : window.bullets;
      if (bulletsArray) {
        bulletsArray.push(new Bullet(gunX, gunY, angle + spread, true, this.bulletType, this.bulletDamage || 1));
      }
      
      this.ammo--;
      this.burstCount--;
      
      // 발사 파티클
      const particlesArray = this.gameState ? this.gameState.particles : window.particles;
      if (particlesArray) {
        for (let i = 0; i < 3; i++) {
          particlesArray.push(new Particle(gunX, gunY, 'rgb(251, 191, 36)'));
        }
      }
      
      if (this.burstCount > 0) {
        this.burstDelay = this.burstDelayMax;
      }
    }
  }
  
  /**
   * 발사
   * @param {Object} mousePos - 마우스 위치
   * @returns {boolean} - 발사 성공 여부
   */
  shoot(mousePos) {
    if (this.ammo > 0 && this.shootCooldown === 0 && !this.reloading && this.burstCount === 0) {
      const angle = Math.atan2(mousePos.y - this.y, mousePos.x - this.x);
      const gunLength = 35;
      const gunX = this.x + Math.cos(angle) * gunLength;
      const gunY = this.y + Math.sin(angle) * gunLength;
      
      // 점사 타입 처리
      if (this.bulletType === 'burst') {
        this.burstCount = this.burstSize;
        this.shootBurst(mousePos);
        this.shootCooldown = this.shootCooldownMax;
        return true;
      }
      
      // 파워업에 따른 발사 수 결정
      let shotsToFire = 1;
      if (this.powerUps.multiburst > 0) {
        shotsToFire = 3;
      } else if (this.powerUps.doubleburst > 0) {
        shotsToFire = 2;
      }
      
      // 총알 발사
      for (let shot = 0; shot < shotsToFire; shot++) {
        for (let i = 0; i < this.bulletCount; i++) {
          const spread = (Math.random() - 0.5) * this.bulletSpread;
          let burstSpread = 0;
          if (shotsToFire === 3) {
            burstSpread = (shot - 1) * 0.15;
          } else if (shotsToFire === 2) {
            burstSpread = (shot - 0.5) * 0.1;
          }
          
          // gameState가 있으면 사용, 없으면 window.bullets 사용
          const bulletsArray = this.gameState ? this.gameState.bullets : window.bullets;
          if (bulletsArray) {
            bulletsArray.push(new Bullet(gunX, gunY, angle + spread + burstSpread, true, this.bulletType, this.bulletDamage || 1));
          }
        }
      }
      
      this.ammo--;
      this.shootCooldown = this.shootCooldownMax;
      
      // 발사 파티클
      const particleCount = this.weapon === 'shotgun' ? 10 : 5;
      const particlesArray = this.gameState ? this.gameState.particles : window.particles;
      if (particlesArray) {
        for (let i = 0; i < particleCount * shotsToFire; i++) {
          particlesArray.push(new Particle(gunX, gunY, 'rgb(251, 191, 36)'));
        }
      }
      
      return true;
    }
    return false;
  }
  
  /**
   * 재장전
   */
  reload() {
    if (!this.reloading && this.ammo < this.maxAmmo && this.reserveAmmo > 0) {
      this.reloading = true;
      this.reloadTime = this.reloadTimeMax;
    }
  }
  
  /**
   * 데미지 받기
   * @param {number} amount - 받은 데미지
   */
  takeDamage(amount) {
    // 실드 파워업이 있으면 데미지 50% 감소
    if (this.powerUps.shield > 0) {
      amount *= 0.5;
    }
    
    this.health -= amount;
    
    if (this.health <= 0) {
      this.health = 0;
    }
  }
}
