// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

// ==========================================================================
// Detect Column Size
// https://github.com/viljamis/detectMQ.js
// ==========================================================================

var detect_mq = {
  live: true, // Boolean: Trigger on window resize, true or false
  threshold: 50, // Integer: Threshold time after window resize, in milliseconds
  callback: function () {

	  if(dmq_size == 0) {
		  log('The grid is currently fluid');
	  } else {
		  log('The grid is ' + dmq_size + ' columns wide');
	  }

  }
};


(function (win) {

  // Default settings
  var dmq_timeout,
    doc       = win.document,
    dmq       = win.detect_mq || {},
    live      = dmq.live || true,
    threshold = dmq.threshold || 200,
    callback  = dmq.callback || {},

    // Get style
    getStyle = function (el, pseudo, cssprop) {
      return win.getComputedStyle(el, pseudo)[cssprop];
    },

    // Get value
    getValue = function () {
      var dmq_contentValue = getStyle(doc.head, "", "width");
      dmq_size = parseFloat(dmq_contentValue);
      callback();
    };

  // Add event listeners, W3C event model
  if (doc.addEventListener) {
    win.addEventListener("load", getValue, false);
    if (live === true) {
      win.addEventListener("resize", function () {
        clearTimeout(dmq_timeout);
        dmq_timeout = setTimeout(getValue, threshold);
      }, false);
    }
  }

}(this));