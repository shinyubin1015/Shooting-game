/**
 * Bullet 클래스 - 총알 관리
 * 플레이어와 적이 발사하는 다양한 종류의 총알 처리
 */
class Bullet {
  /**
   * @param {number} x - 총알 발사 X 좌표
   * @param {number} y - 총알 발사 Y 좌표
   * @param {number} angle - 발사 각도 (라디안)
   * @param {boolean} isPlayer - 플레이어가 발사한 총알인지 여부
   * @param {string} type - 총알 타입 (normal, sniper, laser, rocket, railgun, plasma, burst)
   * @param {number} damage - 총알 데미지
   */
  constructor(x, y, angle, isPlayer, type = 'normal', damage = 1) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    // 총알 속도 (로켓은 느리게, 일반 총알은 빠르게)
    this.speed = isPlayer ? (type === 'rocket' ? 8 : 12) : 8;
    // 총알 크기 (타입에 따라 다름)
    this.size = type === 'rocket' ? 6 : (type === 'sniper' ? 6 : 4);
    this.isPlayer = isPlayer;
    this.type = type;
    this.damage = damage;
    // 총알 궤적 (레이저나 레일건 등에 사용)
    this.trail = [];
    // 관통한 적 목록 (레이저, 레일건용)
    this.pierced = [];
  }
  
  /**
   * 총알 위치 업데이트
   * @returns {boolean} - 총알이 화면 밖으로 나갔는지 여부
   */
  update() {
    // 궤적 추가
    this.trail.push({ x: this.x, y: this.y });
    // 궤적 길이 제한 (타입별로 다르게 설정)
    let maxTrailLength = 5;
    if (this.type === 'laser' || this.type === 'railgun') {
      maxTrailLength = 20;  // 레이저/레일건: 매우 긴 궤적
    } else if (this.type === 'plasma') {
      maxTrailLength = 12;  // 플라즈마: 긴 궤적
    } else if (this.type === 'sniper') {
      maxTrailLength = 15;  // 저격총: 긴 궤적
    } else if (this.type === 'rocket') {
      maxTrailLength = 8;   // 로켓: 중간 궤적
    } else {
      maxTrailLength = 10;  // 일반 총알: 눈에 잘 보이는 길이
    }
    
    if (this.trail.length > maxTrailLength) {
      this.trail.shift();
    }
    
    // 총알 이동
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    
    // 화면 밖으로 나갔는지 확인 (50픽셀 여유)
    return this.x < -50 || this.x > window.gameCanvas.width + 50 || 
           this.y < -50 || this.y > window.gameCanvas.height + 50;
  }
  
  /**
   * 총알을 캔버스에 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   * @param {Object} config - 게임 설정 (색상 등)
   */
  draw(ctx, config) {
    // 레이저 타입 그리기
    if (this.type === 'laser') {
      ctx.strokeStyle = this.isPlayer ? '#10b981' : (config.enemy_color || '#ef4444');
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = ctx.strokeStyle;
      
      // 레이저 빔 그리기
      if (this.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      
      // 레이저 헤드
      ctx.fillStyle = '#22d3ae';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#10b981';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size + 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      return;
    }
    
    // 레일건 타입 그리기
    if (this.type === 'railgun') {
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#6366f1';
      
      // 레일건 빔
      if (this.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      
      // 레일건 헤드
      ctx.fillStyle = '#a5b4fc';
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#6366f1';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      return;
    }
    
    // 플라즈마 타입 그리기
    if (this.type === 'plasma') {
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4;
      
      // 플라즈마 궤적
      if (this.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
      
      // 플라즈마 볼
      ctx.fillStyle = '#2dd4bf';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#14b8a6';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      return;
    }
    
    // 로켓 타입 그리기
    if (this.type === 'rocket') {
      ctx.fillStyle = '#ff4400';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff4400';
      
      // 로켓 모양
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillRect(-this.size, -this.size/2, this.size * 2, this.size);
      ctx.restore();
      
      ctx.shadowBlur = 0;
      
      // 로켓 추진 불꽃 파티클 생성
      if (window.particles) {
        for (let i = 0; i < 2; i++) {
          window.particles.push(new Particle(
            this.x - Math.cos(this.angle) * 10, 
            this.y - Math.sin(this.angle) * 10, 
            'rgb(255, 150, 0)'
          ));
        }
      }
      return;
    }
    
    // 일반 총알 그리기
    const bulletColor = this.isPlayer ? 
      (this.type === 'sniper' ? '#22c55e' : (config.bullet_color || '#fbbf24')) : 
      (config.enemy_color || '#ef4444');
    
    // 총알 궤적 - 그라디언트로 페이드 효과
    if (this.trail.length > 1) {
      for (let i = 1; i < this.trail.length; i++) {
        const alpha = (i / this.trail.length) * 0.8; // 0부터 0.8까지 증가
        ctx.strokeStyle = bulletColor;
        ctx.lineWidth = this.type === 'sniper' ? 4 : 3;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 5;
        ctx.shadowColor = bulletColor;
        
        ctx.beginPath();
        ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }
    
    ctx.globalAlpha = 1;
    
    // 총알 헤드 - 더 밝고 눈에 띄게
    ctx.fillStyle = bulletColor;
    ctx.shadowBlur = this.type === 'sniper' ? 20 : 15;
    ctx.shadowColor = bulletColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // 총알 중심 밝은 점
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
