var isIe9AndBelow = /MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) < 10;
if (isIe9AndBelow)
{
    $('#unsupportedBrowser').show();
}