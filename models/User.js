const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        default: null
        // required:true
    },
    password: {
        type: String,
        default: null
        // required:true
    },
    token: {
        type: String,
        default: null
        // required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
        // required:true
    },
    updatedAt: {
        type: Date,
        default: Date.now
        // required:true
    },

})

const userModal = mongoose.model('users', userSchema)

module.exports = userModal