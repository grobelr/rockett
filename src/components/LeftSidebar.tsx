import React, { useState } from 'react';
import Image from 'next/image';

interface CoinInfo {
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  telegram: string;
  twitter: string;
  creator: string;
  created_timestamp: string;
}

interface LeftSidebarProps {
  coinInfo: CoinInfo | null;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ coinInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const getTimeAgo = (timestamp: string) => {
    const created = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hours ago`;
    }
  };

  const maskAddress = (address: string) => {
    if (address.length < 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length <= maxLength) return description;
    return `${description.slice(0, maxLength)}...`;
  };

  if (!coinInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-dark text-light p-4 rounded shadow">
      <div className="flex justify-center mb-3">
        <Image
          src={coinInfo.image_uri}
          alt={coinInfo.name}
          width={100}
          height={100}
          className="rounded"
        />
      </div>
      <h2 className="text-lg font-semibold">{coinInfo.name} ({coinInfo.symbol})</h2>
      <p className="text-sm">
        {isExpanded ? coinInfo.description : truncateDescription(coinInfo.description, 35)}
        {coinInfo.description.length > 100 && (
          <button
            onClick={toggleDescription}
            className="ml-1 text-green-500 hover:text-green-600 text-sm no-underline custom-link"
          >
            {isExpanded ? '[Read less]' : '[Read more]'}
          </button>
        )}
      </p>
      <div className="mt-3">
        {coinInfo.telegram && (
          <a href={coinInfo.telegram} target="_blank" rel="noopener noreferrer" className="mr-3 text-green-500 hover:text-green-600 text-sm no-underline custom-link">
            [Telegram]
          </a>
        )}
        {coinInfo.twitter && (
          <a href={coinInfo.twitter} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 text-sm no-underline custom-link">
            [Twitter]
          </a>
        )}
      </div>
      <p className="mt-2 text-sm">Creator: 
        <a href={`https://solscan.io/address/${coinInfo.creator}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 ml-1 text-sm no-underline custom-link">
          {maskAddress(coinInfo.creator)}
        </a>
      </p>
      <p className="text-sm">Created: {getTimeAgo(coinInfo.created_timestamp)}</p>
    </div>
  );
};

export default LeftSidebar;