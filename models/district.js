var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var slug = require('slug');

var Schema = mongoose.Schema;

var districtSchema = new Schema({
  'agency_slug': String,

  'city': String,
  'state': String,
  'zip': String,
  'phone': String,
  'agency': String,
  'type': String,

  nces_agency_identification_number: String,

  school_count: Number,

  location_address_street_1: String,
  location_address_street_2: String,
  location_address_street_3: String,

  classroom_teachers_total: Number,
  total_students_all_grades_includes_ae: Number,
  student_teacher_ratio: Number,
  student_teacher_ratio_pct: Number,
  student_teacher_ratio_district_pct: Number,
  student_teacher_ratio_state_pct: Number,
  diversity_score: Number,

  num_free_lunch_eligible: Number,
  num_reduced_lunch_eligible: Number,
  free_or_reduced_lunch_ratio: Number,
  title_i_eligible: String,

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

districtSchema.methods.getName = function() {
  return this.agency;
};

districtSchema.methods.getStreetAddress = function() {
  // NaNs come from pandas.
  if (!this.location_address_street_1 || this.location_address_street_1 === 'NaN') {
    return '';
  }
  var str = this.location_address_street_1;
  if (this.location_address_street_2 && this.location_address_street_2 !== 'NaN') {
    str += ', ' + this.location_address_street_2;
  }
  if (this.location_address_street_3 && this.location_address_street_3 !== 'NaN') {
    str += ', ' + this.location_address_street_3;
  }
  return str;
};

districtSchema.methods.getNumberMale = function() {
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

districtSchema.methods.getNumberFemale = function() {
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

districtSchema.methods.getRoundedNumberOfTeachers = function() {
  return Math.round(this.classroom_teachers_total);
};

districtSchema.methods.getStudentTeacherRatio = function() {
  if (this.student_teacher_ratio) {
    return this.student_teacher_ratio.toFixed(1);
  }
  return '?';
};

districtSchema.methods.getUrl = function() {
  return '/district/' + this.agency_slug;
};

districtSchema.plugin(mongoosePaginate);
var District = mongoose.model('District', districtSchema);

module.exports = District;
