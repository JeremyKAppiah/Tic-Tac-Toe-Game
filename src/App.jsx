import React, { useState, useEffect } from "react";
import "./styling.css";
import Cell from "./Cell.jsx";
import Landing from "./Landing.jsx";
import avatar1 from "./assets/lion.png";
import avatar2 from "./assets/zebra.png";
import avatar3 from "./assets/panda.png";
import avatar4 from "./assets/crocodile.png";
import avatar5 from "./assets/owl.png";
import avatar6 from "./assets/gorilla.png";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

export default function App() {
  const [boardSize, setBoardSize] = useState(3);
  const [gameState, setGameState] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [gameActive, setGameActive] = useState(true);
  const [vsAI, setVsAI] = useState(false);
  const [avatarMode, setAvatarMode] = useState(false);
  const [p1Avatar, setP1Avatar] = useState(avatars[0]);
  const [p2Avatar, setP2Avatar] = useState(avatars[1]);
  const [winningCombo, setWinningCombo] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showLanding, setShowLanding] = useState(true);

  const WINNING_COMBINATIONS = generateWinningCombinations(boardSize);

  useEffect(() => {
    if (vsAI && currentPlayer === "O" && gameActive) {
      const timer = setTimeout(() => {
        aiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, vsAI, gameActive]);

  function generateWinningCombinations(size) {
    const combos = [];
    for (let r = 0; r < size; r++)
      combos.push([...Array(size)].map((_, i) => r * size + i));
    for (let c = 0; c < size; c++)
      combos.push([...Array(size)].map((_, i) => i * size + c));
    combos.push([...Array(size)].map((_, i) => i * size + i));
    combos.push([...Array(size)].map((_, i) => i * size + (size - 1 - i)));
    return combos;
  }

  function checkWin(board, player) {
    for (let combo of WINNING_COMBINATIONS) {
      if (combo.every((i) => board[i] === player)) return combo;
    }
    return null;
  }

  function handleMove(index) {
    if (!gameActive || gameState[index]) return;

    const newBoard = [...gameState];
    newBoard[index] = currentPlayer;
    setGameState(newBoard);

    const winCombo = checkWin(newBoard, currentPlayer);
    if (winCombo) {
      setWinningCombo(winCombo);
      setGameActive(false);
      setPopupMessage(
        avatarMode
          ? `${currentPlayer === "X" ? "P1" : vsAI ? "AI" : "P2"} Wins!`
          : `${currentPlayer} Wins!`
      );
      setShowPopup(true);
      return;
    } else if (newBoard.every((cell) => cell)) {
      setGameActive(false);
      setPopupMessage("Draw!");
      setShowPopup(true);
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  }

  function restartGame() {
    setGameState(Array(boardSize ** 2).fill(null));
    setCurrentPlayer("X");
    setGameActive(true);
    setWinningCombo([]);
    setShowPopup(false);
  }

  function aiMove() {
    const bestMove = minimax(gameState, "O").index;
    handleMove(bestMove);
  }

  function minimax(newBoard, player) {
    const availSpots = newBoard
      .map((v, i) => (v === null ? i : null))
      .filter((i) => i !== null);

    if (checkWin(newBoard, "X")) return { score: -10 };
    if (checkWin(newBoard, "O")) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
      const idx = availSpots[i];
      const move = { index: idx };
      newBoard[idx] = player;

      const result = minimax(newBoard, player === "O" ? "X" : "O");
      move.score = result.score;

      newBoard[idx] = null;
      moves.push(move);
    }

    let bestMove;
    if (player === "O") {
      let bestScore = -Infinity;
      for (let m of moves) {
        if (m.score > bestScore) {
          bestScore = m.score;
          bestMove = m;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let m of moves) {
        if (m.score < bestScore) {
          bestScore = m.score;
          bestMove = m;
        }
      }
    }

    return bestMove;
  }

  const currentAvatar = avatarMode
    ? currentPlayer === "X"
      ? p1Avatar
      : p2Avatar
    : null;

  const turnLabel = avatarMode
    ? currentPlayer === "X"
      ? "P1"
      : vsAI
      ? "AI"
      : "P2"
    : currentPlayer;

  return (
    <div className="app">
      {showLanding && <Landing onStart={() => setShowLanding(false)} />}

      {!showLanding && (
        <button className="home-btn" onClick={() => setShowLanding(true)}>
          🏠
        </button>
      )}

      {!showLanding && (
        <>
          {/* Controls container */}
          <div
            className="controls"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            {/* Info icon with tooltip */}
            <span className="info-icon">
              ℹ️
              <span className="tooltip">
                Make sure to click the "Start Game" button to make sure the board size logic activates!
              </span>
            </span>

            {/* Start Game button */}
            <button
              id="startButton"
              onClick={restartGame}
              style={{
                padding: "10px 20px",
                backgroundColor: "#7f00ff",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              Start Game
            </button>

            {/* Board size input */}
            <label
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Board Size:
              <input
                type="number"
                min="3"
                max="6"
                value={boardSize}
                onChange={(e) => setBoardSize(Number(e.target.value))}
                style={{
                  background: "white",
                  color: "#282c34",
                  fontWeight: 700,
                  padding: "10px 25px",
                  borderRadius: "8px",
                  border: "2px solid #7f00ff",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  boxShadow: "0 0 12px #7f00ff22",
                  transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
                }}
              />
            </label>

            {/* Avatar toggle */}
            <div className="avatar-toggle">
              <span>Avatars:</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={avatarMode}
                  onChange={(e) => setAvatarMode(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* VS AI toggle */}
            <div className="avatar-toggle">
              <span>VS AI:</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={vsAI}
                  onChange={(e) => setVsAI(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Avatar selection */}
          {avatarMode && (
            <div className="avatar-selection">
              <div>
                <span>P1:</span>
                {avatars.map((av, i) => (
                  <img
                    key={i}
                    src={av}
                    className={`avatar-option ${p1Avatar === av ? "selected" : ""}`}
                    onClick={() => setP1Avatar(av)}
                  />
                ))}
              </div>
              <div>
                <span>{vsAI ? "AI:" : "P2:"}</span>
                {avatars.map((av, i) => (
                  <img
                    key={i}
                    src={av}
                    className={`avatar-option ${p2Avatar === av ? "selected" : ""}`}
                    onClick={() => !vsAI && setP2Avatar(av)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="status">
            <span className="turn-text">
              {gameActive ? `${turnLabel}'s Turn` : popupMessage}
            </span>
            {avatarMode && currentAvatar && gameActive && (
              <img
                className="turn-avatar"
                src={currentAvatar}
                alt="current-avatar"
              />
            )}
          </div>

          {/* Board */}
          <div
            className="board"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
              gridTemplateRows: `repeat(${boardSize}, 1fr)`,
            }}
          >
            {gameState.map((cell, i) => (
              <Cell
                key={i}
                value={cell}
                onClick={() => handleMove(i)}
                highlight={winningCombo.includes(i)}
                avatarMode={avatarMode}
                avatarX={p1Avatar}
                avatarO={p2Avatar}
              />
            ))}
          </div>

          {/* Popup */}
          {showPopup && (
            <div className="message-popup">
              <div className="popup-content">
                {popupMessage}
                <br />
                <button onClick={restartGame}>Play Again</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
