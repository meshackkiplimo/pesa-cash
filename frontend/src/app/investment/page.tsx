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

  // Poll for payment status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (checkoutRequestId && paymentStatus === 'pending') {
      intervalId = setInterval(async () => {
        try {
          const status = await investmentService.checkPaymentStatus(checkoutRequestId);
          if (status.ResultCode === 0) {
            setPaymentStatus('success');
            setStatusMessage('Payment successful! Redirecting to dashboard...');
            setTimeout(() => router.push('/dashboard'), 2000);
          } else if (status.ResultCode === 1032) { // Request cancelled
            setPaymentStatus('failed');
            setStatusMessage('Payment cancelled by user.');
          }
        } catch (error) {
          console.error('Failed to check payment status:', error);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkoutRequestId, paymentStatus, router]);

  const handlePayment = async (phoneNumber: string) => {
    try {
      setPaymentStatus('pending');
      setStatusMessage('Initiating payment, please check your phone for the STK push...');

      if (selectedAmount) {
        const response = await investmentService.createInvestment(selectedAmount, phoneNumber);
        setCheckoutRequestId(response.data.checkoutRequestId);
        
        // Keep modal open, show pending state
        setStatusMessage('Please check your phone and enter M-Pesa PIN to complete payment');
      }
    } catch (error) {
      console.error('Failed to create investment:', error);
      setPaymentStatus('failed');
      setStatusMessage('Failed to initiate payment. Please try again.');
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
        status={paymentStatus}
        statusMessage={statusMessage}
      />
    </div>
  );
};

export default InvestmentPage;