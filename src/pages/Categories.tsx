import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, Item } from '../types';
import { addCategory, deleteCategory } from '../storage';
import BottomNav from '../components/BottomNav';
import '../pages/Categories.css';

interface CategoriesProps {
  categories: Category[];
  items: Item[];
  onRefresh: () => void;
}

const PRESET_COLORS = [
  '#6b8e7d', '#d4a574', '#7fa7c4', '#c4a77d', '#95a5a6',
  '#e74c3c', '#9b59b6', '#3498db', '#1abc9c', '#f39c12'
];

export default function Categories({ categories, items, onRefresh }: CategoriesProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(PRESET_COLORS[0]);

  const getCategoryItemCount = (categoryId: string) => {
    return items.filter(item => item.category === categoryId).length;
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    addCategory(newCategoryName.trim(), newCategoryColor);
    setNewCategoryName('');
    setNewCategoryColor(PRESET_COLORS[0]);
    setShowAddForm(false);
    onRefresh();
  };

  const handleDeleteCategory = (id: string) => {
    const count = getCategoryItemCount(id);
    if (count > 0) {
      alert(`该分类下有 ${count} 件物品，请先删除或移动这些物品`);
      return;
    }
    if (window.confirm('确定要删除该分类吗？')) {
      deleteCategory(id);
      onRefresh();
    }
  };

  return (
    <div className="categories-page">
      <header className="page-header">
        <h1 className="page-title">物品分类</h1>
      </header>

      <div className="categories-list">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div
              className="category-color"
              style={{ backgroundColor: category.color }}
            />
            <div className="category-info">
              <span className="category-name">{category.name}</span>
              <span className="category-count">
                {getCategoryItemCount(category.id)} 件物品
              </span>
            </div>
            <button
              className="delete-category-btn"
              onClick={() => handleDeleteCategory(category.id)}
            >
              删除
            </button>
          </div>
        ))}
      </div>

      {showAddForm ? (
        <form className="add-category-form" onSubmit={handleAddCategory}>
          <div className="form-row">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="分类名称"
              className="category-name-input"
            />
            <button type="submit" className="save-btn">保存</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowAddForm(false)}
            >
              取消
            </button>
          </div>
          <div className="color-picker">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`color-option ${newCategoryColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setNewCategoryColor(color)}
              />
            ))}
          </div>
        </form>
      ) : (
        <button
          className="add-category-btn"
          onClick={() => setShowAddForm(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          添加新分类
        </button>
      )}

      <BottomNav currentTab="categories" />
    </div>
  );
}