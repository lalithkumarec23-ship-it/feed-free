import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import { useAuth } from '../../context/AuthContext';
import { Send, Clock, CheckCircle, AlertTriangle, PlayCircle, LogOut } from 'lucide-react';

export default function AdminFeedback() {
  const { authFetch } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
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
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await authFetch(`/api/feedbacks/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: newStatus } : f));
      }
    } catch (err) {
      console.error(err);
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
        setFeedbacks(prev => prev.map(f => {
          if (f.id === id) {
            return { ...f, replies: [...(f.replies || []), data] };
          }
          return f;
        }));
        setActiveReply(null);
        setReplyText('');
      } else {
        console.error("Backend error:", data.error);
      }
    } catch (err) {
      console.error("Network or parsing error:", err);
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
    <div className="admin-theme" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar title="Student Exam Feedback" />
      <div className="main-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {feedbacks.length === 0 ? (
           <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
             <p style={{ color: 'var(--text-secondary)' }}>No feedback submitted yet.</p>
           </div>
          ) : (
            feedbacks.map(f => (
              <div key={f.id} className="glass-card animate-slide-up" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '18px', margin: 0, marginBottom: '4px' }}>{f.subjectName}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>From: {f.clientName}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    {getStatusIcon(f.status)}
                    <select 
                      value={f.status} 
                      onChange={(e) => handleStatusChange(f.id, e.target.value)}
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        border: '1px solid var(--glass-border)',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 8px 0' }}><strong style={{ color: '#fff' }}>Difficulty Rating:</strong> {f.difficultyRating} / 5</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong style={{ color: '#fff' }}>Out of Syllabus:</strong> {f.outOfSyllabus}</p>
                  <p style={{ margin: 0 }}><strong style={{ color: '#fff' }}>General Feedback:</strong> {f.generalFeedback}</p>
                </div>

                {/* Legacy Reply Handling for backwards compat if needed */}
                {f.adminReply && (!f.replies || f.replies.length === 0) && (
                   <div style={{ padding: '12px', background: 'rgba(255,0,127,0.1)', borderRadius: '12px', borderLeft: '4px solid var(--admin-accent)', marginBottom: '16px' }}>
                     <p style={{ fontSize: '12px', color: 'var(--admin-accent)', marginBottom: '4px', fontWeight: 600 }}>Legacy Admin Reply:</p>
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
                        borderRight: r.senderRole === 'admin' ? '4px solid var(--admin-accent)' : 'none',
                        borderLeft: r.senderRole === 'client' ? '4px solid var(--accent-color)' : 'none',
                        alignSelf: r.senderRole === 'admin' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%'
                      }}>
                        <p style={{ fontSize: '12px', color: r.senderRole === 'admin' ? 'var(--admin-accent)' : 'var(--accent-color)', marginBottom: '4px', fontWeight: 600 }}>
                          {r.senderName} ({r.senderRole})
                        </p>
                        <p style={{ margin: 0, fontSize: '14px' }}>{r.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeReply !== f.id && (
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
    </div>
  );
}
