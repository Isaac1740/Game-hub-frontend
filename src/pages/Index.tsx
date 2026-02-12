import { useState } from "react";
import {
  Joystick,
  Snowflake,
  Grid3X3,
  LayoutGrid,
  Hash,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import TabNavigation, { Tab } from "@/components/TabNavigation";
import GameCard from "@/components/GameCard";
import GameSection from "@/components/GameSection";

/* -------------------- GAME DATA -------------------- */

const aiGames = [
  {
    id: "cartpole",
    title: "CartPole",
    subtitle: "AI Challenge",
    icon: <Joystick className="w-7 h-7" />,
  },
  {
    id: "frozenlake",
    title: "FrozenLake",
    subtitle: "AI Challenge",
    icon: <Snowflake className="w-7 h-7" />,
  },
  {
    id: "gridworld",
    title: "GridWorld",
    subtitle: "AI Challenge",
    icon: <Grid3X3 className="w-7 h-7" />,
  },
];

const multiplayerGames = [
  {
    id: "chess",
    title: "Chess",
    subtitle: "PvP / AI",
    icon: <LayoutGrid className="w-7 h-7" />,
  },
  {
    id: "four-in-row",
    title: "Four in Row",
    subtitle: "PvP / AI",
    icon: <Grid3X3 className="w-7 h-7" />,
  },
  {
    id: "number-guess",
    title: "Number Guess",
    subtitle: "PvP / AI",
    icon: <Hash className="w-7 h-7" />,
  },
];

/* -------------------- PAGE -------------------- */

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("ai-games");

  // 🎯 FINAL PLAY HANDLER
  const handlePlay = async (gameId: string) => {
    const BASE_URL = "http://127.0.0.1:5000";

    /* ================= AI GAMES (BACKEND) ================= */

    if (gameId === "cartpole") {
      const res = await fetch(`${BASE_URL}/play/cartpole`);
      const data = await res.json();
      sessionStorage.setItem("cartpole_result", JSON.stringify(data));
      window.open("/results/cartpole", "_blank");
      return;
    }

    if (gameId === "frozenlake") {
      const res = await fetch(`${BASE_URL}/play/frozenlake`);
      const data = await res.json();
      sessionStorage.setItem("frozenlake_result", JSON.stringify(data));
      window.open("/results/frozenlake", "_blank");
      return;
    }

    if (gameId === "gridworld") {
      const res = await fetch(`${BASE_URL}/play/gridworld`);
      const data = await res.json();
      sessionStorage.setItem("gridworld_result", JSON.stringify(data));
      window.open("/results/gridworld", "_blank");
      return;
    }

    /* ============== MULTIPLAYER (FRONTEND ONLY) ============== */

    const frontendRoutes: Record<string, string> = {
      chess: "/chess",
      "four-in-row": "/four-in-row",
      "number-guess": "/number-guess",
    };

    const route = frontendRoutes[gameId];
    if (!route) return;

    window.location.href = route;
  };

  return (
    <div className="min-h-screen bg-page-gradient">
      <Navbar />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="px-6 py-10 max-w-7xl mx-auto">
        {activeTab === "ai-games" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <GameSection title="AI Games">
              {aiGames.map((game) => (
                <GameCard
                  key={game.id}
                  {...game}
                  variant="ai"
                  onPlay={handlePlay}
                />
              ))}
            </GameSection>

            <GameSection title="Multiplayer Games">
              {multiplayerGames.map((game) => (
                <GameCard
                  key={game.id}
                  {...game}
                  variant="multiplayer"
                  onPlay={handlePlay}
                />
              ))}
            </GameSection>
          </div>
        )}

        {activeTab === "multiplayer" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {multiplayerGames.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                variant="multiplayer"
                onPlay={handlePlay}
              />
            ))}
          </div>
        )}

        {activeTab === "ai-only" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {aiGames.map((game) => (
      <GameCard
        key={game.id}
        {...game}
        variant="ai"
        onPlay={handlePlay}
      />
    ))}
  </div>
)}
      </main>
    </div>
  );
};

export default Index;
