const express = require('express');
const userRouter  = require('./resources/user');
const imageRouter  = require('./resources/image');
const authRouter  = require('./resources/auth');
const ratingRouter  = require('./resources/rating');
const reportRouter  = require('./resources/report');
const sessionRouter  = require('./resources/session');

const restRouter = express.Router();

module.exports =  restRouter;

restRouter.use('/users', userRouter);
restRouter.use('/authenticate', authRouter);
restRouter.use('/images', imageRouter);
restRouter.use('/ratings', ratingRouter);
restRouter.use('/reports', reportRouter);
restRouter.use('/sessions', sessionRouter);