import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface GameRunnerProps {
  selectedCharacter: number;
}

type Donut = {
  x: number;
  y: number;
};

type Obstacle = {
  x: number;
  y: number;
};

const GameRunner = ({ selectedCharacter }: GameRunnerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [donuts, setDonuts] = useState(0);
  const [missedDonuts, setMissedDonuts] = useState(0);
  const [lives, setLives] = useState(3);
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [playerSpeed, setPlayerSpeed] = useState(3);
  const [enemyDistance, setEnemyDistance] = useState(400);
  const [donutsList, setDonutsList] = useState<Donut[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [speedBoost, setSpeedBoost] = useState(0);
  
  const gameLoopRef = useRef<number>();
  const groundY = 0;
  const jumpHeight = 150;
  const enemySpeed = 4;

  const playerImage = 'https://cdn.poehali.dev/files/94bca562-12a4-476f-a4ad-f2ea5123983c.jpg';
  const enemyImage = 'https://cdn.poehali.dev/files/b/penguin/3Fc9gmAze04CdZE5EUWqU_output.png';

  useEffect(() => {
    if (!isPlaying) return;

    let jumpVelocity = 0;
    let donutSpawnCounter = 0;
    let obstacleSpawnCounter = 0;
    let speedBoostTimer = speedBoost;

    const gameLoop = () => {
      setScore(prev => prev + 1);

      if (isJumping) {
        jumpVelocity -= 1.5;
        setPlayerY(prev => {
          const newY = prev + jumpVelocity;
          if (newY <= groundY) {
            setIsJumping(false);
            return groundY;
          }
          return newY;
        });
      }

      if (speedBoostTimer > 0) {
        speedBoostTimer -= 1;
        setSpeedBoost(speedBoostTimer);
      }

      const currentPlayerSpeed = speedBoostTimer > 0 ? playerSpeed + 3 : playerSpeed;

      setEnemyDistance(prev => {
        const newDistance = prev + (enemySpeed - currentPlayerSpeed);
        
        if (newDistance <= 50) {
          setGameWon(true);
          setIsPlaying(false);
          return prev;
        }
        
        if (newDistance >= 600) {
          setGameOver(true);
          setIsPlaying(false);
          return prev;
        }
        
        return newDistance;
      });

      donutSpawnCounter++;
      if (donutSpawnCounter > 50) {
        donutSpawnCounter = 0;
        const newDonut: Donut = {
          x: 600,
          y: Math.random() > 0.5 ? 100 : 50
        };
        setDonutsList(prev => [...prev, newDonut]);
      }

      obstacleSpawnCounter++;
      if (obstacleSpawnCounter > 80) {
        obstacleSpawnCounter = 0;
        const newObstacle: Obstacle = {
          x: 600,
          y: 0
        };
        setObstacles(prev => [...prev, newObstacle]);
      }

      setDonutsList(prev => {
        const filtered = prev
          .map(donut => ({ ...donut, x: donut.x - 5 }))
          .filter(donut => {
            if (donut.x < -30) {
              setMissedDonuts(m => {
                const newMissed = m + 1;
                if (newMissed >= 3) {
                  setLives(l => {
                    const newLives = l - 1;
                    if (newLives <= 0) {
                      setGameOver(true);
                      setIsPlaying(false);
                    }
                    return newLives;
                  });
                  return 0;
                }
                return newMissed;
              });
              return false;
            }
            return donut.x > -30;
          });
        return filtered;
      });

      setObstacles(prev =>
        prev
          .map(obs => ({ ...obs, x: obs.x - 5 }))
          .filter(obs => obs.x > -50)
      );

      setDonutsList(prev => {
        return prev.filter(donut => {
          if (donut.x > 20 && donut.x < 80 && Math.abs(donut.y - (playerY + 20)) < 40) {
            setDonuts(d => d + 1);
            setScore(s => s + 100);
            setSpeedBoost(180);
            return false;
          }
          return true;
        });
      });

      setObstacles(prev => {
        const playerHit = prev.some(obs => {
          if (obs.x > 20 && obs.x < 80) {
            if (playerY < 30) {
              return true;
            }
          }
          return false;
        });
        
        if (playerHit) {
          setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
              setGameOver(true);
              setIsPlaying(false);
            }
            return newLives;
          });
          return prev.filter(obs => obs.x <= 20 || obs.x >= 80);
        }
        return prev;
      });

      if (isPlaying) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, isJumping, playerY, playerSpeed, speedBoost]);

  const handleJump = () => {
    if (!isJumping && playerY === groundY && isPlaying) {
      setIsJumping(true);
      setPlayerY(jumpHeight);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setDonuts(0);
    setMissedDonuts(0);
    setLives(3);
    setPlayerY(0);
    setEnemyDistance(400);
    setDonutsList([]);
    setObstacles([]);
    setIsJumping(false);
    setSpeedBoost(0);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isJumping, playerY]);

  const distancePercent = Math.max(0, Math.min(100, ((600 - enemyDistance) / 550) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-4 text-xs flex-wrap">
          <div className="bg-[#FFB84D] pixel-borders px-4 py-2">
            <span className="text-[#8B4513]">ОЧКИ: {Math.floor(score)}</span>
          </div>
          <div className="bg-[#FFB84D] pixel-borders px-4 py-2">
            <span className="text-[#8B4513]">🍩 {donuts}</span>
          </div>
          <div className={`pixel-borders px-4 py-2 ${lives === 3 ? 'bg-green-400' : lives === 2 ? 'bg-yellow-400' : 'bg-red-400'}`}>
            <span className="text-white">
              ❤️ {lives} {lives === 1 ? 'ЖИЗНЬ' : 'ЖИЗНИ'}
            </span>
          </div>
          <div className="bg-gray-200 pixel-borders px-4 py-2">
            <span className="text-[#8B4513]">
              Пропущено: {missedDonuts}/3
            </span>
          </div>
          <div className={`pixel-borders px-4 py-2 ${speedBoost > 0 ? 'bg-[#FF6B9D] animate-pulse' : 'bg-gray-300'}`}>
            <span className={speedBoost > 0 ? 'text-white' : 'text-gray-500'}>
              ⚡ {speedBoost > 0 ? 'УСКОРЕНИЕ!' : 'БЕЗ УСКОРЕНИЯ'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2 text-xs">
          <span className="text-[#8B4513]">ТЫ</span>
          <span className="text-[#8B4513] font-bold">РАССТОЯНИЕ ДО ВРАГА</span>
          <span className="text-red-600 font-bold">ВРАГ 👹</span>
        </div>
        <div className="relative">
          <Progress value={distancePercent} className="h-6 pixel-borders" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-[#8B4513] font-bold pixel-text-shadow">
              {Math.floor(enemyDistance)}м
            </span>
          </div>
        </div>
      </div>

      <div 
        className="relative w-full h-[400px] bg-gradient-to-b from-sky-200 to-green-200 pixel-borders overflow-hidden cursor-pointer"
        onClick={handleJump}
      >
        {!isPlaying && !gameOver && !gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
            <h2 className="text-2xl text-white mb-4 pixel-text-shadow">
              ПОГОНЯ!
            </h2>
            <p className="text-white text-sm mb-4 text-center px-4">
              Враг убегает! Собирай пончики 🍩 для ускорения!<br/>
              У тебя 3 жизни. Не пропусти 3 пончика подряд!
            </p>
            <Button 
              onClick={startGame}
              className="bg-[#FF6B9D] hover:bg-[#FF6B9D] text-white pixel-borders px-8 py-6 text-sm"
            >
              НАЧАТЬ ПОГОНЮ
            </Button>
            <p className="text-white text-xs mt-4">
              ПРОБЕЛ или клик для прыжка
            </p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
            <h2 className="text-3xl text-red-500 mb-2 pixel-text-shadow">
              ВРАГ СБЕЖАЛ! 😢
            </h2>
            <p className="text-white text-sm mb-4">
              Очки: {Math.floor(score)} | Пончики: {donuts}
            </p>
            <Button 
              onClick={startGame}
              className="bg-[#FF6B9D] hover:bg-[#FF6B9D] text-white pixel-borders px-8 py-6 text-sm"
            >
              ПОПРОБОВАТЬ СНОВА
            </Button>
          </div>
        )}

        {gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
            <h2 className="text-3xl text-yellow-400 mb-2 pixel-text-shadow animate-pulse">
              ПОБЕДА! 🎉
            </h2>
            <p className="text-white text-lg mb-2">
              ТЫ ПОЙМАЛ ВРАГА!
            </p>
            <p className="text-white text-sm mb-4">
              Очки: {Math.floor(score)} | Пончики: {donuts}
            </p>
            <Button 
              onClick={startGame}
              className="bg-[#FF6B9D] hover:bg-[#FF6B9D] text-white pixel-borders px-8 py-6 text-sm"
            >
              ИГРАТЬ ЕЩЁ
            </Button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#8B4513]" />
        
        <div 
          className="absolute transition-all duration-100"
          style={{
            left: '50px',
            bottom: `${playerY + 64}px`,
            transform: speedBoost > 0 ? 'scale(1.1)' : 'scale(1)',
            width: '80px',
            height: '80px'
          }}
        >
          <img 
            src={playerImage} 
            alt="Player" 
            className="w-full h-full object-contain"
            style={{
              filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.4))'
            }}
          />
          {speedBoost > 0 && (
            <span className="absolute -right-2 top-0 text-3xl animate-pulse">💨</span>
          )}
        </div>

        <div 
          className="absolute transition-all"
          style={{
            left: `${enemyDistance}px`,
            bottom: '64px',
            width: '90px',
            height: '90px'
          }}
        >
          <img 
            src={enemyImage} 
            alt="Enemy" 
            className="w-full h-full object-contain animate-pulse"
            style={{
              filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.5))'
            }}
          />
        </div>

        {obstacles.map((obstacle, idx) => (
          <div
            key={`obs-${idx}`}
            className="absolute"
            style={{
              left: `${obstacle.x}px`,
              bottom: '64px'
            }}
          >
            <div className="text-4xl">🔺</div>
          </div>
        ))}

        {donutsList.map((donut, idx) => (
          <div
            key={`donut-${idx}`}
            className="absolute text-4xl animate-pulse"
            style={{
              left: `${donut.x}px`,
              bottom: `${donut.y + 64}px`
            }}
          >
            🍩
          </div>
        ))}

        {isPlaying && (
          <>
            <div className="absolute top-4 left-4 text-2xl animate-pulse">☁️</div>
            <div className="absolute top-12 right-20 text-2xl animate-pulse">☁️</div>
            <div className="absolute top-8 right-40 text-xl animate-pulse">☁️</div>
          </>
        )}
      </div>

      <div className="mt-4 text-xs text-center text-[#8B4513]">
        💡 Собирай пончики 🍩 для ускорения! У тебя 3 жизни. Пропустишь 3 пончика - потеряешь жизнь!
      </div>
    </div>
  );
};

export default GameRunner;