const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, required: true, minLength: 1, maxLength: 100 },
    password: { type: String, required: true, minLength: 1, maxLength: 100 },
    admin: { type: Boolean },
})

module.exports = mongoose.model("User", UserSchema)