const express = require('express');

const reservationController = require('../controllers/reservation');
const isAuth = require("../middleware/isAuth");
const {body} = require("express-validator");

const router = express.Router();

router.post('/reservation', isAuth, [
    body('reservedBike').not().isEmpty(),
    body('reservedFrom').not().isEmpty(),
    body('reservedTo').not().isEmpty()
], reservationController.postReservation);

router.delete('/reservation/:id', isAuth, reservationController.cancelReservation);

router.get('/reservations', isAuth, reservationController.getReservations);

module.exports = router;