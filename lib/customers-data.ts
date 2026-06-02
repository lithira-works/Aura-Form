export type LoyaltyTier = "Rose" | "Gold" | "Platinum" | "Diamond";

export interface Purchase {
  id: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  pointsEarned: number;
  paymentMethod: "cash" | "card" | "upi";
  cashier: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  joinDate: string;
  dob?: string;
  address?: string;
  totalSpent: number;
  points: number;
  tier: LoyaltyTier;
  purchaseCount: number;
  lastVisit: string;
  purchases: Purchase[];
  notes?: string;
}

export const TIER_CONFIG: Record<
  LoyaltyTier,
  {
    minPoints: number;
    maxPoints: number | null;
    color: string;
    bg: string;
    border: string;
    emoji: string;
    perks: string[];
  }
> = {
  Rose: {
    minPoints: 0,
    maxPoints: 999,
    color: "#e879a0",
    bg: "#fdf2f8",
    border: "#f9a8d4",
    emoji: "🌸",
    perks: ["5% birthday discount", "Monthly newsletter"],
  },
  Gold: {
    minPoints: 1000,
    maxPoints: 4999,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    emoji: "⭐",
    perks: ["10% birthday discount", "Early product access", "Free gift wrapping"],
  },
  Platinum: {
    minPoints: 5000,
    maxPoints: 14999,
    color: "#6366f1",
    bg: "#eef2ff",
    border: "#c7d2fe",
    emoji: "💎",
    perks: ["15% birthday discount", "Priority service", "Exclusive events", "Free samples"],
  },
  Diamond: {
    minPoints: 15000,
    maxPoints: null,
    color: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
    emoji: "🔷",
    perks: [
      "20% birthday discount",
      "Personal beauty consultant",
      "VIP events",
      "Complimentary shipping",
      "Early sale access",
    ],
  },
};

export const POINTS_PER_100 = 1;

export function calcPointsForAmount(amount: number): number {
  return Math.floor(amount / 100) * POINTS_PER_100;
}

export function getTierForPoints(points: number): LoyaltyTier {
  if (points >= 15000) return "Diamond";
  if (points >= 5000) return "Platinum";
  if (points >= 1000) return "Gold";
  return "Rose";
}

export function getNextTier(tier: LoyaltyTier): LoyaltyTier | null {
  const order: LoyaltyTier[] = ["Rose", "Gold", "Platinum", "Diamond"];
  const idx = order.indexOf(tier);
  return idx < order.length - 1 ? order[idx + 1] : null;
}

export function pointsToNextTier(points: number, tier: LoyaltyTier): number | null {
  const next = getNextTier(tier);
  if (!next) return null;
  return TIER_CONFIG[next].minPoints - points;
}

