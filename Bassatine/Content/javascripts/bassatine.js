var bassatineApp = angular.module('bassatineApp', []);

bassatineApp.controller('bassatineusersController', function ($scope, $filter, $http) {
    $scope.bassatineusers;
    $scope.databassatineusers;
    $scope.rowindex;

    $http.get('/api/accounts/bassatineusers').then(
        function success(response) {
            $scope.bassatineusers = response.data;
            console.log($scope.bassatineusers);
            //hideLoader();
        },
        function error(response) {
            alert(response.statusText);
        });


    $scope.edit = function (index) {

    
        $scope.rowindex = index;
        $scope.databassatineusers = angular.copy($scope.bassatineusers[index]);


    }

    $scope.Update = function () {

        $http.post('/api/accounts/updateuserinfo', $scope.databassatineusers).then(
            function success(response) {
                $scope.bassatineusers[$scope.rowindex] = response.data;
           
            },
            function error(response) {
                alert(response.statusText);
            });

    }


});

bassatineApp.controller('vendorProController', function ($scope, $filter, $http) {
    $scope.WareHouseProducts;
    //$scope.databassatineusers;
    //$scope.rowindex;

    $http.get('/api/vendor/vendorProducts').then(
        function success(response) {
            $scope.vendorProducts = response.data;
            //hideLoader();
        },
        function error(response) {
            alert(response.statusText);
        });

    $http.get('/api/vendor/WareHouseProducts').then(
        function success(response) {
            $scope.WareHouseProducts = response.data;
            //hideLoader();
        },
        function error(response) {
            alert(response.statusText);
        });



    //$scope.edit = function (index) {


    //    $scope.rowindex = index;
    //    $scope.databassatineusers = angular.copy($scope.bassatineusers[index]);


    //}


});

bassatineApp.controller('vendorPOController', function ($scope, $filter, $http) {
    $scope.vendorPOs;
    $scope.EditvendorPO;
    $scope.rowindex;

    //$scope.id = $.QueryString["id"];
    
    $scope.action = $.QueryString["action"];

    


    if ($scope.action == "isadmin") {

        $http.get('/api/vendor/AllPO').then(
            function success(response) {
                $scope.vendorPOs = response.data;
                //hideLoader();
            },
            function error(response) {
                alert(response.statusText);
            });
    } else {

        $http.get('/api/vendor/vendorPO').then(
            function success(response) {
                $scope.vendorPOs = response.data;
                //hideLoader();
            },
            function error(response) {
                alert(response.statusText);
            });
    }

   

    $http.get('/api/vendor/wareHouses').then(
        function success(response) {
            $scope.lstWareHouses = response.data;
            //hideLoader();
        },
        function error(response) {
            alert(response.statusText);
        });

    $scope.addvendorPO = function () {
        //$scope.DestinationIndex = index;
        //alert(index)

        $scope.datavendorPO = {
            id_PurchOrder: '00000000-0000-0000-0000-000000000000',
            PurchOrderCode: '',
            VendCode: '',
            WarehouseCode: '',
            PurchOrdersequential: 0,
            PurchOrderStatus: 'In Preperation'
        }

    }



    $scope.add = function () {



        var validationMessage = '';

        if ($scope.datavendorPO.id_WareHouse == '') {
            //alert($scope.emailcommunications.EmailBody);
            validationMessage = validationMessage + 'Status is missing\n';


        }

        alert($scope.datavendorPO.PODeliveryDate);

        if ($scope.datavendorPO.PODeliveryDate == '' || typeof $scope.datavendorPO.PODeliveryDate == 'undefined') {
            validationMessage = validationMessage + 'Delivery Date is missing\n';

        }

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }
        //$scope.dataTAEmployeeRate.id_Employee = $scope.id;

        $http.post('/api/vendor/SaveNewVendorPO?', $scope.datavendorPO).then(

            function success(response) {
                $scope.vendorPOs.push(response.data);
                $('#addPO').modal('hide');
                redirect("/VendorPO/POLines?id=" + response.data.id_PurchOrder + '&action=' + $scope.action);

            },
            function error(response) {
                alert(response.statusText);
            });
    }

    $scope.edit = function (index) {

        //alert($scope.TAFDestinations.indexOf(TAFDestination));
        //TAFDestination.ed = true;

        //$scope.sort = undefined;
        $scope.rowindex = index;
        $scope.datavendorPO = angular.copy($scope.vendorPO[index]);

        alert($scope.datavendorPO.id_PurchOrder);

        redirect("/VendorPO/POLines?id=" + $scope.datavendorPO.id_PurchOrder);

    }

    $scope.Update = function () {

        $http.post('/api/vendor/UpdateVendorPO', $scope.datavendorPO + ',' + $scope.action).then(
            function success(response) {
                $scope.datavendorPO[$scope.rowindex] = response.data;
            },
            function error(response) {
                alert(response.statusText);
            });

    }
   

    function showValidationMessage(msg) {
        alert(msg);
    }
});

