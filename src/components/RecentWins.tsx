// src/components/RecentWins.tsx
import React, { useEffect, useState } from 'react';

const RecentWins: React.FC = () => {
  // Sample data for recent wins
  const wins = [
    'User123 sold at 4.5x!',
    'MoonWalker cashed out at 3.8x!',
    'RocketMan hit 5.2x!',
    'StarGazer reached 6.1x!',
    'CryptoQueen won 3.9x!',
  ];

  const [currentWin, setCurrentWin] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWin((prevWin) => (prevWin + 1) % wins.length);
    }, 3000); // Change win every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-dark text-light p-3 rounded mt-3">
      <h3>Recent Wins</h3>
      <div className="ticker-container overflow-hidden">
        <div
          className="ticker-content"
          style={{
            transition: 'transform 0.5s ease-in-out',
            transform: `translateY(-${currentWin * 100}%)`,
          }}
        >
          {wins.map((win, index) => (
            <div key={index} className="ticker-item">
              {win}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentWins;