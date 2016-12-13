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

  all_students_american_indian_alaska_native: String,
  all_students_american_indian_alaska_native_female: String,
  all_students_american_indian_alaska_native_male: String,
  all_students_asian: String,
  all_students_asian_female: String,
  all_students_asian_male: String,
  all_students_black: String,
  all_students_black_female: String,
  all_students_black_male: String,
  all_students_hawaiian_native_pacific_islander: String,
  all_students_hawaiian_native_pacific_islander_female: String,
  all_students_hawaiian_native_pacific_islander_male: String,
  all_students_hispanic: String,
  all_students_hispanic_female: String,
  all_students_hispanic_male: String,
  all_students_two_or_more_races: String,
  all_students_two_or_more_races_female: String,
  all_students_two_or_more_races_male: String,
  all_students_white: String,
  all_students_white_female: String,
  all_students_white_male: String,
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
