
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3 } from 'three';

const SPEED = 4;

const Player: React.FC = () => {
  const { camera } = useThree();
  const moveState = useRef({ forward: false, backward: false, left: false, right: false, up: false, down: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = true; break;
        case 'KeyS': moveState.current.backward = true; break;
        case 'KeyA': moveState.current.left = true; break;
        case 'KeyD': moveState.current.right = true; break;
        case 'Space': moveState.current.up = true; break;
        case 'ShiftLeft': moveState.current.down = true; break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = false; break;
        case 'KeyS': moveState.current.backward = false; break;
        case 'KeyA': moveState.current.left = false; break;
        case 'KeyD': moveState.current.right = false; break;
        case 'Space': moveState.current.up = false; break;
        case 'ShiftLeft': moveState.current.down = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const velocity = new Vector3();
  const direction = new Vector3();

  useFrame((state, delta) => {
    direction.z = Number(moveState.current.forward) - Number(moveState.current.backward);
    direction.x = Number(moveState.current.right) - Number(moveState.current.left);
    direction.y = Number(moveState.current.up) - Number(moveState.current.down);
    direction.normalize();

    if (moveState.current.forward || moveState.current.backward) velocity.z -= direction.z * SPEED * delta;
    if (moveState.current.left || moveState.current.right) velocity.x -= direction.x * SPEED * delta;
    if (moveState.current.up || moveState.current.down) velocity.y -= direction.y * SPEED * delta;

    camera.translateX(-velocity.x);
    camera.translateZ(-velocity.z);
    camera.position.y += direction.y * SPEED * delta;

    velocity.set(0, 0, 0);
  });

  return <PointerLockControls />;
};

export default Player;
