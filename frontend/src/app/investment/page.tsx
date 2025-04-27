'use client';

import { useState } from 'react';
import { investmentService } from '@/services/investment';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/modals/PaymentModal';

const InvestmentPage = () => {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const investmentOptions = [
    100000,
    150000,
    200000,
    250000,
    300000
  ];

  const handleSelect = (amount: number) => {
    setSelectedAmount(amount);
    setShowModal(true);
  };

  const handlePayment = async (phoneNumber: string) => {
    try {
      if (selectedAmount) {
        await investmentService.createInvestment(selectedAmount, phoneNumber);
        setShowModal(false);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to create investment:', error);
      throw error; // This will be handled by the modal component
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Investment Amount</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investmentOptions.map((amount) => (
          <div
            key={amount}
            className={`p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-300 ${
              selectedAmount === amount
                ? 'bg-blue-500 text-white transform scale-105'
                : 'bg-white hover:shadow-xl'
            }`}
            onClick={() => handleSelect(amount)}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                KES {amount.toLocaleString()}
              </h2>
              <p className={`text-sm ${selectedAmount === amount ? 'text-white' : 'text-gray-600'}`}>
                Click to select this amount
              </p>
            </div>
          </div>
        ))}
      </div>

      <PaymentModal 
        amount={selectedAmount || 0}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePayment}
      />
    </div>
  );
};

export default InvestmentPage;