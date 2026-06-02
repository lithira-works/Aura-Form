// ── Seeded-random helpers (deterministic so SSR = CSR) ────────────────────────
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Daily revenue — last 30 days ──────────────────────────────────────────────
export interface DayRevenue {
  date: string;       // "Jun 02"
  fullDate: string;   // "2026-06-02"
  revenue: number;
  transactions: number;
  profit: number;
}

export function generateDailyData(): DayRevenue[] {
  const rand = seeded(42);
  const today = new Date("2026-06-02");
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const base = isWeekend ? 42000 : 28000;
    const revenue = Math.round(base + rand() * 24000);
    const transactions = Math.round(12 + rand() * 20);
    return {
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      fullDate: d.toISOString().split("T")[0],
      revenue,
      transactions,
      profit: Math.round(revenue * 0.42),
    };
  });
}

// ── Monthly revenue — last 12 months ─────────────────────────────────────────
export interface MonthRevenue {
  month: string;   // "Jul '25"
  revenue: number;
  transactions: number;
  profit: number;
}

export function generateMonthlyData(): MonthRevenue[] {
  const rand = seeded(99);
  const months = [
    "Jun '25","Jul '25","Aug '25","Sep '25","Oct '25","Nov '25",
    "Dec '25","Jan '26","Feb '26","Mar '26","Apr '26","May '26",
  ];
  const bases = [
    520000, 580000, 610000, 545000, 700000, 850000,
    920000, 490000, 530000, 640000, 710000, 780000,
  ];
  return months.map((month, i) => {
    const revenue = Math.round(bases[i] + rand() * 80000);
    return {
      month,
      revenue,
      transactions: Math.round(280 + rand() * 180),
      profit: Math.round(revenue * 0.41 + rand() * 20000),
    };
  });
}

// ── Hourly breakdown for today ────────────────────────────────────────────────
export interface HourSlot {
  hour: string;
  revenue: number;
  transactions: number;
}

export function generateHourlyData(): HourSlot[] {
  const rand = seeded(77);
  const curve = [0,0,0,0,0,0,0,0,4,12,28,45,62,70,55,48,60,72,65,50,35,20,8,2];
  return curve.map((weight, h) => ({
    hour: `${String(h).padStart(2,"0")}:00`,
    revenue: Math.round(weight * 380 + rand() * weight * 200),
    transactions: Math.round(weight * 0.18 + rand() * weight * 0.1),
  }));
}

// ── Top-selling products ──────────────────────────────────────────────────────
export interface TopProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  emoji: string;
  unitsSold: number;
  revenue: number;
  trend: number; // % change vs last period
}

export const TOP_PRODUCTS: TopProduct[] = [
  { id:"p010", name:"Matte Lipstick",    brand:"MAC",             category:"Lips",      emoji:"💋", unitsSold:147, revenue:279300, trend:+18 },
  { id:"p001", name:"Silk Foundation",   brand:"Dior Beauty",     category:"Face",      emoji:"🌸", unitsSold:112, revenue:537600, trend:+9  },
  { id:"p014", name:"Vitamin C Serum",   brand:"SkinCeuticals",   category:"Skin Care", emoji:"🍊", unitsSold:98,  revenue:764400, trend:+31 },
  { id:"p006", name:"Volume Mascara",    brand:"Lancôme",         category:"Eyes",      emoji:"👁️", unitsSold:91,  revenue:309400, trend:-4  },
  { id:"p020", name:"Gel Nail Polish",   brand:"OPI",             category:"Nails",     emoji:"💅", unitsSold:88,  revenue:105600, trend:+7  },
  { id:"p018", name:"Rose Bloom EDP",    brand:"Jo Malone",       category:"Fragrance", emoji:"🌹", unitsSold:43,  revenue:516000, trend:+22 },
  { id:"p015", name:"Hyaluronic Mist",   brand:"Tatcha",          category:"Skin Care", emoji:"💧", unitsSold:79,  revenue:331800, trend:+14 },
];

// ── Category revenue breakdown ────────────────────────────────────────────────
export interface CategorySlice {
  name: string;
  value: number;
  color: string;
  emoji: string;
}

