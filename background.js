chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if(details.url)
            return {redirectUrl: "https://rawgit.com/Deklost/ruspxlmod/master/gg.js" };
        /*if( details.url == "https://pxls.space/pxls.js" )
            return {redirectUrl: "https://arma3.ru/pxls_app.js" };*/
    },
    {urls: ["*://pxls.space/*.js"]},
    ["blocking"]
);