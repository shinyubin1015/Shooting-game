/**
 * Explosion 클래스 - 폭발 효과 관리
 * 로켓 런처 등의 무기에서 발생하는 폭발 시각 효과
 */
class Explosion {
  /**
   * @param {number} x - 폭발 중심 X 좌표
   * @param {number} y - 폭발 중심 Y 좌표
   * @param {number} radius - 폭발 반경
   */
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.maxRadius = radius;
    // 폭발 지속 시간 (프레임)
    this.life = 30;
    this.maxLife = 30;
  }
  
  /**
   * 폭발 효과 업데이트
   * @returns {boolean} - 폭발이 끝났는지 여부
   */
  update() {
    this.life--;
    return this.life <= 0;
  }
  
  /**
   * 폭발 효과를 캔버스에 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  draw(ctx) {
    // 시간에 따른 투명도 감소
    const alpha = this.life / this.maxLife;
    // 반경은 약간 확대됨
    const currentRadius = this.maxRadius * (1 - alpha * 0.3);
    
    // 외부 불꽃 효과 (주황색)
    ctx.globalAlpha = alpha * 0.6;
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 내부 불꽃 효과 (밝은 노란색)
    ctx.globalAlpha = alpha * 0.4;
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    // 투명도 초기화
    ctx.globalAlpha = 1;
  }
}
