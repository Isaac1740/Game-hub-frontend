import { useEffect, useState } from "react";

const CartPoleResult = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("cartpole_result");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return <p className="p-6">No CartPole data found.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-gradient">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          CartPole Results
        </h1>

        <div className="space-y-3 text-lg">
          <p><strong>Episodes:</strong> {data.episodes}</p>
          <p><strong>Average Reward:</strong> {data.average_reward.toFixed(2)}</p>
          <p><strong>Max Reward:</strong> {data.max_reward}</p>
        </div>
      </div>
    </div>
  );
};

export default CartPoleResult;
