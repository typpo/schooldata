var School = require('../models/school');

function getStaticMapUrl(lat, lng) {
  return 'http://maps.googleapis.com/maps/api/staticmap?zoom=2&scale=1&size=350x250&maptype=terrain&format=png&visual_refresh=true&markers=size:mid%7Ccolor:red%7Clabel:1%7C' + lat + ',' + lng + '&key=' + process.env.MAPS_API_KEY;
}

/**
 * GET school data.
 */
exports.index = function(req, res) {

  var filter = {};

  if (req.params.directory) {
    console.log('Getting school data for ' + req.params.directory);
    // Example directory: CA-schools, 94043-schools.
    var loc = req.params.directory.split('-')[0];
    if (/^\d+$/.test(loc)) {
      // By zipcode.
      filter.zip = loc;
    } else {
      // By state.
      filter.state = loc.toUpperCase();
    }
  }

  if (req.params.district) {
    console.log('Getting school data for ' + req.params.district);
    filter.agency_slug = req.params.district;
  }

  School.find(filter).then(function(schools) {
    res.render('directory', {
      page: {
        selection: 'Schools',
      },
      schools: schools,
    });
  });
};
