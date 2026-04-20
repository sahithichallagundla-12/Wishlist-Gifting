const asyncHandler = require('express-async-handler');
const Item = require('../models/itemModel');
const Wishlist = require('../models/wishlistModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const { extractProductImage } = require('../utils/extractImage');

// @desc    Add item to wishlist
// @route   POST /api/wishlists/:wishlistId/items
// @access  Private
const addItem = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findById(req.params.wishlistId);

    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    if (wishlist.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    // Validate required fields
    if (!req.body.name || !req.body.name.trim()) {
        res.status(400);
        throw new Error('Product name is required');
    }

    // Basic URL format validation if provided
    if (req.body.productLink && req.body.productLink.trim()) {
        try {
            new URL(req.body.productLink);
        } catch (_) {
            res.status(400);
            throw new Error('Product URL must be a valid URL (e.g. https://example.com)');
        }
    }

    // Attempt to dynamically scrape image or generate one if scraping fails
    const extractedImageUrl = await extractProductImage(req.body.productLink, req.body.name);

    const item = await Item.create({
        wishlistId: req.params.wishlistId,
        name: req.body.name,
        productLink: req.body.productLink || '',
        description: req.body.description,
        imageUrl: extractedImageUrl
    });

    res.status(201).json(item);
});

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    const wishlist = await Wishlist.findById(item.wishlistId);
    
    if (wishlist.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await item.deleteOne();

    res.status(200).json({ id: req.params.id });
});

// @desc    Reserve an item (Atomic update)
// @route   PUT /api/items/:id/reserve
// @access  Public (Guest mode allowed)
const reserveItem = asyncHandler(async (req, res) => {
    const { reservedBy } = req.body;

    if (!reservedBy) {
        res.status(400);
        throw new Error('Please provide a name for reservation');
    }

    // Atomic update: only update if status is 'available' to prevent duplicates
    const item = await Item.findOneAndUpdate(
        { _id: req.params.id, status: 'available' },
        { 
            $set: { 
                status: 'taken',
                reservedBy: reservedBy
            }
        },
        { returnDocument: 'after' }
    );

    if (!item) {
        res.status(400);
        throw new Error('Item is either already reserved or does not exist');
    }

    // Send email notification feature
    try {
        const wishlist = await Wishlist.findById(item.wishlistId);
        if (wishlist) {
            const owner = await User.findById(wishlist.userId);
            if (owner && owner.email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });
                
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: owner.email,
                    subject: `Gift Reserved: ${item.name}`,
                    text: `Hello ${owner.name},\n\nGood news! Someone named "${reservedBy}" just reserved "${item.name}" from your wishlist "${wishlist.title}".\n\nEnjoy!`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) console.log('Error sending email:', error);
                });
            }
        }
    } catch (e) {
        console.error('Failed to process email notification', e);
    }

    res.status(200).json(item);
});

module.exports = {
    addItem,
    deleteItem,
    reserveItem
};
