import React, { useState } from 'react';
import { PaymentStatus } from '@/types/investment';

interface PaymentModalProps {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => Promise<void>;
  status: PaymentStatus;
  statusMessage: string;
}

const PaymentModal = ({ amount, isOpen, onClose, onSubmit, status, statusMessage }: PaymentModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    // Basic phone number validation for Kenya
    if (!phoneNumber.match(/^[71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-8])|(?:5[0-7])|(?:6[0-9])|(?:7[0-9])|(?:8[0-9]))[0-9]{6}$/)) {
      setError('Please enter a valid Safaricom phone number without any prefix');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit(`254${phoneNumber}`);
    } catch (error) {
      console.error('Failed to process payment:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-800">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
          {status === 'pending' ? 'Payment In Progress' : 'Enter M-Pesa Phone Number'}
        </h2>
        <p className="mb-4 text-gray-300">Amount: <span className="text-white font-medium">KES {amount?.toLocaleString()}</span></p>
        
        {statusMessage && (
          <div className={`mb-4 p-3 rounded-lg ${
            status === 'success' ? 'bg-green-900/50 text-green-300' :
            status === 'failed' ? 'bg-red-900/50 text-red-300' :
            'bg-blue-900/50 text-blue-300'
          }`}>
            {statusMessage}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400">254</span>
            </div>
            <input
              type="tel"
              placeholder="712345678"
              className="w-full pl-16 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Enter your phone number without 0 or +254 prefix
          </p>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        {status !== 'pending' && (
          <div className="flex flex-col-reverse sm:flex-row justify-end space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4">
            <button
              className="w-full sm:w-auto px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-base font-medium"
              onClick={onClose}
            >
              {status === 'failed' ? 'Try Again' : 'Cancel'}
            </button>
            {status === 'idle' && (
              <button
                className={`w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-base font-medium ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Pay Now'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;