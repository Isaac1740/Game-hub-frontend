import { useEffect, useState } from "react";

const FrozenLakeResult = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("frozenlake_result");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return <p className="p-6">No FrozenLake data found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-gradient">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          FrozenLake Results
        </h1>

        <div className="space-y-3 text-lg">
          <p><strong>Training Episodes:</strong> {data.train_episodes}</p>
          <p><strong>Test Episodes:</strong> {data.test_episodes}</p>
          <p><strong>Success Rate:</strong> {data.success_rate}%</p>
        </div>
      </div>
    </div>
  );
};

export default FrozenLakeResult;
