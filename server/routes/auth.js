// auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const db = require('./db'); // your MySQL connection pool

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user from MySQL instead of dummy data (adjust this part to your DB)
    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid email' });

    const isMatch = await (password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err); // 👈 This will show actual error in terminal
    res.status(500).json({ message: 'Server error' });
  }
});


// Protected route
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email,phone FROM user WHERE id = ?', [req.userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ user: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
