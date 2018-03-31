var testApp = angular.module('testApp', []);
testApp.controller('testController', function ($scope, $http) {



    $("#itemCurrency").select2({
        placeholder: "Select a Currency",
        minimumInputLength: 2,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindCurrency",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].id_Devise,
                        text: data[i].libelleDevise2 + '-' + data[i].codeDevise,
                        code: data[i].codeDevise,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Currency) {
            return Currency.text;
        },
        formatSelection: function (Currency) {
            $scope.$apply(function () {
                $scope.currentPRItem.CurrencyID = Currency.id;
            });
            return Currency.code;
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
});










//#START OF INDEX PAGE
var procFilesApp = angular.module('procFilesApp', []);
procFilesApp.controller('procFilesController', function ($scope, $http) {
    //For select2 to work in modal
    //$(".bootstrap-dialog").removeAttr("tabindex");

    //$.fn.modal.Constructor.prototype.enforceFocus = function () {
    //    //var that = this;
    //    //$(document).on('focusin.modal', function (e) {
    //    //    if ($(e.target).hasClass('select2-input')) {
    //    //        return true;
    //    //    }

    //    //    if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
    //    //        that.$element.focus();
    //    //    }
    //    //});
    //};
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    //miscellaneous 
    $scope.formatDate = function (date) {
        return formatDate(date);
    };

    //Procurement files list
    $scope.lstProcFiles = [];

    //Pagination
    $scope.currentPage = 1;
    $scope.pageSize = '10';

    $scope.searchCriteria = '';

    //Fetch All Procurement Files by criteria
    $scope.search = function () {
        $http.get("/api/Procurement/FindProcurementFile?criteria=" + $scope.searchCriteria).then(
            function success(response) {
                $scope.lstProcFiles = response.data;
            },
            function error(response) {
                alert("Failed to get Procurement Files!");

                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);
            });
    };
    $scope.search();

    $scope.numberOfPages = function () {
        if ($scope.lstProcFiles == null)
            return 1;

        var count = Math.ceil($scope.lstProcFiles.length / $scope.pageSize);
        if (count == 0)
            count++;

        if ($scope.currentPage > count)
            $scope.currentPage = count;

        return count;
    };


    //Selected Proc File
    $scope.procFileObj;

    //reset procfile data
    $scope.clearProcFile = function () {
        $scope.procFileObj = {
            ProcurementFileID: '',
            ProcurementFileStatusID: getStatusIDByCode($scope.lstStatuses, 'Act'),
            ProcurementFileCode: '',
            ProcurementFileDescription: '',
            ProcurementFileCreatedDate: today(),
            ProcurementFileComments: '',
        };

        //reset select2
        $('#job').select2("val", "");
        $('#archivedUnder').select2("val", "");
    };




    //Get All Proc Files
    //$scope.GetAllProcurementFiles = function () {
    //    $http.get('/api/Procurement/GetAllProcurementFiles').then(
    //		function success(response) {
    //		    $scope.lstProcFiles = response.data;
    //		},
    //		function error(response) {
    //		    console.log(response.status);
    //		    showRequestErrorMessage(response);
    //		});
    //};
    //$scope.GetAllProcurementFiles();



    //Get All Statuses
    $scope.lstStatuses = [];
    $scope.GetAllStatuses = function () {
        $http.get('/api/Common/GetAllStatuses').then(
			function success(response) {
			    $scope.lstStatuses = response.data;
			},
			function error(response) {
			    console.log(response.status);
			    showRequestErrorMessage(response);
			});
    };
    $scope.GetAllStatuses();






    //Edit Proc File
    $scope.act_editProcFile = function (ProcurementFileID) {
        $scope.clearProcFile();
        for (var i = 0; i < $scope.lstProcFiles.length; i++) {
            if ($scope.lstProcFiles[i].ProcurementFileID == ProcurementFileID) {
                $scope.procFileObj = jQuery.extend(true, {}, $scope.lstProcFiles[i]);
                $scope.procFileObj.ProcurementFileCreatedDate = formatDate($scope.procFileObj.ProcurementFileCreatedDate);

                console.log($scope.procFileObj);

                $('#job').select2('data', {
                    id: $scope.procFileObj.JobID,
                    text: $scope.procFileObj.JobDescription,
                    JobCode: $scope.procFileObj.JobCode
                });
                $('#job').select2('disable');


                $('#archivedUnder').select2('data', {
                    id: $scope.procFileObj.ArchivedUnderJobID,
                    text: $scope.procFileObj.ArchivedUnderJobDescription,
                    JobCode: $scope.procFileObj.ArchivedUnderJobCode
                });

                break;
            }
        }
        if ($scope.procFileObj.ProcurementFileID == '')
            alert("Failed to load Procurement File!");
        else {
            $('#addProcFile').modal("toggle");
        }
    };

    //save procFile data
    $scope.act_saveProcFile = function () {
        //alert("A");
        console.log($scope.procFileObj);

        //if ($scope.procFileObj.ProcurementFileID == '') {
        //    //new PR File
        //    $scope.procFileObj.ProcurementFileID = generateGuid();
        //} else {
        //    //pr file in edit mode
        //}

        $http.post('/api/Procurement/SaveProcurementFile', $scope.procFileObj).then(
			function success(response) {
			    $scope.searchCriteria = '';
			    $scope.search();
			    $('#addProcFile').modal("toggle");
			},

			function error(response) {
			    showRequestErrorMessage(response);

			    console.log("POST fail to " + url);
			    console.log("Response Data : " + response.data);
			    console.log("Response : " + response.statusText);
			    console.log("Response Staus: " + response.statusText);
			});
    };



    //Delete Proc File
    $scope.act_deleteProcFile = function (ProcurementFileID) {
        if (confirm("Are you sure you want to Delete Proc. File?")) {

            $http.delete('/api/Procurement/DeleteProcurementFile?ProcurementFileID=' + ProcurementFileID).then(
            function success(response) {
                $scope.searchCriteria = '';
                $scope.search();
            },
            function error(response) {
                alert("Can't Delete Procurement File.\nAll related PRs should be deleted first!");

                console.log("Delete fail!");
                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);

                //showRequestErrorMessage(response);
            });
        }
    };




    //Executed on Open Modal
    $scope.openModal = function () {
        $scope.clearProcFile();
        $('#job').select2('enable');
    };



    //LookUps
    $("#job").select2({
        placeholder: "Select a Job",
        minimumInputLength: 3,
        closeOnSelect: true,
        dropdownParent: "#addProcFile",
        ajax: {
            url: "/ExternalEmployees/FindPostesByCriteria",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                //  console.log(data);
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].id_Poste,
                        JobCode: data[i].codePoste,
                        text: data[i].libellePoste
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Job) {
            return Job.text;
        },
        formatSelection: function (Job) {
            //$scope.$apply(function () {
            $scope.procFileObj.JobID = Job.id;
            $scope.procFileObj.JobCode = Job.JobCode;
            $scope.procFileObj.JobDescription = Job.text;
            //});

            return Job.JobCode;
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


    $("#archivedUnder").select2({
        placeholder: "Select a Job",
        minimumInputLength: 1,
        closeOnSelect: true,
        //    dropdownParent: "#modal-container",
        ajax: {
            url: "/ExternalEmployees/FindPostesByCriteria",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].id_Poste,
                        JobCode: data[i].codePoste,
                        text: data[i].libellePoste
                    });
                }
                console.log(arr);
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Job) {
            return Job.text;
        },
        formatSelection: function (Job) {
            //$scope.$apply(function () {
            $scope.procFileObj.ArchivedUnderJobID = Job.id;
            $scope.procFileObj.ArchivedUnderJobDescription = Job.text;
            $scope.procFileObj.ArchivedUnderJobCode = Job.JobCode;
            //});

            return Job.JobCode;
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
});




var procCondTypesConfigApp = angular.module('procCondTypesConfigApp', []);
procCondTypesConfigApp.controller('procCondTypesConfigController', function ($scope, $http) {

    //Read all default conditions
    $http.get('/api/Procurement/GetAllProcConditionTypes').then(
          function success(response) {
              $scope.lstProcConditionTypes = response.data;
          },
          function error(response) {
              console.log(response.data);
              showRequestErrorMessage(response);
              // window.location.href = '/Procurement/';
          });

    //Update row style based on status
    $scope.conditionStyle = function (index) {
        if ($scope.lstProcConditionTypes[index].isDeleted) return { "background-color": "lightcoral" };
        else if ($scope.lstProcConditionTypes[index].isUpdated) return { "background-color": "lightgreen" }
        else return "";
    }

    //Add a condition
    $scope.act_addCondition = function () {
        $scope.lstProcConditionTypes.push({ isUpdated: true });
    }

    //Update condition status
    $scope.act_updated = function (index) {
        $scope.lstProcConditionTypes[index].isUpdated = true;
    }

    //Toggele delete stastus
    $scope.act_toggleDelete = function (index) {
        $scope.lstProcConditionTypes[index].isDeleted = !$scope.lstProcConditionTypes[index].isDeleted;
    }


    //Submit changes
    $scope.act_submitConditionTypes = function () {

        var updatedConditionTypes = new Array();
        var deletedConditionTypes = new Array();

        for (var i = 0; i < $scope.lstProcConditionTypes.length; i++) {
            var cond = $scope.lstProcConditionTypes[i];
            if (cond.isDeleted)
                deletedConditionTypes.push(cond.ProcurementConditionTypeID);
            else if (cond.isUpdated)
                updatedConditionTypes.push(cond);
        }


        $http.post('/api/Procurement/SaveProcConditionTypeList', updatedConditionTypes).then(
          function success(response) {
              console.log("Update Successful");
              $http.post('/api/Procurement/DeleteProcConditionTypeList', deletedConditionTypes).then(
                  function success(response) {
                      console.log("Delete Successful");
                      window.location.href = '/Procurement/PRListing/';
                  },
                  function error(response) {
                      console.log("Delete Failed");

                      console.log(response.data);
                      showRequestErrorMessage(response);
                  });
          },
          function error(response) {
              console.log("Update Failed, Delete stopped");

              console.log(response.data);
              showRequestErrorMessage(response);
          });

        console.log(deletedConditionTypes);
    }
});




var prListingApp = angular.module('prListingApp', []);
prListingApp.controller('prListingController', function ($scope, $http) {


    //miscellaneous 
    $scope.formatDate = function (date) {
        return formatDate(date);
    };

    //Purchase request list
    $scope.lstPRs = [];

    //Pagination
    $scope.currentPage = 1;
    $scope.pageSize = '10';

    $scope.numberOfPages = function () {
        if ($scope.lstPRs == null)
            return 1;

        var count = Math.ceil($scope.lstPRs.length / $scope.pageSize);
        if (count == 0)
            count++;

        if ($scope.currentPage > count)
            $scope.currentPage = count;

        return count;
    };

    $scope.getFilteredListType = function () {
        if (document.getElementById('prRequestedByMeFilter').checked)
            return document.getElementById('prRequestedByMeFilter').value;
        else if (document.getElementById('prFollowedByMeFilter').checked)
            return document.getElementById('prFollowedByMeFilter').value;
        else
            return document.getElementById('prCompleteListFilter').value;
    };

    $scope.searchCriteria = '';
    //Fetch All Procurement Files by criteria
    $scope.search = function () {

        var url = '/api/Procurement/FindPurchaseRequest';
        url += '?criteria=' + $scope.searchCriteria;
        url += '&listType=' + $scope.getFilteredListType();

        console.log(url);

        $http.get(url).then(
            function success(response) {
                $scope.lstPRs = response.data;
                $scope.numberOfPages();
            },
            function error(response) {
                alert("Failed to get Purchase Requests!");

                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);
            });
    };





    ////Get All Purchase Requests
    //$scope.GetAllPurchaseRequests = function () {
    //    $http.get('/api/Procurement/GetAllPurchaseRequests').then(
    //		function success(response) {
    //		    $scope.lstPRs = response.data;
    //		},
    //		function error(response) {
    //		    console.log(response.status);
    //		    showRequestErrorMessage(response);
    //		});
    //};

    ////Get All PRs
    //$scope.GetAllPurchaseRequests();
    $scope.PurchaseRequestID = $.QueryString["PurchaseRequestID"];
    //Initialize PR
    if (typeof $scope.PurchaseRequestID != 'undefined') {
        var prUrl = '/api/Procurement/GetPurchaseRequestByID?PurchaseRequestID=';
        $http.get(prUrl + $scope.PurchaseRequestID).then(
			function success(response) {
			    $('#listHeader :input').prop('disabled', true);
			    $('#addNew').prop('disabled', false);
			    //$('#pageSize').prop('disabled', false);

			    //document.getElementById('listHeader').disabled = true;
			    //document.getElementById('addNew').disabled = false;
			    $scope.lstPRs.push(response.data);
			},
			function error(response) {
			    console.log(response.data);
			    alert("Failed to get the Purchase Request!\nWill Show all PRs instead!");
			});
    } else {
        $scope.search();
    }


    $scope.act_edit = function (PurchaseRequestID) {
        window.location.href = '/Procurement/PRInfo?PurchaseRequestID=' + PurchaseRequestID;
    };

    $scope.act_generateRFQ = function (PurchaseRequestID) {
        var url = '/api/Procurement/GenerateQuotation?PurchaseRequestID=' + PurchaseRequestID;
        $http.get(url).then(
          function success(response) {
              var rfq = response.data;
              if (confirm("A new Quotation has been generated with Code : " + rfq.QuotationCode + "\nWould you like to open it now?"))
                  window.location.href = '/Procurement/RFQInfo?QuotationID=' + rfq.QuotationID;
          },
          function error(response) {
              alert("Failed to Generate Quotation!");

              console.log("Response Data : " + response.data);
              console.log("Response : " + response.statusText);
              console.log("Response Staus: " + response.statusText);
          });
    };



    //miscellaneous 
    $scope.formatDate = function (date) {
        return formatDate(date);
    };
});





