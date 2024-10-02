import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Rocket.css';

interface RocketProps {
  value: number;
  initialValue: number;
}

const Rocket: React.FC<RocketProps> = ({ value, initialValue }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (initialValue !== null) {
      const changePercentage = ((value - initialValue) / initialValue) * 100;
      
      // Amplify the movement
      const amplificationFactor = 2;
      const newX = 50 + (changePercentage * amplificationFactor);
      const newY = 50 - (changePercentage * amplificationFactor);

      // Clamp values to keep rocket within visible area
      setPosition({
        x: Math.min(90, Math.max(10, newX)),
        y: Math.min(90, Math.max(10, newY))
      });
    }
  }, [value, initialValue]);

  return (
    <motion.div
      className="rocket"
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      animate={position}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
    >
      🚀
    </motion.div>
  );
};

export default Rocket;