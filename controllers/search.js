var School = require('../models/school');
var District = require('../models/district');

exports.index = function(req, res) {
  var query = req.query.q;
  var filter = {};
  if (/^\d+$/.test(query)) {
    // By zipcode.
    filter.zip = loc;
  }

  // TODO: NYI
  res.json({});
};
