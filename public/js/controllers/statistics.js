timush.controller('StatisticsController', function ($scope, $http) {
    $scope.loading = false;

    var init = function(){

    }

    $scope.download = function(){
        window.open("/download")
    }

    $scope.fetchData = function(){
        $http.get('/get-data').success(function (res) {
            //$scope.infoMessage = res;
            console.log(res);
            $scope.loading = false;
        });
    }

    init();
});