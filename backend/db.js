const mongoose = require('mongoose');

const formdataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true , unique: true},
  email: { type: String, required: true ,unique: true},
  hobbies: { type: String },
});

const FormData = mongoose.model('Form', formdataSchema);

module.exports = FormData;