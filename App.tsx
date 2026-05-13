
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Stars, ContactShadows } from '@react-three/drei';
import { useStore } from './store';
import Cube from './components/Cube';
import Ground from './components/Ground';
import Player from './components/Player';
import HUD from './components/HUD';
import { getBuildingIdea } from './geminiService';
import { TextureType } from './types';

const App: React.FC = () => {
  const { blocks, addBlock, removeBlock, texture, setTexture, saveWorld, resetWorld, loadBlueprint } = useStore();
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const playerPosRef = useRef<[number, number, number]>([0, 0, 0]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Texture shortcuts 1-6
      const keys: Record<string, TextureType> = {
        Digit1: 'dirt',
        Digit2: 'grass',
        Digit3: 'glass',
        Digit4: 'wood',
        Digit5: 'log',
        Digit6: 'cobblestone',
      };
      if (keys[e.code]) setTexture(keys[e.code]);

      // Toggle Menu with 'E'
      if (e.code === 'KeyE') {
        setIsMenuOpen(prev => !prev);
      }
      
      // Close menu with 'Escape'
      if (e.code === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTexture, isMenuOpen]);

  // Unlock cursor when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.exitPointerLock?.();
    }
  }, [isMenuOpen]);

  const handleGeminiAssistant = useCallback(async () => {
    setLoadingAI(true);
    const context = blocks.length > 0 
      ? `User has built a world with ${blocks.length} blocks.` 
      : "The world is currently empty.";
    
    const result = await getBuildingIdea(context);
    setAiMessage(result.idea);
    
    if (result.blueprint?.blocks) {
      loadBlueprint(result.blueprint.blocks);
    }
    
    setLoadingAI(false);
    setTimeout(() => setAiMessage(null), 5000);
  }, [blocks, loadBlueprint]);

  const placeStructure = useCallback((type: string) => {
    // Basic structure definitions relative to center
    let structureBlocks: Array<{ pos: [number, number, number], texture: TextureType }> = [];
    
    // We'll place it slightly in front of the origin or current player view if we had full state,
    // but for now let's just place near 0,0,0 or an offset
    const offset: [number, number, number] = [2, 0, 2];

    switch(type) {
      case 'pillar':
        structureBlocks = [
          { pos: [0, 0, 0], texture: 'log' },
          { pos: [0, 1, 0], texture: 'log' },
          { pos: [0, 2, 0], texture: 'log' },
          { pos: [0, 3, 0], texture: 'log' },
        ];
        break;
      case 'hut':
        structureBlocks = [
          // Floor
          { pos: [0, 0, 0], texture: 'wood' }, { pos: [1, 0, 0], texture: 'wood' }, { pos: [2, 0, 0], texture: 'wood' },
          { pos: [0, 0, 1], texture: 'wood' }, { pos: [1, 0, 1], texture: 'wood' }, { pos: [2, 0, 1], texture: 'wood' },
          { pos: [0, 0, 2], texture: 'wood' }, { pos: [1, 0, 2], texture: 'wood' }, { pos: [2, 0, 2], texture: 'wood' },
          // Walls
          { pos: [0, 1, 0], texture: 'cobblestone' }, { pos: [2, 1, 0], texture: 'cobblestone' },
          { pos: [0, 1, 1], texture: 'cobblestone' }, { pos: [2, 1, 1], texture: 'cobblestone' },
          { pos: [0, 1, 2], texture: 'cobblestone' }, { pos: [1, 1, 2], texture: 'cobblestone' }, { pos: [2, 1, 2], texture: 'cobblestone' },
          // Roof
          { pos: [0, 2, 0], texture: 'wood' }, { pos: [1, 2, 0], texture: 'wood' }, { pos: [2, 2, 0], texture: 'wood' },
          { pos: [0, 2, 1], texture: 'wood' }, { pos: [1, 2, 1], texture: 'wood' }, { pos: [2, 2, 1], texture: 'wood' },
          { pos: [0, 2, 2], texture: 'wood' }, { pos: [1, 2, 2], texture: 'wood' }, { pos: [2, 2, 2], texture: 'wood' },
        ];
        break;
      case 'arch':
        structureBlocks = [
          { pos: [0, 0, 0], texture: 'cobblestone' }, { pos: [0, 1, 0], texture: 'cobblestone' }, { pos: [0, 2, 0], texture: 'cobblestone' },
          { pos: [1, 3, 0], texture: 'cobblestone' }, { pos: [2, 3, 0], texture: 'cobblestone' },
          { pos: [3, 0, 0], texture: 'cobblestone' }, { pos: [3, 1, 0], texture: 'cobblestone' }, { pos: [3, 2, 0], texture: 'cobblestone' },
        ];
        break;
    }

    const positioned = structureBlocks.map(b => ({
      ...b,
      pos: [b.pos[0] + offset[0], b.pos[1] + offset[1], b.pos[2] + offset[2]] as [number, number, number]
    }));
    
    loadBlueprint(positioned);
    setIsMenuOpen(false);
  }, [loadBlueprint]);

  return (
    <div className="w-full h-full relative bg-gray-900 overflow-hidden">
      <Canvas shadows camera={{ fov: 45, position: [5, 5, 5] }}>
        <Sky sunPosition={[100, 10, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        
        {!isMenuOpen && <Player />}
        
        {blocks.map((block) => (
          <Cube
            key={block.id}
            position={block.pos}
            texture={block.texture}
            onAddBlock={addBlock}
            onRemoveBlock={removeBlock}
          />
        ))}

        <Ground onAddBlock={addBlock} />
        <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Canvas>

      <HUD
        currentTexture={texture}
        setTexture={setTexture}
        onSave={saveWorld}
        onReset={resetWorld}
        onAssistant={handleGeminiAssistant}
        isLoadingAssistant={loadingAI}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onPlaceStructure={placeStructure}
      />

      {/* AI Message Pop-up */}
      {aiMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-md">
            <span className="font-bold">✨ Gemini says: </span>
            <span>{aiMessage}</span>
          </div>
        </div>
      )}

      {/* Start Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] group cursor-pointer pointer-events-none data-[active=false]:opacity-0 transition-opacity" id="start-screen">
          <div className="text-center p-8 bg-black/80 rounded-2xl border border-white/20 shadow-2xl pointer-events-auto" onClick={(e) => {
              const el = document.getElementById('start-screen');
              if (el) el.style.display = 'none';
          }}>
              <h2 className="text-5xl font-black text-white mb-4 minecraft-font tracking-widest">GEMINI CRAFT</h2>
              <p className="text-xl text-white/60 mb-8">Click to Enter the World</p>
              <div className="grid grid-cols-2 gap-4 text-left text-sm text-white/50 border-t border-white/10 pt-6">
                <div>W/A/S/D - Move</div>
                <div>Space - Up / Shift - Down</div>
                <div>L-Click - Place Block</div>
                <div>R-Click - Remove Block</div>
                <div>1-6 / E - Build Menu</div>
                <div>✨ - AI Assistant</div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default App;
