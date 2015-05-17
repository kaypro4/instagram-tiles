var app = angular.module('app',['ngRoute', 'app.controllers'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/main.html', controller: 'InstagramCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});

}]);

app.directive('click', function(){
  return{
    link: function (scope, element, attr) {
    element.bind('click',function () {
      var loc = $(this).position();
      $('html,body').animate({ scrollTop: loc.top }, 'slow');
    });
    }
  }
});


var appControllers = angular.module('app.controllers', []);

appControllers.controller('InstagramCtrl',  function( $scope, $http, $routeParams){

  // $scope.max = $routeParams.max;
  //console.log($scope.max)

  var client_id = 'adbc1bf81cb94269b5a869b449262727';
  var url = 'https://api.instagram.com/v1/'
    + 'users/search?q=cityfruitseattle'
    + '&client_id=' + client_id
    + '&callback=JSON_CALLBACK'
    //console.log( url )
        // Call End Point
	$http.jsonp(url).
        then(function(response) {
          //console.log(response)
          $scope.userID = response.data.data[0].id;
          $scope.userName = response.data.data[0].username;
          //console.log( $scope.userName );
          $scope.getUserImages($scope.userID);
  });

  $scope.imageFeed = [];

  $scope.getUserImages = function(userID){
      var url = 'https://api.instagram.com/v1'
      + '/users/' + userID
      + '/media/recent/'
      + '?callback=JSON_CALLBACK'
      + '&count=18'
      + '&client_id=' + client_id

      if( $scope.max ) {
        url += '&max_id=' + $scope.max
      }
    // Call End Point
    $http.jsonp(url).
          then(function(response) {

            $scope.userImages = response;
            $scope.max =  response.data.pagination.next_max_id;

            //console.log($scope.max)

            if( $scope.imageFeed.length == 0){
              $scope.imageFeed = $scope.userImages.data.data;
            } else {
              $scope.imageFeed = $scope.imageFeed.concat( $scope.userImages.data.data );
            }
        });
  }


})


