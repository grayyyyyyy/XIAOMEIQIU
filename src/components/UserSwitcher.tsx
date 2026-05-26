import { User } from '../types';
import './UserSwitcher.css';

interface UserSwitcherProps {
  currentUser: User;
  onSwitch: () => void;
}

export default function UserSwitcher({ currentUser, onSwitch }: UserSwitcherProps) {
  return (
    <button className="user-switcher" onClick={onSwitch}>
      <div
        className="user-avatar"
        style={{ backgroundColor: currentUser.color }}
      >
        {currentUser.name.charAt(0)}
      </div>
      <span className="user-name">{currentUser.name}</span>
      <svg className="switch-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16,18 22,12 16,6" />
        <polyline points="8,6 2,12 8,18" />
      </svg>
    </button>
  );
}
