/**
 * Particle 클래스 - 게임 내 파티클 효과 관리
 * 총알 발사, 적 파괴 시 시각적 효과를 제공
 */
class Particle {
  /**
   * @param {number} x - 파티클 생성 X 좌표
   * @param {number} y - 파티클 생성 Y 좌표
   * @param {string} color - 파티클 색상 (RGB 형식)
   */
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    // 랜덤한 방향으로 속도 설정
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    // 파티클 생명력
    this.life = 30;
    this.maxLife = 30;
    // 파티클 크기 랜덤 설정
    this.size = Math.random() * 3 + 2;
    this.color = color;
  }
  
  /**
   * 파티클 위치 및 생명력 업데이트
   * @returns {boolean} - 파티클이 소멸되었는지 여부
   */
  update() {
    // 속도에 따라 위치 이동
    this.x += this.vx;
    this.y += this.vy;
    // 중력 효과 추가
    this.vy += 0.1;
    // 생명력 감소
    this.life--;
    return this.life <= 0;
  }
  
  /**
   * 파티클을 캔버스에 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  draw(ctx) {
    // 생명력에 비례하여 투명도 설정
    const alpha = this.life / this.maxLife;
    ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
