import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Shield } from 'lucide-react';

export default function AdminAuth() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const res = await login(formData.email, formData.password, 'admin');
    if (res.success) navigate('/admin-dashboard');
    else setError(res.error);
  };

  return (
    <div className="admin-theme" style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <button 
        className="btn-glass" 
        onClick={() => navigate('/')}
        style={{ padding: '8px', width: 'fit-content', marginBottom: '32px', borderRadius: '50%' }}
      >
        <ArrowLeft size={24} />
      </button>

      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          background: 'var(--admin-accent)', 
          padding: '12px', 
          borderRadius: '16px',
          boxShadow: 'var(--admin-glow)'
        }}>
          <Shield size={32} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '4px' }}>Admin Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to manage feedback</p>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Admin Email</label>
            <input 
              type="email" 
              placeholder="admin@app.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div style={{ padding: '12px', background: 'rgba(255,0,127,0.1)', borderRadius: '12px', border: '1px solid rgba(255,0,127,0.2)'}}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              <strong>Demo Hint:</strong> Use <code>admin@app.com</code> / <code>admin</code> to sign in as Super Admin.
            </p>
          </div>

          {error && <p style={{ color: 'var(--admin-accent)', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            Access Portal
          </button>
        </form>
      </div>
    </div>
  );
}
