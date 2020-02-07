const mongoose = require('mongoose');

const AadhaarUserSchema = mongoose.Schema({
    aadhaarNumber: {
        type: Number,
        required: true
    },
    constituencyId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        max: '2002-02-01'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    address: {
        type: String
    },
    fingerprint: {
        type: Number,
        required: true
    },
    retinal: {
        type: Number,
        required: true
    }
});

module.exports = AadhaarUser = mongoose.model('aadhaaruser', AadhaarUserSchema);
