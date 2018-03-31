$('[data-provide="datepicker-inline"]').on('changeDate', function (ev) {
    $(this)[0].value = ev.target.value;
});
$('.datapickergroup').datepicker({ autoclose: true });
$('.date').datepicker({ autoclose: true });
$('.select2').select2({ autoClear: true });
$('.infotooltip').tooltip();

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

(function ($) {
    $.QueryString = (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);

function showLoader()
{
    $("#loader").show();
    $(".btnSection").hide();
}
function hideLoader() {
    $("#loader").hide();
    $(".btnSection").show();
}

function showValidationMessage(msg) {
    alert(msg);
}
function isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

function supportBorderLess() {
    if (window.location.toString().indexOf("borderless=1") > 0) {
        $('body').addClass('iframeMode');
        $('a').each(function () {
            var lnk = $(this).attr('href');
            if (lnk != '' && lnk != 'void()')
                $(this).attr('href', addParameterToUrl(lnk, "borderless=1"));
        });
    }
}
function addParameterToUrl(url, parameter) {
    if (url.indexOf("?") > 0)
        return url + "&" + parameter;
    else if (url.indexOf("{{") == 0)
        return url + "&" + parameter;
    else
        return url + "?" + parameter;
}
function redirect(url) {
    if (window.location.toString().indexOf("borderless=1") > 0)
        window.location = addParameterToUrl(url, "borderless=1");
    else
        window.location = url;
}

function showRequestErrorMessage(response) {
    $("#errorModal").modal()
}

$(document).ready(function () {
    if (document.getElementById('calendar') != null) {
        $('#calendar').fullCalendar({
        });
        var events = jQuery.parseJSON($('#hidCalendarData').val());
        events.forEach(function (item) {
            $('#calendar').fullCalendar('renderEvent', item, true);
        });
    }
});

$('.OneClick').on('click', function () {
    $(this).prop("disabled", true);
});