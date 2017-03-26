var sm = require('sitemap');
var School = require('../models/school');

var sitemapUrls = [];
var sitemap = null;

function querySchools() {
  console.log('Querying schools for sitemap...');
  School.find({}, {
    state: 1,
    slug: 1,
  }, {
    limit: 10000,
  }, function(err, results) {
    results.forEach(function(result) {
      sitemapUrls.push({
        url: '/schools/' + result.state + '/' + result.slug,
        changefreq: 'weekly',
        priority: 0.1,
      });
    });

    sitemap = sm.createSitemap({
      hostname: 'http://www.schoolscout.org/',
      cacheTime: 600000,        // 600 sec - cache purge period
      urls: sitemapUrls,
    });

    console.log('Sitemap initialized');
  });
}

querySchools();

exports.index = function(req, res) {
  if (!sitemap) {
    res.status(500);
    res.send('sitemap not initialized');
    return;
  }

  sitemap.toXML(function(err, xml) {
     if (err) {
       console.error('Sitemap error:', err);
       return res.status(500).end();
     }
     res.header('Content-Type', 'application/xml');
     res.send(xml);
   });
};
