export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  balance: number; // in cents
  currency: string;
}

export type TransactionType = "payment" | "pix" | "card" | "deposit" | "withdrawal";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // in cents, negative for expense
  currency: string;
  date: string; // ISO
  description: string;
  category: "food" | "travel" | "bills" | "shopping" | "salary" | "others" | "tech";
  merchant?: string;
  status: "pending" | "completed" | "failed";
}

export interface VirtualCard {
  id: string;
  userId: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  holderName: string;
  frozen: boolean;
  scheme: "visa" | "mastercard";
}

export interface ExchangeRate {
  [key: string]: {
    brl: number;
    usd: number;
  };
}

export type ThemeType = 'light' | 'dark' | 'system';