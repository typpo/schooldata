var District = require('../models/district');
var School = require('../models/school');

// Number of places to list in rankings.
var NUM_ITEMS_IN_RANKING = 5;

// Rankings that are loaded on startup and displayed on the home page.
var rankings = {
  school: {},
  district: {},
};

function prequery(Model, rankingsType) {
  // TODO(ian): Maybe split these by type (elementary, high schools, etc.)

  // Diversity.
  Model.find({total_students_all_grades_includes_ae: {$gt: 0}}, undefined, {
    limit: NUM_ITEMS_IN_RANKING,
    sort: {
      diversity_score: 1,
    },
  }, function(err, results) {
    if (err) {
      console.error('Error: could not query', rankingsType, 'diversity on startup');
      return;
    }
    rankings[rankingsType].diversity = results;
    console.log('Queried', rankingsType, 'diversity rankings!');
  });

  // Student/teacher ratio.
  Model.find({
    // Threshold of 30 so we only pick up real schools.
    total_students_all_grades_includes_ae: {$gt: 30},
    classroom_teachers_total: {$gt: 30},
    // Exclude vocational.
    // type: 'Regular School',
  }, undefined, {
    limit: NUM_ITEMS_IN_RANKING,
    sort: {
      student_teacher_ratio: 1,
    },
  }, function(err, results) {
    if (err) {
      console.error('Error: could not query school s/t ratio on startup');
      return;
    }
    rankings[rankingsType].student_teacher_ratio = results;
    console.log('Queried', rankingsType, 's/t ratio rankings!');
  });

  // School size.
  Model.find({
    total_students_all_grades_includes_ae: {$gt: 0},
    classroom_teachers_total: {$gt: 0},
  }, undefined, {
    limit: NUM_ITEMS_IN_RANKING,
    sort: {
      total_students_all_grades_includes_ae: -1,
    },
  }, function(err, results) {
    if (err) {
      console.error('Error: could not query school size on startup');
      return;
    }
    rankings[rankingsType].size = results;
    console.log('Queried', rankingsType, 'size rankings!');
  });

  // School lunch.
  Model.find({
    total_students_all_grades_includes_ae: {$gt: 0},
    classroom_teachers_total: {$gt: 0},
  }, undefined, {
    limit: NUM_ITEMS_IN_RANKING,
    sort: {
      free_or_reduced_lunch_ratio: -1,
    },
  }, function(err, results) {
    if (err) {
      console.error('Error: could not query', rankingsType, 'lunch on startup');
      return;
    }
    rankings[rankingsType].lunch = results;
    console.log('Queried', rankingsType, 'lunch rankings!');
  });
}

function onStartup() {
  prequery(School, 'school');
  prequery(District, 'district');
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
