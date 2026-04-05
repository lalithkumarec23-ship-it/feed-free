import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 0 }}>
      {/* Hero Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <div className="animate-slide-up" style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--accent-color), #00b3cc)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '24px',
          boxShadow: 'var(--accent-glow)'
        }}>
          <MessageIcon />
        </div>
        
        <h1 className="animate-slide-up" style={{ fontSize: '32px', marginBottom: '16px', animationDelay: '0.1s' }}>
          Welcome to <span style={{ color: 'var(--accent-color)' }}>Nexus</span>
        </h1>
        <p className="animate-slide-up" style={{ color: 'var(--text-secondary)', fontSize: '18px', animationDelay: '0.2s', maxWidth: '300px' }}>
          The premium client feedback platform. Tell us how we're doing.
        </p>
      </div>

      {/* Action Section */}
      <div className="glass-card animate-slide-up" style={{ padding: '32px 24px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, animationDelay: '0.3s' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '24px', textAlign: 'center' }}>Choose your path</h2>
        
        <button 
          className="btn-primary" 
          onClick={() => navigate('/auth/client')}
          style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <User size={20} />
          I am a Client
        </button>

        <button 
          className="btn-glass admin-theme" 
          onClick={() => navigate('/auth/admin')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px' }}
        >
          <ShieldCheck size={20} />
          Log in as Admin
        </button>
      </div>
    </div>
  );
}

function MessageIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
