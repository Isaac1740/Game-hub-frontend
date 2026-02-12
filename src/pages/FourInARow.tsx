import { useEffect, useState } from "react";

const BASE_URL = "http://127.0.0.1:5000";

const FourInRow = () => {
  const [board, setBoard] = useState<number[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);

  const loadState = async () => {
    const res = await fetch(`${BASE_URL}/api/connect4/state`);
    const data = await res.json();
    setBoard(data.board);
    setGameOver(data.game_over);
    setWinner(data.winner || null);
  };

  const drop = async (col: number) => {
    if (gameOver) return;

    await fetch(`${BASE_URL}/api/connect4/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ column: col }),
    });

    loadState();
  };

  const reset = async () => {
    await fetch(`${BASE_URL}/api/connect4/reset`, { method: "POST" });
    setWinner(null);
    loadState();
  };

  useEffect(() => {
    loadState();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page-gradient p-6">
      <h1 className="text-2xl font-bold mb-4">Four in a Row</h1>

      <div className="grid grid-cols-7 gap-2 bg-blue-600 p-4 rounded-lg">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => drop(c)}
              className={`w-14 h-14 rounded-full cursor-pointer flex items-center justify-center ${
                cell === 0
                  ? "bg-white"
                  : cell === 1
                  ? "bg-red-500"
                  : "bg-yellow-400"
              }`}
            />
          ))
        )}
      </div>

      {winner && (
        <p className="mt-4 text-lg font-semibold">
          🎉 Player {winner} wins!
        </p>
      )}

      <button
        onClick={reset}
        className="mt-4 px-4 py-2 rounded bg-blue-500 text-white"
      >
        Reset Game
      </button>
    </div>
  );
};

export default FourInRow;
