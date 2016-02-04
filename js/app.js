var app = angular.module('app', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {templateUrl: 'partials/home.html', controller: 'mainController'})
    .when('/puzzle', {templateUrl: 'partials/puzzle.html', controller: 'mainController'})
    .when('/victory', {templateUrl: 'partials/victory.html', controller: 'mainController'})
    .otherwise({
       redirectTo: '/'
    });
}]);

app.controller('mainController', function($scope, $location, $interval) {
    //allows current view t be changed
    $scope.changeView = function (path) {
       $location.path(path);
    };

    //array shuffling algorithm
    $scope.random = function(o) {
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    $scope.pieces = $scope.random(pieces);

    //count and iterator for original pieces array
    $scope.pieceCount = 0;

    angular.forEach(pieces, function(value){
        $scope.pieceCount++;
    });

    //count and iterator for dropped pieces 
    $scope.dropCount = 0;

    $scope.$on('drop', function(){
        $scope.dropCount++;
    });

    //updates view slightly based on number of correctly dropped elements vs. originally piece array length
    $scope.countDrop = function() {
        if($scope.pieceCount <= $scope.dropCount) {
            angular.element('.pieces').remove();
            angular.element('.grid-square').remove();
            angular.element('.container').prepend("<p><strong>Congratulations,  you did it! Good dragging!</strong></p><br>");
            angular.element('.container').append("<img class='final-image' src='img/final.jpg'>");
        } else {
           angular.element('#update').text("Not yet - keep at it!").fadeIn(10).fadeOut(1850);
        }
    };
});

//directive covering drggable elements
app.directive('draggable', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.draggable({
              // making elements snap to grid squares
                snap: '.grid-square',
                snapMode: 'inner'
            });
        }
    };
});

//directive covering droppable sections & what they accept
app. directive('droppable', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.droppable({
                accept: function(drag) {
                    var dropId = $(this).data('index');
                    var dragId = $(drag).data('index');
                    //var dragId = $(drag).attr('data-index');

                    //comparing dragged element & dropped element data-indexs
                    return dropId === dragId;
                },
                drop: function() {
                    $rootScope.$broadcast('drop');
                }
            });            
        }
    };
});



