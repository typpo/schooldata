var School = require('../models/school');

function getStaticMapUrl(lat, lng) {
  return 'http://maps.googleapis.com/maps/api/staticmap?zoom=2&scale=1&size=350x250&maptype=terrain&format=png&visual_refresh=true&markers=size:mid%7Ccolor:red%7Clabel:1%7C' + lat + ',' + lng;
}

/**
 * GET school data.
 */
exports.index = function(req, res) {
  console.log('Getting school data for ' + req.params.slug);
  School.findOne({slug: req.params.slug}).then(function(school) {
    res.render('school', {
      page: {
        selection: 'Schools',
      },
      school: school,
      map: {
        url: getStaticMapUrl(school.lat, school.lng),
      },
    });
  });
};
