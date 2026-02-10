const axios = require('axios'); // Wait, I didn't install axios. usage of fetch is better or I install axios. 
// I will use fetch.

const PredictionLog = require('../models/PredictionLog');

// @desc    Make a prediction
// @route   POST /api/predict
// @access  Private
const makePrediction = async (req, res) => {
    const { features } = req.body;

    if (!features || !Array.isArray(features)) {
        return res.status(400).json({ message: 'Invalid features format' });
    }

    try {
        // Call ML API
        const response = await fetch(process.env.ML_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ features }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'ML API Error');
        }

        const data = await response.json();
        const prediction = data.prediction;

        // Log to MongoDB
        await PredictionLog.create({
            userId: req.user._id,
            features,
            prediction,
        });

        res.json({ prediction });
    } catch (error) {
        console.error('Prediction Error:', error.message);
        res.status(500).json({ message: 'Prediction service failed' });
    }
};

// @desc    Get user's prediction history
// @route   GET /api/predict/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const logs = await PredictionLog.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { makePrediction, getHistory };
