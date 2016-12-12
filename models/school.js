var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var schoolSchema = new Schema({
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
});

schoolSchema.plugin(mongoosePaginate);
var School = mongoose.model('School', schoolSchema);

module.exports = School;