export const CATEGORY_BREAKDOWN: CategorySlice[] = [
  { name:"Face",      value:28, color:"#F2A7B9", emoji:"🌸" },
  { name:"Skin Care", value:22, color:"#c084fc", emoji:"💧" },
  { name:"Lips",      value:18, color:"#fb7185", emoji:"💋" },
  { name:"Fragrance", value:14, color:"#a78bfa", emoji:"🌹" },
  { name:"Eyes",      value:10, color:"#60a5fa", emoji:"👁️" },
  { name:"Nails",     value:5,  color:"#34d399", emoji:"💅" },
  { name:"Tools",     value:3,  color:"#fbbf24", emoji:"🖌️" },
];

// ── Recent transactions ───────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  time: string;
  customer: string | null;
  items: number;
  total: number;
  method: "cash" | "card" | "upi";
  cashier: string;
  points?: number;
}

export const RECENT_TRANSACTIONS: Transaction[] = [
  { id:"TXN-8841", time:"8:14 PM", customer:"Nisha Kapoor",  items:3, total:16200, method:"card", cashier:"Sophia L.",  points:162 },
  { id:"TXN-8840", time:"7:52 PM", customer:null,            items:1, total:4800,  method:"cash", cashier:"Mia C.",     points:undefined },
  { id:"TXN-8839", time:"7:38 PM", customer:"Priya Menon",   items:2, total:6400,  method:"upi",  cashier:"Aisha P.",   points:64 },
  { id:"TXN-8838", time:"7:21 PM", customer:null,            items:4, total:11200, method:"card", cashier:"Sophia L.",  points:undefined },
  { id:"TXN-8837", time:"6:55 PM", customer:"Ananya Iyer",   items:2, total:12300, method:"card", cashier:"Mia C.",     points:123 },
  { id:"TXN-8836", time:"6:34 PM", customer:null,            items:1, total:2800,  method:"upi",  cashier:"Aisha P.",   points:undefined },
  { id:"TXN-8835", time:"6:10 PM", customer:"Riya Sharma",   items:3, total:5300,  method:"card", cashier:"Sophia L.",  points:53 },
  { id:"TXN-8834", time:"5:47 PM", customer:null,            items:2, total:7600,  method:"cash", cashier:"Mia C.",     points:undefined },
];

// ── KPI helpers ───────────────────────────────────────────────────────────────
export interface KPIData {
  todayRevenue: number;
  todayTransactions: number;
  avgOrderValue: number;
  newLoyaltySignups: number;
  revenueChange: number;
  transactionsChange: number;
  aovChange: number;
  signupsChange: number;
}

export function getKPIData(daily: DayRevenue[]): KPIData {
  const today = daily[daily.length - 1];
  const yesterday = daily[daily.length - 2];
  const pct = (a: number, b: number) =>
    b === 0 ? 0 : Math.round(((a - b) / b) * 100);
  return {
    todayRevenue: today.revenue,
    todayTransactions: today.transactions,
    avgOrderValue: Math.round(today.revenue / today.transactions),
    newLoyaltySignups: 3,
    revenueChange: pct(today.revenue, yesterday.revenue),
    transactionsChange: pct(today.transactions, yesterday.transactions),
    aovChange: pct(today.revenue / today.transactions, yesterday.revenue / yesterday.transactions),
    signupsChange: +50,
  };
}

// ── Sync terminals ────────────────────────────────────────────────────────────
export interface Terminal {
  id: string;
  name: string;
  type: "web" | "mobile" | "tablet";
  cashier: string;
  lastSync: string;
  status: "synced" | "syncing" | "offline";
  transactionsToday: number;
}

export const TERMINALS: Terminal[] = [
  { id:"T1", name:"Main Counter",    type:"web",    cashier:"Sophia Laurent", lastSync:"just now",   status:"synced",  transactionsToday:14 },
  { id:"T2", name:"Express Till",    type:"tablet", cashier:"Mia Chen",       lastSync:"2 min ago",  status:"synced",  transactionsToday:9  },
  { id:"T3", name:"Mobile POS",      type:"mobile", cashier:"Aisha Patel",    lastSync:"5 min ago",  status:"syncing", transactionsToday:7  },
  { id:"T4", name:"Stockroom Scan",  type:"mobile", cashier:"—",              lastSync:"32 min ago", status:"offline", transactionsToday:0  },
];
