const Bike = require('../models/bike');
const Review = require('../models/review');
const {validationResult} = require('express-validator');
const path = require("path");
const fs = require("fs");

exports.getBikes = (req, res, next) => {

    Bike.find()
        .then(bikes => {

            const availableBikes = bikes.map(bike => {
                return {
                    _id: bike._id,
                    model: bike.model,
                    imageUrl: bike.imageUrl,
                    color: bike.color,
                    location: bike.location,
                    bookedFrom: bike.bookedFrom,
                    bookedTo: bike.bookedTo,
                    owner: bike.owner,
                    reviews: bike.reviews,
                    rating: bike.rating,
                    reservedBy: bike.reservedBy,
                    available: !bike.reservedBy
                }
            });

            res.status(200).json(availableBikes);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.postBike = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({message: "Validation error. Entered data is incorrect."});
    }

    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }

    if (req.role === 'Manager') {

        const bike = new Bike({
            model: req.body.model,
            imageUrl: req.file.path,
            color: req.body.color,
            location: req.body.location,
            owner: req.userId,
            rating: 0
        });

        bike.save()
            .then(bike => {
                res.status(201).json({message: 'Bike added successfully!', bike: bike});
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    } else {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
}

exports.getBike = (req, res, next) => {
    Bike.findById(req.params.id)
        .then(bike => {
            if (!bike) {
                const error = new Error('Could not find bike.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                _id: bike._id,
                model: bike.model,
                imageUrl: bike.imageUrl,
                color: bike.color,
                location: bike.location,
                bookedFrom: bike.bookedFrom,
                bookedTo: bike.bookedTo,
                owner: bike.owner,
                reviews: bike.reviews,
                rating: bike.rating,
                reservedBy: bike.reservedBy,
                available: !bike.reservedBy
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.editBike = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({message: "Validation error. Entered data is incorrect."});
    }

    if (req.role === 'Manager') {
        Bike.findById(req.params.id)
            .then(bike => {
                if (!bike) {
                    const error = new Error('Could not find bike.');
                    error.statusCode = 404;
                    throw error;
                }

                let file = bike.imageUrl;
                if (req.file) {
                    clearImage(bike.imageUrl);
                    file = req.file.path;
                }

                return Bike.findOneAndUpdate({_id: req.params.id}, {
                    model: req.body.model,
                    imageUrl: req.file.path,
                    color: req.body.color,
                    location: req.body.location
                });
            })
            .then(() => {
                res.status(200).json({message: 'Bike edited successfully!'});
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    } else {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
}

exports.deleteBike = (req, res, next) => {

    if (req.role === 'Manager') {
        Bike.findById(req.params.id)
            .then(bike => {
                if (!bike) {
                    const error = new Error('Could not find bike.');
                    error.statusCode = 404;
                    throw error;
                }

                clearImage(bike.imageUrl);
                return Bike.deleteOne({_id: req.params.id});
            })
            .then(() => {
                return Review.deleteMany({ratedOn: req.params.id})
            })
            .then(() => {
                res.status(200).json({message: 'Bike deleted successfully.'});
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    } else {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};