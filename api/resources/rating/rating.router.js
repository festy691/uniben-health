const express = require('express');
const ratingController = require('./rating.controller');
const upload = require('../../../config/multer');
const { protect, authorize } = require('../user/auth');

const ratingRouter = express.Router();
module.exports = ratingRouter;

ratingRouter.route('/')
    .post(protect, authorize('admin'), upload.single('image'),ratingController.createRating)
    .get(ratingController.getAllRatings);

ratingRouter.route('/:id')
    .put(protect, authorize('admin'), upload.single('image'), ratingController.updateRating)
    .get(ratingController.getOneRating)
    .delete(protect, authorize('admin'), ratingController.deleteRating);

ratingRouter.route('/paginate/ratings')
    .get(ratingController.findAllPaginate);