
import { useState, useCallback, useEffect } from 'react';
import { Block, TextureType } from './types';
import { nanoid } from 'nanoid';

const getLocalStorage = (key: string) => {
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const setLocalStorage = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const useStore = () => {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    return getLocalStorage('world') || [];
  });
  const [texture, setTexture] = useState<TextureType>('dirt');

  const addBlock = useCallback((x: number, y: number, z: number) => {
    setBlocks((prev) => [
      ...prev,
      {
        id: nanoid(),
        pos: [x, y, z],
        texture,
      },
    ]);
  }, [texture]);

  const removeBlock = useCallback((x: number, y: number, z: number) => {
    setBlocks((prev) => 
      prev.filter((block) => {
        const [bx, by, bz] = block.pos;
        return bx !== x || by !== y || bz !== z;
      })
    );
  }, []);

  const saveWorld = useCallback(() => {
    setLocalStorage('world', blocks);
  }, [blocks]);

  const resetWorld = useCallback(() => {
    setBlocks([]);
    window.localStorage.removeItem('world');
  }, []);

  const loadBlueprint = useCallback((newBlocks: Array<{ pos: [number, number, number], texture: TextureType }>) => {
    const formattedBlocks = newBlocks.map(b => ({
      ...b,
      id: nanoid()
    }));
    setBlocks(prev => [...prev, ...formattedBlocks]);
  }, []);

  return {
    blocks,
    addBlock,
    removeBlock,
    saveWorld,
    resetWorld,
    texture,
    setTexture,
    loadBlueprint
  };
};
