import { useState, useEffect, useCallback, useRef } from "react";
import "./DynamicFog.css";

const random = (min, max) => Math.random() * (max - min) + min;

export function DynamicFog() {
  const [particles, setParticles] = useState([]);
  const isSpawning = useRef(false); 

  const spawnParticle = useCallback((isInitial = false) => {
    const id = Math.random().toString(36).substring(2, 9);

    // random duration 45 - 90 seconds
    const duration = random(30, 60);

    // random size 0.25x - 1.5x
    const size = random(1, 2.5); 

    // random opacity 0.05x - 0.1x
    const maxOpacity = random(0.05, 0.125);

    // random start and end points
    const startX = random(0, 100);
    const startY = random(0, 100);
    const endX = random(0, 100);
    const endY = random(0, 100);

    // random rotation: currently off
    const rotation = random(0, 0);

    // random color
    const isGreenish = Math.random() > 0.69;
    const sepia = isGreenish ? random(0.5, 1) : 0;
    const hueRotate = isGreenish ? random(60, 120) : 0;
    const saturate = isGreenish ? random(100, 400) : 100;

    const newParticle = {
      id, isInitial, duration, size, maxOpacity, startX, startY, endX, endY, rotation, sepia, hueRotate, saturate
    };

    setParticles((prev) => [...prev, newParticle]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, duration * 1000);

    if (!isInitial) {
      const nextSpawnTime = random(5, 8) * 1000;
      setTimeout(() => spawnParticle(false), nextSpawnTime);
    }
  }, []);

  useEffect(() => {
    if (!isSpawning.current) {
      isSpawning.current = true;
      for (let i = 0; i < 5; i++) {
        spawnParticle(true); 
      }
      spawnParticle(false); 
    }
  }, [spawnParticle]);

  return (
    <div className="dynamic-fog-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="fog-particle"
          style={{
            "--startX": `${p.startX}vw`,
            "--startY": `${p.startY}vh`,
            "--endX": `${p.endX}vw`,
            "--endY": `${p.endY}vh`,
            "--duration": `${p.duration}s`,
            "--size": p.size,
            "--maxOpacity": p.maxOpacity,
            "--rotation": `${p.rotation}deg`,
            "--sepia": p.sepia,
            "--hue": `${p.hueRotate}deg`,
            "--saturate": `${p.saturate}%`,
            "--isInitial": `${p.isInitial}%`,
          }}
        />
      ))}
    </div>
  );
}
