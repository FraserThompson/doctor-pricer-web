!function(e){function t(t){for(var n,r,c=t[0],s=t[1],l=t[2],u=0,p=[];u<c.length;u++)r=c[u],a[r]&&p.push(a[r][0]),a[r]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n]);for(d&&d(t);p.length;)p.shift()();return i.push.apply(i,l||[]),o()}function o(){for(var e,t=0;t<i.length;t++){for(var o=i[t],n=!0,c=1;c<o.length;c++){var s=o[c];0!==a[s]&&(n=!1)}n&&(i.splice(t--,1),e=r(r.s=o[0]))}return e}var n={},a={1:0},i=[];function r(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=n,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var c=window.webpackJsonp=window.webpackJsonp||[],s=c.push.bind(c);c.push=t,c=c.slice();for(var l=0;l<c.length;l++)t(c[l]);var d=s;i.push([37,2]),o()}({37:function(e,t,o){o(38);o(39),o(84),o(85),o(86),o(87),o(88),o(89),o(98)},39:function(e,t,o){"use strict";o(7),o(41),o(46),o(47);var n=o(48).default;o(50),angular.module("doctorpricerWebApp",["ui.router.state.events",n,"nemLogging","ui-leaflet","ui.bootstrap.showErrors",o(51),o(53),o(56),o(60),o(72),o(73),o(75),o(77),o(79),o(81)]).run(["$rootScope","$uibModal",function(e,t){e.title="Doctor price comparison NZ | Find the cheapest doctor | DoctorPricer",e.apiUrl="https://api.doctorpricer.co.nz",e.openDialog=function(){t.open({templateUrl:"views/info.html"}).result.then(function(){},function(){})}}]).config(["$stateProvider","$urlRouterProvider",function(e,t){t.otherwise("/"),e.state("home",{url:"/",templateUrl:"views/main.html",controller:"MainCtrl",onEnter:["$rootScope",function(e){e.hideFb=!1,e.loaded=!0,e.autocompleteSize="big-autocomplete"}]}).state("result",{url:"/:lat,:lng/:age/",templateUrl:"views/result.html",controller:"ResultCtrl",resolve:{error:["$state","$stateParams",function(e,t){return isNaN(parseFloat(t.lat))||isNaN(parseFloat(t.lng))||isNaN(parseInt(t.age))?1:0}]},onEnter:["$stateParams","$rootScope","SearchModel",function(e,t,o){t.loaded=!0,window.innerWidth<=481&&(t.hideFb=!0),o.coords.length||o.initalizeModel(parseFloat(e.lat),parseFloat(e.lng),e.age,null,null),t.$broadcast("newSearch"),t.autocompleteSize="small-autocomplete"}]})}])},72:function(e,t,o){"use strict";angular.module("ngAutocomplete",[]).directive("ngAutocomplete",function(){return{require:"ngModel",scope:{ngModel:"=",options:"=?",details:"=?"},link:function(e,t,o,n){var a,i=!1;void 0==e.gPlace&&(e.gPlace=new google.maps.places.Autocomplete(t[0],{})),google.maps.event.addListener(e.gPlace,"place_changed",function(){var o=e.gPlace.getPlace();void 0!==o&&(void 0!==o.address_components?e.$apply(function(){e.details=o,n.$setViewValue(t.val())}):i&&r(o))});var r=function(o){var a=new google.maps.places.AutocompleteService;o.name.length>0&&a.getPlacePredictions({input:o.name,offset:o.name.length},function(o,a){null==o||0==o.length?e.$apply(function(){e.details=null}):new google.maps.places.PlacesService(t[0]).getDetails({reference:o[0].reference},function(o,a){a==google.maps.GeocoderStatus.OK&&e.$apply(function(){n.$setViewValue(o.formatted_address),t.val(o.formatted_address),e.details=o;t.on("focusout",function(e){t.val(o.formatted_address),t.unbind("focusout")})})})})};n.$render=function(){var e=n.$viewValue;t.val(e)},e.watchOptions=function(){return e.options},e.$watch(e.watchOptions,function(){a={},e.options&&(i=!0===e.options.watchEnter,e.options.types?(a.types=[],a.types.push(e.options.types),e.gPlace.setTypes(a.types)):e.gPlace.setTypes([]),e.options.bounds?(a.bounds=e.options.bounds,e.gPlace.setBounds(a.bounds)):e.gPlace.setBounds(null),e.options.country?(a.componentRestrictions={country:e.options.country},e.gPlace.setComponentRestrictions(a.componentRestrictions)):e.gPlace.setComponentRestrictions(null))},!0)}}}),e.exports="ngAutocomplete"},84:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").directive("addressValidation",function(){return{restrict:"A",require:"ngModel",link:function(e,t,o,n){n.$validators.addressValidation=function(t){return!n.$isEmpty(t)&&!(e.details.autocomplete!==e.autocomplete||!e.details.geometry)}}}}).directive("autoScroll",["PracticesCollection",function(e){return{restrict:"A",link:function(t,o){t.$on("updateScroll",function(){var t=angular.element(o[0]),n=angular.element(document.getElementById("practice_"+e.selectedPractice));t.duScrollTo(n,0,250)})}}}]).directive("loadingButton",["$timeout",function(e){return{replace:"true",require:"^form",template:'<span><span ng-hide="!isLoading"><i class="fa fa-spinner fa-spin fa-lg" style="font-size: 24px;"></i></span><button ng-hide="isLoading" type="submit" class="btn btn-cool {{btnSize}}"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> Search</button></span>',link:function(e,t,o,n){e.btnSize=o.btnSize,e.$on("countUpdated",function(){e.isLoading=!1}),t.bind("click",function(){n.$invalid?e.isLoading=!1:e.isLoading=!0})}}}]).directive("stupidAd",["$timeout",function(e){return{replace:"true",template:'<div class="stupid-ad {{class}}"> \t\t\t\t\t\t<ins class="adsbygoogle stupid-adsbygoogle" \t\t\t\t\t\tstyle="display:block" \t\t\t\t\t\tdata-ad-client="ca-pub-2527917281752489" \t\t\t\t\t\tdata-ad-slot="1395256542" \t\t\t\t\t\tdata-ad-format="auto" \t\t\t\t\t\t</ins> \t\t\t\t\t\t</div>',link:function(){e(function(){try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){console.error(e)}},1e3)}}}]).directive("disableTap",["$timeout",function(e){return{link:function(){e(function(){var e=document.getElementsByClassName("pac-container");angular.element(e).attr("data-tap-disabled","true")},500)}}}])},85:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").service("SearchModel",["$rootScope",function(e){var t=this;this.address="None",this.displayAddress="Address",this.age="Age",this.coords=[],this.checkForChristchurch=function(e){return e.indexOf("Christchurch")>-1},this.initalizeModel=function(o,n,a,i,r,c,s){if(this.age=a,this.coords=[o,n],i&&r)this.address=i,this.displayAddress=r,this.christchurch=this.checkForChristchurch(i);else{var l=new google.maps.Geocoder,d=new google.maps.LatLng(o,n);l.geocode({latLng:d},function(o,n){if(n===google.maps.GeocoderStatus.OK){console.log(o[0]),t.christchurch=t.checkForChristchurch(o[0].formatted_address),t.displayAddress=o[0].address_components[0].short_name+" "+o[0].address_components[1].short_name,t.address=o[0].formatted_address,e.$broadcast("geolocatedAddress");var a=o[3].formatted_address;ga("send","pageview","/results.php?address="+a+"&age="+t.age),c&&c()}else s&&s("Error geocoding input address.")})}}}])},86:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").service("PracticesCollection",["$q","$http","$timeout","$rootScope",function(e,t,o,n){var a=new google.maps.places.PlacesService(document.createElement("div")),i=this;this.length=0,this.lastPractice=void 0,this.displayCollection=[],this.selectedPractice=void 0,this.christchurch=!1,this.getPlaceId=function(t,o){var n=e.defer();if(null==t){var r=i.displayCollection[o].name,c=i.displayCollection[o].lat,s=i.displayCollection[o].lng,l={query:r,radius:.5,location:new google.maps.LatLng(c,s)};a.textSearch(l,function(e,t){t==google.maps.places.PlacesServiceStatus.OK?n.resolve(e[0].place_id):(console.log("error finding place"),n.reject())})}else n.resolve();return n.promise},this.getGoogle=function(t){var o=e.defer(),n=i.displayCollection[t].place_id||null;return i.getPlaceId(n,t).then(function(e){e&&(n=e),a.getDetails({placeId:n},function(e,t){t==google.maps.places.PlacesServiceStatus.OK?o.resolve(e):(console.log("error fetching place details"),o.reject())})}),o.promise},this.fetchData=function(a,r,c){var s=e.defer();return o(function(){s.reject()},15e3),t.get(n.apiUrl+"/dp/api/practices?lat="+a+"&lng="+r+"&age="+c+"&sort=1").then(function(e){i.collection=e.data,console.log("Got "+e.data.length+" practices from API."),s.resolve()},function(e){s.reject()}),s.promise}}])},87:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").controller("MainCtrl",["$scope","$rootScope","$window","$state","$timeout","SearchModel",function(e,t,o,n,a,i){e.options={country:"nz"},e.error="",e.details={},o.outerWidth>545?e.addressPlaceholder="Start typing an address":e.addressPlaceholder="Address",e.$watch("details",function(){a(function(){e.details.autocomplete=e.autocomplete},200)}),e.next=function(){e.$broadcast("show-errors-check-validity"),e.details.geometry&&!e.form.$invalid?(e.error="",console.log(e.details),i.initalizeModel(e.details.geometry.location.lat(),e.details.geometry.location.lng(),e.age,e.details.formatted_address,e.details.address_components[0].short_name+" "+e.details.address_components[1].short_name),t.$broadcast("geolocatedAddress"),n.go("result",{age:i.age,lat:i.coords[0],lng:i.coords[1]}).then(function(){console.log("Here we are, stuck by this river.")},function(){e.error="Something's broken :( Try again later.",e.isLoading=!1})):e.isLoading=!1}}])},88:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").controller("NavbarCtrl",["$scope","$state","$timeout","SearchModel",function(e,t,o,n){e.age=n.age,e.autocomplete=n.displayAddress,e.options={country:"nz"},e.details={},e.isCollapsed=1,e.$on("$stateChangeSuccess",function(t,o){"result"===o.name?e.navbarThings=1:e.navbarThings=0}),e.$watch("details",function(){o(function(){e.details.autocomplete=e.autocomplete},200)}),e.$on("geolocatedAddress",function(){e.age=n.age,e.autocomplete=n.displayAddress,e.details.autocomplete=e.autocomplete}),e.next=function(){if(e.details.geometry){if(e.$broadcast("show-errors-check-validity"),e.headerForm.$invalid)return;document.getElementById("practice-list").style.maxHeight=0,n.initalizeModel(e.details.geometry.location.lat(),e.details.geometry.location.lng(),e.age,e.details.formatted_address,e.details.address_components[0].short_name+" "+e.details.address_components[1].short_name),e.$broadcast("geolocatedAddress")}e.isCollapsed=1,t.transitionTo("result",{age:e.age,lat:e.details.geometry?e.details.geometry.location.lat():n.coords[0],lng:e.details.geometry?e.details.geometry.location.lng():n.coords[1]},{location:!0,inherit:!0,notify:!1})}}])},89:function(e,t,o){"use strict";o(90),o(91),o(92),angular.module("doctorpricerWebApp").controller("MapCtrl",["$scope","$timeout","$rootScope","$window","leafletData","PracticesCollection","SearchModel",function(e,t,o,n,a,i,r){var c,s=new google.maps.DirectionsService,l={markerBlue:L.AwesomeMarkers.icon({prefix:"glyphicon",icon:"glyphicon-home",markerColor:"blue"}),markerRed:L.AwesomeMarkers.icon({prefix:"fa",icon:"fa-user-md",markerColor:"red"})},d=function(){t(function(){var e=n.innerHeight-128+"px";document.getElementById("leaflet_map").style.height=e,document.getElementById("map_canvas").style.maxHeight=e},300)};angular.element(n).bind("resize",function(){d()}),e.$on("countUpdated",function(){u()}),e.$on("changePractice",function(){g(),p(function(){i.displayCollection[i.selectedPractice].marker.openPopup()})});var u=function(){if(0!==i.displayCollection.length){d();var n=[];e.paths={};var s=[],u=L.marker([r.coords[0],r.coords[1]],{title:"You",icon:l.markerBlue});s.push(u),n.push([r.coords[0],r.coords[1]]),angular.forEach(i.displayCollection,function(t,a){n.push([t.lat,t.lng]);var r=L.marker([parseFloat(t.lat),parseFloat(t.lng)],{title:t.name,icon:l.markerRed});r.bindPopup('<h5><a href="'+t.url+'" target="_blank">'+t.name+"</a><br><small>"+t.pho+"</small></h5>"),r.on("click",function(t){!function(t,n){e.navPractice(n,!1),g(),o.$broadcast("updateScroll")}(0,a)}),i.displayCollection[a].marker=r,s.push(r)});var p=L.latLngBounds(n);t(function(){a.getMap("leaflet_map").then(function(e){c&&e.removeLayer(c),c=L.featureGroup(s),e.addLayer(c),e.invalidateSize(),e.fitBounds(p,{padding:[80,80]})})},300)}},p=function(e){a.getMap("leaflet_map").then(function(t){var o=L.latLngBounds([i.displayCollection[i.selectedPractice].lat,i.displayCollection[i.selectedPractice].lng],[r.coords[0],r.coords[1]]);t.fitBounds(o,{padding:[60,60]}),e()})},g=function(){var t=new google.maps.LatLng(i.displayCollection[i.selectedPractice].lat,i.displayCollection[i.selectedPractice].lng),o={origin:new google.maps.LatLng(r.coords[0],r.coords[1]),destination:t,travelMode:google.maps.TravelMode.DRIVING,unitSystem:google.maps.UnitSystem.METRIC,optimizeWaypoints:!0};s.route(o,function(t,o){if(o===google.maps.DirectionsStatus.OK){var n=L.Polyline.fromEncoded(t.routes[0].overview_polyline).getLatLngs();e.paths.p1={color:"#387ef5",weight:6,latlngs:n,type:"polyline"}}else console.log("Error when fetching route: "+o)})};angular.extend(e,{center:{lat:0,lng:0,zoom:10},paths:{},scrollWheelZoom:!1,tiles:{name:"MapBox",url:"https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token={apikey}",type:"xyz",options:{attribution:'<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',apikey:"pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ"}}})}])},98:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").controller("ResultCtrl",["$scope","$timeout","$rootScope","$window","$state","$uibModal","error","PracticesCollection","SearchModel",function(e,t,o,n,a,i,r,c,s){1===r&&a.go("home"),e.sidebar=1,e.reviewCount=0,e.christchurch=s.christchurch,e.userAddress=s.address,e.map={active:!0},e.radiuses=[],e.practices=[],e.loading=!0,e.reportModal=function(){i.open({templateUrl:"views/report.html",size:"sm"}).result.then(function(){},function(){})},e.toggleSidebar=function(){e.sidebar=!e.sidebar},e.cancelSwipe=function(e){e.stopPropagation()},e.changeRadius=function(t){c.displayCollection=e.radiuses[t].practices,c.displayCollection.sort(function(e,t){var o=e.price,n=t.price;return o<n?-1:o>n?1:0}),e.practices=c.displayCollection,e.thisPractice={},e.map.active=!0,o.$broadcast("countUpdated")},e.reloadMap=function(){void 0!==c.selectedPractice&&o.$broadcast("changePractice")},e.navPractice=function(t,n){c.selectedPractice=t,e.thisPractice=e.practices[t],e.map.active&&n&&o.$broadcast("changePractice"),e.thisPractice.google||c.getGoogle(t).then(function(e){c.displayCollection[t].google=e,c.displayCollection[t].reviewCount="("+(e.reviews?e.reviews.length:0).toString()+")"})},e.isActive=function(e){return e===c.selectedPractice};var l=function(){t(function(){var t=n.innerHeight-128;e.christchurch&&(t-=98);var o=t+"px";document.getElementById("practice-list").style.maxHeight=o,document.getElementById("reviews").style.maxHeight=o},300)};angular.element(n).bind("resize",function(){c.screenHeight=n.innerHeight,l()}),o.$on("geolocatedAddress",function(){o.$apply(function(){o.title="DoctorPricer - "+s.displayAddress}),e.christchurch=s.christchurch,e.userAddress=s.address}),e.$on("countUpdated",function(){e.noPractices=0===c.displayCollection.length?1:0}),e.$on("newSearch",function(){e.map.active=!0,e.loading=!0,c.fetchData(s.coords[0],s.coords[1],s.age).then(function(t){e.practices=t,e.radiuses=[{key:0,name:"2km",distance:2e3,practices:[]},{key:1,name:"5km",distance:5e3,practices:[]},{key:2,name:"10km",distance:1e4,practices:[]},{key:3,name:"30km",distance:3e4,practices:[]},{key:4,name:"60km",distance:6e4,practices:[]}];for(var o=0;o<e.radiuses.length;o++){var n=e.radiuses[o].distance;0!=o&&e.radiuses[o].practices.push.apply(e.radiuses[o].practices,e.radiuses[o-1].practices);for(var a=0;a<c.collection.length;a++){if(c.collection[a].distance>n)break;e.radiuses[o].practices.push(c.collection[a]),c.collection.splice(a,1),a-=1}}console.log("Sorted the result into buckets.");for(o=e.radiuses.length-1;o>=0;o--)(0===e.radiuses[o].practices.length||o>0&&e.radiuses[o].practices.length===e.radiuses[o-1].practices.length)&&e.radiuses.splice(o,1);console.log("Removed empties and duplicates."),e.selectedRadius=e.radiuses[0],e.changeRadius(0),l(),e.loading=!1,console.log("Finished.")},function(e){console.log("Error getting the data:"+e),a.go("home")})}),o.$broadcast("newSearch")}])}});