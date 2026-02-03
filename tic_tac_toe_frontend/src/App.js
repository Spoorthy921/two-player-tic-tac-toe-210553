import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Calculates the winner for a Tic Tac Toe board.
 * Returns the winner ("X" or "O") and the line indices that form the win.
 *
 * PUBLIC_INTERFACE
 * @param {(null|"X"|"O")[]} squares - Array of length 9 representing the board.
 * @returns {{ winner: (null|"X"|"O"), line: number[] }} winner info including winning line indices.
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

/**
 * Renders a single square.
 *
 * PUBLIC_INTERFACE
 * @param {{ value: (null|"X"|"O"), onClick: () => void, isWinning: boolean, disabled: boolean }} props
 * @returns {JSX.Element}
 */
function Square({ value, onClick, isWinning, disabled }) {
  return (
    <button
      type="button"
      className={`ttt-square ${isWinning ? "is-winning" : ""} ${
        value ? "is-filled" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square: ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}

/**
 * Renders the 3x3 board.
 *
 * PUBLIC_INTERFACE
 * @param {{ squares: (null|"X"|"O")[], onPlay: (idx: number) => void, winningLine: number[], gameOver: boolean }} props
 * @returns {JSX.Element}
 */
function Board({ squares, onPlay, winningLine, gameOver }) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onPlay(idx)}
          isWinning={winningLine.includes(idx)}
          disabled={gameOver || Boolean(value)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Board state: 9 squares, each null/"X"/"O" */
  const [squares, setSquares] = useState(Array(9).fill(null));
  /** True => X's turn; false => O's turn */
  const [xIsNext, setXIsNext] = useState(true);

  const winnerInfo = useMemo(() => calculateWinner(squares), [squares]);
  const winner = winnerInfo.winner;
  const winningLine = winnerInfo.line;

  const isDraw = !winner && squares.every((s) => s !== null);
  const gameOver = Boolean(winner) || isDraw;

  const statusText = useMemo(() => {
    if (winner) return `${winner} wins!`;
    if (isDraw) return "Draw";
    return `${xIsNext ? "X" : "O"}'s turn`;
  }, [winner, isDraw, xIsNext]);

  // PUBLIC_INTERFACE
  const handlePlay = (idx) => {
    // Prevent playing if the game is over or square is occupied.
    if (gameOver || squares[idx]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[idx] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((v) => !v);
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App">
      <main className="ttt-shell">
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">2 players • same device</p>
        </header>

        <section className="ttt-stage" aria-label="Game area">
          <Board
            squares={squares}
            onPlay={handlePlay}
            winningLine={winningLine}
            gameOver={gameOver}
          />

          <div className="ttt-controls" aria-label="Game controls">
            <div
              className={`ttt-status ${gameOver ? "is-final" : ""}`}
              role="status"
              aria-live="polite"
            >
              {statusText}
            </div>

            <button
              type="button"
              className="ttt-restart"
              onClick={restartGame}
            >
              Restart
            </button>
          </div>
        </section>

        <footer className="ttt-footer">
          <span className="ttt-hint">Tip: winning line lights up.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
