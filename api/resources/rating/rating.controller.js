const RatingModel = require("./rating.model");

module.exports =  {
    async createRating(req,res){
        try {
            let rating = new RatingModel();

            let data = req.body;

            if (!data.rating) return res.status(400).send({"error":"Rating is required"});
            if (!data.message) return res.status(400).send({"error":"Rating message is required"});
            if (!data.item) return res.status(400).send({"error":"Item is required"});
            if (!data.user) return res.status(400).send({"error":"User is required"});

            rating.rating = data.rating;
            rating.message = data.message;
            rating.item = data.item;
            rating.user = data.user;

            await rating.save((err, docs)=>{
                if (!err){
                    return res.status(200).send({"success":"Rating created"});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async updateRating(req,res){
        try {

            let data = req.body;

            const rating = await RatingModel.findOne({_id : req.params.id});

            if (!rating) return res.status(404).send({"error":'Rating not found'});

            if (data.rating) rating.rating = data.rating;
            if (data.message) rating.message = data.message;
            if (data.item) rating.item = data.item;
            if (data.user) rating.user = data.user;

            await rating.save((err, doc)=>{
                if (!err){
                    return res.status(200).send({"success":`updated`});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });

        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getOneRating(req,res){
        try {
            RatingModel.findOne(({_id : req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Rating not found"});
                    return res.status(200).send(doc);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getAllRatings(req,res){
        try {
            RatingModel.find((err, docs)=>{
                if(!err){
                    return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
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
            await RatingModel.paginate({},options,(err, docs)=>{
                if(!err){
                    if (docs) return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async deleteRating(req,res){
        try {
            RatingModel.findOne(({_id: req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc) return res.status(404).send({"error":"rating not found"});
                    doc.remove((err, docs)=>{
                        if (!err){
                            return res.status(200).send({"success":"Item deleted"});
                        }
                        else{
                            return res.status(400).send({"error":err});
                        }
                    });
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    }
}