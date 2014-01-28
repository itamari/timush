timush.controller('ManualController', function ($scope, $http) {
    $scope.infoMessage = "Click on the button to test performance!";
    $scope.loading = false;
    $scope.manualSiteInput = '';


    var startLoading = function () {
        $scope.infoMessage = "Loading... (This will take approx 20 seconds!)";
        $scope.loading = true;
    }


    $scope.testPerformance = function () {
        startLoading();

        $http.post('/manual-performance', { site : $scope.manualSiteInput }).success(function (res) {
            $scope.infoMessage = res;
            $scope.loading = false;
        });
    }

});