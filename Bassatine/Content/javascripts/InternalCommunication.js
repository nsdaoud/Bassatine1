var InternalCommunicationApp = angular.module('InternalCommunicationApp', ['ngSanitize', 'ui.select', 'summernote']).directive('emailValidator', emailValidator);


function emailValidator() {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

    function multiEmailValidationInTextBox(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function (modelValue) {
            var isEmailsValid = true
            , isLastEmailValid = false;
            
            if (modelValue == '') { isEmailsValid = true; isLastEmailValid = true;}
            if (angular.isDefined(modelValue)) {
                if (!ctrl.$isEmpty(modelValue)) {
                    var splitEmails = modelValue.split(';')
                    , emailLength = splitEmails.length;

                    if (emailLength < 1) {
                        isValidEmails = EMAIL_REGEXP.test(splitEmails[0].trim());
                    } else {
                        angular.forEach(splitEmails, function (item, index) {
                            if (!EMAIL_REGEXP.test(splitEmails[index].trim()) && index != emailLength - 1) {
                                isValidEmails = false;
                            }
                        });

                        var lastEmail = splitEmails[emailLength - 1].trim();
                        if (ctrl.$isEmpty(lastEmail) ||
                            (!ctrl.$isEmpty(lastEmail) && EMAIL_REGEXP.test(lastEmail))) {
                            isLastEmailValid = true;
                        }

                    }
                }
            }

            if (isEmailsValid && isLastEmailValid ) {
                scope.isvalidemail = false;
                //alert(modelValue);
                //elm.removeClass('has-error');
                //elm.addClass('has-success');
            } else {
                scope.isvalidemail = true;
                //elm.addClass('has-error');
                //elm.removeClass('has-success');
            }

            return modelValue;
        });
    }

    return {
        require: 'ngModel',
        restrict: 'A',
        link: multiEmailValidationInTextBox
    };
}

