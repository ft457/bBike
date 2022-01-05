const {validationResult} = require("express-validator");
const Bike = require("../models/bike");
const Review = require("../models/review");
const User = require("../models/user");

exports.getReviews = (req, res, next) => {
    Review.find().where({ratedOn: req.params.id})
        .then(reviews => {
            res.status(200).json(reviews);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.rateBike = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: "Validation error. Entered data is incorrect."});
    }

    const review = new Review({
        rating: req.body.rating,
        comment: req.body.comment,
        ratedBy: req.userId,
        ratedOn: req.params.id
    });

    let createdReview;

    User.findById(req.userId)
        .then(user => {
            review.name = user.name;
            return review.save();
        })
        .then(result => {
            createdReview = result;
            return Bike.findById(req.params.id);
        })
        .then(bike => {
            bike.reviews.push(createdReview);
            bike.rating = ((bike.rating*(bike.reviews.length-1)) + req.body.rating)/bike.reviews.length;
            return bike.save()
        })
        .then(() => {
            res.status(201).json({message: 'Review added successfully!', review: createdReview});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.editReview = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: "Validation error. Entered data is incorrect."});
    }

    Review.findById(req.params.id)
        .then(review => {
            if(!review){
                const error = new Error('Could not find review.');
                error.statusCode = 404;
                throw error;
            }

            return Review.findOneAndUpdate({_id: req.params.id}, {comment: req.body.comment});
        })
        .then(() => {
            res.status(200).json({message: 'Review edited successfully!'});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.deleteReview = (req, res, next) => {
    if(req.role === 'Manager'){

        let reviewDel;

        Review.findById(req.params.id)
            .then(review => {

                if(!review){
                    const error = new Error('Could not find review.');
                    error.statusCode = 404;
                    throw error;
                }

                reviewDel = review;

                return Review.deleteOne({_id: req.params.id})
            })
            .then(()=>{
                return Bike.findById(reviewDel.ratedOn);
            })
            .then(bike => {
                bike.reviews.pull(req.params.id);
                const updatedRating = ((bike.rating*(bike.reviews.length+1)) - reviewDel.rating)/bike.reviews.length;
                bike.rating = updatedRating ? updatedRating : 0;
                bike.save();
            })
            .then(() => {
                res.status(200).json({message: 'Review deleted successfully.'});
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