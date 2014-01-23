timush.controller('ManualController', function ($scope, $http) {
    $scope.renderingTime = "Click on the button to test performance!";
    $scope.loading = false;


    var startLoading = function () {
        $scope.renderingTime = "Loading...";
        $scope.loading = true;
    }


    $scope.testPerformance = function () {
        startLoading();

        $http.post('/manual-performance', {}).success(function (res) {
            $scope.renderingTime = "Rendering took " + res[res.length - 1] + " milisecondush!";
            $scope.loading = false;
        });
    }

});