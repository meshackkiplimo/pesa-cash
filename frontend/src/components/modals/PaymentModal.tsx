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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Enter M-Pesa Phone Number</h2>
        <p className="mb-4">Amount: KES {amount?.toLocaleString()}</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g., 0712345678"
            className="w-full px-3 py-2 border rounded-md"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
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