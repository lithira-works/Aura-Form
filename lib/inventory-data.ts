import { PRODUCTS } from "./mock-data";
import type { Product } from "./mock-data";

export interface Supplier {
  id: string;
  name: string;
  initials: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  leadTimeDays: number;
  paymentTerms: string;
  categories: string[];
  status: "active" | "inactive" | "on_hold";
  rating: number;
  totalOrders: number;
  lastOrderDate: string;
  totalSpend: number;
  orderHistory: OrderRecord[];
}

export interface OrderRecord {
  id: string;
  date: string;
  items: number;
  amount: number;
  status: "delivered" | "in_transit" | "pending" | "cancelled";
}

export interface InventoryProduct extends Product {
  supplierId: string;
  supplierName: string;
  sku: string;
  costPrice: number;
  reorderQty: number;
  location: string;
  status: "active" | "inactive" | "discontinued";
  lastRestocked: string;
  imageEmoji: string;
}

export const SUPPLIERS: Supplier[] = [
  {
    id: "s001",
    name: "Luxe Beauty Distributors",
    initials: "LB",
    contactPerson: "Arjun Mehta",
    email: "arjun@luxebeauty.in",
    phone: "+91 98765 43210",
    country: "India",
    leadTimeDays: 3,
    paymentTerms: "Net 30",
    categories: ["Face", "Eyes", "Lips"],
    status: "active",
    rating: 4.8,
    totalOrders: 142,
    lastOrderDate: "2026-05-28",
    totalSpend: 2480000,
    orderHistory: [
      { id: "PO-1041", date: "2026-05-28", items: 12, amount: 48500, status: "delivered" },
      { id: "PO-1035", date: "2026-05-10", items: 8, amount: 32200, status: "delivered" },
      { id: "PO-1029", date: "2026-04-22", items: 15, amount: 61000, status: "delivered" },
      { id: "PO-1021", date: "2026-04-05", items: 6, amount: 24800, status: "delivered" },
    ],
  },
  {
    id: "s002",
    name: "Dior Beauty India",
    initials: "DB",
    contactPerson: "Priya Sharma",
    email: "priya.sharma@dior-india.com",
    phone: "+91 22 4891 0022",
    country: "India",
    leadTimeDays: 7,
    paymentTerms: "Net 45",
    categories: ["Face", "Fragrance", "Lips"],
    status: "active",
    rating: 4.9,
    totalOrders: 58,
    lastOrderDate: "2026-05-20",
    totalSpend: 5640000,
    orderHistory: [
      { id: "PO-D012", date: "2026-05-20", items: 5, amount: 120000, status: "in_transit" },
      { id: "PO-D011", date: "2026-04-15", items: 4, amount: 96000, status: "delivered" },
      { id: "PO-D010", date: "2026-03-10", items: 6, amount: 144000, status: "delivered" },
    ],
  },
  {
    id: "s003",
    name: "SkinCare Pro Wholesale",
    initials: "SP",
    contactPerson: "Meera Nair",
    email: "meera@skincarepro.in",
    phone: "+91 80 6712 3456",
    country: "India",
    leadTimeDays: 5,
    paymentTerms: "Net 15",
    categories: ["Skin Care"],
    status: "active",
    rating: 4.5,
    totalOrders: 89,
    lastOrderDate: "2026-06-01",
    totalSpend: 1920000,
    orderHistory: [
      { id: "PO-S041", date: "2026-06-01", items: 20, amount: 84000, status: "pending" },
      { id: "PO-S038", date: "2026-05-15", items: 14, amount: 56000, status: "delivered" },
      { id: "PO-S034", date: "2026-04-28", items: 18, amount: 72000, status: "delivered" },
    ],
  },
  {
    id: "s004",
    name: "Global Fragrance House",
    initials: "GF",
    contactPerson: "Rahul Kapoor",
    email: "rahul@gfh.com",
    phone: "+91 11 4400 8899",
    country: "UAE",
    leadTimeDays: 14,
    paymentTerms: "Net 60",
    categories: ["Fragrance"],
    status: "active",
    rating: 4.7,
    totalOrders: 24,
    lastOrderDate: "2026-04-10",
    totalSpend: 3200000,
    orderHistory: [
      { id: "PO-G008", date: "2026-04-10", items: 3, amount: 360000, status: "delivered" },
      { id: "PO-G007", date: "2026-01-20", items: 4, amount: 480000, status: "delivered" },
      { id: "PO-G006", date: "2025-10-05", items: 2, amount: 240000, status: "delivered" },
    ],
  },
  {
    id: "s005",
    name: "Nail & Tools Supply Co.",
    initials: "NT",
    contactPerson: "Sonia Verma",
    email: "sonia@ntsc.in",
    phone: "+91 44 2810 5678",
    country: "India",
    leadTimeDays: 4,
    paymentTerms: "Net 30",
    categories: ["Nails", "Tools"],
    status: "on_hold",
    rating: 3.9,
    totalOrders: 47,
    lastOrderDate: "2026-03-15",
    totalSpend: 680000,
    orderHistory: [
      { id: "PO-N019", date: "2026-03-15", items: 25, amount: 32000, status: "delivered" },
      { id: "PO-N018", date: "2026-02-10", items: 18, amount: 24000, status: "delivered" },
      { id: "PO-N017", date: "2026-01-08", items: 30, amount: 38000, status: "cancelled" },
    ],
  },
];

