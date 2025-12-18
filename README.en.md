# Tactical Strike FPS

A modular, browser-based top-down shooter game built with pure HTML5 Canvas and Vanilla JavaScript featuring advanced visual effects, multiple weapon types, and a comprehensive progression system.

## Overview

Tactical Strike is an action-packed shooting game with a modular architecture, featuring 10+ unique weapons, three difficulty levels, real-time visual feedback, and a sophisticated coin economy system. The game demonstrates modern JavaScript patterns with class-based OOP, state management, and clean separation of concerns.

## Features

### Core Gameplay
- **60 FPS smooth gameplay** with optimized rendering
- **Three difficulty levels** - Easy, Normal, Hard with dynamic scaling
- **Progressive leveling system** - Enemies get stronger as you advance
- **Wave-based spawning** - Strategic enemy generation
- **Advanced visual feedback** - Hit markers, damage flash, particle effects
- **Ammunition management** - Reload mechanics with progress indicators

### Weapons Arsenal (10 Types)
1. **AR-47 Phantom** - Balanced assault rifle (Default)
2. **Shotgun** - Close-range spread attack (8 rounds)
3. **SMG** - High fire rate (40 rounds)
4. **Burst Rifle** - 3-round burst fire (300 coins)
5. **Plasma Gun** - Energy projectiles (400 coins)
6. **Double Shot** - Simultaneous dual bullets (500 coins)
7. **Sniper Rifle** - 5x damage precision (600 coins)
8. **Triple Shot** - Three-way fire (700 coins)
9. **Laser Gun** - Penetrating beam (800 coins)
10. **Minigun** - Ultra-rapid fire (900 coins)
11. **Rocket Launcher** - Area explosion (1000 coins)
12. **Railgun** - Instant kill penetration (1200 coins)

### Visual Enhancements
- **Bullet trajectory trails** - Gradient fade effects with weapon-specific colors
- **Aim line preview** - Shows bullet path before firing
- **Reload progress bar** - Real-time percentage display
- **Power-up visual indicators** - Shields, speed boosts, damage multipliers
- **Explosion effects** - For rocket launcher hits
- **Particle systems** - Muzzle flash, blood splatter, item pickups

### Economy & Progression
- **Coin system** - Earn 10 coins per 20 kills
- **Weapon shop** - Purchase upgrades between levels
- **Character customization** - 8 main colors, 8 secondary colors
- **Leaderboard** - Cloud-based ranking with Data SDK integration
- **Persistent saves** - Unlocked weapons carry over

### Power-Ups (40% drop rate)
- 🏥 **Health Pack** (15% drop) - Restores +35 HP
- 💨 **Speed Boost** - 50% movement increase for 10 seconds
- 🔥 **Damage Multiplier** - 2x attack power for 10 seconds
- 🛡️ **Shield** - 50% damage reduction for 10 seconds
- 💥 **3-Burst** - Triple shot for 10 seconds
- 🎯 **2-Burst** - Double shot for 10 seconds

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled

### Installation

1. Clone the repository
```bash
git clone https://github.com/shinyubin1015/Shooting-game.git
cd Shooting-game
```

2. Open the game
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Or simply open index.html in your browser
```

3. Navigate to `http://localhost:8000` in your browser

## Controls

| Key | Action |
|-----|--------|

#### Design Principles
- **Modular Architecture** - Clean separation of concerns with organized file structure
- **Object-Oriented Design** - ES6 classes for all game entities
- **State Management** - Centralized game state with immutable patterns
- **Event-Driven Input** - Decoupled input handling system
- **Dependency Injection** - gameState passed to entities for loose coupling
- **Performance First** - 60fps target with optimized collision detection

#### Core Systems
1. **Rendering Engine** - HTML5 Canvas with double buffering
2. **Physics System** - Custom collision detection and bullet trajectories
3. **AI System** - Enemy pathfinding and behavior trees
4. **Input Manager** - Multi-platform support (keyboard/mouse/touch)
5. **State Manager** - Game flow and scene transitions
6. **Audio/Visual Effects** - Particle systems and animations
## Technical Details

