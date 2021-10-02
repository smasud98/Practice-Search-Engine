const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    incomingLinks: {
        type: [],
        default: []
    },
    outgoingLinks: {
        type: [],
        default: []
    },
    text: {
        type: String
    }
})

module.exports = mongoose.model('fruits', fruitSchema);