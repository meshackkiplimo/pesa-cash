'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { TransactionDetails } from '@/types/investment';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionDetails: TransactionDetails;
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transactionDetails,
}: TransactionDetailsModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-white mb-4">
                  Transaction Details
                </Dialog.Title>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Transaction Time</p>
                    <p className="text-white font-medium">
                      {transactionDetails.transactionDate
                        ? new Date(transactionDetails.transactionDate).toLocaleTimeString('en-KE', {
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            hour12: true
                          })
                        : 'Time not available'}
                    </p>
                  </div>

                  {transactionDetails.phoneNumber && (
                    <div>
                      <p className="text-sm text-gray-400">Phone Number</p>
                      <p className="text-white font-medium">{transactionDetails.phoneNumber}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}