export const CUSTOMERS: Customer[] = [
  {
    id: "cust001",
    name: "Nisha Kapoor",
    phone: "+91 98100 45321",
    email: "nisha.kapoor@gmail.com",
    avatar: "NK",
    joinDate: "2023-03-12",
    dob: "1992-07-18",
    address: "42, Rose Garden, Bandra West, Mumbai 400050",
    totalSpent: 184500,
    points: 18450,
    tier: "Diamond",
    purchaseCount: 47,
    lastVisit: "2026-05-29",
    notes: "Prefers organic skincare. Sensitive to fragrances.",
    purchases: [
      {
        id: "RCP-20260529-001",
        date: "2026-05-29",
        items: [
          { name: "Vitamin C Serum", qty: 1, price: 7800 },
          { name: "Hyaluronic Mist", qty: 2, price: 4200 },
        ],
        total: 16200,
        pointsEarned: 162,
        paymentMethod: "card",
        cashier: "Sophia Laurent",
      },
      {
        id: "RCP-20260515-004",
        date: "2026-05-15",
        items: [
          { name: "Silk Foundation", qty: 1, price: 4800 },
          { name: "HD Concealer", qty: 1, price: 2600 },
          { name: "Setting Powder", qty: 1, price: 2900 },
        ],
        total: 10300,
        pointsEarned: 103,
        paymentMethod: "upi",
        cashier: "Mia Chen",
      },
      {
        id: "RCP-20260430-002",
        date: "2026-04-30",
        items: [{ name: "Retinol Night Cream", qty: 1, price: 6500 }],
        total: 6500,
        pointsEarned: 65,
        paymentMethod: "card",
        cashier: "Sophia Laurent",
      },
      {
        id: "RCP-20260410-007",
        date: "2026-04-10",
        items: [
          { name: "Rose Bloom EDP", qty: 1, price: 12000 },
          { name: "Kabuki Brush Set", qty: 1, price: 3800 },
        ],
        total: 15800,
        pointsEarned: 158,
        paymentMethod: "card",
        cashier: "Sophia Laurent",
      },
    ],
  },
  {
    id: "cust002",
    name: "Priya Menon",
    phone: "+91 93700 11238",
    email: "priya.menon@outlook.com",
    avatar: "PM",
    joinDate: "2024-01-05",
    dob: "1996-11-22",
    address: "15, Palm Court, Koramangala, Bangalore 560034",
    totalSpent: 52800,
    points: 5280,
    tier: "Platinum",
    purchaseCount: 18,
    lastVisit: "2026-06-01",
    purchases: [
      {
        id: "RCP-20260601-003",
        date: "2026-06-01",
        items: [
          { name: "Plumping Gloss", qty: 2, price: 2400 },
          { name: "Lip Liner", qty: 1, price: 1600 },
        ],
        total: 6400,
        pointsEarned: 64,
        paymentMethod: "upi",
        cashier: "Aisha Patel",
      },
      {
        id: "RCP-20260520-009",
        date: "2026-05-20",
        items: [{ name: "Eyeshadow Palette", qty: 1, price: 5200 }],
        total: 5200,
        pointsEarned: 52,
        paymentMethod: "card",
        cashier: "Mia Chen",
      },
      {
        id: "RCP-20260502-011",
        date: "2026-05-02",
        items: [
          { name: "SPF 50 Sunscreen", qty: 2, price: 2800 },
          { name: "Hyaluronic Mist", qty: 1, price: 4200 },
        ],
        total: 9800,
        pointsEarned: 98,
        paymentMethod: "cash",
        cashier: "Aisha Patel",
      },
    ],
  },
  {
    id: "cust003",
    name: "Riya Sharma",
    phone: "+91 99110 87654",
    email: "riya.sharma@yahoo.in",
    avatar: "RS",
    joinDate: "2025-06-20",
    dob: "2000-03-05",
    address: "8, Green Lane, Jubilee Hills, Hyderabad 500033",
    totalSpent: 14200,
    points: 1420,
    tier: "Gold",
    purchaseCount: 9,
    lastVisit: "2026-05-25",
    purchases: [
      {
        id: "RCP-20260525-002",
        date: "2026-05-25",
        items: [
          { name: "Matte Lipstick", qty: 2, price: 1900 },
          { name: "Brow Pencil", qty: 1, price: 1500 },
        ],
        total: 5300,
        pointsEarned: 53,
        paymentMethod: "card",
        cashier: "Sophia Laurent",
      },
      {
        id: "RCP-20260415-006",
        date: "2026-04-15",
        items: [{ name: "Blush Palette", qty: 1, price: 3200 }],
        total: 3200,
        pointsEarned: 32,
        paymentMethod: "upi",
        cashier: "Mia Chen",
      },
    ],
  },
  {
    id: "cust004",
    name: "Kavya Reddy",
    phone: "+91 80012 34567",
    email: "kavya.r@gmail.com",
    avatar: "KR",
    joinDate: "2025-11-10",
    totalSpent: 4800,
    points: 480,
    tier: "Rose",
    purchaseCount: 3,
    lastVisit: "2026-05-18",
    purchases: [
      {
        id: "RCP-20260518-005",
        date: "2026-05-18",
        items: [{ name: "Silk Foundation", qty: 1, price: 4800 }],
        total: 4800,
        pointsEarned: 48,
        paymentMethod: "cash",
        cashier: "Aisha Patel",
      },
    ],
  },
  {
    id: "cust005",
    name: "Ananya Iyer",
    phone: "+91 70011 22334",
    email: "ananya.iyer@icloud.com",
    avatar: "AI",
    joinDate: "2023-09-14",
    dob: "1988-08-30",
    address: "201, Sea View Apts, Worli, Mumbai 400018",
    totalSpent: 96300,
    points: 9630,
    tier: "Platinum",
    purchaseCount: 31,
    lastVisit: "2026-05-30",
    purchases: [
      {
        id: "RCP-20260530-001",
        date: "2026-05-30",
        items: [
          { name: "Cherry Blossom EDT", qty: 1, price: 9500 },
          { name: "Beauty Blender", qty: 2, price: 1400 },
        ],
        total: 12300,
        pointsEarned: 123,
        paymentMethod: "card",
        cashier: "Sophia Laurent",
      },
      {
        id: "RCP-20260501-008",
        date: "2026-05-01",
        items: [
          { name: "Volume Mascara", qty: 1, price: 3400 },
          { name: "Precision Liner", qty: 1, price: 1800 },
        ],
        total: 5200,
        pointsEarned: 52,
        paymentMethod: "upi",
        cashier: "Mia Chen",
      },
    ],
  },
  {
    id: "cust006",
    name: "Meera Das",
    phone: "+91 91234 56789",
    email: "meera.das@gmail.com",
    avatar: "MD",
    joinDate: "2026-02-01",
    totalSpent: 2100,
    points: 210,
    tier: "Rose",
    purchaseCount: 2,
    lastVisit: "2026-04-20",
    purchases: [
      {
        id: "RCP-20260420-010",
        date: "2026-04-20",
        items: [{ name: "Liquid Lipstick", qty: 1, price: 2100 }],
        total: 2100,
        pointsEarned: 21,
        paymentMethod: "cash",
        cashier: "Aisha Patel",
      },
    ],
  },
];
