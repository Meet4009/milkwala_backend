const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
    customerID:{
        type:String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type:Number,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    address:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['customer', 'admin'],
        default: 'user'
    },
    update_At:{
        type: Date,
        default: Date.now
    },
    created_At: {
        type: Date,
        default: Date.now
    },
});

customerSchema.pre('save', async function(next) {
    if (this.isNew) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

customerSchema.pre('save', function(next) {
    this.update_At = Date.now();
    next();
});

module.exports = mongoose.model('customer', customerSchema);

