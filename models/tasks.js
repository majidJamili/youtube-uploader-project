const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String
    },
    time: {
        type: Number
    },
    types: {
        type: String
    },
    youtube_video_url: {
        type: String
    },
    video: [{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }]
})

const Task = mongoose.model('Task', taskSchema);
module.exports = Task; 