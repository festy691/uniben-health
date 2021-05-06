const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

let SessionSchema = new mongoose.Schema({
    startTime : {
        type : Date,
        required : true
    },
    endTime : {
        type : Date,
        required : true
    },
    availability : {
        type : Boolean,
        default : true
    },
    sessionDate : {
        type : Date,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    patient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    date : {
        type : Date,
        default : Date.now()
    },
});

SessionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Session", SessionSchema);