### Built With
- HTML5 Canvas for rendering
- Vanilla JavaScript (ES6+)
- Tailwind CSS for UI styling
- Custom animation system

### Architecture
- **Modular file structure** with organized directories
- Canvas-based 2D graphics engine
- Object-oriented class system for all game entities
- State management for game flow
- Event-driven input handling
- Mobile touch controls with dual-joystick system

### Project Structure
```
Shooting-game/
├── css/
│   ├── animations.css    # Animation keyframes
│   └── styles.css        # Base styles
├── js/
│   ├── classes/          # Game entity classes
│   │   ├── Particle.js   # Particle effects
│   │   ├── HealthPack.js # Health recovery items
│   │   ├── PowerUp.js    # Power-up buffs
│   │   ├── Explosion.js  # Explosion effects
│   │   ├── Bullet.js     # Bullet projectiles (7 types)
│   │   ├── Enemy.js      # Enemy AI
│   │   └── Player.js     # Player character
│   ├── utils/            # Utility modules
│   │   ├── config.js     # Game configuration
│   │   ├── ui.js         # UI management
│   │   ├── input.js      # Input handling (keyboard/mouse/touch)
│   │   ├── collision.js  # Collision detection
│   │   ├── rankings.js   # Leaderboard system
│   │   ├── shop.js       # Weapon shop
│   │   └── customization.js # Character customization
│   ├── game.js           # Main game loop
│   └── main.js           # Initialization
├── index.html            # Game UI structure
└── README.md             # Documentation
```

## Detailed Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Game Loop (60 FPS)                    │
│                         (game.js)                            │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐      ┌─────────┐
│  Input  │      │  State  │
│ Manager │      │ Manager │
│(input.js)│     │(gameState)│
└─────────┘      └─────────┘
    │                 │
    │                 ▼
    │         ┌───────────────┐
    │         │   Entities    │
    │         ├───────────────┤
    │         │ Player        │◄─────┐
    │         │ Enemy         │      │
    │         │ Bullet        │      │ Dependency Injection
    │         │ Particle      │      │ (gameState reference)
    │         │ HealthPack    │      │
    │         │ PowerUp       │      │
    │         │ Explosion     │◄─────┘
    │         └───────────────┘
    │                 │
    └────────┬────────┘
             ▼
    ┌────────────────┐
    │   Collision    │
    │   Detection    │
    │ (collision.js) │
    └────────────────┘
             │
             ▼
    ┌────────────────┐
    │  UI Renderer   │
    │    (ui.js)     │
    └────────────────┘
```

### Module Dependency Graph

```
main.js (Entry Point)
  ├─→ game.js (Game Loop)
  │     ├─→ classes/Player.js
  │     ├─→ classes/Enemy.js
  │     ├─→ classes/Bullet.js
  │     ├─→ classes/Particle.js
  │     ├─→ classes/HealthPack.js
  │     ├─→ classes/PowerUp.js
  │     ├─→ classes/Explosion.js
  │     ├─→ utils/collision.js
  │     ├─→ utils/ui.js
  │     └─→ utils/config.js
  │
  ├─→ utils/input.js
  ├─→ utils/shop.js
  ├─→ utils/rankings.js
  └─→ utils/customization.js
```

### Class Hierarchy

```
Entity Classes (No inheritance - Composition pattern)
│
├─ Player
│  ├─ Properties: position, health, weapon, powerUps
│  ├─ Methods: update(), draw(), shoot(), reload()
│  └─ Dependency: gameState (bullets, particles)
│
├─ Enemy
│  ├─ Properties: position, health, speed, difficulty
│  ├─ Methods: update(), draw(), takeDamage()
│  └─ AI: Chase player, maintain distance, shoot
│
├─ Bullet
│  ├─ Properties: position, angle, type, damage, trail
│  ├─ Types: normal, sniper, laser, rocket, railgun, plasma
│  └─ Methods: update(), draw(), physics
│
├─ Particle
│  ├─ Properties: position, velocity, color, lifetime
│  └─ Physics: Gravity, friction, alpha fade
│
├─ HealthPack
│  ├─ Properties: position, lifetime
│  └─ Methods: checkCollision(), draw()
│
├─ PowerUp
│  ├─ Properties: type, position, lifetime
│  └─ Types: speed, damage, shield, multiburst, doubleburst
│
└─ Explosion
   ├─ Properties: position, radius, lifetime
   └─ Visual: Expanding circle with fade
