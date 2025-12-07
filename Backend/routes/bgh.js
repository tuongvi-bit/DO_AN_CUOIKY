// routes/bgh.js

const express = require('express');
const router = express.Router();
const bghController = require('../controllers/bghController'); // <-- Import Controller

// ĐỊNH NGHĨA ROUTES CHO BGH
router.get('/', bghController.getAllBGH);         // GET /api/bgh
router.post('/', bghController.createBGH);       // POST /api/bgh
router.get('/:id', bghController.getBGHById);    // GET /api/bgh/:id
router.put('/:id', bghController.updateBGH);     // PUT /api/bgh/:id
router.delete('/:id', bghController.deleteBGH);  // DELETE /api/bgh/:id

module.exports = router;