const express = require('express');
const router = express.Router();
const {
    getWishlists,
    getWishlistById,
    createWishlist,
    updateWishlist,
    deleteWishlist
} = require('../controllers/wishlistController');
const { addItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Get all user wishlists + Create wishlist
router.route('/').get(protect, getWishlists).post(protect, createWishlist);

// Get specific wishlist (public allowed) + Update + Delete
router.route('/:id').get(getWishlistById).put(protect, updateWishlist).delete(protect, deleteWishlist);

// Add item to a wishlist
router.route('/:wishlistId/items').post(protect, addItem);

module.exports = router;
