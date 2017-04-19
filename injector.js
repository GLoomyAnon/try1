var atopxl = document.createElement('script');
atopxl.src = chrome.extension.getURL('script.js');
(document.head || document.documentElement).appendChild(atopxl);
atopxl.onload = function () {
    atopxl.parentNode.removeChild(atopxl);
};

var apScr = document.createElement('script');
apScr.src = chrome.extension.getURL('pxls_app.js');
(document.head || document.documentElement).appendChild(apScr);
apScr.onload = function () {
    apScr.parentNode.removeChild(apScr);
};


