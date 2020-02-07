const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const validator = require("express-joi-validation").createValidator({});

const Candidate = require("../models/Candidate");

// Route: /api/candidate

// Insert candidate

const insertUserSchema = Joi.object().keys({
  constituencyId: Joi.number().required(),
  candidateId: Joi.number().required(),
  name: Joi.string().required(),
  partyId: Joi.number().required(),
  debates: Joi.object().keys({
    noOfDebates: Joi.number(),
    description: Joi.string()
  }),
  promises: Joi.object().keys({
    made: Joi.array(),
    held: Joi.array(),
    description: Joi.string()
  }),
  fundutilisation: Joi.object().keys({
    sanctioned: Joi.number(),
    used: Joi.number()
  }),
  criminalrecord: Joi.object().keys({
    noCases: Joi.number(),
    description: Joi.string()
  }),
  photo: Joi.string()
});

router.put("/", validator.body(insertUserSchema), async (req, res) => {
  const { candidateId } = req.body;

  try {
    const check = await Candidate.findOne({ candidateId });

    if (!check) {
      let candidate = Candidate(req.body);

      await candidate.save();
      return res.status(201).send();
    } else {
      return res.status(400).send("CandidateId already taken");
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// Get candidate information

router.get("/:candidateId", async (req, res) => {
  const { candidateId } = req.params;

  try {
    let check = await Candidate.findOne({ candidateId });

    if (check) {
      return res.status(200).json(check);
    } else {
      return res.status(400).send("Candidate not found");
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// Get candidates belonging to a particular constituency
router.get("/constituency/:constituencyId", async (req, res) => {
  const constituencyId = req.params.constituencyId;

  try {
    const candidates = await Candidate.find({ constituencyId });
    return res.status(200).send(candidates);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
