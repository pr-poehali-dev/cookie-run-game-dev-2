import { useState } from 'react';
import GameRunner from '@/components/GameRunner';
import CharacterGallery from '@/components/CharacterGallery';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Screen = 'game' | 'characters';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('game');
  const [selectedCharacter, setSelectedCharacter] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 overflow-hidden">
      <div className="max-w-6xl mx-auto p-4">
        <header className="text-center mb-6 mt-4">
          <h1 
            className="text-4xl md:text-6xl font-bold pixel-text-shadow mb-2"
            style={{
              color: '#FFB84D',
              WebkitTextStroke: '3px #8B4513',
              paintOrder: 'stroke fill'
            }}
          >
            COOKIE RUN
          </h1>
          <p className="text-xs md:text-sm text-[#8B4513] mt-4">
            Собирай монеты и избегай препятствий!
          </p>
        </header>

        <nav className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setCurrentScreen('game')}
            className={`pixel-borders px-8 py-6 text-sm transition-all ${
              currentScreen === 'game' 
                ? 'bg-[#FF6B9D] hover:bg-[#FF6B9D] text-white' 
                : 'bg-[#FFB84D] hover:bg-[#FFB84D] text-[#8B4513]'
            }`}
          >
            <Icon name="Gamepad2" className="mr-2" size={16} />
            ИГРА
          </Button>
          <Button
            onClick={() => setCurrentScreen('characters')}
            className={`pixel-borders px-8 py-6 text-sm transition-all ${
              currentScreen === 'characters' 
                ? 'bg-[#FF6B9D] hover:bg-[#FF6B9D] text-white' 
                : 'bg-[#FFB84D] hover:bg-[#FFB84D] text-[#8B4513]'
            }`}
          >
            <Icon name="Users" className="mr-2" size={16} />
            ПЕРСОНАЖИ
          </Button>
        </nav>

        <div className="bg-white/80 pixel-borders p-4 min-h-[500px]">
          {currentScreen === 'game' ? (
            <GameRunner selectedCharacter={selectedCharacter} />
          ) : (
            <CharacterGallery 
              selectedCharacter={selectedCharacter}
              onSelectCharacter={setSelectedCharacter}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
