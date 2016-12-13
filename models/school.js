var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var slug = require('slug');

var Schema = mongoose.Schema;

var schoolSchema = new Schema({
  'slug': String,
  'agency_slug': String,

  'name': String,
  //'street_address': String,
  //'mailing_address': String,
  'city': String,
  'state': String,
  'zip': Number,
  'phone': String,
  'agency': String,
  'type': String,

  //'lat': Number,
  //'lng': Number,

  //'locale_type': String,

  location_address_street_1: String,
  location_address_street_2: String,
  location_address_street_3: String,
});

schoolSchema.methods.getStreetAddress = function() {
  if (!this.location_address_street_1) {
    return '';
  }
  var str = this.location_address_street_1;
  if (this.location_address_street_2) {
    str += ', ' + this.location_address_street_2;
  }
  if (this.location_address_street_3) {
    str += ', ' + this.location_address_street_3;
  }
  return str;
};

schoolSchema.plugin(mongoosePaginate);
var School = mongoose.model('School', schoolSchema);

module.exports = School;
