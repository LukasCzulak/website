import { useState, useEffect, useCallback, useRef } from "react";
import "./DynamicFog.css";

const random = (min, max) => Math.random() * (max - min) + min;

export function DynamicFog({ particleLimit = 25, initialAmount = 5, particleLoops = 3 }) {
  const [particles, setParticles] = useState([]);
  
  const activeCount = useRef(0);
  const timeoutIds = useRef(new Set());
  
  const images = [
    '/fog_white.webp', 
    '/fog_grey.webp', 
    '/fog_light_green.webp',
    '/fog_dark_green.webp',
    '/fog_light_blue.webp',
    '/fog_dark_blue.webp'
  ];

  const spawnParticle = useCallback((isInitial = false) => {
    if (activeCount.current >= particleLimit) return;

    activeCount.current += 1;

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
    const rotation = random(0, 0);
    const imageIndex = Math.floor(Math.random() * 6);

    const newParticle = {
      id, isInitial, duration, size, maxOpacity, startX, startY, endX, endY, rotation, imageIndex
    };

    setParticles((prev) => [...prev, newParticle]);

    const removeTimeout = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
      activeCount.current -= 1;
      timeoutIds.current.delete(removeTimeout);
      
      if (activeCount.current < particleLimit) {
         spawnParticle(false);
      }
    }, duration * 1000);
    
    timeoutIds.current.add(removeTimeout);
  }, [particleLimit]);

  useEffect(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current.clear();
    setParticles([]);
    activeCount.current = 0;

    if (particleLimit > 0) {
      const totalToSpawn = Math.min(particleLimit, initialAmount + particleLoops);
      for (let i = 0; i < totalToSpawn; i++) {
        spawnParticle(i < initialAmount); 
      }
    }

    return () => {
      timeoutIds.current.forEach(clearTimeout);
      timeoutIds.current.clear();
    };
  }, [spawnParticle, particleLimit, initialAmount, particleLoops]);

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
