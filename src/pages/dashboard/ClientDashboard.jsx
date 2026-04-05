import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import { useAuth } from '../../context/AuthContext';
import { Plus, Clock, CheckCircle, AlertTriangle, PlayCircle, Send } from 'lucide-react';

export default function ClientDashboard() {
  const { user, authFetch } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ title: '', description: '' });
  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const res = await authFetch('/api/feedbacks');
      const data = await res.json();
      if (res.ok) setFeedbacks(data);
    } catch (err) {
      console.error('Failed to fetch feedback', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFeedback.title || !newFeedback.description) return;

    try {
      const res = await authFetch('/api/feedbacks', {
        method: 'POST',
        body: JSON.stringify(newFeedback)
      });
      const data = await res.json();
      
      if (res.ok) {
        setFeedbacks([data, ...feedbacks]);
        setShowForm(false);
        setNewFeedback({ title: '', description: '' });
      }
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      const res = await authFetch(`/api/feedbacks/${id}/replies`, {
        method: 'POST',
        body: JSON.stringify({ message: replyText })
      });
      const data = await res.json();

      if (res.ok) {
        setFeedbacks(feedbacks.map(f => {
          if (f.id === id) {
            return { ...f, replies: [...(f.replies || []), data] };
          }
          return f;
        }));
        setActiveReply(null);
        setReplyText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--warning)', background: 'rgba(255, 179, 0, 0.1)', padding: '4px 8px', borderRadius: '12px' }}><Clock size={12} /> Pending</span>;
      case 'in-progress': return <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#00e5ff', background: 'rgba(0, 229, 255, 0.1)', padding: '4px 8px', borderRadius: '12px' }}><PlayCircle size={12} /> In Progress</span>;
      case 'resolved': return <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--success)', background: 'rgba(0, 255, 136, 0.1)', padding: '4px 8px', borderRadius: '12px' }}><CheckCircle size={12} /> Resolved</span>;
      case 'rejected': return <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ff3333', background: 'rgba(255, 51, 51, 0.1)', padding: '4px 8px', borderRadius: '12px' }}><AlertTriangle size={12} /> Rejected</span>;
      default: return null;
    }
  };

  return (
    <>
      <TopBar title="My Feedback" />
      <div className="main-content">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Hello, {user?.name?.split(' ')[0]}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>How can we improve today?</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{
              background: 'var(--accent-color)',
              color: '#000',
              border: 'none',
              width: '48px',
              height: '48px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--accent-glow)',
              cursor: 'pointer'
            }}
          >
            <Plus size={24} style={{ transform: showForm ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
          </button>
        </div>

        {showForm && (
          <div className="glass-card animate-slide-up" style={{ padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Submit Feedback</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                placeholder="Title (e.g., App Feedback)" 
                value={newFeedback.title}
                onChange={e => setNewFeedback({ ...newFeedback, title: e.target.value })}
              />
              <textarea 
                placeholder="Describe your feedback..."
                rows={4}
                value={newFeedback.description}
                onChange={e => setNewFeedback({ ...newFeedback, description: e.target.value })}
              />
              <button className="btn-primary" type="submit">Submit Feedback</button>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Recent Submissions</h3>
          {feedbacks.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No feedback submitted yet.</p>
            </div>
          ) : (
            feedbacks.map(f => (
              <div key={f.id} className="glass-card animate-slide-up" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '18px', margin: 0 }}>{f.title}</h4>
                  {getStatusIcon(f.status)}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, margin: '0', marginBottom: '16px' }}>
                  {f.description}
                </p>

                {/* Legacy support */}
                {f.adminReply && (!f.replies || f.replies.length === 0) && (
                  <div style={{ padding: '12px', background: 'rgba(255,0,127,0.1)', borderRadius: '12px', borderLeft: '4px solid var(--admin-accent)', marginBottom: '16px' }}>
                     <p style={{ fontSize: '12px', color: 'var(--admin-accent)', marginBottom: '4px', fontWeight: 600 }}>Admin Reply:</p>
                     <p style={{ margin: 0, fontSize: '14px' }}>{f.adminReply}</p>
                  </div>
                )}

                {/* Threaded Replies */}
                {f.replies && f.replies.length > 0 && (
                  <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {f.replies.map(r => (
                      <div key={r.id} style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: r.senderRole === 'admin' ? 'rgba(255,0,127,0.1)' : 'rgba(0, 229, 255,0.1)',
                        borderLeft: `4px solid ${r.senderRole === 'admin' ? 'var(--admin-accent)' : 'var(--accent-color)'}`,
                        alignSelf: r.senderRole === 'client' ? 'flex-end' : 'flex-start',
                        width: '90%'
                      }}>
                        <p style={{ fontSize: '12px', color: r.senderRole === 'admin' ? 'var(--admin-accent)' : 'var(--accent-color)', marginBottom: '4px', fontWeight: 600 }}>
                          {r.senderName} {r.senderRole === 'admin' ? '(Admin)' : ''}
                        </p>
                        <p style={{ margin: 0, fontSize: '14px' }}>{r.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {f.status !== 'resolved' && f.status !== 'rejected' && activeReply !== f.id && (
                  <button onClick={() => setActiveReply(f.id)} className="btn-glass" style={{ width: '100%', fontSize: '14px', padding: '8px' }}>
                    Reply to Thread
                  </button>
                )}

                {activeReply === f.id && (
                  <div className="animate-fade-in" style={{ marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
                    <textarea 
                      placeholder="Write your response..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={3}
                      style={{ marginBottom: '12px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setActiveReply(null)} className="btn-glass" style={{ flex: 1 }}>
                        Cancel
                      </button>
                      <button onClick={() => handleReply(f.id)} className="btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <Send size={16} /> Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
