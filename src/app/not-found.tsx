"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SmoothSnake404Game() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const router = useRouter();

  const generateFood = useCallback(() => {
    let newFood : any;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, gameStarted, generateFood, score, highScore]);

  useEffect(() => {
    const speed = Math.max(80, 120 - Math.floor(score / 50) * 10); // Dynamic speed
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, score]);

  useEffect(() => {
    const handleKeyPress = (e : any) => {
      e.preventDefault();
      
      if (!gameStarted && e.code === 'Space') {
        setGameStarted(true);
        return;
      }

      if (gameOver && e.code === 'Space') {
        resetGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted, gameOver]);

  return (
    <div className="h-screen w-screen bg-black text-yellow-400 flex overflow-hidden">
      {/* Left Side - Game */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 opacity-10 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Game Container */}
        <div className="bg-black border-4 border-yellow-400 rounded-xl p-6 shadow-2xl z-10 transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-mono">Score: <span className="text-yellow-300">{score}</span></div>
            <div className="text-lg font-mono">High: <span className="text-yellow-300">{highScore}</span></div>
          </div>

          {/* Game Grid */}
          <div 
            className="grid bg-gray-900 border-2 border-yellow-600 mx-auto rounded-lg overflow-hidden shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: '400px',
              height: '400px'
            }}
          >
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
              const isFood = food.x === x && food.y === y;
              
              return (
                <div
                  key={index}
                  className={`border border-gray-800 transition-all duration-75 ${
                    isSnake 
                      ? isHead 
                        ? 'bg-yellow-300 shadow-lg' 
                        : 'bg-yellow-400 shadow-md'
                      : isFood 
                        ? 'bg-red-500 shadow-red-500/50 shadow-lg' 
                        : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                />
              );
            })}
          </div>

          {/* Game Status */}
          <div className="mt-4 text-center">
            {!gameStarted && (
              <div className="space-y-2">
                <p className="text-yellow-300 text-lg">Press SPACE to start!</p>
                <div className="animate-bounce text-3xl">🐍</div>
                <p className="text-xs opacity-75">Arrow keys or WASD to move</p>
              </div>
            )}
            
            {gameOver && (
              <div className="space-y-2">
                <p className="text-red-400 text-xl animate-pulse">Game Over!</p>
                <p className="text-yellow-300">Final Score: <span className="font-bold">{score}</span></p>
                {score === highScore && score > 0 && (
                  <p className="text-green-400 animate-bounce">🎉 New High Score! 🎉</p>
                )}
                <p className="text-sm opacity-75">Press SPACE to play again</p>
              </div>
            )}
            
            {gameStarted && !gameOver && (
              <div className="text-center">
                <p className="text-xs opacity-60">Speed increases with score!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - 404 Display */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center p-8 bg-gradient-to-bl from-black to-gray-900 relative">
        {/* Large floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-yellow-400 opacity-5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 60}px`,
                height: `${20 + Math.random() * 60}px`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="text-center z-10 space-8">
          {/* Main 404 */}
          <div className="relative">
            <h1 className="text-9xl md:text-[12rem] font-black leading-none">
              <span className="text-yellow-400 animate-pulse drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">4</span>
              <span className="text-yellow-300 animate-pulse drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]" style={{ animationDelay: '0.5s' }}>0</span>
              <span className="text-yellow-400 animate-pulse drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]" style={{ animationDelay: '1s' }}>4</span>
            </h1>
            <div className="absolute inset-0 text-9xl md:text-[12rem] font-black leading-none opacity-20 blur-sm">
              <span className="text-yellow-500">404</span>
            </div>
          </div>
          
          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-widest text-yellow-300">
              PAGE NOT FOUND
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto animate-pulse"></div>
          </div>

          {/* Fun Messages */}
          <div className="space-y-6 max-w-md">
            <p className="text-xl text-yellow-200 leading-relaxed">
              Oops! The page you're looking for has slithered away...
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-4xl">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>🐍</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>💨</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🍎</span>
            </div>

            <p className="text-lg text-yellow-300 opacity-80">
              But hey, enjoy the Snake game while you're here!
            </p>

            {/* Navigation */}
            <div className="pt-6">
              <button className="inline-flex items-center px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/25"
              onClick={()=>{
                router.push('/')
              }}>
                🏠 Go Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
      
{/* let it be like this */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}