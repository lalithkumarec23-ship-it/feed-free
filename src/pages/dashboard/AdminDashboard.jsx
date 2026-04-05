import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Clock, CheckCircle, PlayCircle, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resFb, resStudents] = await Promise.all([
          authFetch('/api/feedbacks'),
          authFetch('/api/auth/clients')
        ]);
        
        if (resFb.ok) {
          const all = await resFb.json();
          setStats({
            total: all.length,
            pending: all.filter(f => f.status === 'pending').length,
            inProgress: all.filter(f => f.status === 'in-progress').length,
            resolved: all.filter(f => f.status === 'resolved').length
          });
        }

        if (resStudents.ok) {
          const data = await resStudents.json();
          setStudents(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="admin-theme" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar title="Overview" />
      <div className="main-content">
        <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Welcome, {user?.name || 'Admin'}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Here's what's happening with student exam feedback.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-card animate-slide-up" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ padding: '12px', background: 'rgba(255, 0, 127, 0.1)', borderRadius: '50%', marginBottom: '12px', color: 'var(--admin-accent)' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '28px', margin: 0, color: 'var(--admin-accent)', textShadow: 'var(--admin-glow)' }}>{stats.pending}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Pending</p>
          </div>
          
          <div className="glass-card animate-slide-up" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', animationDelay: '0.1s' }}>
            <div style={{ padding: '12px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '50%', marginBottom: '12px', color: '#00e5ff' }}>
              <PlayCircle size={24} />
            </div>
            <h3 style={{ fontSize: '28px', margin: 0, color: '#00e5ff' }}>{stats.inProgress}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>In Progress</p>
          </div>

          <div className="glass-card animate-slide-up" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', animationDelay: '0.2s' }}>
            <div style={{ padding: '12px', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '50%', marginBottom: '12px', color: 'var(--success)' }}>
              <CheckCircle size={24} />
            </div>
            <h3 style={{ fontSize: '28px', margin: 0, color: 'var(--success)' }}>{stats.resolved}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Resolved</p>
          </div>

          <div className="glass-card animate-slide-up" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', animationDelay: '0.3s' }}>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', marginBottom: '12px' }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '28px', margin: 0 }}>{stats.total}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Total</p>
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => navigate('/admin-feedback')}
          style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}
        >
          View All Feedback
        </button>

        <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Registered Users</h3>
        {students.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No users registered yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {students.map(client => (
              <div key={client.id} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '12px', background: 'rgba(0, 102, 255, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
                  <Users size={24} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{client.name}</h4>
                  <p style={{ margin: '0 0 2px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>{client.email}</p>
                  {client.phone && <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{client.phone}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}
