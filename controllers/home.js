var School = require('../models/school');

var SCHOOL_DIVERSITY_RANKING = [];

function onStartup() {
  School.find({total_students_all_grades_includes_ae: {$gt: 0}}, undefined, {
    limit: 10,
    sort: {
      diversity_score: 1,
    },
  }, function(err, schools) {
    if (err) {
      console.error('Error: could not query school diversity on startup');
      return;
    }
    SCHOOL_DIVERSITY_RANKING = schools;
    console.log('Queried school diversity rankings!');
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
    rankings: {
      school_diversity: SCHOOL_DIVERSITY_RANKING,
    },
  });
};
