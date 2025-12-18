/**
 * HealthPack 클래스 - 체력 회복 아이템 관리
 * 적 처치 시 15% 확률로 드롭되어 플레이어의 HP를 35 회복
 */
class HealthPack {
  /**
   * 랜덤한 위치에 체력팩 생성
   * @param {number} canvasWidth - 캔버스 너비
   * @param {number} canvasHeight - 캔버스 높이
   */
  constructor(canvasWidth, canvasHeight) {
    // 화면 가장자리를 피해 랜덤 위치 설정
    this.x = Math.random() * (canvasWidth - 60) + 30;
    this.y = Math.random() * (canvasHeight - 60) + 30;
    this.size = 20;
    // 떠다니는 효과를 위한 오프셋
    this.bobOffset = Math.random() * Math.PI * 2;
    // 600프레임(약 10초) 후 사라짐
    this.lifetime = 600;
  }
  
  /**
   * 체력팩 상태 업데이트
   * @returns {boolean} - 체력팩이 만료되었는지 여부
   */
  update() {
    this.lifetime--;
    return this.lifetime <= 0;
  }
  
  /**
   * 체력팩을 캔버스에 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  draw(ctx) {
    // 위아래로 떠다니는 효과
    const bob = Math.sin(Date.now() * 0.005 + this.bobOffset) * 5;
    
    // 빛나는 효과 추가
    ctx.shadowBlur = 20 + Math.sin(Date.now() * 0.01) * 10;
    ctx.shadowColor = '#22c55e';
    
    // 초록색 사각형 (체력팩 배경)
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2 + bob, this.size, this.size);
    
    // 십자가 모양 그리기 (힐링 표시)
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'white';
    // 가로선
    ctx.fillRect(this.x - this.size/2 + 6, this.y - 2 + bob, this.size - 12, 4);
    // 세로선
    ctx.fillRect(this.x - 2, this.y - this.size/2 + 6 + bob, 4, this.size - 12);
    
    // 만료 임박 시 경고 표시 (3초 남았을 때)
    if (this.lifetime < 180) {
      ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.02) * 0.3;
      ctx.fillStyle = '#ef4444';
      const barWidth = this.size;
      const barHeight = 3;
      ctx.fillRect(this.x - barWidth/2, this.y + this.size/2 + 8 + bob, barWidth * (this.lifetime / 180), barHeight);
      ctx.globalAlpha = 1;
    }
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
