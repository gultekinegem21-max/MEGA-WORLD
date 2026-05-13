
import React, { useState } from 'react';
import { TextureType } from '../types';

interface CubeProps {
  position: [number, number, number];
  texture: TextureType;
  onAddBlock: (x: number, y: number, z: number) => void;
  onRemoveBlock: (x: number, y: number, z: number) => void;
}

const TEXTURE_COLORS: Record<TextureType, string> = {
  dirt: '#5d4037',
  grass: '#4caf50',
  glass: '#e1f5fe',
  wood: '#795548',
  log: '#4e342e',
  cobblestone: '#757575',
};

const Cube: React.FC<CubeProps> = ({ position, texture, onAddBlock, onRemoveBlock }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleClick = (e: any) => {
    e.stopPropagation();
    const { x, y, z } = e.point;
    const dir = [
      Math.round(e.face.normal.x),
      Math.round(e.face.normal.y),
      Math.round(e.face.normal.z),
    ];
    
    if (e.button === 0) { // Left click: Place
      onAddBlock(position[0] + dir[0], position[1] + dir[1], position[2] + dir[2]);
    } else if (e.button === 2) { // Right click: Remove
      onRemoveBlock(position[0], position[1], position[2]);
    }
  };

  return (
    <mesh
      position={position}
      onPointerMove={(e) => {
        e.stopPropagation();
        setHovered(e.faceIndex);
      }}
      onPointerOut={() => setHovered(null)}
      onClick={handleClick}
      onContextMenu={(e: any) => e.nativeEvent.preventDefault()}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={TEXTURE_COLORS[texture]}
        opacity={texture === 'glass' ? 0.6 : 1}
        transparent={texture === 'glass'}
        metalness={0.1}
        roughness={0.8}
      />
      {/* Wireframe overlay for selected look */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.005, 1.005, 1.005]} />
        <meshBasicMaterial color="white" wireframe opacity={hovered !== null ? 0.3 : 0} transparent />
      </mesh>
    </mesh>
  );
};

export default Cube;
