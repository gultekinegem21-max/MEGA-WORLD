
import React from 'react';

interface GroundProps {
  onAddBlock: (x: number, y: number, z: number) => void;
}

const Ground: React.FC<GroundProps> = ({ onAddBlock }) => {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.5, 0]}
      onClick={(e: any) => {
        e.stopPropagation();
        const [x, y, z] = [
            Math.round(e.point.x),
            Math.round(e.point.y),
            Math.round(e.point.z)
        ];
        onAddBlock(x, 0, z);
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#388e3c" />
    </mesh>
  );
};

export default Ground;
