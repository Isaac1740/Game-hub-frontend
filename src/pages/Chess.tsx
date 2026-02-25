import { useState } from "react";

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
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [paused, setPaused] = useState(false);
  const [gameActive, setGameActive] = useState(false);

  // =========================
  // LOAD STATE
  // =========================
  const loadGame = async () => {
    const res = await fetch(`${BASE_URL}/api/chess/state`);
    const data = await res.json();
    setBoard(data.board);
    setTurn(data.turn);
  };

  // =========================
  // START GAME
  // =========================
  const startGame = async (m: "pvp" | "pva", diff: string) => {
    setMode(m);
    setPaused(false);
    setGameActive(true);
    setSelected(null);

    const res = await fetch(`${BASE_URL}/api/chess/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: m, difficulty: diff }),
    });

    const data = await res.json();
    setBoard(data.board);
    setTurn(data.turn);
  };

  // =========================
  // CLICK CELL
  // =========================
  const clickCell = async (i: number, j: number) => {
    if (!gameActive || paused) return;

    if (!selected) {
      if (board[i][j] === ".") return;

      const piece = board[i][j];

      const isWhitePiece = piece === piece.toUpperCase();
      const isBlackPiece = piece === piece.toLowerCase();

      if (
        (mode === "pvp" &&
          ((turn === "white" && isWhitePiece) ||
            (turn === "black" && isBlackPiece))) ||
        (mode === "pva" && turn === "white" && isWhitePiece)
      ) {
        setSelected([i, j]);
      }

      return;
    }

    // Attempt Move
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

    // Agent Move
    if (mode === "pva" && data.turn === "black") {
      setTimeout(async () => {
        await fetch(`${BASE_URL}/api/chess/agent`, { method: "POST" });
        await loadGame();
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <h2 className="text-3xl text-center mb-6">♟ Chess Game ♟</h2>

      {mode === "" && (
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => startGame("pva", "easy")} className="btn">
            Player vs Agent (Easy)
          </button>
          <button onClick={() => startGame("pva", "hard")} className="btn">
            Player vs Agent (Hard)
          </button>
          <button onClick={() => startGame("pvp", "easy")} className="btn">
            Player vs Player
          </button>
        </div>
      )}

      <div className="text-center mb-4 font-semibold">
        {paused
          ? "⏸ Game Paused"
          : mode === "pvp"
          ? turn === "white"
            ? "⚪ Player 1 Turn"
            : "⚫ Player 2 Turn"
          : turn === "white"
          ? "⚪ Your Turn"
          : "🤖 Agent Turn"}
      </div>

      <div className="grid grid-cols-8 w-[480px] mx-auto border border-gray-700">
        {board.map((row, i) =>
          row.map((cell, j) => {
            const isWhite = (i + j) % 2 === 0;
            const isSelected =
              selected && selected[0] === i && selected[1] === j;

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

      {mode !== "" && (
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => setPaused(true)} className="btn">
            ⏸ Pause
          </button>
          <button onClick={() => setPaused(false)} className="btn">
            ▶ Resume
          </button>
          <button onClick={loadGame} className="btn">
            🔄 Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default Chess;