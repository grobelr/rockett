import Link from 'next/link';
import TradingCards from '../components/TradingCards';
import Header from '../components/Header'; // Add this import

async function getLatestTrades() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_REST_ENDPOINT_URL}/latest-trades`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch latest trades');
  }
  return res.json();
}

export default async function WelcomePage() {
  const latestTrades = await getLatestTrades();

  return (
    <div className="min-vh-100 d-flex flex-column bg-dark text-white">
      <Header /> {/* Add the Header component here */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4">🚀 Welcome to Rockett.fun</h1>
        <h2 className="mb-3">Most active tokens</h2>
        <TradingCards trades={latestTrades} />
      </div>
    </div>
  );
}