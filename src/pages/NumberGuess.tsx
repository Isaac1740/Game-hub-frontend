import { useState } from "react";

const NumberGuess = () => {
  /* ---------- GLOBAL ---------- */
  const [mode, setMode] = useState<"" | "ai" | "pvp">("");
  const [maxGuesses, setMaxGuesses] = useState(0);

  /* ---------- Q LEARNING (VISUAL) ---------- */
  const [episodes, setEpisodes] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"Beginner" | "Training" | "Optimized">(
    "Beginner"
  );

  const updateQLearning = () => {
    const newEpisodes = episodes + 1;
    const newProgress = Math.min(100, progress + 10);

    setEpisodes(newEpisodes);
    setProgress(newProgress);

    if (newProgress < 30) setStage("Beginner");
    else if (newProgress < 70) setStage("Training");
    else setStage("Optimized");
  };

  /* ---------- AI MODE ---------- */
  const [aiLow, setAiLow] = useState(1);
  const [aiHigh, setAiHigh] = useState(100);
  const [aiGuessesLeft, setAiGuessesLeft] = useState(0);
  const [aiGuess, setAiGuess] = useState<number | null>(null);

  const [showUserGuess, setShowUserGuess] = useState(false);
  const [aiSecret, setAiSecret] = useState<number | null>(null);
  const [userGuessesLeft, setUserGuessesLeft] = useState(0);
  const [userStatus, setUserStatus] = useState("");

  const startAi = () => {
    if (maxGuesses <= 0) return alert("Select level first");
    setAiLow(1);
    setAiHigh(100);
    setAiGuessesLeft(maxGuesses);
    makeAiGuess(1, 100, maxGuesses);
  };

  const makeAiGuess = (low = aiLow, high = aiHigh, guesses = aiGuessesLeft) => {
    if (guesses < 0) {
      updateQLearning();
      alert("🤖 AI lost 😅");
      setShowUserGuess(true);
      return;
    }
    const guess = Math.floor((low + high) / 2);
    setAiGuess(guess);
    setAiGuessesLeft(guesses - 1);
  };

  const aiFeedback = (type: "higher" | "lower" | "correct") => {
    if (aiGuess === null) return;

    if (type === "correct") {
      updateQLearning();
      alert("AI WON 🎉");
      setShowUserGuess(true);
      return;
    }

    const newLow = type === "higher" ? aiGuess + 1 : aiLow;
    const newHigh = type === "lower" ? aiGuess - 1 : aiHigh;

    setAiLow(newLow);
    setAiHigh(newHigh);
    makeAiGuess(newLow, newHigh, aiGuessesLeft);
  };

  const startUserGuess = () => {
    setAiSecret(Math.floor(Math.random() * 100) + 1);
    setUserGuessesLeft(maxGuesses);
    setUserStatus("");
  };

  const submitUserGuess = (g: number) => {
    if (aiSecret === null) return;

    if (g === aiSecret) {
      setUserStatus("YOU WIN 🎉");
      return;
    }

    const left = userGuessesLeft - 1;
    setUserGuessesLeft(left);

    if (left <= 0) {
      setUserStatus(`You lost 😢 AI number: ${aiSecret}`);
      return;
    }

    setUserStatus(g < aiSecret ? "Too Low" : "Too High");
  };

  /* ---------- PVP MODE ---------- */
  const [turn, setTurn] = useState<1 | 2>(1);
  const [pvpSecret, setPvpSecret] = useState<number | null>(null);
  const [pvpGuessesLeft, setPvpGuessesLeft] = useState(0);
  const [pvpStatus, setPvpStatus] = useState("");

  const setSecret = (n: number) => {
    if (n < 1 || n > 100) return;
    setPvpSecret(n);
    setPvpGuessesLeft(maxGuesses);
    setPvpStatus(`Player ${turn === 1 ? 2 : 1} turn | Guesses left: ${maxGuesses}`);
  };

  const submitPvPGuess = (g: number) => {
    if (pvpSecret === null) return;

    const left = pvpGuessesLeft - 1;
    setPvpGuessesLeft(left);

    if (g === pvpSecret) {
      setPvpStatus(`🎉 Player ${turn === 1 ? 2 : 1} WON!`);
      setTimeout(swapTurn, 1500);
      return;
    }

    if (left <= 0) {
      setPvpStatus(`❌ Out of guesses! Secret was ${pvpSecret}`);
      setTimeout(swapTurn, 1500);
      return;
    }

    setPvpStatus(
      (g < pvpSecret ? "📈 Too Low" : "📉 Too High") +
        ` | Guesses left: ${left}`
    );
  };

  const swapTurn = () => {
    setTurn(turn === 1 ? 2 : 1);
    setPvpSecret(null);
    setPvpStatus("");
  };

  /* ---------- RESET ---------- */
  const goHome = () => {
    window.location.reload();
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          🎮 RL Number Guessing Game
        </h1>
        <p className="text-center text-gray-500 mb-6">
          AI Mode + Player vs Player
        </p>

        <div className="bg-blue-50 p-4 rounded-xl text-center mb-6">
          🧠 AI Stage: <b>{stage}</b> | 📊 Progress: <b>{progress}%</b> | 🔁
          Episodes: <b>{episodes}</b>
        </div>

        {!mode && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setMode("ai")}
              className="px-6 py-3 rounded-full bg-green-500 text-white font-bold"
            >
              🤖 User vs Agent
            </button>
            <button
              onClick={() => setMode("pvp")}
              className="px-6 py-3 rounded-full bg-orange-500 text-white font-bold"
            >
              👥 Player vs Player
            </button>
          </div>
        )}

        {mode && maxGuesses === 0 && (
          <div className="flex justify-center gap-4 mb-6">
            <button onClick={() => setMaxGuesses(8)} className="btn bg-green-500">
              Easy (8)
            </button>
            <button onClick={() => setMaxGuesses(6)} className="btn bg-orange-500">
              Medium (6)
            </button>
            <button onClick={() => setMaxGuesses(4)} className="btn bg-red-500">
              Hard (4)
            </button>
          </div>
        )}

        {mode === "ai" && maxGuesses > 0 && (
          <div className="text-center">
            <button onClick={startAi} className="btn bg-blue-500">
              Start AI
            </button>

            {aiGuess !== null && (
              <div className="text-6xl font-bold my-4">{aiGuess}</div>
            )}

            <div className="flex justify-center gap-3">
              <button onClick={() => aiFeedback("higher")} className="btn bg-green-500">
                Higher
              </button>
              <button onClick={() => aiFeedback("lower")} className="btn bg-red-500">
                Lower
              </button>
              <button onClick={() => aiFeedback("correct")} className="btn bg-blue-500">
                Correct
              </button>
            </div>

            {showUserGuess && (
              <div className="mt-6">
                <button onClick={startUserGuess} className="btn bg-indigo-500">
                  You Guess AI
                </button>

                {aiSecret && (
                  <div>
                    <p>You have {userGuessesLeft} guesses</p>
                    <input
                      type="number"
                      className="border p-3 rounded-xl text-center"
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        submitUserGuess(Number((e.target as HTMLInputElement).value))
                      }
                    />
                    <p>{userStatus}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <button onClick={goHome} className="mt-6 btn bg-gray-500">
          🏠 Home
        </button>
      </div>
    </div>
  );
};

export default NumberGuess;
