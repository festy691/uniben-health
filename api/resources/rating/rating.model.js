const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let RatingSchema = new mongoose.Schema({
    rating : {
        type : Number,
        required : true
    },
    message : {
        type : String,
        required : true
    },
    item : {
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
});

RatingSchema.plugin(mongosePaginate);
module.exports = mongoose.model("Rating", RatingSchema);