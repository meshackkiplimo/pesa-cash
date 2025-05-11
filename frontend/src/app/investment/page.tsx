'use client';

import { useState, useEffect } from 'react';
import { investmentService } from '@/services/investment';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/modals/PaymentModal';
import InvestmentTimer from '@/components/InvestmentTimer';

const InvestmentPage = () => {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  interface InvestmentOption {
    amount: number;
    dailyReturn: number;
    durationDays: number;
  }

  const investmentOptions: InvestmentOption[] = [
    { amount: 1, dailyReturn: 7200, durationDays: 3 },  // 5 bob per minute = 7200 per day for 3 days
    { amount: 5, dailyReturn: 11520, durationDays: 6 }, // 8 bob per minute = 11520 per day for 6 days
    { amount: 10, dailyReturn: 21600, durationDays: 8 }, // 15 bob per minute = 21600 per day for 8 days
  ];

  const handleSelect = (option: InvestmentOption) => {
    setSelectedAmount(option.amount);
    setShowModal(true);
  };

  const calculateTotalReturns = (option: InvestmentOption) => {
    return option.dailyReturn * option.durationDays;
  };


  const handleStatusChange = (newStatus: 'idle' | 'pending' | 'success' | 'failed', message: string) => {
    setPaymentStatus(newStatus);
    setStatusMessage(message);
  };

  const handlePayment = async (phoneNumber: string) => {
    try {
      handleStatusChange('pending', 'Initiating payment, please check your phone for the STK push...');

      if (selectedAmount) {
        const response = await investmentService.createInvestment(selectedAmount, phoneNumber);
        const selectedOption = investmentOptions.find(opt => opt.amount === selectedAmount);
        let message = 'Please check your phone and enter M-Pesa PIN to complete payment';
        if (selectedOption) {
          const totalReturns = calculateTotalReturns(selectedOption);
          message = `Invest ${selectedOption.amount} bob and earn ${selectedOption.dailyReturn} bob daily for ${selectedOption.durationDays} days (Total: ${totalReturns} bob)! Please check your phone and enter M-Pesa PIN`;
        }
        handleStatusChange('pending', message);
        return response;
      }
      throw new Error('No amount selected');
    } catch (error) {
      console.error('Failed to create investment:', error);
      handleStatusChange('failed', 'Failed to initiate payment. Please try again.');
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-100">Choose Your Investment Amount</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {investmentOptions.map((option) => (
          <div
            key={option.amount}
            className={`p-4 sm:p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-300 active:scale-95 hover:scale-102 ${
              selectedAmount === option.amount
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white transform scale-102'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => handleSelect(option)}
          >
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                KES {option.amount.toLocaleString()}
              </h2>
              <div className="space-y-2">
                <p className={`text-sm ${selectedAmount === option.amount ? 'text-white' : 'text-gray-300'}`}>
                  Per Minute Return: KES {option.amount === 1 ? '5' : option.amount === 5 ? '8' : '15'}
                </p>
                <p className={`text-sm ${selectedAmount === option.amount ? 'text-white' : 'text-gray-300'}`}>
                  Daily Return: KES {option.dailyReturn.toLocaleString()}
                </p>
                <p className={`text-sm ${selectedAmount === option.amount ? 'text-white' : 'text-gray-300'}`}>
                  Duration: {option.durationDays} days
                </p>
                <p className={`text-sm ${selectedAmount === option.amount ? 'text-white' : 'text-gray-300'}`}>
                  Total Returns: KES {calculateTotalReturns(option).toLocaleString()}
                </p>
                {selectedAmount === option.amount && (
                  <div className="mt-2">
                    <InvestmentTimer
                      startDate={new Date()}
                      durationDays={option.durationDays}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PaymentModal
        amount={selectedAmount || 0}
        isOpen={showModal}
        onClose={() => {
          if (paymentStatus !== 'pending') {
            setShowModal(false);
            setPaymentStatus('idle');
            setStatusMessage('');
            setCheckoutRequestId(null);
          }
        }}
        onSubmit={handlePayment}
        onStatusChange={handleStatusChange}
        status={paymentStatus}
        statusMessage={statusMessage}
      />
    </div>
  );
};

export default InvestmentPage;