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
  'zip': String,
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

schoolSchema.methods.getName = function() {
  return this.name;
};

schoolSchema.methods.getStreetAddress = function() {
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

schoolSchema.methods.getAddress = function() {
  var address = '';
  if (this.getStreetAddress()) {
    address += this.getStreetAddress() + ', '
  }
  return address + this.city + ', ' + this.state + ' ' + this.zip;
}

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
  if (this.student_teacher_ratio) {
    return this.student_teacher_ratio.toFixed(1);
  }
  return '?';
};

schoolSchema.methods.getGradeRange = function() {
  var grades = [
    this.prekindergarten_students,
    this.kindergarten_students,
    this.grade_1_students,
    this.grade_2_students,
    this.grade_3_students,
    this.grade_4_students,
    this.grade_5_students,
    this.grade_6_students,
    this.grade_7_students,
    this.grade_8_students,
    this.grade_9_students,
    this.grade_10_students,
    this.grade_11_students,
    this.grade_12_students,
  ];
  var firstNonZeroIdx = -1;
  var lastNonZeroIdx = -1;
  for (var i=0; i < grades.length; i++) {
    if (firstNonZeroIdx < 0 && grades[i] > 0) {
      firstNonZeroIdx = i;
    }
    if (grades[i] > 0) {
      lastNonZeroIdx = i;
    }
  }

  var gradeMin = firstNonZeroIdx  - 1;
  if (firstNonZeroIdx === 0) {
    gradeMin = 'Pre-K';
  } else if (firstNonZeroIdx === 1) {
    gradeMin = 'K';
  }

  var gradeMax = lastNonZeroIdx - 1;
  if (lastNonZeroIdx === 0) {
    gradeMax = 'Pre-K';
  } else if (lastNonZeroIdx === 1) {
    gradeMax = 'K';
  }

  return gradeMin + ' to ' + gradeMax;
};

schoolSchema.methods.getUrl = function() {
  return '/schools/' + this.state + '/' + this.slug;
};

schoolSchema.plugin(mongoosePaginate);
var School = mongoose.model('School', schoolSchema);

module.exports = School;