```

### Data Flow

```
User Input
    │
    ▼
Input Manager (input.js)
    │
    ├─ Keyboard State (WASD, R)
    ├─ Mouse State (position, click)
    └─ Touch State (joysticks)
    │
    ▼
Game Loop (gameLoop in game.js)
    │
    ├─→ Player.update(inputState)
    │      │
    │      ├─→ Movement calculation
    │      ├─→ Weapon cooldown
    │      └─→ PowerUp timers
    │
    ├─→ Player.shoot(mousePos)
    │      │
    │      └─→ gameState.bullets.push(new Bullet())
    │
    ├─→ Enemy.update(player, bullets)
    │      │
    │      ├─→ AI pathfinding
    │      └─→ Enemy shooting
    │
    ├─→ Bullet.update()
    │      │
    │      └─→ Position += velocity
    │
    ├─→ checkCollisions(gameState)
    │      │
    │      ├─→ Bullet vs Enemy
    │      ├─→ Bullet vs Player
    │      ├─→ Player vs Items
    │      └─→ Enemy vs Player
    │
    ├─→ All entities .draw(ctx)
    │
    └─→ updateHUD(gameState)
```

### State Management

```javascript
window.gameState = {
  // Game Control
  gameRunning: boolean,
  gamePaused: boolean,
  
  // Statistics
  kills: number,
  currentLevel: number,
  coins: number,
  currentGameCoins: number,
  
  // Difficulty
  currentDifficulty: 'easy' | 'normal' | 'hard',
  
  // Entities (Arrays)
  player: Player,
  enemies: Enemy[],
  bullets: Bullet[],
  particles: Particle[],
  healthPacks: HealthPack[],
  powerUps: PowerUp[],
  explosions: Explosion[],
  
  // Progression
  unlockedWeapons: string[],
  playerCustomization: {
    mainColor: string,
    secondaryColor: string
  },
  
  // Timers
  spawnEnemyTimeout: number
}
```

### Key Design Patterns

#### 1. Dependency Injection
```javascript
// Player receives gameState reference
class Player {
  constructor(width, height, gameState) {
    this.gameState = gameState;
  }
  
  shoot(mousePos) {
    // Direct access to shared state
    this.gameState.bullets.push(new Bullet(...));
    this.gameState.particles.push(new Particle(...));
  }
}
```

#### 2. State Synchronization
```javascript
// game.js maintains single source of truth
function startGame() {
  state.player = new Player(width, height, state);
  // Player has direct reference to state arrays
  // No need for window.bullets synchronization
}
```

#### 3. Event-Driven Input
```javascript
// input.js
const inputState = {
  keys: {},
  mouseX: 0,
  mouseY: 0,
  mouseDown: false
};

