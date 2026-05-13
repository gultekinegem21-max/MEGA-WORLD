
export type TextureType = 'dirt' | 'grass' | 'glass' | 'wood' | 'log' | 'cobblestone';

export interface Block {
  id: string;
  pos: [number, number, number];
  texture: TextureType;
}

export interface GameState {
  blocks: Block[];
  addBlock: (x: number, y: number, z: number) => void;
  removeBlock: (x: number, y: number, z: number) => void;
  saveWorld: () => void;
  resetWorld: () => void;
  texture: TextureType;
  setTexture: (texture: TextureType) => void;
}

export interface GeminiResponse {
  idea: string;
  blueprint?: {
    blocks: Array<{
      pos: [number, number, number];
      texture: TextureType;
    }>;
  };
}
