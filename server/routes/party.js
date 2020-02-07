const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({});

const Party = require('../models/Party');

// ROUTE: /api/party

// Insert party information

const insertPartySchema = Joi.object().keys({
    partyId: Joi.number().required(),
    name: Joi.string().required(),
    acronym: Joi.string().required(),
    logo: Joi.string(),
    founded: Joi.number(),
    founders: Joi.string()
});

router.put('/', validator.body(insertPartySchema), async (req, res) => {
    try {
        let check = await Party.findOne({ partyId: req.body.partyId });

        if (!check) {
            let founders = req.body.founders;
            founders = founders.split(',').map(founder => founder.trim());

            req.body.founders = founders;
            let party = new Party(req.body);

            await party.save();
            return res.status(201).send();
        } else {
            return res.status(400).send('Party ID already exists');
        }
    } catch (error) {
        console.error(errror.message);
        return res.status(500).send('Server Error');
    }
});

// Get party information
router.get('/:partyId', async (req, res) => {
    const { partyId } = req.params;

    try {
        const party = await Party.findOne({ partyId });

        if (party) {
            return res.status(200).json(party);
        } else {
            return res.status(400).send('Party does not exist');
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
