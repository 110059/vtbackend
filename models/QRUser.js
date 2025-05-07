const mongoose = require('mongoose');
const QRUserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  vehicle: String,
});
module.exports = mongoose.model('QRUser', QRUserSchema);