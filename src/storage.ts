import { AppData, Item, Category, User, RememberMeData, DEFAULT_CATEGORIES, STORAGE_KEY, REMEMBER_ME_KEY, generateId } from './types';

function getInitialData(): AppData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      return {
        ...data,
        categories: data.categories || DEFAULT_CATEGORIES,
        users: data.users || []
      };
    } catch {
      return { items: [], categories: DEFAULT_CATEGORIES, users: [] };
    }
  }
  return { items: [], categories: DEFAULT_CATEGORIES, users: [] };
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
  localStorage.removeItem(REMEMBER_ME_KEY);
  localStorage.removeItem('currentUserId');
}

export function addUser(name: string, password: string, color: string): User {
  const data = getInitialData();
  const newUser: User = {
    id: generateId(),
    name,
    password,
    color,
    createdAt: new Date().toISOString()
  };
  data.users.push(newUser);
  saveAppData(data);
  return newUser;
}

export function getUserItems(userId: string): Item[] {
  const data = getInitialData();
  return data.items.filter(item => item.userId === userId);
}

export function getUserByName(name: string): User | undefined {
  const data = getInitialData();
  return data.users.find(user => user.name === name);
}

export function authenticate(name: string, password: string): User | null {
  const data = getInitialData();
  const user = data.users.find(u => u.name === name && u.password === password);
  return user || null;
}

export function getCurrentUser(): User | null {
  const currentUserId = localStorage.getItem('currentUserId');
  if (!currentUserId) return null;

  const data = getInitialData();
  return data.users.find(user => user.id === currentUserId) || null;
}

export function setCurrentUser(userId: string): void {
  localStorage.setItem('currentUserId', userId);
}

export function setRememberMe(data: RememberMeData): void {
  localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(data));
}

export function getRememberMe(): RememberMeData | null {
  const stored = localStorage.getItem(REMEMBER_ME_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearRememberMe(): void {
  localStorage.removeItem(REMEMBER_ME_KEY);
}
