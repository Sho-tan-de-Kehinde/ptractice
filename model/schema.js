const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const formSchema = new Schema({
    username:{
        type: String,
        require: true,
    },
    password:{
        type: String,
        require: true,
    },
    location:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    },
}, {timestamp: true})
const Model = mongoose.model('practice', formSchema)
module.exports = Model;