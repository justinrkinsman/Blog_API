const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: { type: String, required: true, minLength: 1, maxLength: 100 },
    body: { type: String, required: true, minLength: 1 },
    timestamp: { type: Date, required: true },
    comments: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
    published: { type: Boolean, required: true },
})

module.exports = mongoose.model("Post", PostSchema)