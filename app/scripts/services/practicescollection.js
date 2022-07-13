"use strict";

/**
 * @ngdoc function
 * @name doctorpricerWebApp.services:self
 * @description
 * # self
 * Service for sharing practice collection data between controllers, and provides methods for processing it.
 */

angular.module("doctorpricerWebApp").service("PracticesCollection", [
  "$q",
  "$http",
  "$timeout",
  "$rootScope",
  function ($q, $http, $timeout, $rootScope) {
    var service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    var self = this;

    this.length = 0;
    this.lastPractice = undefined;
    this.displayCollection = [];
    this.selectedPractice = undefined;
    this.christchurch = false;

    this.getPlaceId = function (place_id, id) {
      var defer = $q.defer();

      if (place_id == null) {
        var name = self.displayCollection[id]["name"];
        var lat = self.displayCollection[id]["lat"];
        var lng = self.displayCollection[id]["lng"];
        var request = {
          query: name,
          radius: 0.5,
          location: new google.maps.LatLng(lat, lng),
        };
        service.textSearch(request, function (result, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            defer.resolve(result[0].place_id);
          } else {
            defer.reject("Error finding place");
          }
        });
      } else {
        defer.resolve();
      }

      return defer.promise;
    };

    /* Gets google reviews for a place */
    this.getGoogle = function (id) {
      var defer = $q.defer();
      var place_id = self.displayCollection[id]["place_id"] || null;

      // if we found no place_id during scraping then try it now
      self.getPlaceId(place_id, id).then(function (result) {
        if (result) {
          place_id = result;
        }
        // get the actual details
        service.getDetails({ placeId: place_id }, function (result, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            defer.resolve(result);
          } else {
            defer.reject("Error fetching place details from Google");
          }
        });
      });

      return defer.promise;
    };

    /* Fetches the data from the JSON via a promise*/
    this.fetchData = function (lat, lng, age, csc) {
      var defer = $q.defer();

      $timeout(function () {
        defer.reject("Timeout getting practices from API, maybe it is broken.");
      }, 15000);

      $http
        .get(
          $rootScope.apiUrl +
            "/dp/api/practices?lat=" +
            lat +
            "&lng=" +
            lng +
            "&age=" +
            age +
            "&csc=" +
            csc +
            "&sort=1"
        )
        .then(
          function (response) {
            console.log(
              "[PRACTICESCOLLECTION] Got " +
                response.data.length +
                " practices from API."
            );
            self.sortedPractices = response.data;
            self.selectedPractice = undefined;
            self.changeRadius(0);
            defer.resolve(response.data);
          },
          function (error) {
            defer.reject("Error getting practices from API: " + error);
          }
        );
      return defer.promise;
    };

    this.changeRadius = function (index, filter=false) {
      // Buckets contain only practices within their radius, so we need to sum
      // buckets up to that radius.
      let practices = this.sortedPractices.reduce((acc, bucket, i) => {
        if (i <= index) {
          console.log('[PRACTICESCOLLECTION] Adding practices from radius: ' + bucket['name'])
          acc.push(...bucket['practices'])
        }
        return acc
      }, [])

      if (filter == true) {
        practices = practices.filter(
          (practice) => practice.active != false && practice.price != 999
        );
      }
      practices = practices.sort((a, b) => a.price < b.price ? -1 : 1);
      this.displayCollection = practices
      $rootScope.$broadcast("countUpdated");
    };

    /* Filter out practices which are ineligible or not enrolling */
    this.changeFilter = function (filter, index) {
      if (filter == true) {
        this.displayCollection = this.displayCollection.filter(
          (practice) => practice.active != false && practice.price != 999
        );
      } else {
        this.displayCollection = this.sortedPractices[index]["practices"];
      }
      $rootScope.$broadcast("countUpdated");
    };

  },
]);
