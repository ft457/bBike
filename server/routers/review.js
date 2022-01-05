const express = require("express");
const {body} = require("express-validator");

const reviewsController = require("../controllers/review");
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/reviews/:id', reviewsController.getReviews);

router.post('/review/:id', isAuth, [
    body('rating').isFloat({ min: 0, max: 5 }),
    body('comment').trim().isLength({min: 5})
], reviewsController.rateBike);

router.put('/review/:id', isAuth, [
    body('comment').trim().isLength({min: 5})
], reviewsController.editReview);

router.delete('/review/:id', isAuth, reviewsController.deleteReview);

module.exports = router;