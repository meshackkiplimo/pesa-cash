export interface Investment {
  id: string;
  userId: string;
  amount: number;
  date: string;
  status: 'active' | 'completed' | 'pending';
  returns: number;
}

export interface InvestmentStats {
  totalInvested: number;
  returns: number;
  activeInvestments: number;
  projectedReturns: number;
}