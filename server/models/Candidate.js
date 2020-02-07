const mongoose = require("mongoose");

const CandidateSchema = mongoose.Schema({
  constituencyId: {
    type: Number,
    required: true
  },
  candidateId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  partyId: {
    type: String,
    required: true
  },
  debates: {
    noOfDebates: Number,
    description: String
  },
  promises: {
    made: [String],
    held: [String],
    description: String
  },
  fundutilisation: {
    sanctioned: Number,
    used: Number
  },
  criminalrecord: {
    noCases: Number,
    description: String
  },
  photo: String
});

module.exports = Candidate = mongoose.model(
  "candidate",
  CandidateSchema,
  "candidate"
);
