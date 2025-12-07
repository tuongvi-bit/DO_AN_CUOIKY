const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const authMiddleware = require('../middleware/authMiddleware'); 

// GET /api/data/dashboard (API này yêu cầu phải đăng nhập)
router.get('/dashboard', authMiddleware, dataController.getDashboardData);

module.exports = router;