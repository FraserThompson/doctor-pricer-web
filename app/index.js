require('font-awesome/css/font-awesome.css');
require('./styles/bootstrap.css');
require('./styles/main.css');
require('./favicon.ico')
require('./robots.txt')
require('./ads.txt')
require('./CNAME')

require("leaflet/dist/leaflet.css");
require("leaflet/dist/images/marker-icon.png");
require("leaflet/dist/images/marker-icon-2x.png");
require("leaflet/dist/images/marker-shadow.png");

var L = require('leaflet');

require('./scripts/app.js');
require('./scripts/directives/directives.js');
require('./scripts/services/searchmodel.js');
require('./scripts/services/practicescollection.js');
require('./scripts/controllers/main.js');
require('./scripts/controllers/navbar.js');
require('./scripts/controllers/map.js');
require('./scripts/controllers/result.js');
