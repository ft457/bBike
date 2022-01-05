const express = require('express');
const {body} = require('express-validator');

const bikesController = require('../controllers/bike');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/bikes', bikesController.getBikes);

router.post('/bike', isAuth, [
    body('model').trim().not().isEmpty(),
    body('color').trim().not().isEmpty(),
    body('location').trim().not().isEmpty()
], bikesController.postBike);

router.get('/bike/:id', bikesController.getBike);

router.put('/bike/:id', isAuth, [
    body('model').trim().not().isEmpty(),
    body('color').trim().not().isEmpty(),
    body('location').trim().not().isEmpty()
], bikesController.editBike);

router.delete('/bike/:id', isAuth, bikesController.deleteBike);

module.exports = router;