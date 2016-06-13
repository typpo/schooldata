/**
 * GET school data.
 */
exports.index = function(req, res) {
  console.log('Getting school data for ' + req.params.slug);
  res.render('school', {
    page: {
      selection: 'Schools',
    },
  });
};
