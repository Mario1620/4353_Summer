const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quoteSchema = new Schema({
    quantity: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    delivery: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Quote = mongoose.model('Quote', quoteSchema);
module.exports = Quote;