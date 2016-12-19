var School = require('../models/school');

function getStaticMapUrl(lat, lng) {
  return 'http://maps.googleapis.com/maps/api/staticmap?zoom=2&scale=1&size=350x250&maptype=terrain&format=png&visual_refresh=true&markers=size:mid%7Ccolor:red%7Clabel:1%7C' + lat + ',' + lng + '&key=' + process.env.MAPS_API_KEY;
}

function getStreetViewUrl(lat, lng) {
  return 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location=' + lat + ',' + lng + '&fov=90&key=' + process.env.MAPS_API_KEY;
}

/**
 * GET school data.
 */
exports.index = function(req, res) {
  console.log('Getting school data for ', req.params.slug, req.params.state);
  School.findOne({slug: req.params.slug, state: req.params.state}).then(function(school) {
    res.render('school', {
      page: {
        selection: 'Schools',
      },
      school: school,
      map: {
        url: getStaticMapUrl(school.lat, school.lng),
      },
      streetview: {
        url: getStreetViewUrl(school.lat, school.lng),
      },
    });
  });
};
