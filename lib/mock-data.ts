export type Category =
  | "All"
  | "Face"
  | "Eyes"
  | "Lips"
  | "Skin Care"
  | "Fragrance"
  | "Nails"
  | "Tools";

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: Exclude<Category, "All">;
  price: number;
  stock: number;
  lowStockThreshold: number;
  emoji: string;
  shade?: string;
  expiryDate?: string;
}

export interface Cashier {
  id: string;
  name: string;
  role: "admin" | "senior_cashier" | "cashier";
  avatar: string;
  pin: string;
}

export const CATEGORIES: Category[] = [
  "All",
  "Face",
  "Eyes",
  "Lips",
  "Skin Care",
  "Fragrance",
  "Nails",
  "Tools",
];

export const PRODUCTS: Product[] = [
  // Face
  {
    id: "p001",
    barcode: "8901234560001",
    name: "Silk Foundation",
    brand: "Dior Beauty",
    category: "Face",
    price: 4800,
    stock: 24,
    lowStockThreshold: 5,
    emoji: "🌸",
    shade: "N20 Ivory",
    expiryDate: "2027-06-01",
  },
  {
    id: "p002",
    barcode: "8901234560002",
    name: "HD Concealer",
    brand: "NARS",
    category: "Face",
    price: 2600,
    stock: 18,
    lowStockThreshold: 5,
    emoji: "✨",
    shade: "Vanilla",
    expiryDate: "2027-03-15",
  },
  {
    id: "p003",
    barcode: "8901234560003",
    name: "Blush Palette",
    brand: "Charlotte Tilbury",
    category: "Face",
    price: 3200,
    stock: 3,
    lowStockThreshold: 5,
    emoji: "🌷",
    expiryDate: "2026-07-24",
  },
  {
    id: "p004",
    barcode: "8901234560004",
    name: "Setting Powder",
    brand: "Laura Mercier",
    category: "Face",
    price: 2900,
    stock: 11,
    lowStockThreshold: 5,
    emoji: "🌟",
    shade: "Translucent",
    expiryDate: "2027-08-10",
  },
  {
    id: "p005",
    barcode: "8901234560005",
    name: "Bronzer Duo",
    brand: "Too Faced",
    category: "Face",
    price: 2200,
    stock: 7,
    lowStockThreshold: 5,
    emoji: "☀️",
    expiryDate: "2027-01-20",
  },

  // Eyes
  {
    id: "p006",
    barcode: "8901234560006",
    name: "Volume Mascara",
    brand: "Lancôme",
    category: "Eyes",
    price: 3400,
    stock: 22,
    lowStockThreshold: 6,
    emoji: "👁️",
    expiryDate: "2026-06-14",
  },
  {
    id: "p007",
    barcode: "8901234560007",
    name: "Eyeshadow Palette",
    brand: "Urban Decay",
    category: "Eyes",
    price: 5200,
    stock: 2,
    lowStockThreshold: 4,
    emoji: "🎨",
    shade: "Naked 3",
    expiryDate: "2027-11-01",
  },
  {
    id: "p008",
    barcode: "8901234560008",
    name: "Precision Liner",
    brand: "Stila",
    category: "Eyes",
    price: 1800,
    stock: 30,
    lowStockThreshold: 8,
    emoji: "🖊️",
    shade: "Intense Black",
    expiryDate: "2026-07-08",
  },
  {
    id: "p009",
    barcode: "8901234560009",
    name: "Brow Pencil",
    brand: "Anastasia BH",
    category: "Eyes",
    price: 1500,
    stock: 14,
    lowStockThreshold: 5,
    emoji: "📏",
    shade: "Brunette",
    expiryDate: "2027-04-20",
  },

  // Lips
  {
    id: "p010",
    barcode: "8901234560010",
    name: "Matte Lipstick",
    brand: "MAC",
    category: "Lips",
    price: 1900,
    stock: 35,
    lowStockThreshold: 8,
    emoji: "💋",
    shade: "Ruby Woo",
    expiryDate: "2027-07-15",
  },
  {
    id: "p011",
    barcode: "8901234560011",
    name: "Plumping Gloss",
    brand: "Dior Beauty",
    category: "Lips",
    price: 2400,
    stock: 20,
    lowStockThreshold: 6,
    emoji: "💄",
    shade: "Pink Blossom",
    expiryDate: "2027-05-10",
  },
  {
    id: "p012",
    barcode: "8901234560012",
    name: "Liquid Lipstick",
    brand: "Fenty Beauty",
    category: "Lips",
    price: 2100,
    stock: 4,
    lowStockThreshold: 5,
    emoji: "🩷",
    shade: "Underdawg",
    expiryDate: "2026-06-22",
  },
  {
    id: "p013",
    barcode: "8901234560013",
    name: "Lip Liner",
    brand: "Charlotte Tilbury",
    category: "Lips",
    price: 1600,
    stock: 28,
    lowStockThreshold: 8,
    emoji: "✏️",
    shade: "Iconic Nude",
    expiryDate: "2027-09-05",
  },

  // Skin Care
  {
    id: "p014",
    barcode: "8901234560014",
    name: "Vitamin C Serum",
    brand: "SkinCeuticals",
    category: "Skin Care",
    price: 7800,
    stock: 9,
    lowStockThreshold: 4,
    emoji: "🍊",
    expiryDate: "2027-02-28",
  },
  {
    id: "p015",
    barcode: "8901234560015",
    name: "Hyaluronic Mist",
    brand: "Tatcha",
    category: "Skin Care",
    price: 4200,
    stock: 13,
    lowStockThreshold: 5,
    emoji: "💧",
    expiryDate: "2027-06-30",
  },
  {
    id: "p016",
    barcode: "8901234560016",
    name: "SPF 50 Sunscreen",
    brand: "La Roche-Posay",
    category: "Skin Care",
    price: 2800,
    stock: 19,
    lowStockThreshold: 6,
    emoji: "🛡️",
    expiryDate: "2026-08-22",
  },
  {
    id: "p017",
    barcode: "8901234560017",
    name: "Retinol Night Cream",
    brand: "Estée Lauder",
    category: "Skin Care",
    price: 6500,
    stock: 1,
    lowStockThreshold: 3,
    emoji: "🌙",
    expiryDate: "2026-08-05",
  },

  // Fragrance
  {
    id: "p018",
    barcode: "8901234560018",
    name: "Rose Bloom EDP",
    brand: "Jo Malone",
    category: "Fragrance",
    price: 12000,
    stock: 8,
    lowStockThreshold: 3,
    emoji: "🌹",
    expiryDate: "2029-01-01",
  },
  {
    id: "p019",
    barcode: "8901234560019",
    name: "Cherry Blossom EDT",
    brand: "Guerlain",
    category: "Fragrance",
    price: 9500,
    stock: 5,
    lowStockThreshold: 3,
    emoji: "🌸",
    expiryDate: "2029-06-01",
  },

  // Nails
  {
    id: "p020",
    barcode: "8901234560020",
    name: "Gel Nail Polish",
    brand: "OPI",
    category: "Nails",
    price: 1200,
    stock: 40,
    lowStockThreshold: 10,
    emoji: "💅",
    shade: "Ballet Slippers",
    expiryDate: "2028-01-01",
  },
  {
    id: "p021",
    barcode: "8901234560021",
    name: "Nail Strengthener",
    brand: "Sally Hansen",
    category: "Nails",
    price: 800,
    stock: 22,
    lowStockThreshold: 8,
    emoji: "💪",
    expiryDate: "2028-03-01",
  },

  // Tools
  {
    id: "p022",
    barcode: "8901234560022",
    name: "Kabuki Brush Set",
    brand: "Sigma Beauty",
    category: "Tools",
    price: 3800,
    stock: 6,
    lowStockThreshold: 3,
    emoji: "🖌️",
    expiryDate: undefined,
  },
  {
    id: "p023",
    barcode: "8901234560023",
    name: "Beauty Blender",
    brand: "Beautyblender",
    category: "Tools",
    price: 1400,
    stock: 15,
    lowStockThreshold: 5,
    emoji: "🫧",
    expiryDate: undefined,
  },
];

export const CASHIERS: Cashier[] = [
  {
    id: "c001",
    name: "Sophia Laurent",
    role: "admin",
    avatar: "SL",
    pin: "1234",
  },
  {
    id: "c002",
    name: "Mia Chen",
    role: "senior_cashier",
    avatar: "MC",
    pin: "5678",
  },
  {
    id: "c003",
    name: "Aisha Patel",
    role: "cashier",
    avatar: "AP",
    pin: "9012",
  },
];

export const ACTIVE_CASHIER = CASHIERS[0];

export const TAX_RATE = 0.18;
