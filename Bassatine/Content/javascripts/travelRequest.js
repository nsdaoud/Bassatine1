var travelRequestApp = angular.module('travelRequestApp', []);

travelRequestApp.controller('TravelRequestController', function ($scope, $filter, $http) {
    showLoader();
    $scope.travelRequests;
    $scope.edittravelRequest;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $http.get('/api/TravelRequest/TravelRequests').then(
       function success(response) {
           $scope.travelRequests = response.data;
           hideLoader();
       },
       function error(response) {
           alert(response.statusText);
       });

    $scope.numberOfPages = function () {
            
            return Math.ceil($scope.travelRequests.length / $scope.pageSize);
       
       
    }
    
    $scope.setSort = function (sort) {
        if ($scope.sort === sort) {
            $scope.reverse = !$scope.reverse;
        }
        if ($scope.sort !== undefined) {
            $scope.sort = sort;
        }
    }

});

travelRequestApp.controller('HRTravelRequestController', function ($scope, $filter, $http) {
    showLoader();
    $scope.HRtravelRequests;
    $scope.edittravelRequest;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $http.get('/api/TravelRequest/HRTravelRequests').then(
       function success(response) {
           $scope.HRtravelRequests = response.data;
           hideLoader();
       },
       function error(response) {
           alert(response.statusText);
       });

    $scope.numberOfPages = function () {

        return Math.ceil($scope.HRTravelRequests.length / $scope.pageSize);


    }

    $scope.setSort = function (sort) {
        if ($scope.sort === sort) {
            $scope.reverse = !$scope.reverse;
        }
        if ($scope.sort !== undefined) {
            $scope.sort = sort;
        }
    }

});


travelRequestApp.filter('startFrom', function () {
    return function (input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    }
});
travelRequestApp.controller('TAFReasonsController', function ($scope, $http) {
    showLoader();
    $scope.LstTAFReasons;
    $scope.entity = {};
    $scope.editable = false;

    // Get Travel Reasons
    $http.get('/api/TravelRequest/TAFReason').then(
      function success(response) {
          $scope.LstTAFReasons = response.data;
          hideLoader();
          },
      function error(response) {
          alert(response.statusText);
          });
              // Get Travel Reasons
    $scope.save = function (index) {
        //alert($scope.index);
        $scope.LstTAFReasons[index].editable = false;
        //$scope.TAFDestinations[index].id_DemandeVoyage = $scope.id;

        $http.post('/api/TravelRequest/SaveNewTAFReason', $scope.LstTAFReasons[index]).then(
          function success(response) {
              alert("Travel Reason added Successfully !!!");
              $scope.LstTAFReasons[index] = response.data;
          },
         function error(response) {
             alert(response.statusText);
         });

    }

    $scope.edit = function (index) {
       
        $scope.entity = angular.copy($scope.LstTAFReasons[index]);
        $scope.LstTAFReasons[index].editable = true;

    }
    $scope.cancel = function (index) {
        $scope.entity.editable = false;
        $scope.LstTAFReasons[index] = angular.copy($scope.entity);
        $scope.entity = {};
        if (typeof $scope.LstTAFReasons[index].id_RaisonDemandeVoyage == 'undefined') {
            $scope.LstTAFReasons.splice(index, 1);
        }
    }

    $scope.add = function () {
        $scope.LstTAFReasons.push({

            raisonDemandeVoyage: '',
            editable: true
        });
    }

    $scope.delete = function (index) {

        $http.post('/api/TravelRequest/deleteTAFReason', $scope.LstTAFReasons[index]).then(
         function success(response) {
             alert("Travel Reason deleted Successfully !!!");
             $scope.LstTAFReasons.splice(index, 1);
         },
        function error(response) {
            alert(response.statusText);
        });

    }

});


