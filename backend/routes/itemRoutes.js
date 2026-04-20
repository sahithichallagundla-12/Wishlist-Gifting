const express = require('express');
const router = express.Router();
const { deleteItem, reserveItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:id').delete(protect, deleteItem);
router.route('/:id/reserve').put(reserveItem);

module.exports = router;
