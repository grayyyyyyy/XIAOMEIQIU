import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Item, Category, calculateDailyAverage, formatCurrency } from '../types';
import BottomNav from '../components/BottomNav';
import '../pages/Stats.css';

interface StatsProps {
  items: Item[];
  categories: Category[];
  getCategoryName: (id: string) => string;
}

export default function Stats({ items, categories, getCategoryName }: StatsProps) {
  const [chartData, setChartData] = useState<Array<{
    name: string;
    value: number;
    color: string;
  }>>([]);

  const totalPurchaseValue = items.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalDailyAverage = items.reduce((sum, item) => sum + calculateDailyAverage(item), 0);

  useEffect(() => {
    const categoryDailyAverages: Record<string, number> = {};
    
    items.forEach(item => {
      const dailyAverage = calculateDailyAverage(item);
      if (!categoryDailyAverages[item.category]) {
        categoryDailyAverages[item.category] = 0;
      }
      categoryDailyAverages[item.category] += dailyAverage;
    });

    const data = Object.entries(categoryDailyAverages)
      .map(([categoryId, value]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          name: getCategoryName(categoryId),
          value: value,
          color: category?.color || '#95a5a6'
        };
      })
      .sort((a, b) => b.value - a.value);

    setChartData(data);
  }, [items, categories, getCategoryName]);

  return (
    <div className="stats-page">
      <header className="page-header">
        <h1 className="page-title">资产统计</h1>
      </header>

      <div className="stats-content">
        <div className="stats-summary">
          <div className="summary-card main">
            <span className="summary-label">总日均价格</span>
            <span className="summary-value">¥{formatCurrency(totalDailyAverage)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">购入总价</span>
            <span className="summary-value">¥{formatCurrency(totalPurchaseValue)}</span>
          </div>
        </div>

        <div className="chart-section">
          <h2 className="section-title">各类别日均价占比</h2>
          {chartData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={60}
                    tick={{ fontSize: 12, fill: '#7f8c8d' }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`¥${formatCurrency(value)}`, '日均价格']}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e8ecef',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {chartData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="legend-name">{item.name}</span>
                    <span className="legend-value">¥{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-chart">
              <p>暂无数据</p>
            </div>
          )}
        </div>

        <div className="category-breakdown">
          <h2 className="section-title">分类明细</h2>
          {categories.map(category => {
            const categoryItems = items.filter(item => item.category === category.id);
            const categoryPurchaseValue = categoryItems.reduce((sum, item) => sum + item.purchasePrice, 0);
            const categoryDailyAverage = categoryItems.reduce((sum, item) => sum + calculateDailyAverage(item), 0);

            return (
              <div key={category.id} className="category-stat-card">
                <div className="category-header">
                  <span
                    className="category-indicator"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="category-name">{category.name}</span>
                  <span className="item-count">{categoryItems.length}件</span>
                </div>
                <div className="category-stats">
                  <div className="stat-row">
                    <span className="stat-label">日均价</span>
                    <span className="stat-value accent">¥{formatCurrency(categoryDailyAverage)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">购入总价</span>
                    <span className="stat-value">¥{formatCurrency(categoryPurchaseValue)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav currentTab="stats" />
    </div>
  );
}