function getInputState() {
  return inputState; // Read-only access
}
```

#### 4. Composition Over Inheritance
```javascript
// No class inheritance - each entity is independent
// Shared behavior through utility functions
function checkCollision(entity1, entity2) {
  const dx = entity1.x - entity2.x;
  const dy = entity1.y - entity2.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < entity1.size + entity2.size;
}
```

### Performance Optimizations

1. **Object Pooling Consideration**
   - Particles and bullets use filter() but could use pool
   - Currently: ~5000 objects/second creation rate
   - Future: Implement pool for 60fps stability at 100+ enemies

2. **Spatial Partitioning**
   - Current: O(n²) collision detection
   - Optimized for: <50 simultaneous entities
   - Future: Quadtree for >100 entities

3. **Render Optimization**
   - Trail arrays limited to prevent memory leaks
   - Shadow blur cached per frame
   - Canvas state saved/restored efficiently

4. **Memory Management**
   - Arrays filtered each frame (immutable pattern)
   - DOM updates batched in updateHUD()
   - Event listeners cleaned on game end

### Performance
- Optimized rendering pipeline with requestAnimationFrame
- Efficient O(n²) collision detection (suitable for <50 entities)
- Trail system with automatic cleanup
- Particle system with lifetime management
- 60 FPS target maintained on modern hardware

## Game Mechanics

### Scoring System
- Kill enemies to increase kill count
- Every 20 kills rewards 10 coins
- Use coins to unlock new weapons

### Difficulty Progression
- Enemy count increases with level
- Higher levels spawn more enemies per wave
- Dynamic difficulty scaling

### Combat System
- Real-time bullet physics
- Distance-based hit detection
- Weapon-specific damage values
- Reload mechanics with cooldowns

## Development Guide

### Adding a New Weapon

1. **Define weapon config** in `js/utils/config.js`:
```javascript
{
  name: "New Weapon",
  description: "Description",
  cost: 1000,
  borderColor: "#color",
  textColor: "#color"
}
```

2. **Add weapon stats** in `Player.setWeapon()`:
```javascript
else if (weaponType === 'newweapon') {
  this.maxAmmo = 30;
  this.shootCooldownMax = 10;
  this.bulletType = 'normal';
  // ... other stats
}
```

3. **Handle bullet rendering** in `Bullet.draw()` if custom type

### Adding a New Power-Up

1. **Add to PowerUp types** in `js/classes/PowerUp.js`
2. **Handle in Player.applyPowerUp()**
3. **Update in Player.update()** for timer
4. **Add visual effect in Player.draw()**

### Debugging Tips

- Enable browser console for error logs
- Check `window.gameState` for state inspection
- Use `test.html` for isolated component testing
- Monitor FPS with browser DevTools

### Code Style

- Use ES6+ features (classes, arrow functions, const/let)
- JSDoc comments for all functions
- Korean comments for complex logic
- 2-space indentation
- Descriptive variable names

## Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome | Yes |
| Firefox | Yes |
| Safari | Yes |
| Edge | Yes |
| Opera | Yes |

## Known Issues

- Mobile controls may need calibration on some devices
- High particle count (>500) may affect performance on older browsers

## Roadmap

### Completed ✅
- [x] Modular architecture refactoring
- [x] 10+ weapon types with unique mechanics
- [x] Bullet trajectory visualization
- [x] Aim line preview system
- [x] Reload progress indicator
- [x] Power-up system (6 types)
- [x] Difficulty levels (Easy/Normal/Hard)
- [x] Character customization
- [x] Leaderboard with Data SDK
- [x] Mobile touch controls
- [x] Particle effects system
- [x] Korean code documentation

### In Progress 🚧
- [ ] Performance optimization (object pooling)
- [ ] Sound effects integration
- [ ] Additional visual effects

### Planned 📋
- [ ] Multiple enemy types (fast, tank, shooter)
- [ ] Boss battles every 10 levels
- [ ] Achievement system
- [ ] Survival mode (endless waves)
- [ ] Cooperative multiplayer
- [ ] Map obstacles and cover system
- [ ] Weapon modification system
- [ ] Daily challenges

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Credits

- **Developer**: shinyubin1015
- **Game Engine**: Custom HTML5 Canvas
- **UI Framework**: Tailwind CSS
- **SDK Integration**: Element SDK, Data SDK

## Contact

- GitHub: [@shinyubin1015](https://github.com/shinyubin1015)
- Repository: [Shooting-game](https://github.com/shinyubin1015/Shooting-game)

---

**Last Updated**: December 2025  
**Version**: 2.0.0 (Modular Architecture Release)
- [ ] Mobile touch controls
- [ ] Multiple game modes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

shinyubin1015

## Acknowledgments

- Built as a learning project for browser-based game development
- Inspired by classic FPS games

---

Made with HTML5 Canvas and JavaScript
