import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppData, Item, Category, DEFAULT_CATEGORIES } from './types';
import { loadAppData } from './storage';
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import Categories from './pages/Categories';
import Stats from './pages/Stats';
import './App.css';

function App() {
  const [data, setData] = useState<AppData>({ items: [], categories: DEFAULT_CATEGORIES });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadedData = loadAppData();
    setData(loadedData);
  }, [refreshKey]);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const getFilteredItems = (): Item[] => {
    if (!searchKeyword.trim()) return data.items;
    const keyword = searchKeyword.toLowerCase();
    return data.items.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    );
  };

  const getCategoryName = (categoryId: string): string => {
    const category = data.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryColor = (categoryId: string): string => {
    const category = data.categories.find(c => c.id === categoryId);
    return category ? category.color : '#95a5a6';
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            <Home
              items={getFilteredItems()}
              categories={data.categories}
              totalItems={data.items.length}
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
              items={data.items}
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