import { MOCK_USER, MOCK_TRANSACTIONS, MOCK_CARD } from '../mocks/data';
import { User, Transaction, VirtualCard } from '../types';

const DB_KEY = 'finnova_db_v1';
const DELAY_MS = 600;

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Database Helpers ---

interface DatabaseSchema {
  user: User;
  transactions: Transaction[];
  card: VirtualCard;
}

const getDB = (): DatabaseSchema => {
  const stored = localStorage.getItem(DB_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Ensure dates are parsed back to strings/objects if needed, though JSON keeps strings
    return parsed;
  }
  
  // Seed initial data
  const initialData: DatabaseSchema = {
    user: MOCK_USER,
    transactions: MOCK_TRANSACTIONS,
    card: MOCK_CARD
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initialData));
  return initialData;
};

const saveDB = (data: DatabaseSchema) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- API Methods ---

export const login = async (email: string, name?: string): Promise<User> => {
  await delay(800);
  const db = getDB();
  
  // Logic: If name is provided (Sign Up/Login form), update the user's name.
  // In a real app, we'd look up by email. For this demo, we update the single user session.
  
  let finalName = db.user.name;
  
  if (name) {
    finalName = name;
  } else if (email !== db.user.email) {
    // Attempting to derive name from email if not provided and it's a different email
    const localPart = email.split('@')[0];
    finalName = localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }

  const updatedUser = {
    ...db.user,
    email: email,
    name: finalName
  };

  db.user = updatedUser;
  saveDB(db);

  return updatedUser;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  await delay(600);
  const db = getDB();
  const updatedUser = { ...db.user, ...data };
  db.user = updatedUser;
  saveDB(db);
  return updatedUser;
};

export const getUser = async (): Promise<User> => {
  await delay(500);
  return getDB().user;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  await delay(600);
  return getDB().transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getCard = async (): Promise<VirtualCard> => {
  await delay(500);
  return getDB().card;
};

export const toggleCardFreeze = async (cardId: string, frozen: boolean): Promise<VirtualCard> => {
  await delay(400);
  const db = getDB();
  db.card.frozen = frozen;
  saveDB(db);
  return db.card;
};

export const addFunds = async (amountCents: number, source: string): Promise<User> => {
  await delay(1000);
  const db = getDB();
  
  // 1. Update Balance
  db.user.balance += amountCents;

  // 2. Create Transaction record
  const newTx: Transaction = {
    id: `tx_${Date.now()}`,
    userId: db.user.id,
    type: 'deposit',
    amount: amountCents,
    currency: 'USD',
    date: new Date().toISOString(),
    description: 'Funds Deposit',
    merchant: source,
    category: 'salary', // or 'others'
    status: 'completed'
  };
  
  db.transactions.unshift(newTx);
  saveDB(db);
  
  return db.user;
};

export const sendMoney = async (amountCents: number, recipient: string, description: string = 'Transfer'): Promise<User> => {
  await delay(1200);
  const db = getDB();

  // 1. Deduct Balance
  db.user.balance -= amountCents;

  // 2. Create Transaction
  const newTx: Transaction = {
    id: `tx_${Date.now()}`,
    userId: db.user.id,
    type: 'payment',
    amount: -amountCents, // Negative for expense
    currency: 'USD',
    date: new Date().toISOString(),
    description: description,
    merchant: recipient,
    category: 'others',
    status: 'completed'
  };

  db.transactions.unshift(newTx);
  saveDB(db);

  return db.user;
};

export const sendPix = async (amountCents: number, description: string): Promise<Transaction> => {
  await delay(1200);
  const db = getDB();
  
  db.user.balance -= amountCents;
  
  const newTx: Transaction = {
    id: `tx_${Date.now()}`,
    userId: db.user.id,
    type: 'pix',
    amount: -amountCents,
    currency: 'BRL', // Pix is usually BRL, but keeping system consistent
    date: new Date().toISOString(),
    description,
    category: 'others',
    status: 'completed'
  };

  db.transactions.unshift(newTx);
  saveDB(db);

  return newTx;
};

export const fetchRates = async () => {
  // Try real API first
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=brl,usd');
    if (!response.ok) throw new Error('API limit');
    return await response.json();
  } catch (e) {
    console.warn("Using mock rates due to API issue");
    return {
      bitcoin: { brl: 340000, usd: 68000 },
      ethereum: { brl: 18000, usd: 3600 }
    };
  }
};