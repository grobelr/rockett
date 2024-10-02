import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Rocket from './Rocket';

interface DataPoint {
  time: number;
  price: number;
}

interface CryptoChartProps {
  data: DataPoint[];
  buyInPrice: number | null;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ data, buyInPrice }) => {
  const chartColor = '#ff00ff'; // Neon pink color
  const [showLastPrice, setShowLastPrice] = useState(false);

  useEffect(() => {
    setShowLastPrice(true);
    const timer = setTimeout(() => setShowLastPrice(false), 3000);
    return () => clearTimeout(timer);
  }, [data]);

  const getLastDataPoint = () => data[data.length - 1];
  const initialPrice = data[0]?.price || 0;

  const calculateMultiplier = () => {
    if (buyInPrice && buyInPrice > 0) {
      const currentPrice = getLastDataPoint().price;
      return currentPrice / buyInPrice;
    }
    return null;
  };

  const multiplier = calculateMultiplier();

  const formatPrice = (price: number) => {
    return price.toFixed(10);
  };

  const LastPricePopup = () => {
    const lastPoint = getLastDataPoint();
    if (lastPoint?.price == null) {
      return null;
    }
    const prevPoint = data[data.length - 2] || { price: lastPoint.price };
    const color = lastPoint.price >= prevPoint.price ? '#00ff00' : '#ff0000';

    return (
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color,
          padding: '10px',
          borderRadius: '2px',
          fontWeight: 'bold',
          transition: 'opacity 0.3s, transform 0.3s',
          opacity: showLastPrice ? 1 : 0,
          transform: showLastPrice ? 'translateY(0)' : 'translateY(-20px)',
        }}
      >
        ${formatPrice(lastPoint.price)}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="container-fluid neon-border" style={{ 
        borderColor: chartColor, 
        boxShadow: `0 0 10px ${chartColor}`,
        position: 'relative',
        backgroundColor: '#0e1015',
        height: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: chartColor,
        fontSize: '24px',
        fontWeight: 'bold',
      }}>
        LOADING...
      </div>
    );
  }

  return (
    <div className="container-fluid neon-border" style={{ 
      borderColor: chartColor, 
      boxShadow: `0 0 10px ${chartColor}`,
      position: 'relative',
      backgroundColor: '#0e1015',
    }}>
      <div className="chart-container" style={{ position: 'relative', height: '60vh' }}>
        <LastPricePopup />
        {multiplier && (
          <div className="multiplier-display">
            Your token amount is now worth {multiplier.toFixed(2)}x! 🚀
          </div>
        )}
        <div className="message-popup">
          🌈 Hold or sell?!
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" />
            <XAxis
              dataKey="time"
              domain={['auto', 'auto']}
              tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              stroke="#8884d8"
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis 
              domain={[(dataMin: number) => dataMin * 0.95, (dataMax: number) => dataMax * 1.05]} 
              stroke="#8884d8"
              axisLine={false}
              tickSize={3}
              tickFormatter={(value) => formatPrice(value)}
            />
            <Tooltip
              labelFormatter={(label: number) => new Date(label).toLocaleString()}
              formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
              contentStyle={{ backgroundColor: '#1a1d25', color: chartColor, border: `0.2px solid ${chartColor}` }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#ff00ff"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        {data.length > 0 && (
          <Rocket
            value={getLastDataPoint().price}
            initialValue={initialPrice}
          />
        )}
      </div>
    </div>
  );
}

export default CryptoChart;
