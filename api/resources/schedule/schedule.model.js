const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

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
    date : {
        type : Date,
        default : Date.now()
    },
});

let ScheduleSchema = new mongoose.Schema({
    session : {
        type : [SessionSchema],
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
    }
});

ScheduleSchema.plugin(mongosePaginate);
module.exports = mongoose.model("Schedule", ScheduleSchema);