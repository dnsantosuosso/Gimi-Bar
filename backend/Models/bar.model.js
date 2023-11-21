const mongoose = require('mongoose');

const barSchema = new mongoose.Schema({
  name: { type: String, required: true },
  //do I really need coordinates?
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'menus' }],
  cellphone: String,
  email: String,
  rating: Number, //autopopulate from API: Google Reviews?
  logo: String,
  barPoints: Number,
  //The next items should be autopopulated from an API, but this would create a dependency to external SWs. Maybe a better solution would be to ask the bar to manually input these fields?
  country: String, //autopopulate from API: will create dependency??
  city: String, //autopopulate from API: will create dependency??
  street: String, //autopopulate from API: will create dependency??
  localCurrency: String, //autopopulate from API: will create dependency?? Maybe this one can be hardcoded / built from scratch
  serviceFee: Number,
  licenseNumber: String, //must be validated
});

//TODO: Do method to populate local currency based on location of bar - find API or build it from scratch.

module.exports = mongoose.model('bars', barSchema);
