const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    incomingLinks: {
        type: []
    },
    outgoingLinks: {
        type: []
    }
})

module.exports = mongoose.model('personal', personalSchema);