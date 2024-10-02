// src/components/Leaderboard.tsx
import React from 'react';

const Leaderboard: React.FC = () => {
  return (
    <div className="bg-dark text-light p-3 rounded mt-3">
      <h3>Leaderboard</h3>
      <ul className="list-unstyled">
        <li>1. User123 - 5.2x ($DOGE)</li>
        <li>2. MoonWalker - 4.8x ($DOGE)</li>
        <li>3. RocketMan - 4.3x ($DOGE)</li>
      </ul>
    </div>
  );
};

export default Leaderboard;