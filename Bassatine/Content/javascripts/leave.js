var leaveRequestApp = angular.module('leaveRequestApp', []);

leaveRequestApp.controller('LeaveTypesController', function ($scope, $http) {
    showLoader();
    $scope.leaveTypes;
    $scope.newLeaveType;
    $scope.editLeaveType;

    $http.get('/api/LeaveTypes').then(
        function success(response) {
            $scope.leaveTypes = response.data;
            hideLoader();
        },
        function error(response) {
            showRequestErrorMessage(response);
        });

    $scope.add = function () {
        $http.post('/api/LeaveTypes', $scope.newLeaveType).then(
        function success(response) {
            $scope.leaveTypes = response.data;
            $scope.newLeaveType = null;
            $('#addLeaveTypeModal').modal('hide');
        },
        function error(response) {
            showRequestErrorMessage(response);
        });
    };

    $scope.delete = function (typeId) {
        var url = '/api/LeaveTypes?Id=' + typeId;
        if (confirm("Please confirm?")) {
            $http({
                method: 'DELETE',
                url: url
            }).then(
            function success(response) {
                $scope.leaveTypes = response.data;
            },
            function error(response) {
                showRequestErrorMessage(response);
            });
        }
    };

    $scope.edit = function (typeId) {
        for (i = 0 ; i < $scope.leaveTypes.length; i++) {
            var item = $scope.leaveTypes[i];
            if (item.LeaveTypeId == typeId) {
                $scope.editLeaveType = item;
                break;
            }
        }
    };

    $scope.update = function () {
        $http.post('/api/LeaveTypes', $scope.editLeaveType).then(
        function success(response) {
            $scope.leaveTypes = response.data;
            $scope.editLeaveType = null;
            $('#editLeaveTypeModal').modal('hide');
        },
        function error(response) {
            showRequestErrorMessage(response);
        });
    };
});

leaveRequestApp.controller('LeaveCountriesController', function ($scope, $http) {
    showLoader();
    $scope.leaveCountries;
    $scope.newLeaveCountry;
    $scope.editLeaveCountry;

    $http.get('/api/LeaveCountries').then(
        function success(response) {
            $scope.leaveCountries = response.data;
            hideLoader();
        },
        function error(response) {
            showRequestErrorMessage(response);
        });

    $scope.add = function () {
        $http.post('/api/LeaveCountries', $scope.newLeaveCountry).then(
        function success(response) {
            $scope.leaveCountries = response.data;
            $scope.newLeaveCountry = null;
            $('#addLeaveCountryModal').modal('hide');
        },
        function error(response) {
            showRequestErrorMessage(response);
        });
    };

    $scope.delete = function (typeId) {
        var url = '/api/LeaveCountries?Id=' + typeId;
        if (confirm("Please confirm?")) {
            $http({
                method: 'DELETE',
                url: url
            }).then(
            function success(response) {
                $scope.leaveCountries = response.data;
            },
            function error(response) {
                showRequestErrorMessage(response);
            });
        }
    };

    $scope.edit = function (typeId) {
        for (i = 0 ; i < $scope.leaveCountries.length; i++) {
            var item = $scope.leaveCountries[i];
            if (item.LeaveTicketCountryId == typeId) {
                $scope.editLeaveCountry = item;
                break;
            }
        }
    };

    $scope.update = function () {
        $http.post('/api/LeaveCountries', $scope.editLeaveCountry).then(
        function success(response) {
            $scope.leaveCountries = response.data;
            $scope.editLeaveCountry = null;
            $('#addArticlesModal').modal('hide');
        },
        function error(response) {
            showRequestErrorMessage(response);
        });
    };
});

