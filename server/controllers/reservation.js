const Reservation = require('../models/reservation');
const Bike = require("../models/bike");
const User = require('../models/user');

exports.getReservations = (req, res, next) => {
    if(req.role === 'Manager'){
        Reservation.find()
            .then(reservations => {
                res.status(200).send(reservations);
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    }
    else {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
}

exports.postReservation = (req, res, next) => {

    let reservedBike;

    Bike.findById(req.body.reservedBike)
        .then(bike => {

            if(!bike){
                const error = new Error('Could not find bike.');
                error.statusCode = 404;
                throw error;
            }

            if(bike.reservedBy){
                const error = new Error("Can't reserve bike");
                error.statusCode = 500;
                throw error;
            }

            reservedBike = bike;

            bike.reservedBy = req.userId;
            bike.bookedFrom = req.body.reservedFrom;
            bike.bookedTo = req.body.reservedTo;
            return bike.save();
        })
        .then(() => {
            return User.findById(req.userId)
        })
        .then(user => {

            const reservation = new Reservation({
                reservedBike: req.body.reservedBike,
                reservedBy: req.userId,
                name: user.name,
                model: reservedBike.model,
                reservedFrom: req.body.reservedFrom,
                reservedTo: req.body.reservedTo
            });

            return reservation.save();
        })
        .then(reservation => {
            res.status(200).json({message: 'Bike reserved successfully!', reservation: reservation});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.cancelReservation = (req, res, next) => {

    let deletedReservation;

    Reservation.findOne({reservedBike: req.params.id})
        .then(reservation => {
            if(!reservation){
                const error = new Error('Could not find reservation.');
                error.statusCode = 404;
                throw error;
            }

            deletedReservation = reservation;

            if(reservation.reservedBy !== reservation.reservedBy){
                const error = new Error('Not authenticated.');
                error.statusCode = 404;
                throw error;
            }

            return Reservation.deleteOne({_id: reservation._id})
        })
        .then(() => {
            return Bike.findById(deletedReservation.reservedBike)
        })
        .then(bike => {
            bike.bookedFrom = undefined;
            bike.bookedTo = undefined;
            bike.reservedBy  = undefined;
            return bike.save()
        })
        .then(() => {
            res.status(200).json({message: 'Bike reservation cancelled!'});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}