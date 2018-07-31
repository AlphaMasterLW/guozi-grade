(function($,window,document,undefined){
  $.ajaxSetup({ cache: false });
  var util = {};

  util.setIframeHeight = function(iframe){
    if (iframe) {
      var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
      if (iframeWin.document.body) {
        iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
      }
    }
  }

  util.getObjectURL = function(file) {
    if(!file) return '';
    var url = '' ;
    if (window.createObjectURL!=undefined) { // basic
      url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
      url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
      url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
  }

  util.addZero = function(n){
    return n < 10 ? '0'+n : ''+n;
  }

  window.util = util;
})(jQuery,window,document)
