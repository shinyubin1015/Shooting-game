/**
 * PowerUp 클래스 - 파워업 아이템 관리
 * 속도, 공격력, 방어력, 다중 발사 등 다양한 버프 제공
 */
class PowerUp {
  /**
   * @param {string} type - 파워업 타입 (speed, damage, shield, multiburst, doubleburst)
   * @param {number} canvasWidth - 캔버스 너비
   * @param {number} canvasHeight - 캔버스 높이
   */
  constructor(type, canvasWidth, canvasHeight) {
    // 랜덤 위치에 생성
    this.x = Math.random() * (canvasWidth - 60) + 30;
    this.y = Math.random() * (canvasHeight - 60) + 30;
    this.size = 18;
    this.type = type;
    // 떠다니는 효과를 위한 오프셋
    this.bobOffset = Math.random() * Math.PI * 2;
    // 450프레임(약 7.5초) 후 사라짐
    this.lifetime = 450;
    // 회전 효과
    this.rotation = 0;
  }
  
  /**
   * 파워업 상태 업데이트
   * @returns {boolean} - 파워업이 만료되었는지 여부
   */
  update() {
    this.lifetime--;
    // 회전 애니메이션
    this.rotation += 0.05;
    return this.lifetime <= 0;
  }
  
  /**
   * 파워업을 캔버스에 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  draw(ctx) {
    // 위아래로 떠다니는 효과
    const bob = Math.sin(Date.now() * 0.005 + this.bobOffset) * 5;
    
    ctx.save();
    ctx.translate(this.x, this.y + bob);
    ctx.rotate(this.rotation);
    
    // 타입별 색상 설정
    let color = '#a855f7'; // 기본 보라색
    if (this.type === 'speed') color = '#3b82f6'; // 파란색 - 속도 버프
    else if (this.type === 'damage') color = '#ef4444'; // 빨간색 - 공격력 버프
    else if (this.type === 'shield') color = '#fbbf24'; // 노란색 - 방어막 버프
    else if (this.type === 'multiburst') color = '#a855f7'; // 보라색 - 3연발 버프
    else if (this.type === 'doubleburst') color = '#ec4899'; // 분홍색 - 2연발 버프
    
    // 빛나는 효과
    ctx.shadowBlur = 20 + Math.sin(Date.now() * 0.01) * 10;
    ctx.shadowColor = color;
    
    // 마름모 모양 그리기
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.lineTo(this.size, 0);
    ctx.lineTo(0, this.size);
    ctx.lineTo(-this.size, 0);
    ctx.closePath();
    ctx.fill();
    
    // 내부 하이라이트 효과
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -this.size * 0.5);
    ctx.lineTo(this.size * 0.5, 0);
    ctx.lineTo(0, this.size * 0.5);
    ctx.lineTo(-this.size * 0.5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    
    ctx.restore();
  }
  
  /**
   * 플레이어와의 충돌 검사
   * @param {Object} player - 플레이어 객체
   * @returns {boolean} - 충돌 여부
   */
  checkCollision(player) {
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < this.size + player.size;
  }
}
