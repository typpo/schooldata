/**
 * GET /
 */
exports.index = function(req, res) {
  res.render('home', {
    page: {
      selection: 'Home',
    },
  });
};
