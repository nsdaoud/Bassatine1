var HRPerformanceApp = angular.module('HRPerformanceApp', []);

HRPerformanceApp.controller('HRTypeController', function ($scope, $http) {
    showLoader();

    
    $scope.LstTypeEvaluations;
    $scope.entity = {};
    $scope.editable = false;

    // Get Travel Reasons
    $http.get('/api/HRPerformance/TypeEvaluation').then(
      function success(response) {
          $scope.LstTypeEvaluations = response.data;
          hideLoader();
      },
      function error(response) {
          alert(response.statusText);
      });
    // Get Travel Reasons
    $scope.save = function (index) {
        //alert($scope.index);
        $scope.LstTypeEvaluations[index].editable = false;
        //$scope.TAFDestinations[index].id_DemandeVoyage = $scope.id;

        $http.post('/api/HRPerformance/SaveTypeEvaluation', $scope.LstTypeEvaluations[index]).then(
          function success(response) {
              //alert("Travel Reason added Successfully !!!");
              $scope.LstTypeEvaluations[index] = response.data;
          },
         function error(response) {
             alert(response.statusText);
         });

    }

    $scope.edit = function (index) {

        $scope.entity = angular.copy($scope.LstTypeEvaluations[index]);
        $scope.LstTypeEvaluations[index].editable = true;

    }
    $scope.cancel = function (index) {
        $scope.entity.editable = false;
        $scope.LstTypeEvaluations[index] = angular.copy($scope.entity);
        $scope.entity = {};
        if (typeof $scope.LstTypeEvaluations[index].id_TypeEvaluation == 'undefined') {
            $scope.LstTypeEvaluations.splice(index, 1);
        }
    }

    $scope.add = function () {
        $scope.LstTypeEvaluations.push({
            id_TypeEvaluation:'00000000-0000-0000-0000-000000000000',
            descriptionTypeEvaluation : '',
            codeTypeEvaluation: '',
            editable: true
        });
    }

    $scope.delete = function (index) {

        $http.post('/api/HRPerformance/deleteTypeEvaluation', $scope.LstTypeEvaluations[index]).then(
         function success(response) {
             //alert("Travel Reason deleted Successfully !!!");
             $scope.LstTypeEvaluations.splice(index, 1);
         },
        function error(response) {
            alert(response.statusText);
        });

    }

});

HRPerformanceApp.controller('HRTypeLineController', function ($scope, $http) {
    showLoader();

    $scope.idEvaluationType = $.QueryString["idEvaluationType"];
   

    $scope.LstTypeEvaluationLines;
    $scope.entity = {};
    $scope.editable = false;

    $scope.LstTypeEvaluationLines = {
        id_TypeLigneEvaluation: '',
        numeroOrdreTypeLigneEvaluation: '',
        descriptionTypeLigneEvaluation: '',
        coefficientTypeLigneEvaluation: 0,
        xEstObligatoire: false,
        xEstCommentaire: false,
        xEstNote: false,
        familleTypeLigneEvaluation: '',
        noteMaximaleTypeLigneEvaluation:0
        //Comments: new Array()

    };

    // Get TravelRequest Info
    if (typeof $scope.idEvaluationType != 'undefined') {

        $http.get('/api/HRPerformance/TypeLigneEvaluation?idEvaluationType=' + $scope.idEvaluationType).then(
          function success(response) {
              $scope.LstTypeEvaluationLines = response.data;
              hideLoader();
          },

    function error(response) {
        alert(response.statusText);
    });
    } else {


        hideLoader();
    }
    function error(response) {
        alert(response.statusText);
    }
    // Get TravelRequest Info

  
    $scope.save = function (index) {
        //alert($scope.index);
        $scope.LstTypeEvaluationLines[index].editable = false;
        //$scope.TAFDestinations[index].id_DemandeVoyage = $scope.id;

        $http.post('/api/HRPerformance/SaveTypeEvaluationLine', $scope.LstTypeEvaluationLines[index]).then(
          function success(response) {
              //alert("Travel Reason added Successfully !!!");
              $scope.LstTypeEvaluationLines[index] = response.data;
          },
         function error(response) {
             alert(response.statusText);
         });

    }

    $scope.edit = function (index) {

        $scope.entity = angular.copy($scope.LstTypeEvaluationLines[index]);
        $scope.LstTypeEvaluationLines[index].editable = true;

    }
    $scope.cancel = function (index) {
        $scope.entity.editable = false;
        $scope.LstTypeEvaluationLines[index] = angular.copy($scope.entity);
        $scope.entity = {};
        if (typeof $scope.LstTypeEvaluationLines[index].id_TypeLigneEvaluation == 'undefined') {
            $scope.LstTypeEvaluationLines.splice(index, 1);
        }
    }

    $scope.add = function () {
        $scope.LstTypeEvaluationLines.unshift({
            id_TypeLigneEvaluation: '00000000-0000-0000-0000-000000000000',
            id_TypeEvaluation :  $scope.idEvaluationType ,
            numeroOrdreTypeLigneEvaluation: '',
            descriptionTypeLigneEvaluation: '',
            coefficientTypeLigneEvaluation: 0,
            xEstObligatoire: false,
            xEstCommentaire: false,
            xEstNote: false,
            familleTypeLigneEvaluation: '',
            noteMaximaleTypeLigneEvaluation:0,
            editable: true
        });
    }

    $scope.delete = function (index) {

        $http.post('/api/HRPerformance/deleteTypeEvaluationLine', $scope.LstTypeEvaluationLines[index]).then(
         function success(response) {
             //alert("Travel Reason deleted Successfully !!!");
             $scope.LstTypeEvaluationLines.splice(index, 1);
         },
        function error(response) {
            alert(response.statusText);
        });

    }

});

