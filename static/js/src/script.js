// Analytics
// =============================================================================

var _gaq = _gaq || [],
    _gaBounce;

// standard account tracking declared domain capabilities
_gaq.push(['_setAccount', 'UA-XXXXXXXX-X']);
_gaq.push(['_setDomainName', 'example.com']);

// deliver pageview data after assembling the _gaq
_gaq.push(['_trackPageview']);

// 15-second bounce rate timer
_gaBounce = setTimeout(function () {
    _gaq.push(['_trackEvent', '15_seconds', 'read']);
}, 15000);

// ga init
(function() {

    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

})();