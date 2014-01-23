timush.controller('StatisticsController', function ($scope, $location) {
    $scope.loading = false;

    var init = function(){

    }

    $scope.download = function(){
        window.open("/download")
    }

    init();
});