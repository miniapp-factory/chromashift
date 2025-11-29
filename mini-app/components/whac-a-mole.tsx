"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const MOLE_POSITIONS = [
  { id: 0, label: "UP", className: "up" },
  { id: 1, label: "LEFT", className: "left" },
  { id: 2, label: "DOWN", className: "down" },
  { id: 3, label: "RIGHT", className: "right" },
];

export default function WhacAMole() {
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [notification, setNotification] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Spawn a mole at random intervals
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const spawn = () => {
      const randomIndex = Math.floor(Math.random() * MOLE_POSITIONS.length);
      const moleId = randomIndex;
      setActiveMole(moleId);
      // Start 2‑second timer to deduct HP if mole not hit
      moleTimerRef.current = setTimeout(() => {
        if (activeMole === moleId) {
          setHp((h) => h - 1);
          setActiveMole(null);
        }
      }, 2000);
      // Hide mole after 800ms if not hit
      setTimeout(() => {
        setActiveMole(null);
        clearTimeout(moleTimerRef.current);
      }, 800);
    };

    intervalRef.current = setInterval(spawn, 1200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);

  useEffect(() => {
        if (hp <= 0 && isRunning) {
          setIsRunning(false);
          setScore(0);
          setActiveMole(null);
          alert('Game Over');
          setNotification('Game Over');
        }
      }, [hp, isRunning]);

  useEffect(() => {
    if (notification) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle key presses
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isRunning || isPaused) return;
      const keyMap: Record<string, number> = {
        ArrowUp: 0,
        ArrowLeft: 1,
        ArrowDown: 2,
        ArrowRight: 3,
      };
      const expected = keyMap[e.key];
      if (activeMole === null) {
        // Wrong key pressed when no mole is active
        setHp((h) => h - 1);
      } else if (expected === activeMole) {
        setScore((s) => s + 1);
        setActiveMole(null);
        // Play hit sound or animation here if desired
      } else {
        // Wrong key pressed when a mole is active
        setHp((h) => h - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isRunning, isPaused, activeMole]);

  const startGame = () => {
    setScore(0);
    setActiveMole(null);
    setIsRunning(true);
    setIsPaused(false);
    setHp(3);
  };

  const pauseGame = () => {
    setIsPaused((p) => !p);
  };

  const resetGame = () => {
    setIsRunning(false);
    setIsPaused(false);
    setScore(0);
    setActiveMole(null);
  };

  useEffect(() => {
    return () => {
      clearTimeout(moleTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="text-2xl font-bold text-center mb-4">Score: {score} | HP: {hp}</div>
      {showNotification && notification && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${
            notification.includes('Game Over') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          } rounded-md p-2 shadow-md transition-opacity duration-500 ${
            showNotification ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {notification}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="h-32"></div>
        <div
          key={MOLE_POSITIONS[0].id}
          className={`relative h-32 bg-gray-200 rounded-lg flex items-center justify-center ${
            activeMole === MOLE_POSITIONS[0].id ? "bg-yellow-300 animate-pulse" : ""
          }`}
        >
          {activeMole === MOLE_POSITIONS[0].id && (
            <div className="text-4xl font-bold">🐹</div>
          )}
          <span className="absolute bottom-1 text-sm font-medium">{MOLE_POSITIONS[0].label}</span>
        </div>
        <div className="h-32"></div>

        <div
          key={MOLE_POSITIONS[1].id}
          className={`relative h-32 bg-gray-200 rounded-lg flex items-center justify-center ${
            activeMole === MOLE_POSITIONS[1].id ? "bg-yellow-300 animate-pulse" : ""
          }`}
        >
          {activeMole === MOLE_POSITIONS[1].id && (
            <div className="text-4xl font-bold">🐹</div>
          )}
          <span className="absolute bottom-1 text-sm font-medium">{MOLE_POSITIONS[1].label}</span>
        </div>
        <div
          key={MOLE_POSITIONS[2].id}
          className={`relative h-32 bg-gray-200 rounded-lg flex items-center justify-center ${
            activeMole === MOLE_POSITIONS[2].id ? "bg-yellow-300 animate-pulse" : ""
          }`}
        >
          {activeMole === MOLE_POSITIONS[2].id && (
            <div className="text-4xl font-bold">🐹</div>
          )}
          <span className="absolute bottom-1 text-sm font-medium">{MOLE_POSITIONS[2].label}</span>
        </div>
        <div
          key={MOLE_POSITIONS[3].id}
          className={`relative h-32 bg-gray-200 rounded-lg flex items-center justify-center ${
            activeMole === MOLE_POSITIONS[3].id ? "bg-yellow-300 animate-pulse" : ""
          }`}
        >
          {activeMole === MOLE_POSITIONS[3].id && (
            <div className="text-4xl font-bold">🐹</div>
          )}
          <span className="absolute bottom-1 text-sm font-medium">{MOLE_POSITIONS[3].label}</span>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={startGame}>Start</Button>
        <Button onClick={pauseGame}>
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button variant="destructive" onClick={resetGame}>
          Reset
        </Button>
      </div>
    </div>
  );
}
