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

  nces_agency_identification_number: String,
  nces_school_identifier: String,

  location_address_street_1: String,
  location_address_street_2: String,
  location_address_street_3: String,

  classroom_teachers_total: Number,
  total_students_all_grades_includes_ae: Number,

  prekindergarten_students: Number,
  kindergarten_students: Number,
  grade_1_students: Number,
  grade_2_students: Number,
  grade_3_students: Number,
  grade_4_students: Number,
  grade_5_students: Number,
  grade_6_students: Number,
  grade_7_students: Number,
  grade_8_students: Number,
  grade_9_students: Number,
  grade_10_students: Number,
  grade_11_students: Number,
  grade_12_students: Number,
  grade_13_students: Number,
  ungraded_students: Number,

  all_students_american_indian_alaska_native: Number,
  all_students_american_indian_alaska_native_female: Number,
  all_students_american_indian_alaska_native_male: Number,
  all_students_asian: Number,
  all_students_asian_female: Number,
  all_students_asian_male: Number,
  all_students_black: Number,
  all_students_black_female: Number,
  all_students_black_male: Number,
  all_students_hawaiian_native_pacific_islander: Number,
  all_students_hawaiian_native_pacific_islander_female: Number,
  all_students_hawaiian_native_pacific_islander_male: Number,
  all_students_hispanic: Number,
  all_students_hispanic_female: Number,
  all_students_hispanic_male: Number,
  all_students_two_or_more_races: Number,
  all_students_two_or_more_races_female: Number,
  all_students_two_or_more_races_male: Number,
  all_students_white: Number,
  all_students_white_female: Number,
  all_students_white_male: Number,
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

schoolSchema.methods.getNumberMale = function() {
  return (
    this.all_students_american_indian_alaska_native_male +
    this.all_students_asian_male +
    this.all_students_black_male +
    this.all_students_hawaiian_native_pacific_islander_male +
    this.all_students_hispanic_male +
    this.all_students_two_or_more_races_male +
    this.all_students_white_male
  );
};

schoolSchema.methods.getNumberFemale = function() {
  return (
    this.all_students_american_indian_alaska_native_female +
    this.all_students_asian_female +
    this.all_students_black_female +
    this.all_students_hawaiian_native_pacific_islander_female +
    this.all_students_hispanic_female +
    this.all_students_two_or_more_races_female +
    this.all_students_white_female
  );
};

schoolSchema.methods.getRoundedNumberOfTeachers = function() {
  return Math.round(this.classroom_teachers_total);
};

schoolSchema.methods.getStudentTeacherRatio = function() {
  return (this.total_students_all_grades_includes_ae / parseFloat(this.classroom_teachers_total)).toFixed(1);
};

schoolSchema.plugin(mongoosePaginate);
var School = mongoose.model('School', schoolSchema);

module.exports = School;