HRPerformanceApp.controller('HRListingEvaluationsController', function ($scope, $filter, $http) {
    showLoader();

    $scope.idPersonne = $.QueryString["idPersonne"];

    $scope.LstEmployees;
    $scope.LstEvaluationType = [];
    $scope.LstEmployeeEvaluations;
    $scope.entity = {};
    $scope.editable = false;


    // Get My Team that I am responsable of
    $http.get('/api/HRPerformance/MyTeam').then(
      function success(response) {
          $scope.LstEmployees = response.data;
          hideLoader();
      },
      function error(response) {
          alert(response.statusText);
      });
    // Get My Team that I am responsable of

    // Get all TypeEvaluation
    $http.get('/api/HRPerformance/TypeEvaluation').then(
      function success(response) {
          $scope.LstEvaluationType = response.data;
          hideLoader();
      },
      function error(response) {
          alert(response.statusText);
      });
    // Get all TypeEvaluation


    $scope.showTypeEvaluation = function (id_TypeEvaluation) {
        //alert(id_PaysDeparts);
        var selected = [];
        //if ($scope.TAFDestinations[index].id_PaysDepart) {
        selected = $filter('filter')($scope.LstEvaluationType, { id_TypeEvaluation: id_TypeEvaluation });
        //}
        return selected.length ? selected[0].codeTypeEvaluation : 'Not set';
    };

    if (typeof $scope.idPersonne != 'undefined') {
       // Get My Team that I am responsable of
        $http.get('/api/HRPerformance/EmployeeEvaluations?idPersonne=' + $scope.idPersonne).then(
          function success(response) {
              $scope.LstEmployeeEvaluations = response.data;
              hideLoader();
          },
          function error(response) {
              alert(response.statusText);
          });
        // Get My Team that I am responsable of
    }

    $scope.add = function () {
        $scope.LstEmployeeEvaluations.unshift({
            id_Evaluation: '00000000-0000-0000-0000-000000000000',
            id_PersonneEvaluee : $scope.idPersonne,
            statutEvaluation: 'Prp',
            dateEvaluation: '',
            descriptionEvaluation: '',
            editable: true
        });
    }



    $scope.save = function (index) {
        //alert($scope.index);
        $scope.LstEmployeeEvaluations[index].editable = false;
        //$scope.TAFDestinations[index].id_DemandeVoyage = $scope.id;

        $http.post('/api/HRPerformance/SaveTypeEvaluationLine', $scope.LstTypeEvaluationLines[index]).then(
          function success(response) {
              //alert("Travel Reason added Successfully !!!");
              $scope.LstEmployeeEvaluations[index] = response.data;
          },
         function error(response) {
             alert(response.statusText);
         });

    }

    $scope.edit = function (index) {

        $scope.entity[index] = angular.copy($scope.LstEmployeeEvaluations[index]);
        $scope.LstEmployeeEvaluations[index].editable = true;

    }
    $scope.cancel = function (index) {
        if ($scope.LstEmployeeEvaluations[index].id_Evaluation == '00000000-0000-0000-0000-000000000000') {

            $scope.LstEmployeeEvaluations.splice(index, 1);
        } else {
            $scope.LstEmployeeEvaluations[index] = angular.copy($scope.entity[index]);
        }
        //$scope.entity.editable = false;
       
        //$scope.entity = {};
       
    }
 

});