travelRequestApp.controller('travelRequestEditController', function ($scope, $filter, $http) {
    showLoader();

   

    $scope.id = $.QueryString["id"];
    $scope.hraction = $.QueryString["action"];

    $scope.idTiers;
    $scope.nomTiers;
    $scope.idTAFPersonne;

    

    $scope.idHotelTiers;
    $scope.nomHotelTiers;

    $scope.idAgencyTiers;
    $scope.nomAgencyTiers;

    $scope.idAirlineTiers;
    $scope.nomAirlineTiers;

    $scope.employees;
    $scope.LstPays = [];
    $scope.LstTravelCategories;
    $scope.LstTAFJobs;
    $scope.LstTAFJobsByPays;
    $scope.LstTAFTypes;
    $scope.LstTAFAccomodation;
    $scope.LstTAFCurrencies = [];
    $scope.TAFDestinations = [];
    $scope.entity = {};
    var defaultSort = 'PaysFrom';
    $scope.sort = defaultSort;
    $scope.reverse = false;
    $scope.showhideprop = false;


    $scope.workflowActions = new Array();


  
    // Calculate Total Number of Pages based on Search Result
  

    $scope.newtravelRequest = {
        WorkflowId: '00000000-0000-0000-0000-000000000000',
        id_DemandeVoyage: '',
        id_PaysOrigine: '',
        categorieDemandeVoyage: '',
        statutDemandeVoyage: '',
        id_Tiers:'',
        nomTiers: '',
        codePoste: '',
        typeDemandeVoyage: '',
        raisonDemandeVoyage: '',
        commentDemandeVoyage: '',
        xVisaNeeded: '',
        Comments: new Array(),
        TAFPersonId: '00000000-0000-0000-0000-000000000000',
        IsOnBehaldOf: false,
        IsUsingWF: false



    };

    // Get Travel Reasons
    $http.get('/api/TravelRequest/TAFReason').then(
      function success(response) {
          $scope.LstTAFReasons = response.data;
          hideLoader();
      },
      function error(response) {
          alert(response.statusText);
      });
    // Get Travel Reasons

    // Get Travel Nationality
    $http.get('/api/TravelRequest/Nationality').then(
      function success(response) {
          $scope.LstPays = response.data;
          hideLoader();
      },
function error(response) {
    alert(response.statusText);
});
    // Get Travel Nationality
    // Get Travel Category
    $http.get('/api/TravelRequest/TAFCategories').then(
       function success(response) {
           $scope.LstTravelCategories = response.data;
           hideLoader();
       },
       function error(response) {
           alert(response.statusText);
       });
    // Get Travel Category
    // Get Travel Jobs
    $http.get('/api/TravelRequest/TAFJobs').then(
     function success(response) {
         $scope.LstTAFJobs = response.data;
         hideLoader();
     },
     function error(response) {
         alert(response.statusText);
     });
    // Get Travel Jobs
    // Get Travel Type
    $http.get('/api/TravelRequest/TAFType').then(
     function success(response) {
         $scope.LstTAFTypes = response.data;
         hideLoader();
     },
     function error(response) {
         alert(response.statusText);
     });
    // Get Travel Type
    // Get Travel accomodations
    $http.get('/api/TravelRequest/TAFAccomodation').then(
    function success(response) {
        $scope.LstTAFAccomodation = response.data;
      
        hideLoader();
    },
function error(response) {
    alert(response.statusText);
});
    // Get Travel accomodations


    // Get Currencies
    $http.get('/api/TravelRequest/TAFCurrencies').then(
function success(response) {
    $scope.LstTAFCurrencies = response.data;
    hideLoader();
},
function error(response) {
    alert(response.statusText);
});
    // Get Currencies



    // Get TravelRequest Info
    if (typeof $scope.id != 'undefined') {

        $http.get('/api/TravelRequest?id=' + $scope.id).then(
          function success(response) {
              
              $scope.newtravelRequest = response.data;
           
              $scope.getWorkFlowAction();

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


    // Get Travel Destinations
    if (typeof $scope.id != 'undefined') {

        $http.get('/api/TravelRequest/TAFDestinations?idTAFRequest=' + $scope.id).then(

            function success(response) {

                $scope.TAFDestinations = response.data;

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
    // Get Travel Destinations

    // Get List Of WorkFlowAction
    $scope.getWorkFlowAction = function () {
        if ($scope.newtravelRequest.WorkflowId != '00000000-0000-0000-0000-000000000000') {
            //alert('ss');
            $http.get('/api/TravelRequest/Workflow/Actions?workflowId=' + $scope.newtravelRequest.WorkflowId).then(
            function success(response) {
                $scope.workflowActions = response.data;
                //if ($scope.hraction == 'hr') {
                //    alert($scope.hraction);
                //    $scope.TAFDestinations[index].xhraction = true;
                //}
                hideLoader();
            },
            function error(response) {
                alert(response.statusText);
            });
        }
    }


    // Get List Of Traveler
    $scope.getTraveler = function () {
        $http.get('/api/TravelRequest/Travelers').then(
            function success(response) {
                $scope.employees = response.data;
            },
            function error(response) {
                alert(response.statusText);
            });
    }

    $("#txtTraveler").select2({
        placeholder: "Select a Traveler",
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/TravelRequest/GetStudentsInCenter/",
            dataType: 'json',
            error: function () { alert("Temporary error. Please try again..."); },
            data: function (term, page) {
                return {
                    st: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        
                        id: data[i].id_Tiers,
                        text: data[i].nomTiers,
                        idPersonne: data[i].id_Personne,
                    });
                }
                return {
                    results: arr
                };

            }
        },
        formatResult: function (person) {
            return person.text;
        },
        formatSelection: function (person) {
            //alert(person.idPersonne);
            $scope.idTiers = person.id;
            $scope.nomTiers = person.text;
            $scope.idTAFPersonne = person.idPersonne;
            return person.text;
        },
        dropdownCssClass: "bigdrop",
        escapeMarkup: function (m) {
            return m;
        },
        formatNoMatches: function () {
            return "No Matches Found";
        },
        formatInputTooShort: function (input, min) {
            var n = min - input.length;
            return "Please Enter " + (n == 1 ? "1 more Character" : (n + " more Characters"));
        },
        formatLoadMore: function (pageNumber) {
            return "Loading More Results";
        },
        formatSearching: function () {
            return "Searching";
        },
    });

    $("#ddlhotel").select2({
        placeholder: "Select an Hotel",
        initSelection: true,
        minimumInputLength: 3,
        //multiple:true,
        closeOnSelect: true,
        ajax: {
            url: "/TravelRequest/GetStudentsInCenter/",
            dataType: 'json',
            error: function () { alert("Temporary error. Please try again..."); },
            data: function (term, page) {
                return {
                    st: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
               
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].id_Tiers,
                        text: data[i].nomTiers,
                    });
                }
                return {
                    results: arr
                };

            }
        },
        //initSelection: function (element, callback) {
        //    // the input tag has a value attribute preloaded that points to a preselected person's id
        //    // this function resolves that id attribute to an object that select2 can render
        //    // using its formatResult renderer - that way the person name is shown preselected
            //    //alert("w");
            //alert('in init');
            //var id = $(element).val();
            //alert(id);

            //var data = [];
            //data.push({ id: '5AB8DD50-A1CE-4E6A-AFDB-BFEB85899491', text: 'Dado' });
            //callback(data);

            //if (id !== "") {
            //    $.ajax("/TravelRequest/GetStudentsInCenter/", {
            //        data: {
            //            id: $scope.LstTAFAccomodation.id_TiersHotel,
            //            text: $scope.LstTAFAccomodation.nomHotelTiers
            //            //apikey: "ju6z9mjyajq2djue3gbvv26t"
            //        },
            //        dataType: "json"
            //    }).done(function (data) {

            //        callback(data);
            //    });
            //}
        //},
        formatResult: function (person) {
            return person.text;
        },
        formatSelection: function (person) {
            //alert(person.id);
            $scope.idHotelTiers = person.id;
            $scope.nomHotelTiers = person.text;
        
            return person.text;
        },
        dropdownCssClass: "bigdrop",
        escapeMarkup: function (m) {
            return m;
        },
        formatNoMatches: function () {
            return "No Matches Found";
        },
        formatInputTooShort: function (input, min) {
            var n = min - input.length;
            return "Please Enter " + (n == 1 ? "1 more Character" : (n + " more Characters"));
        },
        formatLoadMore: function (pageNumber) {
            return "Loading More Results";
        },
        formatSearching: function () {
            return "Searching";
        },
    });

    $("#ddlAgency").select2({
        placeholder: "Select an Agency",
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/TravelRequest/GetStudentsInCenter/",
            dataType: 'json',
            error: function () { alert("Temporary error. Please try again..."); },
            data: function (term, page) {
                return {
                    st: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].id_Tiers,
                        text: data[i].nomTiers,
                    });
                }
                return {
                    results: arr
                };

            }
        },
        formatResult: function (person) {
            return person.text;
        },
        formatSelection: function (person) {
            //alert(person.id);
            $scope.idAgencyTiers = person.id;
            $scope.nomAgencyTiers = person.text;
            return person.text;
        },
        dropdownCssClass: "bigdrop",
        escapeMarkup: function (m) {
            return m;
        },
        formatNoMatches: function () {
            return "No Matches Found";
        },
        formatInputTooShort: function (input, min) {
            var n = min - input.length;
            return "Please Enter " + (n == 1 ? "1 more Character" : (n + " more Characters"));
        },
        formatLoadMore: function (pageNumber) {
            return "Loading More Results";
        },
        formatSearching: function () {
            return "Searching";
        },
    });

    $("#ddlAirline").select2({
        placeholder: "Select a Company",
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/TravelRequest/GetStudentsInCenter/",
            dataType: 'json',
            error: function () { alert("Temporary error. Please try again..."); },
            data: function (term, page) {
                return {
                    st: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].id_Tiers,
                        text: data[i].nomTiers,
                    });
                }
                return {
                    results: arr
                };

            }
        },
        formatResult: function (person) {
            return person.text;
        },
        formatSelection: function (person) {
            //alert(person.id);
            $scope.idAirlineTiers = person.id;
            $scope.nomAirlineTiers = person.text;
            return person.text;
        },
        dropdownCssClass: "bigdrop",
        escapeMarkup: function (m) {
            return m;
        },
        formatNoMatches: function () {
            return "No Matches Found";
        },
        formatInputTooShort: function (input, min) {
            var n = min - input.length;
            return "Please Enter " + (n == 1 ? "1 more Character" : (n + " more Characters"));
        },
        formatLoadMore: function (pageNumber) {
            return "Loading More Results";
        },
        formatSearching: function () {
            return "Searching";
        },
    });

    function personFormatResult(person) {
        return  person.nomTiers;
    }

    function personFormatSelection(person) {
        //alert("W");
        //$scope.selectedtraveler = person;
        //$scope.selectedLSID = person.id;
        //$scope.personSelected = true;
        //$scope.selectedPersonName = person.nomTiers + ' ' + person.nomTiers + ' ' + person.nomTiers + ' (' + person.nomTiers + ')';
        //$scope.$apply();
        //return $scope.selectedtraveler;
    }

    $scope.editable = false;
    $scope.selectedDestinations = [];

    $scope.showCurrency = function (_idDevise) {
      //  alert(_idDevise);
        var selected = [];
      
    
          selected = $filter('filter')($scope.LstTAFCurrencies, { id_Devise: _idDevise });
          return selected.length ? selected[0].codeDevise : 'Not set';
        
      
    };

    $scope.showPaysFrom = function (id_PaysDeparts) {
        //alert(id_PaysDeparts);
        var selected = [];
        //if ($scope.TAFDestinations[index].id_PaysDepart) {
        selected = $filter('filter')($scope.LstPays, { id_Pays: id_PaysDeparts });
        //}
        return selected.length ? selected[0].nomPaysAnglais : 'Not set';
    };

    $scope.showPaysTo = function (id_PaysArrivee) {

       
        var selected = [];
      
        selected = $filter('filter')($scope.LstPays, {
            id_Pays: id_PaysArrivee
        });
       
        return selected.length ? selected[0].nomPaysAnglais : 'Not set';
    };

    $scope.showJob = function (id_poste) {


        var selected = [];

        selected = $filter('filter')($scope.LstTAFJobs, {
            id_Poste: id_poste
        });

        return selected.length ? selected[0].codePoste : 'Not set';
    };

    $scope.Savetravelrequest = function (actionName) {
        // Save
        //alert($scope.TAFDestinations.length);
        var validationMessage = '';
        if (actionName == "Submit")
        {
            if ($scope.TAFDestinations.length <= 0) {
                validationMessage = validationMessage + 'Destination is missing\n';
            }
                if ($scope.TAFDestinations.length > 0) {
                    for (var i = 0; i < $scope.TAFDestinations.length; i++) {
                        if ($scope.TAFDestinations[i].id_ChronologieDemandeVoyage == '00000000-0000-0000-0000-000000000000') {
                            validationMessage = validationMessage + 'You need to save your Data\n';
                              break;
                        } 
                    }
                }
        }

        if (actionName == "Approve" || actionName == "Submit" ||  $scope.newtravelRequest.IsUsingWF) {
            $scope.newtravelRequest.statutDemandeVoyage = 'Act';
        }
        if (actionName == "Finish") {
            $scope.newtravelRequest.statutDemandeVoyage = 'Cls';
        }
        if (actionName == "Cancel My TAF") {
            $scope.newtravelRequest.xEstAnnule = true;
        }

        if (actionName == "Review" || actionName == "Reject") {
            if ($scope.newtravelRequest.Comment == '' || $scope.newtravelRequest.Comment == undefined) {
                //alert($scope.newtravelRequest.Comment);
                validationMessage = validationMessage + 'Comment is missing\n';
            }
               
        }

       

        if (typeof $scope.id == 'undefined') {
            if ($scope.idTiers != 'undefined') {
                $scope.newtravelRequest.TAFPersonId = $scope.idTAFPersonne;
                $scope.newtravelRequest.id_Tiers = $scope.idTiers;
                $scope.newtravelRequest.nomTiers = $scope.nomTiers;
            }
          
        }
       
        //if (($scope.newtravelRequest.id_Tiers == undefined)) {
        //    validationMessage = validationMessage + 'Traveler is missing\n';
        //}
        //alert($scope.showhideprop);
        //alert($scope.newtravelRequest.nomTiers);
        if ( isEmpty($scope.newtravelRequest.nomTiers)  && $scope.showhideprop == true) {

            validationMessage = validationMessage + 'Traveler is missing\n';
        }
          

        if ($scope.newtravelRequest.id_PaysOrigine == '') {
            validationMessage = validationMessage + 'Nationality is missing\n';
        }

        if ($scope.newtravelRequest.typeDemandeVoyage == '') {
            validationMessage = validationMessage + 'Travel Type is missing\n';
        }

        //if ($scope.newtravelRequest.categorieDemandeVoyage == '') {
        //    validationMessage = validationMessage + 'Travel Category is missing\n';
        //}
           

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }
        //return;

     
        
        $http.post('/api/TravelRequest/saveTAFRequest?workflowAction=' + actionName, $scope.newtravelRequest).then(
        function success(response) {
         
            if (actionName == "") {
                //alert("Travel Request added Successfully !!!");
                $scope.newtravelRequest = response.data;
              
                $scope.id = $scope.newtravelRequest.id_DemandeVoyage;
                $scope.getWorkFlowAction();
            } else {
                //alert(actionName);
                redirect("/TravelRequest");
            }
          
        },
                function error(response) {
                    alert(response.statusText);
                });
    }

    $scope.SaveNewTAFReason = function () {

        $http.post('/api/TravelRequest/SaveNewTAFReason/', {
            params: {
                _TAFReason: $scope.newTAFReason
            }
        }).then(
        function success(response) {
            //alert("Travel Request added Successfully !!!");

            $scope.LstTAFReasons.push(response.data);
            //$scope.id = $scope.newtravelRequest.id_DemandeVoyage;
            //alert($scope.newtravelRequest.statutDemandeVoyage);
            //redirect("/TravelRequest");
        },
           function error(response) {
               alert(response.statusText);
           });
    }

    $scope.isNewItem = function () {
        if (typeof $scope.id != 'undefined') {
            return true;
        } else {
            return false;
        }
    };

    $scope.edit = function (index) {

        //alert($scope.TAFDestinations.indexOf(TAFDestination));
        //TAFDestination.ed = true;

        //$scope.sort = undefined;
        $scope.entity = angular.copy($scope.TAFDestinations[index]);
        $scope.getJobsByPays($scope.TAFDestinations[index].id_PaysArrivee);
        $scope.TAFDestinations[index].editable = true;
   
        $('.date').datepicker({ autoclose: true });


    }

    $scope.getJobsByPays = function (idPaysArrivee) {
        //alert(idPaysArrivee);
        $http.get('/api/TravelRequest/TAFDestinationJobs?idPays=' + idPaysArrivee).then(
            function success(response) {
                $scope.LstTAFJobsByPays = response.data;
                hideLoader();
            },
            function error(response) {
                alert(response.statusText);
            });

    }

    $scope.delete = function (index) {
       
        $http.post('/api/TravelRequest/deleteTAFDestinations', $scope.TAFDestinations[index]).then(
         function success(response) {
             //alert("Travel Destination deleted Successfully !!!");
             $scope.TAFDestinations.splice(index, 1);
         },
        function error(response) {
            alert(response.statusText);
        });

    }

    $scope.accomodation = function (index) {
        $scope.DestinationIndex = index;
        $scope.TAFaccomodation = angular.copy($scope.TAFDestinations[index]);
        $('#ddlhotel').select2('data', { id: $scope.TAFDestinations[index].id_TiersHotel, text: $scope.TAFDestinations[index].nomTiersHotel });
        $('#ddlAgency').select2('data', { id: $scope.TAFDestinations[index].id_TiersAgency, text: $scope.TAFDestinations[index].nomTiersAgency });
        $('#ddlAirline').select2('data', { id: $scope.TAFDestinations[index].id_TiersAirline, text: $scope.TAFDestinations[index].nomTiersAirline });

    }

    $scope.saveAccomodation = function () {
        var validationMessage = '';
        if ($scope.TAFaccomodation.VisaMontant != '' && $scope.TAFaccomodation.VisaMontant != 0) {
            if ($scope.TAFaccomodation.id_VisaDevise == '' || $scope.TAFaccomodation.id_VisaDevise == 'Undefined') {
                validationMessage = validationMessage + 'Visa Currency is missing\n';

            }
        }



        if ($scope.TAFaccomodation.perDiemVoyage != '' && $scope.TAFaccomodation.perDiemVoyage != 0) {
            if ($scope.TAFaccomodation.id_perDiemDevise == '' || $scope.TAFaccomodation.id_perDiemDevise == 'Undefined') {
                validationMessage = validationMessage + 'PerDiem Currency is missing\n';

            }
        }

        if ($scope.TAFaccomodation.amendmentVoyage != '' && $scope.TAFaccomodation.amendmentVoyage != 0) {
            if ($scope.TAFaccomodation.id_amendmentDevise == '' || $scope.TAFaccomodation.id_amendmentDevise == 'Undefined') {
                validationMessage = validationMessage + 'PerDiem Amendment Currency is missing\n';

            }
        }

        if ($scope.TAFaccomodation.AirwayMontant != '' && $scope.TAFaccomodation.AirwayMontant != 0) {
            if ($scope.TAFaccomodation.id_AirwayDevise == '' || $scope.TAFaccomodation.id_AirwayDevise == 'Undefined') {
                validationMessage = validationMessage + 'Airway Currency is missing\n';

            }
        }

        if ($scope.TAFaccomodation.AirwayAmendment != '' && $scope.TAFaccomodation.AirwayAmendment != 0) {
            if ($scope.TAFaccomodation.id_AirwayAmendmentDevise == '' || $scope.TAFaccomodation.id_AirwayAmendmentDevise == 'Undefined') {
                validationMessage = validationMessage + 'Airway Amendment Currency is missing\n';

            }
        }

        if ($scope.TAFaccomodation.accomodationMontant != '' && $scope.TAFaccomodation.accomodationMontant != 0) {
            if ($scope.TAFaccomodation.id_AccomodationDevise == '' || $scope.TAFaccomodation.id_AccomodationDevise == 'Undefined') {
                validationMessage = validationMessage + 'Accomodation Currency is missing\n';

            }
        }

        if ($scope.TAFaccomodation.amendmentaccommodation != '' && $scope.TAFaccomodation.amendmentaccommodation != 0) {
            if ($scope.TAFaccomodation.id_AmendmentAccommodationDevise == '' || $scope.TAFaccomodation.id_AmendmentAccommodationDevise == 'Undefined') {
                validationMessage = validationMessage + 'Amendment Accomodation Currency is missing\n';

            }
        }

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }
      
        $scope.TAFaccomodation.id_TiersHotel = $scope.idHotelTiers;
        $scope.TAFaccomodation.id_TiersAgency = $scope.idAgencyTiers;
        $scope.TAFaccomodation.id_TiersAirline = $scope.idAirlineTiers;

        $scope.TAFaccomodation.nomTiersHotel = $scope.nomHotelTiers;
        $scope.TAFaccomodation.nomTiersAgency = $scope.nomAgencyTiers;
        $scope.TAFaccomodation.nomTiersAirline = $scope.nomAirlineTiers;
       
        $http.post('/api/TravelRequest/saveTAFDestinations', $scope.TAFaccomodation).then(
         function success(response) {
             //alert("Travel Accomodation added Successfully !!!");
             $scope.TAFDestinations[$scope.DestinationIndex] = response.data;
         },
         function error(response) {
             alert(response.statusText);
         });

    }

    $scope.save = function (index) {
        //alert($scope.TAFDestinations[index].dateDeDepart);
        var validationMessage = '';

        if ($scope.TAFDestinations[index].dateDeDepart == '') {
            validationMessage = validationMessage + 'From Date is missing\n';
        }

        if ($scope.TAFDestinations[index].dateArrivee == '') {
            validationMessage = validationMessage + 'To Date is missing\n';
        }

        if ($scope.TAFDestinations[index].id_PaysDepart == '' || $scope.TAFDestinations[index].id_PaysDepart == null || $scope.TAFDestinations[index].id_PaysDepart == 'Undefined') {
            validationMessage = validationMessage + 'From Location is missing\n';
        }

        if ($scope.TAFDestinations[index].id_PaysArrivee == '' || $scope.TAFDestinations[index].id_PaysArrivee == null || $scope.TAFDestinations[index].id_PaysArrivee == 'undefined') {
            validationMessage = validationMessage + 'To Location is missing\n';
        }

        if ($scope.TAFDestinations[index].dateArrivee != '' && $scope.TAFDestinations[index].dateDeDepart != '') {
            if ($scope.TAFDestinations[index].dateArrivee < $scope.TAFDestinations[index].dateDeDepart ) {
                validationMessage = validationMessage + 'To Date is greater than From Date is missing\n';
            }
           
        }


        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }

        $scope.TAFDestinations[index].editable = false;
        $scope.TAFDestinations[index].id_DemandeVoyage = $scope.id;
      
        $http.post('/api/TravelRequest/saveTAFDestinations', $scope.TAFDestinations[index]).then(
          function success(response) {
              //alert("Travel Destination added Successfully !!!");
              $scope.TAFDestinations[index] = response.data;
          },
         function error(response) {
             alert(response.statusText);
         });

    }

    $scope.cancel = function (index) {
        $scope.entity.editable = false;
        $scope.TAFDestinations[index] = angular.copy($scope.entity);
        $scope.entity = {};

        if (typeof $scope.TAFDestinations[index].id_ChronologieDemandeVoyage == 'undefined') {
            $scope.TAFDestinations.splice(index, 1);
        }

    }

    $scope.add = function () {
     
       
        $scope.TAFDestinations.push({
            id_ChronologieDemandeVoyage : '00000000-0000-0000-0000-000000000000',
            PaysFrom: '',
            PaysTo: '',
            editable: true,
            nomVilleDepart: '',
            nomVilleArrivee: '',
            dateDeDepart: new Date(),
            dateArrivee: null,
            id_AccomodationDevise: null,
            id_perDiemDevise: null,
            id_amendmentDevise: null,
            id_VisaDevise: null,
            id_AirwayDevise: null,
            id_AirwayAmendmentDevise: null,
            id_AmendmentAccommodationDevise: null,
            id_Poste: '',
            codePost: ''

        });

        

        setTimeout(function () { $('.date').datepicker({ autoclose: true });}, 100);
    }


    // Show or Hide Div
    $scope.showHideDiv = function () {
        //alert($scope.newtravelRequest.IsUsingWF);
        if ($scope.newtravelRequest.IsOnBehaldOf ) {
            $scope.showhideprop = true;
        }
        else {
            $scope.showhideprop = false;
        }
    }
});
travelRequestApp.controller('TravelPendingApprovalController', function ($scope, $http) {
    showLoader();
    $scope.AllTravels;
 
    $http.get('/api/TravelRequest/PendingApproval').then(
        function success(response) {
            $scope.AllTravels = response.data;
            hideLoader();
        },
        function error(response) {
            alert(response.statusText);
        });
});
travelRequestApp.controller('TAFReportsController', function ($scope, $filter, $http) {
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
    $scope.dateFrom = FirstdayOfCurrentYear();
    $scope.dateTo = LastdayOfCurrentYear(); //today();
    $scope.exportPDF = true ;

    $scope.link = '';

    $scope.reportTitle = $.QueryString["reportTitle"];
    
    // Get Travel Jobs
    $http.get('/api/TravelRequest/TAFJobs').then(

     function success(response) {
         $scope.LstTAFReportJobs = response.data;
         hideLoader();
     },
     function error(response) {
         alert(response.statusText);
     });
    // Get Travel Jobs

    $scope.act_generateReport = function (title) {
        //alert($scope.dateFrom);
        //alert($scope.dateTo);

        //var alignFillDate = new Date($scope.dateFrom);
        //var pickUpDate = new Date($scope.dateTo);

        var toDate = Date.parse($scope.dateTo);
        var fromDate = Date.parse($scope.dateFrom);


        var validationMessage = '';
        if ($scope.dateTo == undefined || $scope.dateTo == 'undefined') {
            validationMessage = validationMessage + 'Date To is missing\n';

        }

        if ($scope.dateFrom == undefined || $scope.dateFrom == 'undefined') {
            validationMessage = validationMessage + 'Date From is missing\n';

        }
        if (validationMessage == '') {
            if ($scope.dateFrom > $scope.dateTo) {
                validationMessage = validationMessage + 'To Date is greater than From Date \n';
            }
        }
        

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }

        if (title == "ticketsbyob") {
            //alert($scope.dateFrom);
            //alert($scope.dateTo);
            //alert($scope.codePoste);
            //if ($scope.codePoste == undefined) {
            //    $scope.codePoste == '';
            //}
            window.open('/TravelRequest/PDFRptTicketsByJob?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&_codePoste=' + $scope.codePoste, '_blank');
        } else if (title == "Nocosttickets") {
            window.open('/TravelRequest/PDFRptTicketsNoandCost?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&_idPoste=' + $scope.id_Poste, '_blank');
        } else if (title == "ticketsinfo") {
            window.open('/TravelRequest/PDFRptTicketsInfo?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo, '_blank');
        } else {
            window.open('/TravelRequest/RptTAFDestinationInfos?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&_idPoste=' + $scope.id_Poste + '&exportPDF=' + $scope.exportPDF, '_blank');

        }
      

    }
    $scope.generateReport = function () {
        var validationMessage = '';
        if ($scope.dateTo == undefined || $scope.dateTo == 'undefined') {
            validationMessage = validationMessage + 'Date To is missing\n';

        }

        if ($scope.dateFrom == undefined || $scope.dateFrom == 'undefined') {
            validationMessage = validationMessage + 'Date From is missing\n';

        }
        if (validationMessage == '') {
            if ($scope.dateFrom > $scope.dateTo) {
                validationMessage = validationMessage + 'To Date is greater than From Date \n';
            }
        }


        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }
        if ($scope.reportTitle == "TAFcostbyagency") {
            //alert($scope.reportTitle);
            window.open('/TravelRequest/rptTotalCostByTravelAgency?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&exportPDF=' + $scope.exportPDF, '_blank');
        } else if ($scope.reportTitle == "TAFcostbyDestinations") {
            window.open('/TravelRequest/rptTotalCostByTravelDestinations?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&exportPDF=' + $scope.exportPDF, '_blank');
        } else if ($scope.reportTitle == "TAFcostpertraveltype") {
            window.open('/TravelRequest/rptTotalCostByTravelType?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&exportPDF=' + $scope.exportPDF, '_blank');

        } else if ($scope.reportTitle == "TAFcostpertraveler") {
            window.open('/TravelRequest/rptTotalCostByTraveler?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&exportPDF=' + $scope.exportPDF, '_blank');

        } else if ($scope.reportTitle == "TAFcostpertravelercategory") {
            window.open('/TravelRequest/rptTotalCostByTravelerCategory?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&exportPDF=' + $scope.exportPDF, '_blank');

        }
    }

});