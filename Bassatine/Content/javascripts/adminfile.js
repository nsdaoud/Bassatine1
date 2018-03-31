var adminApp = angular.module('adminApp', []);
adminApp.controller('adminAppController', function ($scope, $http) {

    showLoader();
    $scope.LstZones;
    $scope.LstJobs;
    $scope.exportPDF = true;
    $http.get('/api/admin/Jobs').then(
      function success(response) {
          $scope.LstJobs = response.data;
          hideLoader();
      },
      function error(response) {
          alert(response.statusText);
      });


    $scope.showJobZone = function () {
        //alert("w");
        if ($scope.codePoste != 'ALL') {
             $http.get('/api/admin/Zones?codePoste=' + $scope.codePoste).then(
                       function success(response) {
                           $scope.LstZones = response.data;
                           hideLoader();
                       },
                       function error(response) {
                           alert(response.statusText);
                       });
        }
       
    };

    //$http.get('/api/admin/Zones').then(
    //   function success(response) {
    //       $scope.LstZones = response.data;
    //       hideLoader();
    //   },
    //   function error(response) {
    //       alert(response.statusText);
    //   });

    $scope.generateReport = function () {
        window.open('/admin/TrackUserRoleJob?codeCompletZone=' + $scope.codeCompletZone + '&codePoste=' + $scope.codePoste + '&exportPDF=' + $scope.exportPDF, '_blank');

    }
});