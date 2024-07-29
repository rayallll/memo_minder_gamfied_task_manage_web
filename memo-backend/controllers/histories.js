const express = require('express');
const router = express.Router();
const History = require('../models/history');

// Route to fetch history for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Find the history for the specified user
        const history = await History.findOne({ user: userId });
        
        if (!history) {
            return res.status(404).json({ message: 'History not found' });
        }

        res.status(200).json({ history });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;