const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET, authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, role, phone = '' } = req.body;
  
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row) return res.status(400).json({ error: 'User with this email already exists' });

      // Super admin hardcode check
      const actualRole = (email === 'admin@app.com') ? 'admin' : role;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = Date.now().toString();

      db.run('INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, name, email, hashedPassword, phone, actualRole],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          
          const userPayload = { id: userId, name, email, phone, role: actualRole };
          const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });
          res.status(201).json({ token, user: userPayload });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  // Pre-seed admin if trying to login with default credits
  if (email === 'admin@app.com' && password === 'admin' && role === 'admin') {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (!row) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        const adminId = 'admin-1';
        db.run('INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)', 
          [adminId, 'Super Admin', 'admin@app.com', hashedPassword, '', 'admin']);
      }
    });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    if (user.role !== role) return res.status(403).json({ error: 'Invalid role access' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const userPayload = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: userPayload });
  });
});

// Update Profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { name, email, phone, password } = req.body;
  const userId = req.user.id;
  
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  try {
    let updateQuery;
    let params;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery = 'UPDATE users SET name = ?, email = ?, phone = ?, password = ? WHERE id = ?';
      params = [name, email, phone || '', hashedPassword, userId];
    } else {
      updateQuery = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
      params = [name, email, phone || '', userId];
    }

    db.run(updateQuery, params, function(err) {
      if (err) return res.status(500).json({ error: 'Database update failed' });
      
      db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err || !row) return res.status(500).json({ error: 'Failed to fetch updated profile' });
        
        const userObj = { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role };
        const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ token, user: userObj });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all clients (Admin only)
const { verifyAdmin } = require('../middleware/authMiddleware');
router.get('/clients', authenticateToken, verifyAdmin, (req, res) => {
  db.all('SELECT id, name, email, phone FROM users WHERE role = ? ORDER BY name ASC', ['client'], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
