export interface Member {
    id: string;
    name: string;
    addedAt: string;
    isActive: boolean;
  }
  
  export interface Expense {
    id: string;
    description: string;
    amount: number;
    paidBy: string;
    participants: string[];
    date: string;
    createdAt: string;
  }
  
  export interface Settlement {
    from: string;
    to: string;
    amount: number;
  }

  export interface SettlementRecord {
    id: string;
    from: string;
    to: string;
    amount: number;
    date: string;
    createdAt: string;
  }
  
  export interface Balance {
    memberId: string;
    netBalance: number;
    settlements: Settlement[];
  }
  
  export type Lang = 'it' | 'en';
  
  export interface Group {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Member[];
    expenses: Expense[];
    settlements: SettlementRecord[];
    balances: Balance[];
    version: number;
    lang: Lang;
  }