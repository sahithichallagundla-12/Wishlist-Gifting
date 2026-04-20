const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/wishlistModel');
const Item = require('../models/itemModel');
const jwt = require('jsonwebtoken');

// @desc    Get user wishlists
// @route   GET /api/wishlists
// @access  Private
const getWishlists = asyncHandler(async (req, res) => {
    const wishlists = await Wishlist.find({ userId: req.user.id });
    res.status(200).json(wishlists);
});

// @desc    Get a single wishlist with items
// @route   GET /api/wishlists/:id
// @access  Public (if isPublic is true)
const getWishlistById = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findById(req.params.id).populate('userId', 'name');

    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    // Check if private
    if (!wishlist.isPublic) {
        let userId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (err) {}
        }

        if (!userId || wishlist.userId.toString() !== userId) {
            res.status(401);
            throw new Error('Not authorized to view this private wishlist');
        }
    }

    const items = await Item.find({ wishlistId: req.params.id });
    res.status(200).json({ wishlist, items });
});

// @desc    Create a wishlist
// @route   POST /api/wishlists
// @access  Private
const createWishlist = asyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400);
        throw new Error('Please add a text field');
    }

    const wishlist = await Wishlist.create({
        userId: req.user.id,
        title: req.body.title,
        description: req.body.description || '',
        eventDate: req.body.eventDate || null,
        isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true
    });

    res.status(201).json(wishlist);
});

// @desc    Update a wishlist
// @route   PUT /api/wishlists/:id
// @access  Private
const updateWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    if (wishlist.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedWishlist = await Wishlist.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after' }
    );

    res.status(200).json(updatedWishlist);
});

// @desc    Delete a wishlist
// @route   DELETE /api/wishlists/:id
// @access  Private
const deleteWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    if (wishlist.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await wishlist.deleteOne();
    // Also delete associated items
    await Item.deleteMany({ wishlistId: req.params.id });

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getWishlists,
    getWishlistById,
    createWishlist,
    updateWishlist,
    deleteWishlist
};