var prInfoApp = angular.module('prInfoApp', []);
prInfoApp.controller('prInfoController', function ($scope, $http) {
    //For select2 to work in modal
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };




    //miscellaneous 
    $scope.formatDate = function (date) {
        return formatDate(date);
    };
    $scope.addCommas = function (num) {
        return addCommas(num);
    }


    //PR object data
    $scope.prInfo;

    $scope.prObj;
    $scope.lstPRItems = new Array();
    $scope.lstPRConditions = [];
    $scope.lstPRApprovals = [];

    //calculate table totals
    $scope.totalPrice = 0;
    $scope.totalQuantity = 0;
    $scope.calculateTotals = function () {
        $scope.totalPrice = 0;
        $scope.totalQuantity = 0;

        for (var i = 0; i < $scope.lstPRItems.length; i++) {
            var prItem = $scope.lstPRItems[i];
            $scope.totalPrice += prItem.PurchaseRequestItemUnitPrice * prItem.PurchaseRequestItemQuantity;
            $scope.totalQuantity += prItem.PurchaseRequestItemQuantity;
        }
    };

    $scope.clearPR = function () {
        $scope.prInfo = {
            PurchaseRequest: {},
            ItemsList: [],
            ConditionsList: [],
            DeletedItemsList: [],
            DeletedConditionsList: []
        };

        $scope.lstPRItems = [];
        $scope.lstPRConditions = [];
        $scope.lstPRApprovals = [];

        $scope.prObj = {
            PurchaseRequestID: generateGuid(),
            PurchaseRequestStatusID: '',
            PurchaseRequestRevisionNumber: 0,
            IsCanceled: false,
            JobID: '',
            JobCode: '',
            PurchaseRequestType: 'purchase',
            PurchaseRequestOrderStatus: 'open',
            PurchaseRequestDescription: '',
            ProductReference: '',
            PurchaseRequestObjectStatusID: 1,
            PurchaseRequestCreatedDate: today(), //Object Create date
            PurchaseRequestDate: today(), //purchase Request Create Date
            PurchaseRequestIssueDate: '',
            PurchaseRequestDueDate: '',
            Requester_PersonID: '',
            PurchaseRequestPendingDescription: '',
            RequestedBy: '',
            FollowedBy: '',
            LocationID: 0,
            Location: '',
            PurchaseRequestComments: '',
            PurchaseRequestApprovalStatus: 'NA',
        };
    };
    $scope.clearPR();

    //list of workflow actions
    $scope.workflowActions = new Array();


    //Form Data
    //list of approvals
    $scope.lstApprovals = [{
        value: false,
        text: 'Approved'
    }, {
        value: true,
        text: 'Waiting for Approval'
    }];

    //list of statuses
    $scope.lstStatuses = [];
    $scope.GetAllStatuses = function () {
        $http.get('/api/Common/GetAllStatuses').then(
			function success(response) {
			    $scope.lstStatuses = response.data;

			    //Initiliaze PR status to Act
			    if ($.QueryString["PurchaseRequestID"] == undefined) {
			        $scope.prObj.PurchaseRequestStatusID = $scope.lstStatuses[0].StatusID;
			    }

			},
			function error(response) {
			    console.log(response.status);
			    showRequestErrorMessage(response);
			});
    };
    $scope.GetAllStatuses();


    //list of pendings
    $scope.lstPendings = [];
    $scope.GetAllPurchaseRequestPendings = function () {
        $http.get('/api/Procurement/GetAllPurchaseRequestPending').then(
        function success(response) {
            $scope.lstPendings = response.data;
            if ($.QueryString["PurchaseRequestID"] == undefined) {
                $scope.prObj.PurchaseRequestPendingID = $scope.lstPendings[0].PurchaseRequestPendingID;
            }
        },
        function error(response) {
            console.log(response.status); showRequestErrorMessage(response);
        });
    };
    $scope.GetAllPurchaseRequestPendings();







    $scope.PurchaseRequestID = $.QueryString["PurchaseRequestID"];
    //Initialize PR
    if (typeof $scope.PurchaseRequestID != 'undefined') {
        var prInfoUrl = '/api/Procurement/GetPurchaseRequestInfo?PurchaseRequestID=';
        $http.get(prInfoUrl + $scope.PurchaseRequestID).then(
			function success(response) {
			    console.log("Success Read");
			    $scope.prInfo = response.data;
			    if ($scope.prInfo == null) {
			        alert("PR not found!");
			        window.location.href = '/Procurement/PRListing';
			    } else {
			        $scope.prObj = $scope.prInfo.PurchaseRequest;
			        $scope.lstPRItems = $scope.prInfo.ItemsList;
			        $scope.lstPRConditions = $scope.prInfo.ConditionsList;
			        $scope.lstPRApprovals = $scope.prInfo.ApprovalsList;

			        console.log(response.data);


			        //Format dates
			        if ($scope.prObj.PurchaseRequestCreatedDate != null)
			            $scope.prObj.PurchaseRequestCreatedDate = formatDate($scope.prObj.PurchaseRequestCreatedDate);
			        if ($scope.prObj.PurchaseRequestIssueDate != null)
			            $scope.prObj.PurchaseRequestIssueDate = formatDate($scope.prObj.PurchaseRequestIssueDate);
			        if ($scope.prObj.PurchaseRequestDueDate != null)
			            $scope.prObj.PurchaseRequestDueDate = formatDate($scope.prObj.PurchaseRequestDueDate);

			        //PR Code is fixed
			        document.getElementById("prCode").disabled = true;

			        setTimeout(function () {
			            //$('#prCode').select2('data', {
			            //    id: $scope.prObj.ProcurementFileID,
			            //    text: $scope.prObj.PurchaseRequestCode
			            //});
			            //console.log($scope.prObj.Requester_PersonID);
			            //console.log($scope.prObj.RequestedBy);


			            $('#requestedBy').select2('data', {
			                id: $scope.prObj.Requester_PersonID,
			                text: $scope.prObj.RequestedBy
			            });

			            if ($scope.prObj.FollowedBy_PersonID != '00000000-0000-0000-0000-000000000000')
			                $('#followedBy').select2('data', {
			                    id: $scope.prObj.FollowedBy_PersonID,
			                    text: $scope.prObj.FollowedBy
			                });

			            if ($scope.prObj.LocationID != '00000000-0000-0000-0000-000000000000')
			                $('#loc').select2('data', {
			                    id: $scope.prObj.LocationID,
			                    text: '',
			                    code: $scope.prObj.LocationCode
			                });

			        }, 100);

			        $scope.calculateTotals();
			    }
			    hideLoader();


			    console.log("WF ID : " + $scope.prObj.WorkflowID);
			    if ($scope.prObj.WorkflowID != '00000000-0000-0000-0000-000000000000') {
			        $http.get('/api/Procurement/Workflow/Actions?workflowId=' + $scope.prObj.WorkflowID).then(
                        function success(response) {
                            $scope.workflowActions = response.data;
                            console.log("WF : " + $scope.workflowActions);
                        },
            function error(response) {
                console.log(response.status);
                showRequestErrorMessage(response);
            });
			    }



			},
			function error(response) {
			    console.log(response.data);
			    alert("Failed to get Selected Purchase Request!\nStatus: " + response.statusText +
					"\nData: " + response.data);
			    $scope.clearPR();
			    window.location.href = '/Procurement/PRListing';
			});
    }
    else {
        $http.get('/api/Common/GetLoggedInUser').then(
			function success(response) {
			    $scope.prObj.Requester_PersonID = response.data.MemberId;
			    $scope.prObj.RequestedBy = response.data.FullName;

			    setTimeout(function () {
			        $('#requestedBy').select2('data', {
			            id: $scope.prObj.Requester_PersonID,
			            text: $scope.prObj.RequestedBy
			        });
			        console.log($scope.prObj.Requester_PersonID);
			        console.log($scope.prObj.RequestedBy);
			    }, 100);
			},
                function error(response) {
                    console.log("Failed to get logged in user");
                    console.log("Response : " + response);
                    console.log("Response Data : " + response.data);
                    console.log("Response Staus: " + response.statusText);
                });


        //Get Default conditions
        $http.get('/api/Procurement/GetDefaultConditions').then(
			function success(response) {
			    $scope.lstPRConditions = response.data;
			}, function error(response) {
			    console.log("Failed to get Default conditions");
			    console.log("Response : " + response);
			    console.log("Response Data : " + response.data);
			    console.log("Response Staus: " + response.statusText);
			});



        $('#dueDate').datepicker({
            startDate: today(),
            autoclose: true
        });
    }








    $scope.submitAction = '';
    $scope.fillSubmitAction = function (action) {
        $scope.submitAction = action;
        console.log($scope.submitAction);
    };

    $scope.approvalComment = '';
    $scope.AddApprovalComment = function (action) {
        $scope.fillSubmitAction(action);
        if (action == 'Reject' || action == 'Review') {
            $('#addApprovalComment').modal("show");
        }
        else
            $scope.act_savePR(action);
    }

    $scope.act_submit = function () {
        //alert($scope.approvalComment);
        //alert($scope.submitAction);

        $scope.prInfo.PurchaseRequest = $scope.prObj;
        $scope.prInfo.ItemsList = $scope.lstPRItems;
        $scope.prInfo.ConditionsList = $scope.lstPRConditions;
        $scope.prInfo.ApprovalsList = $scope.lstPRApprovals;
        $scope.prInfo.DeletedItemsList = $scope.lstDeletedPRItems;
        $scope.prInfo.DeletedConditionsList = $scope.lstDeletedPRConditions;

        console.log("PR info to be saved" + $scope.prInfo);

        var prSaved = true;
        $http.post('/api/Procurement/SavePurchaseRequestInfo?workflowAction=' + $scope.submitAction + '&ApprovalComment=' + $scope.approvalComment, $scope.prInfo).then(
			function success(response) {
			    console.log(response.data);
			    alert("PR saved successfully " + ($scope.submitAction == '' ? '' : ('and ' + $scope.submitAction + 'ed')));
			    $scope.clearPR();
			    window.location.href = '/Procurement/PRListing';
			},
			function error(response) {
			    console.log(response.data);
			    showRequestErrorMessage(response);
			});
    }


    //Save prInfo
    $scope.act_savePR = function (workflowAction) {
        if ($scope.prObj.PurchaseRequestDescription == ''
            || $scope.prObj.PurchaseRequestDueDate == '')
            return;


        //Fill data in prInfo
        $scope.prInfo.PurchaseRequest = $scope.prObj;
        $scope.prInfo.ItemsList = $scope.lstPRItems;
        $scope.prInfo.ConditionsList = $scope.lstPRConditions;
        $scope.prInfo.ApprovalsList = $scope.lstPRApprovals;
        $scope.prInfo.DeletedItemsList = $scope.lstDeletedPRItems;
        $scope.prInfo.DeletedConditionsList = $scope.lstDeletedPRConditions;

        console.log("PR info to be saved" + $scope.prInfo);

        var prSaved = true;
        $http.post('/api/Procurement/SavePurchaseRequestInfo?workflowAction=' + workflowAction, $scope.prInfo).then(
			function success(response) {
			    console.log(response.data);
			    alert("PR saved successfully " + (workflowAction == '' ? '' : ('and ' + workflowAction + 'ed')));
			    $scope.clearPR();
			    window.location.href = '/Procurement/PRListing';
			},
			function error(response) {
			    console.log(response.data);
			    showRequestErrorMessage(response);
			});
    };


    //Delete PR
    $scope.act_deletePR = function (PurchaseRequestID) {
        if (confirm("Are you sure you want to Delete Purchase Request?")) {
            $http.delete('/api/Procurement/DeletePurchaseRequest?PurchaseRequestID=' + PurchaseRequestID).then(
				function success(response) {
				    window.location.href = '/Procurement/PRListing';
				},
				function error(response) {
				    showRequestErrorMessage(response);
				});
        }
    };


    //////////
    //PR Items
    //////////
    $scope.GetItemNum = function () {
        var num = 0;
        for (var i = 0; i < $scope.lstPRItems.length; i++) {
            if ($scope.lstPRItems[i].seqNum > num)
                num = $scope.lstPRItems[i].seqNum;
        }
        num = num + 1;
        return num;
    };
    $scope.lstDeletedPRItems = [];
    $scope.currentPRItem;

    $scope.clearPRItem = function () {
        $scope.currentPRItem = {
            PurchaseRequestItemID: '',
            PurchaseRequestID: '',
            PurchaseRequestItemCode: '',
            UnitID: '',
            LotID: '',
            Lot: '',
            ProductCode: '',
            MasterFormatID: 0,
            MasterFormat: '', //'based on product ref',
            PurchaseRequestItemDescription: '',
            PurchaseRequestItemDetails: '',
            PurchaseRequestItemQuantity: '',
            PurchaseRequestItemUnitPrice: 0,
            PurchaseRequestItemUnitCoefficient: 0,
            QTYPUM: 0,
            PUM: '',
            CurrencyID: '',
            Currency: '',
            seqNum: $scope.GetItemNum(),
            PurchaseRequestItemCreatedDate: today(),
            PurchaseRequestItemObjectStatus: 1,
            isModified: false
        };


        //reset select2
        $('#prodCode').select2("val", "");
        $('#lot').select2("val", "");
        $('#CUM').select2("val", "");
        $('#itemCurrency').select2("val", "");
    };

    $scope.clearPRItem();

    $scope.act_addPRItem = function () {
        if ($scope.currentPRItem.PurchaseRequestItemID == '') {
            //NEW ITEM
            $scope.currentPRItem.PurchaseRequestID = $scope.prObj.PurchaseRequestID;
            $scope.currentPRItem.PurchaseRequestItemID = generateGuid();
            $scope.lstPRItems.push($scope.currentPRItem);
        } else {
            //UPDATE ITEM
        }


        $scope.clearPRItem();

        $scope.calculateTotals();
        $('#addItemModal').modal('hide');
    };


    $scope.act_editPRItem = function (PurchaseRequestItemID) {
        var found = false;
        for (var i = 0; i < $scope.lstPRItems.length; i++) {
            if ($scope.lstPRItems[i].PurchaseRequestItemID == PurchaseRequestItemID) {
                $scope.currentPRItem = $scope.lstPRItems[i];

                $('#lot').select2('data', {
                    id: $scope.currentPRItem.LotID,
                    text: '',
                    code: $scope.currentPRItem.LotCode
                });

                $('#itemCurrency').select2('data', {
                    id: $scope.currentPRItem.CurrencyID,
                    text: '',
                    code: $scope.currentPRItem.CurrencyCode
                });


                $('#prodCode').select2('data', {
                    id: $scope.currentPRItem.ProductID,
                    text: $scope.currentPRItem.PurchaseRequestItemDescription,
                    code: $scope.currentPRItem.ProductCode,
                    MasterForamtCode: $scope.currentPRItem.MasterFormatCode,
                    PUM_UnitCode: $scope.currentPRItem.PUM_UnitCode,
                    PUM_UnitID: $scope.currentPRItem.PUM_UnitID,
                    CUM_UnitID: $scope.currentPRItem.UnitID,
                    CUM_UnitCode: $scope.currentPRItem.UnitCode,
                });

                $('#cum').select2('data', {
                    id: $scope.currentPRItem.UnitID,
                    text: '',
                    code: $scope.currentPRItem.UnitCode,
                });



                found = true;
                break;
            }
        }
        if (!found) {
            alert("Couldn't Load PR Item!");
            $('#addApprovalComment').modal("show");
        }
    };

    $scope.act_deletePRItem = function (PurchaseRequestItemID) {
        if (confirm("Are you sure you want to delete this item?")) {
            for (var i = 0; i < $scope.lstPRItems.length; i++) {
                if ($scope.lstPRItems[i].PurchaseRequestItemID == PurchaseRequestItemID) {
                    $scope.lstPRItems.splice(i, 1);
                    $scope.lstDeletedPRItems.push(PurchaseRequestItemID);
                    break;
                }
            }
            $scope.calculateTotals();
        }

    };


    //////////////
    //PR Condition
    //////////////
    $scope.lstDeletedPRConditions = [];
    $scope.currentPRCondition;

    $scope.clearPRCondition = function () {
        $scope.currentPRCondition = {
            PurchaseRequestConditionID: null,
            PurchaseRequestID: null,
            ProcurementConditionTypeID: null,
            ProcurementConditionTypeDescription: '',
            PurchaseRequestConditionDescription: '',
            PurchaseRequestConditionCreatedDate: today(),
            isModified: false
        };

        $('#condType').select2("val", "");
    };
    $scope.clearPRCondition();


    //Add Condition
    $scope.act_addPRCondition = function () {
        //Old Code with Modal
        //if ($scope.currentPRCondition.PurchaseRequestConditionID == '') {
        //    $scope.currentPRCondition.PurchaseRequestID = $scope.prObj.PurchaseRequestID;
        //    $scope.currentPRCondition.PurchaseRequestConditionID = generateGuid();
        //}

        //$scope.lstPRConditions.push($scope.currentPRCondition);
        //$scope.clearPRCondition();
        //$('#addConditionModal').modal('hide');


        //New Code without modal
        $scope.clearPRCondition();
        $scope.lstPRConditions.push($scope.currentPRCondition);
        //$scope.lstPRConditions.unshift($scope.currentPRCondition);
    };





    //Edit Condition
    //$scope.act_editPRCondition = function (PurchaseRequestConditionID) {
    //    var found = false;
    //    for (var i = 0; i < $scope.lstPRConditions.length; i++) {
    //        if ($scope.lstPRConditions[i].PurchaseRequestConditionID == PurchaseRequestConditionID) {
    //            $scope.currentPRCondition = $scope.lstPRConditions[i];

    //            $('#condType').select2('data', {
    //                id: $scope.currentPRCondition.ProcurementConditionTypeID,
    //                text: $scope.currentPRCondition.ProcurementConditionTypeDescription,
    //                code: $scope.currentPRCondition.ProcurementConditionTypeCode
    //            });


    //            found = true;
    //            break;
    //        }
    //    }
    //    if (!found) {
    //        alert("Couldn't Load PR Condition!");
    //        $('#addItemCondition').modal("hide");
    //    }
    //};


    //Delete Condition
    //$scope.act_deletePRCondition = function (PurchaseRequestConditionID) {
    //    if (confirm("Are you sure you want to delete this condition?")) {
    //        for (var i = 0; i < $scope.lstPRConditions.length; i++) {
    //            if ($scope.lstPRConditions[i].PurchaseRequestConditionID == PurchaseRequestConditionID) {
    //                $scope.lstPRConditions.splice(i, 1);
    //                $scope.lstDeletedPRConditions.push(PurchaseRequestConditionID);
    //                break;
    //            }
    //        }
    //    }
    //};







    ////////////////
    //Import From PR
    /////////////////
    $scope.lstImportedPRs;
    $scope.lstImportedPRItems;
    $scope.lstImportedPRConditions;

    $scope.act_openImportModal = function () {
        //$("#prImportTable").dataTable();
        //$('#prImportTable').attr('placeholder', 'Search...');


        //init.push(function () {
        //$('#jq-datatables-example').dataTable();
        //$('#jq-datatables-example_wrapper .table-caption').text('Some header text');
        //$('#jq-datatables-example_wrapper .dataTables_filter input').attr('placeholder', 'Search...');
        //});


        $scope.lstImportedPRs = null;
        $scope.lstImportedPRItems = new Array();
        $scope.lstImportedPRConditions = new Array();

        $scope.act_getPRListForImport();


        //Reset Pagination data
        $scope.currentPage = 1;
        $scope.pageSize = '10';
        $scope.searchCriteria = '';
        $scope.search();
    }

    $scope.act_getPRListForImport = function () {
        //alert("A");
        var url = '/api/Procurement/GetAllPRInfosExcept';
        //alert($scope.prObj.PurchaseRequestID);
        url = url + '?PurchaseRequestID=' + $scope.prObj.PurchaseRequestID;
        console.log(url);
        $http.get(url).then(
                    function success(response) {
                        $scope.lstImportedPRs = response.data;
                    },
                    function error(response) {
                        showRequestErrorMessage(response);
                    });
    };


    $scope.act_clickRow = function (index, list) {
        //NOTE : THE INDEX IN TABLE IS ADDED +1 FOR UX
        //alert($scope.lstImportedPRs[index].isSelected);
        var selectedList;
        if (list == 'items')
            selectedList = $scope.lstImportedPRItems;
        else if (list == 'PRs')
            selectedList = $scope.lstImportedPRs;
        else if (list == 'conditions')
            selectedList = $scope.lstImportedPRConditions;
        else
            return;


        if (selectedList[index].isSelected == 'undefined')
            selectedList[index].isSelected = true;
        else
            selectedList[index].isSelected = !selectedList[index].isSelected;


        //if ($scope.lstImportedPRs[index].isSelected == 'undefined')
        //    $scope.lstImportedPRs[index].isSelected = true;
        //else
        //    $scope.lstImportedPRs[index].isSelected = !$scope.lstImportedPRs[index].isSelected;
    };


    $scope.act_openItemsImportModal = function () {
        for (var prIndex = 0; prIndex < $scope.lstImportedPRs.length; prIndex++) {
            var currentPR = $scope.lstImportedPRs[prIndex];
            if (currentPR.isSelected) {
                console.log("I = " + prIndex + ", PR = " + $scope.lstImportedPRs[prIndex].PurchaseRequest.PurchaseRequestID);

                for (var itemIndex = 0; itemIndex < currentPR.ItemsList.length; itemIndex++) {
                    var currentItem = currentPR.ItemsList[itemIndex];
                    currentItem.PurchaseRequestID = $scope.prObj.PurchaseRequestID;
                    currentItem.PurchaseRequestItemID = generateGuid();
                    console.log("Current Item : " + currentItem);
                    $scope.lstImportedPRItems.push(currentItem);
                }
                console.log($scope.lstImportedPRItems);
            }
        }

        $('#importItemsModal').modal("toggle");
    };


    //Add the imported items to the pr items list
    $scope.act_importSelectedItems = function () {
        for (var itemIndex = 0; itemIndex < $scope.lstImportedPRItems.length; itemIndex++) {
            var currentPRItem = $scope.lstImportedPRItems[itemIndex];
            if (currentPRItem.isSelected) {
                console.log("I = " + itemIndex + ", PR Item = " + currentPRItem);

                currentPRItem.PurchaseRequestID = $scope.prObj.PurchaseRequestID;
                currentPRItem.PurchaseRequestItemID = generateGuid();
                currentPRItem.isModified = false;
                console.log("Current Item : " + currentPRItem);
                $scope.lstPRItems.push(currentPRItem);
            }
        }

        $scope.calculateTotals();
    };



    $scope.act_openConditionsImportModal = function () {
        for (var prIndex = 0; prIndex < $scope.lstImportedPRs.length; prIndex++) {
            var currentPR = $scope.lstImportedPRs[prIndex];
            if (currentPR.isSelected) {
                console.log("I = " + prIndex + ", PR = " + $scope.lstImportedPRs[prIndex].PurchaseRequest.PurchaseRequestID);

                for (var condIndex = 0; condIndex < currentPR.ConditionsList.length; condIndex++) {
                    var currentCond = currentPR.ConditionsList[condIndex];
                    currentCond.PurchaseRequestID = $scope.prObj.PurchaseRequestID;
                    currentCond.PurchaseRequestConditionID = generateGuid();
                    console.log("Current Condition : " + currentCond);
                    $scope.lstImportedPRConditions.push(currentCond);
                }
            }
        }

        $('#importConditionsModal').modal("toggle");
    };



    $scope.act_importSelectedConditions = function () {
        for (var condIndex = 0; condIndex < $scope.lstImportedPRConditions.length; condIndex++) {
            var currentCond = $scope.lstImportedPRConditions[condIndex];
            if (currentCond.isSelected) {
                currentCond.PurchaseRequestID = $scope.prObj.PurchaseRequestID;
                currentCond.PurchaseRequestConditionID = generateGuid();

                //This will result in considering all imported conditions as custom conditions
                currentCond.ProcurementConditionTypeID = null;

                console.log("Current Condition : " + currentCond);
                $scope.lstPRConditions.push(currentCond);
            }
        }
    };









    //lookups
    //PR

    if (typeof $scope.PurchaseRequestID == 'undefined') {
        $("#prCode").select2({
            placeholder: "Select a Procurement File",
            minimumInputLength: 2,
            closeOnSelect: true,
            ajax: {
                url: "/Procurement/FindProcurementFile/",
                dataType: 'json',
                error: function () {
                    alert("Temporary error. Please try again...");
                },
                data: function (term, page) {
                    return {
                        criteria: term,
                        pageSize: 10,
                        pageNumber: page,
                        status: 'Act'
                    };
                },
                results: function (data, page) {
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                        arr.push({
                            id: data[i].ProcurementFileID,
                            procFileRef: data[i].ProcurementFileCode,
                            JobCode: data[i].JobCode,
                            JobID: data[i].JobID,
                            description: data[i].ProcurementFileDescription,
                        });
                    }
                    return {
                        results: arr
                    };
                }
            },
            formatResult: function (ProcFile) {
                return ProcFile.procFileRef + " - " + ProcFile.description;
            },
            formatSelection: function (ProcFile) {
                $scope.$apply(function () {
                    $scope.prObj.ProcurementFileID = ProcFile.id;
                    $scope.prObj.JobCode = ProcFile.JobCode;
                    $scope.prObj.JobID = ProcFile.JobID;
                });
                return ProcFile.procFileRef;
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
    }



    $("#requestedBy").select2({
        placeholder: "Select a Person",
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/ExternalEmployees/FindMembersByCriteria",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].MemberId,
                        text: data[i].FullName
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Member) {
            return Member.text;
        },
        formatSelection: function (Member) {
            $scope.$apply(function () {
                console.log(Member.id);
                $scope.prObj.Requester_PersonID = Member.id;
                $scope.prObj.RequestedBy = Member.text;

            });
            return Member.text;
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


    $("#followedBy").select2({
        placeholder: "Select a Person",
        initSelection: true,
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/ExternalEmployees/FindMembersByCriteria",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].MemberId,
                        text: data[i].FullName
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Member) {
            return Member.text;
        },
        formatSelection: function (Member) {
            $scope.$apply(function () {
                $scope.prObj.FollowedBy_PersonID = Member.id;
                $scope.prObj.FollowedBy = Member.text;
            });
            return Member.text;
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



    $("#loc").select2({
        placeholder: "Select a Location",
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindLocation",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].LocationID,
                        text: data[i].LocationDescription + ' - ' + data[i].LocationCode,
                        code: data[i].LocationCode,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Location) {
            return Location.text;
        },
        formatSelection: function (Location) {
            $scope.$apply(function () {
                $scope.prObj.LocationID = Location.id;
                $scope.prObj.LocationCode = Location.code
            });
            return Location.code;
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





    //PRItem
    $("#lot").select2({
        placeholder: "Select a Lot",
        minimumInputLength: 2,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindLotInPoste",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    id_poste: $scope.prObj.JobID,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].id_LotPoste,
                        text: data[i].libelleLotPoste + ' - ' + data[i].codeLotPoste,
                        code: data[i].codeLotPoste,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Lot) {
            return Lot.text;
        },
        formatSelection: function (Lot) {
            //$scope.$apply(function () {
            $scope.currentPRItem.LotID = Lot.id;
            $scope.currentPRItem.LotCode = Lot.code;
            //});
            return Lot.code;
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


    $("#prodCode").select2({
        placeholder: "Select a Product",
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindProduct",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].ProductID,
                        text: data[i].ProductDescription,
                        code: data[i].ProductCode,
                        MasterForamtCode: data[i].MasterFormatCode,
                        PUM_UnitID: data[i].PUM_UnitID,
                        PUM_UnitCode: data[i].PUM_UnitCode,
                        CUM_UnitID: data[i].CUM_UnitID,
                        CUM_UnitCode: data[i].CUM_UnitCode,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Product) {
            return Product.text + ' - ' + Product.code;
        },
        formatSelection: function (Product) {

            if (!$scope.$$phase) {    //rootScope.$apply();

                $scope.$apply(function () {
                    $scope.currentPRItem.ProductID = Product.id;
                    $scope.currentPRItem.PurchaseRequestItemDescription = Product.text;
                    $scope.currentPRItem.ProductCode = Product.code;
                    $scope.currentPRItem.MasterFormatCode = Product.MasterForamtCode;
                    $scope.currentPRItem.PUM_UnitID = Product.PUM_UnitID;
                    $scope.currentPRItem.PUM_UnitCode = Product.PUM_UnitCode;
                    $scope.currentPRItem.UnitID = Product.CUM_UnitID;
                    $scope.currentPRItem.UnitCode = Product.CUM_UnitCode;

                    $('#cum').select2('data', {
                        id: $scope.currentPRItem.UnitID,
                        text: '',
                        code: $scope.currentPRItem.UnitCode,
                    });
                });

                console.log(Product.CUM_UnitID);
                console.log(Product.CUM_UnitCode);

            }

            return Product.code;
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


    $("#cum").select2({
        placeholder: "Select a Unit",
        minimumInputLength: 2,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindUnit",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].UnitID,
                        text: data[i].UnitCode + ' - ' + data[i].UnitDescription,
                        code: data[i].UnitCode
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Unit) {
            return Unit.text;
        },
        formatSelection: function (Unit) {
            if (!$scope.$$phase) {
                $scope.$apply(function () {
                    $scope.currentPRItem.UnitID = Unit.id;
                    $scope.currentPRItem.UnitCode = Unit.code;
                });
            }
            return Unit.code;
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



    $("#itemCurrency").select2({
        placeholder: "Select a Currency",
        minimumInputLength: 2,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindCurrency",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page,
                    fromBois: true
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].CurrencyID,
                        text: data[i].CurrencyDescription + ' - ' + data[i].CurrencyCode,
                        code: data[i].CurrencyCode,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Currency) {
            return Currency.text;
        },
        formatSelection: function (Currency) {
            //$scope.$apply(function () {
            $scope.currentPRItem.CurrencyID = Currency.id;
            $scope.currentPRItem.CurrencyCode = Currency.code;
            //});
            return Currency.code;
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






    //PR Condition Type
    $("#condType").select2({
        placeholder: "Select a Condition Type",
        minimumInputLength: 0,
        closeOnSelect: true,
        ajax: {
            url: "/Procurement/FindProcurementConditionTypes",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].ProcurementConditionTypeID,
                        text: data[i].ProcurementConditionTypeDescription,
                        code: data[i].ProcurementConditionTypeCode,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (CondType) {
            return CondType.text + ' - ' + CondType.code;
        },
        formatSelection: function (CondType) {
            //$scope.$apply(function () {
            $scope.currentPRCondition.ProcurementConditionTypeID = CondType.id;
            $scope.currentPRCondition.ProcurementConditionTypeCode = CondType.code;
            $scope.currentPRCondition.ProcurementConditionTypeDescription = CondType.text;
            //});
            return CondType.code;
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








    //PR Items excel Import
    //$scope.inputItemsExcelFile;

    $(function () {
        $('#excelItemsImportAlias').click(function () {
            $('#excelItemsImport').click();
        });
    });

    $('#excelItemsImport').on('change', function (e) {
        var files = e.target.files;
        //  console.log(files);
        //    var myID = 3; //uncomment this to make sure the ajax URL works
        if (files.length > 0) {
            if (window.FormData !== undefined) {
                var data = new FormData();
                data.append('uploadedFile', files[0]);
                console.log(data);
                //for (var x = 0; x < files.length; x++) {
                //    data.append("file" + x, files[x]);
                //}
                document.getElementById('excelItemsImport').value = null;


                $.ajax({
                    type: "POST",
                    url: '/Procurement/ParseInputExcelFileOfPRItems',
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (response) {
                        console.log(response);

                        var ItemsList = response;

                        $scope.$apply(function () {
                            for (var itemIndex = 0; itemIndex < response.length; itemIndex++) {

                                response[itemIndex].PurchaseRequestID = $scope.prObj.PurchaseRequestID;
                                response[itemIndex].PurchaseRequestItemID = generateGuid();
                                response[itemIndex].PurchaseRequestItemCode = '';
                                console.log("Current Item (" + itemIndex + ") : " + response[itemIndex]);
                            }
                            $scope.lstPRItems = $scope.lstPRItems.concat(response);
                        });


                    },
                    error: function (xhr, status, p3, p4) {
                        ItemsList = new Array();
                        var err = "Error " + " " + status + " " + p3 + " " + p4;
                        if (xhr.responseText && xhr.responseText[0] == "{")
                            err = JSON.parse(xhr.responseText).Message;
                        console.log(err);
                    }
                });

            } else {
                alert("This browser doesn't support HTML5 file uploads!");
            }
        }
    });









    //PR Conditions excel Import

    //$scope.inputConditionsExcelFile;

    $(function () {
        $('#excelConditionsImportAlias').click(function () {
            $('#excelConditionsImport').click();
        });
    });

    $('#excelConditionsImport').on('change', function (e) {
        var files = e.target.files;
        //  console.log(files);
        //    var myID = 3; //uncomment this to make sure the ajax URL works
        if (files.length > 0) {
            if (window.FormData !== undefined) {
                var data = new FormData();
                data.append('uploadedFile', files[0]);
                console.log(data);
                //for (var x = 0; x < files.length; x++) {
                //    data.append("file" + x, files[x]);
                //}
                document.getElementById('excelConditionsImport').value = null;


                $.ajax({
                    type: "POST",
                    url: '/Procurement/ParseInputExcelFileOfPRConditions',
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (response) {
                        console.log(response);

                        var ConditionsList = response;

                        $scope.$apply(function () {
                            for (var condIndex = 0; condIndex < response.length; condIndex++) {

                                response[condIndex].PurchaseRequestID = $scope.prObj.PurchaseRequestID;
                                response[condIndex].PurchaseRequestConditionID = generateGuid();
                                response[condIndex].PurchaseRequestConditionCreatedDate = today();
                                response[condIndex].isModified = false;

                                console.log("Current Cond (" + condIndex + ") : " + response[condIndex]);
                            }
                            $scope.lstPRConditions = $scope.lstPRConditions.concat(response);
                        });


                    },
                    error: function (xhr, status, p3, p4) {
                        ItemsList = new Array();
                        var err = "Error " + " " + status + " " + p3 + " " + p4;
                        if (xhr.responseText && xhr.responseText[0] == "{")
                            err = JSON.parse(xhr.responseText).Message;
                        console.log(err);
                    }
                });

            } else {
                alert("This browser doesn't support HTML5 file uploads!");
            }
        }
    });












    //Excel Export
    $("#exportItemsToExcel").click(function () {
        $("#itemsTable").table2excel({
            // exclude CSS class
            exclude: ".noExl",
            name: "Worksheet Name",
            filename: "items" //do not include extension 
        });
    });


    $("#exportConditionsToExcel").click(function () {
        $("#conditionsTable").table2excel({
            // exclude CSS class
            exclude: ".noExl",
            name: "Worksheet Name",
            filename: "conditions" //do not include extension 
        });
    });












    //Pagination
    $scope.currentPage = 1;
    $scope.pageSize = '10';
    $scope.searchCriteria = '';

    //Fetch All PR Infos by criteria
    $scope.search = function () {
        var url = '/api/Procurement/FindPRInfoExcept';
        url += '?criteria=' + $scope.searchCriteria;
        url += '&PurchaseRequestID=' + $scope.prObj.PurchaseRequestID;

        $http.get(url).then(
            function success(response) {
                $scope.lstImportedPRs = response.data;
            },
            function error(response) {
                alert("Failed to get Purchase Request Info!");

                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);
            });
    };
    $scope.search();

    $scope.numberOfPages = function () {
        if ($scope.lstImportedPRs == null)
            return 1;

        var count = Math.ceil($scope.lstImportedPRs.length / $scope.pageSize);
        if (count == 0)
            count++;

        if ($scope.currentPage > count)
            $scope.currentPage = count;

        return count;
    };














    //Style of modified rows
    $scope.isModifiedStyle = function (isModified) {
        if (isModified)
            return { "background-color": "lightcoral" }
        else
            return "";
    }
});




















var rfqListingApp = angular.module('rfqListingApp', []);
rfqListingApp.controller('rfqListingController', function ($scope, $http) {


    //miscellaneous 
    $scope.formatDate = function (date) {
        return formatDate(date);
    };

    //Purchase request list
    $scope.lstRFQs = [];

    //Pagination
    $scope.currentPage = 1;
    $scope.pageSize = '10';

    $scope.numberOfPages = function () {
        if ($scope.lstRFQs == null)
            return 1;

        var count = Math.ceil($scope.lstRFQs.length / $scope.pageSize);
        if (count == 0)
            count++;

        if ($scope.currentPage > count)
            $scope.currentPage = count;

        return count;
    };

    $scope.getFilteredListType = function () {
        if (document.getElementById('rfqFollowedByMeFilter').checked)
            return document.getElementById('rfqFollowedByMeFilter').value;
        else
            return document.getElementById('rfqCompleteListFilter').value;
    };

    $scope.searchCriteria = '';
    //Fetch All Quotations by criteria
    $scope.search = function () {

        var url = '/api/Procurement/FindQuotation';
        url += '?criteria=' + $scope.searchCriteria;
        url += '&listType=' + $scope.getFilteredListType();

        console.log(url);

        $http.get(url).then(
            function success(response) {
                $scope.lstRFQs = response.data;
                $scope.numberOfPages();
            },
            function error(response) {
                alert("Failed to get Purchase Requests!");

                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);
            });
    };





    //Get All Quotations
    //$scope.GetAllQuotations = function () {
    //    $http.get('/api/Procurement/GetAllQuotations').then(
    //		function success(response) {
    //		    $scope.lstRFQs = response.data;
    //		},
    //		function error(response) {
    //		    console.log(response.status);
    //		    showRequestErrorMessage(response);
    //		});
    //};

    //Get All PRs
    //$scope.GetAllPurchaseRequests();
    $scope.PurchaseRequestID = $.QueryString["PurchaseRequestID"];
    //Initialize PR
    if (typeof $scope.PurchaseRequestID != 'undefined') {
        var prUrl = '/api/Procurement/GetAllQuotationsInPR?PurchaseRequestID=';
        $http.get(prUrl + $scope.PurchaseRequestID).then(
			function success(response) {
			    $('#listHeader :input').prop('disabled', true);
			    //$('#addNew').prop('disabled', false);
			    $('#pageSize').prop('disabled', false);

			    $scope.lstRFQs = response.data;
			},
			function error(response) {
			    console.log(response.data);
			    alert("Failed to get the Purchase Request!\nWill Show all PRs instead!");
			});
    } else {
        $scope.search();
    }


    $scope.act_edit = function (QuotaionID) {
        window.location.href = '/Procurement/RFQInfo?QuotationID=' + QuotaionID;
    };

});






var rfqInfoApp = angular.module('rfqInfoApp', []);
rfqInfoApp.controller('rfqInfoController', function ($scope, $http, $timeout) {
    //For select2 to work in modal
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };


    $('#tooltip span').tooltip();


    $scope.act_DeleteMedia = function (obj) {
        //alert(obj.MediaID);
        $http.get("/api/Content/DeleteMedia?MediaID=" + obj.MediaID).then(
            function sucess(response) {
                obj.MediaID = '00000000-0000-0000-0000-000000000000';
            }, function error(response) { });
    };
    //miscellaneous 
    $scope.formatDate = function (date) {
        return formatDate(date);
    };
    $scope.addCommas = function (num) {
        return addCommas(num);
    };
    $scope.isEmptyOrNull = function (guid) {
        return isEmptyOrNull(guid);
    };

    //PR object data
    $scope.rfqInfo;

    $scope.rfqObj;
    $scope.lstItems = new Array();
    $scope.lstConditions = [];
    $scope.lstIncomingDocuments = [];
    $scope.lstDocuments = [];
    $scope.lstDeletedItems = [];
    $scope.lstDeletedConditions = [];
    $scope.lstDeletedIncomingDocuments = [];
    $scope.lstDeletedDocuments = [];


    //calculate table totals
    $scope.totalPrice = 0;
    $scope.totalQuantity = 0;
    $scope.calculateTotals = function () {
        $scope.totalPrice = 0;
        $scope.totalQuantity = 0;

        for (var i = 0; i < $scope.lstItems.length; i++) {
            var rfqItem = $scope.lstItems[i];
            $scope.totalPrice += rfqItem.QuotationItemUnitPrice * rfqItem.QuotationItemQuantity;
            $scope.totalQuantity += rfqItem.QuotationItemQuantity;
        }
    };




    //list of statuses
    $scope.lstStatuses = [];
    $scope.GetAllStatuses = function () {
        $http.get('/api/Common/GetAllStatuses').then(
			function success(response) {
			    $scope.lstStatuses = response.data;
			},
			function error(response) {
			    console.log(response.status);
			    showRequestErrorMessage(response);
			});
    };
    $scope.GetAllStatuses();

    //list of Document Types
    $scope.lstDocumentTypes = [];
    $scope.GetAllDocumentTypes = function () {
        $http.get('/api/Common/GetAllDocumentTypesForProcurement').then(
			function success(response) {
			    $scope.lstDocumentTypes = response.data;
			},
			function error(response) {
			    console.log(response.status);
			    showRequestErrorMessage(response);
			});
    };
    $scope.GetAllDocumentTypes();



    $scope.QuotationID = $.QueryString["QuotationID"];
    //Initialize PR
    if (typeof $scope.QuotationID != 'undefined') {
        var url = '/api/Procurement/GetQuotationInfo?QuotationID=';
        url = url + $scope.QuotationID;
        $http.get(url).then(
			function success(response) {
			    console.log("Success Read");
			    $scope.rfqInfo = response.data;
			    if ($scope.rfqInfo == null) {
			        alert("RFQ not found!");
			        window.location.href = '/Procurement/RFQListing';
			    } else {
			        $scope.rfqObj = $scope.rfqInfo.Quotation;
			        $scope.lstItems = $scope.rfqInfo.ItemsList;
			        $scope.lstConditions = $scope.rfqInfo.ConditionsList;
			        $scope.lstIncomingDocuments = $scope.rfqInfo.IncomingDocumentsList;
			        $scope.lstDocuments = $scope.rfqInfo.DocumentsList;



			        console.log(response.data);
			        console.log($scope.rfqObj);
			        console.log($scope.lstItems);
			        console.log($scope.lstConditions);
			        console.log($scope.lstIncomingDocuments);
			        console.log($scope.lstDocuments);

			        //Format dates
			        if ($scope.rfqObj.QuotationCreatedDate != null)
			            $scope.rfqObj.QuotationCreatedDate = formatDate($scope.rfqObj.QuotationCreatedDate);
			        if ($scope.rfqObj.QuotationRequestDate != null) {
			            $scope.rfqObj.QuotationRequestDate = formatDate($scope.rfqObj.QuotationRequestDate);
			            $('#supplier').select2('disable');
			            $('#contact').select2('disable');
			        }
			        if ($scope.rfqObj.QuotationResponseDate != null)
			            $scope.rfqObj.QuotationResponseDate = formatDate($scope.rfqObj.QuotationResponseDate);


			        for (var i = 0 ; i < $scope.lstDocuments.length; i++) {
			            $scope.lstDocuments[i].ThirdParty = $scope.rfqObj.Contact == '' ? $scope.rfqObj.Supplier : $scope.rfqObj.Contact;
			            if ($scope.lstDocuments[i].QuotationDocumentCreatedDate != null)
			                $scope.lstDocuments[i].QuotationDocumentCreatedDate = formatDate($scope.lstDocuments[i].QuotationDocumentCreatedDate);
			        }

			        for (var i = 0 ; i < $scope.lstIncomingDocuments.length; i++) {
			            if ($scope.lstIncomingDocuments[i].QuotationIncomingDocumentDate != null)
			                $scope.lstIncomingDocuments[i].QuotationIncomingDocumentDate = formatDate($scope.lstIncomingDocuments[i].QuotationIncomingDocumentDate);
			            if ($scope.lstIncomingDocuments[i].QuotationIncomingDocumentRecievedDate != null)
			                $scope.lstIncomingDocuments[i].QuotationIncomingDocumentRecievedDate = formatDate($scope.lstIncomingDocuments[i].QuotationIncomingDocumentRecievedDate);
			        }

			        setTimeout(function () {

			            if (!isEmptyOrNull($scope.rfqObj.FollowedBy_PersonID))
			                $('#followedBy').select2('data', {
			                    id: $scope.rfqObj.FollowedBy_PersonID,
			                    text: $scope.rfqObj.FollowedBy
			                });

			            if (!isEmptyOrNull($scope.rfqObj.SupplierID))
			                $('#supplier').select2('data', {
			                    id: $scope.rfqObj.SupplierID,
			                    text: $scope.rfqObj.Supplier,
			                    email: $scope.rfqObj.SupplierEmail,
			                    contactID: $scope.rfqObj.Contact_SupplierID,
			                });
			        }, 10);
			        setTimeout(function () {

			            if (!isEmptyOrNull($scope.rfqObj.Contact_SupplierID))
			                $('#contact').select2('data', {
			                    id: $scope.rfqObj.Contact_SupplierID,
			                    text: $scope.rfqObj.Contact,
			                    email: $scope.rfqObj.ContactEmail,
			                });
			        }, 1000);

			        $scope.calculateTotals();
			    }
			    hideLoader();
			},
			function error(response) {
			    console.log(response.data);
			    alert("Failed to get Selected Quotation!\nStatus: " + response.statusText +
					"\nData: " + response.data);

			    window.location.href = '/Procurement/RFQListing';
			});
    }
    else {
        alert("No Qoutation ID found in address");
        window.location.href = '/Procurement/RFQListing';
    }



    //Save rfqInfo
    $scope.act_saveRFQ = function () {

        //Fill data in rfqInfo
        $scope.rfqInfo.Quotation = $scope.rfqObj;
        $scope.rfqInfo.ItemsList = $scope.lstItems;
        $scope.rfqInfo.ConditionsList = $scope.lstConditions;
        $scope.rfqInfo.IncomingDocumentsList = $scope.lstIncomingDocuments;
        $scope.rfqInfo.DocumentsList = $scope.lstDocuments;
        $scope.rfqInfo.DeletedItemsList = $scope.lstDeletedItems;
        $scope.rfqInfo.DeletedConditionsList = $scope.lstDeletedConditions;
        $scope.rfqInfo.DeletedIncomingDocumentsList = $scope.lstDeletedIncomingDocuments;
        $scope.rfqInfo.DeletedDocumentsList = $scope.lstDeletedDocuments;


        console.log("RFQ info to be saved" + $scope.rfqInfo);

        $http.post('/api/Procurement/SaveQuotationInfo', $scope.rfqInfo).then(
			function success(response) {
			    console.log(response.data);
			    alert("RFQ saved successfully");
			    //window.location.href = '/Procurement/RFQListing';
			},
			function error(response) {
			    console.log(response.data);
			    showRequestErrorMessage(response);
			});
    };


    //Delete RFQ
    $scope.act_deleteRFQ = function () {
        if (confirm("Are you sure you want to Delete Qoutation Request?")) {
            $http.delete('/api/Procurement/DeleteQuotation?QuotationID=' + $scope.rfqObj.QuotationID).then(
				function success(response) {
				    window.location.href = '/Procurement/RFQListing';
				},
				function error(response) {
				    showRequestErrorMessage(response);
				});
        }
    };


    //Quotation Issue
    $scope.act_issueRFQ = function () {

        if (!$('#mainForm')[0].checkValidity()) {
            document.getElementById("submit").click();
            return;
        }

        if (isEmptyOrNull($scope.rfqObj.SupplierID))
            alert("Can't Issue RFQ Without Supplier!");
        else if ($scope.rfqObj.QuotationResponseDaysLimit == 0 && !confirm("Do you want to Issue RFQ with Zero days reponse limit?"))
            return;
        else {
            $http.post('/api/Procurement/IssueQuotation', $scope.rfqObj).then(
                function success(response) {
                    $('#supplier').select2('disable');
                    $('#contact').select2('disable');
                    var MediaID = response.data;
                    $scope.rfqObj.QuotationRequestDate = today();
                    document.getElementById('download_iframe').src = '/Content/GetFile?MediaID=' + MediaID;

                    if (isEmptyOrNull(response.data))
                        alert("RFQ Issued but couldn't archive file!");

                    $scope.clearEmail();
                    $scope.email.Attachment_MediaID = MediaID;

                    if (!isEmptyOrNull($scope.rfqObj.SupplierEmail)) {
                        $scope.recipient = { Email: $scope.rfqObj.SupplierEmail };
                        $scope.act_addRecipientTo();
                    }
                    if (!isEmptyOrNull($scope.rfqObj.ContactEmail)) {
                        $scope.recipient = { Email: $scope.rfqObj.ContactEmail };
                        $scope.act_addRecipientTo();
                    }
                    $scope.recipient = null;

                    $scope.openEmailModal();
                },
                function error(response) {
                    if (response.data.ExceptionMessage == 'Couldn\'t Save Document!')
                        alert("RFQ Issued but couldn't save document!")
                    else
                        alert("Failed : " + response.data.ExceptionMessage);
                });
        }
    };

    ///Record Answer
    $scope.act_openRecordAnswerModal = function () {
        $('#recordAnswerModal').modal('show');
    };

    $scope.act_recordAnswer = function () {
        var index = -1;
        for (var i = 0; i < $scope.lstIncomingDocuments.length; i++) {
            if ($scope.lstIncomingDocuments[i].isSelected)
                index = i;
        }
        if (index == -1) {
            alert("You must choose an Incoming Doc!");
        }
        else {
            var postUrl = '/api/Procurement/RecordAnswerForQuotation';
            postUrl = postUrl + '?QuotationID=' + $scope.rfqObj.QuotationID;
            postUrl = postUrl + '&QuotationIncomingDocumentID=' + $scope.lstIncomingDocuments[index].QuotationIncomingDocumentID;

            $http.post(postUrl, null).then(
                         function success(response) {
                             $scope.rfqObj.QuotationResponseDate = today();
                             $('#recordAnswerModal').modal('hide');
                             alert("Answer Recorded! Please fill item prices");
                         },
                         function error(response) {
                             showRequestErrorMessage(response);
                         });
        }
    };




    ////////////
    //RFQ Items
    ////////////
    $scope.GetItemNum = function () {
        var num = 0;
        for (var i = 0; i < $scope.lstItems.length; i++) {
            if ($scope.lstItems[i].seqNum > num)
                num = $scope.lstItems[i].seqNum;
        }
        num = num + 1;
        return num;
    };

    $scope.currentItem;

    $scope.clearItem = function () {
        $scope.currentItem = {
            QuotationItemID: '',
            seqNum: $scope.GetItemNum(),
            QuotationItemQuantity: '',
            QuotationItemItemUnitPrice: 0,
            QuotationItemItemUnitCoefficient: 0,
            QTYPUM: 0,
        };

        //reset select2
        $('#prodCode').select2("val", "");
        $('#lot').select2("val", "");
        $('#CUM').select2("val", "");
        $('#itemCurrency').select2("val", "");
    };

    $scope.clearItem();

    $scope.act_addItem = function () {
        if ($scope.currentItem.QuotationItemID == '') {
            //NEW ITEM
            $scope.currentItem.QuotationID = $scope.rfqObj.QuotationID;
            $scope.currentItem.QuotationItemID = generateGuid();
            $scope.lstItems.push($scope.currentItem);
        } else {
            //UPDATE ITEM
        }

        $scope.clearItem();

        $scope.calculateTotals();
        $('#addItemModal').modal('hide');
    };


    $scope.act_editItem = function (QuotationItemID) {
        var found = false;
        for (var i = 0; i < $scope.lstItems.length; i++) {
            if ($scope.lstItems[i].QuotationItemID == QuotationItemID) {
                $scope.currentItem = $scope.lstItems[i];

                $('#lot').select2('data', {
                    id: $scope.currentItem.LotID,
                    text: '',
                    code: $scope.currentItem.LotCode
                });

                if (!isEmptyOrNull($scope.currentItem.CurrencyID))
                    $('#itemCurrency').select2('data', {
                        id: $scope.currentItem.CurrencyID,
                        text: '',
                        code: $scope.currentItem.CurrencyCode
                    });


                $('#prodCode').select2('data', {
                    id: $scope.currentItem.ProductID,
                    text: $scope.currentItem.QuotationItemDescription,
                    code: $scope.currentItem.ProductCode,
                    MasterForamtCode: $scope.currentItem.MasterFormatCode,
                    PUM_UnitCode: $scope.currentItem.PUM_UnitCode,
                    PUM_UnitID: $scope.currentItem.PUM_UnitID,
                    CUM_UnitID: $scope.currentItem.UnitID,
                    CUM_UnitCode: $scope.currentItem.UnitCode,
                });

                $('#cum').select2('data', {
                    id: $scope.currentItem.UnitID,
                    text: '',
                    code: $scope.currentItem.UnitCode,
                });


                found = true;
                break;
            }
        }
        if (!found) {
            alert("Couldn't Load Item!");
        }
    };

    $scope.act_deleteItem = function (QuotationItemID) {
        if (confirm("Are you sure you want to delete this item?")) {
            for (var i = 0; i < $scope.lstItems.length; i++) {
                if ($scope.lstItems[i].QuotationItemID == QuotationItemID) {
                    $scope.lstItems.splice(i, 1);
                    $scope.lstDeletedItems.push(QuotationItemID);
                    break;
                }
            }
            $scope.calculateTotals();
        }

    };










    //Import From Excel
    $(function () {
        $('#itemsImportFileChooserAlias').click(function () {
            $('#itemsImportFileChooser').click();
        });
    });
    $('#itemsImportFileChooser').on('change', function (e) {
        var files = e.target.files;
        if (files.length > 0) {
            if (window.FormData !== undefined) {
                var data = new FormData();
                data.append('uploadedFile', files[0]);
                console.log(data);
                document.getElementById('itemsImportFileChooser').value = null;

                $.ajax({
                    type: "POST",
                    url: '/Procurement/ParseInputExcelFileOfPRItems',
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (response) {
                        console.log(response);

                        var ItemsList = response;

                        $scope.$apply(function () {
                            for (var itemIndex = 0; itemIndex < response.length; itemIndex++) {

                                response[itemIndex].QuotationID = $scope.rfqObj.QuotationID;
                                response[itemIndex].QuotationItemID = generateGuid();
                                response[itemIndex].QuotationItemCode = '';
                                console.log("Current Item (" + itemIndex + ") : " + response[itemIndex]);
                            }
                            $scope.lstItems = $scope.lstItems.concat(response);
                        });
                    },
                    error: function (xhr, status, p3, p4) {
                        ItemsList = new Array();
                        var err = "Error " + " " + status + " " + p3 + " " + p4;
                        if (xhr.responseText && xhr.responseText[0] == "{")
                            err = JSON.parse(xhr.responseText).Message;
                        console.log(err);
                    }
                });

            } else {
                alert("This browser doesn't support HTML5 file uploads!");
            }
        }
    });

    //Import From PR
    $scope.lstImportedPRs;
    $scope.lstImportedPRItems;
    $scope.lstImportedPRConditions;


    //Pagination
    $scope.currentPage = 1;
    $scope.pageSize = '10';
    $scope.searchCriteria = '';

    //Fetch All PR Infos by criteria
    $scope.search = function () {
        var url = '/api/Procurement/FindPRInfoExcept';
        url += '?criteria=' + $scope.searchCriteria;
        url += '&PurchaseRequestID=' + generateGuid(); //This is a cheat to get all PRs with no exception

        $http.get(url).then(
            function success(response) {
                $scope.lstImportedPRs = response.data;
            },
            function error(response) {
                alert("Failed to get Purchase Request Info!");

                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);
            });
    };
    $scope.search();

    $scope.numberOfPages = function () {
        if ($scope.lstImportedPRs == null)
            return 1;

        var count = Math.ceil($scope.lstImportedPRs.length / $scope.pageSize);
        if (count == 0)
            count++;

        if ($scope.currentPage > count)
            $scope.currentPage = count;

        return count;
    };



    $scope.act_openImportModal = function () {
        $scope.lstImportedPRs = null;
        $scope.lstImportedPRItems = new Array();
        $scope.lstImportedPRConditions = new Array();

        $scope.act_getPRListForImport();

        //Reset Pagination data
        $scope.currentPage = 1;
        $scope.pageSize = '10';
        $scope.searchCriteria = '';
        $scope.search();
    }

    $scope.act_getPRListForImport = function () {
        //alert("A");
        var url = '/api/Procurement/GetAllPRInfosExcept';
        //alert($scope.prObj.PurchaseRequestID);
        url = url + '?PurchaseRequestID=' + generateGuid();//The Generate guid is a cheat to get all PRs without exception
        console.log(url);
        $http.get(url).then(
                    function success(response) {
                        $scope.lstImportedPRs = response.data;
                    },
                    function error(response) {
                        showRequestErrorMessage(response);
                    });
    };

    $scope.act_clickRow = function (index, list) {
        $scope.act_clickRow(index, list, false);
    }
    $scope.act_clickRow = function (index, list, isSingleSelection) {
        //NOTE : THE INDEX IN TABLE IS ADDED +1 FOR UX
        //alert($scope.lstImportedPRs[index].isSelected);
        var selectedList;
        if (list == 'items')
            selectedList = $scope.lstImportedPRItems;
        else if (list == 'PRs')
            selectedList = $scope.lstImportedPRs;
        else if (list == 'conditions')
            selectedList = $scope.lstImportedPRConditions;
        else if (list == 'lstIncomingDocuments')
            selectedList = $scope.lstIncomingDocuments;
        else
            return;

        if (isSingleSelection) {
            if (list[index].isSelected)
                list[index].isSelected = false;
            else
                for (var i = 0; i < list.length; i++) {
                    list[i].isSelected = (index == i);
                }
        }
        else if (selectedList[index].isSelected == 'undefined')
            selectedList[index].isSelected = true;
        else
            selectedList[index].isSelected = !selectedList[index].isSelected;
    };


    $scope.act_openItemsImportModal = function () {
        for (var prIndex = 0; prIndex < $scope.lstImportedPRs.length; prIndex++) {
            var currentPR = $scope.lstImportedPRs[prIndex];
            if (currentPR.isSelected) {
                console.log("I = " + prIndex + ", PR = " + $scope.lstImportedPRs[prIndex].PurchaseRequest.PurchaseRequestID);

                for (var itemIndex = 0; itemIndex < currentPR.ItemsList.length; itemIndex++) {
                    var currentItem = currentPR.ItemsList[itemIndex];
                    currentItem.QuotationID = $scope.rfqObj.QuotationID;
                    currentItem.QuotationItemID = generateGuid();
                    console.log("Current Item : " + currentItem);
                    $scope.lstImportedPRItems.push(currentItem);
                }
                console.log($scope.lstImportedPRItems);
            }
        }

        $('#importItemsModal').modal("toggle");
    };


    //Add the imported items to the pr items list
    $scope.act_importSelectedItems = function () {
        for (var itemIndex = 0; itemIndex < $scope.lstImportedPRItems.length; itemIndex++) {
            var currentPRItem = $scope.lstImportedPRItems[itemIndex];
            if (currentPRItem.isSelected) {
                console.log("I = " + itemIndex + ", PR Item = " + currentPRItem);

                currentPRItem.QuotationID = $scope.rfqObj.QuotationID;
                currentPRItem.QuotationItemID = generateGuid();

                currentPRItem.QuotationItemCode = currentPRItem.PurchaseRequestItemCode;
                currentPRItem.QuotationItemComments = currentPRItem.PurchaseRequestItemComments;
                currentPRItem.QuotationItemDescription = currentPRItem.PurchaseRequestItemDescription;
                currentPRItem.QuotationItemDetails = currentPRItem.PurchaseRequestItemDetails;
                currentPRItem.QuotationItemUnitPrice = currentPRItem.PurchaseRequestItemUnitPrice;
                currentPRItem.isModified = false;
                console.log("Current Item : " + currentPRItem);
                $scope.lstItems.push(currentPRItem);
            }
        }

        $scope.calculateTotals();
    };




    //////////////////
    ////RFQ Condition
    /////////////////
    $scope.currentCondition;

    $scope.clearCondition = function () {
        $scope.currentCondition = {
            QuotationConditionID: null,
            ProcurementConditionTypeID: null,
            ProcurementConditionTypeDescription: '',
            PurchaseRequestConditionDescription: '',
            PurchaseRequestConditionCreatedDate: today(),
        };
    };
    $scope.clearCondition();


    //Add Condition
    $scope.act_addCondition = function () {
        $scope.clearCondition();
        $scope.lstConditions.push($scope.currentCondition);
    };



    /////////////////
    //RFQ  Documents
    /////////////////




    //////////////
    //File Upload
    //////////////
    $scope.currentDoc;

    $scope.clearDoc = function () {
        $scope.currentDoc = {
            QuotationDocumentID: '',
            QuotationDocumentCreatedDate: today(),
            ThirdParty: $scope.rfqObj.Contact == '' ? $scope.rfqObj.Supplier : $scope.rfqObj.Contact,
            MediaID: '00000000-0000-0000-0000-000000000000',
        };
    };

    $scope.act_addDoc = function () {
        if ($scope.currentDoc.QuotationDocumentID == '') {
            //NEW ITEM
            $scope.currentDoc.QuotationID = $scope.rfqObj.QuotationID;
            if ($scope.currentDoc.id != null)
                $scope.currentDoc.QuotationDocumentID = $scope.currentDoc.id;
            else
                $scope.currentDoc.QuotationDocumentID = generateGuid();

            for (var i = 0; i < $scope.lstDocumentTypes.length; i++) {
                if ($scope.lstDocumentTypes[i].DocumentTypeID == $scope.currentDoc.DocumentTypeID) {
                    $scope.currentDoc.DocumentTypeDescription = $scope.lstDocumentTypes[i].DocumentTypeDescription;
                    break;
                }
            }

            $scope.lstDocuments.push($scope.currentDoc);

        } else {
            //UPDATE ITEM
            for (var i = 0; i < $scope.lstDocumentTypes.length; i++) {
                if ($scope.lstDocumentTypes[i].DocumentTypeID == $scope.currentDoc.DocumentTypeID) {
                    $scope.currentDoc.DocumentTypeDescription = $scope.lstDocumentTypes[i].DocumentTypeDescription;
                    break;
                }
            }
        }

        $scope.clearDoc();

        $('#addDocModal').modal('hide');
    };

    $scope.act_editDoc = function (QuotationDocumentID) {
        var found = false;
        for (var i = 0; i < $scope.lstDocuments.length; i++) {
            if ($scope.lstDocuments[i].QuotationDocumentID == QuotationDocumentID) {
                $scope.currentDoc = $scope.lstDocuments[i];

                found = true;
                break;
            }
        }
        if (!found) {
            alert("Couldn't Load Item!");
        }
    };

    $scope.act_deleteDoc = function (QuotationDocumentID) {
        if (confirm("Are you sure you want to delete this Document?")) {
            for (var i = 0; i < $scope.lstDocuments.length; i++) {
                if ($scope.lstDocuments[i].QuotationDocumentID == QuotationDocumentID) {
                    $scope.lstDocuments.splice(i, 1);
                    $scope.lstDeletedDocuments.push(QuotationDocumentID);
                    break;
                }
            }
        }
    };




    //Doc file uploader
    $(function () {
        $('#docFileUploadAlias').click(function () {
            $('#docFileUpload').click();
        });
    });
    $('#docFileUpload').on('change', function (e) {
        var files = e.target.files;
        if (files.length > 0) {
            if (window.FormData !== undefined) {
                var data = new FormData();
                data.append('uploadedFile', files[0]);
                console.log(data);
                document.getElementById('docFileUpload').value = null;
                $scope.$apply(function () {
                    if ($scope.currentDoc.QuotationDocumentID == '') {
                        $scope.currentDoc.id = generateGuid();
                    }
                    else {
                        $scope.currentDoc.id = $scope.currentDoc.QuotationDocumentID;
                    }
                });

                $.ajax({
                    type: "POST",
                    url: '/Content/UpdateFile?ReferrerId=' + $scope.currentDoc.id + '&MediaType=Archived',
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (response) {
                        console.log(response);
                        $scope.$apply(function () { $scope.currentDoc.MediaID = response.MediaId });
                        //$timeout(function () { $scope.currentDoc.MediaID = response.MediaId }, 0);
                    },
                    error: function (xhr, status, p3, p4) {
                        ItemsList = new Array();
                        var err = "Error " + " " + status + " " + p3 + " " + p4;
                        if (xhr.responseText && xhr.responseText[0] == "{")
                            err = JSON.parse(xhr.responseText).Message;
                        console.log(err);
                    }
                });

            } else {
                alert("This browser doesn't support HTML5 file uploads!");
            }
        }
    });






    ////////////////////
    //RFQ Incoming Docs
    ////////////////////
    $scope.currentInDoc;

    $scope.clearInDoc = function () {
        $scope.currentInDoc = {
            QuotationIncomingDocumentID: '',
            Supplier: $scope.rfqObj.Supplier,
            Contact: $scope.rfqObj.Contact,
        };
    };


    $scope.act_addInDoc = function () {
        if ($scope.currentInDoc.QuotationIncomingDocumentID == '') {
            //NEW ITEM
            $scope.currentInDoc.QuotationID = $scope.rfqObj.QuotationID;


            if ($scope.currentInDoc.id != null)
                $scope.currentInDoc.QuotationIncomingDocumentID = $scope.currentInDoc.id;
            else
                $scope.currentInDoc.QuotationIncomingDocumentID = generateGuid();

            $scope.lstIncomingDocuments.push($scope.currentInDoc);
        } else {
            //UPDATE ITEM
        }

        $scope.clearInDoc();

        $('#addIncomingDocModal').modal('hide');
    };


    $scope.act_editInDoc = function (QuotationIncomingDocumentID) {
        var found = false;
        for (var i = 0; i < $scope.lstIncomingDocuments.length; i++) {
            if ($scope.lstIncomingDocuments[i].QuotationIncomingDocumentID == QuotationIncomingDocumentID) {
                $scope.currentInDoc = $scope.lstIncomingDocuments[i];

                found = true;
                break;
            }
        }
        if (!found) {
            alert("Couldn't Load Item!");
        }
    };

    $scope.act_deleteInDoc = function (QuotationIncomingDocumentID) {
        if (confirm("Are you sure you want to delete this item?")) {
            for (var i = 0; i < $scope.lstItems.length; i++) {
                if ($scope.lstIncomingDocuments[i].QuotationIncomingDocumentID == QuotationIncomingDocumentID) {
                    $scope.lstIncomingDocuments.splice(i, 1);
                    $scope.lstDeletedItems.push(QuotationIncomingDocumentID);
                    break;
                }
            }
        }
    };



    //inDoc file uploader
    $(function () {
        $('#inDocFileUploadAlias').click(function () {
            $('#inDocFileUpload').click();
        });
    });
    $('#inDocFileUpload').on('change', function (e) {
        var files = e.target.files;
        if (files.length > 0) {
            if (window.FormData !== undefined) {
                var data = new FormData();
                data.append('uploadedFile', files[0]);
                console.log(data);
                document.getElementById('inDocFileUpload').value = null;
                $scope.$apply(function () {
                    if (isEmptyOrNull($scope.currentInDoc.QuotationIncomingDocumentID)) {
                        $scope.currentInDoc.id = generateGuid();
                    }
                    else {
                        $scope.currentInDoc.id = $scope.currentInDoc.QuotationIncomingDocumentID;
                    }
                });

                $.ajax({
                    type: "POST",
                    url: '/Content/UpdateFile?ReferrerId=' + $scope.currentInDoc.id + '&MediaType=Archived',
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (response) {
                        console.log(response);
                        $scope.$apply(function () { $scope.currentInDoc.MediaID = response.MediaId });
                        //$timeout(function () { $scope.currentDoc.MediaID = response.MediaId }, 0);
                    },
                    error: function (xhr, status, p3, p4) {
                        ItemsList = new Array();
                        var err = "Error " + " " + status + " " + p3 + " " + p4;
                        if (xhr.responseText && xhr.responseText[0] == "{")
                            err = JSON.parse(xhr.responseText).Message;
                        console.log(err);
                    }
                });

            } else {
                alert("This browser doesn't support HTML5 file uploads!");
            }
        }
    });
    $scope.openInDocAttachments = function (index) {
        $scope.currentInDoc = $scope.lstIncomingDocuments[index];
    };
    $scope.act_addInDocAttachment = function () {
        if ($scope.currentInDoc.AttachmentList == null)
            $scope.currentInDoc.AttachmentList = [];

        $scope.currentInDoc.AttachmentList.push({})
    };

    $scope.act_deleteInDocAttach = function (index) {
        $scope.act_DeleteMedia($scope.currentInDoc.AttachmentList[index]);
        $scope.currentInDoc.AttachmentList.splice(index, 1);
    };

    $scope.attachInd;
    $scope.setIndex = function (ind)
    { alert("sss"); $scope.attachInd = ind; $('#inDocAttachmentFileUpload').click(); };

    $(function () {
        $('#inDocAttachmentFileUploadAlias').click(function () {
            $('#inDocAttachmentFileUpload').click();
        });
    });

    $('#inDocAttachmentFileUpload').on('change', function (e) {
        var files = e.target.files;
        if (files.length > 0) {
            if (window.FormData !== undefined) {
                var data = new FormData();
                data.append('uploadedFile', files[0]);
                console.log(data);
                document.getElementById('inDocAttachmentFileUpload').value = null;
                $scope.$apply(function () {
                    if (isEmptyOrNull($scope.currentInDoc.QuotationIncomingDocumentID)) {
                        $scope.currentInDoc.id = generateGuid();
                    }
                    else {
                        $scope.currentInDoc.id = $scope.currentInDoc.QuotationIncomingDocumentID;
                    }
                });

                $.ajax({
                    type: "POST",
                    url: '/Content/UpdateFile?ReferrerId=' + $scope.currentInDoc.id + '&MediaType=Attachment',
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (response) {
                        console.log(response);
                        $scope.$apply(function () { $scope.currentInDoc.AttachmentList[$scope.attachInd].MediaID = response.MediaId });
                        //$timeout(function () { $scope.currentDoc.MediaID = response.MediaId }, 0);
                    },
                    error: function (xhr, status, p3, p4) {
                        var err = "Error " + " " + status + " " + p3 + " " + p4;
                        if (xhr.responseText && xhr.responseText[0] == "{")
                            err = JSON.parse(xhr.responseText).Message;
                        console.log(err);
                    }
                });

            } else {
                alert("This browser doesn't support HTML5 file uploads!");
            }
        }
    });



    //Email:
    $scope.email = {};
    $scope.recipient = null;

    $scope.clearEmail = function () {
        $scope.email = {
            To: '',
            CC: '',
            BCC: '',
            Subject: '',
            Body: '',
            ID: generateGuid(),
            Attachment_MediaID: null
        };
        $scope.email.Body += "Dear Sir.,\n\n";
        $scope.email.Body += "Please Find our Request for Quotation No. " + $scope.rfqObj.QuotationCode + "\n\n";
        $scope.email.Body += "You are kindly requested to submit your technico-commercial offer within " + $scope.rfqObj.QuotationResponseDaysLimit + " day" + ($scope.rfqObj.QuotationResponseDaysLimit != 1 ? "s." : ".");
        $scope.email.Body += "For any clarification or extension of time, please get in touch with us the soonest.\n\n";
        if ($scope.rfqObj.QuotationIntroductionText != null)
            $scope.email.Body += $scope.rfqObj.QuotationIntroductionText + "\n\n";
        $scope.email.Body += "Best Regards";


        $scope.recipient = null;
    }


    $scope.act_addRecipientTo = function () {
        if ($scope.recipient != null && $scope.recipient.Email != '') {
            if ($scope.email.To != '')
                $scope.email.To += ';';

            $scope.email.To += $scope.recipient.Email;
        }
        $scope.recipient = null;
        $("#mailRecipient").select2("val", "");
    };
    $scope.act_addRecipientCC = function () {
        if ($scope.recipient != null && $scope.recipient.Email != '') {
            if ($scope.email.CC != '')
                $scope.email.CC += ';';

            $scope.email.CC += $scope.recipient.Email;
        }
        $scope.recipient = null;
        $("#mailRecipient").select2("val", "");
    };
    $scope.act_addRecipientBCC = function () {
        if ($scope.recipient != null && $scope.recipient.Email != '') {
            if ($scope.email.BCC != '')
                $scope.email.BCC += ';';

            $scope.email.BCC += $scope.recipient.Email;
        }
        $scope.recipient = null;
        $("#mailRecipient").select2("val", "");
    };


    $scope.openEmailModal = function () {
        $('#sendEmailModal').modal('show');
    };

    $scope.act_sendEmail = function () {

        if (isEmptyOrNull($scope.email.To)
            && isEmptyOrNull($scope.email.CC)
            && isEmptyOrNull($scope.email.BCC))
            alert("Cant cend email with no recipients!");
        else if (isEmptyOrNull($scope.email.Subject))
            alert("Cant cend email without a subject!");
        else if (isEmptyOrNull($scope.email.Body))
            alert("Cant cend email without a body!");
        else {
            $('#sendEmailModal').modal('hide');

            $http.post('/api/Procurement/SendEmail', $scope.email).then(
                function success() {
                    alert("Success");
                },
              function error(response) {
                  showRequestErrorMessage(response);
                  console.log("POST fail to ");
                  console.log("Response Data : " + response.data);
                  console.log("Response : " + response.statusText);
                  console.log("Response Staus: " + response.statusText);
              });
        }
    }
    //$scope.act_sendEmail();





    //regret letter
    $scope.lstReasons = [];
    $http.get('/api/Procurement/GetAllRegretReasonTypes').then(
        function success() {
            $scope.lstReasons = response.data;
            console.log($scope.lstReasons);
        },
      function error(response) {
          showRequestErrorMessage(response);
          console.log("Response Data : " + response.data);
          console.log("Response : " + response.statusText);
          console.log("Response Staus: " + response.statusText);
      });

    $scope.regretReasons = '';

    $scope.openRegretModal = function () {
        for (var i = 0; i < $scope.lstReasons.length; i++) {
            $scope.lstReasons[i].isSelected = 'false';
            $scope.regretReasons = '';
        }
        $('#regretLetterModal').modal('show');
    };



    $scope.act_generateRegretLetter = function () {
        for (var i = 0; i < $scope.lstReasons.length; i++) {
            if ($scope.lstReasons[i].isSelected)
                $scope.regretReasons = $scope.lstReasons[i].Description +
                    '%0A' + $scope.regretReasons;
        }
        //$http.get('/api/Procurement/GenerateRegretLe', $scope.email).then(
        //    function success() {
        //        alert("Success");
        //    },
        //  function error(response) {
        //      showRequestErrorMessage(response);
        //      console.log("POST fail to ");
        //      console.log("Response Data : " + response.data);
        //      console.log("Response : " + response.statusText);
        //      console.log("Response Staus: " + response.statusText);
        //  });
        window.open('/Procurement/QuotationRegretLetter?QuotationID=' + $scope.rfqObj.QuotationID + '&reasons=' + $scope.regretReasons, '_blank');
    };







    ///////////
    //look ups
    ///////////

    //Quotation
    $("#followedBy").select2({
        placeholder: "Select a Person",
        initSelection: true,
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/ExternalEmployees/FindMembersByCriteria",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].MemberId,
                        text: data[i].FullName
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Member) {
            return Member.text;
        },
        formatSelection: function (Member) {
            $timeout(function () {
                $scope.rfqObj.FollowedBy_PersonID = Member.id;
                $scope.rfqObj.FollowedBy = Member.text;
            }, 0);
            return Member.text;
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

    $("#supplier").select2({
        placeholder: "Select a Comany",
        initSelection: true,
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindCompany",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].SupplierID,
                        text: data[i].SupplierName,
                        email: data[i].SupplierEmail,
                        contactID: null
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Supplier) {
            return Supplier.text;
        },
        formatSelection: function (Supplier) {
            $timeout(function () {
                $scope.rfqObj.SupplierID = Supplier.id;
                $scope.rfqObj.Supplier = Supplier.text;
                $scope.rfqObj.SupplierEmail = Supplier.email;
                $scope.rfqObj.Contact_SupplierID = Supplier.contactID;
                $("#contact").select2("val", "");
            }, 0);

            return Supplier.text;
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

    $("#contact").select2({
        placeholder: "Select a Contact",
        initSelection: true,
        minimumInputLength: 0,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindContact",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page,
                    Company_SupplierID: $scope.rfqObj.SupplierID
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].SupplierID,
                        text: data[i].SupplierName,
                        email: data[i].SupplierEmail,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Supplier) {
            return Supplier.text;
        },
        formatSelection: function (Supplier) {
            $timeout(function () {
                $scope.rfqObj.Contact_SupplierID = Supplier.id;
                $scope.rfqObj.Contact = Supplier.text;
                $scope.rfqObj.ContactEmail = Supplier.email;
            }, 0);
            return Supplier.text;
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


    //Items
    $("#lot").select2({
        placeholder: "Select a Lot",
        minimumInputLength: 2,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindLotInPoste",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    id_poste: $scope.rfqObj.JobID,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].id_LotPoste,
                        text: data[i].libelleLotPoste + ' - ' + data[i].codeLotPoste,
                        code: data[i].codeLotPoste,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Lot) {
            return Lot.text;
        },
        formatSelection: function (Lot) {
            $timeout(function () {
                $scope.currentItem.LotID = Lot.id;
                $scope.currentItem.LotCode = Lot.code;
            }, 0);
            return Lot.code;
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

    $("#prodCode").select2({
        placeholder: "Select a Product",
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindProduct",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].ProductID,
                        text: data[i].ProductDescription,
                        code: data[i].ProductCode,
                        MasterForamtCode: data[i].MasterFormatCode,
                        PUM_UnitID: data[i].PUM_UnitID,
                        PUM_UnitCode: data[i].PUM_UnitCode,
                        CUM_UnitID: data[i].CUM_UnitID,
                        CUM_UnitCode: data[i].CUM_UnitCode,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Product) {
            return Product.text + ' - ' + Product.code;
        },
        formatSelection: function (Product) {

            //if (!$scope.$$phase) {    //rootScope.$apply();
            $timeout(function () {
                $scope.currentItem.ProductID = Product.id;
                $scope.currentItem.QuotationItemDescription = Product.text;
                $scope.currentItem.ProductCode = Product.code;
                $scope.currentItem.MasterFormatCode = Product.MasterForamtCode;
                $scope.currentItem.PUM_UnitID = Product.PUM_UnitID;
                $scope.currentItem.PUM_UnitCode = Product.PUM_UnitCode;
                $scope.currentItem.UnitID = Product.CUM_UnitID;
                $scope.currentItem.UnitCode = Product.CUM_UnitCode;

                $('#cum').select2('data', {
                    id: $scope.currentItem.UnitID,
                    text: '',
                    code: $scope.currentItem.UnitCode,
                });
            }, 0);
            //}

            return Product.code;
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

    $("#cum").select2({
        placeholder: "Select a Unit",
        minimumInputLength: 2,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindUnit",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].UnitID,
                        text: data[i].UnitCode + ' - ' + data[i].UnitDescription,
                        code: data[i].UnitCode
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Unit) {
            return Unit.text;
        },
        formatSelection: function (Unit) {
            //if (!$scope.$$phase) {
            $timeout(function () {
                $scope.currentItem.UnitID = Unit.id;
                $scope.currentItem.UnitCode = Unit.code;
            }, 0);
            //}
            return Unit.code;
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

    $("#itemCurrency").select2({
        placeholder: "Select a Currency",
        minimumInputLength: 2,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindCurrency",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page,
                    fromBois: true
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].CurrencyID,
                        text: data[i].CurrencyDescription + ' - ' + data[i].CurrencyCode,
                        code: data[i].CurrencyCode,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Currency) {
            return Currency.text;
        },
        formatSelection: function (Currency) {
            $timeout(function () {
                $scope.currentItem.CurrencyID = Currency.id;
                $scope.currentItem.CurrencyCode = Currency.code;
            }, 0);
            return Currency.code;
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


    //email
    $("#mailRecipient").select2({
        placeholder: "Select a Recipient",
        initSelection: true,
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/Common/FindSupplierWithEmail",
            dataType: 'json',
            error: function () {
                alert("Temporary error. Please try again...");
            },
            data: function (term, page) {
                return {
                    criteria: term,
                    pageSize: 10,
                    pageNumber: page
                };
            },
            results: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].SupplierID,
                        text: data[i].SupplierName,
                        email: data[i].SupplierEmail,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Recipient) {
            return Recipient.text;
        },
        formatSelection: function (Recipient) {
            $timeout(function () {
                $scope.recipient = {};
                $scope.recipient.Name = Recipient.text;
                $scope.recipient.Email = Recipient.email;
            }, 0);

            return Recipient.text;
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


});







//#START OF RFQ Items Compare
var rfqItemCompareApp = angular.module('rfqItemCompareApp', []);
rfqItemCompareApp.controller('rfqItemCompareController', function ($scope, $http) {

    //miscellaneous 
    $scope.formatDate = function (date) {
        return formatDate(date);
    };
    $scope.addCommas = function (numStr) {
        return addCommas(numStr);
    };

    $scope.lstItems = [];

    $scope.PurchaseRequestID = $.QueryString["PurchaseRequestID"];
    //Initialize List
    if (typeof $scope.PurchaseRequestID != 'undefined') {
        var rfqItemsUrl = '/api/Procurement/GetQuotationItemsForCompare?PurchaseRequestID=';
        $http.get(rfqItemsUrl + $scope.PurchaseRequestID).then(
    		function success(response) {
    		    console.log("Success Read");
    		    $scope.lstItems = response.data;
    		},
            function error(response) {
                showRequestErrorMessage(response);

                console.log("POST fail to " + url);
                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);
            });
    } else {
        alert("No Purchase Request ID!");
        window.location.href = '/Procurement/RFQListing';
    }



    $scope.act_save = function () {
        $http.post('/api/Procurement/SaveQuotationItemList', $scope.lstItems).then(
            function success(response) {
                alert("Changes saved!");
                window.location.href = '/Procurement/RFQListing';
            },

            function error(response) {
                showRequestErrorMessage(response);

                console.log("POST fail to " + url);
                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);
            });
    };

    $scope.act_generateComparisionGrid = function () {
        window.open('/Procurement/QuotationComparisonGrid?PurchaseRequestID=' + $scope.PurchaseRequestID, '_blank');
    };
});







//#START OF RFQ Offer Evaluation
var rfqOfferEvaluationApp = angular.module('rfqOfferEvaluationApp', []);
rfqOfferEvaluationApp.controller('rfqOfferEvaluationController', function ($scope, $http) {

    //miscellaneous 
    $scope.formatDate = function (date) {
        return formatDate(date);
    };

    $scope.loggedInUser;
    $http.get('/api/Common/GetLoggedInUser').then(
			function success(response) {
			    $scope.loggedInUser = response.data;
			},
                function error(response) {
                    $scope.loggedInUser = { FullName: '', MemberId: null };
                    console.log("Failed to get logged in user");
                    console.log("Response : " + response);
                    console.log("Response Data : " + response.data);
                    console.log("Response Staus: " + response.statusText);
                });


    $scope.lstEvaluationTypes = [];
    $http.get('/api/Procurement/GetQuotationEvaluationTypes').then(
          function success(response) {
              console.log("Success Read");
              $scope.lstEvaluationTypes = response.data;
          },
          function error(response) {
              showRequestErrorMessage(response);
              console.log("Response Data : " + response.data);
              console.log("Response : " + response.statusText);
              console.log("Response Staus: " + response.statusText);
          });



    $scope.lstRfqEvaluations = [];
    $scope.lstDeletedRfqEvaluations = new Array();
    $scope.lstRFQs = [];

    $scope.PurchaseRequestID = $.QueryString["PurchaseRequestID"];
    //Initialize List
    if (typeof $scope.PurchaseRequestID != 'undefined') {

        var rfqEvaluationsUrl = '/api/Procurement/GetAllQuotationEvaluationsInPR?PurchaseRequestID=';
        $http.get(rfqEvaluationsUrl + $scope.PurchaseRequestID).then(
    		function success(response) {
    		    console.log("Success Read");
    		    $scope.lstRfqEvaluations = response.data;
    		    for (var i = 0; i < $scope.lstRfqEvaluations.length; i++)
    		        $scope.lstRfqEvaluations[i].QuotationEvaluationDate = formatDate($scope.lstRfqEvaluations[i].QuotationEvaluationDate);
    		},
            function error(response) {
                showRequestErrorMessage(response);
                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);
            });


        $http.get('/api/Procurement/GetAllQuotationsInPR?PurchaseRequestID=' + $scope.PurchaseRequestID).then(
    		function success(response) {
    		    console.log("Success Read");
    		    $scope.lstRFQs = response.data;
    		},
            function error(response) {
                showRequestErrorMessage(response);
                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);
            });
    } else {
        alert("No Purchase Request ID!");
        window.location.href = '/Procurement/RFQListing';
    }


    $scope.act_save = function () {
        //$http.post('/api/Procurement/SaveQuotationEvaluationList', $scope.lstRfqEvaluations).then(
        $scope.rfqEvalInfo = {
            'lstRfqEvaluations': $scope.lstRfqEvaluations,
            'lstDeletedRfqEvaluations': $scope.lstDeletedRfqEvaluations
        };
        $http.post('/api/Procurement/SaveQuotationEvaluationInfo', $scope.rfqEvalInfo).then(
        function success(response) {
            alert("Changes saved!");
            //window.location.href = '/Procurement/RFQListing';
        },
            function error(response) {
                showRequestErrorMessage(response);
                console.log("POST fail to ");
                console.log("Response Data : " + response.data);
                console.log("Response : " + response.statusText);
                console.log("Response Staus: " + response.statusText);
            });
    };


    //Add an evaluation
    $scope.act_addEvaluation = function () {
        $scope.lstRfqEvaluations.push({
            QuotationEvaluationID: generateGuid(),
            QuotationEvaluationDate: today(),
            EvaluatedBy_PersonID: $scope.loggedInUser.MemberID,
            EvaluatedBy: $scope.loggedInUser.FullName,
        });
    }

    //Delete an evaluation
    $scope.act_deleteEvaluation = function (index) {
        $scope.lstDeletedRfqEvaluations.push($scope.lstRfqEvaluations[index].QuotationEvaluationID);
        $scope.lstRfqEvaluations.splice(index, 1);
    };
});





var quotationRegretReasonTypeConfigApp = angular.module('quotationRegretReasonTypeConfigApp', []);
quotationRegretReasonTypeConfigApp.controller('quotationRegretReasonTypeConfigController', function ($scope, $http) {

    //Read all default reasons
    $http.get('/api/Procurement/GetAllRegretReasonTypes').then(
          function success(response) {
              $scope.lstRegretReasonTypes = response.data;
          },
          function error(response) {
              console.log(response.data);
              showRequestErrorMessage(response);
          });

    //Update row style based on status
    $scope.conditionStyle = function (index) {
        if ($scope.lstRegretReasonTypes[index].isDeleted) return { "background-color": "lightcoral" };
        else if ($scope.lstRegretReasonTypes[index].isUpdated) return { "background-color": "lightgreen" }
        else return "";
    }

    //Add a condition
    $scope.act_addReason = function () {
        $scope.lstRegretReasonTypes.push({ isUpdated: true });
    }

    //Update condition status
    $scope.act_updated = function (index) {
        $scope.lstRegretReasonTypes[index].isUpdated = true;
    }

    //Toggele delete stastus
    $scope.act_toggleDelete = function (index) {
        $scope.lstRegretReasonTypes[index].isDeleted = !$scope.lstRegretReasonTypes[index].isDeleted;
    }


    //Submit changes
    $scope.act_submitRegretReasonTypes = function () {

        var updatedReasonTypes = new Array();
        var deletedReasonTypes = new Array();

        for (var i = 0; i < $scope.lstRegretReasonTypes.length; i++) {
            var cond = $scope.lstRegretReasonTypes[i];
            if (cond.isDeleted)
                deletedReasonTypes.push(cond.ProcurementConditionTypeID);
            else if (cond.isUpdated)
                updatedReasonTypes.push(cond);
        }


        $http.post('/api/Procurement/SaveRegretReasonTypeList', updatedReasonTypes).then(
          function success(response) {
              console.log("Update Successful");
              $http.post('/api/Procurement/DeleteRegretReasonTypeList', deletedReasonTypes).then(
                  function success(response) {
                      console.log("Delete Successful");
                      alert("Regret Reasons updated Successfully!");
                      window.location.href = '/Procurement/RFQListing/';
                  },
                  function error(response) {
                      console.log("Delete Failed");

                      console.log(response.data);
                      showRequestErrorMessage(response);
                  });
          },
          function error(response) {
              console.log("Update Failed, Delete stopped");

              console.log(response.data);
              showRequestErrorMessage(response);
          });

        console.log(deletedReasonTypes);
    }
});









//Common Functions:
//Get formatted date
function formatDate(date) {
    if (date == null)
        return null;
    var fullDate = new Date(date);
    var dd = fullDate.getDate();
    var mm = fullDate.getMonth() + 1; //January is 0!
    var yyyy = fullDate.getFullYear();
    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm
    fullDate = mm + '/' + dd + '/' + yyyy;
    return fullDate;
}

//Get formatted date of Today
function today() {
    return formatDate(new Date());
}

//Change date to time in AM/PM
function formatAMPM(date) {
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    //hours = hours < 10 ? '0' +hours: hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

//generate a GUID
function generateGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
    }

    var id = $.ajax({
        type: "GET",
        url: "/api/GenerateGuid",
        async: false
    }).responseJSON;

    if (id == null || id === '') {
        console.log("Couldn't Generate Guid from Server. We will generate one localy (collisions possible)");
        id = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    return id;
};

//Add time Picker for time fields
function addTimePicker(sender) {
    var options = {
        minuteStep: 5,
        orientation: $('body').hasClass('right-to-left') ? {
            x: 'right',
            y: 'auto'
        } : {
            x: 'auto',
            y: 'auto'
        }
    }
    $(sender).timepicker(options);
};

//Adds commas to thousands in numbers
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

//website pause
function pause(milliseconds) {
    var dt = new Date();
    while ((new Date()) - dt <= milliseconds) { /* Do nothing */
    }
}

//Status Table lookup
getStatusIDByCode = function (lstStatuses, code) {
    for (var i = 0; i < lstStatuses.length; i++) {
        if (lstStatuses[i].StatusCode == code) {
            return lstStatuses[i].StatusID;
        }
    }

    return null;
}


//checks if guid is empty
isEmptyOrNull = function (guid) {
    return guid == '00000000-0000-0000-0000-000000000000' || guid == null || guid === undefined || guid == '' || guid.trim() == '';
}