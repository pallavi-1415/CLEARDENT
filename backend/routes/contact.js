const express = require('express');
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../services/emailService');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a contact inquiry
// @access  Public
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, message, service } = req.body;

  // Simple validation
  if (!firstName || !lastName || !email || !message || !service) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone: phone || '',
      service,
      message
    });

    const savedContact = await newContact.save();
    
    // Dispatch email notification asynchronously (non-blocking)
    sendContactNotification(savedContact).catch(emailErr => {
      console.error('Error dispatching contact email:', emailErr);
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry saved successfully',
      data: savedContact
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ message: 'Failed to submit contact request. Server error.' });
  }
});

module.exports = router;
