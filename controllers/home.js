var School = require('../models/school');

// Number of places to list in rankings.
var NUM_ITEMS_IN_RANKING = 5;

// Rankings that are loaded on startup and displayed on the home page.
var rankings = {
  school_diversity: [],
  school_student_teacher_ratio: [],
  school_size: [],
};

function onStartup() {
  // TODO(ian): Maybe split these by type (elementary, high schools, etc.)

  // Diversity.
  School.find({total_students_all_grades_includes_ae: {$gt: 0}}, undefined, {
    limit: NUM_ITEMS_IN_RANKING,
    sort: {
      diversity_score: 1,
    },
  }, function(err, schools) {
    if (err) {
      console.error('Error: could not query school diversity on startup');
      return;
    }
    rankings.school_diversity = schools;
    console.log('Queried school diversity rankings!');
  });

  // Student/teacher ratio.
  School.find({
    // Threshold of 30 so we only pick up real schools.
    total_students_all_grades_includes_ae: {$gt: 30},
    classroom_teachers_total: {$gt: 30},
    // Exclude vocational.
    type: 'Regular School',
  }, undefined, {
    limit: NUM_ITEMS_IN_RANKING,
    sort: {
      student_teacher_ratio: 1,
    },
  }, function(err, schools) {
    if (err) {
      console.error('Error: could not query school s/t ratio on startup');
      return;
    }
    rankings.school_student_teacher_ratio = schools;
    console.log('Queried school s/t ratio rankings!');
  });

  // School size.
  School.find({
    total_students_all_grades_includes_ae: {$gt: 0},
    classroom_teachers_total: {$gt: 0},
  }, undefined, {
    limit: NUM_ITEMS_IN_RANKING,
    sort: {
      total_students_all_grades_includes_ae: -1,
    },
  }, function(err, schools) {
    if (err) {
      console.error('Error: could not query school size on startup');
      return;
    }
    rankings.school_size = schools;
    console.log('Queried school size rankings!');
  });

  // School lunch.
  School.find({
    total_students_all_grades_includes_ae: {$gt: 0},
    classroom_teachers_total: {$gt: 0},
  }, undefined, {
    limit: NUM_ITEMS_IN_RANKING,
    sort: {
      free_or_reduced_lunch_ratio: -1,
    },
  }, function(err, schools) {
    if (err) {
      console.error('Error: could not query school lunch on startup');
      return;
    }
    rankings.school_lunch = schools;
    console.log('Queried school lunch rankings!');
  });
}

onStartup();

/**
 * GET /
 */
exports.index = function(req, res) {
  res.render('home', {
    page: {
      selection: 'Home',
    },
    rankings: rankings,
  });
};
