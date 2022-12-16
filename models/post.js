const { DateTime } = require('luxon')
const mongoose = require('mongoose')
const CommentSchema = require('./comment')

const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: { type: String, required: true, minLength: 1, maxLength: 100 },
    body: { type: String, required: true, minLength: 1 },
    timestamp: { type: String, required: true },
    db_timestamp: { type: Date, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment"}],
    published: { type: Boolean, required: true },
})

PostSchema.virtual("formatted_timestamp").get(function () {
    return DateTime.fromJSDate(this.timestamp).toFormat("MMMM d yyyy", " h:mm a")
})

module.exports = mongoose.model("Post", PostSchema)