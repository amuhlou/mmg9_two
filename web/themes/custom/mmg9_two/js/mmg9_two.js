/* eslint-disable */
(function ($, Drupal, window, document, undefined) {
    'use strict';
    var mmg9ThemeLoaded = false;
    var mmg9ListingsAnimationsLoaded = false;
    var mmg9TabsLoaded = false;
  
    $('select').not('.select2-disable').select2();
  
  
    Drupal.behaviors.mmg9Header = {
      attach: function (context, settings) {
        if (!mmg9ThemeLoaded) {
          Drupal.behaviors.mmg9Header.storeFacebookVideoDimensions();
          Drupal.behaviors.mmg9Header.resizeFacebookVideos();
  
          const navToggle = document.getElementById('nav-toggle');
          if (navToggle) {
            navToggle.addEventListener('click', function(e){
                let menuDiv = document.getElementById('main-menu');
                
                if (menuDiv.classList.contains('opened')) {
                    e.target.classList.remove('opened');
                    e.target.setAttribute('aria-expanded', false);
                    menuDiv.classList.remove('opened');
                } else {
                    e.target.classList.add('opened');
                    e.target.setAttribute('aria-expanded', true);
                    menuDiv.classList.add('opened');
                }
            });
          }
  
          var themeid;
          $(window).resize(function() {
              clearTimeout(themeid);
              themeid = setTimeout(themeDoneResizing, 200);
          });
  
          function themeDoneResizing() {
            Drupal.behaviors.mmg9Header.resizeFacebookVideos();
          }
  
                // set up the mutation observer
          var observer = new MutationObserver(function (mutations, me) {
            // `mutations` is an array of mutations that occurred
            // `me` is the MutationObserver instance
            var tabstoggle = document.querySelector(".expand-admin-menu");
            if (tabstoggle) {
              $(tabstoggle).on('click', function(){
  
                  console.log('click');
                  var tabsDiv = $('.block-tabs-wrapper');
                  tabsDiv.toggleClass('closed opened');
  
              });
              me.disconnect(); // stop observing
              return;
            }
          });
          // start observing
          observer.observe(document, {
            childList: true,
            subtree: true
          });
          mmg9ThemeLoaded = true;
        }
      },
  
      /** Ease responsive behavior of facebook posts embedded via wysiwyg **/
      storeFacebookVideoDimensions: function() {
        if ( $("iframe[src*='www.facebook.com']").length) {
          $("iframe[src*='www.facebook.com']").each(function(index){
            var iframeOldWidth = $(this).width();
            var iframeOldHeight = $(this).height();
            $(this).attr("data-width-original", iframeOldWidth);
            $(this).attr("data-height-original", iframeOldHeight);
          });
        }
      },
  
      resizeFacebookVideos: function() {
        if ( $("iframe[src*='www.facebook.com']").length) {
          $("iframe[src*='www.facebook.com']").each(function(index){
            var iframeParent = $(this).parent();
            var iframeParentWidth = iframeParent.innerWidth();
            var iframeOriginalHeight = $(this).attr('data-height-original');
            var iframeOriginalWidth = $(this).attr('data-width-original');
            var iframeOldWidth = $(this).width();
            var iframeOldHeight = $(this).height();
            if (iframeOriginalWidth < iframeParentWidth) {
              $(this).attr("width", iframeOriginalWidth);
              $(this).attr("height", iframeOriginalHeight);
            } else {
              $(this).attr("width", iframeParentWidth);
              $(this).attr("height", iframeOldHeight * (iframeParentWidth / iframeOldWidth));
            }
            $(this).css('background-color', '#f0f0f0');
          });
        }
      }
  
    };
  
    Drupal.behaviors.mmg9ListingsAnimations = {
      attach(context, drupalSettings) {
  
        if (!mmg9ListingsAnimationsLoaded) {
          // Use fading instead of views ajax throbber
          // Throbber is hidden in _system.scss
          $(document).ajaxSend(function(event, jqxhr, settings) {
            if (typeof settings.url !== "undefined" && settings.url.indexOf('/views/ajax') != -1) {
              if (settings.data.indexOf('view_name=') != -1) {
                $('.views-row').css('opacity',1).animate({opacity:0.25}, 600);
                $('.loading').fadeIn('fast');
              }
            }
          });
  
          $(document).ajaxSuccess(function(event, jqxhr, settings) {
            if (typeof settings.url !== "undefined" && settings.url.indexOf('/views/ajax') != -1) {
              if (settings.data.indexOf('view_name=') != -1) {
                $('.views-row').css('opacity',0.25).animate({opacity:1}, 600);
                $('.loading').fadeOut();
              }
            }
          });
  
          mmg9ListingsAnimationsLoaded = true;
        }
      }
    };
  })(jQuery, Drupal, this, this.document);
  