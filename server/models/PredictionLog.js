const mongoose = require('mongoose');

const predictionLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    features: {
        type: [Number],
        required: true,
    },
    prediction: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const PredictionLog = mongoose.model('PredictionLog', predictionLogSchema);

module.exports = PredictionLog;
