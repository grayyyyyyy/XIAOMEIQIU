import { AppData, Item, Category, DEFAULT_CATEGORIES, STORAGE_KEY, generateId } from './types';

function getInitialData(): AppData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { items: [], categories: DEFAULT_CATEGORIES };
    }
  }
  return { items: [], categories: DEFAULT_CATEGORIES };
}

export function loadAppData(): AppData {
  return getInitialData();
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addItem(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item {
  const data = getInitialData();
  const newItem: Item = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  data.items.push(newItem);
  saveAppData(data);
  return newItem;
}

export function updateItem(id: string, updates: Partial<Item>): Item | null {
  const data = getInitialData();
  const index = data.items.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  data.items[index] = {
    ...data.items[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveAppData(data);
  return data.items[index];
}

export function deleteItem(id: string): boolean {
  const data = getInitialData();
  const index = data.items.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  data.items.splice(index, 1);
  saveAppData(data);
  return true;
}

export function deleteItems(ids: string[]): number {
  const data = getInitialData();
  const idSet = new Set(ids);
  const originalLength = data.items.length;
  data.items = data.items.filter(item => !idSet.has(item.id));
  saveAppData(data);
  return originalLength - data.items.length;
}

export function addCategory(name: string, color: string): Category {
  const data = getInitialData();
  const newCategory: Category = {
    id: generateId(),
    name,
    color
  };
  data.categories.push(newCategory);
  saveAppData(data);
  return newCategory;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const data = getInitialData();
  const index = data.categories.findIndex(cat => cat.id === id);
  if (index === -1) return null;
  
  data.categories[index] = { ...data.categories[index], ...updates };
  saveAppData(data);
  return data.categories[index];
}

export function deleteCategory(id: string): boolean {
  const data = getInitialData();
  const index = data.categories.findIndex(cat => cat.id === id);
  if (index === -1) return false;
  
  data.categories.splice(index, 1);
  saveAppData(data);
  return true;
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}