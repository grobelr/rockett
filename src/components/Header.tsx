import React from 'react';

const Header: React.FC = () => {
  // Placeholder values for wallet and balance
  const walletAddress = '0x1234...5678';
  const solBalance = '10.5';

  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-dark text-light">
      <div>
        <a href="/" className="text-light text-decoration-none">
          <span role="img" aria-label="rocket" style={{ fontSize: '1.5rem' }}>🚀 [home]</span>
        </a>
      </div>
      <div>
        <span className="me-3">Wallet: {walletAddress}</span>
        <span>Balance: {solBalance} SOL</span>
      </div>
    </header>
  );
};

export default Header;
