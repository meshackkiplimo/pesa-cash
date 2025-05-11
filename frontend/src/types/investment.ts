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
  dailyReturn: number;
  cycleDays: number;
  transactionDetails?: TransactionDetails;
}

export interface InvestmentResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    investmentId: string;
    checkoutRequestId: string;
    merchantRequestId: string;
    expectedReturns?: number;
  };
}

export interface InvestmentStats {
  totalDeposits: number;
  totalReturns: number;
  returns: number;
  activeInvestments: number;
  totalInvestments: number;
  projectedReturns: number;
}

export interface PaymentStatusResponse {
  status: 'success' | 'error';
  data: {
    ResultCode: number;
    ResultDesc: string;
    [key: string]: any;
  };
}