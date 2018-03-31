//#START OF INDEX PAGE
var employeeSearchApp = angular.module('employeeSearchApp', []);
employeeSearchApp.controller('employeeSearchController', function ($scope, $http) {
    //Define variables
    $scope.employees;

    //page is in edit mode
    $scope.editable;

    $scope.currentPage = 1;
    $scope.pageSize = '10';

    showLoader();
    $scope.searchCriteria = '';

    //Fetch All External Employees by criteria
    $scope.search = function () {
        $http.get("/api/ExternalEmployees/FindExternalEmployees?criteria=" + $scope.searchCriteria).then(
			function success(response) {
			    $scope.employees = response.data;
			    //console.log($scope.searchCriteria);
			    hideLoader();
			},
			function error(response) {
			    alert("Failed to get External Employees!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
			    console.log("Failed to get External Employees!\nStatus: " + response.statusText + "\nData: " + response.data);
			    hideLoader();
			});
    };
    $scope.search();

    //Assign a job role (fonction) to external employee
    $scope.act_assignJob = function (MemberId) {
        window.location.href = "/ExternalEmployees/AssignJobRole?MemberId=" + MemberId;
    }

    //Edit external employee
    $scope.act_edit = function (MemberId) {
        window.location.href = "/ExternalEmployees/AddNewExternalEmployee?MemberId=" + MemberId;
    }

    $scope.numberOfPages = function () {
        if ($scope.employees == null)
            return 1;

        var count = Math.ceil($scope.employees.length / $scope.pageSize);
        if (count == 0)
            count++;

        if ($scope.currentPage > count)
            $scope.currentPage = count;

        return count;
    };
});
//#END OF INDEX PAGE




//#START OF AddNewExternalEmployee
var addNewExtEmpApp = angular.module('addNewExtEmpApp', []);
addNewExtEmpApp.controller('addNewExtEmpController', function ($http, $scope) {
    $scope.emp;


    //Clear page data
    $scope.act_reset = function () {
        $scope.emp = {
            MemberId: null,
            CodePersonne: '', //Changed from null
            FullName: '',
            FatherName: '',
            PhoneNumber: null,
            Country: null,
            SupplierId: null,
            PersonType: null,
            Email: null,
            Status: 'Act'
        };
    };

    $scope.act_reset();

    //Get Employee information if passed as Query String, for Edit
    $scope.MemberId = $.QueryString["MemberId"];
    var url = '/api/ExternalEmployees/GetExternalEmployeeById?MemberId=';
    if (typeof $scope.MemberId != 'undefined') {
        $http.get(url + $scope.MemberId).then(
			function success(response) {
			    //   console.log("success Read");
			    $scope.emp = response.data;
			    document.getElementById("bid_div").style = '';
			    document.getElementById("div_emptySpace").style = 'display: none';

			    //document.getElementById("reset").style = 'display: none';
			    //document.getElementById("delete").style = '';

			    setTimeout(function () {
			        $('#nationality').select2('data', {
			            id: $scope.emp.Country,
			            text: $scope.emp.CountryName
			        });
			        $('#supplier').select2('data', {
			            id: $scope.emp.SupplierId,
			            text: $scope.emp.SupplierName
			        });
			    }, 100);
			    //    console.log("Success Select 2");
			    hideLoader();
			},
			function error(response) {
			    //  console.log("fail");
			    alert("Failed to get Selected External Employee!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
			    console.log("Failed to get Selected External Employee!\nStatus: " + response.statusText + "\nData: " + response.data);
			});
    } else {
        hideLoader();
    }



    //Save Extenral Employeed
    $scope.act_saveExternalEmployee = function () {
        if ($scope.emp.CodePersonne == null || $scope.emp.CodePersonne == '') { //New Employee
            var url = '/api/ExternalEmployees/AddNewExternalEmployee';
            console.log("Adding Employee");
            console.log($scope.emp);
            $http.post(url, $scope.emp).then(
				function success(response) {
				    $scope.emp = response.data;
				    alert("Success \nAdded Employee BID is " + response.data.CodePersonne);
				    $scope.emp = null;
				},
				function error(response) {
				    console.log("POST fail to " + url);
				    console.log("Response : " + response);
				    console.log("Response Data : " + response.data);
				    console.log("Response Staus: " + response.statusText);
				    alert("Failed to save External Employee!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
				});
        } else {
            //Old employee to update
            var url = '/api/ExternalEmployees/UpdateExternalEmployee';
            console.log("Updating Employee");
            console.log($scope.emp);

            $http.post(url, $scope.emp).then(
				function success(response) {
				    window.location.href = "/ExternalEmployees/";
				    alert("Employee updated!");
				    //                    $scope.emp = response.data;
				},
				function error(response) {
				    console.log("POST fail to " + url);
				    console.log("Response : " + response);
				    console.log("Response Data : " + response.data);
				    console.log("Response Staus: " + response.statusText);
				    alert("Failed to Update External Employees!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
				});
        }
    };


    //$scope.act_delete = function ()
    //{
    //    if (confirm("Are you sure you want to Delete this employee")) {
    //        $http.delete('/api/Procurement/DeleteProcurementFile?ProcurementFileID=' + ProcurementFileID).then(
    //			function success(response) {
    //			    $scope.GetAllProcurementFiles();

    //			    //for (var i = 0; i < $scope.lstProcFiles.length; i++) {
    //			    //    if ($scope.lstProcFiles[i].ProcurementFileID == ProcurementFileID)
    //			    //        $scope.lstProcFiles.splice(i, 1);
    //			    //}
    //			},
    //			function error(response) {
    //			    showRequestErrorMessage(response);
    //			});
    //    }
    //}

    //Get nationalities by criteria (Pays)
    $("#nationality").select2({
        placeholder: "Select a Nationality",
        initSelection: true,
        minimumInputLength: 2,
        closeOnSelect: true,
        ajax: {
            url: "/ExternalEmployees/FindPaysByCriteria",
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
                        id: data[i].id_Pays,
                        text: data[i].nomPaysAnglais,
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
        //        // using its formatResult renderer - that way the person name is shown preselected
        //    //alert("w");
        //alert('in init');
        //var id = $(element).val();
        ////alert(id);

        //    var data = [];
        //    data.push({ id: '5AB8DD50-A1CE-4E6A-AFDB-BFEB85899491', text: 'Dado' });
        //    callback(data);

        //    if (id !== "") {
        //        $.ajax("/TravelRequest/GetStudentsInCenter/", {
        //            data: {
        //            id: $scope.LstTAFAccomodation.id_TiersHotel,
        //            text: $scope.LstTAFAccomodation.nomHotelTiers
        //        //apikey: "ju6z9mjyajq2djue3gbvv26t"
        //    },
        //    dataType: "json"
        //    }).done(function (data) {
        //        callback(data);
        //    });
        //}
        //},
        formatResult: function (Nationality) {
            return Nationality.text;
        },
        formatSelection: function (Nationality) {
            //    alert(Nationality.text);
            $scope.$apply(function () {
                $scope.emp.Country = Nationality.id;
                $scope.emp.CountryName = Nationality.text;
            });
            return Nationality.text;
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

    //Get the list of suppliers by criteria (Tiers)
    $("#supplier").select2({
        placeholder: "Select a Supplier",
        initSelection: true,
        minimumInputLength: 2,
        closeOnSelect: true,
        ajax: {
            url: "/ExternalEmployees/FindTierNonPersonne",
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
                        id: data[i].id_tiers,
                        text: data[i].nomTiers,
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
            $scope.$apply(function () {
                $scope.emp.SupplierId = Supplier.id;
            });
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

});
//#END OF AddNewExternalEmployee




//#START OF AssignJobRole
var assignJobApp = angular.module('assignJobApp', []);
assignJobApp.controller('assignJobRoleController', function ($scope, $http) {

    showLoader();

    //list of job roles
    $scope.lstJobRoles;
    //list of companies
    $scope.lstCompanies;
    //list of Jobs associated with chosen company
    $scope.lstJobs;
    //list of Attendance Allocations
    $scope.lstAttendAllocations;
    //list of People in Charge
    $scope.lstPplInCharge;
    //list of nationalities
    $scope.lstPays;



    //Gets the list of job roles
    //$http.get('/api/ExternalEmployees/GetAllFonctions').then(
    //    function success(response) {
    //        $scope.lstJobRoles = response.data.splice(0, 10);
    //    },
    //    function error() {
    //        alert("Failed to get Fonctions!");//\nStatus: " + response.statusText + "\nData: " + response.data);
    //        console.log("Failed to get Fonctions!\nStatus: " + response.statusText + "\nData: " + response.data);
    //    });

    //Gets the list of companies
    //$http.get('/api/ExternalEmployees/GetAllSocietes').then(
    //    function success(response) {
    //        $scope.lstCompanies = response.data.splice(0, 10);
    //    },
    //    function error() {
    //        alert("Failed to get Societes!");//\nStatus: " + response.statusText + "\nData: " + response.data);
    //        console.log("Failed to get Societes!\nStatus: " + response.statusText + "\nData: " + response.data);
    //    });


    //Assigned Job Role
    $scope.jobRoleAssignment = {
        id_JobRoleAssignment: '',
        id_Identifiant: '',
        id_Fonction: '',
        dateChronologieInitial: '',
        dateChronologieFin: '',
        id_personneResponsable: '',
        //id_Societe: '',
        id_Pays: '',
        id_Poste: ''
    };

    $scope.jobScheduleAssignment = {};

    $scope.jobRoleAssignmentAllInfo = {
        dateChronologieInitial: today()
    };

    //Get Employee information if passed as Query String
    $scope.MemberId = $.QueryString["MemberId"];
    var url = '/api/ExternalEmployees/GetExternalEmployeeById?MemberId=';
    if (typeof $scope.MemberId != 'undefined') {
        $http.get(url + $scope.MemberId).then(
			function success(response) {
			    console.log("success");
			    $scope.jobRoleAssignmentAllInfo.id_Personne = response.data.MemberId;
			    $scope.jobRoleAssignmentAllInfo.CodePersonne = response.data.CodePersonne;
			    $scope.jobRoleAssignmentAllInfo.FullName = response.data.FullName;
			    $scope.jobRoleAssignmentAllInfo.FatherName = response.data.FatherName;
			    //console.log(response.data);
			    document.getElementById("bid").disabled = true;
			    getPreviousFonctions($scope.jobRoleAssignmentAllInfo.id_Personne);

			    hideLoader();
			},
			function error(response) {
			    //  console.log("fail");
			    alert("Failed to get External Employee data!\nStatus: " + response.statusText + "\nData: " + response.data);
			});
    } else {
        hideLoader();
    }



    //Get Employee information if specified in the BID field
    //Event fires on BID field Change
    //REVIEW : Is there a better way for this?
    //How can I (easily) make it fires on unfocus 
    $scope.updateEmployeeInfo = function () {
        var url = '/api/ExternalEmployees/GetExternalEmployeeByCodePersonne?CodePersonne=';

        if (typeof $scope.jobRoleAssignmentAllInfo.CodePersonne != 'undefined') {
            showLoader();

            $http.get(url + $scope.jobRoleAssignmentAllInfo.CodePersonne).then(
				function success(response) {
				    hideLoader();
				    $scope.jobRoleAssignmentAllInfo.id_Personne = response.data.MemberId;
				    $scope.jobRoleAssignmentAllInfo.FullName = response.data.FullName;
				    $scope.jobRoleAssignmentAllInfo.FatherName = response.data.FatherName;
				    //reset input field font style to normal
				    document.getElementById("fullName").style = 'font-style:normal';
				    document.getElementById("fatherName").style = 'font-style:normal';
				    getPreviousFonctions($scope.jobRoleAssignmentAllInfo.id_Personne);
				},
				function error(response) {
				    hideLoader();

				    //Show error message in input field, and make font italic
				    $scope.jobRoleAssignmentAllInfo.id_Personne = null;
				    $scope.jobRoleAssignmentAllInfo.FullName = 'Employee Not Found';
				    $scope.jobRoleAssignmentAllInfo.FatherName = 'Employee Not Found';

				    document.getElementById("fullName").style = 'font-style:italic';
				    document.getElementById("fatherName").style = 'font-style:italic';
				});
        } else {
            hideLoader();
        }
    };



    //List of previously assigned job roles
    $scope.lstPrevJobRoles;
    $scope.jobRolesCurrentPage;
    $scope.jobRolesPageSize = '5';
    getPreviousFonctions = function (id_Personne) {
        $http.get('/api/ExternalEmployees/GetAllJobRolesByIdPersonne?id_Personne=' + id_Personne).then(
			function success(response) {
			    hideLoader();
			    $scope.lstPrevJobRoles = response.data;
			    for (var i = 0; i < $scope.lstPrevJobRoles.length; i++) {
			        $scope.lstPrevJobRoles[i].dateChronologieInitial = formatDate($scope.lstPrevJobRoles[i].dateChronologieInitial);
			        if (formatAMPM($scope.lstPrevJobRoles[i].dateChronologieFin) === '12:00 AM')
			            $scope.lstPrevJobRoles[i].dateChronologieFin = formatDate($scope.lstPrevJobRoles[i].dateChronologieFin);
			        else
			            $scope.lstPrevJobRoles[i].dateChronologieFin = '';
			    }
			    console.log("successfuly read previous job roles");
			    $scope.jobRolesCurrentPage = 1;
			},
			function error(response) {
			    $scope.jobRolesCurrentPage = 0;
			    console.log("failed to read previous job roles");
			    hideLoader();
			});
    };
    $scope.numberOfPages = function () {
        if ($scope.lstPrevJobRoles == null) {
            return 0;
        }
        var count = Math.ceil($scope.lstPrevJobRoles.length / $scope.jobRolesPageSize);
        if (count == 0)
            count++;

        if ($scope.jobRolesCurrentPage > count)
            $scope.jobRolesCurrentPage = count;

        return count;
    };




    //Get the Jobs list based on company (Societe) choice
    $scope.updateListOfJobs = function () {
        //var url = '/api/ExternalEmployees/GetAllPostesBySocieteId?id_Societe=';
        //if (typeof $scope.jobRoleAssignmentAllInfo.id_Societe != 'undefined') {

        var url = '/api/ExternalEmployees/GetAllPostesInPays?id_Pays=';
        if (typeof $scope.jobRoleAssignmentAllInfo.id_Pays != 'undefined') {
            showLoader();

            $http.get(url + $scope.jobRoleAssignmentAllInfo.id_Pays).then(
				function success(response) {
				    hideLoader();
				    console.log(response.data);

				    $scope.lstJobs = response.data;
				},
				function error(response) {
				    hideLoader();
				});
            hideLoader();
        } else {
            hideLoader();
        }
    };


    //Get the Jobs list based on company (Societe) choice
    $scope.updateListOfAttendAllocations = function () {
        var url = '/api/ExternalEmployees/GetAllHorairesInPays?id_Pays=';
        if (typeof $scope.jobRoleAssignmentAllInfo.id_Pays != 'undefined') {
            showLoader();

            $http.get(url + $scope.jobRoleAssignmentAllInfo.id_Pays).then(
				function success(response) {
				    hideLoader();
				    console.log(response.data);

				    $scope.lstAttendAllocations = response.data;
				},
				function error(response) {
				    hideLoader();
				});
            hideLoader();
        } else {
            hideLoader();
        }
    };

    //clear form data
    $scope.act_reset = function () {
        $scope.jobRoleAssignment = {};
        $scope.jobScheduleAssignment = {};
        $scope.jobRoleAssignmentAllInfo = {};
    };


    //Add job role assignment to employee
    $scope.act_addJobRoleAssignment = function () {

        //Set values
        $scope.jobRoleAssignment.id_Identifiant = $scope.jobRoleAssignmentAllInfo.id_Personne;
        $scope.jobRoleAssignment.id_Fonction = $scope.jobRoleAssignmentAllInfo.id_Fonction;
        $scope.jobRoleAssignment.dateChronologieInitial = $scope.jobRoleAssignmentAllInfo.dateChronologieInitial;
        $scope.jobRoleAssignment.dateChronologieFin = $scope.jobRoleAssignmentAllInfo.dateChronologieFin;
        $scope.jobRoleAssignment.id_personneResponsable = $scope.jobRoleAssignmentAllInfo.id_personneResponsable;
        //        $scope.jobRoleAssignment.id_Societe = $scope.jobRoleAssignmentAllInfo.id_Societe;
        $scope.jobRoleAssignment.id_Poste = $scope.jobRoleAssignmentAllInfo.id_Poste;

        $scope.jobScheduleAssignment.id_Horaire = $scope.jobRoleAssignmentAllInfo.id_Horaire;
        $scope.jobScheduleAssignment.id_Personne = $scope.jobRoleAssignmentAllInfo.id_Personne;
        $scope.jobScheduleAssignment.dateDebutHoraire = $scope.jobRoleAssignmentAllInfo.dateChronologieInitial;
        $scope.jobScheduleAssignment.dateFinHoraire = $scope.jobRoleAssignmentAllInfo.dateChronologieFin;

        //Logging variables
        var jobRolePostSuccess = true;
        var jobRolePostResponse = "";

        var jobSchedulePostSuccess = true;
        var jobSchedulePostResponse = "";

        //Add Job ROle Assignment
        var urlFonction = '/api/ExternalEmployees/AddJobRoleAssignment';
        $http.post(urlFonction, $scope.jobRoleAssignment).then(
			function success(response) {
			    jobRolePostResponse = response.data;
			},
			function error(response) {
			    jobRolePostSuccess = false;
			    jobRolePostResponse = "JobRole= Status: " + response.statusText + "\nData: " + response.data + "\n";
			}
		);

        //Add Job ROle Schedule
        var urlHorarire = '/api/ExternalEmployees/AddJobScheduleAssignment';
        $http.post(urlHorarire, $scope.jobScheduleAssignment).then(
			function success(response) {
			    jobSchedulePostSuccess = response.data;
			},
			function error(response) {
			    jobSchedulePostSuccess = false;
			    jobSchedulePostResponse = "JobSchedule= Status: " + response.statusText + "\nData: " + response.data + "\n";
			}
		);


        //Error reporting
        if (!jobRolePostSuccess || !jobSchedulePostSuccess) {
            var message = "Failed to Save";
            message = message + !jobRolePostSuccess ? jobRolePostResponse : "";
            message = message + !jobSchedulePostSuccess ? jobSchedulePostResponse : "";
            alert(message);
        } else {
            alert("Job Role assigned!");
            window.location.href = "/ExternalEmployees/";
        }
    };



    //terminating a job role stuff
    $scope.toClose_id_JobRoleAssignment = '';
    $scope.toClose_titreFonction = '';
    $scope.toClose_closeDate = today();
    $scope.act_closeJobRoleModal = function (id_JobRoleAssignment, titreFonction) {
        $scope.toClose_id_JobRoleAssignment = id_JobRoleAssignment;
        $scope.toClose_titreFonction = titreFonction;
    };
    $scope.act_closeJobRole = function () {
        if ($scope.toClose_id_JobRoleAssignment == '')
            alert("No Job Role selected!");
        else {
            var closeJobURL = '/api/ExternalEmployees/CloseJobRoleAssignment';
            closeJobURL = closeJobURL + '?id_JobRoleAssignment=' + $scope.toClose_id_JobRoleAssignment;
            closeJobURL = closeJobURL + '&closeDate=' + $scope.toClose_closeDate;

            $http.post(closeJobURL, null).then(
				function success(response) {
				    //  alert(response.data);
				    getPreviousFonctions($scope.jobRoleAssignmentAllInfo.id_Personne);
				},
				function error(response) {
				    alert("Failed to close job role");
				}
			);
        }
    }




    //Gets the list of Job Roles by Criteria
    $("#jobRole").select2({
        placeholder: "Select a Job Role",
        minimumInputLength: 3,
        closeOnSelect: true,
        ajax: {
            url: "/ExternalEmployees/FindFonctionsByCriteria",
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
                        id: data[i].id_fonction,
                        fonction: data[i].titreFonction,
                        speciality: data[i].descriptionSpecialiteFonction,
                        text: data[i].titreFonction
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (JobRole) {
            return JobRole.fonction + (JobRole.speciality !== "None" ? " - " + JobRole.speciality : "");
        },
        formatSelection: function (JobRole) {
            $scope.$apply(function () {
                $scope.jobRoleAssignmentAllInfo.id_Fonction = JobRole.id;
                $scope.jobRoleAssignmentAllInfo.titreFonction = JobRole.fonction;
                $scope.jobRoleAssignmentAllInfo.descriptionSpecialiteFonction = JobRole.speciality
            });

            // $scope.nomTiers = Supplier.text;
            return JobRole.fonction;
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



    //Gets the list of Countries by Criteria
    $("#country").select2({
        placeholder: "Select a Country",
        minimumInputLength: 2,
        closeOnSelect: true,
        ajax: {
            url: "/ExternalEmployees/FindPaysByCriteria",
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
                        id: data[i].id_Pays,
                        text: data[i].nomPaysAnglais,
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Country) {
            return Country.text;
        },
        formatSelection: function (Country) {
            $scope.$apply(function () {
                $scope.jobRoleAssignmentAllInfo.id_Pays = Country.id;
                $scope.jobRoleAssignmentAllInfo.nomPaysAnglais = Country.text;
                //REVIEW : MAYBE UPDATE LIST OF POSTES HERE
                $scope.updateListOfJobs();
                $scope.updateListOfAttendAllocations();
            });

            $("#job").select2({
                allowClear: false,
                placeholder: "Select a Job"
            });
            $("#attendanceAlloc").select2({
                allowClear: false,
                placeholder: "Select an Attendance Allocation"
            });

            return Country.text;
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


    //Gets the list of Companies by Societe ID and Criteria
    //$("#job2").select2({
    //    placeholder: "Select a Job",
    //    minimumInputLength: 2,
    //    closeOnSelect: true,
    //    ajax: {
    //        url: "/ExternalEmployees/GetAllPostesBySocieteIdAndCriteria",
    //        dataType: 'json',
    //        error: function () {
    //            alert("Temporary error. Please try again...");
    //        },
    //        data: function (term, page) {
    //            return {
    //                id_Societe: $scope.jobRoleAssignmentAllInfo.id_Societe,
    //                criteria: term,
    //                pageSize: 10,
    //                pageNumber: page
    //            };
    //        },
    //        results: function (data, page) {
    //            var arr = [];
    //            for (var i = 0; i < data.length; i++) {
    //                arr.push({
    //                    id: data[i].id_Poste,
    //                    text: data[i].libellePoste,
    //                });
    //            }
    //            return {
    //                results: arr
    //            };
    //        }
    //    },
    //    formatResult: function (Job) {
    //        return Job.text;
    //    },
    //    formatSelection: function (Job) {
    //        $scope.$apply(function () {
    //            $scope.jobRoleAssignmentAllInfo.id_Poste = Job.id;
    //            $scope.jobRoleAssignmentAllInfo.libellePoste = Job.text;
    //        });
    //        // $scope.nomTiers = Supplier.text;
    //        return Job.text;
    //    },
    //    dropdownCssClass: "bigdrop",
    //    escapeMarkup: function (m) {
    //        return m;
    //    },
    //    formatNoMatches: function () {
    //        return "No Matches Found";
    //    },
    //    formatInputTooShort: function (input, min) {
    //        var n = min - input.length;
    //        return "Please Enter " + (n == 1 ? "1 more Character" : (n + " more Characters"));
    //    },
    //    formatLoadMore: function (pageNumber) {
    //        return "Loading More Results";
    //    },
    //    formatSearching: function () {
    //        return "Searching";
    //    },
    //});


    //Gets the list of Person in charge by Criteria
    $("#personInCharge").select2({
        placeholder: "Select a Member",
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
                    if ($scope.jobRoleAssignmentAllInfo.id_Personne != data[i].MemberId)
                        arr.push({
                            id: data[i].MemberId,
                            text: data[i].FullName,
                            CodePersonne: data[i].CodePersonne,
                            FullName: data[i].FullName,
                            FatherName: data[i].FatherName,
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
                $scope.jobRoleAssignmentAllInfo.id_personneResponsable = Member.id;
                $scope.jobRoleAssignmentAllInfo.PersonInCharge_CodePersonne = Member.CodePersonne;
                $scope.jobRoleAssignmentAllInfo.PersonInCharge_FullName = Member.FullName;
                $scope.jobRoleAssignmentAllInfo.PersonInCharge_FatherName = Member.FatherName;
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




    //Gets the list of Attendance Allocations by Criteria
    //$("#attendanceAlloc").select2({
    //    placeholder: "Select an Attend. Alloc.",
    //    minimumInputLength: 2,
    //    closeOnSelect: true,
    //    ajax: {
    //        url: "/ExternalEmployees/FindHorairesByCriteria",
    //        dataType: 'json',
    //        error: function () {
    //            alert("Temporary error. Please try again...");
    //        },
    //        data: function (term, page) {
    //            return {
    //                id_Pays: $scope.jobRoleAssignmentAllInfo.id_Pays,
    //                criteria: term,
    //                pageSize: 10,
    //                pageNumber: page
    //            };
    //        },
    //        results: function (data, page) {
    //            var arr = [];
    //            for (var i = 0; i < data.length; i++) {
    //                arr.push({
    //                    id: data[i].id_Horaire,
    //                    text: data[i].descriptionHoraire,
    //                });
    //            }
    //            return {
    //                results: arr
    //            };
    //        }
    //    },
    //    formatResult: function (AttendanceAlloc) {
    //        return AttendanceAlloc.text;
    //    },
    //    formatSelection: function (AttendanceAlloc) {
    //        $scope.$apply(function () {
    //            $scope.jobRoleAssignmentAllInfo.id_Horaire = AttendanceAlloc.id;
    //            $scope.jobRoleAssignmentAllInfo.descriptionHoraire = AttendanceAlloc.text;
    //        });
    //        // $scope.nomTiers = Supplier.text;
    //        return AttendanceAlloc.text;
    //    },
    //    dropdownCssClass: "bigdrop",
    //    escapeMarkup: function (m) {
    //        return m;
    //    },
    //    formatNoMatches: function () {
    //        return "No Matches Found";
    //    },
    //    formatInputTooShort: function (input, min) {
    //        var n = min - input.length;
    //        return "Please Enter " + (n == 1 ? "1 more Character" : (n + " more Characters"));
    //    },
    //    formatLoadMore: function (pageNumber) {
    //        return "Loading More Results";
    //    },
    //    formatSearching: function () {
    //        return "Searching";
    //    },
    //});
});

//#END OF AssignJobRole




//#START OF Foreman Daily Reports Seach page
var foremanReportSearchApp = angular.module('foremanReportSearchApp', []);
foremanReportSearchApp.controller('foremanReportSearchController', function ($scope, $http) {
    //Define variables
    $scope.foremanReports;

    $scope.currentPage = 1;
    $scope.pageSize = '10';

    $scope.searchCriteria = '';

    //Fetch External Employees by criteria
    $scope.search = function () {
        $http.get("/api/ExternalEmployees/FindForemanDailyReports?Criteria=" + $scope.searchCriteria).then(
			function success(response) {
			    $scope.foremanReports = response.data;
			    var i = 0;
			    for (i = 0; i < $scope.foremanReports.length; i++) {
			        var item = $scope.foremanReports[i];
			        item.Date = formatDate(item.Date);
			    }
			    console.log($scope.searchCriteria);
			    hideLoader();
			},
			function error(response) {
			    alert("Failed to get Foreman Daily Reports!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
			    console.log("Failed to get Foreman Daily Reports!\nStatus: " + response.statusText + "\nData: " + response.data);
			    hideLoader();
			});
    };

    $scope.search();


    //edit Formean Daily report
    $scope.act_edit = function (ReportId) {
        window.location.href = "/ExternalEmployees/EditForemanDailyReport?ReportId=" + ReportId;
    }

    //Generate Hardcopy report
    $scope.act_generateReport = function (ReportId) {
        window.open('/ExternalEmployees/ForemanDailyReportFilledPrintable?id_ForemanDailyReport=' + ReportId, '_blank');
    }

    $scope.numberOfPages = function () {
        if ($scope.foremanReports == null)
            return 1;

        var count = Math.ceil($scope.foremanReports.length / $scope.pageSize);
        if (count == 0)
            count++;

        if ($scope.currentPage > count)
            $scope.currentPage = count;

        return count;
    };
});
//#END OF Foreman Daily Reports Seach page



//START of EditForemanDailyReport
var foremanDailyRptApp = angular.module('foremanDailyRptApp', []);
foremanDailyRptApp.controller('foremanDailyRptController', function ($scope, $http) {
    $scope.loggedInUser;



    //The foreman daily report
    $scope.foremanDailyReport;
    //List of Equipments
    $scope.lstEquipments = [];
    //List of Activities
    $scope.lstActivities = [];
    //Deleted Items
    $scope.deletedEquipments = [];
    $scope.deletedActivities = [];
    //Selected project name
    $scope.projectName;

    //The foreman selected from the list
    $scope.selectedForeman;

    //gangLeader teams, with the members of each team
    $scope.gangLeaderTeamsWithMembers;

    $scope.lstTeams;



    //List of foreman associated with project
    $scope.lstForeman;
    //List of Primaveras
    $scope.lstPrimaveras;
    //List of Lots
    $scope.lstLots;
    //List of Unites
    $scope.lstUnits

    //boolean flag indicating whether the report is an old one in edit mode, or a new one
    $scope.editMode = false;
    //Activity Number Counter
    $scope.actNum = 1;
    //Equipment Number Counter
    $scope.eqptNum = 1;


    //Get Primaveras --- filled after poste selection
    //$http.get('/api/ExternalEmployees/GetAllPrimaveras').then(
    //    function success(response) {
    //        hideLoader();
    //        $scope.lstPrimaveras = response.data;
    //    },
    //    function error(response) {
    //        alert("Failed to get Primaveras!\nStatus: " + response.statusText + "\nData: " + response.data);
    //        hideLoader();
    //    });

    //Get Lots
    $http.get('/api/ExternalEmployees/GetAllLotPostes').then(
		function success(response) {
		    hideLoader();
		    $scope.lstLots = response.data;
		},
		function error(response) {
		    alert("Failed to get Lot Postes!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
		    console.log("Failed to get Lot Postes!\nStatus: " + response.statusText + "\nData: " + response.data);
		    hideLoader();
		});


    //Get Unites
    $http.get('/api/ExternalEmployees/GetAllUnites').then(
		function success(response) {
		    hideLoader();
		    $scope.lstUnits = response.data;
		},
		function error(response) {
		    alert("Failed to get Units!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
		    console.log("Failed to get Units!\nStatus: " + response.statusText + "\nData: " + response.data);
		    hideLoader();
		});



    $scope.ReportId = $.QueryString["ReportId"];
    var url = '/api/ExternalEmployees/GetForemanDailyReportInfoById?id_ForemanDailyReport=';
    url = url + $scope.ReportId;
    if (typeof $scope.ReportId != 'undefined') {
        console.log("Report id ");
        $scope.editMode = true;
        $http.get(url).then(
			function success(response) {
			    console.log("success Read");
			    var reportInfo = response.data;

			    //Foreman Daily Report Data
			    $scope.foremanDailyReport = reportInfo.objForemanDailyReport;
			    $scope.foremanDailyReport.Date = formatDate($scope.foremanDailyReport.Date);
			    $scope.foremanDailyReport.xDayShift = '' + $scope.foremanDailyReport.xDayShift;
			    $scope.foremanDailyReport.libellePoste = $scope.foremanDailyReport.libellePoste;




			    //Equipments
			    $scope.lstEquipments = reportInfo.lstForemanDailyReportEquipment;

			    $scope.eqptNum = $scope.lstEquipments.length;
			    for (var i = 0; i < $scope.lstEquipments.length; i++) {
			        //console.log(i + 10);
			        var eq = $scope.lstEquipments[i];
			        //set eqptNum to largest value
			        $scope.eqptNum = $scope.eqptNum >= eq.equipmentNumber ? $scope.eqptNum : eq.equipmentNumber;

			        if (eq.isRented)
			            eq.type = 'IsRentedEquipment';
			        else {
			            //addEquipmentSelector(eq.id_ForemanDailyReportEquipment);
			            eq.type = 'IsButecEquipment';
			        }

			        eq.isNew = false;
			    }

			    $scope.eqptNum = $scope.eqptNum + 1;
			    console.log("EQ Num : : " + $scope.eqptNum);



			    //Gang Leader Teams
			    var lstTeams = reportInfo.lstForemanDailyReportTeam;
			    var lstMembers = reportInfo.lstForemanDailyReportMember;
			    $scope.gangLeaderTeamsWithMembers = [];
			    for (var i = 0; i < lstTeams.length; i++) {
			        var gTeam = {};
			        gTeam.team = lstTeams[i];
			        gTeam.members = [];
			        for (var j = 0; j < lstMembers.length; j++) {
			            if (lstMembers[j].id_ForemanDailyReportTeam === lstTeams[i].id_ForemanDailyReportTeam)
			                gTeam.members.push(lstMembers[j]);
			        }
			        $scope.gangLeaderTeamsWithMembers.push(gTeam);
			    }


			    //Activities
			    $scope.lstActivities = reportInfo.lstForemanDailyReportActivity;
			    $scope.actNum = $scope.lstActivities.length;
			    for (var i = 0; i < $scope.lstActivities.length; i++) {
			        $scope.lstActivities[i].FromTime = formatAMPM($scope.lstActivities[i].FromTime); //('' + $scope.lstActivities[i].FromTime).substring(11, 16);
			        $scope.lstActivities[i].ToTime = formatAMPM($scope.lstActivities[i].ToTime);
			        //set actNum to highest possible
			        $scope.actNum = $scope.actNum >= $scope.lstActivities[i].ActivityNumber ? $scope.actNum : $scope.lstActivities[i].ActivityNumber;
			    }

			    $scope.actNum = parseInt($scope.actNum) + 1;
			    console.log("Act Num : : " + $scope.actNum);




			    //Load Primaveras in Poste
			    $http.get('/api/ExternalEmployees/GetPrimaverasInPoste?id_Poste=' + $scope.foremanDailyReport.id_Poste).then(
					function success(response) {
					    hideLoader();
					    $scope.lstPrimaveras = response.data;
					},
					function error(response) {
					    alert("Failed to get Primaveras!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
					    console.log("Failed to get Primaveras!\nStatus: " + response.statusText + "\nData: " + response.data);
					    hideLoader();
					});


			    hideLoader();
			    $('#projectCode').select2('data', {
			        id: $scope.foremanDailyReport.id_Poste,
			        codePoste: $scope.foremanDailyReport.codePoste
			    });


			    $http.get('/api/Common/GetLoggedInUser').then(
					function success(response) {
					    $scope.loggedInUser = response.data;
					    console.log($scope.loggedInUser);

					    if ($scope.loggedInUser.MemberId != $scope.foremanDailyReport.id_CreatedBy) {
					        //     console.log($scope.foremanDailyReport.Status);
					        document.getElementById('fieldset').disabled = true;
					        document.getElementById('submit').style.visibility = 'hidden';
					        document.getElementById('delete').style.visibility = 'hidden';

					    }
					    console.log($scope.loggedInUser.MemberId);
					    console.log($scope.foremanDailyReport.id_CreatedBy);
					},
					function error(response) {
					    console.log("Failed to get logged in user");
					    console.log("Response : " + response);
					    console.log("Response Data : " + response.data);
					    console.log("Response Staus: " + response.statusText);
					    $scope.loggedInUser = null;
					});



			    if ($scope.foremanDailyReport.Status !== 'prp') {
			        //     console.log($scope.foremanDailyReport.Status);
			        document.getElementById('fieldset').disabled = true;
			        document.getElementById('submit').style.visibility = 'hidden';
			        document.getElementById('delete').style.visibility = 'hidden';
			    }

			},
			function error(response) {
			    //  console.log("fail");
			    alert("Failed to get Foreman Daily Report data!\nStatus: " + response.statusText + "\nData: " + response.data);
			});




    } else {
        //Get ID Number


        $scope.editMode = false;
        $scope.foremanDailyReport = {
            id_ForemanDailyReport: generateGuid(),
            id_Foreman: '',
            Status: 'prp',
            Date: '',
            xDayShift: 'true',
            Location: '',
            id_Poste: '',
        };

        $http.get('/api/ExternalEmployees/GetNewForemanDailyReportReferenceNumber').then(
			function success(response) {
			    $scope.foremanDailyReport.ReferenceNumber = response.data;
			    document.getElementById("referenceNumber").disabled = true;
			},
			function error(response) {
			    console.log(response.statusText)
			});

        hideLoader();
    }

    //Form submit
    $scope.act_submitForemanDailyReport = function () {

        console.log("Submitting");
        if ($scope.editMode) {
            if ($scope.deletedEquipments.length > 0)
                $http.post("/api/ExternalEmployees/DeleteForemanDailyReportEquipments", $scope.deletedEquipments).then(
					function success(response) {
					    console.log(response.data);
					},
					function error(response) {
					    alert("Failed to delete Foreman Daily Report Equipments!\nStatus: " + response.statusText + "\nData: " + response.data);
					    console.log(response.data);
					});

            if ($scope.deletedActivities.length > 0)
                $http.post("/api/ExternalEmployees/DeleteForemanDailyReportActivities", $scope.deletedActivities).then(
					function success(response) {
					    console.log(response.data);
					},
					function error(response) {
					    alert("Failed to delete Foreman Daily Report Activities!\nStatus: " + response.statusText + "\nData: " + response.data);
					    console.log(response.data);
					});


            var objForemanDailyReport = $scope.foremanDailyReport;
            objForemanDailyReport.xDayShift = objForemanDailyReport.xDayShift === 'true';
            var lstForemanDailyReportEquipment = $scope.lstEquipments;
            var lstForemanDailyReportActivity = [];
            var lstForemanDailyReportTeam = [];
            var lstForemanDailyReportMember = []

            var id_ForemanDailyReport = $scope.foremanDailyReport.id_ForemanDailyReport;


            for (var i = 0; i < $scope.gangLeaderTeamsWithMembers.length; i++) {
                var gangLeader = $scope.gangLeaderTeamsWithMembers[i];
                var team = gangLeader.team;
                team.id_ForemanDailyReport = id_ForemanDailyReport;

                lstForemanDailyReportTeam.push(team);

                var membersList = $scope.gangLeaderTeamsWithMembers[i].members;
                for (var j = 0; j < membersList.length; j++) {
                    var member = membersList[j];
                    member.xLeader = member.id_Personne === gangLeader.teamLeaderID;
                    lstForemanDailyReportMember.push(member);
                }
            }

            for (var i = 0; i < $scope.lstActivities.length; i++) {
                var activity = $scope.lstActivities[i];
                //    console.log(activity);
                lstForemanDailyReportActivity.push(activity);
            }

            var objForemanDailyReportInfo = {
                'objForemanDailyReport': objForemanDailyReport,
                'lstForemanDailyReportActivity': lstForemanDailyReportActivity,
                'lstForemanDailyReportEquipment': lstForemanDailyReportEquipment,
                'lstForemanDailyReportTeam': lstForemanDailyReportTeam,
                'lstForemanDailyReportMember': lstForemanDailyReportMember,
            };

            console.log(objForemanDailyReportInfo);
            $http.post("/api/ExternalEmployees/UpdateForemanDailyReportInfo", objForemanDailyReportInfo).then(
				function success(response) {
				    alert("Foreman reported updated!");
				    console.log(response.data);
				    window.location.href = "/ExternalEmployees/SearchForemanDailyReport";
				},
				function error(response) {
				    alert("Failed to Update Foreman Daily Report data!\nStatus: " + response.statusText + "\nData: " + response.data);
				    console.log(response.data);
				});

        } else {
            var objForemanDailyReport = $scope.foremanDailyReport;
            objForemanDailyReport.xDayShift = objForemanDailyReport.xDayShift === 'true';
            var lstForemanDailyReportEquipment = $scope.lstEquipments;
            var lstForemanDailyReportActivity = [];
            var lstForemanDailyReportTeam = [];
            var lstForemanDailyReportMember = []

            var id_ForemanDailyReport = $scope.foremanDailyReport.id_ForemanDailyReport;


            for (var i = 0; i < $scope.gangLeaderTeamsWithMembers.length; i++) {
                var gangLeader = $scope.gangLeaderTeamsWithMembers[i];
                var team = gangLeader.team;
                team.id_ForemanDailyReport = id_ForemanDailyReport;

                lstForemanDailyReportTeam.push(team);

                var membersList = $scope.gangLeaderTeamsWithMembers[i].members;
                for (var j = 0; j < membersList.length; j++) {
                    var member = membersList[j];
                    member.xLeader = member.id_Personne === gangLeader.teamLeaderID;
                    lstForemanDailyReportMember.push(member);
                }
            }

            for (var i = 0; i < $scope.lstActivities.length; i++) {
                var activity = $scope.lstActivities[i];
                activity.id_ForemanDailyReport = id_ForemanDailyReport;
                //    console.log(activity);
                lstForemanDailyReportActivity.push(activity);
            }

            var objForemanDailyReportInfo = {
                'objForemanDailyReport': objForemanDailyReport,
                'lstForemanDailyReportActivity': lstForemanDailyReportActivity,
                'lstForemanDailyReportEquipment': lstForemanDailyReportEquipment,
                'lstForemanDailyReportTeam': lstForemanDailyReportTeam,
                'lstForemanDailyReportMember': lstForemanDailyReportMember,
            };

            console.log(objForemanDailyReportInfo);
            $http.post("/api/ExternalEmployees/AddForemanDailyReportInfo", objForemanDailyReportInfo).then(
				function success(response) {
				    alert("Foreman Report added!");
				    console.log(response.data);
				    window.location.href = "/ExternalEmployees/SearchForemanDailyReport";
				},
				function error(response) {
				    alert("Failed to Add Foreman Daily Report!\nStatus: " + response.statusText + "\nData: " + response.data);
				    console.log(response.data);
				});
        }
    };

    //delete a foreman daily report
    $scope.act_deleteForemanDailyReport = function () {
        var url = '/api/ExternalEmployees/DeleteForemanDailyReport';
        url += '?id_ForemanDailyReport=' + $scope.foremanDailyReport.id_ForemanDailyReport;
        if (confirm("Are you sure you want to delete this report?")) {
            //   alert(url + $scope.foremanDailyReport.id_ForemanDailyReport);
            //$http.post(url, $scope.foremanDailyReport.id_ForemanDailyReport).then(
            $http.post(url).then(
				function success(response) {
				    //alert("Report Deleted!");
				    window.location.href = "/ExternalEmployees/SearchForemanDailyReport"
				},
				function error(response) {
				    alert("Failed to delete Report!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
				    console.log("Failed to delete Report!\nStatus: " + response.statusText + "\nData: " + response.data);
				});
        }
    };


    //Event listeners
    //change list of foreman when project (poste) is changed
    $scope.projectSelected = function () {
        console.log("project Selected");
        var url = '/api/ExternalEmployees/GetAllForemenInProject?';
        url = url + 'id_Poste=' + $scope.foremanDailyReport.id_Poste;
        url = url + '&Date=' + $scope.foremanDailyReport.Date;
        if ($scope.foremanDailyReport.id_Poste === '' || $scope.foremanDailyReport.Date === '' ||
			$scope.foremanDailyReport.id_Poste === undefined || $scope.foremanDailyReport.Date === undefined)
            return;

        $http.get(url).then(function success(response) {
            $scope.lstForeman = response.data;
        },
			function error(response) { }
		);

        //Load Primaveras in Poste
        $http.get('/api/ExternalEmployees/GetPrimaverasInPoste?id_Poste=' + $scope.foremanDailyReport.id_Poste).then(
			function success(response) {
			    hideLoader
			    $scope.lstPrimaveras = response.data;
			    console.log($scope.lstPrimaveras);
			},
			function error(response) {
			    alert("Failed to get Primaveras!\nStatus: " + response.statusText + "\nData: " + response.data);
			    hideLoader();
			});
    };

    $scope.primaveraUpdated = function (activity) {
        for (var i = 0; i < $scope.lstPrimaveras.length; i++) {
            var prima = $scope.lstPrimaveras[i];
            if (prima.id_Primavera == activity.id_Primavera) {
                //console.log(i);
                //console.log(prima);
                //alert(prima.id_LotPoste);
                //alert(prima.codeLotPoste);
                activity.id_LotPoste = prima.id_LotPoste;
                activity.codeLotPoste = prima.codeLotPoste;
                break;
            }
        }
    }

    //gets called on foreman selection
    $scope.foremanSelected = function () {
        //     console.log("Updated");
        var id_foreman = $scope.selectedForeman.MemberId;
        var id_poste = $scope.foremanDailyReport.id_Poste;
        var Date = $scope.foremanDailyReport.Date;

        $scope.foremanDailyReport.id_Foreman = id_foreman;




        //Check that this report was not issued before
        var prevForemanReportUrl = '/api/ExternalEmployees/GetForemanDailyReportByIds?'
        prevForemanReportUrl = prevForemanReportUrl + 'id_Poste=' + id_poste
        prevForemanReportUrl = prevForemanReportUrl + '&id_Foreman=' + id_foreman;
        prevForemanReportUrl = prevForemanReportUrl + '&Date=' + Date;

        var prevReport = null;
        $http.get(prevForemanReportUrl).then(
			function success(response) {
			    prevReport = response.data;

			    if (prevReport != null) {
			        if (confirm("This Report has been generated before. Do you want to edit it?")) {
			            window.location.href = "/ExternalEmployees/EditForemanDailyReport?ReportId=" + prevReport.id_ForemanDailyReport;
			        } else {
			            document.getElementById('submit').style.visibility = 'hidden';
			            document.getElementById('activitiesPanel').style.visibility = 'hidden';
			            document.getElementById('equipmentsPanel').style.visibility = 'hidden';
			            document.getElementById('rentedEquipmentsPanel').style.visibility = 'hidden';
			            document.getElementById('dayShift').disabled = true;
			            document.getElementById('location').disabled = true;
			            //return;
			        }
			    } else {
			        document.getElementById('submit').style.visibility = 'visible';
			        document.getElementById('activitiesPanel').style.visibility = 'visible';
			        document.getElementById('equipmentsPanel').style.visibility = 'visible';
			        document.getElementById('rentedEquipmentsPanel').style.visibility = 'visible';
			        document.getElementById('dayShift').disabled = false;
			        document.getElementById('location').disabled = false;
			    }
			},
			function error(response) { });




        var gangLeaderTeamsWithMembersUrl = '/api/ExternalEmployees/GetTeamsUnderForemamInProject?'
        gangLeaderTeamsWithMembersUrl = gangLeaderTeamsWithMembersUrl + 'id_foreman=' + id_foreman
        gangLeaderTeamsWithMembersUrl = gangLeaderTeamsWithMembersUrl + '&id_poste=' + id_poste;
        gangLeaderTeamsWithMembersUrl = gangLeaderTeamsWithMembersUrl + '&Date=' + Date;

        console.log(gangLeaderTeamsWithMembersUrl);
        $http.get(gangLeaderTeamsWithMembersUrl).then(
			function success(response) {
			    $scope.gangLeaderTeamsWithMembers = response.data;
			    //     console.log($scope.gangLeaderTeamsWithMembers);
			},
			function error(response) { });
    };



    //Add Element to list
    $scope.addElement = function (list) {
        if (list === 'lstButecEquipments') {
            var equip = {
                id_ForemanDailyReportEquipment: generateGuid(),
                isRented: false,
                type: 'IsButecEquipment',
                isNew: true
            };
            equip.equipmentNumber = $scope.eqptNum++;
            $scope.lstEquipments.push(equip);
            list = 'lstEquipments'
            //setTimeout(addEquipmentSelector(equip.id_ForemanDailyReportEquipment), 100);
        } else if (list === 'lstRentedEquipments') {
            var equip = {
                id_ForemanDailyReportEquipment: generateGuid(),
                isRented: true,
                type: 'IsRentedEquipment',
                isNew: true
            };
            equip.equipmentNumber = $scope.eqptNum++;
            $scope.lstEquipments.push(equip);
        } else if (list === 'lstActivities') {
            var activity = {
                id_ForemanDailyReportActivity: generateGuid(),
                //    id_ForemanDailyReport: $scope.foremanDailyReport.id_ForemanDailyReport,
            }
            activity.ActivityNumber = $scope.actNum++;
            $scope.lstActivities.push(activity);
        }
        setTimeout(function () {
            $scope.update(list)
        }, 100);
        console.log("Add Row");
    };


    //Remove Element from list
    $scope.removeElement = function (list, id) {
        //addEquipmentSelector($scope.lstEquipments[index].id_ForemanDailyReportEquipment);
        if (list === 'lstEquipments') {
            $scope.deletedEquipments.push(id);
            for (var index = 0; index < $scope.lstEquipments.length; index++) {
                if ($scope.lstEquipments[index].id_ForemanDailyReportEquipment === id) {
                    $scope.lstEquipments.splice(index, 1);
                    break;
                }
            }
            if ($scope.lstEquipments.length == 0)
                $scope.eqptNum = 1;

        } else if (list === 'lstActivities') {
            $scope.deletedActivities.push(id);
            $scope.deletedEquipments.push(id);
            for (var index = 0; index < $scope.lstActivities.length; index++) {
                if ($scope.lstActivities[index].id_ForemanDailyReportActivity === id) {
                    $scope.lstActivities.splice(index, 1);
                    break;
                }
            }
            if ($scope.lstActivities.length == 0)
                $scope.actNum = 1;
        }
        console.log(id);
    };


    //Add Selectors and time tickers
    $scope.update = function (list) {

        if (list === 'lstEquipments') {
            for (var i = 0; i < $scope.lstEquipments.length; i++) {
                if ($scope.lstEquipments[i].id_Equipement === undefined) {
                    addEquipmentSelector($scope.lstEquipments[i].id_ForemanDailyReportEquipment);
                }
            }
        } else if (list === 'lstActivities') {
            // addTimePicker();
        }
    };




    //Adds the selector option to the Equipment input box
    addEquipmentSelector = function (id) {
        console.log("Equip Selector id : " + id);
        $("#" + id).select2({
            placeholder: "Select an Equipment",
            minimumInputLength: 2,
            initSelection: true,
            closeOnSelect: true,
            ajax: {
                url: "/ExternalEmployees/GetAllEquipmentsByCriteriaInPoste",
                dataType: 'json',
                error: function () {
                    alert("Temporary error. Please try again...");
                },
                data: function (term, page) {
                    return {
                        id_Poste: $scope.foremanDailyReport.id_Poste,
                        criteria: term,
                        pageSize: 10,
                        pageNumber: page
                    };
                },
                results: function (data, page) {
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                        arr.push({
                            id: data[i].id_Equipement,
                            text: data[i].descriptionEquipement,
                        });
                    }
                    return {
                        results: arr
                    };
                }
            },
            formatResult: function (Composant) {
                return Composant.text;
            },
            formatSelection: function (Composant) {
                $scope.$apply(function () {
                    var i;
                    // alert("A");
                    for (i = 0; i < $scope.lstEquipments.length; i++) {
                        console.log(" I : " + i + "sssssssss, FEid === id : " + ($scope.lstEquipments[i].id_ForemanDailyReportEquipment === id) + ", EQ id = " + $scope.lstEquipments[i].id_Equipement);
                        if ($scope.lstEquipments[i].id_ForemanDailyReportEquipment === id) {
                            $scope.lstEquipments[i].id_Equipement = Composant.id;
                            console.log(" I : " + i + ", EQ id = " + $scope.lstEquipments[i].id_Equipement);
                            $http.get('/api/ExternalEmployees/GetAllComposantByEquipmentId?id_Equipement=' + Composant.id).then(
								function success(response) {
								    $scope.lstEquipments[i].lstComposant = response.data;
								},
								function error(response) { });
                            break;
                        }
                    }
                    if (i === $scope.lstEquipments.length)
                        alert("Equipment not found!");
                    else
                        console.log("Equipment Found");
                });
                return Composant.text;
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
    };

    //Gets the list of Projects by Criteria
    $("#projectCode").select2({
        placeholder: "Select a Project",
        minimumInputLength: 2,
        initSelection: true,
        closeOnSelect: true,
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
                        codePoste: data[i].codePoste,
                        libellePoste: data[i].libellePoste,
                        text: data[i].codePoste + " - " + data[i].libellePoste
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Project) {
            return Project.text;
        },
        formatSelection: function (Project) {
            if ($scope.editMode == false) {
                $scope.$apply(function () {
                    $scope.foremanDailyReport.id_Poste = Project.id;
                    $scope.projectName = Project.libellePoste;
                    $scope.projectSelected();
                });
            }
            // $scope.nomTiers = Supplier.text;
            return Project.codePoste;
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
//END of ForemanDailyReport




//#START OF Site Daily Reports Seach page
var siteReportSearchApp = angular.module('siteReportSearchApp', []);
siteReportSearchApp.controller('siteReportSearchController', function ($scope, $http) {
    //Define variables
    $scope.siteReports;

    $scope.currentPage = 1;
    $scope.pageSize = '10';

    $scope.searchCriteria = '';

    //Fetch External Employees by criteria
    $scope.search = function () {
        $http.get("/api/ExternalEmployees/FindSiteDailyReports?Criteria=" + $scope.searchCriteria).then(
			function success(response) {
			    $scope.siteReports = response.data;
			    var i = 0;
			    for (i = 0; i < $scope.siteReports.length; i++) {
			        var item = $scope.siteReports[i];
			        item.Date = formatDate(item.Date);
			    }
			    //     console.log($scope.searchCriteria);
			    hideLoader();
			},
			function error(response) {
			    alert("Failed to get Site Daily Reports"); //!\nStatus: " + response.statusText + "\nData: " + response.data);
			    console.log("Failed to get Site Daily Reports!\nStatus: " + response.statusText + "\nData: " + response.data);
			    hideLoader();
			});
    };

    $scope.search();


    //REVIEW
    $scope.act_edit = function (ReportId) {
        window.location.href = "/ExternalEmployees/EditSiteDailyReport?ReportId=" + ReportId;
    }
    $scope.act_generateReport = function (ReportId) {
        window.open('/ExternalEmployees/SiteDailyReportFilledPrintable?id_SiteDailyReport=' + ReportId, '_blank');
    }

    $scope.numberOfPages = function () {
        if ($scope.siteReports == null)
            return 1;

        var count = Math.ceil($scope.siteReports.length / $scope.pageSize);
        if (count == 0)
            count++;

        if ($scope.currentPage > count)
            $scope.currentPage = count;

        return count;
    };
});
//#END OF Site Daily Reports Seach page




//#START OF Site Daily Report PAGE
var siteDailyRptApp = angular.module('siteDailyRptApp', []);
siteDailyRptApp.controller('siteDailyRptController', function ($scope, $http) {


    $scope.editMode = false;

    //Working conditions list
    $scope.lstWorkConditions;
    //Weather conditions list
    $scope.lstWeatherConditions;
    //list of possible unites
    $scope.lstUnits;



    //All Site Report Info
    $scope.siteDailyReportInfo = {};
    //Basic Site Report Info
    $scope.siteDailyReport;
    //Work shifts list
    $scope.siteDailyReportWorkShiftList = [];
    //Activities list
    $scope.siteActivitySummaryList = [];
    //Employee Labor list
    $scope.activityEmployeeLaborList = [];
    //Employee Staff list
    $scope.activityEmployeeStaffList = [];
    //Correspondance received and sent
    $scope.siteOutputCorrespondancesList = [];
    $scope.siteInputCorrespondancesList = [];
    //Idle Equipment list
    $scope.siteIdleEquipmentList = [];
    //Idle Equipment list
    $scope.siteUsedEquipmentList = [];
    //Delivered Material
    $scope.siteMaterialList = [];

    //DeletedItems
    $scope.deletedWorkShifts = [];
    $scope.deletedUsedEquipments = [];
    $scope.deletedIdleEquipments = [];
    $scope.deletedMaterialEquipments = [];


    //Selected project name
    $scope.projectName;

    //Add Element to list
    $scope.addElement = function (list) {
        if (list === 'siteDailyReportWorkShiftList') {
            $scope.siteDailyReportWorkShiftList.push({
                id_SiteDailyReportWorkShift: generateGuid(),
                // id_SiteDailyReport: $scope.siteDailyReport.id_SiteDailyReport
            });
        } else if (list == 'siteUsedEquipmentList') {
            $scope.siteUsedEquipmentList.push({
                id_SiteDailyReportUsedEquipment: generateGuid(),            
                isNew:true,
                //id_SiteDailyReport: $scope.siteDailyReport.id_SiteDailyReport
            });
        } else if (list == 'siteIdleEquipmentList') {
            $scope.siteIdleEquipmentList.push({
                id_SiteDailyReportIdleEquipment: generateGuid(),
                isNew: true,
                // id_SiteDailyReport: $scope.siteDailyReport.id_SiteDailyReport
            });
            var index = $scope.siteIdleEquipmentList.length;
            setTimeout(function () {
                addEquipmentSelector($scope.siteIdleEquipmentList[index - 1].id_SiteDailyReportIdleEquipment, index - 1);
            }, 100);
        } else if (list == 'siteMaterialList') {
            $scope.siteMaterialList.push({
                id_SiteDailyReportDeliveredMaterial: generateGuid(),
                isNew: true,
                //id_SiteDailyReport: $scope.siteDailyReport.id_SiteDailyReport
            });
        }

        setTimeout(function () {
            $scope.update(list)
        }, 100);
        //  console.log("Add Row");
    };


    //Remove Element from list
    $scope.removeElement = function (list, index) {
        //addEquipmentSelector($scope.lstEquipments[index].id_ForemanDailyReportEquipment);
        if (list === 'siteDailyReportWorkShiftList') {
            var id = $scope.siteDailyReportWorkShiftList[index].id_SiteDailyReportWorkShift;
            $scope.siteDailyReportWorkShiftList.splice(index, 1);
            $scope.deletedWorkShifts.push(id);
        } else if (list === 'siteUsedEquipmentList') {
            var id = $scope.siteUsedEquipmentList[index].id_SiteDailyReportUsedEquipment;
            $scope.siteUsedEquipmentList.splice(index, 1);
            $scope.deletedUsedEquipments.push(id);
        } else if (list === 'siteIdleEquipmentList') {
            var id = $scope.siteIdleEquipmentList[index].id_SiteDailyReportIdleEquipment;
            $scope.siteIdleEquipmentList.splice(index, 1);
            $scope.deletedIdleEquipments.push(id);

        } else if (list === 'siteMaterialList') {
            var id = $scope.siteMaterialList[index].id_SiteDailyReportDeliveredMaterial;
            $scope.siteMaterialList.splice(index, 1);
            $scope.deletedMaterialEquipments.push(id);
        }
    };


    //Add Selectors and time tickers
    $scope.update = function (list) {
        if (list === 'siteDailyReportWorkShiftList') {
            addTimePicker();
        }
    };


    //Fill lstWorkConditions
    $http.get('/api/ExternalEmployees/GetAllWorkConditions').then(
		function success(response) {
		    $scope.lstWorkConditions = response.data;
		},
		function error(response) {
		    alert("Failed to get Work Conditions!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
		    console.log("Failed to get Work Conditions!\nStatus: " + response.statusText + "\nData: " + response.data);
		});

    //Fill lstWeatherConditions
    $http.get('/api/ExternalEmployees/GetAllWeatherConditions').then(
		function success(response) {
		    $scope.lstWeatherConditions = response.data;
		},
		function error(response) {
		    alert("Failed to get Weather conditions!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
		    console.log("Failed to get Weather conditions!\nStatus: " + response.statusText + "\nData: " + response.data);
		});

    //Get Unites
    $http.get('/api/ExternalEmployees/GetAllUnites').then(
		function success(response) {
		    hideLoader();
		    $scope.lstUnits = response.data;
		},
		function error(response) {
		    alert("Failed to get Units!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
		    console.log("Failed to get Units!\nStatus: " + response.statusText + "\nData: " + response.data);
		});




    //Gets the list of Projects by Criteria
    $scope.ReportId = $.QueryString["ReportId"];
    var url = '/api/ExternalEmployees/GetSiteDailyReportInfoById?id_SiteDailyReport=';
    url = url + $scope.ReportId;
    if (typeof $scope.ReportId != 'undefined') {
        $scope.editMode = true;
        $http.get(url).then(
			function success(response) {

			    var reportInfo = response.data;

			    //Site Daily Report
			    $scope.siteDailyReport = reportInfo.siteDailyReport;
			    $scope.siteDailyReport.Date = formatDate($scope.siteDailyReport.Date);
			    if ($scope.siteDailyReport.Status !== 'prp') {
			        document.getElementById('fieldset').disabled = true;
			    }
			    //Activities
			    $scope.siteActivitySummaryList = reportInfo.siteActivitySummaryList;

			    //WorkShifts
			    $scope.siteDailyReportWorkShiftList = reportInfo.siteDailyReportWorkShiftList;
			    for (var i = 0; i < $scope.siteDailyReportWorkShiftList.length; i++) {
			        var item = $scope.siteDailyReportWorkShiftList[i];
			        item.timeFrom = formatAMPM(item.timeFrom);
			        item.timeTo = formatAMPM(item.timeTo);
			    }


			    //Labor Employee
			    $scope.activityEmployeeLaborList = reportInfo.activityEmployeeLaborList;
			    //Staff Employee
			    $scope.activityEmployeeStaffList = reportInfo.activityEmployeeStaffList;

			    //Idle Equipment
			    $scope.siteIdleEquipmentList = reportInfo.siteIdleEquipmentList;
			    for(var i = 0; i < $scope.siteIdleEquipmentList.length; i++){
			        $scope.siteIdleEquipmentList[i].isNew = 'true';
			    }
			    //Used Equipment
			    $scope.siteUsedEquipmentList = reportInfo.siteUsedEquipmentList;

			    //Material
			    $scope.siteMaterialList = reportInfo.siteMaterialList;

			    //Input Corresspondance
			    $scope.siteInputCorrespondancesList = reportInfo.siteInputCorrespondancesList;
			    //Input Corresspondance
			    $scope.siteOutputCorrespondancesList = reportInfo.siteOutputCorrespondancesList;




			    $('#projectCode').select2('data', {
			        id: $scope.siteDailyReport.id_Poste,
			        codePoste: $scope.siteDailyReport.codePoste
			    });
			    //$('#supplier').select2('data', {
			    //    id: $scope.siteDailyReport.id_Tiers,
			    //    text: $scope.siteDailyReport.ContractorName
			    //});


			    hideLoader();


			    $http.get('/api/Common/GetLoggedInUser').then(
                   function success(response) {
                       $scope.loggedInUser = response.data;
                       console.log($scope.loggedInUser);

                       if ($scope.loggedInUser.MemberId != $scope.siteDailyReport.id_CreatedBy) {
                           //     console.log($scope.foremanDailyReport.Status);
                           document.getElementById('fieldset').disabled = true;
                           document.getElementById('submit').style.visibility = 'hidden';
                           document.getElementById('delete').style.visibility = 'hidden';

                       }
                       console.log($scope.loggedInUser.MemberId);
                       console.log($scope.siteDailyReport.id_CreatedBy);
                   },
                   function error(response) {
                       console.log("Failed to get logged in user");
                       console.log("Response : " + response);
                       console.log("Response Data : " + response.data);
                       console.log("Response Staus: " + response.statusText);
                       $scope.loggedInUser = null;
                   });
			},
			function error(response) {
			    alert("Failed to get Site Daily Report data!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
			    console.log("Failed to get Site Daily Report data!\nStatus: " + response.statusText + "\nData: " + response.data);
			});
    } else {
        $scope.editMode = false;
        $scope.siteDailyReport = {
            id_Poste: null,
            ReferenceNumber: null,
            Date: today(),
            Status: 'prp',
        };
        //Get ID Number
        $http.get('/api/ExternalEmployees/GenerateNewSiteReportRefNum').then(
			function success(response) {
			    $scope.siteDailyReport.ReferenceNumber = response.data;
			    document.getElementById("referenceNumber").disabled = true;
			},
			function error(response) {
			    console.log(response.statusText)
			});
        console.log("Missing Report Id!");
        hideLoader();
    }




    $scope.act_getReportData = function () {
        var myDate = new Date($scope.siteDailyReport.Date);

        myDate = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();

        console.log("Geting data");
        var url = '/api/ExternalEmployees/CollectSiteReportData'
        url = url + '?id_Poste=' + $scope.siteDailyReport.id_Poste;
        // url = url + '&id_Tiers=' + $scope.siteDailyReport.id_Tiers;
        url = url + '&Date=' + myDate;

        if ($scope.siteDailyReport.id_Poste == null || $scope.siteDailyReport.Date == '') { // || $scope.siteDailyReport.id_Tiers == null) {
            alert("Please Specify Project and Date!");
        } else {


            //Check that this report was not issued before
            var prevSiteReportUrl = '/api/ExternalEmployees/GetSiteDailyReportByIds?'
            prevSiteReportUrl = prevSiteReportUrl + 'id_Poste=' + $scope.siteDailyReport.id_Poste
            //   prevSiteReportUrl = prevSiteReportUrl + '&id_Tiers=' + $scope.siteDailyReport.id_Tiers;
            prevSiteReportUrl = prevSiteReportUrl + '&Date=' + myDate;

            var prevReport = null;
            $http.get(prevSiteReportUrl).then(
				function success(response) {
				    prevReport = response.data;

				    if (prevReport != null) {
				        if (confirm("This Report has been generated before. Do you want to edit it?")) {
				            window.location.href = "/ExternalEmployees/EditSiteDailyReport?ReportId=" + prevReport.id_SiteDailyReport;
				        } else {
				            document.getElementById('submit').style.visibility = 'hidden';
				            document.getElementById('generalInfo').style.visibility = 'hidden';
				            document.getElementById('activitySummary').style.visibility = 'hidden';
				            document.getElementById('employeeSummary').style.visibility = 'hidden';
				            document.getElementById('equipmentSummary').style.visibility = 'hidden';
				            document.getElementById('correspondances').style.visibility = 'hidden';
				            return;
				        }
				    } else {
				        document.getElementById('submit').style.visibility = 'visible';
				        document.getElementById('generalInfo').style.visibility = 'visible';
				        document.getElementById('activitySummary').style.visibility = 'visible';
				        document.getElementById('employeeSummary').style.visibility = 'visible';
				        document.getElementById('equipmentSummary').style.visibility = 'visible';
				        document.getElementById('correspondances').style.visibility = 'visible';
				        return;
				    }
				},
				function error(response) { });



            $http.get(url).then(
				function success(response) {
				    $scope.siteDailyReportInfo = response.data;

				    $scope.siteDailyReport.id_SiteDailyReport = $scope.siteDailyReportInfo.siteDailyReport.id_SiteDailyReport;
				    $scope.siteActivitySummaryList = $scope.siteDailyReportInfo.siteActivitySummaryList;
				    $scope.activityEmployeeLaborList = $scope.siteDailyReportInfo.activityEmployeeLaborList;
				    $scope.activityEmployeeStaffList = $scope.siteDailyReportInfo.activityEmployeeStaffList;
				    $scope.siteUsedEquipmentList = $scope.siteDailyReportInfo.siteUsedEquipmentList;
				    $scope.siteInputCorrespondancesList = $scope.siteDailyReportInfo.siteInputCorrespondancesList;
				    $scope.siteOutputCorrespondancesList = $scope.siteDailyReportInfo.siteOutputCorrespondancesList;

				    console.log($scope.siteUsedEquipmentList);
				    $scope.siteDailyReportInfo.siteDailyReport = $scope.siteDailyReport;

				    document.getElementById('submit').style.visibility = 'visible';
				},
				function error(response) {
				    alert("Failed to collect Site Daily Report!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
				    console.log("Failed to collect Site Daily Report!\nStatus: " + response.statusText + "\nData: " + response.data);
				}
			);
        }
    };


    //Update
    $scope.act_saveContDailyRpt = function () {
        if ($scope.editMode == true) {
            console.log($scope.siteDailyReport);
            $scope.siteDailyReportInfo.siteDailyReport = $scope.siteDailyReport;
            $scope.siteDailyReportInfo.siteActivitySummaryList = $scope.siteActivitySummaryList;
            $scope.siteDailyReportInfo.activityEmployeeLaborList = $scope.activityEmployeeLaborList;
            $scope.siteDailyReportInfo.activityEmployeeStaffList = $scope.activityEmployeeStaffList;
            $scope.siteDailyReportInfo.siteDailyReportWorkShiftList = $scope.siteDailyReportWorkShiftList;
            $scope.siteDailyReportInfo.siteIdleEquipmentList = $scope.siteIdleEquipmentList;
            $scope.siteDailyReportInfo.siteUsedEquipmentList = $scope.siteUsedEquipmentList;
            $scope.siteDailyReportInfo.siteMaterialList = $scope.siteMaterialList;



            console.log($scope.siteDailyReportInfo);


            //Delete removed items
            if ($scope.deletedWorkShifts.length > 0)
                $http.post("/api/ExternalEmployees/DeleteSiteDailyReportWorkShifts ", $scope.deletedWorkShifts).then(
					function success(response) {
					    console.log(response.data);
					},
					function error(response) {
					    alert("Failed to delete Site Daily Report Workshifts!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
					    console.log("Failed to delete Site Daily Report Workshifts!\nStatus: " + response.statusText + "\nData: " + response.data);
					});
            if ($scope.deletedUsedEquipments.length > 0)
                $http.post("/api/ExternalEmployees/DeleteSiteDailyReportUsedEquipments ", $scope.deletedUsedEquipments).then(
					function success(response) {
					    console.log(response.data);
					},
					function error(response) {
					    alert("Failed to delete Site Daily Report Used equipments!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
					    console.log("Failed to delete Site Daily Report Used equipments!\nStatus: " + response.statusText + "\nData: " + response.data);
					});
            if ($scope.deletedIdleEquipments.length > 0)
                $http.post("/api/ExternalEmployees/DeleteSiteDailyReportIdleEquipments ", $scope.deletedIdleEquipments).then(
					function success(response) {
					    console.log(response.data);
					},
					function error(response) {
					    alert("Failed to delete Site Daily Report Idle equipments!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
					    console.log("Failed to delete Site Daily Report Idle equipments!\nStatus: " + response.statusText + "\nData: " + response.data);
					});
            if ($scope.deletedMaterialEquipments.length > 0)
                $http.post("/api/ExternalEmployees/DeleteSiteDailyReportDeliveredMaterials ", $scope.deletedMaterialEquipments).then(
					function success(response) {
					    console.log(response.data);
					},
					function error(response) {
					    alert("Failed to delete Site Daily Report Delivered material!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
					    console.log("Failed to delete Site Daily Report Delivered material!\nStatus: " + response.statusText + "\nData: " + response.data);
					});



            console.log($scope.siteDailyReportInfo);
            //Update Site Daily Report
            $http.post("/api/ExternalEmployees/UpdateSiteDailyReportInfo ", $scope.siteDailyReportInfo).then(
				function success(response) {
				    alert("Site Report updated!");
				    //   console.log(response.data);
				    window.location.href = "/ExternalEmployees/SearchSiteDailyReport";
				    //    location.reload();
				},
				function error(response) {
				    alert("Failed to update Site Daily Report!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
				    console.log("Failed to update Site Daily Report!\nStatus: " + response.statusText + "\nData: " + response.data);
				});
        } else {
            $scope.siteDailyReportInfo.siteDailyReport = $scope.siteDailyReport;
            $scope.siteDailyReportInfo.siteActivitySummaryList = $scope.siteActivitySummaryList;
            $scope.siteDailyReportInfo.activityEmployeeLaborList = $scope.activityEmployeeLaborList;
            $scope.siteDailyReportInfo.activityEmployeeStaffList = $scope.activityEmployeeStaffList;
            $scope.siteDailyReportInfo.siteDailyReportWorkShiftList = $scope.siteDailyReportWorkShiftList;
            $scope.siteDailyReportInfo.siteIdleEquipmentList = $scope.siteIdleEquipmentList;
            $scope.siteDailyReportInfo.siteUsedEquipmentList = $scope.siteUsedEquipmentList;
            $scope.siteDailyReportInfo.siteMaterialList = $scope.siteMaterialList;




            console.log($scope.siteDailyReportInfo);
            $http.post("/api/ExternalEmployees/AddSiteDailyReportInfo ", $scope.siteDailyReportInfo).then(
				function success(response) {
				    alert("Site Report added!");
				    //   console.log(response.data);
				    window.location.href = "/ExternalEmployees/SearchSiteDailyReport";
				},
				function error(response) {
				    alert("Failed to Add Site Daily Report Data!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
				    console.log("Failed to Add Site Daily Report Data!\nStatus: " + response.statusText + "\nData: " + response.data);
				});
        }
    }




    //delete a site daily report
    $scope.act_deleteSiteDailyReport = function () {
        var url = '/api/ExternalEmployees/DeleteSiteDailyReport';
        url += '?id_SiteDailyReport=' + $scope.siteDailyReport.id_SiteDailyReport;
        if (confirm("Are you sure you want to delete this report?")) {
            $http.post(url, $scope.siteDailyReport.id_SiteDailyReport).then(function success(response) {
                //alert("Report Deleted!");
                window.location.href = "/ExternalEmployees/SearchSiteDailyReport"
            },
				function error(response) {
				    alert("Failed to delete Report!"); //\nStatus: " + response.statusText + "\nData: " + response.data);
				    console.log("Failed to delete Report!\nStatus: " + response.statusText + "\nData: " + response.data);
				});
        }
    };




    //Adds the selector option to the Equipment input box
    addEquipmentSelector = function (id, index) {
        console.log(id);
        //console.log(index);
        $("#" + id).select2({
            placeholder: "Select an Equipment",
            minimumInputLength: 2,
            initSelection: true,
            closeOnSelect: true,
            ajax: {
                url: "/ExternalEmployees/GetAllEquipmentsByCriteriaInPoste",
                dataType: 'json',
                error: function () {
                    alert("Temporary error. Please try again...");
                },
                data: function (term, page) {
                    return {
                        id_Poste: $scope.siteDailyReport.id_Poste,
                        criteria: term,
                        pageSize: 10,
                        pageNumber: page
                    };
                },
                results: function (data, page) {
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                        arr.push({
                            id: data[i].id_Equipement,
                            text: data[i].descriptionEquipement,
                        });
                    }
                    return {
                        results: arr
                    };
                }
            },
            formatResult: function (Composant) {
                return Composant.text;
            },
            formatSelection: function (Composant) {
                $scope.$apply(function () {
                    //       console.log("Apply");
                    //       console.log(index);
                    if ($scope.siteIdleEquipmentList[index].id_SiteDailyReportIdleEquipment === id) {
                        $scope.siteIdleEquipmentList[index].id_Equipement = Composant.id;
                        $scope.siteIdleEquipmentList[index].lstComposant = [];
                        //        console.log($scope.siteIdleEquipmentList[index]);
                        $http.get('/api/ExternalEmployees/GetAllComposantByEquipmentId?id_Equipement=' + Composant.id).then(
							function success(response) {
							    console.log(response.data);
							    $scope.siteIdleEquipmentList[index].lstComposant = response.data;
							},
							function error(response) { });
                    } else
                        console.log("Componsant Found");

                });
                return Composant.text;
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
    };

    $("#projectCode").select2({
        placeholder: "Select a Project",
        initSelection: true,
        minimumInputLength: 2,
        closeOnSelect: true,
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
                        codePoste: data[i].codePoste,
                        libellePoste: data[i].libellePoste,
                        text: data[i].codePoste + " - " + data[i].libellePoste
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Project) {
            return Project.text;
        },
        formatSelection: function (Project) {
            if ($scope.editMode == false)
                $scope.$apply(function () {
                    $scope.siteDailyReport.id_Poste = Project.id;
                    $scope.projectName = Project.libellePoste;
                    //$scope.projectSelected();   

                });
            return Project.codePoste;
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

    //$("#supplier").select2({
    //    placeholder: "Select a Contractor",
    //    initSelection: true,
    //    minimumInputLength: 2,
    //    closeOnSelect: true,
    //    ajax: {
    //        url: "/ExternalEmployees/FindTierNonPersonne",
    //        dataType: 'json',
    //        error: function () {
    //            alert("Temporary error. Please try again...");
    //        },
    //        data: function (term, page) {
    //            return {
    //                criteria: term,
    //                pageSize: 10,
    //                pageNumber: page
    //            };
    //        },
    //        results: function (data, page) {
    //            var arr = [];
    //            for (var i = 0; i < data.length; i++) {
    //                arr.push({
    //                    id: data[i].id_tiers,
    //                    text: data[i].nomTiers,
    //                });
    //            }
    //            return {
    //                results: arr
    //            };
    //        }
    //    },
    //    formatResult: function (Supplier) {
    //        return Supplier.text;
    //    },
    //    formatSelection: function (Supplier) {
    //        $scope.siteDailyReport.id_Tiers = Supplier.id;
    //        $scope.nomTiers = Supplier.text;
    //        return Supplier.text;
    //    },
    //    dropdownCssClass: "bigdrop",
    //    escapeMarkup: function (m) {
    //        return m;
    //    },
    //    formatNoMatches: function () {
    //        return "No Matches Found";
    //    },
    //    formatInputTooShort: function (input, min) {
    //        var n = min - input.length;
    //        return "Please Enter " + (n == 1 ? "1 more Character" : (n + " more Characters"));
    //    },
    //    formatLoadMore: function (pageNumber) {
    //        return "Loading More Results";
    //    },
    //    formatSearching: function () {
    //        return "Searching";
    //    },
    //});
});
//END OF  Site Daily Report PAGE




//Prinable Report Pages:
var printableReportPagesApp = angular.module('printableReportPagesApp', []);
printableReportPagesApp.controller('printableReportPagesController', function ($scope, $http) {

    $scope.projectName = '';
    $scope.projectId = '';
    $scope.date = '';
    $scope.id_Tiers = '';
    $scope.lstForeman = [];
    $scope.foremanId = '';

    $scope.personId = '';
    $scope.dateFrom = '';
    $scope.dateTo = '';

    $scope.link = '';

    //Only For Manpower Daily Report
    $scope.manpowerData = [];
    $scope.lstTypePersonne = [];
    $scope.manpowerOrigData = [];


    $scope.act_generateReport = function (title) {
        if (title == 'Manpower Daily Report') {

            //document.getElementById('dateOfToday').value = today();
            $scope.dateOfToday = today();


            console.log("Loading");
            showLoader();
            var url = '/api/ExternalEmployees/GetManpowerDailyReport';
            url += '?id_Poste=' + $scope.projectId;
            url += '&DateStart=' + $scope.dateFrom;
            if ($scope.dateTo == '')
                url += '&DateEnd=' + $scope.dateFrom;
            else
                url += '&DateEnd=' + $scope.dateTo;

            $http.get(url).then(
				function success(response) {
				    console.log("Successfully loaded");

				    //reset data
				    $scope.manpowerData = [];
				    $scope.lstTypePersonne = [];
				    $scope.manpowerOrigData = [];

				    //console.log(response.data);
				    var res = response.data;
				    //Parse data for easy reading in angular ngrepeat
				    $scope.manpowerOrigData = response.data;
				    if ($scope.manpowerOrigData.length > 0)
				        $scope.lstTypePersonne = $scope.manpowerOrigData[0].lstTypePersonne;

				    for (var i = 0; i < res.length; i++) {
				        var item = res[i];

				        for (var j = 0; j < item.lstDescriptionSpecialiteFonction.length; j++) {
				            var manpowerItem = {};
				            manpowerItem.titreFonction = item.titreFonction;
				            manpowerItem.totalManhours = item.totalManhours;
				            manpowerItem.totalMandays = item.totalMandays;
				            manpowerItem.specialityLength = item.lstDescriptionSpecialiteFonction.length;


				            var spec = item.lstDescriptionSpecialiteFonction[j];
				            manpowerItem.id = generateGuid();
				            manpowerItem.speciality = spec;
				            manpowerItem.specialityIndex = j;

				            manpowerItem.employeeCounts = item.employeeCounts[spec];
				            $scope.manpowerData.push(manpowerItem);
				        }
				    }
				    document.getElementById('manpowerPanel').style.visibility = 'visible';
				    hideLoader();
				},
				function error(response) {
				    alert("Couldn't Load Data!");
				    hideLoader();
				}
			);

        } else if (title == 'Site Daily Report')
            $scope.link = '/ExternalEmployees/SiteDailyReportPrintable?id_Poste=' + $scope.projectId + '&Date=' + $scope.date; // + '&id_Tiers=' + $scope.id_Tiers;
        else if (title == 'Foreman Daily Report')
            $scope.link = '/ExternalEmployees/ForemanDailyReportPrintable?id_Poste=' + $scope.projectId + '&id_Foreman=' + $scope.foremanId + '&Date=' + $scope.date;
        else if (title == 'Employee Attendance Line Report')
            $scope.link = '/ExternalEmployees/EmployeeAttendanceLinePrintable?id_Personne=' + $scope.personId + '&StartDate=' + $scope.dateFrom + '&EndDate=' + $scope.dateTo;
        else if (title == 'Idle Employees Report')
            $scope.link = '/ExternalEmployees/IdleEmployeesPrintable?id_Poste=' + $scope.projectId + '&Date=' + $scope.date;

    };

    //Gets the list of Projects by Criteria
    $("#projectCode").select2({
        placeholder: "Select a Project",
        minimumInputLength: 2,
        initSelection: true,
        closeOnSelect: true,
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
                        codePoste: data[i].codePoste,
                        libellePoste: data[i].libellePoste,
                        text: data[i].codePoste + " - " + data[i].libellePoste
                    });
                }
                return {
                    results: arr
                };
            }
        },
        formatResult: function (Project) {
            return Project.text;
        },
        formatSelection: function (Project) {
            $scope.$apply(function () {
                $scope.projectId = Project.id;
                $scope.projectName = Project.libellePoste;
                $scope.projectSelected();
            });
            return Project.codePoste;
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


    $scope.projectSelected = function () {
        //   console.log("Changed");
        if ($scope.date == '' || $scope.projectId == '')
            return;
        var url = '/api/ExternalEmployees/GetAllForemenInProject?';
        url = url + 'id_poste=' + $scope.projectId;
        url = url + '&Date=' + $scope.date;
        $http.get(url).then(
			function success(response) {
			    $scope.lstForeman = response.data;
			},
			function error(response) { });
    };


    $("#personId").select2({
        placeholder: "Select an Employee",
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
                        text: data[i].FullName + " -- " + data[i].CodePersonne,
                        CodePersonne: data[i].CodePersonne,
                        FullName: data[i].FullName,
                        FatherName: data[i].FatherName,
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
                $scope.personId = Member.id;
            });
            return Member.FullName;
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

    //$("#supplier").select2({
    //    placeholder: "Select a Contractor",
    //    initSelection: true,
    //    minimumInputLength: 2,
    //    closeOnSelect: true,
    //    ajax: {
    //        url: "/ExternalEmployees/FindTierNonPersonne",
    //        dataType: 'json',
    //        error: function () {
    //            alert("Temporary error. Please try again...");
    //        },
    //        data: function (term, page) {
    //            return {
    //                criteria: term,
    //                pageSize: 10,
    //                pageNumber: page
    //            };
    //        },
    //        results: function (data, page) {
    //            var arr = [];
    //            for (var i = 0; i < data.length; i++) {
    //                arr.push({
    //                    id: data[i].id_tiers,
    //                    text: data[i].nomTiers,
    //                });
    //            }
    //            return {
    //                results: arr
    //            };
    //        }
    //    },
    //    formatResult: function (Supplier) {
    //        return Supplier.text;
    //    },
    //    formatSelection: function (Supplier) {
    //        $scope.id_Tiers = Supplier.id;
    //        return Supplier.text;
    //    },
    //    dropdownCssClass: "bigdrop",
    //    escapeMarkup: function (m) {
    //        return m;
    //    },
    //    formatNoMatches: function () {
    //        return "No Matches Found";
    //    },
    //    formatInputTooShort: function (input, min) {
    //        var n = min - input.length;
    //        return "Please Enter " + (n == 1 ? "1 more Character" : (n + " more Characters"));
    //    },
    //    formatLoadMore: function (pageNumber) {
    //        return "Loading More Results";
    //    },
    //    formatSearching: function () {
    //        return "Searching";
    //    },
    //});
});

//Common Functions:
//Get formatted date
function formatDate(date) {
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


function pause(milliseconds) {
    var dt = new Date();
    while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}