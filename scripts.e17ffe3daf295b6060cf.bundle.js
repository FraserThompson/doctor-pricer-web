!function(e){function t(t){for(var n,r,s=t[0],c=t[1],l=t[2],u=0,p=[];u<s.length;u++)r=s[u],a[r]&&p.push(a[r][0]),a[r]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);for(d&&d(t);p.length;)p.shift()();return i.push.apply(i,l||[]),o()}function o(){for(var e,t=0;t<i.length;t++){for(var o=i[t],n=!0,s=1;s<o.length;s++){var c=o[s];0!==a[c]&&(n=!1)}n&&(i.splice(t--,1),e=r(r.s=o[0]))}return e}var n={},a={1:0},i=[];function r(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=n,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var s=window.webpackJsonp=window.webpackJsonp||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var d=c;i.push([37,2]),o()}({37:function(e,t,o){o(38);o(39),o(84),o(85),o(86),o(87),o(88),o(89),o(98)},39:function(e,t,o){"use strict";o(7),o(41),o(46),o(47);var n=o(48).default;o(50),angular.module("doctorpricerWebApp",["ui.router.state.events",n,"nemLogging","ui-leaflet","ui.bootstrap.showErrors",o(51),o(53),o(56),o(60),o(72),o(73),o(75),o(77),o(79),o(81)]).run(["$rootScope","$uibModal",function(e,t){e.title="Doctor price comparison NZ | Find the cheapest doctor | DoctorPricer",e.apiUrl="https://api.doctorpricer.co.nz",e.openDialog=function(){t.open({templateUrl:"views/info.html"}).result.then(function(){},function(){})}}]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(e,t,o){t.otherwise("/"),o.html5Mode(!0),e.state("home",{url:"/",templateUrl:"views/main.html",controller:"MainCtrl",onEnter:["$rootScope",function(e){e.hideFb=!1,e.title="Doctor price comparison NZ | Find the cheapest doctor | DoctorPricer",e.app_loaded=!0,e.autocompleteSize="big-autocomplete"}]}).state("result",{url:"/:lat,:lng/:age",templateUrl:"views/result.html",controller:"ResultCtrl",reloadOnSearch:!1,params:{address:null,display_address:null},resolve:{error:["$stateParams","$q","$rootScope",function(e,t,o){console.log("[RESOLVE] Checking for errors in URL..."),o.app_loaded=!0,o.results_loading=!0;var n=t.defer();return isNaN(parseFloat(e.lat))||isNaN(parseFloat(e.lng))||isNaN(parseInt(e.age))?n.reject("URL params are somehow not right"):n.resolve(),n.promise}],initializeSearchModel:["SearchModel","$stateParams",function(e,t){return console.log("[RESOLVE] Initializing search model..."),e.initalizeModel(t.lat,t.lng,t.age,t.address,t.display_address)}],fetchedPractices:["$state","$stateParams","PracticesCollection",function(e,t,o){return console.log("[RESOLVE] Fetching practices..."),o.fetchData(t.lat,t.lng,t.age)}],sortedPractices:["fetchedPractices","PracticesCollection",function(e,t){return console.log("[RESOLVE] Sorting practices..."),t.sortData(e)}]},onEnter:["$rootScope","$timeout","$window","SearchModel",function(e,t,o,n){window.innerWidth<=481&&(e.hideFb=!0),e.autocompleteSize="small-autocomplete",e.title="DoctorPricer - "+n.displayAddress}]})}])},72:function(e,t,o){"use strict";angular.module("ngAutocomplete",[]).directive("ngAutocomplete",function(){return{require:"ngModel",scope:{ngModel:"=",options:"=?",details:"=?"},link:function(e,t,o,n){var a,i=!1;void 0==e.gPlace&&(e.gPlace=new google.maps.places.Autocomplete(t[0],{})),google.maps.event.addListener(e.gPlace,"place_changed",function(){var o=e.gPlace.getPlace();void 0!==o&&(void 0!==o.address_components?e.$apply(function(){e.details=o,n.$setViewValue(t.val())}):i&&r(o))});var r=function(o){var a=new google.maps.places.AutocompleteService;o.name.length>0&&a.getPlacePredictions({input:o.name,offset:o.name.length},function(o,a){null==o||0==o.length?e.$apply(function(){e.details=null}):new google.maps.places.PlacesService(t[0]).getDetails({reference:o[0].reference},function(o,a){a==google.maps.GeocoderStatus.OK&&e.$apply(function(){n.$setViewValue(o.formatted_address),t.val(o.formatted_address),e.details=o;t.on("focusout",function(e){t.val(o.formatted_address),t.unbind("focusout")})})})})};n.$render=function(){var e=n.$viewValue;t.val(e)},e.watchOptions=function(){return e.options},e.$watch(e.watchOptions,function(){a={},e.options&&(i=!0===e.options.watchEnter,e.options.types?(a.types=[],a.types.push(e.options.types),e.gPlace.setTypes(a.types)):e.gPlace.setTypes([]),e.options.bounds?(a.bounds=e.options.bounds,e.gPlace.setBounds(a.bounds)):e.gPlace.setBounds(null),e.options.country?(a.componentRestrictions={country:e.options.country},e.gPlace.setComponentRestrictions(a.componentRestrictions)):e.gPlace.setComponentRestrictions(null))},!0)}}}),e.exports="ngAutocomplete"},84:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").directive("addressValidation",function(){return{restrict:"A",require:"ngModel",link:function(e,t,o,n){n.$validators.addressValidation=function(t){return!n.$isEmpty(t)&&!(e.details.autocomplete!==e.autocomplete||!e.details.geometry)}}}}).directive("autoScroll",["PracticesCollection",function(e){return{restrict:"A",link:function(t,o){t.$on("updateScroll",function(){var t=angular.element(o[0]),n=angular.element(document.getElementById("practice_"+e.selectedPractice));t.duScrollTo(n,0,250)})}}}]).directive("loadingButton",["$timeout",function(e){return{replace:"true",require:"^form",template:'<span><span ng-hide="!isLoading"><i class="fa fa-spinner fa-spin fa-lg" style="font-size: 24px;"></i></span><button ng-hide="isLoading" type="submit" class="btn btn-cool {{btnSize}}"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> Search</button></span>',link:function(e,t,o,n){e.btnSize=o.btnSize,e.$on("countUpdated",function(){e.isLoading=!1}),t.bind("click",function(){n.$invalid?e.isLoading=!1:e.isLoading=!0})}}}]).directive("stupidAd",["$timeout",function(e){return{replace:"true",template:'<div class="stupid-ad {{class}}"> \t\t\t\t\t\t<ins class="adsbygoogle stupid-adsbygoogle" \t\t\t\t\t\tstyle="display:block" \t\t\t\t\t\tdata-ad-client="ca-pub-2527917281752489" \t\t\t\t\t\tdata-ad-slot="1395256542" \t\t\t\t\t\tdata-ad-format="auto" \t\t\t\t\t\tdata-full-width-responsive="false" \t\t\t\t\t\t</ins> \t\t\t\t\t\t</div>',link:function(){e(function(){try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){console.error(e)}},1e3)}}}]).directive("disableTap",["$timeout",function(e){return{link:function(){e(function(){var e=document.getElementsByClassName("pac-container");angular.element(e).attr("data-tap-disabled","true")},500)}}}])},85:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").service("SearchModel",["$q",function(e){var t=this;this.address="None",this.displayAddress="Address",this.age="Age",this.coords=void 0,this.checkForChristchurch=function(e){return e.indexOf("Christchurch")>-1},this.initalizeModel=function(o,n,a,i,r){var s=e.defer();if(this.coords="string"==typeof o||"string"==typeof n?[parseFloat(o),parseFloat(n)]:[o,n],this.age=a,i&&r)console.log("[SEARCHMODEL] Thanks for the address, that means I don't have to geocode it."),this.address=i,this.displayAddress=r,this.christchurch=this.checkForChristchurch(i),s.resolve();else{console.log("[SEARCHMODEL] No address, looks like I'll have to geocode it I guess.");var c=new google.maps.Geocoder,l=new google.maps.LatLng(o,n);c.geocode({latLng:l,region:"NZ"},function(e,o){if(o===google.maps.GeocoderStatus.OK){t.christchurch=t.checkForChristchurch(e[0].formatted_address),t.displayAddress=e[0].address_components[0].short_name+" "+e[0].address_components[1].short_name,t.address=e[0].formatted_address;var n=e[3].formatted_address;ga("send","pageview","/results.php?address="+n+"&age="+t.age),s.resolve()}else s.reject("Error geocoding input address.")})}return s.promise}}])},86:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").service("PracticesCollection",["$q","$http","$timeout","$rootScope",function(e,t,o,n){var a=new google.maps.places.PlacesService(document.createElement("div")),i=this;this.length=0,this.lastPractice=void 0,this.displayCollection=[],this.selectedPractice=void 0,this.christchurch=!1,this.getPlaceId=function(t,o){var n=e.defer();if(null==t){var r=i.displayCollection[o].name,s=i.displayCollection[o].lat,c=i.displayCollection[o].lng,l={query:r,radius:.5,location:new google.maps.LatLng(s,c)};a.textSearch(l,function(e,t){t==google.maps.places.PlacesServiceStatus.OK?n.resolve(e[0].place_id):n.reject("Error finding place")})}else n.resolve();return n.promise},this.getGoogle=function(t){var o=e.defer(),n=i.displayCollection[t].place_id||null;return i.getPlaceId(n,t).then(function(e){e&&(n=e),a.getDetails({placeId:n},function(e,t){t==google.maps.places.PlacesServiceStatus.OK?o.resolve(e):o.reject("Error fetching place details from Google")})}),o.promise},this.fetchData=function(a,r,s){var c=e.defer();return o(function(){c.reject("Timeout getting practices from API, maybe it is broken.")},15e3),t.get(n.apiUrl+"/dp/api/practices?lat="+a+"&lng="+r+"&age="+s+"&sort=1").then(function(e){i.collection=e.data,console.log("[PRACTICESCOLLECTION] Got "+e.data.length+" practices from API."),c.resolve(e.data)},function(e){c.reject("Error getting practices from API: "+e)}),c.promise},this.sortData=function(e){for(var t=[{name:"2km",distance:2e3,practices:[]},{name:"5km",distance:5e3,practices:[]},{name:"10km",distance:1e4,practices:[]},{name:"30km",distance:3e4,practices:[]},{name:"60km",distance:6e4,practices:[]}],o=0;o<t.length;o++){var n=t[o].distance;0!=o&&t[o].practices.push.apply(t[o].practices,t[o-1].practices);for(var a=0;a<e.length;a++){if(e[a].distance>n)break;t[o].practices.push(e[a]),e.splice(a,1),a-=1}}console.log("[PRACTICESCOLLECTION] Sorted the result into buckets.");for(o=t.length-1;o>=0;o--)(0===t[o].practices.length||o>0&&t[o].practices.length===t[o-1].practices.length)&&t.splice(o,1);return console.log("[PRACTICESCOLLECTION] Removed empties and duplicates."),this.sortedPractices=t,this.changeRadius(0),this.selectedPractice=void 0,t},this.changeRadius=function(e){this.displayCollection=this.sortedPractices[e].practices,this.displayCollection.sort(r),n.$broadcast("countUpdated")};var r=function(e,t){return e.price<t.price?-1:e.price>t.price?1:0}}])},87:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").controller("MainCtrl",["$scope","$rootScope","$window","$state","$timeout","SearchModel",function(e,t,o,n,a,i){e.options={country:"nz"},e.error="",e.details={},o.outerWidth>545?e.addressPlaceholder="Start typing an address":e.addressPlaceholder="Address",e.$watch("details",function(){a(function(){e.details.autocomplete=e.autocomplete},200)}),e.hideAd=function(){var e=document.getElementsByClassName("adsbygoogle");e[0]&&o.outerWidth<545&&(e[0].style.display="none")},e.showAd=function(){var e=document.getElementsByClassName("adsbygoogle");e[0]&&o.outerWidth<545&&(e[0].style.display="block")},e.next=function(){e.$broadcast("show-errors-check-validity"),e.details.geometry&&!e.form.$invalid?(e.error="",n.go("result",{age:e.age,lat:e.details.geometry.location.lat(),lng:e.details.geometry.location.lng(),address:e.details.formatted_address,"#":"list",display_address:e.details.address_components[0].short_name+" "+e.details.address_components[1].short_name}).then(function(){console.log("Here we are, stuck by this river.")},function(){e.error="Something's broken :( Try again later.",e.isLoading=!1})):e.isLoading=!1}}])},88:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").controller("NavbarCtrl",["$scope","$rootScope","$state","$timeout","SearchModel",function(e,t,o,n,a){e.age=a.age,e.autocomplete=a.displayAddress,e.options={country:"nz"},e.details={},e.isCollapsed=1,e.$on("$stateChangeSuccess",function(t,o){"result"===o.name?(e.navbarThings=1,e.age=a.age,e.autocomplete=a.displayAddress,e.details.autocomplete=e.autocomplete):e.navbarThings=0}),e.$watch("details",function(){n(function(){e.details.autocomplete=e.autocomplete},200)}),e.next=function(){e.details.geometry?(e.$broadcast("show-errors-check-validity"),e.headerForm.$invalid||(document.getElementById("practice-list").style.maxHeight=0,e.isCollapsed=1,o.go("result",{age:e.age,lat:e.details.geometry.location.lat(),lng:e.details.geometry.location.lng(),address:e.details.formatted_address,"#":"list",display_address:e.details.address_components[0].short_name+" "+e.details.address_components[1].short_name}).then(function(){console.log("Here we are, stuck by this river."),e.isLoading=!1},function(){e.error="Something's broken :( Try again later.",e.isLoading=!1}))):console.log("[NAVBAR] No new search so doing nothing.")}}])},89:function(e,t,o){"use strict";o(90),o(91),o(92),angular.module("doctorpricerWebApp").controller("MapCtrl",["$scope","$timeout","$rootScope","$window","leafletData","PracticesCollection","SearchModel",function(e,t,o,n,a,i,r){var s,c=new google.maps.DirectionsService,l={markerBlue:L.AwesomeMarkers.icon({prefix:"glyphicon",icon:"glyphicon-home",markerColor:"blue"}),markerRed:L.AwesomeMarkers.icon({prefix:"fa",icon:"fa-user-md",markerColor:"red"})},d=function(){t(function(){var e=document.getElementById("leaflet_map"),t=document.getElementById("map_canvas");if(e){var o=n.innerHeight-128+"px";e.style.height=o,t.style.maxHeight=o}},300)};angular.element(n).bind("resize",function(){d()}),e.$watch("$viewContentLoaded",function(){u()}),o.$on("countUpdated",function(){u()}),e.$on("changePractice",function(){g(),p(function(){i.displayCollection[i.selectedPractice].marker.openPopup()})});var u=function(){if(0!==i.displayCollection.length){d();var n=[];e.paths={};var c=[],u=L.marker([r.coords[0],r.coords[1]],{title:"You",icon:l.markerBlue});c.push(u),n.push([r.coords[0],r.coords[1]]),angular.forEach(i.displayCollection,function(t,a){n.push([t.lat,t.lng]);var r=L.marker([parseFloat(t.lat),parseFloat(t.lng)],{title:t.name,icon:l.markerRed});r.bindPopup('<h5><a href="'+t.url+'" target="_blank">'+t.name+"</a><br><small>"+t.pho+"</small></h5>"),r.on("click",function(t){!function(t,n){e.navPractice(n,!1),g(),o.$broadcast("updateScroll")}(0,a)}),i.displayCollection[a].marker=r,c.push(r)});var p=L.latLngBounds(n);t(function(){a.getMap("leaflet_map").then(function(e){s&&e.removeLayer(s),s=L.featureGroup(c),e.addLayer(s),e.invalidateSize(),e.fitBounds(p,{padding:[80,80]})})},300)}},p=function(e){a.getMap("leaflet_map").then(function(t){var o=L.latLngBounds([i.displayCollection[i.selectedPractice].lat,i.displayCollection[i.selectedPractice].lng],[r.coords[0],r.coords[1]]);t.fitBounds(o,{padding:[60,60]}),e()})},g=function(){var t=new google.maps.LatLng(i.displayCollection[i.selectedPractice].lat,i.displayCollection[i.selectedPractice].lng),o={origin:new google.maps.LatLng(r.coords[0],r.coords[1]),destination:t,travelMode:google.maps.TravelMode.DRIVING,unitSystem:google.maps.UnitSystem.METRIC,optimizeWaypoints:!0};c.route(o,function(t,o){if(o===google.maps.DirectionsStatus.OK){var n=L.Polyline.fromEncoded(t.routes[0].overview_polyline).getLatLngs();e.paths.p1={color:"#387ef5",weight:6,latlngs:n,type:"polyline"}}else console.log("Error when fetching route: "+o)})};angular.extend(e,{center:{lat:0,lng:0,zoom:10},paths:{},scrollWheelZoom:!1,tiles:{name:"MapBox",url:"https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token={apikey}",type:"xyz",options:{attribution:'<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',apikey:"pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ"}}})}])},98:function(e,t,o){"use strict";angular.module("doctorpricerWebApp").controller("ResultCtrl",["$scope","$timeout","$rootScope","$window","$state","$transitions","$stateParams","$uibModal","error","sortedPractices","PracticesCollection","SearchModel",function(e,t,o,n,a,i,r,s,c,l,d,u){1===c&&a.go("home"),e.userAddress=u.address,e.christchurch=u.christchurch,e.practices=d.displayCollection,e.noPractices=function(){return 0===d.displayCollection.length?1:0},e.radiuses=l,e.selectedRadius=e.radiuses[0],e.thisPractice={},e.sidebar="map"==r.menu?0:1,e.reviewCount=0,e.map={active:!0},e.loading=!1,i.onSuccess({},function(t){var o=t.params()["#"];e.sidebar="map"==o?0:1}),e.$watch("$viewContentLoaded",function(){o.results_loading=!1}),e.reportModal=function(){s.open({templateUrl:"views/report.html",size:"sm"}).result.then(function(){},function(){})},e.toggleSidebar=function(){e.sidebar=!e.sidebar,a.go("result",{"#":0==e.sidebar?"map":"list"},{inherit:!0,notify:!1})},e.cancelSwipe=function(e){e.stopPropagation()},e.changeRadius=function(t){d.changeRadius(t),e.practices=d.displayCollection,e.thisPractice={},e.map.active=!0},e.reloadMap=function(){void 0!==d.selectedPractice&&o.$broadcast("changePractice")},e.navPractice=function(t,n){d.selectedPractice=t,e.thisPractice=e.practices[t],e.map.active&&n&&o.$broadcast("changePractice"),e.thisPractice.google||d.getGoogle(t).then(function(e){d.displayCollection[t].google=e,d.displayCollection[t].reviewCount="("+(e.reviews?e.reviews.length:0).toString()+")"})},e.isActive=function(e){return e===d.selectedPractice};var p=function(){t(function(){var t=n.innerHeight-128;e.christchurch&&(t-=98);var o=t+"px",a=t+2+"px";document.getElementById("practice-list").style.maxHeight=a,document.getElementById("reviews").style.maxHeight=o},300)};angular.element(n).bind("resize",function(){d.screenHeight=n.innerHeight,p()}),e.$on("countUpdated",function(){e.noPractices()}),p()}])}});