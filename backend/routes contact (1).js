// routes/contact.js
// Handles POST /api/contact — saves the message to MongoDB
// and emails Zainab a notification.

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");

// Set up the email transporter once (reused for every request)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1. Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    // 2. Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 3. Send email notification (don't block the response if it fails)
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    }).catch(err => console.error("Email failed:", err.message));

    // 4. Respond to the frontend
    res.status(201).json({ success: true, message: "Message received!" });

  } catch (err) {
    console.error("Contact route error:", err.message);
    res.status(500).json({ success: false, error: "Something went wrong. Please try again." });
  }
});

module.exports = router;
