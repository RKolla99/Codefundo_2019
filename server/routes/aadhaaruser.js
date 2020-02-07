const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const validator = require('express-joi-validation').createValidator({});

const AadhaarUser = require('../models/AadhaarUser');

// ROUTE - /api/aadhaaruser

// Insert Aadhaar User

const insertUserSchema = Joi.object().keys({
  aadhaarNumber: Joi.number().required(),
  constituencyId: Joi.number().required(),
  name: Joi.string().required(),
  dob: Joi.date().format('YYYY-MM-DD'),
  gender: Joi.string().valid('Male', 'Female'),
  address: Joi.string(),
  fingerprint: Joi.number().required(),
  retinal: Joi.number().required()
});

router.put('/', validator.body(insertUserSchema), async (req, res) => {
  try {
    let check = await AadhaarUser.findOne({
      aadhaarNumber: req.body.aadhaarNumber
    });

    if (!check) {
      let user = new AadhaarUser(req.body);

      await user.save();
      return res.status(201).send();
    } else {
      return res.status(400).send('User already exists');
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

// Get information about Aadhaar user

router.get('/:aadhaarNumber', async (req, res) => {
  const { aadhaarNumber } = req.params;

  try {
    let result = await AadhaarUser.findOne({ aadhaarNumber }).select(
      '-fingerprint -retinal'
    );

    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(400).send('User does not exist');
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

// Validate Aadhaar user

const validateUserSchema = Joi.object().keys({
  aadhaarNumber: Joi.number().required(),
  fingerprint: Joi.binary().required(),
  retinal: Joi.binary().required()
});

router.post('/', validator.body(validateUserSchema), async (req, res) => {
  const { aadhaarNumber, fingerprint, retinal } = req.body;

  try {
    let check = await AadhaarUser.findOne({ aadhaarNumber });

    if (check) {
      if (check.fingerprint == fingerprint && check.retinal == retinal) {
        return res.status(200).json({ validated: 1 });
      } else {
        return res.status(200).json({ validated: 0 });
      }
    } else {
      return res.status(200).json({ validated: 0 });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
