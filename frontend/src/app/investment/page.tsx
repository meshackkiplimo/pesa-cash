'use client';

import { useState, useEffect } from 'react';
import { investmentService } from '@/services/investment';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/modals/PaymentModal';

const InvestmentPage = () => {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const investmentOptions = [
    100000,
    150000,
    200000,
    250000,
    300000,
    1,
  ];

  const handleSelect = (amount: number) => {
    setSelectedAmount(amount);
    setShowModal(true);
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
        const message = selectedAmount === 1
          ? `You will receive 10 POP immediately! Please check your phone and enter M-Pesa PIN to complete payment`
          : 'Please check your phone and enter M-Pesa PIN to complete payment';
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
        {investmentOptions.map((amount) => (
          <div
            key={amount}
            className={`p-4 sm:p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-300 active:scale-95 hover:scale-102 ${
              selectedAmount === amount
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white transform scale-102'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => handleSelect(amount)}
          >
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                KES {amount.toLocaleString()}
              </h2>
              <p className={`text-sm ${selectedAmount === amount ? 'text-white' : 'text-gray-300'}`}>
                Click to select this amount
              </p>
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