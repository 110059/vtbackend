const express = require("express");
const router = express.Router();
const QRUser = require("../models/QRUser");

router.post('/register', async (req, res) => {
    const { name, phone, vehicle, consent } = req.body;
    if (!consent || !/^\+91[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid consent or phone number' });
    }
    const qruser = new QRUser({ name, phone, vehicle });
    await qruser.save();
    res.json({ id: qruser._id });
  });
  
  router.get('/:id/qrcode', async (req, res) => {
    const qruser = await QRUser.findById(req.params.id);
    if (!qruser) return res.status(404).send('User not found');
    const callLink = `tel:${qruser.phone}`;
    res.json({ callLink });
  });

  module.exports = router;
