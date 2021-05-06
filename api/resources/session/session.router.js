const express = require('express');
const sessionController = require('./session.controller');
const upload = require('../../../config/multer');
const { protect, authorize } = require('../user/auth');

const sessionRouter = express.Router();
module.exports = sessionRouter;

sessionRouter.route('/')
    .post(protect, authorize('admin','doctor'), upload.single('image'),sessionController.addToSession)
    .get(protect, authorize('admin','doctor'), sessionController.getMySessions);

sessionRouter.route('/:id')
    .get(protect, sessionController.findOneSession)
    .put(protect, sessionController.bookSession)
    .delete(protect, authorize('admin','doctor'), sessionController.deleteOneSession);

sessionRouter.route('/paginate/sessions')
    .get(protect, authorize('admin','doctor'),sessionController.findAllPaginate);

sessionRouter.route('/patient/:id')
    .put(protect, sessionController.cancelSession);

sessionRouter.route('/mine/:patient')
    .get(protect, sessionController.findAllMySessions);

sessionRouter.route('/today/:date')
    .get(protect, sessionController.findAllTodaySession);