const SUPPLIER_MAP: Record<string, { id: string; name: string }> = {
  p001: { id: "s002", name: "Dior Beauty India" },
  p002: { id: "s001", name: "Luxe Beauty Distributors" },
  p003: { id: "s001", name: "Luxe Beauty Distributors" },
  p004: { id: "s001", name: "Luxe Beauty Distributors" },
  p005: { id: "s001", name: "Luxe Beauty Distributors" },
  p006: { id: "s001", name: "Luxe Beauty Distributors" },
  p007: { id: "s001", name: "Luxe Beauty Distributors" },
  p008: { id: "s001", name: "Luxe Beauty Distributors" },
  p009: { id: "s001", name: "Luxe Beauty Distributors" },
  p010: { id: "s001", name: "Luxe Beauty Distributors" },
  p011: { id: "s002", name: "Dior Beauty India" },
  p012: { id: "s001", name: "Luxe Beauty Distributors" },
  p013: { id: "s001", name: "Luxe Beauty Distributors" },
  p014: { id: "s003", name: "SkinCare Pro Wholesale" },
  p015: { id: "s003", name: "SkinCare Pro Wholesale" },
  p016: { id: "s003", name: "SkinCare Pro Wholesale" },
  p017: { id: "s003", name: "SkinCare Pro Wholesale" },
  p018: { id: "s004", name: "Global Fragrance House" },
  p019: { id: "s004", name: "Global Fragrance House" },
  p020: { id: "s005", name: "Nail & Tools Supply Co." },
  p021: { id: "s005", name: "Nail & Tools Supply Co." },
  p022: { id: "s005", name: "Nail & Tools Supply Co." },
  p023: { id: "s005", name: "Nail & Tools Supply Co." },
};

const LOCATIONS = ["Shelf A1", "Shelf A2", "Shelf B1", "Shelf B2", "Shelf C1", "Cold Storage", "Display Unit", "Back Stock"];

export const INVENTORY_PRODUCTS: InventoryProduct[] = PRODUCTS.map((p, i) => ({
  ...p,
  sku: `AF-${p.category.substring(0, 2).toUpperCase()}-${String(i + 1).padStart(4, "0")}`,
  supplierId: SUPPLIER_MAP[p.id]?.id ?? "s001",
  supplierName: SUPPLIER_MAP[p.id]?.name ?? "Luxe Beauty Distributors",
  costPrice: Math.round(p.price * 0.55),
  reorderQty: p.lowStockThreshold * 3,
  location: LOCATIONS[i % LOCATIONS.length],
  status: p.stock === 0 ? "inactive" : ("active" as const),
  lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  imageEmoji: p.emoji,
}));

export type SortField = keyof InventoryProduct;
export type SortDir = "asc" | "desc";

export function exportToCSV(products: InventoryProduct[]) {
  const headers = [
    "SKU", "Name", "Brand", "Category", "Barcode", "Stock",
    "Low Stock Threshold", "Unit Price (LKR)", "Cost Price (LKR)",
    "Supplier", "Location", "Status", "Last Restocked", "Expiry Date",
  ];
  const rows = products.map((p) => [
    p.sku, p.name, p.brand, p.category, p.barcode, p.stock,
    p.lowStockThreshold, p.price, p.costPrice,
    p.supplierName, p.location, p.status, p.lastRestocked, p.expiryDate ?? "",
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cosmopos-inventory-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
