/**
 * 충돌 감지 모듈
 * 총알과 적, 플레이어의 충돌 처리
 */

/**
 * 총알과 적/플레이어의 충돌 처리
 * @param {Object} gameState - 게임 상태 객체
 * @param {HTMLCanvasElement} canvas - 게임 캔버스
 */
function checkCollisions(gameState) {
  const { player, enemies, bullets, kills, currentGameCoins, coins, healthPacks, powerUps, explosions, particles } = gameState;
  const canvas = window.gameCanvas;
  const rect = canvas.getBoundingClientRect();
  
  // 총알 처리
  gameState.bullets = bullets.filter(bullet => {
    // 플레이어가 발사한 총알
    if (bullet.isPlayer) {
      let hitSomething = false;
      
      // 로켓 타입: 폭발 범위 공격
      if (bullet.type === 'rocket') {
        for (let i = enemies.length - 1; i >= 0; i--) {
          const enemy = enemies[i];
          const dx = bullet.x - enemy.x;
          const dy = bullet.y - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // 로켓이 적과 충돌
          if (dist < bullet.size + enemy.size) {
            // 폭발 생성
            explosions.push(new Explosion(bullet.x, bullet.y, 100));
            
            // 폭발 파티클
            for (let j = 0; j < 30; j++) {
              particles.push(new Particle(bullet.x, bullet.y, 'rgb(255, 100, 0)'));
            }
            
            // 폭발 범위 내 모든 적에게 데미지
            enemies.forEach((e, idx) => {
              const edx = bullet.x - e.x;
              const edy = bullet.y - e.y;
              const edist = Math.sqrt(edx * edx + edy * edy);
              
              if (edist < 100) {
                let damageMultiplier = 1;
                if (player && player.powerUps.damage > 0) {
                  damageMultiplier = 2;
                }
                
                for (let d = 0; d < damageMultiplier; d++) {
                  if (e.takeDamage(1, e.x, e.y)) {
                    gameState.kills++;
                    gameState.currentGameCoins++;
                    
                    // 20처치마다 10코인 획득
                    if (gameState.kills % 20 === 0) {
                      gameState.coins += 10;
                      gameState.currentGameCoins += 10;
                      
                      // 코인 획득 파티클
                      for (let k = 0; k < 50; k++) {
                        particles.push(new Particle(e.x, e.y, 'rgb(234, 179, 8)'));
                      }
                    }
                    
                    enemies[idx] = null;
                    break;
                  }
                }
              }
            });
            
            gameState.enemies = enemies.filter(e => e !== null);
            return false; // 로켓 제거
          }
        }
      }
      // 레이저/레일건: 관통 공격
      else if (bullet.type === 'laser' || bullet.type === 'railgun') {
        for (let i = enemies.length - 1; i >= 0; i--) {
          const enemy = enemies[i];
          
          // 이미 관통한 적은 건너뛰기
          if (bullet.pierced.includes(enemy)) continue;
          
          const dx = bullet.x - enemy.x;
          const dy = bullet.y - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < bullet.size + enemy.size) {
            bullet.pierced.push(enemy);
            hitSomething = true;
            
            // 레일건은 즉사, 레이저는 일반 데미지
            let damageAmount = bullet.type === 'railgun' ? 999 : (bullet.damage || 1);
            let damageMultiplier = 1;
            if (player && player.powerUps.damage > 0) {
              damageMultiplier = 2;
            }
            
            for (let d = 0; d < damageMultiplier; d++) {
              if (enemy.takeDamage(damageAmount, enemy.x, enemy.y)) {
                enemies.splice(i, 1);
                gameState.kills++;
                gameState.currentGameCoins++;
                
                if (gameState.kills % 20 === 0) {
                  gameState.coins += 10;
                  gameState.currentGameCoins += 10;
                  
                  for (let k = 0; k < 50; k++) {
                    particles.push(new Particle(enemy.x, enemy.y, 'rgb(234, 179, 8)'));
                  }
                }
                
                for (let j = 0; j < 15; j++) {
                  particles.push(new Particle(enemy.x, enemy.y, 'rgb(239, 68, 68)'));
                }
                break;
              }
            }
            
            // 히트마커 표시
            const screenX = rect.left + (enemy.x / canvas.width) * rect.width;
            const screenY = rect.top + (enemy.y / canvas.height) * rect.height;
            showHitMarker(screenX, screenY);
          }
        }
        
        return true; // 레이저/레일건은 관통하므로 제거하지 않음
      }
      // 일반 총알: 한 번만 명중
      else {
        for (let i = enemies.length - 1; i >= 0; i--) {
          const enemy = enemies[i];
          const dx = bullet.x - enemy.x;
          const dy = bullet.y - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < bullet.size + enemy.size) {
            let damageAmount = bullet.damage || 1;
            let damageMultiplier = 1;
            if (player && player.powerUps.damage > 0) {
              damageMultiplier = 2;
            }
            
            for (let d = 0; d < damageMultiplier; d++) {
              if (enemy.takeDamage(damageAmount, enemy.x, enemy.y)) {
                enemies.splice(i, 1);
                gameState.kills++;
                gameState.currentGameCoins++;
                
                // 20처치마다 10코인
                if (gameState.kills % 20 === 0) {
                  gameState.coins += 10;
                  gameState.currentGameCoins += 10;
                  
                  for (let k = 0; k < 50; k++) {
                    particles.push(new Particle(enemy.x, enemy.y, 'rgb(234, 179, 8)'));
                  }
                }
                
                for (let j = 0; j < 15; j++) {
                  particles.push(new Particle(enemy.x, enemy.y, 'rgb(239, 68, 68)'));
                }
                break;
              }
            }
            
            // 히트마커
            const screenX = rect.left + (enemy.x / canvas.width) * rect.width;
            const screenY = rect.top + (enemy.y / canvas.height) * rect.height;
            showHitMarker(screenX, screenY);
            
            return false; // 총알 제거
          }
        }
      }
    }
    // 적이 발사한 총알
    else {
      if (!player) return false;
      const dx = bullet.x - player.x;
      const dy = bullet.y - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < bullet.size + player.size) {
        player.takeDamage(5);
        showDamageFlash();
        return false; // 총알 제거
      }
    }
    return true; // 총알 유지
  });
  
  // 적과 플레이어의 직접 충돌
  enemies.forEach(enemy => {
    if (!player) return;
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < enemy.size + player.size) {
      player.takeDamage(enemy.damage || 5);
      showDamageFlash();
      enemy.health = 0; // 적 제거
    }
  });
  
  // 죽은 적 제거
  gameState.enemies = enemies.filter(e => e.health > 0);
  
  // 체력팩 충돌 처리
  if (player) {
    gameState.healthPacks = healthPacks.filter(pack => {
      if (pack.checkCollision(player)) {
        player.heal(35);
        return false; // 체력팩 제거
      }
      return true;
    });
    
    // 파워업 충돌 처리
    gameState.powerUps = powerUps.filter(powerUp => {
      if (powerUp.checkCollision(player)) {
        player.applyPowerUp(powerUp.type);
        return false; // 파워업 제거
      }
      return true;
    });
  }
}

/**
 * 적 처치 시 아이템 드롭
 * @param {Object} gameState - 게임 상태 객체
 * @param {number} x - 드롭 위치 X
 * @param {number} y - 드롭 위치 Y
 */
function dropItems(gameState, x, y) {
  const dropChance = Math.random();
  const canvas = window.gameCanvas;
  
  // 15% 확률로 체력팩 드롭
  if (dropChance < 0.15) {
    gameState.healthPacks.push(new HealthPack(canvas.width, canvas.height));
  }
  // 40% 확률로 파워업 드롭
  else if (dropChance < 0.55) {
    const powerUpTypes = ['speed', 'damage', 'shield', 'multiburst', 'doubleburst'];
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    gameState.powerUps.push(new PowerUp(randomType, canvas.width, canvas.height));
  }
}
