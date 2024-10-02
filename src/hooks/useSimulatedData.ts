import { useState, useEffect, useCallback, useRef } from 'react';

interface DataPoint {
  time: number;
  price: number;
}

interface DecodedLog {
  mintPubkey: string;
  solAmount: string;
  tokenAmount: string;
  isBuy: boolean;
  userPubkey: string;
  timestamp: string;
  virtualSolReserves: string;
  virtualTokenReserves: string;
}

interface WebSocketMessage {
  type: string;
  signature: string;
  decodedVdtLogs: { decodedLog: DecodedLog }[];
  pricePerToken: number;
}

export const useSimulatedData = (initialPrice: number = 100) => {
  const generateInitialData = () => {
    const now = Date.now();
    return Array.from({ length: 60 }, (_, i) => ({
      time: now - (59 - i) * 1000,
      price: initialPrice + Math.random() * 10 - 5
    }));
  };

  const [data, setData] = useState<DataPoint[]>(generateInitialData());

  const updatePrice = useCallback((change: number) => {
    const lastPrice = data[data.length - 1].price;
    const newPrice = lastPrice * (1 + change);
    const newDataPoint = { time: Date.now(), price: newPrice };
    setData(prevData => [...prevData.slice(1), newDataPoint]);
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomChange = (Math.random() * 0.02 - 0.01);
      updatePrice(randomChange);
    }, 1000);

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '+') {
        updatePrice(0.05); // 5% increase
      } else if (event.key === '-') {
        updatePrice(-0.05); // 5% decrease
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [updatePrice]);

  return data;
};

export const useWebSocketData = (targetMint: string) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const updatePrice = useCallback((newPrice: number) => {
    const newDataPoint = { time: Date.now(), price: newPrice };
    setData(prevData => {
      const newData = [...prevData, newDataPoint];
      return newData.length > 60 ? newData.slice(-60) : newData;
    });
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    wsRef.current = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

    wsRef.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        if (message.type === 'historicalDataEnd') {
          console.log('Historical data received');
          return;
        }

        const receivedMint = message.decodedVdtLogs[0].decodedLog.mintPubkey;

        if (receivedMint === targetMint) {
          console.log('New price:', message.pricePerToken);
          updatePrice(message.pricePerToken);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = (event) => {
      console.log('Disconnected from WebSocket:', event.reason);
      wsRef.current = null;
      // Attempt to reconnect after a delay
      setTimeout(connectWebSocket, 5000);
    };
  }, [targetMint, updatePrice]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  return data;
};