InternalCommunicationApp.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
InternalCommunicationApp.controller('emailtemplatesController', function ($scope, $filter, $http) {
    showLoader();
    $scope.emailtemplates;
    $scope.emailtemplate;
    $scope.edittravelRequest;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $http.get('/api/InternalCommunication/EmailTemplates').then(
       function success(response) {
           $scope.emailtemplates = response.data;
           hideLoader();
       },
       function error(response) {
           alert(response.statusText);
       });

    $scope.numberOfPages = function () {

        return Math.ceil($scope.emailtemplates.length / $scope.pageSize);


    }

    $scope.setSort = function (sort) {
        if ($scope.sort === sort) {
            $scope.reverse = !$scope.reverse;
        }
        if ($scope.sort !== undefined) {
            $scope.sort = sort;
        }
    }

    $scope.newemailtemplate = function () {
        //$scope.DestinationIndex = index;
        //alert(index)

        $scope.dataemailtemplate = {
            EmailTemplateDescription: '',
            EmailTemplateName: '',
            
        };
    }

    $scope.indexemailtemplate = function (index) {
        $scope.DestinationIndex = index;
        //alert(index)
        $scope.dataemailtemplate = angular.copy($scope.emailtemplates[index]);
    }


    $scope.saveemailtemplates = function () {


        var validationMessage = '';

        if ($scope.dataemailtemplate.EmailTemplateDescription == '') {
            validationMessage = validationMessage + 'Template Description is missing\n';

        }
       
        if ($scope.dataemailtemplate.EmailTemplateName == '') {
            //alert($scope.emailcommunications.EmailBody);
            validationMessage = validationMessage + 'Template Name is missing\n';

        }

      

        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }


        $http.post('/api/InternalCommunication/saveEmailTemplates', $scope.dataemailtemplate).then(
       function success(response) {
           //alert("Travel Accomodation added Successfully !!!");
           redirect("/InternalCommunication/emailTemplates");
           //$scope.emailtemplates[$scope.DestinationIndex] = response.data;
       },
       function error(response) {
           alert(response.statusText);
       });
    }

    $scope.delete = function (index) {

        $http.post('/api/InternalCommunication/deleteEmailTemplate', $scope.emailtemplates[index]).then(
         function success(response) {
             alert("Email Template deleted Successfully !!!");
             $scope.emailtemplates.splice(index, 1);
         },
        function error(response) {
            alert("Template File has one or more Internal Commucation!");

            console.log("Delete fail!");
            console.log("Response Data : " + response.data);
            console.log("Response : " + response.statusText);
            console.log("Response Staus: " + response.statusText);
        });

    }

    //$scope.uploadfile = function () {

    //    $http.post('/api/InternalCommunication/uploadfile', $scope.dataemailtemplate).then(
    //   function success(response) {
    //       //alert("Travel Accomodation added Successfully !!!");
    //       redirect("/InternalCommunication/emailTemplates");
    //       //$scope.emailtemplates[$scope.DestinationIndex] = response.data;
    //   },
    //   function error(response) {
    //       alert(response.statusText);
    //   });
    //}

    $scope.fileList = [];
    $scope.curFile;
    $scope.ImageProperty = {
        file: ''
    }

    $scope.setFile = function (element) {
        $scope.fileList = [];
        // get the files
        var files = element.files;
        for (var i = 0; i < files.length; i++) {
            $scope.ImageProperty.file = files[i];

            $scope.fileList.push($scope.ImageProperty);
            $scope.ImageProperty = {};
            $scope.$apply();

        }
    }

    $scope.UploadFile = function () {
        //alert($scope.dataemailtemplate.EmailTemplateDescription);
        var validationMessage = '';

        if ($scope.dataemailtemplate.EmailTemplateDescription == '') {
            validationMessage = validationMessage + 'Template Description is missing\n';

        }

        if ($scope.dataemailtemplate.EmailTemplateName == '') {
            //alert($scope.emailcommunications.EmailBody);
            validationMessage = validationMessage + 'Template Name is missing\n';

        }



        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }
        for (var i = 0; i < $scope.fileList.length; i++) {

            $scope.UploadFileIndividual($scope.fileList[i].file,
                                        $scope.fileList[i].file.name,
                                        $scope.fileList[i].file.type,
                                        $scope.fileList[i].file.size,
                                        i);
        }

    }



    $scope.UploadFileIndividual = function (fileToUpload, name, type, size, index) {
        //Create XMLHttpRequest Object
        var reqObj = new XMLHttpRequest();

        //event Handler
        //reqObj.upload.addEventListener("progress", uploadProgress, false)
        reqObj.addEventListener("load", uploadComplete, false)
        reqObj.addEventListener("error", uploadFailed, false)
        reqObj.addEventListener("abort", uploadCanceled, false)


        //open the object and set method of call(get/post), url to call, isasynchronous(true/False)
        reqObj.open("POST", "/InternalCommunication/UploadFiles", true);

        //set Content-Type at request header.For file upload it's value must be multipart/form-data
        reqObj.setRequestHeader("Content-Type", "multipart/form-data");

        //Set Other header like file name,size and type
        reqObj.setRequestHeader('X-File-Name', name);
        reqObj.setRequestHeader('X-File-Type', type);
        reqObj.setRequestHeader('X-File-Size', size);

        $scope.dataemailtemplate.EmailTemplateName = name;

      

        // send the file
        reqObj.send(fileToUpload);

       

        function uploadComplete(evt) {
            /* This event is raised when the server  back a response */
            $scope.saveemailtemplates();
            //document.getElementById('P' + index).innerHTML = 'Saved';
            $scope.NoOfFileSaved++;
            $scope.$apply();
        }

        function uploadFailed(evt) {
            document.getElementById('P' + index).innerHTML = 'Upload Failed..';
        }

        function uploadCanceled(evt) {

            document.getElementById('P' + index).innerHTML = 'Canceled....';
        }

    }

});

InternalCommunicationApp.controller('emailCommunicationCtrl', function ($scope, $http, $timeout) {
    showLoader();

    $scope.emailcommunications;
    $scope.emailcommunication;

    $scope.person = {};

   

    $http.get('/api/InternalCommunication/EmailCommunication').then(
       function success(response) {
           $scope.emailcommunications = response.data;
           hideLoader();
       },
       function error(response) {
           alert(response.statusText);
       });

    $http.get('/api/InternalCommunication/ActiveDirectoryUsers').then(
    function success(response) {
        $scope.people = response.data;
        hideLoader();
    },
    function error(response) {
        alert(response.statusText);
    });


   
});

