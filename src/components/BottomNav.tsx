import { Link } from 'react-router-dom';

interface BottomNavProps {
  currentTab: 'home' | 'categories' | 'stats';
}

export default function BottomNav({ currentTab }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${currentTab === 'home' ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        <span>首页</span>
      </Link>
      <Link to="/categories" className={`bottom-nav-item ${currentTab === 'categories' ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
        <span>分类</span>
      </Link>
      <Link to="/stats" className={`bottom-nav-item ${currentTab === 'stats' ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span>统计</span>
      </Link>
    </nav>
  );
}