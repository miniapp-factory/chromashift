"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const MOLE_POSITIONS = [
  { id: 0, className: "top-left" },
  { id: 1, className: "top-right" },
  { id: 2, className: "bottom-left" },
  { id: 3, className: "bottom-right" },
];

export default function WhacAMole() {
  const [score, setScore] = useState(0);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Spawn a mole at random intervals
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const spawn = () => {
      const randomIndex = Math.floor(Math.random() * MOLE_POSITIONS.length);
      setActiveMole(randomIndex);
      // Hide mole after 800ms if not hit
      setTimeout(() => setActiveMole(null), 800);
    };

    intervalRef.current = setInterval(spawn, 1200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);

  // Handle key presses
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isRunning || isPaused || activeMole === null) return;
      const keyMap: Record<string, number> = {
        ArrowUp: 0,
        ArrowRight: 1,
        ArrowDown: 2,
        ArrowLeft: 3,
      };
      const expected = keyMap[e.key];
      if (expected === activeMole) {
        setScore((s) => s + 1);
        setActiveMole(null);
        // Play hit sound or animation here if desired
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

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="text-2xl font-bold text-center mb-4">Score: {score}</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {MOLE_POSITIONS.map((pos) => (
          <div
            key={pos.id}
            className={`relative h-32 bg-gray-200 rounded-lg flex items-center justify-center ${
              activeMole === pos.id ? "bg-yellow-300 animate-pulse" : ""
            }`}
          >
            {activeMole === pos.id && (
              <div className="text-4xl font-bold">🐹</div>
            )}
          </div>
        ))}
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
