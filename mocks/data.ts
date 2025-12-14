import { User, Transaction, VirtualCard } from '../types';

export const MOCK_USER: User = {
  id: "user_01",
  name: "Mariana Silva",
  email: "demo@finnova.com",
  balance: 4532050, // $ 45,320.50
  currency: "USD"
  // No avatarUrl to simulate empty profile
};

const now = new Date();
const oneDay = 24 * 60 * 60 * 1000;

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_01",
    userId: "user_01",
    type: "payment",
    amount: -1250, // $12.50
    currency: "USD",
    date: new Date(now.getTime() - oneDay * 0.1).toISOString(), // Today
    description: "Downtown Coffee",
    category: "food",
    merchant: "Cafe Central",
    status: "completed"
  },
  {
    id: "tx_02",
    userId: "user_01",
    type: "card",
    amount: -1499, // $14.99
    currency: "USD",
    date: new Date(now.getTime() - oneDay * 2).toISOString(), // 2 days ago
    description: "Spotify Premium",
    category: "tech",
    merchant: "Spotify",
    status: "completed"
  },
  {
    id: "tx_03",
    userId: "user_01",
    type: "payment",
    amount: -12000, // $120.00
    currency: "USD",
    date: new Date(now.getTime() - oneDay * 5).toISOString(), // 5 days ago
    description: "Transfer to John",
    category: "others",
    status: "completed"
  },
  {
    id: "tx_04",
    userId: "user_01",
    type: "deposit",
    amount: 500000, // $5,000.00
    currency: "USD",
    date: new Date(now.getTime() - oneDay * 12).toISOString(), // 12 days ago
    description: "Monthly Salary",
    category: "salary",
    status: "completed"
  },
  {
    id: "tx_05",
    userId: "user_01",
    type: "card",
    amount: -4500, // $45.00
    currency: "USD",
    date: new Date(now.getTime() - oneDay * 15).toISOString(), // 15 days ago
    description: "Uber Trip",
    category: "travel",
    merchant: "Uber",
    status: "completed"
  },
  {
    id: "tx_06",
    userId: "user_01",
    type: "payment",
    amount: -8500, // $85.00
    currency: "USD",
    date: new Date(now.getTime() - oneDay * 20).toISOString(), // 20 days ago
    description: "Walmart Grocery",
    category: "food",
    merchant: "Walmart",
    status: "completed"
  },
];

export const MOCK_CARD: VirtualCard = {
  id: "card_01",
  userId: "user_01",
  cardNumber: "4532 1290 8834 5129",
  expiry: "12/28",
  cvv: "452",
  holderName: "ALEXANDER WEBER",
  frozen: false,
  scheme: "visa"
};