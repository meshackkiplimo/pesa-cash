import React, { useState } from 'react';

interface PaymentModalProps {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => Promise<void>;
}

const PaymentModal = ({ amount, isOpen, onClose, onSubmit }: PaymentModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    // Basic phone number validation for Kenya
    if (!phoneNumber.match(/^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-8])|(?:5[0-7])|(?:6[0-9])|(?:7[0-9])|(?:8[0-9]))[0-9]{6})$/)) {
      setError('Please enter a valid Kenyan phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Format phone number to include country code if needed
      const formattedPhone = phoneNumber.startsWith('+254') ? 
        phoneNumber : phoneNumber.startsWith('0') ? 
        `+254${phoneNumber.slice(1)}` : 
        phoneNumber.startsWith('254') ? 
        `+${phoneNumber}` : `+254${phoneNumber}`;

      await onSubmit(formattedPhone);
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
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Enter M-Pesa Phone Number</h2>
        <p className="mb-4 text-gray-300">Amount: <span className="text-white font-medium">KES {amount?.toLocaleString()}</span></p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g., 0712345678"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4">
          <button
            className="w-full sm:w-auto px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-base font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-base font-medium ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;