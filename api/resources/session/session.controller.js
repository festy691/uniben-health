const jwt = require('jsonwebtoken');

const SessionModel = require("./session.model");
const UserModel = require("../user/user.model");

module.exports =  {
    async addToSession (req,res){
        try {
            if(!req.body.user) return res.status(400).send({'error':'User cannot be null'});
            if(!req.body.sessionDate) return res.status(400).send({'error':'Session Date cannot be null'});
            if(!req.body.startTime) return res.status(400).send({'error':'Start Time cannot be null'});
            if(!req.body.endTime) return res.status(400).send({'error':'End Time cannot be null'});

            const user = await UserModel.findOne({_id:req.body.user});

            if(!user){
                return res.status(404).send({'error':'User not found'});
            }
            
            const oldSession = await SessionModel.find(
                {
                    user:req.body.user,
                    sessionDate:req.body.sessionDate
                });

            if(oldSession.length > 0){
                const data = req.body;
                const startTime = data.startTime;
                const endTime = data.endTime;

                for (let i=0; i<oldSession.length; i++){
                    if((getTime(oldSession[i].startTime) >= getTime(startTime)) && (getTime(oldSession[i].endTime) > getTime(startTime))){
                        return res.status(404).send({'error':'This time is not free'});
                    }
                    if((getTime(oldSession[i].startTime) <= getTime(endTime)) && (getTime(oldSession[i].endTime) >= getTime(endTime))){
                        return res.status(404).send({'error':'This time is not free'});
                    }
                }
            }

            const session = new SessionModel();
            session.startTime = req.body.startTime;
            session.endTime = req.body.endTime;
            session.sessionDate = req.body.sessionDate;
            session.user = req.body.user;

            await session.save((err,doc)=>{
                if(err){
                    return res.status(400).send({'error':err});
                }
                else{
                    return res.status(200).send({"success":"Session Created"});
                }
            });

        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async rescheduleSession (req,res){
        try {

            const sess = await UserModel.findOne({_id:req.body.user});

            if(!req.body.user) return res.status(400).send({'error':'User cannot be null'});
            if(!req.body.sessionDate) return res.status(400).send({'error':'Session Date cannot be null'});
            if(!req.body.startTime) return res.status(400).send({'error':'Start Time cannot be null'});
            if(!req.body.endTime) return res.status(400).send({'error':'End Time cannot be null'});

            if(!sess){
                return res.status(404).send({'error':'Session not found'});
            }

            const oldSession = await SessionModel.findOne(
                {
                    user:req.body.user,
                    sessionDate:req.body.sessionDate
                });

            if(oldSession.length > 0){
                const data = req.body;
                const startTime = data.startTime;
                const endTime = data.endTime;
                const getTime = time => new Date(2021,5,9, time.subString(0,2), time.subString(3,5), 0, 0);
                for (let i=0; i<oldSession.length; i++){
                    if((getTime(oldSession[i].startTime) >= getTime(startTime)) && (getTime(oldSession[i].endTime) > getTime(startTime))){
                        return res.status(404).send({'error':'This time is not free'});
                    }
                    if((getTime(oldSession[i].startTime) <= getTime(endTime)) && (getTime(oldSession[i].endTime) >= getTime(endTime))){
                        return res.status(404).send({'error':'This time is not free'});
                    }
                }
            }
            
            if (req.body.startTime) sess.startTime = req.body.startTime;
            if (req.body.startTime) sess.endTime = req.body.endTime;
            if (req.body.startTime) sess.sessionDate = req.body.sessionDate;
            if (req.body.startTime) sess.user = req.body.user;

            await sess.save((err,doc)=>{
                if(err){
                    return res.status(400).send({'error':err});
                }
                else{
                    return res.status(200).send({"success":"Session Rescheduled"});
                }
            });

        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getMySessions(req,res){
        try {
            var date = new Date();
            date.setHours(0,0,0,0);
            date = date.toISOString()

            console.log(date);
            await SessionModel.find({user:req.query.user, sessionDate: {$gte: date}},(err, docs)=>{
                if(!err){
                    if (docs) return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('user', '_id name image phonenumber email').populate('patient', '_id name image phonenumber email');
        } catch (e) {
            return res.status(400).send({"error":e});
        }
    },

    async findOneSession(req,res){
        try {
            let {id} = req.params;
            await SessionModel.findOne(({_id: id}),(err, doc)=>{
                if(!err){
                    if (doc) res.status(200).send(doc);
                    else res.status(404).send({"error": "Session not found"});
                }
                else{
                    res.status(400).send({"error":err});
                }
            }).populate('user', '_id name image phonenumber email').populate('patient', '_id name image phonenumber email');
        } catch (e) {
            res.status(400).send({"error":e});
        }
    },

    async findAllTodaySession(req,res){
        try {
            await SessionModel.find({user:req.query.user, date:req.query.date},(err, docs)=>{
                if(!err){
                    if (docs) return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('user', '_id name image phonenumber email').populate('patient', '_id name image phonenumber email');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async findAllMySessions(req,res){
        try {
            await SessionModel.find({patient:req.params.patient},(err, docs)=>{
                if(!err){
                    if (docs) return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('user', '_id name image phonenumber email').populate('patient', '_id name image phonenumber email');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async findAllPaginate(req,res){
        try {
            const {page,perPage} = req.query;
            const options = {
                page: parseInt(page,10) || 1,
                limit: parseInt(perPage,10) || 10,
                sort: {date: -1}
            }
            await SessionModel.paginate({},options,(err, docs)=>{
                if(!err){
                    if (docs) return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('user', '_id name image phonenumber email').populate('patient', '_id name image phonenumber email');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async bookSession(req,res){
        try {

            let data = req.body;
            if (!data.patient) return res.status(400).send({"error":'Patient cannot be null'});
            const session = await SessionModel.findOne({_id : req.params.id});

            if (!session) return res.status(404).send({"error":'Session not found'});

            session.patient = data.patient;
            session.availability = false;
            await session.save((err, doc)=>{
                if (!err){
                    return res.status(200).send({"success":`Session Booked`});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });

        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async cancelSession(req,res){
        try {

            let data = req.body;
            if (!data.patient) return res.status(400).send({"error":'Patient cannot be null'});
            const session = await SessionModel.findOne({_id : req.params.id, patient: data.patient});

            if (!session) return res.status(404).send({"error":'Session not found'});

            session.patient = null;
            session.availability = true;
            await session.save((err, doc)=>{
                if (!err){
                    return res.status(200).send({"success":`Session Canceled`});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });

        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async deleteOneSession(req,res){
        try {
            let {id} = req.params;
            const session = await SessionModel.findOne({_id:id});
            if (!session) return res.status(404).send({"error":"Session not found"});
            if(session.availability === false) return res.status(400).send({"error":"Session has already been booked, you can only reschedule it"});
            session.remove((err, docs)=>{                                                                                                                                           
                if (!err){
                    return res.status(200).send({"success":"Session Deleted"});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (e) {
            return res.status(400).send({"error":e});
        }
    },
}
function getTime(time) {
    console.log("time");
    return new Date("01/01/2000 "+time);
}