const jwt = require('jsonwebtoken');

const ScheduleModel = require("./schedule.model");
const SessionSchema = require("./schedule.model");
const UserModel = require("../user/user.model");

module.exports =  {
    async addToSchedule (req,res){
        try {
            if(!req.body.user) return res.status(400).send({'error':'User cannot be null'});
            if(!req.body.sessionDate) return res.status(400).send({'error':'Session Date cannot be null'});
            if(!req.body.startTime) return res.status(400).send({'error':'Start Time cannot be null'});
            if(!req.body.endTime) return res.status(400).send({'error':'End Time cannot be null'});

            const user = await UserModel.findOne({_id:req.body.user});

            if(!user){
                return res.status(404).send({'error':'User not found'});
            }

            const session = new SessionSchema();
            session.startTime = req.body.startTime;
            session.endTime = req.body.endTime;
            session.sessionDate = req.body.sessionDate;

            const mySessions = await ScheduleModel.findOne({user:req.body.user});

            //const entry = {"startTime":req.body.startTime, "endTime":req.body.endTime}

            if(mySessions){
                mySessions.session.push(endTime);

                await mySessions.save((err,doc)=>{
                    if(err){
                        return res.status(400).send({'error':err});
                    }
                    else{
                        return res.status(200).send({"success":"Session Created"});
                    }
                });
            }
            else {

                let thisSchedule = new ScheduleModel();
                thisSchedule.session = session;
                thisSchedule.user = req.body.user;

                await thisSchedule.save((err,doc)=>{
                    if(err){
                        return res.status(400).send({'error':err});
                    }
                    else{
                        return res.status(200).send({"success":"Schedule Created"});
                    }
                });
            }

        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getAllMySchedules(req,res){
        try {

            await ScheduleModel.find({user:req.query.id},(err, docs)=>{
                if(!err){
                    if (docs) return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('user', '_id name image phonenumber email');
        } catch (e) {
            return res.status(400).send({"error":e});
        }
    },

    async findOne(req,res){
        try {
            let {id} = req.params;
            await ScheduleModel.findOne(({_id: id}),(err, doc)=>{
                if(!err){
                    if (doc) res.status(200).send(doc);
                    else res.status(404).send({"error": "Schedule not found"});
                }
                else{
                    res.status(400).send({"error":err});
                }
            }).populate('user', '_id name image phonenumber email');
        } catch (e) {
            res.status(400).send({"error":e});
        }
    },

    async deleteOne(req,res){
        try {
            let {id} = req.params;
            ScheduleModel.findOne(({_id: id}),(err, doc)=>{
                if(!err){
                    if (!doc) return res.status(404).send("food not found");
                    try {
                        doc.remove((err, docs)=>{
                            if (!err){
                                return res.status(200).send("food deleted");
                            }
                            else{
                                return res.status(400).send({"error":err});
                            }
                        });
                    } catch (e) {
                        return res.status(400).send({"error":e});
                    }
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (e) {
            return res.status(400).send({"error":e});
        }
    },

    async update(req,res){
        try {
            let food = await ScheduleModel.find({user:req.params.id});
            if(!food) return res.status(404).send("food not found");

            if(!req.body.quantity) return res.status(400).send({"error":'Quantity is required'});

            food.quantity = req.body.quantity;

            await food.save((err,doc)=>{
                if(err){
                    return res.status(400).send({'error':err});
                }
                else{
                    return res.status(200).send({"success":"Added to cart"});
                }
            });
        } catch (e) {
            res.status(400).send({"error":e});
        }
    }
}