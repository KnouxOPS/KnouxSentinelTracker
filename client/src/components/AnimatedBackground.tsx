import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: string;
  delay: string;
}

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleCount = 9;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        left: `${(i + 1) * 10}%`,
        delay: `${i * 2}s`,
      });
    }

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle animate-particle"
          style={{
            left: particle.left,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
