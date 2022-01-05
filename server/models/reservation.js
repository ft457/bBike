const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    reservedBike: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bike',
        required: true
    },
    reservedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    reservedFrom: {
        type: 'String',
        required: true
    },
    reservedTo: {
        type: 'String',
        required: true
    },
    name: {
        type: 'String',
        required: true
    },
    model: {
        type: 'String',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Reservation', reservationSchema);