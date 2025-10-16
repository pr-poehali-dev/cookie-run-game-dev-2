import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GameRunnerProps {
  selectedCharacter: number;
}

type Obstacle = {
  x: number;
  type: 'spike' | 'gap';
};

type Coin = {
  x: number;
  y: number;
};

const GameRunner = ({ selectedCharacter }: GameRunnerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [distance, setDistance] = useState(0);
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(5);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [coinsList, setCoinsList] = useState<Coin[]>([]);
  const [gameOver, setGameOver] = useState(false);
  
  const gameLoopRef = useRef<number>();
  const groundY = 0;
  const jumpHeight = 150;

  const characters = ['🍪', '🥐', '🧁', '🍩'];

  useEffect(() => {
    if (!isPlaying) return;

    let jumpVelocity = 0;
    let obstacleSpawnCounter = 0;
    let coinSpawnCounter = 0;

    const gameLoop = () => {
      setDistance(prev => prev + 0.1);
      setScore(prev => prev + 1);

      if (isJumping) {
        jumpVelocity -= 0.8;
        setPlayerY(prev => {
          const newY = prev + jumpVelocity;
          if (newY <= groundY) {
            setIsJumping(false);
            return groundY;
          }
          return newY;
        });
      }

      obstacleSpawnCounter++;
      if (obstacleSpawnCounter > 60) {
        obstacleSpawnCounter = 0;
        const newObstacle: Obstacle = {
          x: 600,
          type: Math.random() > 0.5 ? 'spike' : 'gap'
        };
        setObstacles(prev => [...prev, newObstacle]);
      }

      coinSpawnCounter++;
      if (coinSpawnCounter > 30) {
        coinSpawnCounter = 0;
        const newCoin: Coin = {
          x: 600,
          y: Math.random() > 0.5 ? 80 : 40
        };
        setCoinsList(prev => [...prev, newCoin]);
      }

      setObstacles(prev => 
        prev
          .map(obs => ({ ...obs, x: obs.x - gameSpeed }))
          .filter(obs => obs.x > -50)
      );

      setCoinsList(prev =>
        prev
          .map(coin => ({ ...coin, x: coin.x - gameSpeed }))
          .filter(coin => coin.x > -30)
      );

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
          setGameOver(true);
          setIsPlaying(false);
        }
        return prev;
      });

      setCoinsList(prev => {
        return prev.filter(coin => {
          if (coin.x > 20 && coin.x < 80 && Math.abs(coin.y - (playerY + 20)) < 30) {
            setCoins(c => c + 1);
            setScore(s => s + 50);
            return false;
          }
          return true;
        });
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
  }, [isPlaying, isJumping, playerY, gameSpeed]);

  const handleJump = () => {
    if (!isJumping && playerY === groundY && isPlaying) {
      setIsJumping(true);
      setPlayerY(jumpHeight);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setCoins(0);
    setDistance(0);
    setPlayerY(0);
    setObstacles([]);
    setCoinsList([]);
    setIsJumping(false);
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

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-4 text-xs">
          <div className="bg-[#FFB84D] pixel-borders px-4 py-2">
            <span className="text-[#8B4513]">ОЧКИ: {Math.floor(score)}</span>
          </div>
          <div className="bg-[#FFB84D] pixel-borders px-4 py-2">
            <span className="text-[#8B4513]">🪙 {coins}</span>
          </div>
          <div className="bg-[#FFB84D] pixel-borders px-4 py-2">
            <span className="text-[#8B4513]">📏 {Math.floor(distance)}м</span>
          </div>
        </div>
      </div>

      <div 
        className="relative w-full h-[400px] bg-gradient-to-b from-sky-200 to-green-200 pixel-borders overflow-hidden cursor-pointer"
        onClick={handleJump}
      >
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
            <h2 className="text-2xl text-white mb-4 pixel-text-shadow">
              ГОТОВ БЕЖАТЬ?
            </h2>
            <Button 
              onClick={startGame}
              className="bg-[#FF6B9D] hover:bg-[#FF6B9D] text-white pixel-borders px-8 py-6 text-sm"
            >
              СТАРТ
            </Button>
            <p className="text-white text-xs mt-4">
              Нажми ПРОБЕЛ или экран для прыжка
            </p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
            <h2 className="text-2xl text-white mb-2 pixel-text-shadow">
              ИГРА ОКОНЧЕНА!
            </h2>
            <p className="text-white text-sm mb-4">
              Очки: {Math.floor(score)} | Монеты: {coins}
            </p>
            <Button 
              onClick={startGame}
              className="bg-[#FF6B9D] hover:bg-[#FF6B9D] text-white pixel-borders px-8 py-6 text-sm"
            >
              ЕЩЁ РАЗ
            </Button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#8B4513]" />
        
        <div 
          className="absolute text-6xl transition-all duration-100"
          style={{
            left: '50px',
            bottom: `${playerY + 64}px`,
            filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.3))'
          }}
        >
          {characters[selectedCharacter]}
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
            {obstacle.type === 'spike' ? (
              <div className="text-4xl">🔺</div>
            ) : (
              <div className="w-12 h-12 bg-[#8B4513]" />
            )}
          </div>
        ))}

        {coinsList.map((coin, idx) => (
          <div
            key={`coin-${idx}`}
            className="absolute text-3xl animate-pulse"
            style={{
              left: `${coin.x}px`,
              bottom: `${coin.y + 64}px`
            }}
          >
            🪙
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
        💡 Используй ПРОБЕЛ или нажми на игровое поле для прыжка
      </div>
    </div>
  );
};

export default GameRunner;
