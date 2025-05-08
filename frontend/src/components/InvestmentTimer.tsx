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
    <div className="text-sm font-medium">
      Time Remaining: {timeLeft}
    </div>
  );
};

export default InvestmentTimer;