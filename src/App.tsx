import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppData, Item, User, DEFAULT_CATEGORIES } from './types';
import { loadAppData, getCurrentUser, clearRememberMe } from './storage';
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import Categories from './pages/Categories';
import Stats from './pages/Stats';
import Login from './pages/Login';
import UserSwitcher from './components/UserSwitcher';
import './App.css';

function App() {
  const [data, setData] = useState<AppData>({ items: [], categories: DEFAULT_CATEGORIES, users: [] });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const loadedData = loadAppData();
    setData(loadedData);

    const savedUser = getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    } else {
      setShowLogin(true);
    }
  }, [refreshKey]);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    clearRememberMe();
    localStorage.removeItem('currentUserId');
    setCurrentUser(null);
    setShowLogin(true);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const getUserItems = (): Item[] => {
    if (!currentUser) return [];
    return data.items.filter(item => item.userId === currentUser.id);
  };

  const getCategoryName = (categoryId: string): string => {
    const category = data.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryColor = (categoryId: string): string => {
    const category = data.categories.find(c => c.id === categoryId);
    return category ? category.color : '#95a5a6';
  };

  if (showLogin || !currentUser) {
    return (
      <Router>
        <Login
          onLogin={handleLogin}
          existingUsers={data.users}
        />
      </Router>
    );
  }

  return (
    <Router>
      <div className="app">
        <div className="app-header">
          <UserSwitcher currentUser={currentUser} onSwitch={handleLogout} />
        </div>
        <Routes>
          <Route path="/" element={
            <Home
              items={getUserItems()}
              totalItems={getUserItems().length}
              getCategoryName={getCategoryName}
              getCategoryColor={getCategoryColor}
              searchKeyword={searchKeyword}
              onSearch={handleSearch}
              onRefresh={refreshData}
            />
          } />
          <Route path="/add" element={
            <AddItem
              categories={data.categories}
              userId={currentUser.id}
              onSave={() => {
                refreshData();
                window.location.href = '/';
              }}
            />
          } />
          <Route path="/edit/:id" element={
            <EditItem
              categories={data.categories}
              onSave={() => {
                refreshData();
                window.location.href = '/';
              }}
            />
          } />
          <Route path="/categories" element={
            <Categories
              categories={data.categories}
              items={data.items}
              onRefresh={refreshData}
            />
          } />
          <Route path="/stats" element={
            <Stats
              items={getUserItems()}
              categories={data.categories}
              getCategoryName={getCategoryName}
            />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
