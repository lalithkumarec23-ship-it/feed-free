import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const accentColor = isAdmin ? 'var(--admin-accent)' : 'var(--accent-color)';

  const activeStyle = {
    color: accentColor,
    filter: isAdmin ? 'drop-shadow(0 0 8px rgba(255, 0, 127, 0.5))' : 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.5))'
  };

  const dashboardRoute = isAdmin ? '/admin-dashboard' : '/client-dashboard';
  const profileRoute = isAdmin ? '/admin-profile' : '/client-profile';

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      margin: '0 auto',
      maxWidth: 'var(--mobile-max-width)',
      height: '80px',
      background: 'rgba(15, 17, 26, 0.9)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--glass-border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <NavItem 
        icon={<Home />} 
        label="Dashboard" 
        isActive={location.pathname === dashboardRoute} 
        onClick={() => navigate(dashboardRoute)} 
        activeStyle={activeStyle}
      />
      {isAdmin && (
        <NavItem 
          icon={<MessageCircle />} 
          label="All Feedback" 
          isActive={location.pathname === '/admin-feedback'} 
          onClick={() => navigate('/admin-feedback')} 
          activeStyle={activeStyle}
        />
      )}
      <NavItem 
        icon={<User />} 
        label="Profile" 
        isActive={location.pathname === profileRoute} 
        onClick={() => navigate(profileRoute)} 
        activeStyle={activeStyle}
      />
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick, activeStyle }) {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: isActive ? activeStyle.color : 'var(--text-secondary)',
        filter: isActive ? activeStyle.filter : 'none',
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.1)' : 'scale(1)'
      }}
    >
      <div style={{ marginBottom: '4px' }}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span style={{ fontSize: '12px', fontWeight: isActive ? 600 : 400 }}>{label}</span>
    </div>
  );
}
