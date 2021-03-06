var app = angular.module('moviedash.landing', []);

app.controller('LandingCtrl', ['$scope', '$location', 'MovieClient', '$http',
  function ($scope, $location, MovieClient, $http) {
    $scope.modality = "driving";
    $scope.leavingTime = "0";

    //Checks if geolocation is available, shows form if not
    $scope.findLocation = function() {
      $scope.error = null;
      $scope.isLoading = true;
      if (!navigator.geolocation) {
        $scope.error= "Geolocation is not supported by your browser. Please enter your zipcode.";
      }

      function success(position) {
        $scope.isLoading = false;
        //if location is found, sets lat and long
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        sendQuery(latitude, longitude);
      }

      function error() {
        $scope.isLoading = false;
        //on error, shows input form
        $scope.error = "Unable to retrieve location. Please enter your zipcode.";
      }

      //calls for geolocation on button click
      navigator.geolocation.getCurrentPosition(success, error);
    };

    //handles submit from form and sends zip to factory
    $scope.zipSubmit = function() {
      $scope.isLoading = true;
      $scope.error = null;
      $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.zip).then(function (response) {
        var lat = response.data.results[0].geometry.location.lat;
        var long = response.data.results[0].geometry.location.lng;
        sendQuery(lat, long);
      });
    };

    var sendQuery = function(lat, long) {
      $scope.location = lat + ', ' + long;
      var leavingMS = Date.now() + parseInt($scope.leavingTime);
      console.log(new Date(leavingMS));
      $scope.query = {
        location: $scope.location,
        modality : $scope.modality,
        leavingTime: leavingMS
      };
      MovieClient.getTheaters($scope.query).then(function(response) {
        handleResults(response);
      });
    };

    var handleResults = function(response) {
      $scope.isLoading = false;
      if (!response.data) {
        $scope.error = "No movies are available at this time. Please try again later.";
        return;
      } else {
        MovieClient.setResults(response);
        $location.path('/movies');
      }
    };
  }]);
