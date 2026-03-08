import { useState, useEffect, useCallback, useRef } from "react";
import "./DynamicFog.css";

const random = (min, max) => Math.random() * (max - min) + min;

export function DynamicFog({ particleLimit = 25, initialAmount = 5, particleLoops = 3 }) {
  const [particles, setParticles] = useState([]);
  const images = ['/fog_white.webp', 
    '/fog_grey.webp', 
    '/fog_light_green.webp',
    '/fog_dark_green.webp',
    '/fog_light_blue.webp',
    '/fog_dark_blue.webp']


  const spawnParticle = useCallback((isInitial = false) => {
    setParticles((prev) => {
      if (prev.length >= particleLimit) return prev;
      return prev;
    });

    // random id
    const id = Math.random().toString(36).substring(2, 9);

    // random duration 30 - 60 seconds
    const duration = random(30, 60);

    // random size 1.0x - 2.5x
    const size = random(1.0, 2.5);

    // random opacity 0.05x - 0.125x
    const maxOpacity = random(0.05, 0.125);

    // random start and end points
    const startX = random(-50, 150);
    const startY = random(-50, 150);
    const endX = random(-50, 150);
    const endY = random(-50, 150);

    const rotation = random(0, 0); // rotation ??

    const imageIndex = Math.floor(Math.random() * 6); // 0-5

    const newParticle = {
      id, isInitial, duration, size, maxOpacity, startX, startY, endX, endY, rotation, imageIndex
    };
    

    setParticles((prev) => {
      if (prev.length >= particleLimit) return prev;
      return [...prev, newParticle];
    });

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, duration * 1000);

    if (!isInitial) {
      const nextSpawnTime = random(5, 10) * 1000; // spawn next one in 5-10 seconds
      setTimeout(() => spawnParticle(false), nextSpawnTime);
    }
  }, [particleLimit]);

  useEffect(() => {
    if (particleLimit > 0) {
      
      for (let i = 0; i < initialAmount; i++) {
        spawnParticle(true); 
      }
      
      for (let i = 0; i < particleLoops; i++) {
        spawnParticle(false);
      }
    }
  }, [spawnParticle, particleLimit, particleLoops]);

  if (particleLimit === 0) return null;

  return (
    <div className="dynamic-fog-container">
      {particles.map((p) => {
        const savedImage = images[p.imageIndex];
        
        return (
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
              backgroundImage: `url(${savedImage})`,
              animationName: p.isInitial ? 'floatFogInitial' : 'floatFog'
            }}
          />
        );
      })}
    </div>
  );
}
