var School = require('../models/school');

function getStaticMapUrl(streetAddress, city, state, zipcode) {
  var address = streetAddress + '+' + city + '+' + state + '+' + zipcode;
  address = address.replace(/ /g, '+');
  return 'https://www.google.com/maps/embed/v1/place?q=' + address + '&key=' + process.env.MAPS_API_KEY;
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
        url: getStaticMapUrl(school.getStreetAddress(), school.city, school.state, school.zip),
      },
      streetview: {
        url: getStreetViewUrl(school.lat, school.lng),
      },
    });
  });
};
