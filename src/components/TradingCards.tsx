import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Trade {
  signature: string;
  sol_amount: number;
  token_amount: number;
  is_buy: boolean;
  user: string;
  timestamp: number;
  mint: string;
  name: string;
  symbol: string;
  image_uri: string;
  market_cap: number;
  usd_market_cap: number;
}

interface TradingCardsProps {
  trades: Trade[];
}

const TradingCards: React.FC<TradingCardsProps> = ({ trades }) => {
  return (
    <div className="d-flex flex-wrap justify-content-center">
      {trades.map((trade) => (
        <Link href={`/${trade.mint}`} key={trade.signature} className="text-decoration-none">
          <div className="card m-2 bg-secondary text-white" style={{ width: '200px' }}>
            <div style={{ width: '200px', height: '200px', position: 'relative' }}>
              <Image
                src={trade.image_uri}
                alt={trade.name}
                layout="fill"
                objectFit="cover"
                className="card-img-top"
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">{trade.name}</h5>
              <p className="card-text">{trade.symbol}</p>
              <p className="card-text">Market Cap: ${trade.usd_market_cap.toFixed(2)}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TradingCards;