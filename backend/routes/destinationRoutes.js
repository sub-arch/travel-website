const express = require('express');
const router = express.Router();
const { getAllDestinations, createDestination } = require('../controllers/destinationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllDestinations);
router.post('/', authMiddleware, createDestination);

module.exports = router;


