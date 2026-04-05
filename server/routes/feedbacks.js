const express = require('express');
const db = require('../db');
const { authenticateToken, verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

function bundleFeedbacksWithReplies(res, feedbacksQuery, feedbacksParams = []) {
  db.all(feedbacksQuery, feedbacksParams, (err, feedbacks) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all('SELECT * FROM replies ORDER BY timestamp ASC', [], (err, replies) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const bundled = feedbacks.map(f => {
        return {
          ...f,
          replies: replies.filter(r => r.feedbackId === f.id).map(r => ({
            id: r.id,
            senderRole: r.senderRole,
            senderName: r.senderName,
            message: r.message,
            timestamp: r.timestamp
          }))
        };
      });
      res.json(bundled);
    });
  });
}

// GET all feedbacks
router.get('/', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    bundleFeedbacksWithReplies(res, 'SELECT * FROM feedbacks ORDER BY timestamp DESC');
  } else {
    bundleFeedbacksWithReplies(res, 'SELECT * FROM feedbacks WHERE clientId = ? ORDER BY timestamp DESC', [req.user.id]);
  }
});

// POST new feedback (Clients only)
router.post('/', authenticateToken, (req, res) => {
  const { difficultyRating, subjectName, outOfSyllabus, generalFeedback } = req.body;
  if (req.user.role !== 'client') return res.status(403).json({ error: 'Only students can post feedback' });
  
  if (!difficultyRating || !subjectName || !outOfSyllabus) {
    return res.status(400).json({ error: 'Difficulty rating and required fields are missing' });
  }

  const id = Date.now().toString();
  const timestamp = new Date().toISOString();

  db.run('INSERT INTO feedbacks (id, clientId, clientName, difficultyRating, subjectName, outOfSyllabus, generalFeedback, status, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, req.user.id, req.user.name, difficultyRating, subjectName, outOfSyllabus, generalFeedback, 'pending', timestamp],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      db.get('SELECT * FROM feedbacks WHERE id = ?', [id], (err, row) => {
        res.status(201).json({ ...row, replies: [] });
      });
    }
  );
});

// PUT update status (Admins only)
router.put('/:id/status', authenticateToken, verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: 'Status is required' });

  db.run('UPDATE feedbacks SET status = ? WHERE id = ?', [status, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, status });
    }
  );
});

// POST new reply
router.post('/:id/replies', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const replyId = Date.now().toString();
  const timestamp = new Date().toISOString();

  db.run('INSERT INTO replies (id, feedbackId, senderRole, senderName, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
    [replyId, id, req.user.role, req.user.name, message, timestamp],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      db.get('SELECT * FROM replies WHERE id = ?', [replyId], (err, row) => {
        res.status(201).json(row);
      });
    }
  );
});

// DELETE all feedbacks (Admin only - Reset System)
router.delete('/', authenticateToken, verifyAdmin, (req, res) => {
  db.run('DELETE FROM feedbacks', (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.run('DELETE FROM replies', (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'All feedback and replies cleared' });
    });
  });
});

module.exports = router;
