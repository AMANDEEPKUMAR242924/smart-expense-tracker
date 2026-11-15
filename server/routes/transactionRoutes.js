const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Saare routes protected hain (login zaroori hai)
router.use(authMiddleware);

// Get all transactions (with optional type & category filter)
router.get('/', async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = { userId: req.userId };

    if (type) filter.type = type;
    if (category) filter.category = category;

    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new transaction
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;