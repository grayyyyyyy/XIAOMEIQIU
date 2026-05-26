import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser, authenticate, setCurrentUser, getRememberMe, setRememberMe, clearRememberMe } from '../storage';
import { User } from '../types';
import './Login.css';

interface LoginProps {
  onLogin: (user: User) => void;
  existingUsers: User[];
}

export default function Login({ onLogin, existingUsers }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMeChecked] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');

  useEffect(() => {
    const saved = getRememberMe();
    if (saved) {
      setUsername(saved.username);
      setPassword(saved.password);
      setRememberMeChecked(true);
    }
  }, []);

  const quickUsers = [
    { name: 'reals', color: '#FF6B9D', defaultPassword: '123456' },
    { name: 'gray', color: '#4ECDC4', defaultPassword: '123456' }
  ];

  const handleLogin = (user: User) => {
    setCurrentUser(user.id);
    
    if (rememberMe) {
      setRememberMe({ username: user.name, password: password });
    } else {
      clearRememberMe();
    }
    
    onLogin(user);
    navigate('/');
  };

  const handleQuickLogin = (name: string, color: string, defaultPwd: string) => {
    let user = authenticate(name, defaultPwd);
    if (!user) {
      user = addUser(name, defaultPwd, color);
    }
    setPassword(defaultPwd);
    setRememberMeChecked(true);
    handleLogin(user);
  };

  const validateLogin = () => {
    if (!username.trim()) {
      setError('请输入用户名');
      return false;
    }
    if (!password) {
      setError('请输入密码');
      return false;
    }
    setError('');
    return true;
  };

  const validateRegister = () => {
    if (!username.trim()) {
      setRegisterError('请输入用户名');
      return false;
    }
    if (!password) {
      setRegisterError('请输入密码');
      return false;
    }
    if (password.length < 6) {
      setRegisterError('密码长度至少6位');
      return false;
    }
    if (password !== confirmPassword) {
      setRegisterError('两次输入的密码不一致');
      return false;
    }
    setRegisterError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister) {
      if (!validateRegister()) return;

      const existingUser = existingUsers.find(u => u.name === username.trim());
      if (existingUser) {
        setRegisterError('用户名已存在');
        return;
      }

      const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newUser = addUser(username.trim(), password, randomColor);

      handleLogin(newUser);
    } else {
      if (!validateLogin()) return;

      const user = authenticate(username.trim(), password);
      if (!user) {
        setError('用户名或密码错误');
        return;
      }

      handleLogin(user);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>记物</h1>
          <p>极简个人物品管理</p>
        </div>

        <div className="quick-login">
          <h2>快速登录</h2>
          <div className="quick-buttons">
            {quickUsers.map(user => (
              <button
                key={user.name}
                className="quick-btn"
                style={{
                  backgroundColor: user.color,
                  borderColor: user.color
                }}
                onClick={() => handleQuickLogin(user.name, user.color, user.defaultPassword)}
              >
                {user.name}
              </button>
            ))}
          </div>
          <p className="quick-hint">默认密码: 123456</p>
        </div>

        <div className="divider">
          <span>或者</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
                setRegisterError('');
              }}
              placeholder="请输入用户名"
              className={error || registerError ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
                setRegisterError('');
              }}
              placeholder="请输入密码"
              className={error || registerError ? 'error' : ''}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setRegisterError('');
                }}
                placeholder="请再次输入密码"
                className={registerError ? 'error' : ''}
              />
            </div>
          )}

          {!isRegister && (
            <div className="remember-me">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMeChecked(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span>记住密码</span>
              </label>
            </div>
          )}

          {(error || registerError) && (
            <span className="error-msg">{error || registerError}</span>
          )}

          <button type="submit" className="login-btn">
            {isRegister ? '注册并登录' : '登录'}
          </button>
        </form>

        <div className="toggle-form">
          <span>
            {isRegister ? '已有账号？' : '还没有账号？'}
            <button type="button" className="toggle-btn" onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setRegisterError('');
              setConfirmPassword('');
            }}>
              {isRegister ? '立即登录' : '立即注册'}
            </button>
          </span>
        </div>

        {existingUsers.length > 0 && !isRegister && (
          <div className="existing-users">
            <h3>已有用户</h3>
            <div className="user-list">
              {existingUsers.map(user => (
                <button
                  key={user.id}
                  className="user-chip"
                  style={{
                    backgroundColor: user.color + '20',
                    color: user.color,
                    borderColor: user.color
                  }}
                  onClick={() => setUsername(user.name)}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
