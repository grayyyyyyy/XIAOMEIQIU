export interface Item {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  purchaseDate: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface AppData {
  items: Item[];
  categories: Category[];
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'digital', name: '数码', color: '#6b8e7d' },
  { id: 'clothing', name: '服饰', color: '#d4a574' },
  { id: 'home', name: '家居', color: '#7fa7c4' },
  { id: 'accessories', name: '配饰', color: '#c4a77d' },
  { id: 'other', name: '其他', color: '#95a5a6' }
];

export const STORAGE_KEY = 'minimalist_inventory_app';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getDaysUsed(item: Item): number {
  const today = new Date();
  const purchaseDate = new Date(item.purchaseDate);
  const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function calculateDailyAverage(item: Item): number {
  const daysUsed = getDaysUsed(item);
  return item.purchasePrice / daysUsed;
}

export function formatCurrency(amount: number): string {
  return amount.toFixed(2);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
