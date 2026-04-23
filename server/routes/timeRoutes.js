const express = require('express');
const router = express.Router();
const timeController = require('../controllers/timeController');
const requireAuth = require('../middleware/authMiddleware');

// Zastosowanie middleware autoryzacji do wszystkich poniższych tras
router.use(requireAuth);

// Definicja punktu końcowego API dla rejestracji zdarzeń
router.post('/register', timeController.registerEvent);
router.get('/history/:userId', timeController.getHistory);
router.get('/stats/:userId', timeController.getStats);
router.delete('/clear/:userId', timeController.clearHistory);

// Ustawienia
router.get('/settings/:userId', timeController.getSettings);
router.post('/settings', timeController.updateSettings);
router.post('/timesheet', timeController.saveTimesheet);

module.exports = router;