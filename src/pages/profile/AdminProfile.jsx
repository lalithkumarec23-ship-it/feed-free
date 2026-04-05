import React from 'react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import { useAuth } from '../../context/AuthContext';
import { Shield } from 'lucide-react';

export default function AdminProfile() {
  const { user, authFetch } = useAuth();

  return (
    <div className="admin-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Admin Profile" />
      <div className="main-content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '24px', marginBottom: '40px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, var(--admin-accent), #8a2be2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: 'var(--admin-glow)'
          }}>
            <Shield size={48} color="#fff" />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>{user?.name || 'Administrator'}</h2>
          <p style={{ color: 'var(--admin-accent)' }}>System Admin</p>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Admin Email</label>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              {user?.email}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Clear System Data</label>
            <button 
              className="btn-glass" 
              style={{ width: '100%', borderColor: 'rgba(255,0,127,0.5)', color: 'var(--admin-accent)' }}
              onClick={async () => {
                if(window.confirm('Are you sure you want to clear all feedback data in the database? This cannot be undone.')){
                  await authFetch('/api/feedbacks', { method: 'DELETE' });
                  window.location.reload();
                }
              }}
            >
              Reset All Feedback
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
