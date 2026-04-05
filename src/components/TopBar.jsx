import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(15, 17, 26, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)'
    }} className={isAdmin ? 'admin-theme' : ''}>
      <h2 style={{ 
        margin: 0, 
        fontSize: '20px',
        background: isAdmin ? 'linear-gradient(to right, #fff, #ff007f)' : 'linear-gradient(to right, #fff, #00e5ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {title}
      </h2>
      {user && (
        <button 
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <LogOut size={20} />
        </button>
      )}
    </div>
  );
}
