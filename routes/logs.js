const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Log = require('../models/Log');

// @route       GET /logs
// @desc        Get all logs
// @access      Public
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find();
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: GET request');
  }
});

// @route       Search /logs?q=${text}
// @desc        Text search all logs
// @access      Public
router.get('/search/:text', async (req, res) => {
  const searchText = req.params.text;
  try {
    const logs = await Log.find({
      $or: [
        { message: new RegExp(searchText, 'i') },
        { tech: new RegExp(searchText, 'i') }
      ]
    });

    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: GET request');
  }
});

// @route       POST /logs
// @desc        Add new log
// @access      Public
router.post(
  '/',
  [
    check('message', 'Message is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tech, message, attention } = req.body;

    try {
      const newLog = new Log({
        tech,
        message,
        attention
      });

      const log = await newLog.save();

      res.json(log);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error: POST request');
    }
  }
);

// @route       PUT /logs/:id
// @desc        Update log
// @access      Public
router.put('/:id', async (req, res) => {
  const { tech, message, attention } = req.body;

  // Build log object
  const logFields = {};
  if (tech) logFields.tech = tech;
  if (message) logFields.message = message;
  if (attention) logFields.attention = attention;

  try {
    let log = await Log.findById(req.params.id);

    if (!log) return res.status(404).json({ msg: 'Log not found' });

    log = await Log.findByIdAndUpdate(
      req.params.id,
      { $set: logFields },
      { new: true }
    );

    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: PUT request');
  }
});

// @route       DELETE /logs/:id
// @desc        Delete log
// @access      Public
router.delete('/:id', async (req, res) => {
  try {
    let log = await Log.findById(req.params.id);

    if (!log) return res.status(404).json({ msg: 'Log not found' });

    await Log.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Log removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: DELETE request');
  }
});

module.exports = router;
