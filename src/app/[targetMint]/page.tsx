'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import LeftSidebar from '../../components/LeftSidebar';
import CryptoChart from '../../components/CryptoChart';
import CryptoForm from '../../components/CryptoForm';
import Leaderboard from '../../components/Leaderboard';
import RecentWins from '../../components/RecentWins';
import { useWebSocketData } from '../../hooks/useSimulatedData';

interface CoinInfo {
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  usd_market_cap: number;
  // Add other fields as needed
}

export default function Home() {
  const { targetMint } = useParams();
  const data = useWebSocketData(targetMint as string);
  const [buyInPrice, setBuyInPrice] = useState<number | null>(null);
  const [coinInfo, setCoinInfo] = useState<CoinInfo | null>(null);

  useEffect(() => {
    const fetchCoinInfo = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_REST_ENDPOINT_URL}/coin/${targetMint}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCoinInfo(data);
      } catch (error) {
        console.error('Error fetching coin info:', error);
      }
    };

    if (targetMint) {
      fetchCoinInfo();
    }
  }, [targetMint]);

  const currentPrice = useMemo(() => {
    return data.length > 0 ? data[data.length - 1].price : 0;
  }, [data]);

  return (
    <div className="min-vh-100 d-flex flex-column bg-dark text-white">
      <Header />
      <main className="flex-grow-1 p-3">
        <div className="row flex-lg-nowrap">
          <div className="col-lg-3 mb-3 mb-lg-0">
            <LeftSidebar coinInfo={coinInfo} />
          </div>
          <div className="col-lg-6 mb-4 mb-lg-0">
            <CryptoChart data={data} buyInPrice={buyInPrice} />
          </div>
          <div className="col-lg-3 mb-3 mb-lg-0">
            <CryptoForm
              currentPrice={currentPrice}
              buyInPrice={buyInPrice ?? 0}
              onBuy={(price: number) => setBuyInPrice(price)}
              onSell={() => setBuyInPrice(null)}
            />
            <Leaderboard />
            <RecentWins />
          </div>
        </div>
      </main>
    </div>
  );
}