import React from 'react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import { useAuth } from '../../context/AuthContext';

export default function ClientProfile() {
  const { user } = useAuth();

  return (
    <>
      <TopBar title="Profile" />
      <div className="main-content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '24px', marginBottom: '40px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, var(--accent-color), #00b3cc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '16px'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Client Account</p>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email</label>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              {user.email}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Account ID</label>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontFamily: 'monospace' }}>
              {user.id}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
