var sm = require('sitemap');
var School = require('../models/school');

var sitemap_urls = [];

function addSchool() {
  School.find({}).then(function(resp) {
    resp.forEach(function(result) {
      sitemap_urls.push({
        url: '/schools/' + result.state + '/' + result.slug,
        changefreq: 'weekly',
        priority: 0.5,
      });
    });
  });
}

function onStartup() {
  addSchool();
}

var sitemap = sm.createSitemap({
  hostname: 'http://www.schoolscout.org/',
  cacheTime: 600000,        // 600 sec - cache purge period
  urls: sitemap_urls,
});

exports.index = function(req, res) {
  sitemap.toXML(function(err, xml) {
     if (err) {
       console.error('Sitemap error:', err);
       return res.status(500).end();
     }
     res.header('Content-Type', 'application/xml');
     res.send(xml);
   });
};
