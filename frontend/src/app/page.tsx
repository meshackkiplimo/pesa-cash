"use client";
import { useState } from 'react';

export default function Home() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stk');
  const [activeTab] = useState('dashboard');

  const investmentOptions = [
    { amount: 10000, label: '10K Investment', returns: '12% yearly', color: 'from-blue-500 to-blue-700' },
    { amount: 100000, label: '100K Investment', returns: '15% yearly', color: 'from-green-500 to-green-700' },
    { amount: 200000, label: '200K Investment', returns: '18% yearly', color: 'from-blue-600 to-blue-800' },
    { amount: 300000, label: '300K Investment', returns: '20% yearly', color: 'from-green-600 to-green-800' },
  ];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing payment:', {
      amount: selectedAmount,
      phone: phoneNumber,
      method: paymentMethod
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Welcome to Your Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-2">Total Investments</h2>
                <p className="text-3xl font-bold text-white">KES 0.00</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-2">Total Returns</h2>
                <p className="text-3xl font-bold text-white">KES 0.00</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Investment Options</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {investmentOptions.map((option) => (
                <div
                  key={option.amount}
                  className={`bg-gradient-to-r ${option.color} rounded-lg p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                    selectedAmount === option.amount ? 'ring-2 ring-white' : ''
                  }`}
                  onClick={() => setSelectedAmount(option.amount)}
                >
                  <h3 className="text-xl font-bold text-white mb-2">{option.label}</h3>
                  <p className="text-2xl font-bold text-white">
                    KES {option.amount.toLocaleString()}
                  </p>
                  <p className="text-white mt-2 opacity-90">Returns: {option.returns}</p>
                  <p className="text-sm text-white mt-4 opacity-80">
                    Click to select this package
                  </p>
                </div>
              ))}
            </div>

            {selectedAmount && (
              <div className="mt-6 sm:mt-8 max-w-md mx-auto bg-black p-4 sm:p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Payment Details</h2>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center text-white">
                        <input
                          type="radio"
                          value="stk"
                          checked={paymentMethod === 'stk'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-2 accent-blue-500"
                        />
                        MPesa STK Push
                      </label>
                      <label className="flex items-center text-white">
                        <input
                          type="radio"
                          value="manual"
                          checked={paymentMethod === 'manual'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-2 accent-blue-500"
                        />
                        Enter MPesa Code
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g., 254712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-blue-500 focus:outline-none text-base"
                      required
                    />
                  </div>

                  {paymentMethod === 'manual' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        MPesa Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter MPesa Transaction Code"
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-blue-500 focus:outline-none text-base"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-base font-medium"
                  >
                    {paymentMethod === 'stk' ? 'Send STK Push' : 'Verify Payment'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