InternalCommunicationApp.controller('editemailCommunicationCtrl', function ($scope, $filter, $http) {
    showLoader();

    $scope.EmailAudienceGroup;
    $scope.id = $.QueryString["id"];

    
    $scope.disableemailcommunications = false;
    $scope.emailcommunications= {
        id_EmailCommunication: '',
        id_EmailTemplate: '',
        EmailSubject: '',
        EmailAudienceGroup: '',
        EmailAudiencePerson: '',
        EmailBody: '',
        id_Personne: '',
        EmailsentDate: '',
    };
    $scope.lstemailcommunication;

    $scope.multipleDemo = {};
    $scope.person = {};
    $scope.multipleDemo.selectedPeople = [];
    $scope.people = [];


    $http.get('/api/InternalCommunication/ActiveDirectoryUsers').then(
    function success(response) {
        $scope.people = response.data;
        if (typeof $scope.id != 'undefined') {
            $http.get('/api/InternalCommunication?id=' + $scope.id).then(
               function success(response) {

                   $scope.emailcommunications = response.data;
                   $scope.disableemailcommunications = true;

                   $scope.EmailTemplateName = $scope.emailcommunications.EmailTemplateName;

                   //alert($scope.emailcommunications.EmailTemplateName);

                   //$('.summernote').summernote({
                   //    height: 200,

                   //});
                   //$scope.emailcommunications.EmailAudienceGroup = ['najida;ss'];

                   var res = $scope.emailcommunications.EmailAudienceGroup.split(";");

                   for (var i = 0; i < res.length; i++) {
                      
                       for (var j = 0; j < $scope.people.length; j++) {
                       
                          
                           if ($scope.people[j].EmailAudienceGroup == res[i]) {
                               $scope.multipleDemo.selectedPeople.push(
                                                           $scope.people[j]
                                                           );
                           }
                        
                       }
                   
                   }
                   hideLoader();
               },
               function error(response) {
                   alert(response.statusText);
               });
        } else {
           

            hideLoader();
        }
        hideLoader();
    },
    function error(response) {
        alert(response.statusText);
    });



    // Get EmailTemplates
    $http.get('/api/InternalCommunication/EmailTemplates').then(
      function success(response) {
          $scope.LstEmailTemplates = response.data;
          hideLoader();
      },
        function error(response) {
            alert(response.statusText);
        });
    // Get EmailTemplates

    $scope.saveemailcommuniation = function () {

        var validationMessage = '';

        if ($scope.emailcommunications.EmailSubject == ''){
            validationMessage = validationMessage + 'Email Subject is missing\n';

        }
        //alert($scope.emailcommunications.id_EmailTemplate);
        //alert($scope.emailcommunications.EmailTemplateName);
       

        if ($scope.emailcommunications.id_EmailTemplate == 'undefined' || $scope.emailcommunications.id_EmailTemplate == '') {
            validationMessage = validationMessage + 'Email Template is missing\n';
        }else{
            $scope.emailcommunications.EmailTemplateName = $scope.selected_name;
        
        }

        if ($scope.emailcommunications.EmailBody == '') {
            //alert($scope.emailcommunications.EmailBody);
            validationMessage = validationMessage + 'Email Body is missing\n';

        }

        if ($scope.emailcommunications.EmailAudienceGroup == '' && $scope.emailcommunications.EmailAudiencePerson == '') {
            validationMessage = validationMessage + 'Audience Group or Email is should be filled\n';

        }


        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }
            

        for (var i = 0; i < $scope.multipleDemo.selectedPeople.length; i++) {
            if (i == 0) {
                $scope.emailcommunications.EmailAudienceGroup = $scope.multipleDemo.selectedPeople[i].EmailAudienceGroup + ';'
            } else {
                $scope.emailcommunications.EmailAudienceGroup = $scope.emailcommunications.EmailAudienceGroup + $scope.multipleDemo.selectedPeople[i].EmailAudienceGroup + ';'
            }
           

        }
        //alert($scope.emailcommunications.EmailAudienceGroup);
        $http.post('/api/InternalCommunication/sendemail', $scope.emailcommunications).then(
       function success(response) {
           //alert("Travel Accomodation added Successfully !!!");
           redirect("/InternalCommunication/emailCommunication");
           //$scope.emailtemplates[$scope.DestinationIndex] = response.data;
       },
       function error(response) {
           alert(response.statusText);
       });
    }

    $scope.preview = function () {

        var validationMessage = '';

        if ($scope.emailcommunications.EmailSubject == '') {
            validationMessage = validationMessage + 'Email Subject is missing\n';

        }
        //alert($scope.emailcommunications.id_EmailTemplate);
        //alert($scope.emailcommunications.EmailTemplateName);


        if ($scope.emailcommunications.id_EmailTemplate == 'undefined' || $scope.emailcommunications.id_EmailTemplate == '') {
            validationMessage = validationMessage + 'Email Template is missing\n';
        } else {
            //alert($scope.selected_name);
            $scope.emailcommunications.EmailTemplateName = $scope.selected_name;

        }

        if ($scope.emailcommunications.EmailBody == '') {
            //alert($scope.emailcommunications.EmailBody);
            validationMessage = validationMessage + 'Email Body is missing\n';

        }

        //if ($scope.emailcommunications.EmailAudienceGroup == '' && $scope.emailcommunications.EmailAudiencePerson == '') {
        //    validationMessage = validationMessage + 'Audience Group or Email is should be filled\n';

        //}


        if (validationMessage != '') {
            showValidationMessage(validationMessage);
            return;
        }


        //for (var i = 0; i < $scope.multipleDemo.selectedPeople.length; i++) {
        //    if (i == 0) {
        //        $scope.emailcommunications.EmailAudienceGroup = $scope.multipleDemo.selectedPeople[i].EmailAudienceGroup + ';'
        //    } else {
        //        $scope.emailcommunications.EmailAudienceGroup = $scope.emailcommunications.EmailAudienceGroup + $scope.multipleDemo.selectedPeople[i].EmailAudienceGroup + ';'
        //    }


        //}
        //alert($scope.selected_name);
        //alert($scope.emailcommunications.EmailBody);
        //alert($scope.emailcommunications.EmailBody);
        //alert($scope.emailcommunications);

        // Get EmailTemplates
        $http.post('/api/InternalCommunication/templatebody', $scope.emailcommunications).then(
          function success(response) {
              //$scope.bodycommunication = response.data;
              //alert(response.data);
              //console.log(response.data);
              var w = window.open();
              $(w.document.body).html(response.data);

              //var x = window.open($(response.data).html());
              //var html = $($scope.bodycommunication).html();
              //$(x.document.body).html(html);
              hideLoader();
          },
            function error(response) {
                alert(response.statusText);
            });
        // Get EmailTemplates


      
        //alert(x.document.body.innerHTML);
        //x.document.body.innerHTML = 'content';
       // $http.post('/api/InternalCommunication/sendemail', $scope.emailcommunications).then(
       //function success(response) {
       //    //alert("Travel Accomodation added Successfully !!!");
       //    redirect("/InternalCommunication/emailCommunication");
       //    //$scope.emailtemplates[$scope.DestinationIndex] = response.data;
       //},
       //function error(response) {
       //    alert(response.statusText);
       //});
    }


});

InternalCommunicationApp.controller('rptemailCommunicationCtrl', function ($scope, $filter, $http) {
    showLoader();
    $scope.LstrptEmailTemplates;

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


    //alert("report");
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
    $scope.exportPDF = true;

    $scope.link = '';

    //$scope.reportTitle = $.QueryString["reportTitle"];

    // Get Travel Jobs
    $http.get('/api/InternalCommunication/EmailTemplates').then(

     function success(response) {
         $scope.LstrptEmailTemplates = response.data;
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

        window.open('/InternalCommunication/rptListOfCommunications?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&_templatename=' + $scope.EmailTemplateName + '&_keywordfrombody=' + $scope.keywordfrombody + '&exportPDF=' + $scope.exportPDF, '_blank');
        //    window.open('/TravelRequest/PDFRptTicketsByJob?_dateFrom=' + $scope.dateFrom + '&_dateTo=' + $scope.dateTo + '&_codePoste=' + $scope.codePoste, '_blank');
       

    }

});








