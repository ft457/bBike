const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    color: {
      type: String,
      required: true
    },
    location: {
        type: String,
        required: true
    },
    bookedFrom: {
        type: String
    },

    bookedTo: {
        type: String
    },
    reservedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Review'
    }],
    rating: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

module.exports = mongoose.model('Bike', bikeSchema);