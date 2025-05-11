'use client';

import { useEffect, useState } from 'react';

interface InvestmentTimerProps {
  startDate: Date;
  durationDays: number;
}

export const InvestmentTimer = ({ startDate, durationDays }: InvestmentTimerProps) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays);
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        return 'Investment Complete';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      return `${days}d ${hours}h ${minutes}m`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    setTimeLeft(calculateTimeLeft()); // Initial calculation

    return () => clearInterval(timer);
  }, [startDate, durationDays]);

  return (
    <div className="text-sm font-medium group">
      <span className="text-gray-400">Time Remaining: </span>
      <span className="text-amber-400 font-bold hover:text-amber-300 transition-colors duration-200 shadow-glow">
        {timeLeft}
      </span>
      <style jsx>{`
        .shadow-glow {
          text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
        }
      `}</style>
    </div>
  );
};

export default InvestmentTimer;