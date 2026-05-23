import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Category, Item } from '../types';
import { loadAppData, updateItem } from '../storage';
import BottomNav from '../components/BottomNav';
import '../pages/Form.css';

interface EditItemProps {
  categories: Category[];
  onSave: () => void;
}

export default function EditItem({ categories, onSave }: EditItemProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    purchasePrice: '',
    purchaseDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const data = loadAppData();
    const foundItem = data.items.find(i => i.id === id);
    if (foundItem) {
      setItem(foundItem);
      setFormData({
        name: foundItem.name,
        category: foundItem.category,
        purchasePrice: foundItem.purchasePrice.toString(),
        purchaseDate: foundItem.purchaseDate
      });
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入物品名称';
    }
    
    const price = parseFloat(formData.purchasePrice);
    if (isNaN(price) || price <= 0) {
      newErrors.purchasePrice = '请输入有效的购买价格';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) return;
    
    updateItem(id, {
      name: formData.name.trim(),
      category: formData.category,
      purchasePrice: parseFloat(formData.purchasePrice),
      purchaseDate: formData.purchaseDate
    });
    
    onSave();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!item) {
    return (
      <div className="form-page">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <h1>编辑物品</h1>
          <div className="header-spacer"></div>
        </header>
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <header className="form-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <h1>编辑物品</h1>
        <div className="header-spacer"></div>
      </header>

      <form className="item-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>物品名称 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="例如：iPhone 15 Pro"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>物品分类</label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>购买价格（元） *</label>
          <input
            type="number"
            step="0.01"
            value={formData.purchasePrice}
            onChange={(e) => handleChange('purchasePrice', e.target.value)}
            placeholder="例如：7999.00"
            className={errors.purchasePrice ? 'error' : ''}
          />
          {errors.purchasePrice && <span className="error-msg">{errors.purchasePrice}</span>}
        </div>

        <div className="form-group">
          <label>购买日期</label>
          <input
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => handleChange('purchaseDate', e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
            取消
          </button>
          <button type="submit" className="submit-btn">
            保存修改
          </button>
        </div>
      </form>

      <BottomNav currentTab="home" />
    </div>
  );
}