bassatineApp.controller('vendorPOLinesController', function ($scope, $filter, $http) {
    $scope.lstWareHouses;
    $scope.rowindex;
    $scope.selectedvendorPO;
    $scope.vendorPOLines;
    $scope.selectedvendorPOLines;
  
    var validationMessage = '';

    $scope.id = $.QueryString["id"];
    $scope.action = $.QueryString["action"];

   

    $scope.ProdCode;
    $scope.nomHotelTiers;

    //alert($scope.id);

    
  



    $http.get("/api/vendor/vendorPOById?id=" + $scope.id ).then(
        function success(response) {
            $scope.selectedvendorPO = response.data;

            //$scope.selectedvendorPO.PurchDate = new Date();

            $scope.POInProcesStatus();
            $scope.POLinesInProcesStatus();
          
            //hideLoader();
           
        },
        function error(response) {
            alert(response.statusText);
        });

    $http.get("/api/vendor/vendorPOLines?id=" + $scope.id).then(
        function success(response) {
            $scope.vendorPOLines = response.data;
            //hideLoader();
        },
        function error(response) {
            alert(response.statusText);
        });

    $scope.POInProcesStatus = function () { 
        //alert($scope.selectedvendorPO);
        if (typeof $scope.selectedvendorPO != 'undefined') {
       
                if ($scope.action == 'isnotadmin') {
                    return true;
                } else {
                    return false;
                }
       
        }
       
    };

    $scope.POLinesInProcesStatus = function () {
        if (typeof $scope.selectedvendorPO != 'undefined') {
            if ($scope.selectedvendorPO.PurchOrderStatus == 'In Preparation') {
                return false;
            } else {
                if ($scope.action == 'isnotadmin') {
                    return true;
                } else {
                    return false;
                }

            }
        }
        
    };


    $scope.CanSendToBassatine = function () {
        if (typeof $scope.selectedvendorPO != 'undefined') {
            if ($scope.selectedvendorPO.PurchOrderStatus == 'In Preparation') {
                if ($scope.action == 'isnotadmin') {
                    return false;
                } else {
                    return true;
                }
            } else {  
                return true;
            }
        }

    };

    $scope.CanSendToVendor = function () {
        if (typeof $scope.selectedvendorPO != 'undefined') {

            if ($scope.action == 'isnotadmin') {
                return true;
            } else {
                return false;
            }


            
        }

    };


    $scope.addvendorPO = function () {
        //$scope.DestinationIndex = index;
        //alert(index)

        $scope.datavendorPO = {
            id_PurchOrder: '00000000-0000-0000-0000-000000000000',
            PurchOrderCode: '',
            VendCode: '',
            WarehouseCode: '',
            PurchOrdersequential: 0,
            PurchOrderStatus: ''
        }

    }

    $scope.newvendorPOLine = {
        id_PurchOrder: '00000000-0000-0000-0000-000000000000',
        id_PurchLine: '00000000-0000-0000-0000-000000000000',
        UnitPrice: 0,
        Quantity :0,
        Amount: 0,
        ProdCode : ''
    };

    $scope.add = function () {


       //alert($scope.ProdCode);
       var validationMessage = '';

       if ($scope.ProdCode == '' || typeof $scope.ProdCode == 'undefined') {
            validationMessage = validationMessage + 'Product Code is missing\n';

        }

        if ($scope.newvendorPOLine.Quantity == 0) {
            validationMessage = validationMessage + 'Quantity is missing\n';

        }

        if ($scope.newvendorPOLine.UnitPrice == 0) {
            validationMessage = validationMessage + 'Unit Price is missing\n';

        }

        if ($scope.newvendorPOLine.Amount == 0) {
            validationMessage = validationMessage + 'Amount is missing\n';

        }

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }
        //$scope.dataTAEmployeeRate.id_Employee = $scope.id;

        $scope.newvendorPOLine.ProdCode = $scope.ProdCode;
        $scope.newvendorPOLine.id_PurchOrder = $scope.id;

        $http.post('/api/vendor/SaveNewVendorPOLines?', $scope.newvendorPOLine).then(

            function success(response) {
                $scope.vendorPOLines.push(response.data);
                $scope.ProdCode = '';
                $scope.newvendorPOLine = {
                    id_PurchOrder: '00000000-0000-0000-0000-000000000000',
                    id_PurchLine: '00000000-0000-0000-0000-000000000000',
                    UnitPrice: 0,
                    Quantity: 0,
                    Amount: 0,
                    ProdCode: ''
                };
            },
            function error(response) {
                alert(response.statusText);
            });

        $("#ddlProducts").select2("val", "");
    }

    $scope.Update = function () {



        if ($scope.selectedvendorPOLines.ProdCode == '') {
            //alert($scope.emailcommunications.EmailBody);
            validationMessage = validationMessage + 'Product Code is missing\n';


        }

        if ($scope.selectedvendorPOLines.Quantity == 0) {
            validationMessage = validationMessage + 'Quantity is missing\n';

        }

        if ($scope.selectedvendorPOLines.UnitPrice == 0) {
            validationMessage = validationMessage + 'Unit Price is missing\n';

        }

        if ($scope.selectedvendorPOLines.Amount == 0) {
            validationMessage = validationMessage + 'Amount is missing\n';

        }

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }


        $http.post('/api/vendor/UpdateVendorPOLines', $scope.selectedvendorPOLines).then(
            function success(response) {
                $scope.vendorPOLines[$scope.rowindex] = response.data;
                $scope.POInProcesStatus();
                $scope.POLinesInProcesStatus();
                //redirect('vendorPO/POLines')
            },
            function error(response) {
                alert(response.statusText);
            });

    }

    $("#ddlProducts").select2({
        placeholder: "Select a Product",
        initSelection: true,
        minimumInputLength: 3,
        allowClear: true,
        //multiple:true,
        closeOnSelect: true,
        ajax: {
            url: "/VendorPO/GetListOfProducts/",
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
                        id: data[i].ProdCode,
                        text: data[i].ProdCode,
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
            $scope.ProdCode = person.id;
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

    function personFormatResult(person) {
        return person.ProdCode;
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

    $scope.edit = function (index) {

        //alert(index);
        //TAFDestination.ed = true;

        //$scope.sort = undefined;
        //Console.log($scope.vendorPOLines[index]);
        $scope.rowindex = index;
        $scope.selectedvendorPOLines = angular.copy($scope.vendorPOLines[index]);
            
       

    }

    $scope.delete = function (index) {
        $http.post('/api/vendor/deletePOLine', $scope.vendorPOLines[index]).then(
            function success(response) {
                //alert("Travel Reason deleted Successfully !!!");
                $scope.vendorPOLines.splice(index, 1);
            },
            function error(response) {
                alert(response.statusText);
            });


    }

    $scope.sendtobassatine = function () {
        var validationMessage = '';
        //alert($scope.vendorPOLines.length);
        if ($scope.vendorPOLines.length == 0) {
            validationMessage = validationMessage + 'One product is required\n';

        }

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }
        $scope.selectedvendorPO.PurchOrderStatus = 'In Process';
        $http.post('/api/vendor/UpdateVendorPO', $scope.selectedvendorPO).then(
            function success(response) {
                $scope.datavendorPO[$scope.rowindex] = response.data;
            },
            function error(response) {
                alert(response.statusText);
            });

    }
    $scope.sendtovendor = function () {
        var validationMessage = '';
        //alert($scope.vendorPOLines.length);
        if ($scope.vendorPOLines.length == 0) {
            validationMessage = validationMessage + 'One product is required\n';

        }

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }
        //$scope.selectedvendorPO.PurchOrderStatus = 'In Process';
        $http.post('/api/vendor/UpdatePOSendToVendor', $scope.selectedvendorPO).then(
            function success(response) {
                $scope.datavendorPO[$scope.rowindex] = response.data;
            },
            function error(response) {
                alert(response.statusText);
            });

    }


    function showValidationMessage(msg) {
        alert(msg);
    }
});
