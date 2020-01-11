const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Tech = require('../models/Tech');

// @route       GET /techs
// @desc        Get all techs
// @access      Public
router.get('/', async (req, res) => {
  try {
    const techs = await Tech.find();
    res.json(techs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: GET request');
  }
});

// @route       POST /techs
// @desc        Add new tech
// @access      Public
router.post(
  '/',
  [
    check('firstName', 'First name is required')
      .not()
      .isEmpty(),
    check('lastName', 'Last name is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName } = req.body;

    try {
      const newTech = new Tech({
        firstName,
        lastName
      });

      const tech = await newTech.save();

      res.json(tech);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error: POST request');
    }
  }
);

// @route       DELETE /tech/:id
// @desc        Delete tech
// @access      Public
router.delete('/:id', async (req, res) => {
  try {
    let tech = await Tech.findById(req.params.id);

    if (!tech) return res.status(404).json({ msg: 'Log not found' });

    await Tech.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Tech removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: DELETE request');
  }
});

module.exports = router;
