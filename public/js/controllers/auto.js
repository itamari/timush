timush.controller('AutoController', function ($scope, $http) {
    $scope.loading = true;
    $scope.sitesArray = [];

    var init = function(){
        $scope.getSites();
    }

    $scope.getSites = function() {
        $http.get('/get-sites').success(function (res) {
            $scope.sitesArray = res;
            $scope.loading = false;
        });
    }

    $scope.setSites = function () {
        $scope.loading = true;
        $http.post('/add-site', { site : $scope.siteToAdd }).success(function (res) {
            $scope.sitesArray = res;
            $scope.loading = false;
        });
    }

    $scope.removeSite = function(index){
        $http.post('/remove-site', { site : $scope.sitesArray[index] }).success(function (res) {
            $scope.sitesArray = res;
            $scope.loading = false;
        });
    }

    init();
});