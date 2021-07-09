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

sessionRouter.route('/booked/doctor')
    .get(protect, authorize('admin','doctor'),sessionController.getMyBookedSessions);

sessionRouter.route('/history/doctor')
    .get(protect, authorize('admin','doctor'),sessionController.doctorSessionHistory);

sessionRouter.route('/patient/:id')
    .put(protect, sessionController.cancelSession);

sessionRouter.route('/mine/:patient')
    .get(protect, sessionController.findAllMySessions);

sessionRouter.route('/date/mine')
    .get(protect, sessionController.findAllTodaySession);

sessionRouter.route('/reschedule/:id')
.put(protect, authorize('admin','doctor'), sessionController.rescheduleSession);
