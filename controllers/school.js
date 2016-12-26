var School = require('../models/school');

function getStaticMapUrl(address) {
  address = address.replace(/ /g, '+');
  return 'https://www.google.com/maps/embed/v1/place?zoom=17&q=' + address + '&key=' + process.env.MAPS_API_KEY;
}

function getStreetViewUrl(address) {
  return 'https://www.google.com/maps/embed/v1/streetview?location=' + address + '&fov=90&key=' + process.env.MAPS_API_KEY;
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
        url: getStaticMapUrl(school.getAddress()),
      },
      streetview: {
        url: getStreetViewUrl(school.getAddress()),
      },
    });
  });
};
