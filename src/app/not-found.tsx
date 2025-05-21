'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Plane {
  id: number;
  x: number;
  y: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  angle: number;
  type: 'cannonball' | 'bomb';
}

export default function NotFound() {
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [cannonAngle, setCannonAngle] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [planeSpeed, setPlaneSpeed] = useState(4);
  const [planeCount, setPlaneCount] = useState(2);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse movement to aim cannon
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gameAreaRef.current || isGameOver) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    setCannonAngle(angle * (180 / Math.PI));
  }, [isGameOver]);

  // Shoot bullets
  const handleClick = useCallback(() => {
    if (!gameAreaRef.current || isGameOver) return;
    
    const radians = cannonAngle * (Math.PI / 180);
    setBullets(prev => [...prev, {
      id: Date.now(),
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      angle: cannonAngle,
      type: Math.random() > 0.5 ? 'cannonball' : 'bomb'
    }]);
  }, [cannonAngle, isGameOver]);

  // Reset game
  const handleReset = () => {
    setPlanes([]);
    setBullets([]);
    setScore(0);
    setMissed(0);
    setGameTime(0);
    setDifficulty(1);
    setPlaneSpeed(4);
    setPlaneCount(2);
    setIsGameOver(false);
  };

  // Update the time and speed tracking effect
  useEffect(() => {
    if (isGameOver) return;

    // Increase game time, speed, and plane count
    const timeInterval = setInterval(() => {
      setGameTime(prev => prev + 1);
      
      // Increase speed every 2 seconds
      if (gameTime > 0 && gameTime % 2 === 0) {
        setPlaneSpeed(prev => Math.min(prev + 0.5, 20));
      }
      
      // Increase plane count every 1.5 seconds
      if (gameTime > 0 && gameTime % 1.5 === 0) {
        setPlaneCount(prev => Math.min(prev + 1, 15)); // Cap at 15 planes at once
      }
      
      // Increase difficulty every 30 seconds
      if (gameTime > 0 && gameTime % 30 === 0) {
        setDifficulty(prev => Math.min(prev + 1, 5));
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [isGameOver, gameTime]);

  // Update the plane generation effect
  useEffect(() => {
    if (isGameOver) return;

    // Calculate spawn interval based on difficulty
    const spawnInterval = Math.max(1500 - (difficulty * 200), 500);
    
    const planeInterval = setInterval(() => {
      // Use planeCount for base number of planes
      const variableCount = Math.floor(Math.random() * 3); // 0-2 additional planes
      const totalPlanes = planeCount + variableCount;
      
      // Create planes in formation patterns
      const newPlanes = Array.from({ length: totalPlanes }, (_, index) => {
        // Create formation patterns based on index
        const formationSpacing = window.innerHeight * 0.6 / totalPlanes;
        const baseY = formationSpacing * (index + 1);
        const yVariation = (Math.random() - 0.5) * 50; // Add some randomness
        
        return {
          id: Date.now() + Math.random(),
          x: -50,
          y: Math.max(50, Math.min(window.innerHeight * 0.7, baseY + yVariation)),
        };
      });

      setPlanes(prev => [...prev, ...newPlanes]);
    }, spawnInterval);

    return () => clearInterval(planeInterval);
  }, [isGameOver, difficulty, planeCount]);

  // Update the game loop to use planeSpeed
  useEffect(() => {
    if (isGameOver) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      if (deltaTime >= 16) {
        lastTime = currentTime;
        
        // Move planes with updated speed
        setPlanes(prev => {
          return prev
            .map(plane => ({
              ...plane,
              x: plane.x + planeSpeed, // Use the dynamic planeSpeed
            }))
            .filter(plane => {
              const cannonCenterX = window.innerWidth / 2;
              const cannonCenterY = window.innerHeight / 2;
              
              const distanceToCannon = Math.sqrt(
                Math.pow(plane.x - cannonCenterX, 2) + 
                Math.pow(plane.y - cannonCenterY, 2)
              );
              
              if (distanceToCannon < 45) {
                setIsGameOver(true);
                return false;
              }
              
              if (plane.x > window.innerWidth) {
                setMissed(m => m + 1);
                return false;
              }
              return true;
            });
        });

        // Move bullets
        setBullets(prev => {
          return prev
            .map(bullet => {
              const radians = bullet.angle * (Math.PI / 180);
              return {
                ...bullet,
                x: bullet.x + Math.cos(radians) * 12,
                y: bullet.y + Math.sin(radians) * 12,
              };
            })
            .filter(bullet => 
              bullet.y > 0 && 
              bullet.y < window.innerHeight && 
              bullet.x > 0 && 
              bullet.x < window.innerWidth
            );
        });

        // Check bullet-plane collisions
        setPlanes(prev => {
          return prev.filter(plane => {
            const hit = bullets.some(bullet => {
              const distance = Math.sqrt(
                Math.pow(plane.x - bullet.x, 2) + Math.pow(plane.y - bullet.y, 2)
              );
              return distance < 25;
            });
            if (hit) {
              setScore(s => s + 1);
            }
            return !hit;
          });
        });
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [bullets, isGameOver, difficulty, planeSpeed]);

  // Add this at the top of the component
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div 
      ref={gameAreaRef}
      className="relative w-screen h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Enhanced 404 Message */}
      <motion.div 
        className="absolute top-0 left-0 right-0 pt-8 pb-6 bg-gradient-to-b from-black/80 to-transparent  z-20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <div className="text-center">
          <motion.h1 
            className="text-[120px] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(59, 130, 246, 0.5)",
                "0 0 40px rgba(59, 130, 246, 0.3)",
                "0 0 20px rgba(59, 130, 246, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            404
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <p className="text-3xl font-light text-white/90">Page Not Found</p>
            <div className="flex items-center justify-center gap-2">
              <motion.p 
                className="text-lg text-gray-300 bg-gray-800/30 px-6 py-2 rounded-full backdrop-blur-sm inline-flex items-center gap-2"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-blue-400">🎮</span>
                Defend against the planes while you're here!
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Add a subtle divider */}
      <motion.div
        className="absolute top-44 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-10"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "33%", opacity: 1 }}
        transition={{ delay: 0.6 }}
      />

      {/* Update the Score Panel position */}
      <motion.div 
        className="absolute top-48 left-4 bg-black/50 backdrop-blur-sm rounded-2xl p-6 text-white border border-gray-700/50 shadow-xl"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="text-2xl font-bold bg-gray-800/50 p-2 rounded">
            Score: {score}
          </div>
          <div className="text-xl text-red-500 bg-gray-800/50 p-2 rounded">
            Missed: {missed}
          </div>
          <div className="text-xl text-yellow-500 bg-gray-800/50 p-2 rounded">
            Wave: {difficulty}
          </div>
          <div className="text-xl text-blue-400 bg-gray-800/50 p-2 rounded">
            {Math.floor(gameTime)}s
          </div>
          <div className="text-xl text-green-400 bg-gray-800/50 p-2 rounded">
            Speed: {planeSpeed.toFixed(1)}x
          </div>
          <div className="text-xl text-purple-400 bg-gray-800/50 p-2 rounded">
            Planes: {planeCount}
          </div>
        </div>
      </motion.div>

      {/* Update the Navigation Controls position */}
      <motion.div 
        className="absolute top-48 right-4 flex gap-4"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg backdrop-blur-sm border border-gray-600/30 transition-all hover:scale-105"
        >
          ← Go Back
        </button>
        <Link 
          href="/"
          className="px-4 py-2 bg-blue-600/50 hover:bg-blue-500/50 text-white rounded-lg backdrop-blur-sm border border-blue-500/30 transition-all hover:scale-105"
        >
          Home
        </Link>
      </motion.div>

      {/* Game Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white border border-gray-700/50">
        <p className="text-sm text-gray-300">Mouse to aim • Click to shoot • Destroy planes • Survive</p>
      </div>

      {/* Planes */}
      <AnimatePresence>
        {planes.map(plane => (
          <motion.div
            key={plane.id}
            className="absolute text-4xl"
            style={{
              left: plane.x,
              top: plane.y,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            ✈️
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bullets */}
      <AnimatePresence>
        {bullets.map(bullet => (
          <motion.div
            key={bullet.id}
            className="absolute"
            style={{
              left: bullet.x,
              top: bullet.y,
              transform: `rotate(${bullet.angle}deg)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            {bullet.type === 'cannonball' ? (
              // Cannonball design
              <div className="relative">
                <div className="w-6 h-6 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-full shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-600/30 rounded-full" />
                  <div className="absolute inset-1 bg-gradient-to-br from-gray-500/20 to-transparent rounded-full" />
                </div>
                {/* Smoke trail */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-12 bg-gradient-to-t from-gray-500/0 via-gray-400/30 to-gray-300/50" />
              </div>
            ) : (
              // Bomb design
              <div className="relative">
                <div className="w-8 h-10 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-lg">
                  {/* Bomb body */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-600/30 rounded-lg" />
                  <div className="absolute inset-1 bg-gradient-to-br from-gray-500/20 to-transparent rounded-lg" />
                  {/* Bomb fuse */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-3 bg-gradient-to-t from-orange-500 to-red-600 rounded-t-full" />
                  {/* Bomb fins */}
                  <div className="absolute bottom-0 -left-1 w-2 h-4 bg-gray-800 rounded-l-sm transform -rotate-45" />
                  <div className="absolute bottom-0 -right-1 w-2 h-4 bg-gray-800 rounded-r-sm transform rotate-45" />
                </div>
                {/* Fire trail */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="w-3 h-8 bg-gradient-to-t from-orange-500 via-yellow-500 to-transparent opacity-75" />
                  <div className="w-2 h-6 bg-gradient-to-t from-red-500 via-orange-400 to-transparent absolute -top-2 left-1/2 -translate-x-1/2" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Realistic Cannon */}
      {!isGameOver && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="relative"
          style={{
              transform: `rotate(${cannonAngle}deg)`,
            }}
          >
            {/* Enhanced Cannon Base */}
            <div className="relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-28 h-28 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full border-8 border-gray-800 shadow-2xl" />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-radial from-gray-600 to-gray-800 rounded-full" />
              
              {/* Base Details */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-700 rounded-full transform -rotate-45" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-700 rounded-full transform rotate-45" />
            </div>

            {/* Enhanced Cannon Barrel */}
            <div className="relative w-40 h-16 origin-left">
              {/* Main Barrel Structure */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-10 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg shadow-inner">
                {/* Barrel Texture */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-600/20 to-transparent" />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent,gray-700/20_1px,transparent_2px)]" />
              </div>

              {/* Single Reinforcement Ring near muzzle */}
              <div className="absolute top-1/2 -translate-y-1/2 right-8">
                <div className="w-6 h-12 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 rounded-full shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-500/20 to-transparent rounded-full" />
              </div>

              {/* Barrel End with Enhanced Muzzle Break */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <div className="w-10 h-11 bg-gradient-to-r from-gray-800 to-gray-900 rounded-r-lg">
                  {/* Muzzle details */}
                  <div className="absolute inset-0 flex flex-col justify-between py-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-2 w-full bg-gray-900/50 rounded-full" />
                    ))}
                  </div>
                </div>
                {/* Enhanced muzzle brake */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-14 bg-gray-800 rounded-r-lg">
                  <div className="absolute inset-0 flex flex-col justify-between py-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-2 w-full bg-gray-900 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Cannon Sight */}
              <div className="absolute -top-4 left-12 w-8 h-8">
                <div className="w-2 h-8 bg-gray-700 rounded-full mx-auto" />
                <div className="w-4 h-4 bg-gray-600 rounded-full mt-1 mx-auto ring-2 ring-gray-500" />
              </div>
            </div>

            {/* Firing Mechanism */}
            <div className="absolute -top-2 left-8 w-6 h-10 bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-lg" />
          </motion.div>
        </div>
      )}

      {/* Enhanced Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center bg-gray-900/80 p-8 rounded-xl border border-red-500/30 shadow-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl text-red-500 font-bold mb-8"
            >
              CANNON DESTROYED!
            </motion.div>
            <div className="text-3xl text-white mb-2">Final Score: {score}</div>
            <div className="text-xl text-gray-400 mb-8">Survived for {Math.floor(gameTime)} seconds</div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xl transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={handleGoBack}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xl transition-colors"
              >
                Go Back
              </button>
              <Link 
                href="/"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xl transition-colors"
              >
                Home
            </Link>
            </div>
          </div>
        </div>
      )}

      {/* Visual Effects Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.2)_0%,transparent_100%)]" />
      </div>
    </div>
  );
}
