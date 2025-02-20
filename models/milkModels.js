const mongoose = require('mongoose')

const milkSchema = new mongoose.Schema({
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true,
    },
    buyerID: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
        default: 50,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    update_At: {
        type: Date,
        default: Date.now
    },
    created_At: {
        type: Date,
        default: Date.now
    },
});

milkSchema.pre('save', function (next) {
    this.update_At = Date.now();
    next();
});

module.exports = mongoose.model('milk', milkSchema);

