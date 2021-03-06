var app = angular.module("URLShortener");

app.controller("urlController", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
    $http.get("/api/v1/urls/" + $routeParams.shortUrl)
        .success(function (data) {
            $scope.shortUrl = data.shortUrl;
            $scope.longUrl = data.longUrl;
            $scope.shortUrlToShow = "http://localhost/" + data.shortUrl;
        });
    $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/totalClicks")
        .success(function (data) {
            $scope.totalClicks = data;
        });

    $scope.hour = "hour";
    $scope.day = "day";
    $scope.month = "month";

    $scope.getTime = function (time) {
        $scope.lineLabels = [];
        $scope.lineData = [];
        $scope.time = time;
        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + time)
            .success(function (data) {
                data.forEach(function (info) {

                    var legend = '';
                    if (time === 'hour') {
                        if (info._id.minute < 10) {
                            info._id.minute = '0' + info._id.minute;
                        }
                        legend = info._id.hour + ':' + info._id.minute;
                    }
                    if (time === 'day') {
                        legend = info._id.hour + ':00';
                    }
                    if (time === 'month') {
                        legend = info._id.month + '/' + info._id.day;
                    }

                    $scope['lineLabels'].push(legend);
                    $scope['lineData'].push(info.count);
                });
            });
    };

    $scope.getTime('hour');

    var renderChart = function (chart, infos) {
        $scope[chart + 'Labels'] = [];
        $scope[chart + 'Data'] = [];
        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
            .success(function (data) {
                data.forEach(function (info) {
                    $scope[chart + 'Labels'].push(info._id);
                    $scope[chart + 'Data'].push(info.count);
                });
            });
    };

    renderChart("pie", "referer");
    renderChart("doughnut", "country");
    renderChart("bar", "platform");
    renderChart("base", "browser");

}]);