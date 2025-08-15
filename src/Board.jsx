import React, { useState, useEffect } from "react";
import Cell from "./Cell.jsx";

export default function Board({ boardSize, vsAI, restartToggle }) {
  const [gameState, setGameState] = useState(Array(boardSize ** 2).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [gameActive, setGameActive] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setGameState(Array(boardSize ** 2).fill(null));
    setCurrentPlayer("X");
    setGameActive(true);
    setMessage("");
  }, [boardSize, restartToggle]);

  const generateWinningCombinations = (size) => {
    const combos = [];

    for (let r = 0; r < size; r++) combos.push([...Array(size)].map((_, i) => r * size + i));
    for (let c = 0; c < size; c++) combos.push([...Array(size)].map((_, i) => i * size + c));
    combos.push([...Array(size)].map((_, i) => i * size + i));
    combos.push([...Array(size)].map((_, i) => i * size + (size - 1 - i)));

    return combos;
  };

  const WINNING_COMBINATIONS = generateWinningCombinations(boardSize);

  const handleMove = (index) => {
    if (!gameActive || gameState[index]) return;

    const newState = [...gameState];
    newState[index] = currentPlayer;
    setGameState(newState);

    if (checkWin(newState, currentPlayer)) {
      setMessage(`${currentPlayer} Wins!`);
      setGameActive(false);
      return;
    } else if (newState.every((cell) => cell)) {
      setMessage("Draw!");
      setGameActive(false);
      return;
    }

    const nextPlayer = currentPlayer === "X" ? "O" : "X";
    setCurrentPlayer(nextPlayer);

    if (vsAI && nextPlayer === "O" && gameActive) {
      setTimeout(() => aiMove(newState), 300);
    }
  };

  const aiMove = (state) => {
    const emptyIndices = state.map((val, i) => (val === null ? i : null)).filter((i) => i !== null);
    const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    handleMove(move);
  };

  const checkWin = (state, player) =>
    WINNING_COMBINATIONS.some((combo) => combo.every((i) => state[i] === player));

  return (
    <div>
      <div className="status">{gameActive ? `${currentPlayer}'s Turn` : message}</div>
      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {gameState.map((cell, i) => (
          <Cell key={i} value={cell} onClick={() => handleMove(i)} />
        ))}
      </div>
      {message && <button onClick={() => setRestartToggle(!restartToggle)}>Play Again</button>}
    </div>
  );
}
