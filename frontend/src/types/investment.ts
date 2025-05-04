export type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed';

export interface TransactionDetails {
  checkoutRequestId?: string;
  merchantRequestId?: string;
  mpesaReceiptNumber?: string;
  phoneNumber?: string;
  transactionDate?: string;
}

export interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

export interface Investment {
  _id: string;
  userId: string | PopulatedUser;
  amount: number;
  date: string;
  status: 'active' | 'completed' | 'pending' | 'failed';
  returns: number;
  transactionDetails?: TransactionDetails;
}

export interface InvestmentResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    investmentId: string;
    checkoutRequestId: string;
    merchantRequestId: string;
  };
}

export interface InvestmentStats {
  totalDeposits: number;
}

export interface PaymentStatusResponse {
  status: 'success' | 'error';
  data: {
    ResultCode: number;
    ResultDesc: string;
    [key: string]: any;
  };
}