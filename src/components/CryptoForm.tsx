import React, { useState } from 'react';
import { Container, Button, Dropdown } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CryptoFormProps {
  currentPrice: number;
  buyInPrice: number | null; // Allow null
  onBuy: (price: number) => void;
  onSell: () => void;
}

const CryptoForm: React.FC<CryptoFormProps> = ({ currentPrice, buyInPrice, onBuy, onSell }) => {
  const [hasBought, setHasBought] = useState(false);
  const tokenAmount = 0.1; // Amount of SOL being traded

  const formatPrice = (price: number) => {
    return price.toFixed(10);
  };

  const handleAction = () => {
    if (!hasBought) {
      onBuy(currentPrice);
    } else {
      // Calculate profit before selling
      if (buyInPrice !== null) {
        const tokensBought = tokenAmount / buyInPrice;
        const sellValue = tokensBought * currentPrice;
        const profit = sellValue - tokenAmount;
        toast.info(
          <span>
            Profit: <span style={{ 
              color: profit >= 0 ? 'green' : 'red', 
              fontWeight: profit >= 0 ? 'bold' : 'normal' 
            }}>
              {formatPrice(profit)} SOL
            </span>
          </span>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          }
        );
      }
      onSell();
    }
    setHasBought(!hasBought);
  };

  return (
    <>
      <Container className="bg-dark text-light p-4 rounded shadow" style={{ maxWidth: '300px' }}>
        <div className="mb-3 text-center">
          <div>
            <span className="fs-5">Current Price: </span>
            <span className="fs-5 fw-bold">${formatPrice(currentPrice)}</span>
          </div>
          <div style={{ minHeight: '30px' }}>
            {buyInPrice !== null && buyInPrice > 0 && (
              <>
                <span className="fs-5">Buy-in Price: </span>
                <span className="fs-5 fw-bold">${formatPrice(buyInPrice)}</span>
              </>
            )}
          </div>
          <div className="mt-2">
            <span className="fs-5">Value: </span>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-light"
                size="sm"
                className="fs-5 fw-bold"
                style={{ backgroundColor: '#4B0082', borderColor: '#4B0082' }}
              >
                0.1 SOL
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>0.1 SOL</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <Button
          variant={hasBought ? "danger" : "success"}
          size="lg"
          className="w-100 py-3 fs-2 fw-bold"
          style={{
            boxShadow: `0 0 10px ${hasBought ? '#ff0000' : '#00ff00'}`,
            textShadow: `0 0 5px ${hasBought ? '#ff0000' : '#00ff00'}`
          }}
          onClick={handleAction}
        >
          {hasBought ? 'SELL' : 'BUY'}
        </Button>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </>
  );
};

export default CryptoForm;