/* eslint-disable */
(function ($, Drupal, window, document, undefined) {
  'use strict';
  // set tabindex to 0 to make keyboard focusable
  window.addEventListener('DOMContentLoaded', (event) => {
      var simplebars = $('.simplebar-content-wrapper');
      $.each(simplebars, function(i, val){
        $(simplebars[i]).attr('tabindex', '0');
      });
  });

})(jQuery, Drupal, this, this.document);
