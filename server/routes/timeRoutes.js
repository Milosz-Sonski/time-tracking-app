const express = require('express');
const router = express.Router();
const timeController = require('../controllers/timeController');

// Definicja punktu końcowego API dla rejestracji zdarzeń
router.post('/register', timeController.registerEvent);
router.get('/history/:userId', timeController.getHistory);
router.delete('/clear/:userId', timeController.clearHistory);

module.exports = router;