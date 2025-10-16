import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CharacterGalleryProps {
  selectedCharacter: number;
  onSelectCharacter: (index: number) => void;
}

type Character = {
  image: string;
  name: string;
  description: string;
  speed: number;
  jump: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
};

const CharacterGallery = ({ selectedCharacter, onSelectCharacter }: CharacterGalleryProps) => {
  const characters: Character[] = [
    {
      image: 'https://cdn.poehali.dev/files/94bca562-12a4-476f-a4ad-f2ea5123983c.jpg',
      name: 'Ледяной Воин',
      description: 'Герой с магией льда',
      speed: 7,
      jump: 6,
      rarity: 'legendary',
      unlocked: true
    }
  ];

  const rarityColors = {
    common: 'bg-gray-400',
    rare: 'bg-blue-400',
    epic: 'bg-purple-400',
    legendary: 'bg-yellow-400'
  };

  const rarityLabels = {
    common: 'Обычный',
    rare: 'Редкий',
    epic: 'Эпический',
    legendary: 'Легендарный'
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#8B4513] pixel-text-shadow">
        ВЫБЕРИ ПЕРСОНАЖА
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((char, index) => (
          <Card
            key={index}
            className={`pixel-borders p-4 transition-all cursor-pointer ${
              char.unlocked
                ? selectedCharacter === index
                  ? 'bg-[#FF6B9D] text-white scale-105'
                  : 'bg-white hover:scale-105'
                : 'bg-gray-200 opacity-60 cursor-not-allowed'
            }`}
            onClick={() => char.unlocked && onSelectCharacter(index)}
          >
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                {char.unlocked ? (
                  <img 
                    src={char.image} 
                    alt={char.name}
                    className="w-24 h-24 object-contain"
                    style={{
                      filter: 'drop-shadow(3px 3px 5px rgba(0,0,0,0.3))'
                    }}
                  />
                ) : (
                  <div className="text-6xl">🔒</div>
                )}
              </div>
              
              <Badge 
                className={`${rarityColors[char.rarity]} text-white text-xs mb-2 pixel-borders`}
              >
                {rarityLabels[char.rarity]}
              </Badge>

              <h3 className={`text-lg font-bold mb-1 ${selectedCharacter === index && char.unlocked ? 'text-white' : 'text-[#8B4513]'}`}>
                {char.name}
              </h3>
              
              <p className={`text-xs mb-3 ${selectedCharacter === index && char.unlocked ? 'text-white/90' : 'text-gray-600'}`}>
                {char.description}
              </p>

              {char.unlocked && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className={selectedCharacter === index ? 'text-white' : 'text-[#8B4513]'}>
                      ⚡ Скорость
                    </span>
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-4 ${
                            i < char.speed
                              ? selectedCharacter === index
                                ? 'bg-white'
                                : 'bg-[#FFB84D]'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className={selectedCharacter === index ? 'text-white' : 'text-[#8B4513]'}>
                      🦘 Прыжок
                    </span>
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-4 ${
                            i < char.jump
                              ? selectedCharacter === index
                                ? 'bg-white'
                                : 'bg-[#4A90E2]'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {char.unlocked && selectedCharacter === index && (
                <div className="mt-3">
                  <Badge className="bg-white text-[#FF6B9D] pixel-borders text-xs">
                    ✓ ВЫБРАНО
                  </Badge>
                </div>
              )}

              {!char.unlocked && (
                <Button
                  disabled
                  className="mt-3 bg-gray-400 text-white pixel-borders text-xs w-full"
                >
                  🔒 ЗАБЛОКИРОВАНО
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="bg-[#FFB84D] pixel-borders p-4 inline-block">
          <p className="text-xs text-[#8B4513]">
            💡 Открывай новых персонажей, собирая монеты в игре!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterGallery;