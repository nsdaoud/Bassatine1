var InternalCommunicationApp = angular.module('InternalCommunicationApp', ['ngSanitize', 'ui.select', 'summernote']);

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

    $scope.indexemailtemplate = function (index) {
        $scope.DestinationIndex = index;
        //alert(index)
        $scope.dataemailtemplate = angular.copy($scope.emailtemplates[index]);
    }


    $scope.saveemailtemplates = function () {

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
        if (isEmpty($scope.dataemailtemplate.EmailTemplateDescription)) {

            validationMessage = validationMessage + 'Traveler is missing\n';
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

        //alert($scope.dataemailtemplate.EmailTemplateName);

        // send the file
        reqObj.send(fileToUpload);

        //function uploadProgress(evt) {
        //    if (evt.lengthComputable) {

        //        var uploadProgressCount = Math.round(evt.loaded * 100 / evt.total);

        //        document.getElementById('P' + index).innerHTML = uploadProgressCount;

        //        if (uploadProgressCount == 100) {
        //            document.getElementById('P' + index).innerHTML =
        //           '<i class="fa fa-refresh fa-spin" style="color:maroon;"></i>';
        //        }

        //    }
        //}

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

    //$scope.text = 'me@example.com';
    //$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

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


    //$scope.indexemailCommuniation = function (index) {
    //    $scope.DestinationIndex = index;
    //    //alert(index)
    //    $scope.dataemailCommuniation = angular.copy($scope.emailcommunications[index]);
    //}




    //$scope.people = [
    //  { name: 'Adam', email: 'adam@email.com'},
    //  { name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina' },
    //  { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
    //  { name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador' },
    //  { name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador' },
    //  { name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States' },
    //  { name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia' },
    //  { name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador' },
    //  { name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia' },
    //  { name: 'Nicolás', email: 'nicolas@email.com', age: 43, country: 'Colombia' }
    //];
    //hideLoader();

    //$scope.multipleDemo = {};
    //$scope.multipleDemo.selectedPeople = [{"email":"pnajm@butec.com.lb","displayname":"Paula Najm"}];
    //$scope.multipleDemo.selectedPeople = [];



});

InternalCommunicationApp.controller('editemailCommunicationCtrl', function ($scope, $filter, $http, $timeout) {
    showLoader();

    $scope.EmailAudienceGroup;
    $scope.id = $.QueryString["id"];


    //$("#ddlhotel").select2({
    //    placeholder: "Select an Agency",
    //    minimumInputLength: 3,
    //    closeOnSelect: true,
    //    ajax: {
    //        url: "/InternalCommunication/GetEmailGroup/",
    //        dataType: 'json',
    //        error: function () { alert("Temporary error. Please try again..."); },
    //        data: function (term, page) {
    //            return {
    //                st: term,
    //                pageSize: 10,
    //                pageNumber: page
    //            };
    //        },
    //        results: function (data, page) {
    //            var arr = [];
    //            for (var i = 0; i < data.length; i++) {
    //                arr.push({
    //                    //id: data[i].id_Tiers,
    //                    text: data[i].EmailAudienceGroup,
    //                });
    //            }
    //            return {
    //                results: arr
    //            };

    //        }
    //    },
    //    formatResult: function (person) {
    //        return person.text;
    //    },
    //    formatSelection: function (person) {
    //        alert(person.text);
    //        //$scope.idAgencyTiers = person.id;
    //        $scope.EmailAudienceGroup = person.text;
    //        return person.text;
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

    //function personFormatResult(person) {
    //    return person.text;
    //}

    //function personFormatSelection(person) {
    //    //alert("W");
    //    //$scope.selectedtraveler = person;
    //    //$scope.selectedLSID = person.id;
    //    //$scope.personSelected = true;
    //    //$scope.selectedPersonName = person.nomTiers + ' ' + person.nomTiers + ' ' + person.nomTiers + ' (' + person.nomTiers + ')';
    //    //$scope.$apply();
    //    //return $scope.selectedtraveler;
    //}


    //alert($scope.id+ "Naji");

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
    //$scope.LstEmailTemplates = [];

    $scope.multipleDemo = {};
    $scope.person = {};
    $scope.multipleDemo.selectedPeople = [];
    $scope.people = [];
    $scope.people1 = [];

    //emailcommunications.EmailBody = '<p><img style="width: 160px;" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4RNWRXhpZgAATU0AKgAAAAgACwEAAAQAAAABAAAQIAEBAAQAAAABAAAJEgEPAAIAAAAIAAAIngEQAAIAAAAIAAAIpgESAAMAAAABAAYAAAExAAIAAAANAAAIrgEyAAIAAAAUAAAIvAITAAMAAAABAAEAAIdpAAQAAAABAAAI0JycAAEAAAAaAAATNOocAAcAAAgMAAAAkgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFNBTVNVTkcAU00tTjkwMABOOTAwWFhTRUJRRDIAADIwMTc6MDg6MjIgMTQ6Mzg6MTEAAB6CmgAFAAAAAQAAEkqCnQAFAAAAAQAAElKIIgADAAAAAQACAACIJwADAAAAAQCgAACQAAAHAAAABDAyMjCQAwACAAAAFAAAElqQBAACAAAAFAAAEm6SAQAFAAAAAQAAEoKSAgAFAAAAAQAAEoqSAwAFAAAAAQAAEpKSBAAFAAAAAQAAEpqSBQAFAAAAAQAAEqKSBwADAAAAAQACAACSCQADAAAAAQAAAACSCgAFAAAAAQAAEqqSfAAHAAAAYgAAErKSkQACAAAAAzAwAACSkgACAAAAAzAwAACgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAECCgAwAEAAAAAQAACRKgBQAEAAAAAQAAExSkAgADAAAAAQAAAACkAwADAAAAAQAAAACkBQADAAAAAQAfAACkBgADAAAAAQAAAACkIAACAAAADAAAEyjqHAAHAAAIDAAACj7qHQAJAAAAAQAAEFQAAAAAHOoAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAFAAAABYAAAAKMjAxNzowODoyMiAxNDozODoxMQAyMDE3OjA4OjIyIDE0OjM4OjExAAAAAbAAAABkAAAA4wAAAGQAAABTAAAAZAAAAAAAAAAKAAAA4wAAAGQAAAGkAAAAZAcAAQAHAAQAAAAwMTAwAgAEAAEAAAAAIAEADAAEAAEAAAAAAAAAEAAFAAEAAABaAAAAQAAEAAEAAAAAAAAAUAAEAAEAAAABAAAAAAEDAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAgAHAAAABDAxMDAAAAAAAABDMTNMU0hEMDJTQQB1AHMAZQByACAAYwBvAG0AbQBlAG4AdAAAAP/hCctodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj48eG1wOkNyZWF0ZURhdGU+MjAxNy0wOC0yMlQxNDozODoxMTwveG1wOkNyZWF0ZURhdGU+PHhtcDpDcmVhdG9yVG9vbD5OOTAwWFhTRUJRRDI8L3htcDpDcmVhdG9yVG9vbD48L3JkZjpEZXNjcmlwdGlvbj48L3JkZjpSREY+PC94OnhtcG1ldGE+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAEBAQEBAQEBAQEBAQECAgMCAgICAgQDAwIDBQQFBQUEBAQFBgcGBQUHBgQEBgkGBwgICAgIBQYJCgkICgcICAj/2wBDAQEBAQICAgQCAgQIBQQFCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAj/wAARCABoAKADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+gJnmnSVkJ5Bw7j5Qf69q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" data-filename="Naji20170822_143811.jpg">ghghghghghg<br></p>';

    $http.get('/api/InternalCommunication/ActiveDirectoryUsers').then(
    function success(response) {
        $scope.people = response.data;
        if (typeof $scope.id != 'undefined') {
            $http.get('/api/InternalCommunication?id=' + $scope.id).then(
               function success(response) {

                   //            $scope.people = [
                   //{ EmailAudienceGroup: 'adam@email.com' },
                   //{ EmailAudienceGroup: 'amalie@email.com' },
                   //{ EmailAudienceGroup: 'estefania@email.com' },
                   //{ EmailAudienceGroup: 'adrian@email.com' },
                   //{ EmailAudienceGroup: 'wladimir@email.com' },
                   //{ EmailAudienceGroup: 'samantha@email.com' },
                   //{ EmailAudienceGroup: 'nicole@email.com' },
                   //{ EmailAudienceGroup: 'natasha@email.com' },
                   //{ EmailAudienceGroup: 'michael@email.com' },
                   //{ EmailAudienceGroup: 'nicolas@email.com' }
                   //            ];

                   //$scope.multipleDemo.selectedPeople = [$scope.people[0], $scope.people[1]];
                   //alert($scope.people[3]);
                   $scope.emailcommunications = response.data;

                   //alert($scope.people[3]);
                   //$scope.multipleDemo.selectedPeople = [{ "EmailAudienceGroup": 'BQO@butec.com.lb' }];


                   //$scope.emailcommunications.EmailAudienceGroup = "adam@email.com;estefania@email.com";
                   var res = $scope.emailcommunications.EmailAudienceGroup.split(";");

                   for (var i = 0; i < res.length; i++) {
                       //alert(res.length);
                       //alert(res[i]);
                       $scope.multipleDemo.selectedPeople.push(
                           $scope.people[i]
                       );
                   }
                   hideLoader();
               },
               function error(response) {
                   alert(response.statusText);
               });
        } else {
            //$scope.emailcommunications.EmailSubject = 'EmailSubject';
            //$scope.emailcommunications.EmailBody = '<p><img style="width: 160px;" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4RNWRXhpZgAATU0AKgAAAAgACwEAAAQAAAABAAAQIAEBAAQAAAABAAAJEgEPAAIAAAAIAAAIngEQAAIAAAAIAAAIpgESAAMAAAABAAYAAAExAAIAAAANAAAIrgEyAAIAAAAUAAAIvAITAAMAAAABAAEAAIdpAAQAAAABAAAI0JycAAEAAAAaAAATNOocAAcAAAgMAAAAkgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFNBTVNVTkcAU00tTjkwMABOOTAwWFhTRUJRRDIAADIwMTc6MDg6MjIgMTQ6Mzg6MTEAAB6CmgAFAAAAAQAAEkqCnQAFAAAAAQAAElKIIgADAAAAAQACAACIJwADAAAAAQCgAACQAAAHAAAABDAyMjCQAwACAAAAFAAAElqQBAACAAAAFAAAEm6SAQAFAAAAAQAAEoKSAgAFAAAAAQAAEoqSAwAFAAAAAQAAEpKSBAAFAAAAAQAAEpqSBQAFAAAAAQAAEqKSBwADAAAAAQACAACSCQADAAAAAQAAAACSCgAFAAAAAQAAEqqSfAAHAAAAYgAAErKSkQACAAAAAzAwAACSkgACAAAAAzAwAACgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAECCgAwAEAAAAAQAACRKgBQAEAAAAAQAAExSkAgADAAAAAQAAAACkAwADAAAAAQAAAACkBQADAAAAAQAfAACkBgADAAAAAQAAAACkIAACAAAADAAAEyjqHAAHAAAIDAAACj7qHQAJAAAAAQAAEFQAAAAAHOoAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAFAAAABYAAAAKMjAxNzowODoyMiAxNDozODoxMQAyMDE3OjA4OjIyIDE0OjM4OjExAAAAAbAAAABkAAAA4wAAAGQAAABTAAAAZAAAAAAAAAAKAAAA4wAAAGQAAAGkAAAAZAcAAQAHAAQAAAAwMTAwAgAEAAEAAAAAIAEADAAEAAEAAAAAAAAAEAAFAAEAAABaAAAAQAAEAAEAAAAAAAAAUAAEAAEAAAABAAAAAAEDAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAgAHAAAABDAxMDAAAAAAAABDMTNMU0hEMDJTQQB1AHMAZQByACAAYwBvAG0AbQBlAG4AdAAAAP/hCctodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj48eG1wOkNyZWF0ZURhdGU+MjAxNy0wOC0yMlQxNDozODoxMTwveG1wOkNyZWF0ZURhdGU+PHhtcDpDcmVhdG9yVG9vbD5OOTAwWFhTRUJRRDI8L3htcDpDcmVhdG9yVG9vbD48L3JkZjpEZXNjcmlwdGlvbj48L3JkZjpSREY+PC94OnhtcG1ldGE+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAEBAQEBAQEBAQEBAQECAgMCAgICAgQDAwIDBQQFBQUEBAQFBgcGBQUHBgQEBgkGBwgICAgIBQYJCgkICgcICAj/2wBDAQEBAQICAgQCAgQIBQQFCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAj/wAARCABoAKADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+gJnmnSVkJ5Bw7j5Qf69q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" data-filename="Naji20170822_143811.jpg">ghghghghghg<br></p>';
            //$scope.emailcommunications.EmailAudiencePerson = 'EmailAudiencePerson';

            //$scope.dbmultipleDemo = {};
            //$scope.multipleDemo = {};
            //$scope.multipleDemo.selectedPeople = [{ "EmailAudienceGroup": "pnajm@butec.com.lb" }];
            //$scope.dbmultipleDemo.dbselectedPeople = [];

            //$scope.multipleDemo.selectedPeople = [];

            //$scope.emailcommunications.EmailAudienceGroup = "Administrator@butec.com.lb;pgrondier@butec.com.lb";
            //var res = $scope.emailcommunications.EmailAudienceGroup.split(";");
            //alert(res[0]);
            //for (var i = 0; i < res.length; i++) {
            //    $scope.dbmultipleDemo.dbselectedPeople.push({

            //        EmailAudienceGroup: res[i],
            //    });
            //}



            //console.log($scope.dbmultipleDemo.dbselectedPeople);

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

    //$scope.text = 'me@example.com';
    //$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

    //$scope.multipleDemo = {};
    //$scope.multipleDemo.selectedPeople = [];

   // if (typeof $scope.id != 'undefined') {
   //     $http.get('/api/InternalCommunication?id=' + $scope.id).then(
   //        function success(response) {

   ////            $scope.people = [
   ////{ EmailAudienceGroup: 'adam@email.com' },
   ////{ EmailAudienceGroup: 'amalie@email.com' },
   ////{ EmailAudienceGroup: 'estefania@email.com' },
   ////{ EmailAudienceGroup: 'adrian@email.com' },
   ////{ EmailAudienceGroup: 'wladimir@email.com' },
   ////{ EmailAudienceGroup: 'samantha@email.com' },
   ////{ EmailAudienceGroup: 'nicole@email.com' },
   ////{ EmailAudienceGroup: 'natasha@email.com' },
   ////{ EmailAudienceGroup: 'michael@email.com' },
   ////{ EmailAudienceGroup: 'nicolas@email.com' }
   ////            ];

   //            //$scope.multipleDemo.selectedPeople = [$scope.people[3], $scope.people[4]];
   //            //alert($scope.people[3]);
   //            $scope.emailcommunications = response.data;
             
   //            //alert($scope.people[3]);
   //            //$scope.multipleDemo.selectedPeople = [{ "EmailAudienceGroup": "BQO@butec.com.lb" }];
             
           
   //            ////$scope.emailcommunications.EmailAudienceGroup = "adam@email.com;estefania@email.com";
   //            //var res = $scope.emailcommunications.EmailAudienceGroup.split(";");
               
   //            //for (var i = 0; i < res.length; i++) {
   //            //    //alert(res.length);
   //            //    //alert(res[i]);
   //            //    $scope.multipleDemo.selectedPeople.push({
   //            //        EmailAudienceGroup: res[i],
   //            //    });
   //            //}
   //            hideLoader();
   //        },
   //        function error(response) {
   //            alert(response.statusText);
   //        });
   // } else {
   //     //$scope.emailcommunications.EmailSubject = 'EmailSubject';
   //     //$scope.emailcommunications.EmailBody = '<p><img style="width: 160px;" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4RNWRXhpZgAATU0AKgAAAAgACwEAAAQAAAABAAAQIAEBAAQAAAABAAAJEgEPAAIAAAAIAAAIngEQAAIAAAAIAAAIpgESAAMAAAABAAYAAAExAAIAAAANAAAIrgEyAAIAAAAUAAAIvAITAAMAAAABAAEAAIdpAAQAAAABAAAI0JycAAEAAAAaAAATNOocAAcAAAgMAAAAkgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFNBTVNVTkcAU00tTjkwMABOOTAwWFhTRUJRRDIAADIwMTc6MDg6MjIgMTQ6Mzg6MTEAAB6CmgAFAAAAAQAAEkqCnQAFAAAAAQAAElKIIgADAAAAAQACAACIJwADAAAAAQCgAACQAAAHAAAABDAyMjCQAwACAAAAFAAAElqQBAACAAAAFAAAEm6SAQAFAAAAAQAAEoKSAgAFAAAAAQAAEoqSAwAFAAAAAQAAEpKSBAAFAAAAAQAAEpqSBQAFAAAAAQAAEqKSBwADAAAAAQACAACSCQADAAAAAQAAAACSCgAFAAAAAQAAEqqSfAAHAAAAYgAAErKSkQACAAAAAzAwAACSkgACAAAAAzAwAACgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAECCgAwAEAAAAAQAACRKgBQAEAAAAAQAAExSkAgADAAAAAQAAAACkAwADAAAAAQAAAACkBQADAAAAAQAfAACkBgADAAAAAQAAAACkIAACAAAADAAAEyjqHAAHAAAIDAAACj7qHQAJAAAAAQAAEFQAAAAAHOoAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAFAAAABYAAAAKMjAxNzowODoyMiAxNDozODoxMQAyMDE3OjA4OjIyIDE0OjM4OjExAAAAAbAAAABkAAAA4wAAAGQAAABTAAAAZAAAAAAAAAAKAAAA4wAAAGQAAAGkAAAAZAcAAQAHAAQAAAAwMTAwAgAEAAEAAAAAIAEADAAEAAEAAAAAAAAAEAAFAAEAAABaAAAAQAAEAAEAAAAAAAAAUAAEAAEAAAABAAAAAAEDAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAgAHAAAABDAxMDAAAAAAAABDMTNMU0hEMDJTQQB1AHMAZQByACAAYwBvAG0AbQBlAG4AdAAAAP/hCctodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj48eG1wOkNyZWF0ZURhdGU+MjAxNy0wOC0yMlQxNDozODoxMTwveG1wOkNyZWF0ZURhdGU+PHhtcDpDcmVhdG9yVG9vbD5OOTAwWFhTRUJRRDI8L3htcDpDcmVhdG9yVG9vbD48L3JkZjpEZXNjcmlwdGlvbj48L3JkZjpSREY+PC94OnhtcG1ldGE+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAEBAQEBAQEBAQEBAQECAgMCAgICAgQDAwIDBQQFBQUEBAQFBgcGBQUHBgQEBgkGBwgICAgIBQYJCgkICgcICAj/2wBDAQEBAQICAgQCAgQIBQQFCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAj/wAARCABoAKADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+gJnmnSVkJ5Bw7j5Qf69q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" data-filename="Naji20170822_143811.jpg">ghghghghghg<br></p>';
   //     //$scope.emailcommunications.EmailAudiencePerson = 'EmailAudiencePerson';

   //     //$scope.dbmultipleDemo = {};
   //     //$scope.multipleDemo = {};
   //     //$scope.multipleDemo.selectedPeople = [{ "EmailAudienceGroup": "pnajm@butec.com.lb" }];
   //     //$scope.dbmultipleDemo.dbselectedPeople = [];

   //     //$scope.multipleDemo.selectedPeople = [];

   //     //$scope.emailcommunications.EmailAudienceGroup = "Administrator@butec.com.lb;pgrondier@butec.com.lb";
   //     //var res = $scope.emailcommunications.EmailAudienceGroup.split(";");
   //     //alert(res[0]);
   //     //for (var i = 0; i < res.length; i++) {
   //     //    $scope.dbmultipleDemo.dbselectedPeople.push({

   //     //        EmailAudienceGroup: res[i],
   //     //    });
   //     //}


       
   //     //console.log($scope.dbmultipleDemo.dbselectedPeople);

   //     hideLoader();
   // }

    $scope.saveemailcommuniation = function () {

        var validationMessage = '';

        if ($scope.emailcommunications.EmailSubject == ''){
            validationMessage = validationMessage + 'Email Subject is missing\n';

        }

        if ($scope.emailcommunications.id_EmailTemplate == 'undefined' || $scope.emailcommunications.id_EmailTemplate == '') {
            validationMessage = validationMessage + 'Email Template is missing\n';

        }

        if ($scope.emailcommunications.EmailBody == '') {
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

    $scope.sendemailcommuniation = function () {

    }

   
   

    

    //$scope.indexemailCommuniation = function (index) {
    //    $scope.DestinationIndex = index;
    //    //alert(index)
    //    $scope.dataemailCommuniation = angular.copy($scope.emailcommunications[index]);
    //}




    //$scope.people = [
    //  { name: 'Adam', email: 'adam@email.com'},
    //  { name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina' },
    //  { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
    //  { name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador' },
    //  { name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador' },
    //  { name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States' },
    //  { name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia' },
    //  { name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador' },
    //  { name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia' },
    //  { name: 'Nicolás', email: 'nicolas@email.com', age: 43, country: 'Colombia' }
    //];
    //hideLoader();

  

    //$scope.emailcommunications.EmailAudienceGroup = "Administrator@butec.com.lb;pgrondier@butec.com.lb";
    //var res = $scope.emailcommunications.EmailAudienceGroup.split(";");
    ////alert(res[0]);
    //for (var i = 0; i < res.length; i++) {
    //    $scope.multipleDemo.selectedPeople.push({

    //        EmailAudienceGroup: res[i],
    //    });
    //}

   


    //$scope.submitForm = function (isValid) {
    //    alert($scope.multipleDemo.selectedPeople[0].email);
    //    if (isValid) {
    //        alert('valid');
    //    }
    //    else {
    //        alert('not valid')
    //    }


    //};

});







