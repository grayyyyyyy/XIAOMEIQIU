import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Item, Category, calculateDailyAverage, getDaysUsed, formatCurrency } from '../types';
import { deleteItem, deleteItems } from '../storage';
import BottomNav from '../components/BottomNav';
import '../pages/Home.css';

interface HomeProps {
  items: Item[];
  categories: Category[];
  totalItems: number;
  getCategoryName: (id: string) => string;
  getCategoryColor: (id: string) => string;
  searchKeyword: string;
  onSearch: (keyword: string) => void;
  onRefresh: () => void;
}

type SortType = 'date' | 'dailyAverage' | 'purchasePrice';

export default function Home({
  items,
  categories,
  totalItems,
  getCategoryName,
  getCategoryColor,
  searchKeyword,
  onSearch,
  onRefresh
}: HomeProps) {
  const [totalDailyAverage, setTotalDailyAverage] = useState(0);
  const [sortType, setSortType] = useState<SortType>('date');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + calculateDailyAverage(item), 0);
    setTotalDailyAverage(total);
  }, [items]);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这件物品吗？')) {
      deleteItem(id);
      onRefresh();
    }
  };

  const handleBatchDelete = () => {
    if (selectedItems.size === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedItems.size} 件物品吗？`)) {
      deleteItems(Array.from(selectedItems));
      setSelectedItems(new Set());
      setIsSelectionMode(false);
      onRefresh();
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortType === 'dailyAverage') {
      return calculateDailyAverage(b) - calculateDailyAverage(a);
    }
    if (sortType === 'purchasePrice') {
      return b.purchasePrice - a.purchasePrice;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'digital': return '📱';
      case 'clothing': return '👕';
      case 'home': return '🏠';
      case 'accessories': return '💍';
      default: return '📦';
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>记物</h1>
        <p className="home-subtitle">极简个人物品管理</p>
      </header>

      <div className="stats-overview">
        <div className="stat-card primary">
          <span className="stat-label">总日均价格</span>
          <span className="stat-value">¥{formatCurrency(totalDailyAverage)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">物品总数</span>
          <span className="stat-value">{totalItems}</span>
        </div>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="搜索物品名称..."
            value={searchKeyword}
            onChange={(e) => onSearch(e.target.value)}
          />
          {searchKeyword && (
            <button className="clear-btn" onClick={() => onSearch('')}>清除</button>
          )}
        </div>
      </div>

      <div className="filter-bar">
        <span className="filter-label">排序：</span>
        <button
          className={`filter-btn ${sortType === 'date' ? 'active' : ''}`}
          onClick={() => setSortType('date')}
        >
          按时间
        </button>
        <button
          className={`filter-btn ${sortType === 'dailyAverage' ? 'active' : ''}`}
          onClick={() => setSortType('dailyAverage')}
        >
          按日均价
        </button>
        <button
          className={`filter-btn ${sortType === 'purchasePrice' ? 'active' : ''}`}
          onClick={() => setSortType('purchasePrice')}
        >
          按购入价
        </button>
        <div className="filter-spacer"></div>
        {isSelectionMode ? (
          <>
            <button className="action-btn cancel" onClick={() => {
              setIsSelectionMode(false);
              setSelectedItems(new Set());
            }}>取消</button>
            <button className="action-btn delete" onClick={handleBatchDelete}>删除</button>
          </>
        ) : (
          <button className="action-btn select" onClick={() => setIsSelectionMode(true)}>多选</button>
        )}
      </div>

      {sortedItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>{searchKeyword ? '没有找到匹配的物品' : '还没有添加任何物品'}</p>
          {!searchKeyword && (
            <Link to="/add" className="add-first-btn">添加第一件物品</Link>
          )}
        </div>
      ) : (
        <div className="items-grid">
          {sortedItems.map(item => {
            const dailyAverage = calculateDailyAverage(item);
            const daysUsed = getDaysUsed(item);
            const categoryColor = getCategoryColor(item.category);
            
            return (
              <div
                key={item.id}
                className={`item-card ${selectedItems.has(item.id) ? 'selected' : ''}`}
                onClick={() => isSelectionMode ? toggleSelect(item.id) : undefined}
              >
                {isSelectionMode && (
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </div>
                )}
                {!isSelectionMode && (
                  <div className="item-actions">
                    <Link to={`/edit/${item.id}`} className="edit-btn">编辑</Link>
                    <button className="delete-btn" onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}>删除</button>
                  </div>
                )}
                <div className="item-header">
                  <span className="item-icon">{getCategoryIcon(item.category)}</span>
                  <span
                    className="item-category"
                    style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
                  >
                    {getCategoryName(item.category)}
                  </span>
                </div>
                <h3 className="item-name">{item.name}</h3>
                <div className="item-stats">
                  <div className="item-stat">
                    <span className="stat-label">购入价</span>
                    <span className="stat-value">¥{formatCurrency(item.purchasePrice)}</span>
                  </div>
                  <div className="item-stat">
                    <span className="stat-label">已使用</span>
                    <span className="stat-value">{daysUsed}天</span>
                  </div>
                  <div className="item-stat">
                    <span className="stat-label">日均价格</span>
                    <span className="stat-value price">¥{formatCurrency(dailyAverage)}</span>
                  </div>
                </div>
                <div className="item-footer">
                  <span className="purchase-info">
                    购于 {item.purchaseDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isSelectionMode && sortedItems.length > 0 && (
        <Link to="/add" className="fab">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </Link>
      )}

      <BottomNav currentTab="home" />
    </div>
  );
}
