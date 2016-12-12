var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var School = mongoose.model('School', new Schema({
  'slug': String,
  'agency_slug': String,

  'name': String,
  'street_address': String,
  'mailing_address': String,
  'city': String,
  'state': String,
  'zip': Number,
  'phone': String,
  'agency': String,
  'type': String,
  'lat': Number,
  'lng': Number,

  'locale_type': String,
}), 'schools');

module.exports = School;
