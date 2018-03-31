var hrreportApp = angular.module('hrreportApp', []);
hrreportApp.controller('hrreportAppController', function ($scope, $http) {
    showLoader();
    $scope.LstTAFReportJobs;

    function formatDate(date) {

        var fullDate = new Date(date);
        var dd = fullDate.getDate();
        var mm = moment().month(fullDate.getMonth()).format('MMMM');  //January is 0!
        var yyyy = fullDate.getFullYear();
        if (dd < 10) dd = '0' + dd
        if (mm < 10) mm = '0' + mm
        fullDate = dd + '-' + mm + '-' + yyyy;
        return fullDate;
    }

    function formatDatemmddyyyy(date) {

        var fullDate = new Date(date);
        var dd = fullDate.getDate();
        var mm = fullDate.getMonth() + 1; //January is 0!
        var yyyy = fullDate.getFullYear();
        if (dd < 10) dd = '0' + dd
        if (mm < 10) mm = '0' + mm
        fullDate = dd + '/' + mm + '/' + yyyy;
        return fullDate;
    }



    //Get formatted date of Today
    function FirstdayOfCurrentYear() {
        return formatDate(new Date(new Date().getFullYear(), 0, 1));
    }

    function today() {
        return formatDate(new Date());
    }

    function LastdayOfCurrentYear() {
        return formatDate(new Date(new Date().getFullYear(), 11, 31));
    }

    $scope.id_Poste = '';
    //$scope.dateFrom = new Date(new Date().getFullYear(), 0, 1);
    //$scope.dateTo = '';
    $scope.dateFrom = FirstdayOfCurrentYear();
    $scope.dateTo = LastdayOfCurrentYear(); //today();
    $scope.exportPDF = true;

    $scope.link = '';

    $scope.reportTitle = $.QueryString["reportTitle"];
    //alert($scope.reportTitle);

    hideLoader();
    // Get Travel Jobs
    // Get Travel Jobs

    $scope.generateReport = function () {
        var validationMessage = '';
        if ($scope.dateTo == undefined || $scope.dateTo == 'undefined') {
            validationMessage = validationMessage + 'Date To is missing\n';

        }

        if ($scope.dateFrom == undefined || $scope.dateFrom == 'undefined') {
            validationMessage = validationMessage + 'Date From is missing\n';

        }
        if (validationMessage == '') {
            if ($scope.dateFrom < $scope.dateTo) {
                svalidationMessage = validationMessage + 'To Date is greater than From Date \n';
            }
        }

        function parseDate(value) {
            var m = value.match(/^(\d{1,2})(\/|-)?(\d{1,2})(\/|-)?(\d{4})$/);
            if (m)
                value = m[5] + '-' + ("00" + m[3]).slice(-2) + '-' + ("00" + m[1]).slice(-2);

            return value;
        }

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }
        if ($scope.reportTitle == "job") {
            //alert($scope.reportTitle);
            window.open('/HRReports/rptEmployeeJobMovement?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&exportPDF=' + $scope.exportPDF, '_blank');
        } else if ($scope.reportTitle == "position") {
            window.open('/HRReports/rptEmployeePositionMovement?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&exportPDF=' + $scope.exportPDF, '_blank');
        } else if ($scope.reportTitle == "tbjob") {
            //$scope.dateTos = formatDatemmddyyyy($scope.dateTo);
            //alert($scope.dateTos);
            window.open('/HRReports/rptTBEmployeeJobMovement?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&exportPDF=' + $scope.exportPDF, '_blank');
        } else {
            //alert('ss');
            window.open('/HRReports/rptTBEmployeePositionMovement?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&exportPDF=' + $scope.exportPDF, '_blank');
        }

      
    }

});