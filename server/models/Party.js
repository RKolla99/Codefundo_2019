const mongoose = require('mongoose');

const PartySchema = new mongoose.Schema({
    partyId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    acronym: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    founded: {
        type: Number
    },
    founders: {
        type: [String]
    }
});

module.exports = Party = mongoose.model('party', PartySchema, 'party');
