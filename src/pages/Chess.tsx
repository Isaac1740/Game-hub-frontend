import { useEffect, useState } from "react";

const BASE_URL = "http://127.0.0.1:5000";

const pieceMap: Record<string, string> = {
  r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
  R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙",
  ".": ""
};

type Cell = string;
type Board = Cell[][];

const Chess = () => {
  const [board, setBoard] = useState<Board>([]);
  const [turn, setTurn] = useState("white");
  const [mode, setMode] = useState<"pvp" | "pva" | "">("");
  const [difficulty, setDifficulty] = useState("easy");
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [status, setStatus] = useState("Select Game Mode");
  const [paused, setPaused] = useState(false);
  const [gameActive, setGameActive] = useState(false);

  // =========================
  // LOAD GAME
  // =========================
  const loadGame = async () => {
    const res = await fetch(`${BASE_URL}/api/chess/state`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, difficulty }),
    });
    const data = await res.json();
    setBoard(data.board);
    setTurn(data.turn);
  };

  // =========================
  // START GAME
  // =========================
  const startGame = async (m: "pvp" | "pva", diff: string) => {
    setMode(m);
    setDifficulty(diff);
    setPaused(false);
    setGameActive(true);
    setSelected(null);
    await loadGame();
  };

  // =========================
  // CLICK CELL
  // =========================
  const clickCell = async (i: number, j: number) => {
    if (!gameActive || paused) return;

    if (!selected) {
      if (board[i][j] === ".") return;

      if (
        (mode === "pvp" && (
          (turn === "white" && board[i][j] === board[i][j].toUpperCase()) ||
          (turn === "black" && board[i][j] === board[i][j].toLowerCase())
        )) ||
        (mode === "pva" && turn === "white" && board[i][j] === board[i][j].toUpperCase())
      ) {
        setSelected([i, j]);
      }
      return;
    }

    const res = await fetch(`${BASE_URL}/api/chess/player`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: selected, to: [i, j] }),
    });

    if (!res.ok) {
      alert("Illegal move");
      setSelected(null);
      return;
    }

    const data = await res.json();
    setSelected(null);
    await loadGame();

    if (mode === "pva" && data.turn === "black") {
      setTimeout(agentMove, 600);
    }
  };

  // =========================
  // AGENT MOVE
  // =========================
  const agentMove = async () => {
    await fetch(`${BASE_URL}/api/chess/agent`, { method: "POST" });
    await loadGame();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <h2 className="text-3xl text-center mb-6">♟ Chess Game ♟</h2>

      {mode === "" && (
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => startGame("pva", "easy")} className="btn">Player vs Agent (Easy)</button>
          <button onClick={() => startGame("pva", "hard")} className="btn">Player vs Agent (Hard)</button>
          <button onClick={() => startGame("pvp", "easy")} className="btn">Player vs Player</button>
        </div>
      )}

      <div className="text-center mb-4 font-semibold">
        {paused ? "⏸ Game Paused" :
          mode === "pvp"
            ? turn === "white" ? "⚪ Player 1 Turn" : "⚫ Player 2 Turn"
            : turn === "white" ? "⚪ Your Turn" : "🤖 Agent Turn"}
      </div>

      <div className="grid grid-cols-8 w-[480px] mx-auto border border-gray-700">
        {board.map((row, i) =>
          row.map((cell, j) => {
            const isWhite = (i + j) % 2 === 0;
            const isSelected = selected && selected[0] === i && selected[1] === j;

            return (
              <div
                key={`${i}-${j}`}
                onClick={() => clickCell(i, j)}
                className={`flex items-center justify-center text-3xl cursor-pointer
                  ${isWhite ? "bg-gray-200 text-black" : "bg-slate-600"}
                  ${isSelected ? "ring-4 ring-yellow-400" : ""}
                  w-[60px] h-[60px]`}
              >
                {pieceMap[cell]}
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => setPaused(true)} className="btn">⏸ Pause</button>
        <button onClick={() => setPaused(false)} className="btn">▶ Resume</button>
        <button onClick={loadGame} className="btn">🔄 Restart</button>
      </div>
    </div>
  );
};

export default Chess;