leaveRequestApp.controller('LeaveRequestEditController', function ($scope, $http) {
    showLoader();
    $scope.id = $.QueryString["id"];

    $scope.behalfOfStaff;
    $scope.employees;
    $scope.leaveTypes;
    $scope.newLeaveRequest =
        {
            WorkflowId: '00000000-0000-0000-0000-000000000000',
            PersonneId: '00000000-0000-0000-0000-000000000000',
            Leaves: new Array(),
            Comments: new Array()
        };
    $scope.workflowActions = new Array();
    $scope.countries;

    // Get Behalf Of
    $http.get('/api/Leaves/Members/BehalfOf').then(
        function success(response) {
            $scope.behalfOfStaff = response.data;

            // Get Leave Types
            $http.get('/api/LeaveCountries').then(
                function success(response) {
                    $scope.countries = response.data;

                    // Get Leave Types
                    $http.get('/api/LeaveTypes').then(
                        function success(response) {
                            $scope.leaveTypes = response.data;

                            // Get Leave Info
                            if (typeof $scope.id != 'undefined') {
                                $http.get('/api/Leaves?id=' + $scope.id).then(
                                function success(response) {
                                    $scope.newLeaveRequest = response.data;

                                    //Get replacing Perons
                                    $scope.getContact();

                                    // Retrieve the Task Actions
                                    if ($scope.newLeaveRequest.WorkflowId != '00000000-0000-0000-0000-000000000000') {
                                        $http.get('/api/Leaves/Workflow/Actions?workflowId=' + $scope.newLeaveRequest.WorkflowId).then(
                                        function success(response) {
                                            $scope.workflowActions = response.data;
                                            hideLoader();
                                        },
                                        function error(response) {
                                            showRequestErrorMessage(response);
                                        });
                                    }

                                    // Retrieve the Full Name of the replacement
                                    if ($scope.newLeaveRequest.PersonneReplacingId != '00000000-0000-0000-0000-000000000000') {
                                        $http.get('/api/Leaves/Members?id=' + $scope.newLeaveRequest.PersonneReplacingId).then(
                                            function success(response) {
                                                $scope.newLeaveRequest.PersonneReplacingName = response.data.FullName;
                                            },
                                            function error(response) {
                                                showRequestErrorMessage(response);
                                            });
                                    }

                                    // Retrieve the Full Name of the Behalf of
                                    if ($scope.newLeaveRequest.IsOnBehaldOf) {
                                        $http.get('/api/Leaves/Members?id=' + $scope.newLeaveRequest.PersonneId).then(
                                        function success(response) {
                                            $scope.newLeaveRequest.PersonName = response.data.FullName;
                                        },
                                        function error(response) {
                                            showRequestErrorMessage(response);
                                        });
                                    }
                                },
                                function error(response) {
                                    showRequestErrorMessage(response);
                                });
                            }
                            else {
                                //Get replacing Perons
                                $scope.getContact();

                                hideLoader();
                            }
                        },
                        function error(response) {
                            showRequestErrorMessage(response);
                        });
                });
        },
        function error(response) {
            showRequestErrorMessage(response);
        });

    $scope.getLeaveTypeName = function (leaveTypeId) {
        for (i = 0 ; i < $scope.leaveTypes.length; i++) {
            var item = $scope.leaveTypes[i];
            if (item.LeaveTypeId == leaveTypeId)
                return item.LeaveTypeDescription;
        }
    };
   
    $scope.getContact = function () {
        if (!$scope.newLeaveRequest.IsOnBehaldOf) {
            $http.get('/api/Leaves/Members/ContactMe').then(
            function success(response) {
                $scope.employees = response.data;
            },
            function error(response) {
                showRequestErrorMessage(response);
            });
        }
        else {
            var memberId = $scope.newLeaveRequest.PersonneId;
            $http.get('/api/Leaves/Members/Contact?memberId=' + memberId).then(
            function success(response) {
                $scope.employees = response.data;
            },
            function error(response) {
                showRequestErrorMessage(response);
            });
        }
    }

    $scope.addLeave = function () {
        // Add Leave
        var validationMessage = '';

        if (isEmpty($('#ddlLeaveType').val()))
            validationMessage = validationMessage + 'Leave type is missing\n';

        if (isEmpty($('#txtStartDate').val()))
            validationMessage = validationMessage + 'Start date is empty\n';
        if (isEmpty($('#txtEndDate').val()))
            validationMessage = validationMessage + 'End date is empty\n';

        if (Date.parse($('#txtStartDate').val()) > Date.parse($('#txtEndDate').val()))
            validationMessage = validationMessage + 'End date should be greater than start date\n';

        if (isEmpty($('#txtReason').val()))
        {
            for (i = 0 ; i < $scope.leaveTypes.length; i++) {
                var item = $scope.leaveTypes[i];
                if (item.LeaveTypeId == $('#ddlLeaveType').val()) {
                    if (item.IsReasonMandatory) {
                        validationMessage = validationMessage + 'Leave reason is empty\n';
                    }
                }
            }
        }

        var sDate = Date.parse($('#txtStartDate').val());
        var eDate = Date.parse($('#txtEndDate').val());
        for (i = 0 ; i < $scope.newLeaveRequest.Leaves.length; i++) {
            var item = $scope.newLeaveRequest.Leaves[i];
            
            var sIDate = Date.parse(item.LeaveStartDate);
            var eIDate = Date.parse(item.LeaveEndDate);

            if (sDate >= sIDate && sDate <= eIDate) {
                validationMessage = validationMessage + 'Leave dates are overlapping\n';
                continue;
            }
            else if (eDate >= sIDate && eDate <= eIDate) {
                validationMessage = validationMessage + 'Leave dates are overlapping\n';
                continue;
            }
            else if (sIDate >= sDate && sIDate <= eDate) {
                validationMessage = validationMessage + 'Leave dates are overlapping\n';
                continue;
            }
            else if (eIDate >= sDate && eIDate <= eDate) {
                validationMessage = validationMessage + 'Leave dates are overlapping\n';
                continue;
            }
        }

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }

        var isPastDate = sDate < new Date();
        var shouldContinue = true;
        if (isPastDate)
            shouldContinue = confirm('You are entering past dates, are you sure you want to continue?');
        
        if (shouldContinue) {
            // Save Leave
            var ddl = $('#ddlLeaveMode').val()
            var leaveRate;
            var leaveDayPeriod;
            if (ddl == 'Full Day') {
                leaveRate = '1';
                leaveDayPeriod = '';
            }
            else if (ddl == 'Morning') {
                leaveRate = '0.5';
                leaveDayPeriod = 'AM';
            }
            else if (ddl == 'Afternoon') {
                leaveRate = '0.5';
                leaveDayPeriod = 'PM';
            }

            var newLeave = {
                LeaveId: guid(),
                LeaveTypeId: $('#ddlLeaveType').val(),
                LeaveStartDate: $('#txtStartDate').val(),
                LeaveEndDate: $('#txtEndDate').val(),
                LeaveRequestReason: $('#txtReason').val(),
                LeaveRate: leaveRate,
                LeaveDayPeriod: leaveDayPeriod,
                UIMode: $('#ddlLeaveMode').val()
            };

            $('#ddlLeaveMode').val("Full Day");
            //$('#ddlLeaveType').val("");
            $('#txtStartDate').val("");
            $('#txtEndDate').val("");
            $('#txtReason').val("");

            // Fill the leave Days
            var url = '/api/Leaves/VacationDays?personId=' + $scope.newLeaveRequest.PersonneId + '&fromDate=' + newLeave.LeaveStartDate + '&toDate=' + newLeave.LeaveEndDate + '&leaveRate=' + newLeave.LeaveRate;
            $http.get(url).then(
                function success(response) {
                    newLeave.VacationDays = response.data;
                },
                function error(response) {
                    showRequestErrorMessage(response);
                });

            $scope.newLeaveRequest.Leaves.push(newLeave);
            $('#addLeaveModal').modal('hide');
        }
    };
    $scope.deleteLeave = function (id) {
        for (i = 0 ; i < $scope.newLeaveRequest.Leaves.length; i++) {
            var item = $scope.newLeaveRequest.Leaves[i];
            if (item.LeaveId == id) {
                $scope.newLeaveRequest.Leaves.splice(i, 1);
                break;
            }
        }
        //alert($scope.newLeaveRequest.Leaves.length);
    };

    $scope.addLeaveRequest = function (actionName) {
        // Validation
        var validationMessage = '';
        if (actionName == "Review" || actionName == "Reject") {
            if (isEmpty($scope.newLeaveRequest.Comment))
            validationMessage = validationMessage + 'Comments is missing\n';
        }
        if ($scope.newLeaveRequest.IsOnBehaldOf && isEmpty($scope.newLeaveRequest.PersonneId))
            validationMessage = validationMessage + 'Behalf of missing\n';
        if (isEmpty($scope.newLeaveRequest.LeaveRequestContact))
            validationMessage = validationMessage + 'Contact info is missing\n';
        //if (isEmpty($scope.newLeaveRequest.PersonneReplacingId))
        //    validationMessage = validationMessage + 'Replacing person is not filled\n';
        if ($scope.newLeaveRequest.Leaves.length <=0) 
            validationMessage = validationMessage + 'Leave date missing\n';
        
        if ($scope.newLeaveRequest.TicketNeeded) {
            if (isEmpty($scope.newLeaveRequest.LeaveTicketCountryId))
                validationMessage = validationMessage + 'Flight destination not filled\n';
            if (isEmpty($scope.newLeaveRequest.LeaveRequestFlightInfo))
                validationMessage = validationMessage + 'Flight details not filled\n';
        }
        if (validationMessage != '')
        {
            showValidationMessage(validationMessage);
            return;
        }

        // Save
        $http.post('/api/Leaves?workflowAction=' + actionName, $scope.newLeaveRequest).then(
        function success(response) {
            //$scope.newLeaveRequest = response.data;
            redirect("/Leave");
        },
        function error(response) {
            showRequestErrorMessage(response);
        });
        
    };
});

leaveRequestApp.controller('LeaveRequestListingController', function ($scope, $http) {
    showLoader();
    $scope.AllLeaves;
    $scope.vacationBalance;

    $http.get('/api/Leaves/Members/VacationBalance').then(
            function success(response) {
                $scope.vacationBalance = response.data;
            },
            function error(response) {
                showRequestErrorMessage(response);
            });
    $http.get('/api/LeaveCountries').then(
            function success(response) {
                $scope.countries = response.data;
                $http.get('/api/Leaves').then(
                    function success(response) {
                        $scope.AllLeaves = response.data;
                        hideLoader();
                    },
                    function error(response) {
                        showRequestErrorMessage(response);
                    });
            });
});

leaveRequestApp.controller('LeavePendingApprovalController', function ($scope, $http) {
    showLoader();
    $scope.AllLeaves;

    $http.get('/api/Leaves/PendingApproval').then(
        function success(response) {
            $scope.AllLeaves = response.data;
            hideLoader();
        },
        function error(response) {
            showRequestErrorMessage(response);
        });
});


