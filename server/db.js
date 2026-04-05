const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      phone TEXT,
      role TEXT
    )`);

    // Create Feedbacks table (Matching new mockup schema)
    db.run(`CREATE TABLE IF NOT EXISTS feedbacks (
      id TEXT PRIMARY KEY,
      clientId TEXT,
      clientName TEXT,
      difficultyRating INTEGER,
      subjectName TEXT,
      outOfSyllabus TEXT,
      generalFeedback TEXT,
      status TEXT DEFAULT 'pending',
      timestamp TEXT
    )`);

    // Create Replies table (Kept for threaded conversations)
    db.run(`CREATE TABLE IF NOT EXISTS replies (
      id TEXT PRIMARY KEY,
      feedbackId TEXT,
      senderRole TEXT,
      senderName TEXT,
      message TEXT,
      timestamp TEXT,
      FOREIGN KEY(feedbackId) REFERENCES feedbacks(id) ON DELETE CASCADE
    )`);
  }
});

module.exports = db;
