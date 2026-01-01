
export interface Distribution {
  recipient: string;
  amount: number;
}

export interface MonthlyRecord {
  id: string;
  month: string;
  contributorNames: string[];
  amountCollected: number;
  amountGiven: number;
  remainingBalance: number;
  cumulativeBalance: number;
  distributions?: Distribution[];
}

export interface FundSummary {
  totalCollected: number;
  totalDistributed: number;
  finalBalance: number;
  uniqueContributors: number;
}

export interface FinancialData {
  records: MonthlyRecord[];
  summary: FundSummary;
}

export type Role = 'admin' | 'guest';

export interface User {
  role: Role;
  name: string;
}
