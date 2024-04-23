this.TNC = this.TNC || {};
this.TNC.HighlightShare = (function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  // Highlight and Share component JS goes here

  /** Highlight and Share Class. */
  class HighlightShare {
      /**
       * Share constructor
       */
      constructor() {
      this.allowedPaths = ["/en-us/get-involved/how-to-help/places-we-protect/"];
          this.initialize();
      }
      /**
       * Initialization function
       */
      initialize() {
          let _self = this;
          let isEnabled = $__default["default"]("input#show-hide-highlight-and-share").val(),
              channelsList = $__default["default"]("input#social-channels-highlight-and-share").val(),
              channels = [];

          if (isEnabled && isEnabled === "true" && channelsList) {
              let strx = channelsList.split(' || ');
              let _channels = [];
              _channels = _channels.concat(strx);

              for (let i = 0; i < _channels.length; ++i) {
                  if (_self.isValidChannels(_channels[i])) {
                      channels.push(_self.isValidChannels(_channels[i]));
                  }
              }
          }
          ShareThis({
              sharers: channels,
              selector: ".cd-main-content"
          }).init();
          this.bindEvents();
      }

      isValidChannels(ch) {
          /* eslint-disable */
          let _availableChannels = {
              'facebook': ShareThisViaFacebook,
              'twitter': ShareThisViaTwitter,
              'linkedin': ShareThisViaLinkedIn
          };
          /* istanbul ignore else */
          if (_availableChannels[ch]) {
              return _availableChannels[ch];
          }
          /* istanbul ignore next */
          return false;
          /* eslint-enable */
      }

  bindEvents() {
      $__default["default"](document).on('click', '.share-this-popover a', function(evt) {
        console.log("It is happening!");
        let $link = $__default["default"](evt.target);
        if (!$link.is("a")) {
          $link = $__default["default"](evt.target.closest("a"));
        }
       let href = $link.attr("href");
        let shareParams = href.substring(href.indexOf("?")+1);
        for (let i=0; i < this.allowedPaths.length; i++) {
            let path = this.allowedPaths[i];
            if (shareParams.includes(path) && window.location.search !== "" && !href.startsWith("https://www.linkedin.com")) {
                let filtered_path = path + this.sanitize(window.location.search);
                if (!shareParams.includes(filtered_path)) {
                    $link.attr("href",href.replace(path,filtered_path));
                    break;
                }
            }
        }
        let platform = $link.parent().attr('data-share-via');
        let data = {
          'event_name': 'social_share',
          'social_share_id': `${window.location.hostname}.sharehghlt.` + platform,
          'social_share_platform': platform,
          'event_action': platform + "-highlight",
          'event_category':'social share'
        };
        console.log(data);
        
        try {
          utag.link(data);
          console.log("Tags success!");
        } catch (err) {
         console.log("Tags failed!");
        }
      }.bind(this));
    }
  }

  var highlightShare_component = new HighlightShare();

  return highlightShare_component;

})($);
//# sourceMappingURL=highlight-share.component.js.map

this.TNC = this.TNC || {};
this.TNC.SocialShare = (function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  // SocialShare component JS goes here

  class SocialShare {

    constructor(element, options) {
      const defaults = {
        stickTo: window
      };

      this.allowedPaths = ["/en-us/get-involved/how-to-help/places-we-protect/"];

      this.element = element;
      this.$element = $__default["default"](element);
      this.$placeholder = $__default["default"]('<div></div>');

      let metadata = this.$element.data();

      this.settings = $__default["default"].extend({}, defaults, metadata, options);

      this.initialize();
    }

    initialize() {
      this.$element.removeClass('social-share--sticky');
      this.isSticky = false;
      this.initTop = this.$element.offset().top;

      this.$stickTo = $__default["default"](this.settings.stickTo);
      this.bindEvents();
      // this.decide();
    }

    stick() {
      let top = 0;

      this.$placeholder.css({
        height: `${this.$element.outerHeight()}px`
      });

      this.$element
        .addClass('social-share--sticky')
        .after(this.$placeholder);

      if (this.$stickTo.length && this.settings.stickTo !== window) {
        top = $__default["default"](this.$stickTo).get(0).getBoundingClientRect().bottom;

        this.$element.css({
          top: top
        });
      }

      this.isSticky = true;
    }

    unstick() {
      this.$placeholder.remove();
      this.$element.removeClass('social-share--sticky').css({
        top: ''
      });

      this.isSticky = false;
    }

    decide() {
      if (window.scrollY >= this.initTop && !this.isSticky) ; else if (window.scrollY < this.initTop && this.isSticky) ;
    }

    sanitize(qs) {
      let sanitized = "";
      let unsanitized = qs.split("&");
      for (let i=0; i<unsanitized.length; i++) {
          if (unsanitized[i].includes("wcmmode")) {
              unsanitized.splice(i,1);
              continue;
          }
          let pairs = unsanitized[i].split("=");
          for (let x=0; x<pairs.length; x++) {
              let param = decodeURIComponent(pairs[x]);
              param = param.replace(/\s/g,'+');
              pairs[x] = param.replace(/[^a-zA-Z0-9+_\-,\s]/g,'');

          }
          unsanitized[i] = pairs.join("=");
      }
      if (unsanitized.length > 0) {
          sanitized = "?" + unsanitized.join("&");
      }
      return encodeURIComponent(sanitized);
    }

    bindEvents() {
      $__default["default"](window).scroll(() => {
        this.decide();
      });

      $__default["default"]('.social-share__icon a').on('click', function (evt) {
        let $link = $__default["default"](evt.target);
        if (!$link.is("a")) {
          $link = $__default["default"](evt.target.closest("a"));
        }
        let href = $link.attr("href");
        let shareParams = href.substring(href.indexOf("?")+1);
        for (let i=0; i < this.allowedPaths.length; i++) {
            let path = this.allowedPaths[i];
            if (shareParams.includes(path) && window.location.search !== "" && !href.startsWith("https://www.linkedin.com")) {
                let filtered_path = path + this.sanitize(window.location.search);
                if (!shareParams.includes(filtered_path)) {
                    $link.attr("href",href.replace(path,filtered_path));
                    break;
                }
            }
        }
        let data = {
          'event_name': 'social_share',
          'social_share_id': `${window.location.hostname}.share.${$link.data('platform')}`,
          'social_share_platform': $link.data('platform')
        };

        try {
          utag.link(data);
        } catch (err) {
          // don't care
        }
      }.bind(this));

      $__default["default"]('.social-share__language-selector a').on('click', function (evt) {
        var $link = $__default["default"](evt.target);
        var linkText = $link.text();
        var data = {
            'event_name': 'language_toggle',
            'selected_language': linkText,
        };

        try {
            utag.link(data);
        }
        catch (err) {
            // don't care
        }
      });

    }
  }

  $__default["default"].fn.socialShare = function(options) {
    return this.each(function() {
      return new SocialShare(this, options);
    });
  };


  $__default["default"](function() {
    $__default["default"]('.social-share').socialShare();
  });

  var socialShare_component = $__default["default"].fn.socialShare;

  return socialShare_component;

})($);
//# sourceMappingURL=social-share.component.js.map

this.TNC = this.TNC || {};
this.TNC.BackToTop = (function ($, utl) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

  // Back To Top component JS goes here

  class BackToTop {

    constructor() {
      if ($__default["default"]('#back-to-top')) {
        this.initialize();
      }
    }

    initialize() {
      // Move the Back to Top button to the end of the page footer so it
      // will be reachable by keyboard if someone tries to tab to it.
      $__default["default"]('#back-to-top').appendTo('footer');

      // UX-411 Back to Top - scroll functionality hide/show
      $__default["default"](window).scroll(function() {
        if ($__default["default"](document).scrollTop() > 1500) {
          $__default["default"]('#back-to-top').removeAttr('style');
          $__default["default"]('#back-to-top').addClass('_visible');
        } else {
          $__default["default"]('#back-to-top').removeClass('_visible');
        }
      });

      // UX-411 Back to Top - button click
      $__default["default"]('#back-to-top').on('click', function(e) {
        e.preventDefault();
        $__default["default"]('html, body').animate({scrollTop:0}, '300');
        var _analytics = {
          'event_name': 'back_to_top'
        };
        utl__default["default"].setAnalyticsByPage(_analytics, true);
      });
    }

  }

  var backToTop_component = new BackToTop();

  return backToTop_component;

})($, TNC.Utility);
//# sourceMappingURL=back-to-top.component.js.map

this.TNC = this.TNC || {};
this.TNC.FeaturedContent = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    var analitycs = {
        "featured_cta": (feature_type, feature_button_type) => ({
            'event_name': 'feature_cta_click',
            feature_button_type,
            feature_type
        })
    };

    // Featured Content component JS goes here

    /** Featured Content Class. */
    class FeaturedContent {
        /**
         * constructor
         */
        constructor(el) {
            const featuredButton_primary = el.querySelector('.c-featured-content__button.btn-primary');

            $__default["default"](featuredButton_primary).on('click', (event) => {
                const feature_primary = el.querySelector('.c-featured-content__label');
                const featureType_primary = $__default["default"](feature_primary).data('featuretype');
                utag.link(analitycs.featured_cta(featureType_primary, $__default["default"](event.currentTarget).hasClass('btn-primary') ? 'primary' : 'none'));// eslint-disable-line
            });

            const featuredButton_secondary = el.querySelector('.c-featured-content__button.btn-secondary');

            $__default["default"](featuredButton_secondary).on('click', (event) => {
                const feature_secondary = el.querySelector('.c-featured-content__label');
                const featureType_secondary = $__default["default"](feature_secondary).data('featuretype');
                utag.link(analitycs.featured_cta(featureType_secondary, $__default["default"](event.currentTarget).hasClass('btn-secondary') ? 'secondary' : 'none'));// eslint-disable-line
            });
        }
    }

    class FeaturedContentInit {
        constructor() {
            this.initialize();
        }

        initialize() {
            $__default["default"](".close-button-featured-content").on("keypress",
                this.modalDialogCloseKeyPress);

            Array.from(document.querySelectorAll('.c-featured-content')).forEach(el => {
                new FeaturedContent(el);
            });
        }

        // If the Enter key is pressed when keyboard focus is on the Close button
        // of the modal dialog, close the dialog.
        modalDialogCloseKeyPress(event) {
            var key = event.key;
            if (key === "Enter") {
                $__default["default"](".close-button-featured-content").trigger("click");
            }
        }
    }

    var featuredContent_component = new FeaturedContentInit();

    return featuredContent_component;

})($);
//# sourceMappingURL=featured-content.component.js.map

this.TNC = this.TNC || {};
this.TNC.FullWidthPhotoCta = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Full Photo Divider Cta component JS goes here
    /** Full Photo Divider Cta Class. */
    class FullWidthPhotoCta {
        /**
         * FullWidthPhotoCta constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            $__default["default"](".c-feature-one-column-with-image .c-image-credit_toggle").on(
                "keypress", this.imageCreditKeyPress);

            this.rerenderComponent();
            $__default["default"](window).resize(() => {
                this.rerenderComponent();
            });
        }

        rerenderComponent() {
            setTimeout(() => {
                /* istanbul ignore else  */
                if ($__default["default"]('.c-full-width-button').length) {
                    let btnContainerHeight = $__default["default"]('.c-full-width-button').closest('.c-feature-one-column-with-image').find('.c-full-width-btn-container').height();
                    if (btnContainerHeight > 100) {
                        $__default["default"]('.c-full-width-button').addClass('c-rm-margin');
                        $__default["default"]('.c-full-width-button-primary').addClass('c-rm-margin');
                    } else {
                        $__default["default"]('.c-full-width-button').removeClass('c-rm-margin');
                        $__default["default"]('.c-full-width-button-primary').removeClass('c-rm-margin');
                    }
                }
            }, 100);
        }
    }

    var fullWidthPhotoCta_component = new FullWidthPhotoCta();

    return fullWidthPhotoCta_component;

})($);
//# sourceMappingURL=full-width-photo-cta.component.js.map

this.TNC = this.TNC || {};
this.TNC.ImageTextExpansion = (function ($, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    // Image and text expansion component JS goes here
    /** Image and text expansion Class. */
    class ImageTextExpansion {

        /**
         * constructor
         */
        constructor() {
            this.registerWindowResizeListener();
            this.registerOnClickListener();
        }
        
        /**
         * In the event of a window resize, the size of component images may adjust.
         * Therefore, the height of the description div needs to be updated if it is not expanded.
         */
        registerWindowResizeListener() {
            $__default["default"](window).resize(() => {
                $__default["default"]('.c-image-text-expansion').each((index, el) => {
                    if ($__default["default"](el).find(".c-image-text-expansion__text--expanded").length === 0) {
                        this.updateDescriptionHeight(el, "collapse");
                    }
                });
            });
        }

        /**
         * Register the click listener for the text expansion button.
         */
        registerOnClickListener() {
            Array.from(document.querySelectorAll('.c-image-text-expansion')).forEach(el => {
                /*
                Array.from(el.querySelectorAll('.c-image-text-expansion__button')).forEach(element => {
                    $(element).on('click', (event) => {
                        const textBlock = el.querySelector('.c-image-text-expansion__text');
        
                        if ($(event.currentTarget).hasClass('c-image-text-expansion__button--collapse')) {
                            textBlock.style.paddingTop = "0";
                            textBlock.style.paddingBottom = "0";
                            $(textBlock).toggleClass("c-image-text-expansion__text--expanded");
                            this.updateDescriptionHeight(el, "collapse");

                            $(el)[0].scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });
                        } else {
                            const verticalPadding = textBlock.offsetTop;
                            textBlock.style.paddingTop = verticalPadding.toString() + "px";
                            textBlock.style.paddingBottom = verticalPadding.toString() + "px";

                            $(textBlock).toggleClass("c-image-text-expansion__text--expanded");
                            this.updateDescriptionHeight(el, "expand");

                            // fire analytics on expansion
                            var _analytics = {
                              'event_name': 'click_to_expand'
                            };
                            utl.setAnalyticsByPage(_analytics, true);
                        }
                        // SYS-4177
                        if (typeof window.TNC.ScrollingSlideshow !== 'undefined') {
                            window.TNC.ScrollingSlideshow.initialize();
                        }
                    });
                });
                */

                Array.from(el.querySelectorAll(
                    '.c-image-text-expansion__text-button')).forEach(element => {

                    $__default["default"](element).on('click', (event) => {
                        const textBlock = el.querySelector('.c-image-text-expansion__text');
                        let collapseClass = 'c-image-text-expansion__text-button--collapse';
                        let button = $__default["default"](event.currentTarget);

                        if (button.hasClass(collapseClass)) {
                            textBlock.style.paddingTop = "0";
                            textBlock.style.paddingBottom = "0";
                            $__default["default"](textBlock).toggleClass("c-image-text-expansion__text--expanded");
                            this.updateDescriptionHeight(el, "collapse");

                            $__default["default"](el)[0].scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                            button.text(button.data("expand-text"));
                            button.removeClass(collapseClass);
                            button.attr("aria-expanded", "false");
                        }
                        else {
                            const verticalPadding = textBlock.offsetTop;
                            textBlock.style.paddingTop = verticalPadding.toString() + "px";
                            textBlock.style.paddingBottom = verticalPadding.toString() + "px";

                            $__default["default"](textBlock).toggleClass("c-image-text-expansion__text--expanded");
                            this.updateDescriptionHeight(el, "expand");

                            button.text(button.data("collapse-text"));
                            button.addClass(collapseClass);
                            button.attr("aria-expanded", "true");

                            // fire analytics on expansion
                            var _analytics = {
                              'event_name': 'click_to_expand'
                            };
                            utl__default["default"].setAnalyticsByPage(_analytics, true);
                        }
                        // SYS-4177
                        if (typeof window.TNC.ScrollingSlideshow !== 'undefined') {
                            window.TNC.ScrollingSlideshow.initialize();
                        }
                    });
                });

            });
        }

        /**
         * Calculate and set the height of the text expansion description div such 
         * that the text does not become taller than the associated component image. 
         */
        updateDescriptionHeight(el, state) {
            let expansionText = $__default["default"](el).find(".c-image-text-expansion__text").first();
            let description = expansionText.find(".c-image-text-expansion__description").first();
            if (state === "expand") {
                description.height("");
            } else if (state === "collapse") {
                let image = $__default["default"](el).find(".c-image-text-expansion__media").first();
                let header = expansionText.find(".c-image-text__header").first();
                let expansionButton = expansionText.find(
                    ".c-image-text-expansion__text-button").first();
                let textContainer = expansionText.parent().parent();
                let descHeight;
                
                if (textContainer.css("max-width") === "100%") {
                    descHeight = Math.max(image.outerHeight() * 0.4, 200);
                } else {
                    descHeight = image.outerHeight() - header.outerHeight() - expansionButton.outerHeight() - 10;
                }

                if (!isNaN(descHeight)) {
                    description.outerHeight(descHeight, true);
                }
            }
        }
    }

    var imageTextExpansion_component = new ImageTextExpansion();

    return imageTextExpansion_component;

})($, TNC.Utility);
//# sourceMappingURL=image-text-expansion.component.js.map

this.TNC = this.TNC || {};
this.TNC.Image = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Image component JS goes here
    /** Image Class. */
    class Image {
        /**
         * Image constructor
         */
        constructor() {
                this.initialize();
            }
            /**
             * Initialization function
             */
        initialize() {
            // console.log($);
            // video variation play/pause button
            document.querySelectorAll('.c-image-video-container').forEach(video => {
              let playButton = $__default["default"](video).find('button')[0];
              let ctrlVideo = $__default["default"](video).find('video')[0];
              playButton.classList.add('pause');
              playButton.addEventListener('click', function(){
                // console.log('play Clicked', ctrlVideo, playButton, ctrlVideo.paused);

                if(ctrlVideo.paused === true){
                  ctrlVideo.play();
                  ctrlVideo.classList.toggle('play');
                  playButton.classList.add('pause');
                  playButton.classList.remove('play');
                } else {
                  ctrlVideo.pause();
                  ctrlVideo.classList.toggle('play');
                  playButton.classList.add('play');
                  playButton.classList.remove('pause');
                }
              });
            });
        }
    }

    var image_component = new Image();

    return image_component;

})($);
//# sourceMappingURL=image.component.js.map

this.TNC = this.TNC || {};
this.TNC.InPageNavigation = (function () {
    'use strict';

    // In Page Navigation component JS goes here
    // import $ from 'jquery';
    /** In Page Navigation Class. */
    class InPageNavigation {
        /**
         * InPageNavigation constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var inPageNavigation_component = new InPageNavigation();

    return inPageNavigation_component;

})();
//# sourceMappingURL=in-page-navigation.component.js.map

this.TNC = this.TNC || {};
this.TNC.PreserveOverviewDetail = (function ($, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    class PreserveOverviewDetail {
        constructor() {
            this.initialize();
        }

        initialize() {
            $__default["default"](".print-modal").on("click", this.printPreserveAnalytics.bind(this));

            // Ensure triggering Directions modal dialog moves to link anchor
            // so directions come up even if styles are turned off.
            $__default["default"](".triggerModal.c-preserve-overview__link").on("click",
                this.moveToDirectionsAnchor);

            this.handleMapError();
            this.pDetails = $__default["default"]('.c-preserve-overview__facts');
            //check for sticky header and apply position offset
            if ($__default["default"]('.cd-main-header').length && $__default["default"]('.cd-main-header').attr('data-sticky-header') === 'sticky-header' && $__default["default"]('.c-preserve-overview__facts').length) {
              if ($__default["default"]('.cd-main-header').hasClass('sticky-language')) {
                $__default["default"]('.c-preserve-overview__facts').addClass('sticky-header-offset-lang');
              } else {
                $__default["default"]('.c-preserve-overview__facts').addClass('sticky-header-offset');
              }
              // check if no other sticky components are present
              if (!$__default["default"]('.c-tab-container-links').length && !$__default["default"]('.c-anchor-links').length) {
                $__default["default"]('.c-preserve-overview__facts').addClass('_ss');
              }
              this.stickyHeaderOffsetEvent();
            }
        }

        // apply position offset when sticky header is present
        stickyHeaderOffsetEvent() {
          $__default["default"](window).scroll(function() {
            if($__default["default"]('.cd-main-header').hasClass('_sticky-down')) {
              $__default["default"]('.c-preserve-overview__facts').removeClass('_sticky-up');
              $__default["default"]('.c-preserve-overview__facts').addClass('_sticky-down');
              } else if ($__default["default"]('.cd-main-header').hasClass('_sticky-up')) {
                $__default["default"]('.c-preserve-overview__facts').removeClass('_sticky-down');
                $__default["default"]('.c-preserve-overview__facts').addClass('_sticky-up');
              }
          });
        }

        printPreserveAnalytics() {
            let preserveDetails = {
                "event_name" : "print_directions",
                "event_action" : "Preserve Overview Details",
            };
            utl__default["default"].setAnalyticsByPage(preserveDetails, true);
        }

        moveToDirectionsAnchor() {
            let anchor = $__default["default"](this).attr("href");
            window.location.replace(anchor);
        }

        // Sometimes the map fails to load. When this happens, remove it
        // from the DOM to avoid showing a broken image.
        handleMapError() {
            let mapImage = $__default["default"](".c-preserve-overview__map");

            mapImage.each(function (i, img) {
                if (!img.complete) {
                    // If the map hasn't finshed loading, listen for errors.
                    $__default["default"](img).one("error", function () {
                        reloadImg(img);
                    });
                }
                else if (img.naturalWidth === 0 && img.naturalHeight === 0) {
                    // If the image has no natural height or width, something
                    // is wrong, so try reloading it.
                    reloadImg(img);
                }
            });

            function reloadImg(img) {
                let src = img.src;

                $__default["default"].get(src).then(function () {
                    img.src = "";
                    img.src = src;
                }).catch(function () {
                    // The image is wrapped in a link to the map. Because the
                    // same link also appears below the map, remove this link
                    // (along with the image).
                    $__default["default"](img).parent().remove();
                });
            }
        }
    }

    var preserveOverviewDetail_component = new PreserveOverviewDetail();

    return preserveOverviewDetail_component;

})($, TNC.Utility);
//# sourceMappingURL=preserve-overview-detail.component.js.map

this.TNC = this.TNC || {};
this.TNC.ResourceListing = (function () {
    'use strict';

    // Resource Listing component JS goes here
    // import $ from 'jquery';
    /** Resource Listing Class. */
    class ResourceListing {
        /**
         * ResourceListing constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var resourceListing_component = new ResourceListing();

    return resourceListing_component;

})();
//# sourceMappingURL=resource-listing.component.js.map

this.TNC = this.TNC || {};
this.TNC.YoutubeVideo = (function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  /** Youtube Video Class. */
  class YoutubeVideo {
    /**
     * YoutubeVideo constructor
     */
    constructor(options) {
      this.options = options;

      this.initialize();
    }

    /**
     * Initialization function
     */
    initialize() {
      let defaults = {
        milestones: [50],
        pollingTime: 100
      };

      let settings = $__default["default"].extend(true, {}, defaults, this.options);
      this.settings = settings;

      let videoIframes = $__default["default"]('.c-video iframe[src*="youtube.com"]');
      console.log("videoIframes:", videoIframes);
      videoIframes.video(this.settings);

      // Any videos that use the enhanced player (Able Player) have their
      // iframes generated at runtime rather than from the template code,
      // so they need to be initialized after the page loads.
      $__default["default"](document).ready(function (settings) {
          if (window.AblePlayerInstances) {
              console.log("settings", settings);
              console.log("window.AblePlayerInstances:",
                  window.AblePlayerInstances);

              for (var i = 0; i < window.AblePlayerInstances.length; i++) {
                  let ablePlayerInstance = window.AblePlayerInstances[i];
                  console.log("ablePlayerInstance:", ablePlayerInstance);
                  let delayMilliseconds = 2000;
                  setTimeout(function () {
                      // Under Able Player, we can initialize with our video
                      // code, but it does not fire analytics events.
                      // Furthermore, initializing appears to interfere
                      // with the operation of the player: play and stop
                      // buttons don't toggle as expected, etc. More
                      // investigation needed. Initialization disabled for now.
                      let ablePlayerIframe = $__default["default"](ablePlayerInstance.$ableDiv).find(
                          'iframe[src*="youtube.com"]');
                      console.log("ablePlayerIframe:", ablePlayerIframe);
                      //ablePlayerIframe.video(settings);   // init. analytics
                  }, delayMilliseconds);
              }

          }
      });
    }
  }

  var youtubeVideo_component = new YoutubeVideo();

  return youtubeVideo_component;

})($);
//# sourceMappingURL=youtube-video.component.js.map

this.TNC = this.TNC || {};
this.TNC.Accordion = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    /** Accordion Class. */
    class Accordion {
        constructor() {
            this.resizeTimeout = null;
            this.initialize();
        }

        /**
         * * Initialization function
         * */
        initialize() {
            this.setChildLinksFocusable();

            $__default["default"]('.c-accordion__item').on('click', (e) => {
                // e.preventDefault();
                this.toggleHandler(e);
            });
            this.calculateVirtualHeight();
            $__default["default"](window).resize(this.calculateVirtualHeight.bind(this, true));
        }

        setChildLinksFocusable() {
            // Start off with all accordion item child links not focusable
            // with the keyboard. They become focusable when they are
            // toggled open.
            // TODO: rework this component to use progressive enhancement,
            // so it is still usable without styles or JS available.
            $__default["default"](".toggle-content-acc a").attr("tabindex", "-1");
        }

        /**
         * * ToggleHandler function
         * Toggles the accordion items
         * */
        toggleHandler(e) {
            const toggleButton = $__default["default"](e.target);
            const contentId = toggleButton.data('toggleContent'),
                contentEl = $__default["default"](`#${contentId}`);
            var tabIndexValue;
            if (contentEl.hasClass('is-visible')) {
                tabIndexValue = "-1";   // for hidden child links: prevent focus

                // Close the item.
                contentEl.on('transitionend',
                    this.removeClasses.bind(this, e, contentEl, contentId));
                contentEl.css('max-height', '1px');

                toggleButton.attr("aria-expanded", "false");
            }
            else {
                tabIndexValue = "0";   // for visible child links: allow focus

                // Open the item.
                contentEl.css('max-height', contentEl.data('virtualHeight'));
                contentEl.on('transitionend',
                    this.addClasses.bind(this, e, contentEl, contentId));

                toggleButton.attr("aria-expanded", "true");
            }
            // For child links in the section, set whether they can receive focus.
            $__default["default"](contentEl).find("a").attr("tabindex", tabIndexValue);
        }

        /**
         * Calculate the height of the toggle accordion items in a temporary
         * virtualDiv, then set the max-height for the toggled item for the
         * sliding CSS animation.
         **/
        calculateVirtualHeight(isResized) {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(() => {
                /* Create a "virtual div" at the end of the document body for
                    calculating the maximum height that each of the accordion
                    sections will have when they are visible. */
                const virtualDiv = $__default["default"]('<div class="c-accordion-virtual"></div>');
                $__default["default"](document.body).append(virtualDiv);
                // Calculate each accordion section's maximum height.
                $__default["default"]('.c-accordion__item .toggle-content-acc').each((i, el) => {
                    const $el = $__default["default"](el);
                    // Place the accordion section in a div.
                    const liContent = $__default["default"]('<div/>').html($el.html());
                    // Create a list-item wrapper with the section element's
                    // width, and append the accordion section div.
                    const liWrapper = $__default["default"]('<li/>').addClass(
                        'c-accordion__item').css('width',
                        $el.width()).append(liContent);
                    // Create an unordered list wrapper and append the list item.
                    const ulWrapper = $__default["default"](`<ul/>`).addClass(
                        'c-accordion').append(liWrapper);
                    // Empty out the virtual div and append the unordered list.
                    virtualDiv.empty().append(ulWrapper);
                    // Get the max. height of the virtual div, adding a little
                    // extra. This is apparently to prevent occasional cutting off
                    // of an item, seen especially if its text is one line.
                    const extra = 16;
                    const maxHeight = virtualDiv.height() + extra;
                    // Set a data attribute with the maximum height, which
                    // is transferred to an inline style upon toggling open.
                    $el.data('virtualHeight', maxHeight);
                    // Set the max. height style if the element is already open.
                    if (isResized === true && $el.hasClass('is-visible')) {
                        $el.css('max-height', maxHeight);
                    }
                });
                virtualDiv.empty();
            }, 300);
        }
        /**
         * * RemoveClasses function
         * Removes the is-visible class to hide the
         * current accordion item
         * */
        removeClasses(e, contentEl, contentId) {
            contentEl.off('transitionend');
            contentEl.removeClass('is-visible');
            $__default["default"](`[data-toggle-content="${contentId}"]`).removeClass('is-visible');
        }
        /**
         * * AddClasses function
         * Addss the is-visible class to show the
         * current accordion item
         * */
        addClasses(e, contentEl, contentId) {
            contentEl.off('transitionend');
            contentEl.addClass('is-visible');
            $__default["default"](`[data-toggle-content="${contentId}"]`).addClass('is-visible');
        }
    }

    var accordion_component = new Accordion();

    return accordion_component;

})($);
//# sourceMappingURL=accordion.component.js.map

this.TNC = this.TNC || {};
this.TNC.BasicTextBlock = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Basic Text Block component JS goes here
    /** Basic Text Block Class. */
    class BasicTextBlock {
        /**
         * constructor
         */
        constructor() {
                this.initialize();
            }
            /**
             * Initialization function
             */
        initialize() {

            this.toggleMore = $__default["default"](".toggle-basic-text-more");
            this.toggleLess = $__default["default"](".toggle-basic-text-less");
            this.toggleMore.on('click', (event) => this.toggleView(event));
            this.toggleLess.on('click', (event) => this.toggleView(event));

        }

        toggleView(event) {
            const componentuniqueid = $__default["default"](event.target).attr('data-componentuniqueid');
            const $contentElement = $__default["default"](".toggle-content").closest(`[data-componentuniqueid="${componentuniqueid}"]`);
            const $toggleLess = $__default["default"](".toggle-basic-text-less").closest(`[data-componentuniqueid="${componentuniqueid}"]`);
            const $toggleMore = $__default["default"](".toggle-basic-text-more").closest(`[data-componentuniqueid="${componentuniqueid}"]`);

            if (!$toggleMore.hasClass('toggle-on')) {
                $contentElement.css("display", "block").css("height", "auto");
                $toggleMore.addClass('toggle-on').css("display", "none");
                $toggleLess.css("display", "block");

                let section = $__default["default"]('.c-basic-text-block__content');
                if (section) {
                    // Set focus to the first interactive item (if any) in the section.
                    // Otherwise, don't set focus on the Less link, because it would
                    // automatically scroll to the end.
                    let firstInteractiveItem = section.find("a").get(0);
                    if (firstInteractiveItem) {
                        firstInteractiveItem.focus();
                    }
                }
            }
            else {
                $contentElement.css("display", "none").css("height", "0");
                $toggleMore.removeClass('toggle-on').css("display", "block");
                $toggleLess.css("display", "none");
                $__default["default"]("html, body").animate({ scrollTop: $__default["default"](`#${componentuniqueid}`).offset().top }, 1000);

                // Set focus to the More link.
                let moreLink = $__default["default"]('.toggle-basic-text-more');
                if (moreLink) {
                    moreLink.focus();
                }
            }
            return false;
        }

    }

    var basicTextBlock_component = new BasicTextBlock();

    return basicTextBlock_component;

})($);
//# sourceMappingURL=basic-text-block.component.js.map

this.TNC = this.TNC || {};
this.TNC.ConnectCallout = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Connect Callout component JS goes here
    /** Connect Callout Class. */
    class ConnectCallout {
        /**
         * ConnectCallout constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            this.toggle = $__default["default"](".c-connect-callout .toggle");
            this.toggle.on('click', (event) => {
                this.toggleView(event);
            });

            $__default["default"](window).on('resize', function () {
                if ($__default["default"]('.c-connect-callout').find('.toggle-content').length) {
                    if ($__default["default"](window).innerHeight() < $__default["default"](window).innerWidth()) {
                        $__default["default"]('.c-connect-callout')
                            .find('.toggle-content')
                            .css('height', 'auto')
                            .end()
                            .find('.toggle.toggle-on')
                            .addClass('toggle-on-orientation');
                    } else {
                        if ($__default["default"]('.toggle-on-orientation').length)
                            $__default["default"]('.c-connect-callout')
                                .end()
                                .find('.toggle.toggle-on.toggle-on-orientation')
                                .removeClass('toggle-on-orientation');
                    }
                }
            });
        }
        /**
         * ToggleView function
         * This method is used in the mobile viewport
         * and it toggles the visibilty of the social follow icons
         */
        toggleView(event) {
            const $elTarget = $__default["default"](event.target);
            const componentuniqueid = $__default["default"](event.target).attr('data-componentuniqueid');
            const $toggleContent = $__default["default"](`#${componentuniqueid}`).find('.toggle-content');
            let emailField = $__default["default"]($toggleContent).find('.c-connect-callout__item').hasClass('c-connect-callout__email');
            let phoneField = $__default["default"]($toggleContent).find('.c-connect-callout__item').hasClass('c-connect-callout__phone');
            if (!$elTarget.hasClass('toggle-on')) {
                if (emailField && phoneField) {
                    $toggleContent.css("display", "block").css("height", "150px");
                }
                else if (emailField || phoneField) {
                    $toggleContent.css("display", "block").css("height", "95px");
                }
                else {
                    $toggleContent.css("display", "block").css("height", "55px");
                }
                $elTarget.addClass("toggle-on fz-v7-after");
                return;
            }
            $toggleContent.css("display", "block").css("height", "0");
            $elTarget.removeClass("toggle-on");
        }
    }

    var connectCallout_component = new ConnectCallout();

    return connectCallout_component;

})($);
//# sourceMappingURL=connect-callout.component.js.map

this.TNC = this.TNC || {};
this.TNC.RelatedArticles = (function ($, ReadTime, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var ReadTime__default = /*#__PURE__*/_interopDefaultLegacy(ReadTime);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    // Related Articles component JS goes here

    /** Related Articles Class. */
    class RelatedArticles {
        /**
         * RelatedArticles constructor
         */
        constructor() {
            this.baseElement = $__default["default"](".c-related-articles");

            this.fiveUpWrapper = '.c-5-up__marker';
            this.timer = null;
            this.flag = true;
            $__default["default"](window).on("load", function () {
                $__default["default"](window).trigger('resize');
            });
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            /* istanbul ignore else */
            if ((this.fiveUpWrapper).length) {
                this.fiveUpCards = $__default["default"]('.five-up-cards').length;
                this.checkCharCount(this.fiveUpCards);
            }

            $__default["default"]('.r2a-normal .c-cards-articles__card, .r2a-normal .c-cards-articles__card-5-up, .r2a-normal.c-text-asset__marker a').on('click', this.relatedStoryClick.bind(this));

            // this.adjustHeight();

            $__default["default"](window).on('resize', () => {
                if ($__default["default"](window).width() > 1023) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.adjustHeight();
                    }, 100);
                } else {
                    $__default["default"]('.c-5up-container-manual').find('.c-5up-featured-image').height('auto');
                }
            });

            if (this.baseElement.length) {
                ReadTime__default["default"].initialize(this.baseElement);
                ReadTime__default["default"].showReadTime();
            }
        }

        /**
         * Check character count
         */

        checkCharCount(cardCount) {
            let cardTitle = [];
            let cardTitleLen = [];
            let resultStr = [];
            let cardTitleText = [];

            for (let i = 0; i <= cardCount; i++) {
                cardTitle[i] = $__default["default"]('.five-up-cards').find('.c-cards-articles__title').eq(i);
                cardTitleText[i] = $__default["default"].trim(cardTitle[i].text());
                cardTitleLen[i] = $__default["default"].trim(cardTitle[i].text()).length;
                /* istanbul ignore if */
                if (cardTitleLen[i] >= 82) {
                    resultStr[i] = cardTitleText[i].slice(0, 82);
                    cardTitle[i].text(resultStr[i]).append('...');
                }
            }
        }

        relatedStoryClick(e) {
            let currentPageName = typeof utag_data !== "undefined" ? utag_data.page_name : "";
            let relatedStoryTitle = $__default["default"](e.currentTarget).find('.c-cards-articles__title, .c-cards-articles__title-text-asset').text().trim();
            let eventAction = typeof utag_data !== "undefined" ? currentPageName : "";
            relatedStoryTitle = (typeof relatedStoryTitle === 'undefined' || relatedStoryTitle === null) ? "" : relatedStoryTitle;
            let relatedArticalDetails = {
                'event_name': 'related_story_click',
                'event_action': "clicked from " + eventAction,
                'event_category': "clicked to " + relatedStoryTitle,
                'related_story_title': relatedStoryTitle
            };
            utl__default["default"].setAnalyticsByPage(relatedArticalDetails, true);
        }

        adjustHeight() {
            let $wrapperEle = $__default["default"]('.c-5up-container-manual');
            let totalImages = 3;
            $wrapperEle.each((indx, wrap) => {
                let imagesLoaded = 0;
                let $images = $__default["default"](wrap).find('.c-5up-right-cards').find('img');
                if (this.flag) {
                    this.flag = false;
                    $images.each(function (idx, img) {
                        $__default["default"]('<img>').on('load', function () {
                            imagesLoaded++;
                            if (imagesLoaded === totalImages) {
                                imageLoaded($__default["default"](wrap));
                            }
                        }).attr('src', $__default["default"](img).attr('src'));
                    });
                } else {
                    imageLoaded($__default["default"](wrap));
                }
            });

            function imageLoaded($wrap) {
                let rightCardHeight = $wrap.find('.c-5up-right-cards').eq(0).height();
                let sepratorHeight = parseInt($wrap.find('.c-articles__separator').eq(1).css('margin-top'), 10);
                let totalHeight = (rightCardHeight * 3) + (sepratorHeight * 2);
                $wrap.find('.c-5up-featured-image').height(totalHeight);
            }
        }
    }

    var relatedArticles_component = new RelatedArticles();

    return relatedArticles_component;

})($, TNC.ReadTime, TNC.Utility);
//# sourceMappingURL=related-articles.component.js.map

this.TNC = this.TNC || {};
this.TNC.RelatedArticlesAuto = (function ($, BrowserStorage, ReadTime, utl, xhrModule) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var BrowserStorage__default = /*#__PURE__*/_interopDefaultLegacy(BrowserStorage);
    var ReadTime__default = /*#__PURE__*/_interopDefaultLegacy(ReadTime);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);
    var xhrModule__default = /*#__PURE__*/_interopDefaultLegacy(xhrModule);

    // Related Articles Auto component JS goes here 

    /** Related Articles Auto Class. */
    class RelatedArticlesAuto {
        /**
         * Footer constructor
         */
        constructor() {
            this.baseElement = $__default["default"](".c-related-articles-auto");

            this.componentWrapper = '.c-parsely';
            this.articleCardContainer = '.articles-auto';
            this.threeUpContainer = '.three-up-container';
            this.fourUpContainer = '.four-up-container';
            this.fiveUpContainerFeatured = '.five-up-container-featured';
            this.fiveUpContainer = '.five-up-container';
            this.textAssetContainer = '.text-asset-container';
            this.errorContainer = '.articles-auto-err';
            this.authorContainer = '.c-related-article-author';
            
            //this.defaultLocale = 'en_us';
            this.browserLocale = '';
            //this.siteLocale = '';
            this.geoResponse = null;
            this.usrStateCountryName = '';

            this.timer = null;
            this.flag = true;
            if (!$__default["default"](this.componentWrapper).length) {
                return;
            }
            $__default["default"](window).on("load", function () {
                $__default["default"](window).trigger('resize');
            });
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            let self = this;
            
            this.eventHandlers();
            
            this.geoCountryData = ($__default["default"]('.geoCountryHiddenData') && $__default["default"]('.geoCountryHiddenData').length > 0) ? JSON.parse($__default["default"].trim($__default["default"]('.geoCountryHiddenData').eq(0).text())) : null;
            this.geoStateData = ($__default["default"]('.geoStateHiddenData') && $__default["default"]('.geoStateHiddenData').length > 0) ? JSON.parse($__default["default"].trim($__default["default"]('.geoStateHiddenData').eq(0).text())) : null;
            utl__default["default"].checkBrowserLocale();
            //this.siteLocale = this.getSiteLocale();
            this.getUserLocalization().then(function () {
                
                if ($__default["default"](self.componentWrapper).find(self.articleCardContainer).length) {
                    $__default["default"](self.componentWrapper).find(self.articleCardContainer).each((index, ele) => {
                        self.getArticles($__default["default"](ele));
                    });
                }
                
            });
            
            if ($__default["default"](this.componentWrapper).find(this.authorContainer).length) {
                this.authorCards = $__default["default"]('.r2a-author-card').length;
                this.checkCharCount(this.authorCards);
            }

            if (this.baseElement.length) {
                ReadTime__default["default"].initialize(this.baseElement);
                // Show read times for variations that render their entries
                // at page load (e.g., By Author).
                ReadTime__default["default"].showReadTime();
            }
        }

        getComponentId($ele) {
            return $ele.closest(this.componentWrapper).data('componentId');
        }
        /**
         * getArticles function
         */
        getArticles($cardContainer) {
            const enableGeoLocation = $cardContainer.data('geolocation'),
                // authorMode = $cardContainer.data('authorMode'),
                siteLocale = $__default["default"].trim($cardContainer.data('siteLocale')).toLowerCase().replace('-', '_'),
                cmpId = this.getComponentId($cardContainer);
            
            let parsleyEndPt = $cardContainer.data('getArticlesApi');
            
            if (enableGeoLocation && enableGeoLocation === 'yes') {
                parsleyEndPt = parsleyEndPt + "&tag=" + siteLocale;
                if (this.usrStateCountryName !== '') {
                    parsleyEndPt = parsleyEndPt + "&tag=" + this.usrStateCountryName.toLowerCase();
                }
            }
            
            let obj = {
                url: parsleyEndPt,
                dataType: 'jsonp'
            };

            /* istanbul ignore if  */
            if (window.textAssestFlag) {
                delete obj.dataType;
            }

            xhrModule__default["default"].initXHR(obj).then((articles) => this.renderArticles(articles, cmpId))
                .catch((jqXHR, textStatus) => {
                    $__default["default"](`#${cmpId}`).closest(this.componentWrapper).find(this.articleCardContainer).addClass('hide');
                    $__default["default"](`#${cmpId}`).closest(this.componentWrapper).find(this.errorContainer).removeClass('hide');
                    throw Error(textStatus);
                });
        }

        adjustHeight() {
            let $wrapperEle = $__default["default"]('.c-parsely');
            let totalImages = 3;
            $wrapperEle.each((indx, wrap) => {
                let imagesLoaded = 0;
                let $images = $__default["default"](wrap).find('.c-5up-right-cards').find('img');
                if (this.flag) {
                    this.flag = false;
                    $images.each(function (idx, img) {
                        $__default["default"]('<img>').on('load', function () {
                            imagesLoaded++;
                            if (imagesLoaded === totalImages) {
                                imageLoaded($__default["default"](wrap));
                            }
                        }).attr('src', $__default["default"](img).attr('src'));
                    });
                } else {
                    imageLoaded($__default["default"](wrap));
                }
            });

            function imageLoaded($wrap) {
                let rightCardHeight = $wrap.find('.c-5up-right-cards').eq(0).height();
                let sepratorHeight = parseInt($wrap.find('.c-articles__separator').eq(1).css('margin-top'), 10);
                let totalHeight = (rightCardHeight * 3) + (sepratorHeight * 2);
                $wrap.find('.c-5up-featured-image').height(totalHeight);
            }
        }

        /**
         * renderArticles function:-
         */
        renderArticles(cards, uniqueId) {
            /* remove current URL out of the cards so we do not display current URL in the cards */
            for (var i = 0; i<cards.data.length; i++) {
                var card_link = getAbsolutePath(cards.data[i].link);
                var current_location = getAbsolutePath(window.location.href);
                var link_arr = card_link.split("/");
                var location_arr = current_location.split("/");
                while (location_arr.length > link_arr.length) {
                    location_arr.shift();
                }
                current_location = location_arr.join("/");
                if (card_link === current_location) {
                    cards.data.splice(i,1);
                }
            }

            /* display the cards */
            let $currentCardsWrapper = $__default["default"](`#${uniqueId}`).closest(this.articleCardContainer);
            if ((!cards.data.length) || (!cards.success)) {
                $currentCardsWrapper.addClass('hide');
                $currentCardsWrapper.find(this.errorContainer).removeClass('hide');
            } else {
                for (let i = 0; i < cards.data.length; i++) {
                    cards.data[i].metadata = JSON.parse(cards.data[i].metadata);
                }

                $currentCardsWrapper.find(this.errorContainer).addClass('hide');
                $currentCardsWrapper.removeClass('hide');

                let articleVariation = $currentCardsWrapper.data('variation');
                if (articleVariation === 'three-up-auto') {
                    let threeCards = cards.data.splice(0, 3);
                    const template = Handlebars.compile(this.threeUpTemplate()),
                        cardsHtml = template(threeCards);

                    $currentCardsWrapper.find(this.threeUpContainer).html(cardsHtml);
                } else if (articleVariation === 'four-up-auto') {
                    let featuredCard = cards.data.splice(0, 1);
                    let fourCards = cards.data.splice(0, 3);

                    const featuredtemplate = Handlebars.compile(this.fourUpFeaturedTemplate()),
                        featuredCardHtml = featuredtemplate(featuredCard);

                    const template = Handlebars.compile(this.threeUpTemplate()),
                        cardsHtml = template(fourCards);

                    $currentCardsWrapper.find(this.fourUpContainer).html(featuredCardHtml);
                    $currentCardsWrapper.find(this.fourUpContainer).append(cardsHtml);
                } else if (articleVariation === 'five-up-auto') {
                    $currentCardsWrapper.addClass('hide');
                    let featuredCardFiveUp = cards.data.splice(0, 1);
                    let fiveCards = cards.data.splice(0, 4);

                    const featuredTemplate = Handlebars.compile(this.fiveUpFeaturedTemplate()),
                        fiveUpFeaturedCardHtml = featuredTemplate(featuredCardFiveUp);

                    const template = Handlebars.compile(this.fiveUpTemplate()),
                        fiveUpCardsHtml = template(fiveCards);

                    $currentCardsWrapper.find(this.fiveUpContainerFeatured).html(fiveUpFeaturedCardHtml);
                    $currentCardsWrapper.find(this.fiveUpContainer).html(fiveUpCardsHtml);
                    this.totalCards = $currentCardsWrapper.find('.c-cards-articles__card-5-up').length;
                    this.checkCharCount(this.totalCards);
                    $currentCardsWrapper.removeClass('hide');
                } else if (articleVariation === 'text-asset-auto') {
                    let textAssetCards = cards.data.splice(0, 3);

                    const template = Handlebars.compile(this.textAssetTemplate()),
                        cardsHtml = template(textAssetCards);

                    $currentCardsWrapper.find(this.textAssetContainer).html(cardsHtml);
                }

                // Add any estimated read times to the rendered cards.
                if (this.baseElement.length) {
                    ReadTime__default["default"].showReadTime();
                }
            }

            function getAbsolutePath(url) {
                var a = document.createElement('a'); // dummy element
                a.href = url;   // set full url
                a.search = "";  // blank out query string
                var absolute_path = a.href.replace(/(^\w+:|^)\/\/[^/]+/, '').replace(/\.html$/, '/').replace(/([^/])$/, '$1/'); // remove the protocol and host and .html
                return absolute_path;
            }
        }

        /**
         * Check character count
         */

        checkCharCount(cardCount) {
            let autoTitle = [];
            let autoTitleLen = [];
            let resultStr = [];
            let autoTitleText = [];
            let authorTitle = [];
            let authorTitleText = [];
            let authorTitleLen = [];

            if ($__default["default"]('.c-related-article-author').length) {
                for (let i = 0; i < cardCount; i++) {
                    authorTitle[i] = $__default["default"]('.c-related-article-author').find('.r2a-author-card__title').eq(i);
                    authorTitleText[i] = $__default["default"].trim(authorTitle[i].text());
                    authorTitleLen[i] = $__default["default"].trim(authorTitle[i].text()).length;
                    if (authorTitleLen[i] >= 82) {
                        resultStr[i] = authorTitleText[i].slice(0, 82);
                        authorTitle[i].text(resultStr[i]).append('...');
                    }
                }
            }

            if ($__default["default"]('.five-up-container').length) {
                for (let i = 0; i < cardCount; i++) {
                    autoTitle[i] = $__default["default"]('.five-up-container').find('.c-cards-articles__title').eq(i);
                    autoTitleText[i] = $__default["default"].trim(autoTitle[i].text());
                    autoTitleLen[i] = $__default["default"].trim(autoTitle[i].text()).length;
                    if (autoTitleLen[i] >= 82) {
                        resultStr[i] = autoTitleText[i].slice(0, 82);
                        autoTitle[i].text(resultStr[i]).append('...');
                    }
                }
            }
        }

        /**
         * Three Up Variation
         */
        threeUpTemplate() {
            let template = `{{#each this}}
            <a href="{{this.url}}" target="{{this.metadata.target}}"
                class="c-cards-articles__card secondary-link bs_col-4
                bs_col-lg-4">
                <div class="c-cards-articles__card-container">
                    {{#if this.metadata.pageImage}}
                        <picture>
                            <source srcset="{{this.metadata.pageImage.large}} 1x,
                                    {{this.metadata.pageImage.large2x}} 2x" media="(min-width: 1280px)">
                            <source srcset="{{this.metadata.pageImage.medium}} 1x,
                                    {{this.metadata.pageImage.medium2x}} 2x" media="(min-width: 768px)">
                            <source srcset="{{this.metadata.pageImage.small}} 1x,
                                    {{this.metadata.pageImage.small2x}} 2x" media="(min-width: 0)">
                            <img src="{{this.metadata.pageImage.default}}" alt="{{this.metadata.pageImageAlt}}" class="c-cards-articles__image image-position-desktop__{{this.metadata.desktopImageCrop}} image-position-mobile__{{this.metadata.mobileImageCrop}}">
                        </picture>
                    {{else}}
                        <picture>
                            <img src="{{this.image_url}}" alt="{{this.metadata.pageImageAlt}}" class="c-cards-articles__image" />
                        </picture>
                    {{/if}}
                    <div class="c-cards-articles__content">
                        <h3 class="fz-v12 lh-v15 c-cards-articles__title r2a-title">
                            {{ this.title }}
                        </h3>
                        <p class="family-sans fz-v7 lh-v9 c-cards-articles__excerpt txt-clr-g1">
                            {{{ this.metadata.description }}}
                        </p>
                        <p class="family-sans fw-v4 fz-v4 lh-v2 c-cards-articles__byline txt-clr-g2">
                        {{#if metadata.primaryAuthor}}By {{ metadata.primaryAuthor }} {{/if}}
                        {{#if this.metadata.articleDate}}
                            {{#if metadata.primaryAuthor}}|{{/if}} {{ this.metadata.articleDate }}
                        {{/if}}
                        </p>
                        {{#if this.metadata.readTimeMinutes}}
                            <p class="c-related-articles-auto__read-time"><span
                                class="js-read-time"
                                data-minutes="{{this.metadata.readTimeMinutes}}"
                                ></span></p>
                        {{/if}}
                    </div>
                </div>
            </a>
        {{/each}}`;
            return template;
        }

        /**
         * Four Up Featured Variation
         */
        fourUpFeaturedTemplate() {
            return `{{#each this}}
        <a href="{{url}}" target="{{metadata.target}}"
            class="c-cards-articles__card is-featured secondary-link bs_col-4
            bs_col-lg-12">
            <div class="c-cards-articles__card-container">
                {{#if metadata.pageImage}}
                {{#if metadata.pageImage.default}}
                    <picture>
                    <source srcset="{{metadata.pageImage.large}} 1x,
                                {{metadata.pageImage.large2x}} 2x" media="(min-width: 1280px)">
                    <source srcset="{{metadata.pageImage.medium}} 1x,
                                {{metadata.pageImage.medium2x}} 2x" media="(min-width: 768px)">
                    <source srcset="{{metadata.pageImage.small}} 1x,
                                {{metadata.pageImage.small2x}} 2x" media="(min-width: 0)">
                    <img src="{{metadata.pageImage.default}}" alt="{{metadata.pageImageAlt}}" class="c-34up-feature_image c-cards-articles__image image-position-desktop__{{metadata.desktopImageCrop}} image-position-mobile__{{metadata.mobileImageCrop}}">
                    </picture>
                {{else}}
                    <picture>
                    <img src="{{image_url}}" alt="{{metadata.pageImageAlt}}" class="c-34up-feature_image c-cards-articles__image" />
                    </picture>
                {{/if}}
                {{/if}}
                <div class="c-cards-articles__content">
                <div>
                    <h3 class="fz-v12 lh-v15 c-cards-articles__title r2a-title">
                    {{title}}
                    </h3>
                    <p class="family-sans fz-v7 lh-v9 c-cards-articles__excerpt txt-clr-g1">
                    {{{metadata.description}}}
                    </p>
                    <p class="family-sans fw-v4 fz-v4 lh-v2 c-cards-articles__byline txt-clr-g2">
                    {{#if metadata.primaryAuthor}}By {{ metadata.primaryAuthor }} {{/if}}
                    {{#if metadata.articleDate}}
                        {{#if metadata.primaryAuthor}}|{{/if}} {{ metadata.articleDate }}
                    {{/if}}
                    </p>
                    {{#if this.metadata.readTimeMinutes}}
                        <p class="c-related-articles-auto__read-time"><span
                            class="js-read-time"
                            data-minutes="{{this.metadata.readTimeMinutes}}"
                            ></span></p>
                    {{/if}}
                </div>
                </div>
            </div>
        </a>
        {{/each}}`;
        }

        /**
         * Five Up Featured Variation
         */
        fiveUpFeaturedTemplate() {
            return `{{#each this}}
        <a href="{{url}}" target="{{metadata.target}}"
            class="c-cards-articles__card-5-up secondary-link">
        <div class="bs_container">
          <div class="bs_row mx-auto bs_no-gutters">
              <div class="bs_col-12">
                  {{!-- Image --}}
                  {{#if metadata.autoFeatureImage}}
                    {{#if metadata.autoFeatureImage.default}}
                        <picture class="c-cards-articles__width-100">
                        <source srcset="{{metadata.autoFeatureImage.large}} 1x,
                                    {{metadata.autoFeatureImage.large2x}} 2x" media="(min-width: 1280px)">
                        <source srcset="{{metadata.autoFeatureImage.medium}} 1x,
                                    {{metadata.autoFeatureImage.medium2x}} 2x" media="(min-width: 768px)">
                        <source srcset="{{metadata.autoFeatureImage.small}} 1x,
                                    {{metadata.autoFeatureImage.small2x}} 2x" media="(min-width: 0)">
                        <img src="{{metadata.autoFeatureImage.default}}" alt="{{metadata.pageImageAlt}}" class="c-5up-featured-image c-cards-articles__image image-position-desktop__{{metadata.desktopImageCrop}} image-position-mobile__{{metadata.mobileImageCrop}}">
                        </picture>
                    {{else}}
                        <picture class="c-cards-articles__width-100">
                        <img src="{{this.image_url}}" alt="{{metadata.pageImageAlt}}" class="c-cards-articles__image c-5up-featured-image" />
                        </picture>
                    {{/if}}
                  {{/if}}
              </div>

              {{!-- About Image --}}
              <div class="c-cards-articles__content c-5-up__marker bs_col-12">
                <div>
                  <h3 class="fz-v8 fz-v8-pro fz-v16-lg lhr-v8
                    c-cards-articles__title c-5-up-featured__marker
                    r2a-title">{{title}}</h3>
                  <p class="family-sans fw-v4 fz-v4 lhr-v9 c-cards-articles__byline txt-clr-g2">
                    {{#if metadata.primaryAuthor}}By {{ metadata.primaryAuthor }} {{/if}}
                    {{#if metadata.articleDate}}
                      {{#if metadata.primaryAuthor}}|{{/if}} {{ metadata.articleDate }}
                    {{/if}}
                  </p>
                  {{#if this.metadata.readTimeMinutes}}
                    <p class="c-related-articles-auto__read-time"><span
                        class="js-read-time"
                        data-minutes="{{this.metadata.readTimeMinutes}}"
                        ></span></p>
                  {{/if}}
                </div>
              </div>
          </div>
        </div>
        </a>
    {{/each}}`;
        }

        /**
         * Five Up Variation
         */
        fiveUpTemplate() {
            return `{{#each this}}
        <div class="c-articles__separator c-cards-articles__general-article-marker"></div>
        <a href="{{this.url}}" target="{{this.metadata.target}}"
            class="c-cards-articles__card-5-up c-5up-right-cards
            secondary-link">
          <div class="bs_container">
            {{!-- Image --}}
            <div class="bs_row">
              <div class="bs_col-12 bs_col-lg-4 c-articles__toggle-picture-display">
                {{#if this.metadata.pageImage}}
                  {{#if this.metadata.pageImage.default}}
                    <picture>
                      <source srcset="{{this.metadata.pageImage.large}} 1x,
                              {{this.metadata.pageImage.large2x}} 2x" media="(min-width: 1280px)">
                      <source srcset="{{this.metadata.pageImage.medium}} 1x,
                              {{this.metadata.pageImage.medium2x}} 2x" media="(min-width: 768px)">
                      <source srcset="{{this.metadata.pageImage.small}} 1x,
                              {{this.metadata.pageImage.small2x}} 2x" media="(min-width: 0)">
                      <img src="{{this.metadata.pageImage.default}}" alt="{{this.metadata.pageImageAlt}}" class="c-cards-articles__image image-position-desktop__{{this.metadata.desktopImageCrop}} image-position-mobile__{{this.metadata.mobileImageCrop}}">
                    </picture>
                  {{else}}
                    <picture>
                      <img src="{{this.image_url}}" alt="{{this.metadata.pageImageAlt}}" class="c-cards-articles__image" />
                    </picture>
                  {{/if}}
                {{/if}}
              </div>


              {{!-- About Image --}}
              <div class="bs_col-12 bs_col-lg-8 c-cards-articles__title_div">
                <h3 class="fz-v8 fz-v6-pro fz-v10-lg lhr-v11 lhr-v5-lg
                    c-cards-articles__title c-5-up__marker r2a-title">
                  {{ this.title }}
                </h3>
                <p class="family-sans fw-v4 fz-v4 lhr-v9 c-cards-articles__byline txt-clr-g2">
                    {{#if metadata.primaryAuthor}}By {{ metadata.primaryAuthor }} {{/if}}
                    {{#if this.metadata.articleDate}}
                        {{#if metadata.primaryAuthor}}|{{/if}} {{ this.metadata.articleDate }}
                    {{/if}}
                </p>
                {{#if this.metadata.readTimeMinutes}}
                    <p class="c-related-articles-auto__read-time"><span
                        class="js-read-time"
                        data-minutes="{{this.metadata.readTimeMinutes}}"
                        ></span></p>
                {{/if}}
              </div>
            </div>
          </div>
        </a>
      {{/each}}`;
        }

        /**
         * Text Asset Variation
         */
        textAssetTemplate() {
            return `{{#each this}}
            <a href="{{this.url}}" target="{{this.metadata.target}}"
                class="c-cards-articles__card-text-asset secondary-link">
                <h3 class="c-cards-articles__title-text-asset r2a-title fz-v9
                    lhr-v7 fw-v4 family-sans">
                    {{this.title}}
                </h3>
                <p class="family-sans fw-v4 fz-v4 lhr-v9 c-cards-articles__byline c-cards-articles__byline-text-asset txt-clr-g2">
                    {{#if metadata.primaryAuthor}}
                        By {{metadata.primaryAuthor}}
                    {{/if}}
                    {{#if this.metadata.articleDate}}
                        {{#if metadata.primaryAuthor}}
                            |
                        {{/if}}
                        {{this.metadata.articleDate}}
                    {{/if}}
                    {{#if this.metadata.readTimeMinutes}}
                        <p class="c-related-articles-auto__read-time"><span
                            class="js-read-time"
                            data-minutes="{{this.metadata.readTimeMinutes}}"
                            ></span></p>
                    {{/if}}
                </p>
            </a>
            <div class="c-articles__separator"></div>
        {{/each}}`;
        }

        eventHandlers() {
            $__default["default"](this.componentWrapper).
                on('click', '.related-article-auto .r2a-author-card, .related-article-auto .c-cards-articles__card-5-up, .related-article-auto .c-cards-articles__card, .related-article-auto.c-text-asset__marker a', (event) => {
                    let currentPageName = typeof utag_data !== "undefined" ? utag_data.page_name : "";
                    let relatedStoryTitle = $__default["default"](event.currentTarget).find('.r2a-title').text().trim();
                    let eventAction = typeof utag_data !== "undefined" ? currentPageName : "";
                    relatedStoryTitle = (typeof relatedStoryTitle === 'undefined' || relatedStoryTitle === null) ? "" : relatedStoryTitle;
                    let relatedArticalDetails = {
                        'event_name': 'related_story_click',
                        'event_action': "clicked from " + eventAction,
                        'event_category': "clicked to " + relatedStoryTitle,
                        'related_story_title': relatedStoryTitle
                    };
                    utl__default["default"].setAnalyticsByPage(relatedArticalDetails, true);
                });

            $__default["default"](window).on('resize', () => {
                if ($__default["default"](window).width() > 1023) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.adjustHeight();
                    }, 100);
                } else {
                    $__default["default"]('.c-parsely').find('.c-5up-featured-image').height('auto');
                }
            });
        }
        
        getUserLocalization() {
            
            let self = this;
            
            let locale = BrowserStorage__default["default"].getCookie('browserLocale');

            if (locale) {
                this.browserLocale = $__default["default"].trim(locale).toLowerCase().replace('-', '_');
            }
            
            return utl__default["default"].checkGeolocation().then(function (response) {
                self.geoResponse = response.response;
                
                const currentCountry = response.response['pulse-country'].toLowerCase();
                const currentRegion = response.response['pulse-region'].toLowerCase();
                if (currentCountry === 'usa') {
                    self.findLocation(self.geoStateData, currentRegion, 'stateCode', 'stateName');
                } else {
                    self.findLocation(self.geoCountryData, currentCountry, 'countryCode', 'countryName');
                }
                
            });

        }
        
        /*
        getSiteLocale() {
            let siteLocale = $('meta[property="og:locale"]').attr('content');
            if (siteLocale) {
                siteLocale = $.trim(siteLocale).toLowerCase().replace('-', '_');
            }
            return (siteLocale && siteLocale.length === 5) ? siteLocale : this.defaultLocale;
        }
        */
        
        findLocation(geoStateCountryData, currentRegionCountry, stateCountryCodeProp, stateCountryNameProp) {
            let stateCountryName = '';
            if (geoStateCountryData && geoStateCountryData !== null) {
                for (let i = 0; i < geoStateCountryData.length; i++) {
                    if (geoStateCountryData[i][stateCountryCodeProp] === currentRegionCountry) {
                        stateCountryName = geoStateCountryData[i][stateCountryNameProp];
                        break;
                    }
                }
            }
            this.usrStateCountryName = stateCountryName;
        }
    }

    var relatedArticlesAuto_component = new RelatedArticlesAuto();

    return relatedArticlesAuto_component;

})($, TNC.BrowserStorage, TNC.ReadTime, TNC.Utility, TNC.XHR);
//# sourceMappingURL=related-articles-auto.component.js.map

this.TNC = this.TNC || {};
this.TNC.TitleTextCta = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Title Text Cta component JS goes here
    /** Title Text Cta Class. */
    class TitleTextCta {
        /**
         * TitleTextCta constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
            let ctaContainer = $__default["default"]('div.title-text-cta.base-component div.cta-container');
            for (let i = 0; i < ctaContainer.length; i++) {
              let ctaCount = $__default["default"](ctaContainer[i]).find('a').length;
              if (ctaCount > 1) {
                 $__default["default"](ctaContainer[i]).find('.primary-cta-btn').addClass('two__btns');
               } else {
                 return;
               }
            }
        }
    }

    var titleTextCta_component = new TitleTextCta();

    return titleTextCta_component;

})($);
//# sourceMappingURL=title-text-cta.component.js.map

this.TNC = this.TNC || {};
this.TNC.BlockQuote = (function () {
    'use strict';

    // Block Quote component JS goes here
    // import $ from 'jquery';
    /** Block Quote Class. */
    class BlockQuote {
        /**
         * BlockQuote constructor
         */
        constructor() {
                this.initialize();
            }
            /**
             * Initialization function
             */
        initialize() {
            // console.log($);
        }
    }

    var blockQuote_component = new BlockQuote();

    return blockQuote_component;

})();
//# sourceMappingURL=block-quote.component.js.map

this.TNC = this.TNC || {};
this.TNC.SplitHero = (function ($, ReadTime) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var ReadTime__default = /*#__PURE__*/_interopDefaultLegacy(ReadTime);

    class SplitHero {
        constructor() {
            this.baseElement = $__default["default"](".c-split-hero");

            this.initialize();
        }

        initialize() {
            var _this = this;
            // scroll down page beyond split hero component
            $__default["default"]('.split-hero-scroll').click(function () {
              _this.splitScrollDown();
            });
            $__default["default"]('.split-hero-scroll').keypress(function(event){
              var keycode = (event.keyCode ? event.keyCode : event.which);
              if(keycode === '13'){
                _this.splitScrollDown();
              }
            });

            // Show estimated read time, if available.
            if (this.baseElement.length) {
                ReadTime__default["default"].initialize(this.baseElement);
                ReadTime__default["default"].showReadTime();
            }
        }

        splitScrollDown() {
          $__default["default"]("html, body").animate({ scrollTop: $__default["default"]('.split-hero')[0].scrollHeight + 70 }, 1000);
        }
    }

    var splitHero_component = new SplitHero();

    return splitHero_component;

})($, TNC.ReadTime);
//# sourceMappingURL=split-hero.component.js.map

this.TNC = this.TNC || {};
this.TNC.Text4UpLink = (function () {
    'use strict';

    // Text 4 Up Link component JS goes here
    // import $ from 'jquery';
    /** Text 4 Up Link Class. */
    class Text4UpLink {
        /**
         * Text4UpLink constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var text4UpLink_component = new Text4UpLink();

    return text4UpLink_component;

})();
//# sourceMappingURL=text-4-up-link.component.js.map

this.TNC = this.TNC || {};
this.TNC.RelatedEvents = (function ($, utl, xhrModule) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);
    var xhrModule__default = /*#__PURE__*/_interopDefaultLegacy(xhrModule);

    // Related Events component JS goes here

    /** Related Events Class. */
    class RelatedEvents {
        /**
         * Related Events constructor
         */
        constructor() {

            let self = this;
            this.geoCountryData = ($__default["default"]('.geoCountryHiddenData') && $__default["default"]('.geoCountryHiddenData').length > 0) ? JSON.parse($__default["default"].trim($__default["default"]('.geoCountryHiddenData').eq(0).text())) : null;
            this.geoStateData = ($__default["default"]('.geoStateHiddenData') && $__default["default"]('.geoStateHiddenData').length > 0) ? JSON.parse($__default["default"].trim($__default["default"]('.geoStateHiddenData').eq(0).text())) : null;
            this.currentCountry = '';
            this.currentRegion = '';
            this.usrCountryName = '';
            this.usrStateName = '';
            this.getUserLocalization().then(function () {
                self.initialize();
            });

        }

        /**
         * Initialization function
         */
        initialize() {
            let _self = this;
            $__default["default"](function () {
                let nodeEl = $__default["default"]('section.c-related-events');
                /* istanbul ignore if */
                if (nodeEl && nodeEl.length) {
                    $__default["default"](nodeEl).each(function () {
                        _self.init($__default["default"](`#${this.id}`));
                    });
                }
            });
        }

        //check if a value is a json object
        //@param {Object}
        checkIsJSON(m) {
            /* istanbul ignore if */
            if (typeof m === 'object') {
                try {
                    m = JSON.stringify(m);
                } catch (err) {
                    return false;
                }
            }

            if (typeof m === 'string') {
                try {
                    m = JSON.parse(m);
                } catch (err) {
                    return false;
                }
            }

            /* istanbul ignore if */
            if (typeof m !== 'object') {
                return false;
            }
            return true;
        }

        //format date into MMM D, YYYY
        //@param {Date}
        formateDate(d, isYear) {
            /* istanbul ignore else */
            if (new Date(d)) {
                var today = new Date(d);
                if (isYear) {
                    return today.toLocaleDateString("en-US", {
                        month: 'short',
                        day: '2-digit'
                    });
                }
                return today.toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                });
            }
            return d;
        }

        //format and convert to time HH:MM XM
        //@param {Date}
        formatTime(t) {
            /* istanbul ignore else */
            if (new Date(t)) {
                let time = new Date(t);
                return time.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });
            }
            return t;
        }

        //sort the array by data order
        //@parm {object, object}
        sortByDate(a, b) {
            var a = new Date(a.sortDate).getTime(), // eslint-disable-line
                b = new Date(b.sortDate).getTime(); // eslint-disable-line
            return a > b ? 1 : -1;
            // return a - b;
        }

        //sort the events by date
        //@param {Object}
        sortEventsByDate(data) {
            let _self = this;
            let startRange = new Date();

            $__default["default"].each(data, function (i, d) {
                let sortDate = null;
                if (d.fields.event_recurring === "yes") {
                    sortDate = _self.getClosestDate(startRange, d.fields.event_start_date);
                } else {
                    sortDate = _self.getClosestDate(startRange, d.fields.event_end_date);
                    if (sortDate && sortDate !== Infinity) {
                        sortDate = d.fields.event_start_date[0];
                    }
                }
                /* istanbul ignore else */
                if (sortDate && sortDate !== Infinity) {
                    d.sortDate = sortDate;
                }
            });

            data.sort(this.sortByDate);
            let __data = data.slice(0, this.noOfRecords);
            this.eventStore = __data;
        }

        //get the next closest event date
        //@param {date, array}
        getClosestDate(now, dates) {
            var closest = Infinity;

            if (dates) {
                dates.forEach(function (d) {
                    var date = new Date(d);
                    if (date >= now && date < closest) {
                        closest = d;
                    }
                });
            }

            return closest;
        }

        //check whether is one day event or happing more than one day
        //@param {Date, Date}
        isOneDayEvent(start, end) {
            let d1 = new Date(start).toDateString(),
                d2 = new Date(end).toDateString();
            if (new Date(d1).getTime() === new Date(d2).getTime()) {
                return true;
            }
            return false;
        }

        //Render the event cards
        init($el) {
            this.$el = $el;
            this.enableGeoLocation = this.$el.data('geolocation');
            let dataObj = this.$el.find("input[name='rv-data-json']").val();
            let jsonObj = this.checkIsJSON(dataObj) ? JSON.parse(dataObj) : null;
            /* istanbul ignore if */
            if (!jsonObj) {
                return;
            }

            this.contentType = jsonObj.contentType;
            this.eventType = jsonObj.eventType;
            this.awsUrl = `${jsonObj.awsSearchEndPoint}`;
            this.awsDomain = jsonObj.search_by_domain;
            this.noOfRecords = jsonObj.paginationCount;
            this.tagOne = this.$el.find("input[name='tag-0']").val();
            this.tagTwo = this.$el.find("input[name='tag-1']").val();
            this.eventStore = null;

            this.callAWSService($el);
        }

        //create the aws query to fetch data
        makeUrlQuery() {
            let currently = new Date().toISOString();
            let urlQuery = "";
            urlQuery += `q=*&q.parser=lucene`;
            if (this.enableGeoLocation && this.enableGeoLocation === 'yes') {
                let event_region_title = '';
                let event_locale_title = '';
                if (this.usrCountryName && this.usrCountryName !== '') {
                    if (this.currentCountry === 'usa' && this.usrStateName && this.usrStateName !== '') {
                        event_region_title = this.usrCountryName;
                        event_locale_title = this.usrStateName;
                    } else if (this.currentCountry === 'can') {
                        event_region_title = this.usrCountryName;
                        event_locale_title = '';
                    } else {
                        event_region_title = '';
                        event_locale_title = this.usrCountryName;
                    }
                }
                let l1 = event_region_title ? `event_region_title:'${event_region_title}'` : '';
                let l2 = event_locale_title ? `event_locale_title:'${event_locale_title}'` : '';
                urlQuery += `&fq=(and template_name:'${this.contentType}'search_by_domain:'${this.awsDomain}'(or geographic_location:'all_locations'(and ${l1}${l2}))event_start_date: ['${currently}',})`;
            } else if (this.eventType === "local-event") {
                let region = this.tagOne ? `event_region_title:'${this.tagOne}'` : '';
                let locale = this.tagTwo ? `event_locale_title:'${this.tagTwo}'` : '';
                urlQuery += `&fq=(and template_name:'${this.contentType}'` +
                    `search_by_domain:'${this.awsDomain}'` +
                    `(or geographic_location:'all_locations'` +
                    `(and ${region}` +
                    `${locale}` +
                    `))` +
                    `event_end_date: ['${currently}',}` +
                    `)`;
            } else {
                this.tagOne = this.tagOne.replace(/-/g, "_");
                this.tagTwo = this.tagTwo.replace(/-/g, "_");
                let t1 = this.tagOne ? `places_we_protect:'${this.tagOne}'` : '';
                let t2 = this.tagTwo ? `places_we_protect:'${this.tagTwo}'` : '';
                urlQuery += `&fq=(and template_name:'${this.contentType}'search_by_domain:'${this.awsDomain}'(and ${t1}${t2})event_start_date: ['${currently}',})`;
            }
            urlQuery += `&sort=event_start_date_sort asc`;
            urlQuery += `&size=24`;
            console.log("urlQuery", urlQuery);
            return encodeURI(urlQuery);
        }


        //call AWS end point
        callAWSService($el) {
            let _self = this;
            let awsUrl = this.awsUrl;

            // Temporary for local testing: alter the AWS URL to call 'dev-65'.
            // (Otherwise, with 'prod', a 403 Forbidden error is returned.)
            //awsUrl = awsUrl.replace("/prod/", "/dev-65/");
            //console.log("callAWSService: awsUrl =", awsUrl);

            let query = this.makeUrlQuery();
            let obj = {
                url: awsUrl,
                type: "GET",
                data: query,
                dataType: "json"
            };

            xhrModule__default["default"].initXHR(obj).then((data) => {
                if (data && data.hits && data.hits.found && data.hits.hit) {
                    _self.renderCardsModel($el, data.hits.hit);
                    let $filterList = $el.find('.c-cards-events__card');
    				$__default["default"].each($filterList, function (index, $filterItem) {
    					$__default["default"]($filterItem).click(function(e) {
                           e.preventDefault();
                           _self._setAnalyticsEvents($__default["default"](this).find('.c-cards-events__title').text().trim(), $__default["default"](this).attr('href'));
                           window.location.href = $__default["default"](this).attr('href');
    					});
    				});
                } else {
                    //$el.find('.c-cards-events').append(`<p class="bs_col-12">There are no related events found!</p>`);
                    $el.addClass('hideContent');
                }
            });
        }

        //sort the event cards
        //@param {Object}
        renderCardsModel($el, data) {
            this.sortEventsByDate(data);
            this.renderCardsView($el);
        }

        //render the event cards
        renderCardsView($el) {
            let _self = this;
            let htmlString = "";
            $__default["default"].each(this.eventStore, function (ii, vv) {
                htmlString += _self.cardsTemplate(vv);
            });

            $el.find('.c-cards-events').html(htmlString);
        }

        //create cards using aws response
        //@param {Object}
        // added code for volunteer type varied and multiple
        cardsTemplate(d) {
            let type = this.contentType === "volunteer-template" ? "VOLUNTEER" : "EVENT";
            let template = `<a href="${d.fields.link}" class="c-cards-events__card txt-p2-hover bs_col-md-6 bs_col-lg-4"><div class="c-cards-events__content border-primary">`;
            template += `<p class="c-cards-events__date txt-clr-p2 border-primary-sudo lhr-v3 fz-v6 family-sans fw-v4 __date">${d.fields.event_recurring === "yes" ? "Ongoing" : d.fields.volunteer_ongoing === "yes" ? "Ongoing" : d.fields.event_dates}</p>`;
            if (d.fields.event_site) {
              template += `<div class="c-cards-events__date family-sans fz-v5 fw-v3 txt-clr-p2 border-primary-sudo c-cards-event__site">
          <div class="c-cards-events__loc-icon">
            <svg width="14px" height="17px" viewBox="0 0 14 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Icon / Location</title> <desc>Created with Sketch.</desc> <g id="_Optimized-Components" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="C25-Related-Events-Feed---Location" transform="translate(-184.000000, -244.000000)" stroke="#3C3C3C"> <g id="Event-Card-1" transform="translate(155.000000, 192.000000)"> <g id="Icon-/-Location" transform="translate(30.000000, 53.000000)"> <g> <path d="M8.14348007,6.09375 C8.14348007,7.3880654 7.12402932,8.4375 5.86669435,8.4375 C4.60935939,8.4375 3.58990864,7.3880654 3.58990864,6.09375 C3.58990864,4.7994346 4.60935939,3.75 5.86669435,3.75 C7.12402932,3.75 8.14348007,4.7994346 8.14348007,6.09375 Z" id="Stroke-1" stroke-width="1.5"></path> <path d="M2.19489146,10.7266681 C1.62329017,10.0398146 1.1091844,9.30479458 0.687550587,8.51582815 C0.419238163,8.01297042 0.179673498,7.47302453 0.100617159,7.03230152 C0.0910345725,7.01303494 0.0910345725,6.98895172 0.0862432792,6.96968514 C0.0287477597,6.64215329 0,6.3001715 0,5.95337307 C0,2.66360462 2.64958519,0 5.91724721,0 C9.18970053,0 11.8392857,2.66360462 11.8392857,5.95337307 C11.8392857,6.3001715 11.810538,6.64215329 11.7530424,6.96968514 C11.7482511,6.98895172 11.7482511,7.01303494 11.7434598,7.03230152 C11.5072491,8.32942399 9.92037275,10.3374832 9.92037275,10.3374832 L5.97665925,14.9359341 C5.90287333,15.0221521 5.76967538,15.0211887 5.69732685,14.9340074 L2.19489146,10.7266681 Z" id="Stroke-3" stroke-width="1.5"></path> </g> </g> </g> </g> </g> </svg>
          </div>
          ${d.fields.event_site}
          </div>`;
              }
            template += `<h4 class="c-cards-events__title txt-clr-g1 fz-v12 lh-v15">`;
            if (type === "VOLUNTEER") {
                // Volunteer opportunity
                template += `${d.fields.volunteer_opportunity_title ? d.fields.volunteer_opportunity_title : d.fields.title}`;
            }
            else {
                // Event (or missing or other)
                template += `${d.fields.event_title ? d.fields.event_title : d.fields.title}`;
            }
            template += `</h4>`;
            if (d.fields.event_all_day === "yes") {
                template += `<p class="c-cards-events__time txt-clr-g2 family-sans fw-v2 fz-v7">All day</p>`;
            } else {
                template += `<p class="c-cards-events__time txt-clr-g2 family-sans fw-v2 fz-v7">${d.fields.event_multiple === "yes" ? "Multiple dates and varied times" : d.fields.volunteer_varied === "yes" ? "Multiple dates and varied times" : d.fields.event_timings}</p>`;
            }

            template += `<p class="c-cards-events__description txt-clr-g2 family-sans fz-v7 lh-v10">
                  ${d.fields.description}
                </p>
                <p class="c-cards-events__eventdetails">SEE ` + type + ` DETAILS <svg width="6px" height="11px" viewBox="0 0 6 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="UI-Element-/-Forward-Arrow-/-Green" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <polyline id="Stroke-1-Copy-2" stroke="#007931" stroke-width="2" transform="translate(3.000000, 5.500000) rotate(-90.000000) translate(-3.000000, -5.500000) " points="8 3 3 8 -2 3"></polyline>
                        </g>
                    </svg>
                </p>
              </div>
            </a>`;

            return template;
        }

        getUserLocalization() {
            let self = this;
            return utl__default["default"].checkGeolocation().then(function (response) {
                self.currentCountry = response.response['pulse-country'].toLowerCase();
                self.currentRegion = response.response['pulse-region'].toLowerCase();
                self.findLocation(self.geoCountryData, self.currentCountry, 'countryCode', 'countryName');
                if (self.currentCountry === 'usa') {
                    self.findLocation(self.geoStateData, self.currentRegion, 'stateCode', 'stateName');
                }
            });
        }

        findLocation(geoStateCountryData, currentRegionCountry, stateCountryCodeProp, stateCountryNameProp) {
            let stateCountryName = '';
            if (geoStateCountryData && geoStateCountryData !== null) {
                for (let i = 0; i < geoStateCountryData.length; i++) {
                    if (geoStateCountryData[i][stateCountryCodeProp] === currentRegionCountry) {
                        stateCountryName = geoStateCountryData[i][stateCountryNameProp];
                        break;
                    }
                }
            }
            if (stateCountryNameProp === 'countryName') {
                this.usrCountryName = stateCountryName;
            } else if (stateCountryNameProp === 'stateName') {
                this.usrStateName = stateCountryName;
            }
        }

        _setAnalyticsEvents(text, link) {
            let currentPageName = typeof utag_data !== "undefined" ? utag_data.page_name : "";
            let previewTags = {
                'event_name': 'related_content_click',
                'related_content_title': text,
                'related_content_url': link,
                'related_content_type': 'event',
                'event_action': 'clicked from ' + currentPageName,
                'event_category': 'related content click',
                'event_label': text
            };
            utl__default["default"].setAnalyticsByPage(previewTags, true);
        }

    }

    var relatedEvents_component = new RelatedEvents();

    return relatedEvents_component;

})($, TNC.Utility, TNC.XHR);
//# sourceMappingURL=related-events.component.js.map

this.TNC = this.TNC || {};
this.TNC.MediaGallery = (function ($, mediaModal) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var mediaModal__default = /*#__PURE__*/_interopDefaultLegacy(mediaModal);

    // Media Gallery component JS goes here
    // import modalModule from '../../assets/scripts/modal/modal.module';

    /** Media Gallery Class. */
    class MediaGallery {
        /**
         * MediaGallery constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            this.initFlickity();
            this.initEvents();
            setTimeout(function () {
                $__default["default"]('.c-media-gallery .carousel').find('.is-selected .triggerModalElement').addClass('triggerModal');
                $__default["default"]('.c-media-gallery .carousel').flickity('resize');
            }, 100);

            // Prevent too-large carousel arrows if styles are turned off.
            var buttons = $__default["default"](".flickity-prev-next-button svg");
            buttons.attr("width", "18px");
            buttons.attr("height", "18px");
        }

        initEvents() {
            $__default["default"]('.c-media-gallery').on('click', '.triggerModal', (event) => {
                event.stopPropagation();
                event.preventDefault();
                // let scrollPos = $(window).scrollTop();
                // mediaModal.scrollPos = scrollPos;
                mediaModal__default["default"].showModal(event);
            });

            $__default["default"]('body').on('click touchend', '.c-modal-carousel', (event) => {
                event.preventDefault();
                event.stopPropagation();
                mediaModal__default["default"].hideModal(event);
            });

            $__default["default"]('.flickity-prev-next-button').on('click', () => {
                $__default["default"]('.c-media-gallery__cell.is-selected').find('.triggerModalElement').addClass('triggerModal');
            });
        }

        checkTouchDevice() {
            return 'ontouchstart' in window || 'onmsgesturechange' in window;
        }

        initFlickity() {
            let isTouch = this.checkTouchDevice();

            $__default["default"]('.c-media-gallery .carousel').flickity({ "pageDots": false, "wrapAround": true, "draggable": isTouch, "arrowShape":
                { x0: 10,
                  x1: 60, y1: 50,
                  x2: 75, y2: 35,
                  x3: 40
                } });

            $__default["default"]('.c-media-gallery .carousel').on('staticClick.flickity', function (event) {
                if ($__default["default"](event.target).hasClass('triggerModalElement')) {
                    $__default["default"](event.target).addClass('triggerModal');
                    $__default["default"](event.target).trigger('click');
                }
            });
        }
    }

    var mediaGallery_component = new MediaGallery();

    return mediaGallery_component;

})($, TNC.Modal);
//# sourceMappingURL=media-gallery.component.js.map

this.TNC = this.TNC || {};
this.TNC.TextListCallout = (function () {
    'use strict';

    // Text List Callout component JS goes here
    // import $ from 'jquery';
    /** Text List Callout Class. */
    class TextListCallout {
        /**
         * TextListCallout constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var textListCallout_component = new TextListCallout();

    return textListCallout_component;

})();
//# sourceMappingURL=text-list-callout.component.js.map

this.TNC = this.TNC || {};
this.TNC.FooterColumns = (function ($, tncUtility) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

    // Footer Columns component JS goes here
    /** Footer Columns Class. */
    class FooterColumns {
        /**
         * FooterColumns constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            $__default["default"]('.c-footer__col_wraper').parent('div').parent('.parsys_column').addClass('c-mobile-footer-columns');
            const maincontent = $__default["default"](".c-footer__col .toggle");
            // Note: getElemenstByClassName will return an array of elements (even if there's only one).

            for (let i = 0; i < maincontent.length; i++) {
                //For each element in the maincontent array, add an onclick event.
                maincontent[i].onclick = event => {

                    //What this does is gets the first item, from an array of elements that have the class 'sub-content', from the parent node of the element that was clicked:
                    const info = event.target.parentNode.getElementsByClassName("toggle")[0];

                    if ($__default["default"](info).hasClass("toggle-on")) { // If the 'sub-content' also contains the class 'show', remove the class.
                        $__default["default"](info).removeClass('toggle-on');
                    } else { // Otherwise add the class.
                        $__default["default"](info).addClass('toggle-on');
                    }
                };
            }

            // Show an element
            const show = elem => {
                // Get the natural height of the element
                const getHeight = () => {
                    elem.style.display = 'block'; // Make it visible
                    const height = `${elem.scrollHeight}px`; // Get it's height
                    elem.style.display = ''; //  Hide it again
                    return height;
                };

                const height = getHeight(); // Get the natural height
                $__default["default"](elem).addClass('is-visible'); // Make the element visible
                $__default["default"](elem).height(height); // Update the max-height

                // Once the transition is complete, remove the inline max-height so the content can scale responsively
                window.setTimeout(() => {
                    elem.style.height = '';
                }, 5);

            };

            // Hide an element
            const hide = elem => {

                // Give the element a height to change from
                elem.style.height = `${elem.scrollHeight}px`;

                // Set the height back to 0
                window.setTimeout(() => {
                    elem.style.height = '0';
                }, 1);

                // When the transition is complete, hide it
                window.setTimeout(() => {
                    $__default["default"](elem).removeClass('is-visible');
                }, 5);

            };

            // Toggle element visibility
            const toggle = (elem) => {

                // If the element is visible, hide it
                if ($__default["default"](elem).hasClass('is-visible')) {
                    hide(elem);
                    return;
                }

                // Otherwise, show it
                show(elem);

            };

            // Listen for click events

            $__default["default"](".c-footer__col_wraper .c-footer__heading > a").on('click', function (event) {

                // Make sure clicked element is our toggle
                if (!$__default["default"](event.target).hasClass('toggle')) return;

                // Prevent default link behavior
                event.preventDefault();

                // Get the content
                const content = document.querySelector(event.target.hash);
                if (!content) return;

                // Toggle the content
                toggle(content);
            });

            // Listen for column click
            $__default["default"]('.c-footer__link').on('click', (event) => {
                this.setAnalytics(event);
            });

            // Check whether footer headings should receive keyboard focus.
            this.checkFooterHeadingLinks();
            $__default["default"](window).resize(this.checkFooterHeadingLinks);
        }

        // Column headings (and other footer headings) are working
        // links only on small screens, where they toggle the
        // visibility of their sections. However, they are not links
        // on larger screens, so they should not receive keyboard focus.
        checkFooterHeadingLinks() {
            var maxSmallScreenWidth = 915;
            var tabIndexValue = "0";   // working link: receive focus
            if ($__default["default"](window).width() > maxSmallScreenWidth) {
                tabIndexValue = "-1";   // not a link: do not receive focus
            }
            // For all footer headings, set whether they can receive focus.
            $__default["default"](".c-footer__heading a").attr("tabindex", tabIndexValue);
        }

        /**
         * Analytics Function
         */

        setAnalytics(event) {
            // event.preventDefault();
            let selected = $__default["default"](event.target);
            let linkText = [];
            const hostname = window.location.hostname;
            if (selected.hasClass('c-footer__link')) {
                linkText.push(selected.text());
            }
            selected = selected.parents('.c-footer__col-nav').find('.c-footer__heading');
            let _selected = $__default["default"](selected).children('a');
            linkText.push(_selected.text());
            let linkName = ($__default["default"].trim(linkText.reverse().join('.'))).toString().toLowerCase();
            linkName = linkName.replace(/[^a-z0-9.]/gi,'');
            let aggregationTags = {
                'event_name': 'footer_nav_click',
                'nav_click_location': hostname + '.fnav.' + linkName
            };

            tncUtility__default["default"].setAnalyticsByPage(aggregationTags, true);
        }
    }

    var footerColumns_component = new FooterColumns();

    return footerColumns_component;

})($, TNC.Utility);
//# sourceMappingURL=footer-columns.component.js.map

this.TNC = this.TNC || {};
this.TNC.FooterIntlSites = (function ($, tncUtility) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

  // Footer Intl Sites component JS goes here
  /** Footer Intl Sites Class. */
  class FooterIntlSites {
      /**
       * FooterIntlSites constructor
       */
      constructor() {
          this.initialize();
      }
      /**
       * Initialization function
       */
      initialize() {
          const $intlLocation = $__default["default"]('.c-footer__international--location');
          $intlLocation.find('a').on('click', (event) => {
              this.setAnalytics(event);
          });
          if ($__default["default"](".portal-nature .c-footer__inner")[0]) {
              $__default["default"](".portal-nature .c-footer__inner")[0].classList.add("border-none");
          }
      }

      /**
     * Analytics Function
     */

    setAnalytics(event) {
      let selected = $__default["default"](event.target);
      let linkText = [];
      const hostname = window.location.hostname;
      while(!selected.hasClass('c-footer__international--locations')) {
        if (selected.hasClass('c-footer__international--location')) {
          let _selected = $__default["default"](selected).children('a');
          linkText.push(_selected.text());
        }
        selected = selected.parent();
      }
      let linkName = ($__default["default"].trim(linkText.reverse().join('.'))).toString().toLowerCase();
      linkName = linkName.replace(/ /g, '_');

      let aggregationTags = {
          'event_name' : 'footer_nav_click',
          'nav_click_location' : hostname+'.fnav.'+linkName
      };

      tncUtility__default["default"].setAnalyticsByPage(aggregationTags, true);
    }
  }

  var footerIntlSites_component = new FooterIntlSites();

  return footerIntlSites_component;

})($, TNC.Utility);
//# sourceMappingURL=footer-intl-sites.component.js.map

this.TNC = this.TNC || {};
this.TNC.FooterLegal = (function () {
    'use strict';

    // Footer Legal component JS goes here
    // import $ from 'jquery';
    /** Footer Legal Class. */
    class FooterLegal {
        /**
         * FooterLegal constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var footerLegal_component = new FooterLegal();

    return footerLegal_component;

})();
//# sourceMappingURL=footer-legal.component.js.map

this.TNC = this.TNC || {};
this.TNC.FooterSignup = (function ($, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    // Footer Signup component JS goes here
    /** Footer Signup Class. */
    class FooterSignup {
        /**
         * FooterSignup constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            this.$emailForm = $__default["default"]('.c-signup-email__footer');
            this.$textForm = $__default["default"]('.c-signup-mobile__footer');
            this.componentUniqueId = this.$emailForm.data("componentuniqueid");
            this.emailInput = this.$emailForm.find(".c-field__input");
            this.mobileInput = this.$textForm.find('.c-field__input');
            this.signupSubmit = this.$emailForm.find(".c-button");
            this.signupMobileSubmit = this.$textForm.find(".c-button");
            this.email_check_passed = false;
            utl__default["default"].checkGeolocation().then(response => {
              let userCountryCode = response.response['pulse-two-letter-country'];

              if (!userCountryCode) return false;

              userCountryCode = $__default["default"].trim(userCountryCode.toLowerCase());

              this.checkEmailForm(userCountryCode);
              this.checkTextForm(userCountryCode);
            });

            this.emailInput.on("keyup", (event) => {
                if (event.key === "Enter") {
                    this.validateEmail.bind(this);
                }
            });
            this.signupSubmit.on("click", this.validateEmail.bind(this));
            //this.footerButtonSignup.on("click", this.captchaSubmit.bind(this));

            this.mobileInput.on("keyup", (event) => {
                if (event.key === "Enter") {
                    this.validatePhone.bind(this);
                }
            });
            this.signupMobileSubmit.on("click", this.validatePhone.bind(this));
        }

        validateEmail(event) {
            event.preventDefault();
            var filter = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            const $thisEmailForm = $__default["default"](event.target).closest('form');
            const errorMsg = $thisEmailForm.find(".c-field__error-text:first");
            const iError = $thisEmailForm.find('.i-error');
            const alreadyRegisteredError = $thisEmailForm.find('.already-registered-error');
            const freshAddressError = $thisEmailForm.find('.freshaddress-error');

            // clear old errors
            errorMsg.css('display', 'none');
            iError.css('display', 'none');
            alreadyRegisteredError.css('display', 'none');
            freshAddressError.css('display', 'none');

            // else condition need to be ignore for test jsunit, because it will reload the page and page reload will break the karma to run
            /* istanbul ignore else */
            if (!filter.test(this.emailInput.val())) {
                errorMsg.css("display", "block");
                iError.css("display", "block");
                alreadyRegisteredError.css("display", "none");
                freshAddressError.css("display", "none");
                var _analytics = {
                    'event_name': 'submit_error',
                    'form_type': 'email_signup',
                    'form_name': 'footer_sign_up',
                    'form_field_error_field': 'cons_email',
                    'form_field_error_value': errorMsg.text().trim()
                };
                utl__default["default"].setAnalyticsByPage(_analytics, true);

            } else {
                //call Engaging Networks
                //If email exists, display error, else trigger click with passed test
                if ( !this.email_check_passed ) {
                    let _self = this;
                    utl__default["default"].checkEmailEngagingNetworks(this.emailInput.val()).then(function(data) {
                        if (data.result === 'NOT FOUND') {
                            _self.email_check_passed = true;
                            _self.signupSubmit.trigger('click');
                        } else {
                            let errorTxt;
                            _self.$emailForm.find(".i-error").css("display", "block");
                            if (data.result === 'EXISTS') {
                                alreadyRegisteredError.css('display', 'block');
                                errorTxt = alreadyRegisteredError.text().trim();
                            } else {
                                // else handle freshaddress response
                                utl__default["default"].handleFreshAddressResponse(data, _self.$emailForm);
                                let errMsgArr = freshAddressError
                                    .find('[style*="display: inline"],[style*="display:inline"]')
                                    .toArray().map((elem) => { return elem.innerText.trim(); });
                                errorTxt = errMsgArr.join(" ");
                            }

                            // SYS-4939: Remove user email from analytics error message
                            errorTxt = errorTxt.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b(?=\?)/i,
                                "<REDACTED>");

                            var _analytics = {
                                'event_name': 'submit_error',
                                'form_type': 'email_signup',
                                'form_name': 'footer_sign_up',
                                'form_field_error_field': 'cons_email',
                                'form_field_error_value': errorTxt
                            };
                            utl__default["default"].setAnalyticsByPage(_analytics, true);
                        }
                    });
                } else {
                    this.email_check_passed = false;
                    // let _analytics = {
                    //     'event_name': 'email_signup',
                    //     'form_type': 'email_signup',
                    //     'form_name': 'footer_sign_up',
                    //     'email_signup_location': 'footer_sign_up'
                    // };
                    // utl.setAnalyticsByPage(_analytics, true);
                    grecaptcha.execute(utl__default["default"].getWidgetId(this.componentUniqueId + "-grecaptcha"));
                }
            }
        }

        validatePhone(event) {
            const filter = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;//^(?=.*[0-9])[- +.()0-9]+$/gm;
            // else condition need to be ignore for test jsunit, because it will reload the page and page reload will break the karma to run
            /* istanbul ignore else */
            if (!filter.test(this.mobileInput.val())) {
                this.$textForm.find(".c-field__error-text").css("display", "block");
                this.$textForm.find(".i-error").css("display", "block");
                event.preventDefault();
            } else {
                let _analytics = {
                    'event_name': 'text_signup',
                    'event_action': 'footer_sign_up',
                    'text_signup_location': 'footer_sign_up'
                };
                utl__default["default"].setAnalyticsByPage(_analytics, true);

                this.$textForm.find(".c-field__error-text").css("display", "none");
                this.$textForm.find(".i-error").css("display", "none");
            }
        }

        checkEmailForm(countryCode) {
          let $container = $__default["default"]('.geo-email-btns');
          let $btn = $__default["default"](`.geo-email-sign-up-btn[data-country-code="${countryCode}"]`);

          if ($btn.length) {
            this.$emailForm.hide();
            this.$textForm.hide();
            $btn.removeClass('hide');
            $container.removeClass('hide');
          }
        }

        checkTextForm(countryCode) {
          let $container = $__default["default"]('.geo-text-btns');
          let $btn = $__default["default"](`.geo-text-sign-up-btn[data-country-code="${countryCode}"]`);

          if ($btn.length) {
            this.$emailForm.hide();
            this.$textForm.hide();
            $btn.removeClass('hide');
            $container.removeClass('hide');
          }
        }
    }

    var footerSignup_component = new FooterSignup();

    function footerSignupCallback(token) {
        let footerSignup = new FooterSignup();
        let emailForm = footerSignup.$emailForm;
        let _analytics = {
            'event_name': 'email_signup',
            'form_type': 'email_signup',
            'form_name': 'footer_sign_up',
            'email_signup_location': 'footer_sign_up'
        };
        utl__default["default"].captchaSubmit(token, emailForm, _analytics);
    }

    window.footerSignupCallback = footerSignupCallback;

    return footerSignup_component;

})($, TNC.Utility);
//# sourceMappingURL=footer-signup.component.js.map

this.TNC = this.TNC || {};
this.TNC.FooterSocial = (function (tncUtility) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

  // Footer Social component JS goes here
  /** Footer Social Class. */
  class FooterSocial {
      /**
       * FooterSocial constructor
       */
      constructor() {
          this.initialize();
      }
      /**
       * Initialization function
       */
      initialize() {
          const $socialIcon = document.querySelectorAll('.social-img-icon');
          $socialIcon.forEach(element => {
              element.addEventListener('click', (e) => {
              this.setAnalytics(e);
              });
          });
      }

         /**
     * Analytics Function
     */

    setAnalytics(event) {
      let selected = event.target;
      let linkName;
      const hostname = window.location.hostname;
        if (selected) {
          linkName = selected.alt;
        }

        linkName = linkName.toLowerCase();

      let aggregationTags = {
          'event_name' : 'social_follow',
          'social_follow_id' : hostname+'.follow.'+linkName,
          'social_follow_platform' : linkName

      };
      tncUtility__default["default"].setAnalyticsByPage(aggregationTags, true);
    }
  }

  var footerSocial_component = new FooterSocial();

  return footerSocial_component;

})(TNC.Utility);
//# sourceMappingURL=footer-social.component.js.map

this.TNC = this.TNC || {};
this.TNC.SignUpForm = (function ($, Select, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var Select__default = /*#__PURE__*/_interopDefaultLegacy(Select);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    class SignUpForm {
        constructor() {
            this.initialize();
        }

        initialize() {
            this.$el = $__default["default"](".c-signup__fieldset");
    		this.$emailForm = $__default["default"](".c-signup__form");

            let baseElement = this.$el;
            Select__default["default"].initialize(baseElement);
            Select__default["default"].setUpHybridSelects();

            this.setUpCountrySelect();

            this.emailInput = this.$el.find(".c-field__input");
            this.signupSubmit = this.$el.find(".signup-submit");

            this.emailInput.on("keyup", (event) => {
                if (event.key === 'Enter') {
                    this.validateEmail.bind(this);
                }
            });
            this.signupSubmit.on("click", this.validateEmail.bind(this));
            this.$el.find(".error__msg").css("display", "none");
            this.$el.find(".i-error").css("display", "none");
            this.$el.find(".freshaddress-error").css("display", "none");
            this.$el.find(".c-field__input").removeClass("c-field__input--error");
            this.email_check_passed = false;
        }

        replaceStatesProvinces(countryCode) {
            var statesProvincesSelect = $__default["default"]("select#en__field_supporter_region");
            var statesProvincesWrapper = statesProvincesSelect.parent();
            var statesProvincesLists = $__default["default"](".c-signup__form").data(
                "states-provinces-lists");

            // Check the data for a states/provinces list for the country.
            var found, i, item, listCountry, statesProvinces;
            found = false;
            for (i = 0; i < statesProvincesLists.length; i++) {
                item = statesProvincesLists[i];
                listCountry = item["country"];
                if (listCountry === countryCode) {
                    found = true;
                    break;
                }
            }

            // Remove all but the first element from the select list.
            statesProvincesSelect.find('option:not(:first)').remove();

            // If there are states or provinces, create and add new options.
            if (found) {
                statesProvinces = item["statesProvinces"];
                var j, newOption;
                for (j = 0; j < statesProvinces.length; j++) {
                    newOption = document.createElement("option");
                    newOption.value = statesProvinces[j].code;
                    newOption.text = statesProvinces[j].label;
                    statesProvincesSelect.append(newOption);
                }
                statesProvincesSelect.prop("disabled", false);
                statesProvincesWrapper.removeClass(
                    "c-select__wrapper--disabled");
            }
            else {
                statesProvincesSelect.prop("disabled", true);
                statesProvincesWrapper.addClass(
                    "c-select__wrapper--disabled");
            }
        }

        setUpCountrySelect() {
            let countrySelect = $__default["default"]("select#en__field_supporter_country");
            if (countrySelect.length > 0) {
                // Set up a handler for changing the country select box.
                countrySelect.on("change", () => {
                    let countryCode = countrySelect.find(":selected").val();
                    this.replaceStatesProvinces(countryCode);
                });
            }
        }

        validateEmail(event) {
    		event.preventDefault();
            const filter = /^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            const $thisEmailForm = $__default["default"](event.target).closest('form');
            const thisEmailInput = $thisEmailForm.find('.c-field__input');
            const button = $thisEmailForm.find('.c-signup__button');
            const errorMsg = $thisEmailForm.find('.error__msg');
            const iError = $thisEmailForm.find('.i-error');
            const alreadyRegisteredError = $thisEmailForm.find('.already-registered-error');
            const freshAddressError = $thisEmailForm.find('.freshaddress-error');

            // clear old errors
            errorMsg.css('display', 'none');
            iError.css('display', 'none');
            alreadyRegisteredError.css('display', 'none');
            freshAddressError.css('display', 'none');

            // else condition need to be ignore for test jsunit, because it will reload the page
            // and page reload will break the karma to run
            /* istanbul ignore else */
            if (!filter.test(thisEmailInput.val())) {
                errorMsg.css("display", "inline-block");
                button.addClass("c-signup__button--error-shown");
                iError.css("display", "inline-block");
                $thisEmailForm.find(".c-field__input").addClass("c-field__input--error");

                event.preventDefault();

                var _analytics = {
                    'event_name': 'submit_error',
                    'form_type': 'email_signup',
                    'form_name': 'c36_signup_form',
                    'form_field_error_field': 'cons_email',
                    'form_field_error_value': errorMsg.text().trim()
                };
                utl__default["default"].setAnalyticsByPage(_analytics, true);

            } else {
                if ( !this.email_check_passed ) {
                    event.preventDefault();
                    let _self = this;
                    // call Engaging Networks
                    // If email exists, display error, else trigger click with passed test
                    utl__default["default"].checkEmailEngagingNetworks(thisEmailInput.val()).then(function(data) {
                        if (data.result === 'NOT FOUND') {
                            _self.email_check_passed = true;
                            $thisEmailForm.find(".c-field__input").removeClass("c-field__input--error");
                            var submitButton = $thisEmailForm.find(".signup-submit");
                            submitButton.trigger("click");
                        } else {
                            var errorTxt;
                            iError.css('display', 'block');
                            if (data.result === 'EXISTS') {
                                alreadyRegisteredError.css('display', 'block');
                                errorTxt = alreadyRegisteredError.text().trim();
                                button.addClass("c-signup__button--error-shown");
                            } else {
                                // else handle freshaddress response
                                button.addClass("c-signup__button--error-shown");
                                utl__default["default"].handleFreshAddressResponse(data, $thisEmailForm);
                                let errMsgArr = freshAddressError
                                    .find('[style*="display: inline"],[style*="display:inline"]')
                                    .toArray().map((elem) => { return elem.innerText.trim(); });
                                errorTxt = errMsgArr.join(" ");
                            }

                            $thisEmailForm.find(".c-field__input").addClass("c-field__input--error");
                            // SYS-4939: Remove user email from analytics error message
                            errorTxt = errorTxt.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b(?=\?)/i,
                                "<REDACTED>");

                            var _analytics = {
                                'event_name': 'submit_error',
                                'form_type': 'email_signup',
                                'form_name': 'c36_signup_form',
                                'form_field_error_field': 'cons_email',
                                'form_field_error_value': errorTxt
                            };
                            utl__default["default"].setAnalyticsByPage(_analytics, true);
                        }
                    });
                } else {
                    this.email_check_passed = false;
                    // let _analytics = {
                    //     'event_name': 'email_signup',
                    //     'form_type': 'email_signup',
                    //     'form_name': 'c36_signup_form',
                    //     'email_signup_location': 'c36_signup_form'
                    // };
                    // utl.setAnalyticsByPage(_analytics, true);

    				grecaptcha.execute(utl__default["default"].getWidgetId(this.componentUniqueId + "-grecaptcha"));
                    $thisEmailForm.find(".c-field__input").removeClass("c-field__input--error");
                }
            }
        }

    }

    var signUpForm_component = new SignUpForm();

    function signupFormCallback(token) {
        let signUpForm = new SignUpForm();
        let emailForm = signUpForm.$emailForm;
        let _analytics = {
          'event_name': 'email_signup',
          'form_type': 'email_signup',
          'form_name': 'c36_signup_form',
          'email_signup_location': 'c36_signup_form'
        };
        utl__default["default"].captchaSubmit(token, emailForm, _analytics);
    }

    window.signupFormCallback = signupFormCallback;

    return signUpForm_component;

})($, TNC.Select, TNC.Utility);
//# sourceMappingURL=sign-up-form.component.js.map

this.TNC = this.TNC || {};
this.TNC.MediaContacts = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Media Contacts component JS goes here
    /** Media Contacts Class. */
    class MediaContacts {
        /**
         * MediaContacts constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            let mediaLink = $__default["default"]('.c-media-contacts_header');
            mediaLink.on('click', (event) => {
                this.toggleAccordion(event);
            });

            /* function to remove accordion in desktop*/
            $__default["default"](window).on('resize', function () {
                if ($__default["default"](window).height() < $__default["default"](window).width()) {
                    if ($__default["default"](window).width() > 1023) {
                        $__default["default"]('.c-media-contacts__list').css('display', ""); //remove inline styling
                        // if ($('.media-toggle').hasClass('toggle-on')) {
                        $__default["default"]('.media-toggle').removeClass('toggle-on');
                        // }
                    }
                }
            });
        }

        /* this function is to toggle the accordion in mobile */
        toggleAccordion(e) {
            if ($__default["default"](window).width() < 1023) {
                let menuClicked = $__default["default"](e.currentTarget);
                let toggleIcon = $__default["default"](menuClicked).find('.media-toggle');
                toggleIcon.toggleClass('toggle-on');
                const menuId = $__default["default"](toggleIcon).attr('data-componentuniqueid');

                $__default["default"](`#${menuId}`).find('.c-media-contacts__list').slideToggle(700, "easeInOutQuart");
            }
        }
    }

    var mediaContacts_component = new MediaContacts();

    return mediaContacts_component;

})($);
//# sourceMappingURL=media-contacts.component.js.map

this.TNC = this.TNC || {};
this.TNC.HorizontalRuler = (function () {
    'use strict';

    // Horizontal Ruler component JS goes here
    // import $ from 'jquery';
    /** Horizontal Ruler Class. */
    class HorizontalRuler {
        /**
         * HorizontalRuler constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var horizontalRuler_component = new HorizontalRuler();

    return horizontalRuler_component;

})();
//# sourceMappingURL=horizontal-ruler.component.js.map

this.TNC = this.TNC || {};
this.TNC.RichTextEditor = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    class RichTextEditor {
        constructor() {
            this.initialize();
        }

        initialize() {
            this.adjustDropCap();
        }

        adjustDropCap() {
            /* If a drop cap is in use and it is the letter Q, the drop cap
                will need extra styling to add some extra space below it. */
            var dropCap = $__default["default"](".rte__text--drop-cap");
            if (dropCap.length > 0) {
                var firstLetter = dropCap.find("p").text()[0];
                if (firstLetter.toUpperCase() === "Q") {
                    dropCap.addClass("rte__text--drop-cap-q");
                }
            }
        }
    }

    var richTextEditor_component = new RichTextEditor();

    return richTextEditor_component;

})($);
//# sourceMappingURL=rich-text-editor.component.js.map

this.TNC = this.TNC || {};
this.TNC.ToolsAndResources = (function () {
    'use strict';

    // Tools And Resources component JS goes here
    // import $ from 'jquery';
    /** Tools And Resources Class. */
    class ToolsAndResources {
        /**
         * ToolsAndResources constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var toolsAndResources_component = new ToolsAndResources();

    return toolsAndResources_component;

})();
//# sourceMappingURL=tools-and-resources.component.js.map

this.TNC = this.TNC || {};
this.TNC.ArticleCta = (function ($, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    // Article Cta component JS goes here
    /** Article Cta Class. */
    class ArticleCta {
        /**
         * Article CTA constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
    		this.$emailForm = $__default["default"]('.c-article_cta');
            this.emailInput = $__default["default"]('.c-article-cta .c-field__input');
            this.signupSubmit = $__default["default"]('.c-article-cta .c-button');
            this.emailInput.on('keyup', (event) => {
                if (event.key === "Enter") {
                    this.validateEmail.bind(this);
                }
            });
            this.signupSubmit.on('click', this.validateEmail.bind(this));
            $__default["default"]('.c-article-cta .error__msg').css('display', 'none');
            $__default["default"]('.c-article-cta .i-error').css('display', 'none');
            $__default["default"]('.c-article-cta .freshaddress-error').css('display', 'none');
            this.email_check_passed = false;
        }

        validateEmail(event) {
           const $thisEmailForm = $__default["default"](event.target).closest('form');
           const thisEmailInput = $thisEmailForm.find('.c-field__input');
           if (thisEmailInput && thisEmailInput.length) {
                event.preventDefault();
            }
            const filter = /^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            const errorMsg = $thisEmailForm.find('.error__msg');
            const iError = $thisEmailForm.find('.i-error');
            const alreadyRegisteredError = $thisEmailForm.find('.already-registered-error');
            const freshAddressError = $thisEmailForm.find('.freshaddress-error');

            // clear old errors
            errorMsg.css('display', 'none');
            iError.css('display', 'none');
            alreadyRegisteredError.css('display', 'none');
            freshAddressError.css('display', 'none');

            if (thisEmailInput && thisEmailInput.length) {
                if (!filter.test(thisEmailInput.val())) {
                    errorMsg.css('display', 'block');
                    iError.css('display', 'block');
                    alreadyRegisteredError.css('display', 'none');
                    freshAddressError.css('display', 'none');
                    event.preventDefault();
                    let _analytics = {
                        'event_name': 'submit_error',
                        'form_type': 'email_signup',
                        'form_name': 'c72_signup_form',
                        'form_field_error_field': 'cons_email',
                        'form_field_error_value': errorMsg.text().trim()
                    };
                    utl__default["default"].setAnalyticsByPage(_analytics, true);
                } else {
                    if ( !this.email_check_passed ) {
                        event.preventDefault();
                        let _self = this;
                        // call Engaging Networks
                        // If email exists, display error, else trigger click with passed test
                        utl__default["default"].checkEmailEngagingNetworks(thisEmailInput.val()).then(function(data) {
                            if (data.result === 'NOT FOUND') {
                                _self.email_check_passed = true;
                                $thisEmailForm.find('.c-button').trigger('click');
                            } else {
                                let errorTxt;
                                iError.css('display', 'block');
                                if (data.result === 'EXISTS') {
                                    alreadyRegisteredError.css('display', 'block');
                                    errorTxt = alreadyRegisteredError.text().trim();
                                } else {
                                    // else handle freshaddress response
                                    // valid with a suggestion means we offer the suggestion because it's not 'safe to send'
                                    utl__default["default"].handleFreshAddressResponse(data, $thisEmailForm);
                                    let errMsgArr = freshAddressError
                                        .find('[style*="display: inline"],[style*="display:inline"]')
                                        .toArray().map((elem) => { return elem.innerText.trim(); });
                                    errorTxt = errMsgArr.join(" ");
                                }

                                // SYS-4939: Remove user email from analytics error message
                                errorTxt = errorTxt.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b(?=\?)/i,
                                    "<REDACTED>");

                                let _analytics = {
                                    'event_name': 'submit_error',
                                    'form_type': 'email_signup',
                                    'form_name': 'c72_signup_form',
                                    'form_field_error_field': 'cons_email',
                                    'form_field_error_value': errorTxt
                                };
                                utl__default["default"].setAnalyticsByPage(_analytics, true);
                            }
                        });
                    } else {
                        this.email_check_passed = false;
                        // let _analytics = {
                        //     'event_name': 'email_signup',
                        //     'form_type': 'email_signup',
                        //     'form_name': 'c72_signup_form',
                        //     'email_signup_location': 'c72_signup_form'
                        // };
                        // utl.setAnalyticsByPage(_analytics, true);
    					grecaptcha.execute(utl__default["default"].getWidgetId(this.componentUniqueId + "-grecaptcha"));
                    }
                }
            }
        }
    }

    var articleCta_component = new ArticleCta();

    function articleCtaCallback(token) {
        let articleCta = new ArticleCta();
        let emailForm = articleCta.$emailForm;
        let _analytics = {
            'event_name': 'email_signup',
            'form_type': 'email_signup',
            'form_name': 'c72_signup_form',
            'email_signup_location': 'c72_signup_form'
        };
        utl__default["default"].captchaSubmit(token, emailForm, _analytics);
    }

    window.articleCtaCallback = articleCtaCallback;

    return articleCta_component;

})($, TNC.Utility);
//# sourceMappingURL=article-cta.component.js.map

this.TNC = this.TNC || {};
this.TNC.VisualListing = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Visual Listing component JS goes here
    /** Visual Listing Class. */
    class VisualListing {
        /**
         * VisualListing constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
          if ($__default["default"](".c-visual-list__items .c-visual-list__item").length < 2) {
              $__default["default"](".c-visual-list__items .c-visual-list__item").css("border-bottom", "none");
            } else {
              return;
            }
        }
    }

    var visualListing_component = new VisualListing();

    return visualListing_component;

})($);
//# sourceMappingURL=visual-listing.component.js.map

this.TNC = this.TNC || {};
this.TNC.TabContainer = (function ($, tncUtility) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

    class TabContainer {
        constructor() {
            this.initialize();
        }

        initialize() {

            let _self = this;


            _self.$tabContainer = ".c-tab-container-container";
            $__default["default"](window).on("popstate", function () {
                _self.updateTabPosition();
            });

            //kirk - needed?
            //check for sticky header and apply position offset
            if ($__default["default"]('.cd-main-header').length && $__default["default"]('.cd-main-header').attr('data-sticky-header') === 'sticky-header' && $__default["default"]('.c-tab-container-links').length) {
              if ($__default["default"]('.cd-main-header').hasClass('sticky-language')) {
                $__default["default"]('.c-tab-container-links').addClass('sticky-header-offset-lang');
              } else {
                $__default["default"]('.c-tab-container-links').addClass('sticky-header-offset');
              }
              _self.stickyHeaderOffsetEvent();
            }

            // Add listener for page resize to toggle display flex/none for
            // anchors.
            _self.mobile_view = window.matchMedia("(max-width: 40em)");
            _self.mobile_view.addListener(_self.resetContainer);

            $__default["default"](".c-tab-container-content:first-child").addClass("show");

            // If multiple tab containers, ensure correct current tab initially
            // renders on mobile.
            let tabQueryParam = tncUtility__default["default"].getParameterByName("tab_q");
            $__default["default"](".c-tab-container-container").each((index, element) => {
                var active_a = $__default["default"](element).find(
                    '.c-tab-container-links__link[href="#' + tabQueryParam +
                    '"]');
                if (active_a.length === 0) {
                    // In this tab container, could not find an anchor with the
                    // tab_q parameter specified in url.
                    var first_tab = $__default["default"](element).find(
                        ".c-tab-container-links__link").first();
                    $__default["default"](element).find(
                        ".c-tab-container-links__viewing_tab").addClass(
                        "is-active txt-clr-g1 fw-bold show").html(
                        first_tab.html());
                }
            });

            // Activating a click event changes the tab.
            $__default["default"](".c-tab-container-links__link").on("click", e => {
                e.preventDefault();

                // Highlight the new tab.
                $__default["default"](e.currentTarget).parents(_self.$tabContainer).find(
                    ".c-tab-container-links__link").removeClass(
                    "is-active bx-shdo-clr-p1-bottom txt-clr-g1");
                $__default["default"](e.currentTarget).addClass(
                    "is-active bx-shdo-clr-p1-bottom txt-clr-g1");

                _self.setAnalytics(e);

                // Show the section for the tab.
                var tabLink = e.currentTarget;
                _self.toggleSection(tabLink);

                _self.toggleMobileMenu(tabLink);
                _self.scrollToTop();
            });

            _self.handleSizeCalculator();
            _self.updateTabPosition();

            // Slide-toggle menu on click "Viewing" div
            $__default["default"](".c-tab-container-links__viewing").on("click", e => {
                $__default["default"](e.currentTarget).parents(_self.$tabContainer).find(
                    ".c-tab-container-links__items").slideToggle(300);
                $__default["default"](e.currentTarget).find(
                    ".c-tab-container-links__arrow").toggleClass("open");
            });

            // Need to do an initial check if there are multiple tab containers
            // and there is a tab_q parameter. If so, tab container without the
            // tab_q parameter needs the first anchor to be designated as
            // is-active and styled appropriately.
            $__default["default"](".c-tab-container-container").each((index, element) => {
                var a = $__default["default"](element).find(
                    '.c-tab-container-links__link[href="#' + tabQueryParam +
                    '"]');
                if (a.length === 0) {
                    if (_self.mobile_view.matches) {
                        $__default["default"](element).find(
                            ".c-tab-container-links__link").first().addClass(
                            "is-active txt-clr-g1");
                    }
                    else {
                        $__default["default"](element).find(
                            ".c-tab-container-links__link").first().addClass(
                            "is-active bx-shdo-clr-p1-bottom txt-clr-g1");
                    }
                }
            });

            _self.checkForFragment();
        }



        // apply position offset when sticky header is present
        stickyHeaderOffsetEvent() {

          $__default["default"](window).scroll(function() {
            if($__default["default"]('.cd-main-header').hasClass('_sticky-down')) {
              $__default["default"]('.c-tab-container-links').removeClass('_sticky-up');
              $__default["default"]('.c-tab-container-links').addClass('_sticky-down');
              } else if ($__default["default"]('.cd-main-header').hasClass('_sticky-up')) {
                $__default["default"]('.c-tab-container-links').removeClass('_sticky-down');
                $__default["default"]('.c-tab-container-links').addClass('_sticky-up');
              }
          });
        }

        // Toggle the mobile menu.
        toggleMobileMenu(tabLink) {
            if (this.mobile_view && this.mobile_view.matches) {
                $__default["default"](tabLink).parents(this.$tabContainer).find(
                    ".c-tab-container-links__items").slideToggle(300);
                $__default["default"](tabLink).parents(this.$tabContainer).find(
                    ".c-tab-container-links__arrow").toggleClass("open");
            }
        }

        // Scroll to the top of tab container, to the new tab.
        scrollToTop() {
            let new_tab = document.getElementById(
                tncUtility__default["default"].getParameterByName("tab_q"));
            new_tab.scrollIntoView();
            window.scrollTo(0, $__default["default"](window).scrollTop() - 146);
            if($__default["default"]('.cd-main-header.sticky-header').length){
              this.stickyHeaderOffsetEvent();
            }
        }

        checkForFragment() {
            // Check to see whether this page's URL has an anchor fragment,
            // in which case activate the corresponding tab.
            var location = window.location;
            // Only handle a fragment if there's no query string specifying a
            // visible tab (in that case, just let that tab be displayed).
            if (location.hash && (location.search.indexOf("tab_q=") === -1)) {
                var fragment = location.hash.trim().replace("#", "");
                var tabLinks = $__default["default"](".c-tab-container-links__link");
                var tabToActivate;
                // Look for a tab link with a label matching the fragment.
                for (var i = 0; i < tabLinks.length; i++) {
                    var linkAsFragment = tncUtility__default["default"].getFragment(
                        $__default["default"](tabLinks[i]).text());
                    if (linkAsFragment === fragment) {
                        tabToActivate = tabLinks[i];
                        break;
                    }
                }
                if (tabToActivate) {
                    // Highlight the new tab.
                    // Clear the highlight only from other tabs in this
                    // instance of the component, because their can be
                    // multiple instances on a page.
                    $__default["default"](tabToActivate).parent().siblings().children(
                        ".c-tab-container-links__link").removeClass(
                        "is-active bx-shdo-clr-p1-bottom txt-clr-g1");
                    $__default["default"](tabToActivate).addClass(
                        "is-active bx-shdo-clr-p1-bottom txt-clr-g1");

                    // Show the section for the tab.
                    this.toggleSection(tabToActivate);

                    this.toggleMobileMenu(tabToActivate);
                    this.scrollToTop();
                }
            }
        }

        resetContainer() {
            // on window resize, check if desktop/mobile and adjust display
            let tabs = $__default["default"](".c-tab-container-links__items");
            if (this.mobile_view && this.mobile_view.matches) {
                // screen width < 40 em
                tabs.each(function (index, el) {
                    $__default["default"](el).css("display", "none");
                    // find active anchor
                    $__default["default"](el).find(".is-active").removeClass("bx-shdo-clr-p1-bottom");
                });
            }
            else {
                tabs.each(function (index, el) {
                    $__default["default"](el).css("display", "flex");
                    // find active anchor
                    $__default["default"](el).find(".is-active").addClass("bx-shdo-clr-p1-bottom");
                });
                // If desktop => mobile resize, ensure that menu arrows indicate
                // that menu is closed.
                $__default["default"](".c-tab-container-links__arrow").removeClass("open");
            }
        }

        /**
         * * ToggleSection function
         * Toggles the selected tab content
         * */
        toggleSection(tabLink) {
            const tabId = $__default["default"](tabLink).attr("href");
            const $tabContent = $__default["default"](tabLink).parents(
                this.$tabContainer).find(".c-tab-container-content");
            $tabContent.removeClass("show");
            $__default["default"](tabId).addClass("show");

            // sys-3777
            if (typeof window.TNC.Map !== "undefined") {
                if ($__default["default"](tabId).find("#map-canvas").length > 0) {
                    window.TNC.Map.initialize();
                }
            }

            $__default["default"](tabLink).parents(this.$tabContainer).find(
                ".c-tab-container-content").scrollTop(0);
            this.updateTabUrl(tabId);
            this.handleSizeCalculator();

            // Set focus to the first interactive item (if any) in the section.
            let section = $__default["default"](tabId);
            let firstInteractiveItem = section.find(
                "a, button, iframe, input, select").get(0);
            if (firstInteractiveItem) {
                if (firstInteractiveItem.localName === 'iframe') {
                    // An iframe often indicates an embedded media player
                    // (YouTube, etc.).
                    // Set focus on the iframe's parent div, which is
                    // expected to have tabindex="0" (this is entirely our
                    // convention).
                    // From there, it will be possible to tab into the
                    // controls within the iframe.
                    $__default["default"](firstInteractiveItem).parent().focus();
                }
                else {
                    firstInteractiveItem.focus();
                }
            }
        }

        /**
         * Handle Media Gallery type component
         * whose size is calculated on page load or window resize
         */
        updateTabUrl(tabId) {
            let selectedTab = tabId.substr(1);
            let tabURL = tncUtility__default["default"].updateQueryString("tab_q", selectedTab);
            tncUtility__default["default"].updateURL(tabURL);
            this.updateTabPosition();
        }

        updateTabPosition() {
            let searchString = window.location.search;
            let tabQueryParam = tncUtility__default["default"].getParameterByName("tab_q");

            if (searchString && tabQueryParam) {
                // A URL parameter is present indicating which tab is active.
                let $activeTab = "#" + tabQueryParam;
                $__default["default"]($activeTab).parent().parent().find(
                    ".c-tab-container-links__link").removeClass(
                    "is-active bx-shdo-clr-p1-bottom txt-clr-g1");
                $__default["default"]($activeTab).siblings().removeClass("show");
                $__default["default"]($activeTab).addClass("show");

                if (this.mobile_view && this.mobile_view.matches) {
                    $__default["default"]('.c-tab-container-links__link[href="' + $activeTab +
                        '"]').addClass('is-active txt-clr-g1');
                }
                else {
                    $__default["default"]('.c-tab-container-links__link[href="' + $activeTab +
                        '"]').addClass(
                        'is-active bx-shdo-clr-p1-bottom txt-clr-g1');
                }

                let active_a = $__default["default"]('.c-tab-container-links__link[href="' +
                    $activeTab + '"]');
                // Update mobile menu current tab status
                $__default["default"]($activeTab).parent().parent().find(
                    ".c-tab-container-links__viewing_tab").html(active_a.html());
            }
            else {
                // No URL parameter is present, so the first tab is active.
                $__default["default"](".c-tab-container-links__link").removeClass(
                    "is-active bx-shdo-clr-p1-bottom");
                $__default["default"](".c-tab-container-content").removeClass("show");
                $__default["default"](".c-tab-container-container").each((index, element) => {

                    // display "Viewing [first tab]" on mobile menu
                    var first_tab = $__default["default"](element).find(
                        ".c-tab-container-links__link").first();
                    $__default["default"](element).find(
                        ".c-tab-container-links__viewing_tab").addClass(
                        "is-active txt-clr-g1 fw-bold show").html(
                        first_tab.html());

                    // add is-active classes for ul (desktop and mobile) tab
                    if (this.mobile_view && this.mobile_view.matches) {
                        $__default["default"](element).find(
                            ".c-tab-container-links__link").first().addClass(
                            "is-active txt-clr-g1");
                    }
                    else {
                        $__default["default"](element).find(
                            ".c-tab-container-links__link").first().addClass(
                            "is-active bx-shdo-clr-p1-bottom txt-clr-g1");
                    }

                    // display first tab content
                    $__default["default"](element).find(
                        ".c-tab-container-content").first().addClass("show");
                });
            }
        }

        handleSizeCalculator() {
            var evt = window.document.createEvent("UIEvents");
            evt.initUIEvent("resize", true, false, window, 0);
            window.dispatchEvent(evt);
        }

        setAnalytics(e) {
            let tabClicked = $__default["default"](e.currentTarget).text().trim();
            let tabObj = {
                "event_name": "tab_click",
                "event_action": tabClicked,
                "tab_title": tabClicked,
            };
            tncUtility__default["default"].setAnalyticsByPage(tabObj, true);
        }
    }

    var tabContainer_component = new TabContainer();

    return tabContainer_component;

})($, TNC.Utility);
//# sourceMappingURL=tab-container.component.js.map

this.TNC = this.TNC || {};
this.TNC.ContactsListing = (function () {
    'use strict';

    // Contacts Listing component JS goes here
    // import $ from 'jquery';
    /** Contacts Listing Class. */
    class ContactsListing {
        /**
         * ContactsListing constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var contactsListing_component = new ContactsListing();

    return contactsListing_component;

})();
//# sourceMappingURL=contacts-listing.component.js.map

this.TNC = this.TNC || {};
this.TNC.ImpactMap = (function ($, mediaModal, utl) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var mediaModal__default = /*#__PURE__*/_interopDefaultLegacy(mediaModal);
  var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

  /**
   * utility to lock the scrolling while a modal is open
  * */
  const setScrollYPoperty = () => {
    window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });
  };

  const lockScroll = () => {
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}`;
  };

  const unlockScroll = () => {
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = '';
    body.style.top = '';

    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  };

  const mobile = 640;
  const isMobile = () => $__default["default"](window).width() < mobile;

  const tablet = 832;
  const isTablet = () => $__default["default"](window).width() < tablet;

  class ImpactMap {
      constructor() {
          this.initialize();
          this.map = {};
      }

      initialize() {
          let self = this;
          setScrollYPoperty();
          if ($__default["default"]('.c-impact-map').length > 0) {
              $__default["default"]('.c-impact-map').each(function () {
                  let locationArr = [];
                  let targetEl = $__default["default"](this).find('.c-impact-map-canvas');
                  $__default["default"](this).find('.c-impact-map-list-locations').children().each(function (index, element) {
                      // get info window template
                      if ($__default["default"](element).hasClass('c-impact-map-list-location')) {
                          var _arr = [$__default["default"](element).data('location'), $__default["default"](element).next().html(), $__default["default"](element).data('locationtype')];
                          locationArr.push(_arr);
                      }
                  });

                  // intialize the map
                  self.initMapGeneric(targetEl, locationArr);
              });
          }
          $__default["default"]('.c-impact-map-infomodal').on('click', '.triggerModal', (event) => {
              event.stopPropagation();
              event.preventDefault();
              mediaModal__default["default"].showModal(event);
          });
          $__default["default"]('body').on('click touchend', '.c-modal-carousel', (event) => {
              event.preventDefault();
              event.stopPropagation();
              mediaModal__default["default"].hideModal(event);
          });
      }

      closeInfoModal(canvasElement) {
          const impactMapElement = canvasElement.closest(".c-impact-map");
          const closeInfoModal = impactMapElement.find(".c-button-close");
          const buttons = Array.prototype.slice.call(closeInfoModal);
          const modal = impactMapElement.find(".c-impact-map-infomodal");

          const method = event => {
              const markerSrc = event.target.src ? event.target.src : '';
              const rect = modal[0].getBoundingClientRect();
              const isInInfoModal = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
                  && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);

              buttons.forEach(element => {
                  if (modal[0].classList.contains('showing') &&
                      event.target !== element &&
                      !event.target.classList.contains('c-impact-map-list-location') &&
                      !isInInfoModal &&
                      !markerSrc.includes('maps.gstatic')) {

                      if (isMobile() || isTablet()) {
                          unlockScroll();
                      }

                      impactMapElement.removeClass('modalOpen');
                      modal.removeClass('showing').html('');
                      $__default["default"]('.c-impact-map-list-location').each(function () {
                          $__default["default"](this).removeClass("-active");
                      });
                  }
              });
          };

          document.addEventListener('click', method);
      }

      closeControllers(centerControlDiv, controller) {
          const method = event => {
              if (event.type === 'click') {
                  const rect = centerControlDiv.getBoundingClientRect();
                  const isInController = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
                      && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);

                  if (!isInController && event.target !== controller) {
                      controller.classList.remove('open-controller');
                  }
              }

              if (event.type === 'keydown') {
                  if (event.code === 'Escape') {
                      controller.classList.remove('open-controller');
                  }
              }
          };

          document.addEventListener('keydown', method);
          document.addEventListener('click', method);
      }

      // initialize the map component
      initMapGeneric($target, locationList) {
          let canvasElement = $target;
          this.map = new google.maps.Map(canvasElement[0], {
              zoom: 0,
              maxZoom: 11,
              streetViewControl: false,
              fullscreenControl: false,
              rotateControl: false,
              mapTypeControl: false,
              center: { lat: 38.882628, lng: -77.112312 },
              zoomControl: isMobile() || isTablet() ? false : true
          });
          const centerControlDiv = document.createElement("div");

          // build toggle controls
          if (isMobile()) {
              centerControlDiv.style.right = '30px';
              centerControlDiv.style.left = 'auto';
              centerControlDiv.style.bottom = '5px';
              centerControlDiv.style.transform = 'translate(0, 5px)';
              centerControlDiv.style.width = '100%';
              centerControlDiv.style.padding = '0 25px 0px 10px';
          } else {
              centerControlDiv.style.transform = 'translate(-55px, -10px)';
          }

          // Only show the marker types toggle panel if more than one
          // marker type will be displayed.
          let markerTypes = this.getMarkerTypes(canvasElement, locationList);
          if (markerTypes.length > 1) {
              this.createControls(centerControlDiv, markerTypes);

              // After a short delay for creating controls, add keyboard events.
              setTimeout(() => {
                  $__default["default"](".map-control .label").each(function () {
                      $__default["default"](this).on("keydown", function (event) {
                          if (event.code === "Space" || event.code === "Enter") {
                              event.preventDefault();
                              $__default["default"](this).trigger("click");
                          }
                      });
                  });
              }, 1500);
          }

          this.map.controls[isMobile() ?
              google.maps.ControlPosition.RIGHT_BOTTOM :
              google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);
          this.closeInfoModal(canvasElement);

          // set up map markers
          let type1Markers = locationList.filter(obj => {
              return obj[2] === 'markerType1';
          });
          let type2Markers = locationList.filter(obj => {
              return obj[2] === 'markerType2';
          });
          let type3Markers = locationList.filter(obj => {
              return obj[2] === 'markerType3';
          });
          let type4Markers = locationList.filter(obj => {
              return obj[2] === 'markerType4';
          });

          // impact and related are "legacy", can remove soon
          let impactMarkers = locationList.filter(obj => {
              return obj[2] === 'placesYouveImpacted';
          });
          let relatedMarkers = locationList.filter(obj => {
              return obj[2] === 'relatedWork';
          });
          let markers = this.setMarkers(this.map, locationList, canvasElement);

          // legacy (.impact), can remove soon
          $__default["default"]('.c-impact-map-canvas').on('change', '.map-control .impact input[type=checkbox]', (event) => {
              $__default["default"]('.c-impact-map').removeClass('modalOpen');
              $__default["default"]('.c-impact-map-infomodal').html('');
              for(var i = 0; i < markers.length; i++){
                  impactMarkers.find(element => {
                      if(element[1] === markers[i].template){
                          markers[i].setVisible($__default["default"](event.currentTarget).prop('checked'));
                      }
                  });
              }
              $__default["default"]('.c-impact-map-list-location').each(function() {
                  if($__default["default"](this).data('locationtype') === 'placesYouveImpacted'){
                      $__default["default"](this).toggle($__default["default"](event.currentTarget).prop('checked'));
                  }
              });
              checkMarked();
          });

          // legacy (.related), can remove soon
          $__default["default"]('.c-impact-map-canvas').on('change', '.map-control .related input[type=checkbox]', (event) => {
              $__default["default"]('.c-impact-map').removeClass('modalOpen');
              $__default["default"]('.c-impact-map-infomodal').html('');
              for(var i = 0; i < markers.length; i++){
                  relatedMarkers.find(element => {
                      if(element[1] === markers[i].template){
                          markers[i].setVisible($__default["default"](event.currentTarget).prop('checked'));
                      }
                  });
              }
              $__default["default"]('.c-impact-map-list-location').each(function() {
                  if($__default["default"](this).data('locationtype') === 'relatedWork'){
                      $__default["default"](this).toggle($__default["default"](event.currentTarget).prop('checked'));
                  }
              });

              checkMarked();
          });

          // Configurable marker types

          $__default["default"]('.c-impact-map-canvas').on('change',
              '.map-control .markerType1 input[type=checkbox]', (event) => {
              $__default["default"]('.c-impact-map').removeClass('modalOpen');
              $__default["default"]('.c-impact-map-infomodal').html('');
              for (var i = 0; i < markers.length; i++) {
                  type1Markers.find(element => {
                      if (element[1] === markers[i].template) {
                          markers[i].setVisible($__default["default"](event.currentTarget).prop('checked'));
                      }
                  });
              }
              $__default["default"]('.c-impact-map-list-location').each(function () {
                  if ($__default["default"](this).data('locationtype') === 'markerType1') {
                      $__default["default"](this).toggle($__default["default"](event.currentTarget).prop('checked'));
                  }
              });
              checkMarked();
          });

          $__default["default"]('.c-impact-map-canvas').on('change',
              '.map-control .markerType2 input[type=checkbox]', (event) => {
              $__default["default"]('.c-impact-map').removeClass('modalOpen');
              $__default["default"]('.c-impact-map-infomodal').html('');
              for (var i = 0; i < markers.length; i++) {
                  type2Markers.find(element => {
                      if (element[1] === markers[i].template) {
                          markers[i].setVisible($__default["default"](event.currentTarget).prop('checked'));
                      }
                  });
              }
              $__default["default"]('.c-impact-map-list-location').each(function () {
                  if ($__default["default"](this).data('locationtype') === 'markerType2') {
                      $__default["default"](this).toggle($__default["default"](event.currentTarget).prop('checked'));
                  }
              });
              checkMarked();
          });

          $__default["default"]('.c-impact-map-canvas').on('change',
              '.map-control .markerType3 input[type=checkbox]', (event) => {
              $__default["default"]('.c-impact-map').removeClass('modalOpen');
              $__default["default"]('.c-impact-map-infomodal').html('');
              for (var i = 0; i < markers.length; i++) {
                  type3Markers.find(element => {
                      if (element[1] === markers[i].template) {
                          markers[i].setVisible($__default["default"](event.currentTarget).prop('checked'));
                      }
                  });
              }
              $__default["default"]('.c-impact-map-list-location').each(function () {
                  if ($__default["default"](this).data('locationtype') === 'markerType3') {
                      $__default["default"](this).toggle($__default["default"](event.currentTarget).prop('checked'));
                  }
              });
              checkMarked();
          });

          $__default["default"]('.c-impact-map-canvas').on('change',
              '.map-control .markerType4 input[type=checkbox]', (event) => {
              $__default["default"]('.c-impact-map').removeClass('modalOpen');
              $__default["default"]('.c-impact-map-infomodal').html('');
              for (var i = 0; i < markers.length; i++) {
                  type4Markers.find(element => {
                      if (element[1] === markers[i].template) {
                          markers[i].setVisible($__default["default"](event.currentTarget).prop('checked'));
                      }
                  });
              }
              $__default["default"]('.c-impact-map-list-location').each(function () {
                  if ($__default["default"](this).data('locationtype') === 'markerType4') {
                      $__default["default"](this).toggle($__default["default"](event.currentTarget).prop('checked'));
                  }
              });
              checkMarked();
          });

          const controller = centerControlDiv.childNodes[0];

          if (controller) {
              controller.addEventListener('click', eve => {
                  eve.target.classList.toggle('open-controller');
              });
          }

          this.closeControllers(centerControlDiv, controller);

          function checkMarked() {
              // Below, .related and .impact are "legacy", can remove soon
              if ($__default["default"]('.map-control .markerType1 input[type=checkbox]').prop('checked') ||
                  $__default["default"]('.map-control .markerType2 input[type=checkbox]').prop('checked') ||
                  $__default["default"]('.map-control .markerType3 input[type=checkbox]').prop('checked') ||
                  $__default["default"]('.map-control .markerType4 input[type=checkbox]').prop('checked') ||
                  $__default["default"]('.map-control .related input[type=checkbox]').prop('checked') ||
                  $__default["default"]('.map-control .impact input[type=checkbox]').prop('checked')) {
                  $__default["default"]('.c-impact-map-list-no-results').hide();
              }
              else {
                  $__default["default"]('.c-impact-map-list-no-results').show();
              }
          }
      }

      getMarkerTypes(canvasElement, locationList) {
          let markerTypes = [];
          let markerTypeCodes = new Set();

          let markerType1Label = canvasElement.data("marker-type-1-label") || "";
          let markerType2Label = canvasElement.data("marker-type-2-label") || "";
          let markerType3Label = canvasElement.data("marker-type-3-label") || "";
          let markerType4Label = canvasElement.data("marker-type-4-label") || "";

          for (const location of locationList) {
              markerTypeCodes.add(location[2]);
          }

          markerTypeCodes.forEach((markerTypeCode) => {
              let markerType = {};
              let markerTypeLabel = "";

              // Handle "legacy" values (can be removed soon)
              if (markerTypeCode === "placesYouveImpacted") {
                  markerTypeCode = "impact";
                  markerTypeLabel = "Places You’ve Impacted";
              }
              else if (markerTypeCode === "relatedWork") {
                  markerTypeCode = "related";
                  markerTypeLabel = "Related Work";
              }

              // Handle configurable markers
              if (markerTypeCode === "markerType1") {
                  markerTypeLabel = markerType1Label;
              }
              else if (markerTypeCode === "markerType2") {
                  markerTypeLabel = markerType2Label;
              }
              else if (markerTypeCode === "markerType3") {
                  markerTypeLabel = markerType3Label;
              }
              else if (markerTypeCode === "markerType4") {
                  markerTypeLabel = markerType4Label;
              }

              markerType["code"] = markerTypeCode;
              markerType["label"] = markerTypeLabel;
              markerTypes.push(markerType);
          });

          return markerTypes;
      }

      // Create legend for marker types.
      createControls(controlDiv, markerTypes) {
          const controlUI = document.createElement("div");
          controlUI.className = "map-control";
          controlDiv.appendChild(controlUI);

          markerTypes.forEach((markerType) => {
              const labelEl = document.createElement("label");
              labelEl.className = "label " + markerType["code"];
              labelEl.setAttribute("tabindex", "0");
              labelEl.innerHTML = "<span class='control-label'>" +
                  markerType["label"] + "</span>";

              const switchEl = document.createElement("span");
              switchEl.className = "switch";
              switchEl.innerHTML = "<span><input type='checkbox' " +
                  "name='" + markerType["code"] + "Toggle' checked> <span " +
                  "class='slider round'></span></span>";

              labelEl.appendChild(switchEl);
              controlUI.appendChild(labelEl);
          });
      }

      // Add markers to the map.
      setMarkers(map, locations, canvasElement) {
          let image = {
              url: '/etc.clientlibs/tnc/clientlibs/assets/resources/icons/icon-impact-map-green-star-marker.svg',
              scaledSize: new google.maps.Size(40, 40),
              // The origin for this image is (0, 0).
              origin: new google.maps.Point(0, 0),
              // The anchor for this image is the base of the flagpole at (0, 32).
              anchor: new google.maps.Point(40, 40)
          };

          let relatedImage = {
              url: '/etc.clientlibs/tnc/clientlibs/assets/resources/icons/icon-impact-map-black-circle-marker.svg',
              scaledSize: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(40, 40)
          };

          let markerType1Image = {
              url: '/etc.clientlibs/tnc/clientlibs/assets/resources/icons/icon-impact-map-green-star-marker.svg',
              scaledSize: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(40, 40)
          };

          let markerType2Image = {
              url: '/etc.clientlibs/tnc/clientlibs/assets/resources/icons/icon-impact-map-black-circle-marker.svg',
              scaledSize: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(40, 40)
          };

          let markerType3Image = {
              url: '/etc.clientlibs/tnc/clientlibs/assets/resources/icons/icon-impact-map-blue-arrow-marker.svg',
              scaledSize: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(40, 40)
          };

          let markerType4Image = {
              url: '/etc.clientlibs/tnc/clientlibs/assets/resources/icons/icon-impact-map-gold-diamond-marker.svg',
              scaledSize: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(40, 40)
          };
          // instantiate the bounds object
          const bounds = new google.maps.LatLngBounds();
          const markers = new Array();

          function handleKeyboardActions() {
              const isModalOpen = document.querySelector('.modalOpen');
              if (isModalOpen) {
                  document.addEventListener('keydown', e => {
                      if (e.key === 'Escape') {
                          $__default["default"]('.c-impact-map').removeClass('modalOpen');
                          $__default["default"]('.c-impact-map-infomodal').removeClass('showing').html('');
                          $__default["default"]('.c-impact-map-list-location').each(function(){
                              $__default["default"](this).removeClass("-active");
                          });

                          if(isMobile() || isTablet()) unlockScroll();
                      }
                  });
              }
          }

          function modalCTAAnalytics(button) {
              if (button) {
                  const analyticsData = button.dataset && button.dataset.analytics ? button.dataset.analytics : {};

                  button.addEventListener('click', () => {
                      utl__default["default"].setAnalyticsByPage(JSON.parse(analyticsData), true);
                  });
              }
          }

          function openInfoModalAnalytics(data) {
              if (data && Object.keys(data).length) {
                  const analyticsData = data;

                  utl__default["default"].setAnalyticsByPage(analyticsData, true);
              }
          }

          function focusTrap(element) {
              element.focus();

              const removeTrap = (event) => {
                  if (event.type === 'keydown') {
                      const isTabPressed = event.code === 'Tab';
                      if (!isTabPressed) return;

                      if (document.activeElement !== element) {
                          event.target.focus();
                      }
                  }
              };

              if (element) {
                  document.addEventListener('keydown', removeTrap);
              }
          }

          for (const element of locations) {
              let locationArr = element[0].split(', ');
              let [lat, lng] = locationArr;

              let icon;
              let markerTypeCode = element[2];

              // Handle "legacy" values (can be removed soon)
              if (markerTypeCode === "placesYouveImpacted") {
                  icon = image;
              }
              else if (markerTypeCode === "relatedWork") {
                  icon = relatedImage;
              }

              // Handle configurable markers
              if (markerTypeCode === "markerType1") {
                  icon = markerType1Image;
              }
              else if (markerTypeCode === "markerType2") {
                  icon = markerType2Image;
              }
              else if (markerTypeCode === "markerType3") {
                  icon = markerType3Image;
              }
              else if (markerTypeCode === "markerType4") {
                  icon = markerType4Image;
              }

              let mark = new google.maps.Marker({
                  animation: google.maps.Animation.DROP,
                  icon: icon,
                  map: map,
                  template: element[1],
                  zIndex: 1,
                  position: { lat: Number(lat), lng: Number(lng) },
                  canvasElement: canvasElement   // pass along for info dialog
              });

              let locationLatLng = new google.maps.LatLng(Number(lat), Number(lng));
              bounds.extend(locationLatLng);

              google.maps.event.addListener(mark, 'click', (function (mark) {

                  return function (event) {
                      let impactMapElement = canvasElement.closest('.c-impact-map');
                      impactMapElement.addClass('modalOpen');
                      let infoModalElement = impactMapElement.find(
                          '.c-impact-map-infomodal');
                      infoModalElement.addClass('showing');
                      infoModalElement.html(mark.template);

                      const buttons = Array.prototype.slice.call($__default["default"]('.c-button-close'));
                      const mainCTAsButtons = Array.prototype.slice.call($__default["default"]('.c-impact-map-marker-cta'));
                      const headlines = Array.prototype.slice.call($__default["default"]('.c-impact-map-marker-headline'));
                      const currentCloseButton = buttons[0];

                      const analyticsData = {
                          event_name: 'location_preview',
                          location_name: headlines && headlines.length ? headlines[0].innerText : '',
                          preview_type: event && Object.keys(event).length ? 'pin' : 'list'
                      };

                      openInfoModalAnalytics(analyticsData);

                      if (mainCTAsButtons) {
                          modalCTAAnalytics(mainCTAsButtons[0]);
                      }

                      if (currentCloseButton) {
                          focusTrap(currentCloseButton);
                      }

                      if(isMobile() || isTablet()) lockScroll();

                      let closeElements = impactMapElement.find(
                          ".c-button-close");
                      $__default["default"](closeElements).on('click', function (e) {
                          e.preventDefault();
                          if (isMobile() || isTablet()) {
                              unlockScroll();
                          }
                          impactMapElement.removeClass('modalOpen');
                          infoModalElement.removeClass('showing').html('');
                          impactMapElement.find('.c-impact-map-list-location').each(
                              function () {
                                  $__default["default"](this).removeClass("-active");
                              }
                          );
                      });

                      // Close the info modal Key Escape event
                      handleKeyboardActions();
                  }
              })(mark));

              markers.push(mark);
          }

          let locationElements = canvasElement.closest(".c-impact-map").find(
              ".c-impact-map-list-location");
          locationElements.each(function () {
              $__default["default"](this).on("click", function () {
                  $__default["default"]('.c-impact-map-list-location').each(
                      function(){$__default["default"](this).removeClass("-active");});
                  $__default["default"](this).addClass("-active");
                  google.maps.event.trigger(
                      markers[$__default["default"](this).data('markerid')], 'click');
              });
              $__default["default"](this).on("keydown", function (event) {
                  if (event.code === "Space" || event.code === "Enter") {
                      event.preventDefault();
                      $__default["default"]('.c-impact-map-list-location').each(
                          function(){$__default["default"](this).removeClass("-active");});
                      $__default["default"](this).addClass("-active");
                      google.maps.event.trigger(
                          markers[$__default["default"](this).data('markerid')], 'click');
                  }
              });
          });

          map.fitBounds(bounds);       // auto-zoom
          map.panToBounds(bounds);     // auto-center

          let preserveZoomLevel = $__default["default"]("input[name='preservezoom']").val();
          if (preserveZoomLevel) {
              let listener = google.maps.event.addListener(map, "idle", function () {
                  map.setZoom(Number(preserveZoomLevel));
                  google.maps.event.removeListener(listener);
              });
          } else {
              map.getZoom() >= 17 && this.map.setZoom(11);
          }
          return markers;
      }
  }

  var impactMap_component = new ImpactMap();

  return impactMap_component;

})($, TNC.Modal, TNC.Utility);
//# sourceMappingURL=impact-map.component.js.map

this.TNC = this.TNC || {};
this.TNC.VimeoVideo = (function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  /** Youtube Video Class. */
  class VimeoVideo {
    /**
     * YoutubeVideo constructor
     */
    constructor(options) {
      this.options = options;

      this.initialize();
    }

    /**
     * Initialization function
     */
    initialize() {
      let defaults = {
        milestones: [50],
        pollingTime: 100
      };

      this.settings = $__default["default"].extend(true, {}, defaults, this.options);

      $__default["default"]('.v-video iframe[src*="vimeo.com"]').video(this.settings);
    }
  }

  var vimeoVideo_component = new VimeoVideo();

  return vimeoVideo_component;

})($);
//# sourceMappingURL=vimeo-video.component.js.map

this.TNC = this.TNC || {};
this.TNC.Storytelling = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    /*global IntersectionObserver*/
    /** Storytelling Class. */
    class Storytelling {
        /**
         * Storytelling constructor
         */
        constructor() {
            this.initialize();
        }
            /**
             * Initialization function
             */
        initialize() {
            
            document.querySelectorAll('.parallax').forEach(elem => {
              this.elementWatcher(elem);
            });
            document.querySelectorAll('.c-storytelling-video').forEach(vid => {


              console.log('video', vid);
              let playButton = $__default["default"](vid).find('button')[0];
              let ctrlVideo = $__default["default"](vid).find('video')[0];
              playButton.classList.add('pause');
              playButton.addEventListener('click', function(){
                // console.log('play Clicked', ctrlVideo, playButton, ctrlVideo.paused);

                if(ctrlVideo.paused === true){
                  ctrlVideo.play();
                  ctrlVideo.classList.toggle('play');
                  playButton.classList.add('pause');
                  playButton.classList.remove('play');
                } else {
                  ctrlVideo.pause();
                  ctrlVideo.classList.toggle('play');
                  playButton.classList.add('play');
                  playButton.classList.remove('pause');
                }
              });
            });
            setTimeout( function(){
              $__default["default"]('.parallax').first().addClass('active');
            }, 200);
          }
          elementWatcher(elem) {
            const thresholdArray = steps => Array(steps + 1).fill(0) .map((_, index) => index / steps || 0);
            let previousY = 0;
            let previousRatio = 0;
            var observer = new IntersectionObserver(function(entries) {
              const currentY = entries[0].boundingClientRect.y;
              const currentRatio = entries[0].intersectionRatio;
              const isIntersecting = entries[0].isIntersecting;
              if(isIntersecting) {
                if (currentY < previousY) {
                  if (currentRatio > previousRatio && currentRatio > 0.25) {
                    // console.log('scroll down enter', entries[0].target)
                    entries[0].target.classList.add('active');
                    entries[0].target.classList.remove('inactive');
                  } else if(currentRatio < 0.25) {
                    entries[0].target.classList.remove('active');
                    entries[0].target.classList.add('inactive');
                    // console.log("Scroll down leave", $(entries[0].target))
                    // $(entries[0].target).find('video').pause();
                  }
                } else if (currentY > previousY) {
                  if (currentRatio < previousRatio && currentRatio < 0.25) {
                    entries[0].target.classList.remove('active');
                    entries[0].target.classList.add('inactive');
                    // console.log("Scroll up leave", $(entries[0].target));
                    // $(entries[0].target).find('video').pause();
                  } else if(currentRatio > 0.25) {
                    entries[0].target.classList.add('active');
                    entries[0].target.classList.remove('inactive');
                    // console.log("Scroll up enter", entries[0].target)
                  }
                }
                previousY = currentY;
                previousRatio = currentRatio;

              }
            }, { threshold: thresholdArray(20) });

            observer.observe(elem);

          }
    }

    var storytelling_component = new Storytelling();

    return storytelling_component;

})($);
//# sourceMappingURL=storytelling.component.js.map

this.TNC = this.TNC || {};
this.TNC.VerticalTimeline = (function ($, mediaModal) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var mediaModal__default = /*#__PURE__*/_interopDefaultLegacy(mediaModal);

    // Vertical Timeline component JS goes here
    // import modalModule from '../../assets/scripts/modal/modal.module';

    /** Vertical Timeline Class. */
    class VerticalTimeline {
        /**
         * MediaGallery constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            this.initEvents();
        }

        initEvents() {
            $__default["default"]('.c-vertical-timeline-card.triggerCta').on('click', (event) => {
                let href = $__default["default"](event.currentTarget).find(".c-vertical-timeline-link").attr("href");
                if (href !== undefined) {
                    window.location = href;
                }
            });

            $__default["default"]('.c-vertical-timeline-card').on('click', '.triggerModal', (event) => {
                event.stopPropagation();
                event.preventDefault();
                mediaModal__default["default"].showModal(event);
            });

            $__default["default"]('body').on('click touchend', '.c-modal-carousel', (event) => {
                event.preventDefault();
                event.stopPropagation();
                mediaModal__default["default"].hideModal(event);
            });
        }
    }

    var verticalTimeline_component = new VerticalTimeline();

    return verticalTimeline_component;

})($, TNC.Modal);
//# sourceMappingURL=vertical-timeline.component.js.map

this.TNC = this.TNC || {};
this.TNC.ContactDetail = (function () {
    'use strict';

    // Contact Detail component JS goes here
    // import $ from 'jquery';
    /** Contact Detail Class. */
    class ContactDetail {
        /**
         * ContactDetail constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var contactDetail_component = new ContactDetail();

    return contactDetail_component;

})();
//# sourceMappingURL=contact-detail.component.js.map

this.TNC = this.TNC || {};
this.TNC.AnchorLinks = (function ($, utl) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

  /* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */
  (function () {

    // polyfill
    function polyfill() {
      // aliases
      var w = window;
      var d = document;

      // return if scroll behavior is supported and polyfill is not forced
      if (
        'scrollBehavior' in d.documentElement.style &&
        w.__forceSmoothScrollPolyfill__ !== true
      ) {
        return;
      }

      // globals
      var Element = w.HTMLElement || w.Element;
      var SCROLL_TIME = 468;

      // object gathering original scroll methods
      var original = {
        scroll: w.scroll || w.scrollTo,
        scrollBy: w.scrollBy,
        elementScroll: Element.prototype.scroll || scrollElement,
        scrollIntoView: Element.prototype.scrollIntoView
      };

      // define timing method
      var now =
        w.performance && w.performance.now
          ? w.performance.now.bind(w.performance)
          : Date.now;

      /**
       * indicates if a the current browser is made by Microsoft
       * @method isMicrosoftBrowser
       * @param {String} userAgent
       * @returns {Boolean}
       */
      function isMicrosoftBrowser(userAgent) {
        var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

        return new RegExp(userAgentPatterns.join('|')).test(userAgent);
      }

      /*
       * IE has rounding bug rounding down clientHeight and clientWidth and
       * rounding up scrollHeight and scrollWidth causing false positives
       * on hasScrollableSpace
       */
      var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

      /**
       * changes scroll position inside an element
       * @method scrollElement
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */
      function scrollElement(x, y) {
        this.scrollLeft = x;
        this.scrollTop = y;
      }

      /**
       * returns result of applying ease math function to a number
       * @method ease
       * @param {Number} k
       * @returns {Number}
       */
      function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
      }

      /**
       * indicates if a smooth behavior should be applied
       * @method shouldBailOut
       * @param {Number|Object} firstArg
       * @returns {Boolean}
       */
      function shouldBailOut(firstArg) {
        if (
          firstArg === null ||
          typeof firstArg !== 'object' ||
          firstArg.behavior === undefined ||
          firstArg.behavior === 'auto' ||
          firstArg.behavior === 'instant'
        ) {
          // first argument is not an object/null
          // or behavior is auto, instant or undefined
          return true;
        }

        if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
          // first argument is an object and behavior is smooth
          return false;
        }

        // throw error when behavior is not supported
        throw new TypeError(
          'behavior member of ScrollOptions ' +
            firstArg.behavior +
            ' is not a valid value for enumeration ScrollBehavior.'
        );
      }

      /**
       * indicates if an element has scrollable space in the provided axis
       * @method hasScrollableSpace
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function hasScrollableSpace(el, axis) {
        if (axis === 'Y') {
          return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
        }

        if (axis === 'X') {
          return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
        }
      }

      /**
       * indicates if an element has a scrollable overflow property in the axis
       * @method canOverflow
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function canOverflow(el, axis) {
        var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

        return overflowValue === 'auto' || overflowValue === 'scroll';
      }

      /**
       * indicates if an element can be scrolled in either axis
       * @method isScrollable
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function isScrollable(el) {
        var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
        var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

        return isScrollableY || isScrollableX;
      }

      /**
       * finds scrollable parent of an element
       * @method findScrollableParent
       * @param {Node} el
       * @returns {Node} el
       */
      function findScrollableParent(el) {
        while (el !== d.body && isScrollable(el) === false) {
          el = el.parentNode || el.host;
        }

        return el;
      }

      /**
       * self invoked function that, given a context, steps through scrolling
       * @method step
       * @param {Object} context
       * @returns {undefined}
       */
      function step(context) {
        var time = now();
        var value;
        var currentX;
        var currentY;
        var elapsed = (time - context.startTime) / SCROLL_TIME;

        // avoid elapsed times higher than one
        elapsed = elapsed > 1 ? 1 : elapsed;

        // apply easing to elapsed time
        value = ease(elapsed);

        currentX = context.startX + (context.x - context.startX) * value;
        currentY = context.startY + (context.y - context.startY) * value;

        context.method.call(context.scrollable, currentX, currentY);

        // scroll more if we have not reached our destination
        if (currentX !== context.x || currentY !== context.y) {
          w.requestAnimationFrame(step.bind(w, context));
        }
      }

      /**
       * scrolls window or element with a smooth behavior
       * @method smoothScroll
       * @param {Object|Node} el
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */
      function smoothScroll(el, x, y) {
        var scrollable;
        var startX;
        var startY;
        var method;
        var startTime = now();

        // define scroll context
        if (el === d.body) {
          scrollable = w;
          startX = w.scrollX || w.pageXOffset;
          startY = w.scrollY || w.pageYOffset;
          method = original.scroll;
        } else {
          scrollable = el;
          startX = el.scrollLeft;
          startY = el.scrollTop;
          method = scrollElement;
        }

        // scroll looping over a frame
        step({
          scrollable: scrollable,
          method: method,
          startTime: startTime,
          startX: startX,
          startY: startY,
          x: x,
          y: y
        });
      }

      // ORIGINAL METHODS OVERRIDES
      // w.scroll and w.scrollTo
      w.scroll = w.scrollTo = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scroll.call(
            w,
            arguments[0].left !== undefined
              ? arguments[0].left
              : typeof arguments[0] !== 'object'
                ? arguments[0]
                : w.scrollX || w.pageXOffset,
            // use top prop, second argument if present or fallback to scrollY
            arguments[0].top !== undefined
              ? arguments[0].top
              : arguments[1] !== undefined
                ? arguments[1]
                : w.scrollY || w.pageYOffset
          );

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(
          w,
          d.body,
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : w.scrollX || w.pageXOffset,
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : w.scrollY || w.pageYOffset
        );
      };

      // w.scrollBy
      w.scrollBy = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0])) {
          original.scrollBy.call(
            w,
            arguments[0].left !== undefined
              ? arguments[0].left
              : typeof arguments[0] !== 'object' ? arguments[0] : 0,
            arguments[0].top !== undefined
              ? arguments[0].top
              : arguments[1] !== undefined ? arguments[1] : 0
          );

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(
          w,
          d.body,
          ~~arguments[0].left + (w.scrollX || w.pageXOffset),
          ~~arguments[0].top + (w.scrollY || w.pageYOffset)
        );
      };

      // Element.prototype.scroll and Element.prototype.scrollTo
      Element.prototype.scroll = Element.prototype.scrollTo = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          // if one number is passed, throw error to match Firefox implementation
          if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
            throw new SyntaxError('Value could not be converted');
          }

          original.elementScroll.call(
            this,
            // use left prop, first number argument or fallback to scrollLeft
            arguments[0].left !== undefined
              ? ~~arguments[0].left
              : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
            // use top prop, second argument or fallback to scrollTop
            arguments[0].top !== undefined
              ? ~~arguments[0].top
              : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
          );

          return;
        }

        var left = arguments[0].left;
        var top = arguments[0].top;

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(
          this,
          this,
          typeof left === 'undefined' ? this.scrollLeft : ~~left,
          typeof top === 'undefined' ? this.scrollTop : ~~top
        );
      };

      // Element.prototype.scrollBy
      Element.prototype.scrollBy = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.elementScroll.call(
            this,
            arguments[0].left !== undefined
              ? ~~arguments[0].left + this.scrollLeft
              : ~~arguments[0] + this.scrollLeft,
            arguments[0].top !== undefined
              ? ~~arguments[0].top + this.scrollTop
              : ~~arguments[1] + this.scrollTop
          );

          return;
        }

        this.scroll({
          left: ~~arguments[0].left + this.scrollLeft,
          top: ~~arguments[0].top + this.scrollTop,
          behavior: arguments[0].behavior
        });
      };

      // Element.prototype.scrollIntoView
      Element.prototype.scrollIntoView = function() {
        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scrollIntoView.call(
            this,
            arguments[0] === undefined ? true : arguments[0]
          );

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        var scrollableParent = findScrollableParent(this);
        var parentRects = scrollableParent.getBoundingClientRect();
        var clientRects = this.getBoundingClientRect();

        if (scrollableParent !== d.body) {
          // reveal element inside parent
          smoothScroll.call(
            this,
            scrollableParent,
            scrollableParent.scrollLeft + clientRects.left - parentRects.left,
            scrollableParent.scrollTop + clientRects.top - parentRects.top
          );

          // reveal parent in viewport unless is fixed
          if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
            w.scrollBy({
              left: parentRects.left,
              top: parentRects.top,
              behavior: 'smooth'
            });
          }
        } else {
          // reveal element in viewport
          w.scrollBy({
            left: clientRects.left,
            top: clientRects.top,
            behavior: 'smooth'
          });
        }
      };
    }

    if (typeof exports === 'object' && typeof module !== 'undefined') {
      // commonjs
      module.exports = { polyfill: polyfill };
    } else {
      // global
      polyfill();
    }

  }());

  // Anchor Links component JS goes here

  /** Anchor Links Class. */
  class AnchorLinks {
      /**
       * AnchorLinks constructor
       */
      constructor() {
          this.initialize();
      }

      /**
       * Initialization function
       */
      initialize() {
          this.container = $__default["default"]('.c-anchor-links');
          this.mobileButton = $__default["default"]('.c-anchor-links__mobile-button-container');
          if (this.container.length) {
            this.stickyPoint = this.container.offset().top;
            // this.containerObj = [];
            //
            // this.containerOuter.each((index, value) => {
            //     let item = $(value);
            //     let currentItem = {};
            //     currentItem.staticPosition = item.offset().top;
            //     currentItem.item = item;
            //
            //     this.containerObj.push(currentItem);
            // });

            // check for sticky header and apply position offset
            if ($__default["default"]('.cd-main-header').length && $__default["default"]('.cd-main-header').attr('data-sticky-header') === 'sticky-header' || $__default["default"]('.c-header').length && $__default["default"]('.c-header').attr('data-sticky-header') === 'sticky-header') {
              if ($__default["default"]('.cd-main-header').hasClass('sticky-language')) {
                this.container.addClass('sticky-header-offset-lang');
              } else {
                this.container.addClass('sticky-header-offset');
              }
              this.stickyHeaderOffsetEvent();
            }
            $__default["default"](document).on('scroll', () => {
                this.scrollHandler();
                this.scrollHighlight();
            });
          }

          // mobile anchor links menu click outside to close
          $__default["default"](document).on('click', function (e) {
            var container = $__default["default"]('.mobile-menu-anchor');
            if ($__default["default"]("#c-anchor-links__mobile-menu-container").hasClass('_menu-open') && !container.is(e.target)) {
              $__default["default"]('#c-anchor-links__mobile-button').trigger('click');
            }
          });

          // mobile anchor links menu click open/close
          $__default["default"]('#c-anchor-links__mobile-button').on('click', e => {
            e.preventDefault();
            e.stopPropagation();
            $__default["default"]('#c-anchor-links__mobile-menu-container').toggleClass(function() {
              return $__default["default"](this).is('._menu-closed, ._menu-open') ? '_menu-closed _menu-open' : '_menu-closed';
            });
          });

          // Highlight the first anchor link item.
          const $firstChild = $__default["default"]('.c-anchor-links__item:first-child');
          let $anchorLink = '.c-anchor-links__link';
          $firstChild.find($anchorLink).addClass('is-active bx-shdo-clr-p3-bottom');

          $__default["default"]('.c-anchor-links__item').on('click', e => {
              e.preventDefault();

              // Highlight the newly activated anchor link item.
              $__default["default"]('.c-anchor-links__items').find($anchorLink).removeClass(
                  'is-active bx-shdo-clr-p3-bottom');
              $__default["default"](e.currentTarget).find($anchorLink).addClass(
                  'is-active bx-shdo-clr-p3-bottom');

              let anchorLink = $__default["default"](e.currentTarget).find($anchorLink).attr('href');
              let sectionId = this.scrollToSection(anchorLink);

              let anchorLinkText = $__default["default"](e.currentTarget).find($anchorLink).text();
              let analyticsLinkText = anchorLinkText.trim();
              var _analytics = {
                'event_name': 'anchor_link_click',
                'tab_title': analyticsLinkText
              };
              utl__default["default"].setAnalyticsByPage(_analytics, true);

              // If there's a URL fragment (such as from visiting the page
              // with an #anchor-label), remove it so the look of the URL
              // does not conflict with the currently selected section.
              if (window.location.hash) {
                  window.location.hash = "";
              }

              // Set focus to the first interactive item (if any) in the section.
              let section = $__default["default"](sectionId);
              let firstInteractiveItem = section.find(
                  "a, button, input, select").get(0);
              if (firstInteractiveItem) {
                  if (firstInteractiveItem.localName === 'iframe') {
                      // An iframe often indicates an embedded media player
                      // (YouTube, etc.).
                      // Set focus on the iframe's parent div, which is
                      // expected to have tabindex="0" (this is entirely our
                      // convention).
                      // From there, it will be possible to tab into the
                      // controls within the iframe.
                      $__default["default"](firstInteractiveItem).parent().focus();
                  }
                  else {
                      firstInteractiveItem.focus();
                  }
              }

          });

          this.checkForFragment();
      }

      // apply position offset when sticky header is present
      stickyHeaderOffsetEvent() {
        $__default["default"](window).scroll(function() {
          if($__default["default"]('.cd-main-header').hasClass('_sticky-down')) {
            $__default["default"]('.c-anchor-links').removeClass('_sticky-up');
            $__default["default"]('.c-anchor-links').addClass('_sticky-down');
            } else if ($__default["default"]('.cd-main-header').hasClass('_sticky-up')) {
              $__default["default"]('.c-anchor-links').removeClass('_sticky-down');
              $__default["default"]('.c-anchor-links').addClass('_sticky-up');
            } else if($__default["default"]('.c-header').hasClass('sticky-down')) {
              $__default["default"]('.c-anchor-links').removeClass('_sticky-up');
              $__default["default"]('.c-anchor-links').addClass('_sticky-down');
            } else if ($__default["default"]('.c-header').hasClass('sticky-up')) {
              $__default["default"]('.c-anchor-links').removeClass('_sticky-down');
              $__default["default"]('.c-anchor-links').addClass('_sticky-up');
            }

        });
      }

      scrollToSection(anchorLinkHref) {
          let sectionId = `${anchorLinkHref}`;
          let $target = $__default["default"](sectionId);
          let targetTopMargin = $target.css("margin-top");
          let targetMarginVal = parseFloat(targetTopMargin, 10);
          if ($target && $target.length) {
              $__default["default"]("html, body").animate({
                  scrollTop: $target.offset().top -
                      this.container.height() - targetMarginVal
              }, 800);
          }
          return sectionId;
      }

      checkForFragment() {
          // Check to see whether this page's URL has a fragment, in which
          // case activate the corresponding anchor link.
          var location = window.location;
          if (location.hash) {
              var fragment = location.hash.trim().replace("#", "");
              var anchorLinks = $__default["default"](".c-anchor-links__link");
              var anchorToActivate;
              // Look for an anchor link with a label matching the fragment.
              for (var i = 0; i < anchorLinks.length; i++) {
                  var linkAsFragment = utl__default["default"].getFragment(
                      $__default["default"](anchorLinks[i]).text());
                  if (linkAsFragment === fragment) {
                      anchorToActivate = anchorLinks[i];
                      break;
                  }
              }
              if (anchorToActivate) {
                  // Highlight the newly activated anchor link item.
                  $__default["default"](".c-anchor-links__link").removeClass(
                      "is-active bx-shdo-clr-p3-bottom");
                  $__default["default"](anchorToActivate).addClass(
                      "is-active bx-shdo-clr-p3-bottom");

                  // In order to make the final scroll position accurate,
                  // first scroll to the bottom of the page.
                  window.scrollTo(0, document.body.scrollHeight);

                  // Then, after a short delay, scroll up to the section.
                  var that = this;
                  setTimeout(function () {
                      let anchorLink = $__default["default"](anchorToActivate).attr("href");
                      that.scrollToSection(anchorLink);
                  }, 500);
              }
          }
      }

      // Debounce event handlers
      // Source: https://davidwalsh.name/javascript-debounce-function
      // Should really be included as a utility as this is a common need for event handling
      debounce(func, wait, immediate) {
          let timeout;

          return function () {
              let context = this,
                  args = arguments;

              let later = function() {
                  timeout = null;
                  if (!immediate) func.apply(context, args);
              };

              let callNow = immediate && !timeout;

              clearTimeout(timeout);

              timeout = setTimeout(later, wait);

              if (callNow) func.apply(context, args);
          };
      }

      /**
       * * scrollHighlight function
       * Makes the anchor link highlight when scrolling through section
       * */
      scrollHighlight() {
        var scrollPos = $__default["default"](document).scrollTop();
        var anchorContainer = this.container;
        // throttled scroll into view function - seemed to run too many times when bound to scroll
        var scrollIntoView = this.debounce(function () {
          let activeLinks = document.getElementsByClassName(
            "c-anchor-links__link is-active");
          if (activeLinks && activeLinks.length > 0) {
             activeLinks[0].scrollIntoView({
               behavior: "smooth", block: "end", inline: "start"
             });
          }
        }, 500, 'immediate');

        $__default["default"]('.c-anchor-links__items .c-anchor-links__link').each(function () {
            var currLink = $__default["default"](this);
            var refElement = $__default["default"](currLink.attr("href"));
            if (refElement) {
                if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                    $__default["default"]('.c-anchor-links__items .c-anchor-links__link').removeClass("is-active bx-shdo-clr-p3-bottom");
                    currLink.addClass("is-active");
                    // scroll active link into view on mobile
                    if ($__default["default"](window).width() < 1000 && anchorContainer.hasClass('_sticky')) {
                      //delay scroll into view action by half second
                      setTimeout(scrollIntoView, 500);
                    }
                }
                else {
                    currLink.removeClass("is-active");
                }
            }
            else {
                console.log("Anchor Links: refElement does not exist");
            }
        });
      }

      /**
       * * ScrollHandler function
       * Makes the anchor link sticky
       * */
      scrollHandler() {
        var anchorEl = this.container;
        var fixedEls = $__default["default"]('.c-anchor-links, .mobile-menu-anchor');
        var mobileButton = this.mobileButton;
        var hasStickyClass = anchorEl.hasClass('_sticky');
        // var outerEl = this.outerEl;
        if (window.pageYOffset >= this.stickyPoint && !hasStickyClass) {
          fixedEls.addClass('_sticky');
          mobileButton.addClass('_fixed');
          //value.item.next('.place-holder').height(value.item.height());
        }
        else if (window.pageYOffset < this.stickyPoint && hasStickyClass) {
          fixedEls.removeClass("_sticky");
          mobileButton.removeClass('_fixed');
          //  value.item.next('.place-holder').height(0);
        }
      }
  }

  var anchorLinks_component = new AnchorLinks ();

  return anchorLinks_component;

})($, TNC.Utility);
//# sourceMappingURL=anchor-links.component.js.map

this.TNC = this.TNC || {};
this.TNC.TextAsset = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Text Asset component JS goes here
    /** Text Asset Class. */
    class TextAsset {
        /**
         * TextAsset constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            if ($__default["default"]('.rte__img .c-article-cta form').length) {
                $__default["default"]('.c-article-cta form').closest('.rte__img').addClass('article-cta-container');
            }
            // if ($('.rte__img .c-blockquote.container').length) {
            //     $('.c-blockquote.container').closest('.rte__img').addClass('article-cta-container');
            // }

            if (window.textAssestFlag) {
                var p = document.createElement("script");
                p.setAttribute('src', '../../../../../../dist/output/components/article-cta/article-cta.component.js');
                document.body.appendChild(p);

                p = document.createElement("script");
                p.setAttribute('src', '../../../../../../dist/output/components/block-quote/block-quote.component.js');
                document.body.appendChild(p);

                p = document.createElement("script");
                p.setAttribute('src', '../../../../../../dist/output/components/image/image.component.js');
                document.body.appendChild(p);

                p = document.createElement("script");
                p.setAttribute('src', '../../../../../../dist/output/components/youtube-video/youtube-video.component.js');
                document.body.appendChild(p);

                p = document.createElement("script");
                p.setAttribute('src', '../../../../../../dist/output/components/related-articles/related-articles.component.js');
                document.body.appendChild(p);
                
                p = document.createElement("script");
                p.setAttribute('src', '../../../../../../dist/output/components/resource-listing/resource-listing.component.js');
                document.body.appendChild(p);
            }
        }
    }

    var textAsset_component = new TextAsset();

    return textAsset_component;

})($);
//# sourceMappingURL=text-asset.component.js.map

this.TNC = this.TNC || {};
this.TNC.EventsDetail = (function () {
  'use strict';

  // Events Detail component JS goes here
  // import $ from 'jquery';
  /** Events Detail Class. */
  class EventsDetail {
    /**
     * EventsDetail constructor
     */
    constructor(config) {
      this.element = config.element;
      this.address = this.element.dataset.location;
      this.map;
      this.geocoder;
      this.initialize();
    }
    /**
     * Initialization function
     */
    initialize() {
        // console.log($);
        this.geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(-34.397, 150.644);
        const mapOptions = {
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          center: latlng,
          rotateControl: false,
          fullscreenControl: false
        };
        // init map
        this.map = new google.maps.Map(document.getElementById('e-map'), mapOptions);

        if (this.map && Object.keys(this.map).length) {
          // can't send the geocode inmediatly.
          setTimeout(() => {
            this.codeAddress(this.map);
          }, 2000);
        }
    }

    codeAddress() {
      const map = this.map;
      const element = this.element;

      // init geocode
      this.geocoder.geocode({ 'address': this.address }, function (results, status) {
        if (status === 'OK') {
          element.classList.add('loaded');
          map.setCenter(results[0].geometry.location);
          const marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
          marker.setMap(map);
        } else {
          element.classList.add('error');
          console.warn('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  }

  EventsDetail.selectors = {
    self: '.event-map'
  };

  (function(document) {
    function onDocumentReady() {
      // Initialize VolunteerDetail component
      const component = document.querySelector(EventsDetail.selectors.self);
      if (component) {
        console.log('event deets!');
        new EventsDetail({ element: component });
      }
    }

    if (document.readyState !== 'loading') {
      onDocumentReady();
    } else {
      document.addEventListener('DOMContentLoaded', onDocumentReady);
    }
  })(window.document);

  return EventsDetail;

})();
//# sourceMappingURL=events-detail.component.js.map

this.TNC = this.TNC || {};
this.TNC.PeopleAggregation = (function ($, tncUtility) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

  // People Aggregation component JS goes here
  /** People Aggregation Class. */
  class PeopleAggregation {

    /**
     * PeopleAggregation constructor
     */
    constructor() {
      this.componentWraper = '.c-ppl-category';
      this.pplData = {};
      this.categoryWiseData = {};
      this.loadMoreItems = 24;
      this.pageLoad = true;
      this.searchInput = '.pplaggrSearch';
      this.searchForm = '.ppl-form-search';
      this.featureResultContainer = '.result-container-feature';
      this.nonFeatureResultContainer = '.result-container-nonfeature';
      this.noResultContainer = '.result-container-noResult';
      this.showMore = '.c-cards-people__more-people';
      this.searchIcon = '.usrSearchSubmit';
      this.clearSearchIcon = '.clearSearch';
      this.singleResultHeader = '.singleResult';
      this.multiResultHeader = '.multiResult';
      this.nonFeatureHeader = '.nonFeatureHeading';
      this.allCategory = "tnc:people/all";
      this.initialize();
    }

    /**
      * getComponentId function : returns the component unique id
    */
    getComponentId($ele) {
      const $parentEle = $ele.closest(this.componentWraper),
        componentId = $parentEle.data('componentuniqueid'),
        categoryToDisplay = $parentEle.data('categoryToDisplay'),
        showFeatured = $parentEle.data('showFeatured');

      return { componentId, categoryToDisplay, showFeatured }
    }

    /**
       * getQueryString function :
       *  fetch the data from the url
       */
    getQueryString(componentId) {
      const searchWord = tncUtility__default["default"].getParameterByName("people_q");
      let compId = tncUtility__default["default"].getParameterByName("people_compId");
      let sortOption = tncUtility__default["default"].getParameterByName("people_sort");
      /* istanbul ignore else */
      if (componentId) {
        compId = componentId;
      }
      /* istanbul ignore else */
      if ($__default["default"](`#${compId}`).is(':visible')) {
        /* istanbul ignore if */
        if (sortOption) {
          $__default["default"](`#${compId}`).find(this.searchInput).val(searchWord);
          $__default["default"](`#${compId}`).find('select.pplSortBy').val(sortOption);
          $__default["default"](`#${compId}`).find('.selectpicker').selectpicker('render');
          if (!$__default["default"].trim(searchWord)) {
            $__default["default"](`#${compId}`).find('select.pplSortBy').trigger('change', [false]);
            // $(`#${compId}`).find('.selectpicker').selectpicker('val', sortOption);
            return false;
          }
        }
        /* istanbul ignore if */
        if ($__default["default"].trim(searchWord)) {
          // update the search keyword in the search box from url
          $__default["default"](`#${compId}`).find(this.searchInput).val(searchWord);

          $__default["default"](`#${compId}`).find('select.pplSortBy').val(sortOption);
          $__default["default"](`#${compId}`).find('.selectpicker').selectpicker('render');

          $__default["default"](`#${compId}`).find(this.searchForm).trigger('submit', [false]);
          return false;
        } else {
          $__default["default"](`#${compId}`).find(this.searchInput).val('');
        }
      }
      return true;
    }

    /**
     * Initialization function :
     *  intialize the variables and
     *  fetch the data from the server on page load
     */
    initialize() {
      if (!$__default["default"](this.componentWraper).length) {
        return false;
      }
      this.initializeHandler();

      this.geoCountryData = JSON.parse($__default["default"].trim($__default["default"]('.geoCountryHiddenData').eq(0).text()));
      this.geoStateData = JSON.parse($__default["default"].trim($__default["default"]('.geoStateHiddenData').eq(0).text()));

      // looping for multiple instances
      $__default["default"](this.componentWraper).each((index, ele) => {
        const $this = $__default["default"](ele),
          compData = this.getComponentId($this),
          compJsonString = $__default["default"].trim($this.find(".peopleHiddenData").text());

        this.categoryWiseData[compData.categoryToDisplay] = {
          showFeatured: compData.showFeatured,
          categoryToDisplay: compData.categoryToDisplay,
          componentuniqueid: compData.componentId
        };

        if (compJsonString) {
          this.filteringForGeoLocation(JSON.parse(compJsonString), compData).then(() => {
            /* istanbul ignore else */
            if (this.getQueryString(compData.componentId)) {
              this.processData(this.pplData[compData.componentId], compData.categoryToDisplay, compData.showFeatured);
              /* istanbul ignore else */
              if ((index + 1) === $__default["default"](this.componentWraper).length) {
                this.pageLoad = false;
              }
            }
          });
        }
      });
    }

    filteringForGeoLocation(pplData, compData) {
      let dfd = $__default["default"].Deferred();
      let usrStateCountryName = '';
      const disableGeo = $__default["default"](`#${compData.componentId}`).data('disableGeoService');

      function filterPplCards(stateCountryCode, pplGeoPropName) {
        for (let i = 0; i < pplData.length;) {
          if (pplData[i]['isPersonFeatured'] === 'yes') {
            if (!(pplData[i][pplGeoPropName] && pplData[i][pplGeoPropName].includes(stateCountryCode))) {
              pplData.splice(i, 1);
            } else {
              i++;
            }
          } else {
            i++;
          }
        }
      }

      function findLocation(geoStateCountryData, currentRegionCountry, stateCountryCodeProp, stateCountryNameProp) {
        let stateCountryName = '';
        for (let i = 0; i < geoStateCountryData.length; i++) {
          /* istanbul ignore else */
          if (geoStateCountryData[i][stateCountryCodeProp] === currentRegionCountry) {
            stateCountryName = geoStateCountryData[i][stateCountryNameProp];
            break;
          }
        }
        usrStateCountryName = stateCountryName;
        // filterPplCards(stateCountryName);
      }

      /* istanbul ignore else */
      if (disableGeo === 'no') {
        tncUtility__default["default"].checkGeolocation().then((response) => {
          const currentCountry = response.response['pulse-country'].toLowerCase();
          const currentRegion = response.response['pulse-region'].toLowerCase();
          /* istanbul ignore if */
          if (currentCountry === 'usa') {
            findLocation(this.geoStateData, currentRegion, 'stateCode', 'stateName');
            filterPplCards(currentRegion, 'geoLocationStateCode');
          } else {
            findLocation(this.geoCountryData, currentCountry, 'countryCode', 'countryName');
            filterPplCards(currentCountry, 'geoLocationCountryCode');
          }
          $__default["default"](`#${compData.componentId}`).find('.currentUsrLocation').html(usrStateCountryName);
          this.pplData[compData.componentId] = pplData;
          dfd.resolve();
        });
      } else {
        this.pplData[compData.componentId] = pplData;
        dfd.resolve();
      }
      return dfd.promise();
    }

    /**
     * processData function :
     *  responseData: people data
     *  categoryToDisplay: category of the people to display
     *  showFeatured : flag to enable/disable feature people
     */
    processData(responseData, categoryToDisplay, showFeatured) {
      //alphabetical sort
      /* istanbul ignore else */
      if (responseData && responseData.length) {
        this.alphabeticalSort(responseData);
      }
      // filter data
      this.filterData(responseData, showFeatured, categoryToDisplay);
      // render Data
      this.render(categoryToDisplay);
    }

    sortByRank(categoryToDisplay, featureSection) {
      let bioRankSorted = this.categoryWiseData[categoryToDisplay][featureSection];
      /* istanbul ignore else */
      if (bioRankSorted) {
        bioRankSorted.sort((a, b) => {
          if (parseInt(a.bioRank, 10) < parseInt(b.bioRank, 10)) {
            return -1;
          }
          /* istanbul ignore else */
          if (parseInt(a.bioRank, 10) > parseInt(b.bioRank, 10)) {
            return 1;
          }
          return 0;
        });

        this.categoryWiseData[categoryToDisplay][featureSection] = bioRankSorted;
      }
    }
    /**
     * alphabeticalSort function :
     *  response: data to sort
     */
    alphabeticalSort(response, propertyName = 'bioLastName') {
      /* istanbul ignore if */
      if (!propertyName) {
        propertyName = 'bioLastName';
      }
      return response.sort((a, b) => {
        /* istanbul ignore if */
        if (!a[propertyName] || !b[propertyName]) {
          propertyName = 'title';
        }
        if (a[propertyName].toLowerCase() < b[propertyName].toLowerCase()) {
          return -1;
        }
        /* istanbul ignore else */
        if (a[propertyName].toLowerCase() > b[propertyName].toLowerCase()) {
          return 1;
        }
        /* istanbul ignore next */
        return 0;
      });
    }

    /**
     * filterData function :
     *  responseData: data to filter
     *  showFeatured : showFeatured flag
     *  categoryToDisplay : category To Display
     */
    filterData(responseData, showFeatured, categoryToDisplay) {
      let featureData = [],
        nonFeatureData = [];
      /* istanbul ignore else */
      if (responseData && responseData.length) {
        /* istanbul ignore if */
        if (categoryToDisplay === this.allCategory) {
          this.categoryWiseData[categoryToDisplay]['nonFeatureData'] = responseData;
        }
        else {
          /* istanbul ignore else */
          if (showFeatured === 'yes') {
            responseData.filter((person) => {
              if (person.isPersonFeatured === 'yes') {
                if (!person.bioRank) {
                  person.bioRank = 100;  // adding default rank if there is no rank in json
                }
                featureData.push(person);
              } else {
                nonFeatureData.push(person);
              }
            });

            this.categoryWiseData[categoryToDisplay]['featureData'] = featureData;
            this.categoryWiseData[categoryToDisplay]['nonFeatureData'] = nonFeatureData;
          }
          else {
            this.categoryWiseData[categoryToDisplay]['nonFeatureData'] = responseData;
          }
        }
      } else {
        this.categoryWiseData[categoryToDisplay]['featureData'] = [];
        this.categoryWiseData[categoryToDisplay]['nonFeatureData'] = [];
      }
      if (this.pageLoad) {
        this.sortByRank(categoryToDisplay, 'featureData');
      }
    }

    /**
     * handlebarTemplate function :
     *    returns the handlebar template for the people card
     *  people: context json for the handlebar template
     */
    handlebarTemplate(people) {
      return `{{#each ${people}}}
              <div class="bs_col-6 bs_col-md-3 c-cards-people__card c-cards-link">
                <a class="c-ppl-card-anchor tertiary-link-v1 txt-clr-g1" target="{{this.target}}" href="{{this.link}}">
                  <div class="c-cards-people__card-container">
                    <picture>
                      <source srcset="{{this.bioHeadshot.large}} 1x, {{this.bioHeadshot.large2x}} 2x" media="(min-width: 1280px)">
                      <source srcset="{{this.bioHeadshot.medium}} 1x, {{this.bioHeadshot.medium2x}} 2x" media="(min-width: 768px)">
                      <source srcset="{{this.bioHeadshot.small}} 1x, {{this.bioHeadshot.small2x}} 2x" media="(min-width: 0)">
                      <img class="c-cards-people__image image-position-desktop__{{this.desktopImageCrop}} image-position-mobile__{{this.mobileImageCrop}}" src="{{this.bioHeadshot.default}}" alt="{{this.headshotAltText}}"/>
                    </picture>

                    <div class="c-cards-people__content">
                      <h2 class="c-cards-people__name family-serif fw-v2 fz-v9 lh-v11 fz-v11-md lh-v14-md">
                        {{ this.title }}
                      </h2>

                      <p class="family-sans fw-v2 fz-v6 lh-v6 fz-v7-md lh-v8-md c-cards-people__title txt-clr-g1">
                        {{ this.jobTitle }}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            {{/each}}`;
    }

    /**
     * render function :
     *    renders the people card in the DOM based on
     *  categoryToDisplay: category To Display
     */
    render(categoryToDisplay, categoryData = this.categoryWiseData[categoryToDisplay]) {
      const componentId = categoryData['componentuniqueid'],
        $wrapperEle = $__default["default"](`#${componentId}`),
        $featurePeopleContainer = $wrapperEle.find(this.featureResultContainer),
        $nonFeaturePeopleContainer = $wrapperEle.find(this.nonFeatureResultContainer),
        $noPeopleContainer = $wrapperEle.find(this.noResultContainer);

      // hide show more btn
      $nonFeaturePeopleContainer.find(this.showMore).addClass('hide');

      if (categoryData.featureData && categoryData.featureData.length) {
        const template = Handlebars.compile(this.handlebarTemplate('featureData')),
          featureHtml = template(categoryData);

        $featurePeopleContainer
          .find('.c-cards-people')
          .html(featureHtml)
          .end()
          .removeClass('hide');
      } else {
        $featurePeopleContainer.addClass('hide');
      }

      if (categoryData.nonFeatureData.length) {
        let template2 = Handlebars.compile(this.handlebarTemplate('nonFeatureData')),
          nonFeatureHtml = template2(categoryData);

        $nonFeaturePeopleContainer
          .find('.c-cards-people')
          .html(nonFeatureHtml)
          .end()
          .removeClass('hide');

        let childCards = $nonFeaturePeopleContainer.find('.c-cards-people').children();
        childCards.slice(this.loadMoreItems).addClass('hide');

        // load more
        /* istanbul ignore next */
        if (categoryData.nonFeatureData.length > this.loadMoreItems) {
          $nonFeaturePeopleContainer.find(this.showMore).removeClass('hide');
        }
      } else {
        $nonFeaturePeopleContainer.addClass('hide');
      }
      // hide no result container
      $noPeopleContainer.addClass('hide');
      if (typeof categoryData.featureData === 'undefined' && !categoryData.nonFeatureData.length) {
        $noPeopleContainer.removeClass('hide');
      }
    }

    /**
     * initializeHandler function :
     *    initialize the event handler for the component
     */
    initializeHandler() {
      /* istanbul ignore next */
      window.addEventListener('popstate', () => {
        const compId = tncUtility__default["default"].getParameterByName("people_compId");
        if (!compId) {
          let $visiblePplComponent = $__default["default"](this.componentWraper).filter(':visible'),
            visiblePplComponentId = $visiblePplComponent.attr('id'),
            categoryToDisplay = $visiblePplComponent.data('categoryToDisplay'),
            showFeatured = $visiblePplComponent.data('showFeatured');

          this.pageLoad = true;
          $__default["default"](`#${visiblePplComponentId}`).find('select.pplSortBy').val('');
          $__default["default"](`#${visiblePplComponentId}`).find('.selectpicker').selectpicker('render');

          this.processData(this.pplData[visiblePplComponentId], categoryToDisplay, showFeatured);
          $visiblePplComponent.find('.result-container-nonfeature').find(this.singleResultHeader).addClass('hideContent');
          $visiblePplComponent.find('.result-container-nonfeature').find(this.multiResultHeader).addClass('hideContent');
          $visiblePplComponent.find('.result-container-nonfeature').find(this.nonFeatureHeader).removeClass('hideContent');
          this.pageLoad = false;
        } else {
          if (this.getQueryString()) {
            let categoryToDisplay = $__default["default"](this.componentWraper).eq(0).data('categoryToDisplay'),
              showFeatured = $__default["default"](this.componentWraper).eq(0).data('showFeatured'),
              cmpid = $__default["default"](this.componentWraper).eq(0).attr('id');
            $__default["default"](`#${cmpid}`).find(this.searchInput).val('');
            this.processData(this.pplData[cmpid], categoryToDisplay, showFeatured);
            $__default["default"](`#${cmpid}`).find('.result-container-nonfeature').find(this.singleResultHeader).addClass('hideContent');
            $__default["default"](`#${cmpid}`).find('.result-container-nonfeature').find(this.multiResultHeader).addClass('hideContent');
            $__default["default"](`#${cmpid}`).find('.result-container-nonfeature').find(this.nonFeatureHeader).removeClass('hideContent');
          }
        }
      });

      // search icon click event
      $__default["default"](this.searchIcon).on('click', (event) => {
        event.preventDefault();
        $__default["default"](event.currentTarget).closest(this.searchForm).trigger('submit');
      });

      // clear search
      $__default["default"](this.clearSearchIcon).on('click', (event) => {
        event.preventDefault();
        $__default["default"](this.searchInput).val('');

        // update the query string and history
        let $wrapperEle = $__default["default"](event.target).closest(this.componentWraper),
          compId = $wrapperEle.data('componentuniqueid'),
          url = tncUtility__default["default"].updateQueryString("people_q", '');

        $__default["default"](`#${compId}`).find('select.pplSortBy').val('');
        $__default["default"](`#${compId}`).find('.selectpicker').selectpicker('render');
        url = tncUtility__default["default"].updateQueryString("people_sort", '', url);

        url = tncUtility__default["default"].updateQueryString("people_compId", compId, url);

        tncUtility__default["default"].updateURL(url);

        // hide toggle clear and search icon
        $__default["default"](event.target).addClass('hideContent');
        $wrapperEle.find(this.searchIcon).removeClass('hideContent');

        let componentData = this.getComponentId($__default["default"](event.target)),
          searchedData = Object.assign({}, this.categoryWiseData[componentData.categoryToDisplay]);

        $wrapperEle.find(`${this.singleResultHeader}, ${this.multiResultHeader}`).addClass('hideContent');
        $wrapperEle.find(this.nonFeatureHeader).removeClass('hideContent');

        if (!searchedData.featureData || !searchedData.nonFeatureData) {
          this.processData(this.pplData[componentData.componentId], componentData.categoryToDisplay, componentData.showFeatured);
        } else {
          this.render(componentData.categoryToDisplay, searchedData);
        }
        $wrapperEle.find('.ppl-agg-sort-btn').removeClass('border-secondary');
      });

      // search input event
      $__default["default"](this.searchInput).on('input', (event) => {
        let $wrapperEle = $__default["default"](event.target).closest(this.componentWraper);
        // toggel the clear and search icons
        $wrapperEle.find(this.clearSearchIcon).addClass('hideContent');
        $wrapperEle.find(this.searchIcon).removeClass('hideContent');
      });

      // search form submit
      $__default["default"](this.searchForm).on('submit', (event, historyFlag = true) => {
        event.preventDefault();
        let $wrapperEle = $__default["default"](event.target).closest(this.componentWraper);

        // toggel the clear and search icons
        $wrapperEle.find(this.clearSearchIcon).removeClass('hideContent');
        $wrapperEle.find(this.searchIcon).addClass('hideContent');

        const $this = $__default["default"](event.target).find(this.searchInput),
          compData = this.getComponentId($this),
          keyWord = $this.val(),
          reg = `(.*)(${keyWord})(.*)`,
          regexp = new RegExp(reg, 'i');

        let searchedData = {};
        if (historyFlag) {
          let url = tncUtility__default["default"].updateQueryString("people_q", $__default["default"].trim(keyWord));
          if (!$__default["default"].trim(keyWord)) {
            url = tncUtility__default["default"].updateQueryString("people_sort", '', url);
          }
          url = tncUtility__default["default"].updateQueryString("people_compId", compData.componentId, url);

          tncUtility__default["default"].updateURL(url);
        }

        // filter feature people and non featured people
        if (!$__default["default"].trim(keyWord)) {
          // render all result -- default state
          searchedData = Object.assign({}, this.categoryWiseData[compData.categoryToDisplay]);
          let totalResults = 0;
          if (!searchedData.featureData || !searchedData.nonFeatureData) {
            $__default["default"](`#${compData.componentId}`).find('select.pplSortBy').val('');
            $__default["default"](`#${compData.componentId}`).find('.selectpicker').selectpicker('render');
            this.processData(this.pplData[compData.componentId], compData.categoryToDisplay, compData.showFeatured);
            totalResults = this.pplData[compData.componentId].length;
          } else {
            $__default["default"](`#${compData.componentId}`).find('select.pplSortBy').val('');
            $__default["default"](`#${compData.componentId}`).find('.selectpicker').selectpicker('render');
            this.alphabeticalSort(searchedData['featureData']);
            this.alphabeticalSort(searchedData['nonFeatureData']);

            this.sortByRank(compData.categoryToDisplay, 'featureData');

            this.render(compData.categoryToDisplay, searchedData);
            totalResults = searchedData.featureData.length + searchedData.nonFeatureData.length;
          }

          $__default["default"](`#${compData.componentId}`)
            .find(`${this.singleResultHeader}, ${this.multiResultHeader}`)
            .addClass('hideContent')
            .end()
            .find(this.nonFeatureHeader)
            .removeClass('hideContent');

          this.setAnalytics(keyWord, totalResults);
          $__default["default"](`#${compData.componentId}`).find('.ppl-agg-sort-btn').removeClass('border-secondary');
        } else {
          searchedData.nonFeatureData = Array.from(this.pplData[compData.componentId]);
          searchedData.componentuniqueid = compData.componentId;

          searchedData.nonFeatureData =
            searchedData.nonFeatureData.filter((person) => (regexp.test(person.title)
              || regexp.test(person.jobTitle)
              || regexp.test(person.jobLocation)
              || regexp.test(person.peopleTag)
              || regexp.test(person.geoLocationTag)
              || regexp.test(person.expertiseTag)
            ));

          let totalResults = searchedData.nonFeatureData.length;

          // update the result count
          let $wrapperEle = $__default["default"](`#${compData.componentId}`);
          $wrapperEle.find(this.nonFeatureHeader).addClass('hideContent');
          if (totalResults > 1) {
            $wrapperEle
              .find(this.multiResultHeader)
              .find('.result-count')
              .html(totalResults)
              .end()
              .removeClass('hideContent');

            $wrapperEle.find(this.singleResultHeader).addClass('hideContent');
          } else {
            $wrapperEle
              .find(this.singleResultHeader)
              .find('.result-count')
              .html(totalResults)
              .end()
              .removeClass('hideContent');

            $wrapperEle.find(this.multiResultHeader).addClass('hideContent');
          }

          this.setAnalytics(keyWord, totalResults);

          this.categoryWiseData[compData.categoryToDisplay]['searchedData'] = searchedData;

          let selectedSort = $__default["default"](`#${compData.componentId}`).find('select.pplSortBy').val();

          this.alphabeticalSort(searchedData['nonFeatureData'], selectedSort);
          // render filter result
          this.render(compData.categoryToDisplay, searchedData);
        }
      });

      // load More event
      $__default["default"]('.morePeople').on('click', (event) => {
        event.preventDefault();
        const $this = $__default["default"](event.target),
          $wrapperEle = $__default["default"](event.target).closest(this.componentWraper),
          $moreItems = $wrapperEle.find(this.nonFeatureResultContainer)
            .find('.c-cards-people')
            .children('.c-cards-people__card.hide');

        if ($moreItems.length && $moreItems.length >= this.loadMoreItems) {
          $moreItems.slice(0, this.loadMoreItems).removeClass('hide');
          if ($moreItems.length === this.loadMoreItems) {
            $this.parent(this.showMore).addClass('hide');
          }
        } else {
          $moreItems.removeClass('hide');
          $this.parent(this.showMore).addClass('hide');
        }
      });

      // no result clear btn
      $__default["default"](".noResultBtn").on('click', (event) => {
        event.preventDefault();
        const $wrapperEle = $__default["default"](event.target).closest(this.componentWraper);
        $wrapperEle.find(this.clearSearchIcon).trigger('click');
      });

      // sort dropdown change event
      $__default["default"]('select.pplSortBy').on('change', (event, historyFlag = true) => {
        let categoryToDisplay = $__default["default"](event.target).data('categoryToDisplay');
        let uniqueId = $__default["default"](event.target).data('componentuniqueid');
        let searchTerm = $__default["default"](`#${uniqueId}`).find(this.searchInput).val();
        let selectedSort = $__default["default"](event.target).val();
        let sortedData = {
          "componentuniqueid": uniqueId
        };
        /* istanbul ignore next */
        if (historyFlag) {
          let url = tncUtility__default["default"].updateQueryString("people_sort", selectedSort);

          url = tncUtility__default["default"].updateQueryString("people_compId", uniqueId, url);

          tncUtility__default["default"].updateURL(url);
        }

        if (!$__default["default"].trim(searchTerm)) {
          sortedData['nonFeatureData'] = Array.from(this.pplData[uniqueId]);
        } else {
          sortedData['nonFeatureData'] = this.categoryWiseData[categoryToDisplay]['searchedData']['nonFeatureData'];
        }
        this.alphabeticalSort(sortedData['nonFeatureData'], selectedSort);
        this.render(categoryToDisplay, sortedData);

        // update the result count
        let $wrapperEle = $__default["default"](`#${uniqueId}`);
        $wrapperEle.find(this.nonFeatureHeader).addClass('hideContent');
        if ($__default["default"].trim(searchTerm)) {
          let totalResults = sortedData.nonFeatureData.length;
          if (totalResults > 1) {
            $wrapperEle
              .find(this.multiResultHeader)
              .find('.result-count')
              .html(totalResults)
              .end()
              .removeClass('hideContent');

            $wrapperEle.find(this.singleResultHeader).addClass('hideContent');
          } else {
            $wrapperEle
              .find(this.singleResultHeader)
              .find('.result-count')
              .html(totalResults)
              .end()
              .removeClass('hideContent');

            $wrapperEle.find(this.multiResultHeader).addClass('hideContent');
          }
        }

        $wrapperEle.find('.ppl-agg-sort-btn').removeClass('border-secondary');
        $wrapperEle.find(`.ppl-agg-sort-btn[data-value='${selectedSort}']`).addClass('border-secondary');
      });

      // mobile filter icon click
      $__default["default"](this.componentWraper).on('click', '.filter-icon-mobile', (event) => {
        event.preventDefault();
        let $this = $__default["default"](event.target);
        let componentuniqueid = $this.data('componentuniqueid');
        $__default["default"](`#${componentuniqueid}`).find('.c-ppl-agg-filter-popup').show();
        $__default["default"]('body').addClass('bodyOverflowHidden');
      });

      // mobile filter popup close icon click
      $__default["default"](this.componentWraper).on('click', '.popup-close', (event) => {
        event.preventDefault();
        let $this = $__default["default"](event.target);
        let componentuniqueid = $this.data('componentuniqueid');
        $__default["default"](`#${componentuniqueid}`).find('.c-ppl-agg-filter-popup').hide();
        $__default["default"]('body').removeClass('bodyOverflowHidden');
      });

      // sort btns click
      $__default["default"](this.componentWraper).on('click', '.ppl-agg-sort-btn', (event) => {
        event.preventDefault();
        let $this = $__default["default"](event.target);
        let componentuniqueid = $this.data('componentuniqueid');
        let sortOption = $this.data('value');
        $__default["default"](`#${componentuniqueid}`).find('.ppl-agg-sort-btn').removeClass('border-secondary');
        $this.addClass('border-secondary');
        $__default["default"](`#${componentuniqueid}`).find('.popup-close').trigger('click');
        $__default["default"](`#${componentuniqueid}`).find('.selectpicker').selectpicker('val', sortOption);
      });
    }

    /**
     * Analytics Function
     */

    setAnalytics(key, results) {
      let aggregationTags = {
        'event_name': 'asset_search',
        'event_action': (key) ? key : 'undefined',
        'event_category': results,
        'search_term': (key) ? key : 'undefined',
        'search_type': 'people',
        'num_search_results': results
      };

      tncUtility__default["default"].setAnalyticsByPage(aggregationTags, true);
    }
  }

  var peopleAggregation_component = new PeopleAggregation();

  return peopleAggregation_component;

})($, TNC.Utility);
//# sourceMappingURL=people-aggregation.component.js.map

this.TNC = this.TNC || {};
this.TNC.LocationMenuNavigation = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Location Menu Navigation component JS goes here
    /** Location Menu Navigation Class. */
    class LocationMenuNavigation {
        /**
         * LocationMenuNavigation constructor
         */
        constructor() {
            this.initialize();
        }



        /**
         * * Initialization function
         * */
        initialize() {

            // $(window).on('scroll', () => {
            //
            //     $('.c-location-menu').each((index, element) => {
            //         let currEle = $(element);
            //         let sticky = currEle.offset().top,
            //             headerHeight = currEle.find('.c-location-menu__header').outerHeight(),
            //             contentHeight = currEle.find('.c-location-menu__locations').outerHeight();
            //
            //         let scroll = $(window).scrollTop();
            //         let expandText = currEle.find('.c-location-menu__link').attr('data-expand-text');
            //
            //         if (scroll >= sticky) {
            //             currEle.find('.c-location-menu__header').addClass('fixed border-primary standard-width-inner');
            //             currEle.css({ 'padding-top': parseInt(headerHeight) });
            //
            //             /* istanbul ignore if */
            //             if ((currEle.offset().top + currEle.outerHeight()) - headerHeight <= scroll) {
            //                 if (currEle.find('.c-location-menu__link').hasClass('active')) {
            //                     currEle.css('margin-bottom', parseInt(contentHeight) + 'px');
            //                 } else {
            //                     currEle.css({ 'margin-bottom': 0 });
            //                 }
            //                 currEle.find('.c-location-menu__locations').hide();
            //                 currEle.find('.c-location-menu__link').removeClass('active').attr('title', expandText);
            //             }
            //         } else {
            //             currEle.find('.c-location-menu__header').removeClass('fixed border-primary standard-width-inner');
            //             currEle.css({ 'padding-top': 0, 'margin-bottom': 0 });
            //
            //
            //         }
            //     });
            // });

            $__default["default"]('.toggleAccordion').on('click', (e) => {
                e.preventDefault();
                this.toggleHandler(e);
            });
        }

        /**
         * * ToggleHandler function
         * Toggles the accordion items
         * */
        toggleHandler(e) {
            if ($__default["default"](e.target).parents('.c-location-menu__header').hasClass("fixed")) {
                // $("html, body").animate({ scrollTop: $(e.target).parents('.c-location-menu').offset().top }, 500);
                $__default["default"](window).scrollTop($__default["default"](e.target).parents('.c-location-menu').offset().top);
            }
            let contentId = $__default["default"](e.target).data('toggleContent');
            let toggleContent = $__default["default"](`#${contentId}`);
            let expandText = $__default["default"](e.target).attr('data-expand-text');
            let collapseText = $__default["default"](e.target).attr('data-collapse-text');
            if ($__default["default"](e.target).hasClass("active")) {
                toggleContent.slideUp({ duration: 700, easing: "easeInOutQuart" });
                $__default["default"](e.target).attr('title', expandText);
            }
            else {
                toggleContent.slideDown({ duration: 700, easing: "easeInOutQuart" });
                $__default["default"](e.target).attr('title', collapseText);
            }
            $__default["default"](e.target).toggleClass("active");
        }


    }

    var locationMenuNavigation_component = new LocationMenuNavigation();

    return locationMenuNavigation_component;

})($);
//# sourceMappingURL=location-menu-navigation.component.js.map

this.TNC = this.TNC || {};
this.TNC.VisualDownload = (function () {
    'use strict';

    // Visual Download component JS goes here
    // import $ from 'jquery';
    /** Visual Download Class. */
    class VisualDownload {
        /**
         * VisualDownload constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var visualDownload_component = new VisualDownload();

    return visualDownload_component;

})();
//# sourceMappingURL=visual-download.component.js.map

this.TNC = this.TNC || {};
this.TNC.BiographyOverview = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    class BiographyOverview {
        constructor() {
            this.initialize();
        }

        initialize() {
            // Hide the caption and credit text, if present.
            $__default["default"](".c-biography-overview__image-caption-credit").addClass(
                "c-biography-overview__image-caption-credit--hidden");

            // Set handler to toggle image caption and credit.
            $__default["default"](".c-biography-overview__image-caption-credit-button").on(
                    "click touchend", function () {
                $__default["default"](".c-biography-overview__image-caption-credit").toggleClass(
                    "c-biography-overview__image-caption-credit--hidden");
            });
        }
    }

    var biographyOverview_component = new BiographyOverview();

    return biographyOverview_component;

})($);
//# sourceMappingURL=biography-overview.component.js.map

this.TNC = this.TNC || {};
this.TNC.HeroImage = (function () {
    'use strict';

    // Hero Image component JS goes here
    // import $ from 'jquery';
    /** Hero Image Class. */
    class HeroImage {
        /**
         * HeroImage constructor
         */
        constructor() {
                this.initialize();
            }
            /**
             * Initialization function
             */
        initialize() {
            var playPause = document.getElementById("play-pause");
            var playpause = document.getElementById("vid");
            playPause && playPause.classList.add('pause');
            playPause && playPause.addEventListener("click", function() {
            if (playpause.paused === true) {
                // Play the hero image background video.
                playpause.play();
                playpause.classList.toggle('play');
                playPause.classList.add('pause');
                playPause.classList.remove('play');
            } else {
                // Pause the hero image background video.
                playpause.pause();
                playpause.classList.toggle('pause');
                playPause.classList.add('play');
                playPause.classList.remove('pause');
            }
            });
        }

    }

    var heroImage_component = new HeroImage();

    return heroImage_component;

})();
//# sourceMappingURL=hero-image.component.js.map

this.TNC = this.TNC || {};
this.TNC.Map = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Map component JS goes here
    /** Map Class. */
    class Map {
        /**
         * Map constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            let self = this;
            if ($__default["default"]('.c-map').length > 0) {
                $__default["default"]('.c-map').each(function () {
                    let locationArr = [];
                    let targetEl = $__default["default"](this).find('.map-canvas');
                    let mapType = self.getMapType($__default["default"](this));
                    $__default["default"](this).find('.info-window-wrapper').children().each(function (index, element) {
                        //get info window template
                        if ($__default["default"](element).hasClass('info-window-template')) {
                            var _arr = [$__default["default"](element).data('lat'), $__default["default"](element).data('lag'), $__default["default"](element).html()];
                            locationArr.push(_arr);
                        }
                    });
                    //intialize the map
                    self.callMapInit(targetEl, locationArr, mapType);
                });
            }
        }

        // set map type and call respactive methods
        getMapType($this) {
            if ($this.hasClass('generic')) {
                return 'generic';
            } else if ($this.hasClass('complexGeneric')) {
                return 'generic';
            } else if ($this.hasClass('advanced')) {
                return 'advanced';
            } else if ($this.hasClass('preserve')) {
                return 'preserve';
            } else {
                return false;
            }
        }

        // set map type and call respactive methods
        callMapInit(targetEl, locationArr, mapType) {
            if (mapType === 'generic') {
                this.initMapGeneric(targetEl, locationArr);
            } else if (mapType === 'advanced') {
                this.initMapKmz(targetEl, locationArr);
            } else if (mapType === 'preserve') {
                this.initMapGeneric(targetEl, locationArr);
            } else {
                return false;
            }

        }

        // initialize the map component
        initMapGeneric($target, locationList) {
            let map = new google.maps.Map($target[0], {
                zoom: 0,
                maxZoom: 11,
                streetViewControl: false,
                center: { lat: 38.882628, lng: -77.112312 },
            });

            this.setMarkers(map, locationList);
        }

        //intilize the custom layer map
        initMapKmz($target, locationList) {
            let kmzPath = $__default["default"]($__default["default"](locationList[0][2])).val();
            /* istanbul ignore else */
            if (kmzPath) {
                var map = new google.maps.Map($target[0], {
                    zoom: 0,
                    maxZoom: 11,
                    streetViewControl: false,
                    center: { lat: 38.882628, lng: -77.112312 }
                });
                new google.maps.KmlLayer({
                    url: kmzPath,
                    map: map
                });
            }
        }

        // Adds markers to the map.
        setMarkers(map, locations) {
            let image = {
                url: '/etc.clientlibs/tnc/clientlibs/assets/resources/icons/icon-map-marker.svg',
                // url: 'http://maps.google.com/mapfiles/kml/pal2/icon12.png',
                scaledSize: new google.maps.Size(29, 48),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(15, 40)
            };

            let iwindow = new google.maps.InfoWindow({
                maxWidth: 310,
                pixelOffset: new google.maps.Size(0, -10)
            });

            // instantiate the bounds object
            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < locations.length; i++) {
                (function (marker) {
                    var markers = new google.maps.Marker({
                        animation: google.maps.Animation.DROP,
                        icon: image,
                        map: map,
                        template: marker[2],
                        zIndex: 1,
                        position: { lat: Number(marker[0]), lng: Number(marker[1]) }
                    });


                    let locationLatLng = new google.maps.LatLng(Number(marker[0]), Number(marker[1]));
                    bounds.extend(locationLatLng);

                    google.maps.event.addDomListener(markers, 'click', function () {
                        iwindow.close();
                        iwindow.setContent(markers.template);
                        iwindow.open(map, markers);
                    });

                    google.maps.event.addListener(map, "click", function() {
                      iwindow.close();
                    });

                })(locations[i]);
            }


            map.fitBounds(bounds);       // auto-zoom
            map.panToBounds(bounds);     // auto-center

            let preserveZoomLevel = $__default["default"]("input[name='preservezoom']").val();
            if (preserveZoomLevel) {
                let listener = google.maps.event.addListener(map, "idle", function () {
                    map.setZoom(Number(preserveZoomLevel));
                    google.maps.event.removeListener(listener);
                });
            } else {
                map.getZoom() >= 17 && map.setZoom(11);
            }

        }
    }

    var map_component = new Map();

    return map_component;

})($);
//# sourceMappingURL=map.component.js.map

this.TNC = this.TNC || {};
this.TNC.ArticleHero = (function ($, moment, ReadTime) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);
    var ReadTime__default = /*#__PURE__*/_interopDefaultLegacy(ReadTime);

    class ArticleHero {
        constructor() {
            this.baseElement = $__default["default"](".c-article-hero");

            this.initialize();
        }

        initialize() {
            setTimeout(() => {
                this.rerenderComponent();
            }, 100);
            $__default["default"](window).resize(() => {
                this.rerenderComponent();
            });

            var articlePlayPause = document.getElementById("articleHeroVid-playPause");
            var articlePlaypause = document.getElementById("article-heroVid");
            articlePlayPause && articlePlayPause.classList.add('pause');
            articlePlayPause && articlePlayPause.addEventListener("click", function() {
                if (articlePlaypause.paused === true) {
                    // Play the hero image background video.
                    articlePlaypause.play();
                    articlePlaypause.classList.toggle('play');
                    articlePlayPause.classList.add('pause');
                    articlePlayPause.classList.remove('play');
                } else {
                    // Pause the hero image background video.
                    articlePlaypause.pause();
                    articlePlaypause.classList.toggle('pause');
                    articlePlayPause.classList.add('play');
                    articlePlayPause.classList.remove('pause');
                }
            });
            var unformatedDate = $__default["default"]('.unformated-article-date');
            if (unformatedDate.length > 0) {
                unformatedDate = unformatedDate.val().trim();
                if (unformatedDate !== ''){
                    var formatDate = moment__default["default"].utc(unformatedDate).format(
                        "MMMM DD, YYYY");
                    if ($__default["default"]('.article-hero-article-date')) {
                        $__default["default"]('.article-hero-article-date').html(formatDate);
                    }
                }
            }

            if (this.baseElement.length) {
                ReadTime__default["default"].initialize(this.baseElement);
                ReadTime__default["default"].showReadTime();
            }
        }

        rerenderComponent() {
            const mainContainer = $__default["default"]('.c-article-hero.inline');
            const imageContainer = $__default["default"]('.c-hero-image');
            if (mainContainer.length && imageContainer.length) {
                mainContainer.each((index, element) => {
                    let contentItem = $__default["default"](element).find('.c-article-hero__inner');
                    let imageItem = $__default["default"](element).find('.c-hero-image img');
                    let mainItem = $__default["default"](element);
                    let contentHeight = contentItem.outerHeight();
                    let imageHeight = imageItem.height();
                    if (contentHeight > imageHeight) {
                        mainItem.addClass('large-text-block');
                        mainItem.css('background-image', 'url(' + imageItem.get(0).currentSrc + ')');
                    } else {
                        mainItem.removeClass('large-text-block');
                    }
                });
            }
        }

    }

    var articleHero_component = new ArticleHero();

    return articleHero_component;

})($, moment, TNC.ReadTime);
//# sourceMappingURL=article-hero.component.js.map

this.TNC = this.TNC || {};
this.TNC.AuthorSidebar = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    class AuthorSidebar {
        constructor() {
            this.initialize();
        }

        initialize() {
            this.baseElement = $__default["default"](".c-author__short");

            $__default["default"]('.c-author__more').on('click', e => {
                e.preventDefault();
                let bottomId = $__default["default"](e.currentTarget).attr('href');
                $__default["default"]('html, body').animate({
                    scrollTop: $__default["default"](bottomId).offset().top
                }, 800);
            });

            /* If Anchor Links component is on the page, adjust sidebar position.
                (This is only for Firefox, which as of Feb 2023, does not support
                CSS :has() yet; can remove when support is added.) */
            let anchorLinks = $__default["default"](".c-anchor-links");
            if (anchorLinks.length > 0) {
                if (this.baseElement) {
                    this.baseElement.addClass(
                        "c-author__short--with-anchor-links");
                }
            }
        }
    }

    var authorSidebar_component = new AuthorSidebar();

    return authorSidebar_component;

})($);
//# sourceMappingURL=author-sidebar.component.js.map

this.TNC = this.TNC || {};
this.TNC.AuthorBottom = (function () {
    'use strict';

    // Author Bottom component JS goes here
    // import $ from 'jquery';
    /** Author Bottom Class. */
    class AuthorBottom {
        /**
         * AuthorBottom constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var authorBottom_component = new AuthorBottom();

    return authorBottom_component;

})();
//# sourceMappingURL=author-bottom.component.js.map

this.TNC = this.TNC || {};
this.TNC.HeroCarousel = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Hero Carousel component JS goes here
    /** Hero Carousel Class. */
    class HeroCarousel {
        /**
         * HeroCarousel constructor
         */
        constructor() {
            if ($__default["default"]('.carousel.c-hero-carousel').length !== 0) {
                this.initialize();
            }
        }
        /**
         * Initialization function
         */
        initialize() {
            //FIX - TNC-2184
            // $('.c-hero-carousel').on('select.flickity', function() {
            //     $('.c-hero-carousel').flickity('playPlayer');
            // });
            //TNC-3158 fix
            let carouselLength = $__default["default"]('input[name="carouselLength"]').val();
            let $heroCarousel = $__default["default"]('.carousel.c-hero-carousel');
            $heroCarousel.flickity({
                "draggable": false,
                "wrapAround": true,
                "pauseAutoPlayOnHover": true,
                "pageDots": true,
                "autoPlay": 6000,
                "prevNextButtons": true
            });

            if (carouselLength === "1") {
                $__default["default"]('.carousel.c-hero-carousel').addClass("disableNavIcons");
            }

            //play carousel on click outside the carousel
            $__default["default"]('body').on('click', () => {
                $heroCarousel.flickity('playPlayer');
            });

            $__default["default"]('.default-hero-carousel').find('.c-hero-image.c-hero-carousel').on('click', (event) => {
                // JSUNIT:- else path need to be ignore for jsunit test,
                // because it will reload the page and page reload will break the karma to run
                /* istanbul ignore else */
                if (!$__default["default"](event.target).hasClass('c-cta-carousel')) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });

            $__default["default"]('.triggerModal').on('click', (event) => {
                event.preventDefault();
                //event.stopImmediatePropagation();
                event.stopPropagation();
            });
            $heroCarousel.flickity('resize');

            // Prevent too-large carousel arrows if styles are turned off.
            var buttons = $__default["default"](".flickity-prev-next-button svg");
            buttons.attr("width", "18px");
            buttons.attr("height", "18px");
        }
    }

    var heroCarousel_component = new HeroCarousel();

    return heroCarousel_component;

})($);
//# sourceMappingURL=hero-carousel.component.js.map

this.TNC = this.TNC || {};
this.TNC.ScaComponent = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Sca Component component JS goes here
    /** Sca Component Class. */
    class ScaComponent {
        /**
         * ScaComponent constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            console.log($__default["default"]);
        }
    }

    var sca_component = new ScaComponent();

    return sca_component;

})($);
//# sourceMappingURL=sca.component.js.map

this.TNC = this.TNC || {};
this.TNC.ArticleGallery = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Article Gallery component JS goes here
    /** Article Gallery Class. */
    class ArticleGallery {
        /**
         * Article Gallery constructor
         */
        constructor() {
            if ($__default["default"](".c-article-gallery .carousel").length !== 0) {
                this.initialize();
            }
        }
        /**
         * Initialization function
         */
        initialize() {
            var carousel = $__default["default"](".c-article-gallery .carousel");
            carousel.flickity({
                "arrowShape":
                    { x0: 10,
                      x1: 60, y1: 50,
                      x2: 75, y2: 35,
                      x3: 40
                    },
                "pageDots": false,
                "wrapAround": false
            });
            setTimeout(() => {
                carousel.flickity("resize");
            }, 100);

    		// Prevent too-large carousel arrows if styles are turned off.
    		var buttons = $__default["default"](".flickity-prev-next-button svg");
    		buttons.attr("width", "18px");
    		buttons.attr("height", "18px");

            // Prevent the full frame of the gallery from getting focus.
            carousel.attr("tabindex", "-1");

            // Set up some keyboard handlers.
            carousel.on("keydown", this.galleryKeyPress.bind(this));
        }

        focusOnVisibleLink() {
            // Set focus on the link of the currently visible panel (or "cell").
            var visibleCell = $__default["default"](".c-article-gallery__cell.is-selected");
            var visibleLink = visibleCell.find(".c-article-gallery__caption a");
            visibleLink.focus();
        }

        /**
         * Handle gallery key presses.
         */
        galleryKeyPress(event) {
            var key = event.key;

            if (key === "ArrowRight") {
                var nextButton = $__default["default"](".flickity-prev-next-button.next");
                nextButton.focus();
                nextButton.click();
                this.focusOnVisibleLink();
            }
            else if (key === "ArrowLeft") {
                var previousButton = $__default["default"](".flickity-prev-next-button.previous");
                previousButton.focus();
                previousButton.click();
                this.focusOnVisibleLink();
            }
        }
    }

    var articleGallery_component = new ArticleGallery();

    return articleGallery_component;

})($);
//# sourceMappingURL=article-gallery.component.js.map

this.TNC = this.TNC || {};
this.TNC.HomepageHero = (function ($, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    // Homepage Hero component JS goes here
    // import ScrollReveal from 'scrollreveal';
    /** Homepage Hero Class. */
    class HomepageHero {
        /**
         * HomepageHero constructor
         */
        constructor() {
            this.smallScreenWidth = 640;
            this.initialize();
            this.applyThemingClasses();
        }
        /**
         * Initialization function
         */
        initialize() {
            const $homeHeroItem = $__default["default"](".c-hero-carousel");
            if (!$homeHeroItem.length) {
                return;
            }
            this.getGeolocation();
            const $carouselItem = $__default["default"](".carousel.c-hero-carousel");
            $carouselItem.flickity({ 'wrapAround': true, 'pauseAutoPlayOnHover': true, 'autoPlay': true });
            $carouselItem.find('video').each(function (i, video) {
                video.play();
            });

            $carouselItem.on('settle.flickity', function () {
                $carouselItem.find('video').each(function (i, video) {
                    video.pause();
                });
                $carouselItem.find('.is-selected video').each(function (i, video) {
                    video.play();
                });
            });
            $__default["default"](window).resize(this.applyThemingClasses.bind(this));
            $carouselItem.flickity('resize');

            const videoElement = $__default["default"]('#vid');
            const playPauseButton = $__default["default"]('.homepage-hero-video-controls');

            playPauseButton.on('click', function() {
              playPauseButton.toggleClass('playing');
              if (playPauseButton.hasClass('playing')) {
                videoElement.trigger('play');
              } else {
                videoElement.trigger('pause');
              }
            });

            // Prevent too-large carousel arrows if styles are turned off.
            var buttons = $__default["default"](".flickity-prev-next-button svg");
            buttons.attr("width", "18px");
            buttons.attr("height", "18px");

            // Analytics for hero button click  SYS-4479
            const $homeHeroBtn = $__default["default"](".homehero-btn");
            if ($homeHeroBtn.length) {
              $homeHeroBtn.on('click', function() {
                var heroButtonText = $__default["default"](this).text();
                var heroButtonLink = $__default["default"](this).attr("href");
                var _analytics = {
                  'event_name': 'hp_click',
                  'hpclick_buttontext': $__default["default"].trim(heroButtonText),
                  'hpclick_link': heroButtonLink,
                  'hpclick_component': 'c82 homepage hero'
                };
                utl__default["default"].setAnalyticsByPage(_analytics, true);
              });
            }


        }

        /**
         * getGeolocation: call geo api to get the current user location
         */
        getGeolocation() {

            const disableGeo = $__default["default"]('.cd-main-header').data(
                'disableGeoService') === 'yes';

            if (!disableGeo) {
              $__default["default"]("._geo").attr('geolocdata', 'yes');

                utl__default["default"].checkGeolocation().then((response) => {
                    const geoLocationData = $__default["default"]('.cd-main-header').find(
                        '.geolocationdatastr').data('geolocationdatastr');
                    if (geoLocationData) {
                        this.renderGeoLocationNav(response, geoLocationData);
                    }
                });
            }
        }

        /**
         * renderGeoLocationNav: renders geolocation navigation link
         */
        renderGeoLocationNav(response, geoServiceData) {
            const currentCountry = response.response['pulse-country'].toLowerCase(),
                currentRegion = response.response['pulse-region'].toLowerCase(),
                geoWorkLabel = $__default["default"]("._geo").data('geoWorkLabel'),
                geoExploreLabel = $__default["default"]("._geo").data('geoExploreLabel'),
                geoExploreLink = $__default["default"]("._geo").data('geoExploreLink');
            $__default["default"].each(geoServiceData, (index, item) => {
                if (currentCountry === "usa" || currentCountry === "can") {
                    if (item.geoLocationStateCode && item.geoLocationStateCode.indexOf(
                        currentRegion) > -1) {

                        $__default["default"]('.geo-loc-btn').attr('href', `${item.geoNavLink}`);
                        $__default["default"]('.geo-loc-btn').attr('target', `${item.geoNavTarget}`);
                        $__default["default"]('.geo-loc-btn span').text(geoWorkLabel + ` ${item.geoNavTitle}`);

                        return false;
                    }
                }
                else {
                    if (item.geoLocationCountryCode && item.geoLocationCountryCode.indexOf(
                        currentCountry) > -1) {

                        $__default["default"]('.geo-loc-btn').attr('href', `${item.geoNavLink}`);
                        $__default["default"]('.geo-loc-btn').attr('target', `${item.geoNavTarget}`);
                        $__default["default"]('.geo-loc-btn span').text(geoWorkLabel + ` ${item.geoNavTitle}`);

                        return false;
                    } else {

                      $__default["default"]('.geo-loc-btn').attr('href', geoExploreLink);
                      $__default["default"]('.geo-loc-btn').attr('target', '_self');
                      $__default["default"]('.geo-loc-btn span').text(geoExploreLabel);

                      return false;
                    }
                }
            });
        }

        applyThemingClasses() {
            const smallScreen = $__default["default"](window).width() < this.smallScreenWidth;
            if (smallScreen) {
                $__default["default"]('.c-hero-carousel__title').removeClass('txt-clr-alt').addClass('txt-clr-g1');
                $__default["default"]('.c-hero-carousel__sub-title').removeClass('txt-clr-alt').addClass('txt-clr-g2');
            } else {
                $__default["default"]('.c-hero-carousel__title').removeClass('txt-clr-g1').addClass('txt-clr-alt');
                $__default["default"]('.c-hero-carousel__sub-title').removeClass('txt-clr-g2').addClass('txt-clr-alt');
            }
        }

    }

    var homepageHero_component = new HomepageHero();

    return homepageHero_component;

})($, TNC.Utility);
//# sourceMappingURL=homepage-hero.component.js.map

this.TNC = this.TNC || {};
this.TNC.AlertBanner = (function ($, browserStorageModule) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var browserStorageModule__default = /*#__PURE__*/_interopDefaultLegacy(browserStorageModule);

    // Alert Banner component JS goes here
    /** Alert Banner Class. */
    class AlertBanner {
        /**
         * AlertBanner constructor
         */
        constructor() {
          if (!window.localeInterstitialShown) {
            this.initialize();
          } else {
            $__default["default"](document).on('hide-localeInterstitial', () => {
              this.initialize();
            });
          }
        }
        /**
         * Initialization function
         */

        initialize() {
            let componentuniqueid = $__default["default"]('.c-alert-banner').data('componentuniqueid');
            let startDateTime = new Date($__default["default"](`#${componentuniqueid}`).data('start-date-time')).getTime();
            let endDateTime = new Date($__default["default"](`#${componentuniqueid}`).data('end-date-time')).getTime();
            let currentDateTime = new Date().getTime();
            let closeBtn = $__default["default"]('.c-button-close');
            let alertBannerId = 'hideAlert-' + componentuniqueid;
            let dateDifference = new Date(endDateTime - startDateTime);
            let diffday = Math.round(dateDifference / (1000 * 60 * 60));
            let sameDay = diffday < 24 ? true : false;

            closeBtn.on('click', this.hideAlertBanner.bind(this, alertBannerId));

            closeBtn.on("keypress", function(event, alertBannerId) {
                var key = event.key;
                if (key === "Enter") {
                    this.hideAlertBanner.bind(this, alertBannerId);
                }
            });

            $__default["default"](document).on('show-localeInterstitial', () => {
              $__default["default"](`#${componentuniqueid}`).hide();
            });

            if (!window.localeInterstitialShown) {
              if (currentDateTime > startDateTime && currentDateTime < endDateTime && /* istanbul ignore next */($__default["default"]('.edit-mode-alert-banner').length !== 0 || browserStorageModule__default["default"].getSession(alertBannerId) && browserStorageModule__default["default"].getSession(alertBannerId) !== 'closed')) {
                  $__default["default"](`#${componentuniqueid}`).show();
              } else if (sameDay && currentDateTime < endDateTime) {
                  $__default["default"](`#${componentuniqueid}`).show();
              } else {
                  $__default["default"](`#${componentuniqueid}`).hide();
              }
            }

            window.log(browserStorageModule__default["default"].getSession('Alertbanner'));
        }

        hideAlertBanner(alertBannerId) {
            $__default["default"](".c-alert-banner").css("display", "none");
            browserStorageModule__default["default"].setSession(alertBannerId, 'closed');
        }
    }

    var alertBanner_component = new AlertBanner();

    return alertBanner_component;

})($, TNC.BrowserStorage);
//# sourceMappingURL=alert-banner.component.js.map

this.TNC = this.TNC || {};
this.TNC.VisualGridListing = (function () {
    'use strict';

    // Visual Grid Listing component JS goes here
    // import $ from 'jquery';
    /** Visual Grid Listing Class. */
    class VisualGridListing {
        /**
         * VisualListing constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {

        }
    }

    var visualGridListing_component = new VisualGridListing();

    return visualGridListing_component;

})();
//# sourceMappingURL=visual-grid-listing.component.js.map

this.TNC = this.TNC || {};
this.TNC.CookieBanner = (function ($, browserStorageModule) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var browserStorageModule__default = /*#__PURE__*/_interopDefaultLegacy(browserStorageModule);

    // Cookie Banner component JS goes here
    /** Cookie Banner Class. */
    class CookieBanner {
        /**
         * AlertBanner constructor
         */
        constructor() {
          if ($__default["default"]('#cookie-banner')) {
            this.initialize();
          }
        }
        /**
         * Initialization function
         */
        initialize() {
          //check if privacy cookie is present
          var privacyCookie = browserStorageModule__default["default"].getCookie('_pca');
          if (privacyCookie) {
            return;
          } else {
            // show banner if cookie isn't present
            setTimeout(function(){$__default["default"]('#cookie-banner').removeClass('cb_init-no-show');}, 3500);
          }
          //set cookie so banner doesn't reappear
          $__default["default"]('.cookie-accept-button, .cookie-notice').on('click', function() {
            $__default["default"]('#cookie-banner').addClass('cb_init-no-show');
            browserStorageModule__default["default"].setCookie('_pca', '_pca', 9999);
          });
        }
    }

    var cookieBanner_component = new CookieBanner();

    return cookieBanner_component;

})($, TNC.BrowserStorage);
//# sourceMappingURL=cookie-banner.component.js.map

this.TNC = this.TNC || {};
this.TNC.HeaderMegamenu = (function () {
    'use strict';

    // Header Megamenu component JS goes here
    // import $ from 'jquery';
    /** Header Megamenu Class. */
    class HeaderMegamenu {
        /**
         * HeaderMegamenu constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var headerMegamenu_component = new HeaderMegamenu();

    return headerMegamenu_component;

})();
//# sourceMappingURL=header-megamenu.component.js.map

this.TNC = this.TNC || {};
this.TNC.Header = (function ($, browserStorageModule, xhrModule, tncUtility) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var browserStorageModule__default = /*#__PURE__*/_interopDefaultLegacy(browserStorageModule);
    var xhrModule__default = /*#__PURE__*/_interopDefaultLegacy(xhrModule);
    var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

    // Header component JS goes here

    /** Header Class. */
    class Header {
        /**
         * Header constructor
         */
        constructor() {
            this.suggestionQueue = null;
            this.locationFlag = true;
            this.searchByDomain = $__default["default"]('.searchBoxHeader').data('searchByDomain');
            this.windowPosition = $__default["default"](window).scrollTop();
            $__default["default"]('.cd-primary-nav').removeClass('hide');
            this.initialize();
        }

        /**
         * Initialization function
         */
        initialize() {
            this.readBtnsCookies();
            this.registerEventHandler();
            this.registerEventHandlerMobile();
            this.getGeolocation();
            this.getBrowserLocale();
            if ($__default["default"]('.cd-main-header').attr('data-sticky-header') === 'sticky-header') {
              if (!$__default["default"]('body').hasClass('transparentHeader-true')) {
                $__default["default"]('.header.section').outerHeight($__default["default"]('.cd-main-header').outerHeight());
              }
              // handle hero img getting cut off on mobile
              if ($__default["default"](window).width() < 1024) {
                if ($__default["default"]('.cd-main-header').hasClass('sticky-language')) {
                  $__default["default"]('.header.section').outerHeight($__default["default"]('.cd-main-header').outerHeight() + 33);
                } else {
                  $__default["default"]('.header.section').outerHeight($__default["default"]('.cd-main-header').outerHeight());
                }
              }
              // adjust search bar position if header is sticky and alert banner is present on init
              if($__default["default"]('.alert-banner').length && window.pageYOffset === 0) {
                $__default["default"]('.cd-search').addClass('sticky-banner-offset');
              }
              $__default["default"]('.cd-main-header').addClass('sticky-header');
              this.stickyHeaderEventHandler();
            }
        }

        is_touch_device() {
            return (('ontouchstart' in window)
                || (navigator.maxTouchPoints > 0));
        }

        /**
         * getGeolocation: call geo api to get the current user location
         */
        getGeolocation() {
            if (!$__default["default"]('.cd-main-header').length) {
                return false;
            }

            const disableGeo = $__default["default"]('.cd-main-header').data(
                'disableGeoService') === 'yes';

            if (!disableGeo) {
                tncUtility__default["default"].checkGeolocation().then((response) => {
                    this.personalizeMembershipBtns(response);

                    const geoLocationData = $__default["default"]('.cd-main-header').find(
                        '.geolocationdatastr').data('geolocationdatastr');
                    if (geoLocationData) {
                        this.renderGeoLocationNav(response, geoLocationData);
                    }
                });
            }
        }


        stickyHeaderEventHandler() {
          $__default["default"](window).scroll(function() {
            // adjust search bar position if header is sticky and alert banner is present
            if($__default["default"]('.alert-banner').length && window.pageYOffset === 0) {
              $__default["default"]('.cd-search').addClass('sticky-banner-offset');
            }
            if(window.pageYOffset > $__default["default"]('.cd-main-header').outerHeight()) {
              $__default["default"]('.cd-search').removeClass('sticky-banner-offset');
              var scroll = $__default["default"](window).scrollTop();
              if(scroll > this.windowPosition) {
                $__default["default"]('.cd-main-header').removeClass('_sticky-up');
                $__default["default"]('.cd-main-header').addClass('_sticky-down');
              } else {
                $__default["default"]('.cd-main-header').removeClass('_sticky-down');
                $__default["default"]('.cd-main-header').addClass('_sticky-up');
              }
            } else {
              $__default["default"]('.cd-main-header').removeClass('_sticky-down, _sticky-up');
            }
            this.windowPosition = scroll;
          });
        }

        personalizeMembershipBtns(response) {
            const currentCountry = response.response['pulse-two-letter-country'] ?
                $__default["default"].trim(response.response['pulse-two-letter-country'].toLowerCase()) : '';

            let $btnContainers = $__default["default"]('.cd-main-header [data-country-blacklist]');

            $btnContainers.each(function () {
                let countryBlacklist = $__default["default"](this).data('countryBlacklist');
                let blockedCountries = countryBlacklist ? countryBlacklist.split(',') : [];
                let shouldShow = true;

                for (let i = 0; i < blockedCountries.length; i++) {
                    let country = $__default["default"].trim(blockedCountries[i]);

                    if (country === currentCountry) {
                        shouldShow = false;
                        break;
                    }
                }

                if (!shouldShow) {
                    $__default["default"](this).remove();
                }
            });
        }

        /**
         * renderGeoLocationNav: renders geolocation navigation link
         */
        renderGeoLocationNav(response, geoServiceData) {
            const currentCountry = response.response['pulse-country'].toLowerCase(),
                currentRegion = response.response['pulse-region'].toLowerCase(),
                $geoLocationContainer = $__default["default"]('.geoLocationEnabled-true');

            $__default["default"].each(geoServiceData, (index, item) => {
                if (currentCountry === "usa" || currentCountry === "can") {
                    if (item.geoLocationStateCode && item.geoLocationStateCode.indexOf(
                        currentRegion) > -1) {

                        $geoLocationContainer.prepend(`<li><a
                        href="${item.geoNavLink}"
                        target="${item.geoNavTarget}"
                        class="current-location icon-locator
                        txt-clr-p4-hover">Local:${item.geoNavTitle}</a></li>`);
                            $__default["default"](".current-location").on("click", (event) => {
                                this.setAnalytics(event);
                             });
                        return false;
                    }
                }
                else {
                    if (item.geoLocationCountryCode && item.geoLocationCountryCode.indexOf(
                        currentCountry) > -1) {

                        $geoLocationContainer.prepend(`<li><a
                        href="${item.geoNavLink}"
                        target="${item.geoNavTarget}"
                        class="current-location icon-locator
                        txt-clr-p4-hover">Local:${item.geoNavTitle}</a></li>`);
                            $__default["default"](".current-location").on("click", (event) => {
                                this.setAnalytics(event);
                             });
                        return false;
                    }
                }
            });
        }

        /**
         * Analytics Function
         */
        setAnalytics(event) {
            let selected = $__default["default"](event.target);
            let linkText = [];
            const hostname = window.location.hostname;
            while (!selected.hasClass('cd-primary-nav')) {
                if (selected.is('li')) {
                    let _selected = $__default["default"](selected).children('a');
                    linkText.push(_selected.text());
                }
                selected = selected.parent();
            }
            let linkName = ($__default["default"].trim(linkText.reverse().join('.'))).toString().toLowerCase();
            linkName = linkName.replace(/ /g, '_');

            let aggregationTags = {
                'event_name': 'top_nav_click',
                'nav_click_location': hostname + '.tnav.' + linkName
            };
            tncUtility__default["default"].setAnalyticsByPage(aggregationTags, true);

        }

        /**
         * Analytics Function for Language Selection
         * TNCE-908
         */
        setAnalyticsByLng(selected) {
            let analyticsObj = {
                'event_name': 'select_language',
                'selected_language': selected
            };

            tncUtility__default["default"].setAnalyticsByPage(analyticsObj, true);
        }

        /*
         * Hide any shown menus, mainly the last primary nav. item's menu.
         */
        hideMenus() {
            // No longer keep the main nav. bar in its hover-style state for
            // as long as a menu is shown, as was set when showing a menu.
            $__default["default"]('.transparentHeader-true .cd-main-header').removeClass(
                'menu-shown');

            // Hide any open menus.
            $__default["default"]('.cd-primary-nav > li > a').removeClass('selected');
            $__default["default"]('.cd-secondary-nav').removeClass('selected').addClass(
                'is-hidden').end().end().parent('ul').removeClass(
                'moves-out');
            $__default["default"]('.cd-overlay').removeClass('is-visible');
        }

        /**
         * registerEventHandler: Register event handlers for desktop
         */
        registerEventHandler() {
            var self = this;
            $__default["default"]('.search-form').on('submit', (event) => {
                event.preventDefault();
                $__default["default"]('.search-button-header').trigger('click');
            });

            $__default["default"](window).on('resize', () => {
                this.setSearchPosition();
            });

            // open search form
            $__default["default"]('.cd-search-trigger').on('click', (event) => {
                event.preventDefault();
                this.toggleSearch();
                this.closeNav();
            });

            // close menu on overlay click
            $__default["default"]('.cd-overlay').on('click', () => {
                this.closeNav();
                this.toggleSearch('close');
            });

            $__default["default"]('.cd-secondary-nav').find('a').on('click', (event) => {
              var navContainer = $__default["default"](event.target).closest('.cd-secondary-nav').parent();
              if (navContainer.hasClass('language-selector-mobile')) {
                return;
              } else {
                this.setAnalytics(event);
              }
            });

            // Hide menus upon clicking outside of them.
            $__default["default"](document).on('click', (event) => {
                if ($__default["default"](event.target).closest('#cd-primary-nav').length === 0) {
                    this.hideMenus();
                }
            });

            // Hide menus upon pressing the Escape key.
            $__default["default"](document).on('keydown', (event) => {
                var key = event.key;
                if (key === 'Escape') {
                    this.hideMenus();
                }
            });

            // Hide menus when the search icon gains keyboard focus.
            $__default["default"]('.cd-search-trigger').on('focus', () => {
                this.hideMenus();
            });

            // Hide menu when close button is pressed (desktop).
            $__default["default"]('.closeMenu').on('click', () => {
                this.hideMenus();
            });

            // prevent default clicking on direct children of .cd-primary-nav
            $__default["default"]('.cd-primary-nav').children('.has-children').children('a').on(
                'click', (event) => {

                const isMainlinkClicked = $__default["default"](event.target).hasClass('link-submenu');
                if (isMainlinkClicked && tncUtility__default["default"].checkWindowWidth() &&
                    !this.is_touch_device()) {
                    this.setAnalytics(event);
                    return;
                } else {
                    event.preventDefault();
                }

                const selected = $__default["default"](event.target);
                $__default["default"]('.has-promo-mobile').hide();
                if (!tncUtility__default["default"].checkWindowWidth()) {
                    // mobile version only
                    selected.addClass('selected').next('ul').removeClass(
                        'is-hidden').end().parent('.has-children').parent(
                        'ul').addClass('moves-out');
                    selected.parent('.has-children').siblings(
                        '.has-children').children('ul').addClass(
                        'is-hidden').end().children('a').removeClass('selected');
                    $__default["default"]('.cd-overlay').addClass('is-visible');
                }

                const mobileLangLinks = $__default["default"](event.target).parent().hasClass('language-selector-mobile');
                if (mobileLangLinks) {
                  return;
                } else {
                  this.setAnalytics(event);
                }
            });

            $__default["default"](".cd-nav .cd-primary-nav > .has-children.mainNav").on(
                "touch click", (event) => {

                // Handle actions on primary navigation items.

                const selected = $__default["default"](event.target);
                let selectedMainNav = null;

                if (selected.is('.mainNav')) {
                    selectedMainNav = selected;
                }
                else if (selected.is('.mainNav > a')) {
                    selectedMainNav = selected.parent();
                }

                if (tncUtility__default["default"].checkWindowWidth()) {
                    // For desktop widths:
                    // If main navigation item is selected, toggle the menu.
                    if (selectedMainNav) {
                        if (selectedMainNav.children(
                            '.cd-secondary-nav').hasClass('is-hidden')) {

                            // Keep the main nav. bar in its hover-style state
                            // for as long as a menu is being shown.
                            $__default["default"]('.transparentHeader-true .cd-main-header').addClass(
                                'menu-shown');

                            // Show the menu.
                            selectedMainNav.children('a').addClass('selected').next(
                                'ul').removeClass('is-hidden').end().end().parent(
                                'ul').addClass('moves-out');
                            selectedMainNav.siblings('.has-children').children(
                                'ul').addClass('is-hidden').end().children(
                                'a').removeClass('selected');
                            $__default["default"]('.cd-overlay').addClass('is-visible');
                        }
                        else {
                            // Hide the menu.
                            this.hideMenus();
                        }
                    }
                    else if (selected.is('a') || selected.parent().is('a') ||
                        selected.parent().parent().is('a')) {
                        // On selecting a linked item in the menu, hide the menu.
                        this.hideMenus();
                    }
                    this.toggleSearch('close');
                }

                // Don't allow the href for the main nav. item links to
                // be followed, because now they just serve as menu toggles.
                // However, these hrefs would serve as backup links to
                // the sub-pages if the JS failed to load.
                if ($__default["default"](event.target).is('.cd-primary-nav > .mainNav > a')) {
                    return false;
                }
            });

            // Allow toggling the main navigation item menus with the Space key.
            $__default["default"](".cd-nav .cd-primary-nav > .has-children.mainNav").on(
                "keypress", (event) => {

                if (event.key === " ") {   // Space key
                    event.preventDefault();
                    event.stopPropagation();
                    let navigationItem = $__default["default"](event.target);
                    navigationItem.click();
                }
            });

            // Auto-complete
            $__default["default"](".searchBoxHeader").on('input', (event) => {
                if (event.target.value.length >= 3) {
                    // trigger auto suggest
                    this.triggerAutoSuggest(event.target);
                }
                else {
                    // cancel previous call if any
                    this.abortAutoSuggestion();
                }
            });

            $__default["default"]('.srchSuggestionsHeader').on('click',
                '.suggestionItemsHeader', (event) => {

                this.acceptSuggestion(event);
            });

            // search button click
            $__default["default"]('.search-button-header').on('click', (event) => {
                event.preventDefault();
                const searchWord = $__default["default"]('.searchBoxHeader').val();
                if (!$__default["default"].trim(searchWord)) {
                    return false;
                }
                const searchUrl = $__default["default"](event.target).data('search-page');
                if (this.locationFlag) {
                    window.location.href = searchUrl + '?q=' + searchWord;
                }
            });

            // Search field keyboard handler
            // (Have to set suggestions handlers later, when they appear)
            $__default["default"](".searchBoxHeader").on("keydown",
                this.searchFieldKeyPress.bind(this));

            // show language Selector
            let $lngOptions = $__default["default"](".language-selector ul.ls-list-options");
            $__default["default"]("#js-language-selected").on("click", function (e) {
                e.stopPropagation();
                $lngOptions.toggleClass("hide");
            });

            // On click of link hide language Selector
            $lngOptions.on("click", "a", function () {
                $lngOptions.addClass("hide");
            });

            // hide language Selector when clicking on anyware in body
            $__default["default"]('body').click(function () {
                $lngOptions.addClass("hide");
            });

            // Analytics tracker
            $__default["default"](".language-selector .ls-list-options a, .language-selector-mobile .cd-secondary-nav a").on(
                "click touchend", function () {

                let _selected = $__default["default"](this).attr("data-code");
                _selected = (_selected) ? _selected : "undefined";
                self.setAnalyticsByLng(_selected);
            });
        }

        acceptSuggestion(event) {
            // Accept a search suggestion: put it in the search field and run it.

            let selectedSuggestion = $__default["default"](event.target).text();
            $__default["default"](".searchBoxHeader").val(selectedSuggestion);

            // Close the search suggestions menu.
            $__default["default"](".srchSuggestionsHeader").hide();

            $__default["default"](".search-button-header").trigger("click");
        }

        searchFieldKeyPress(event) {
            var key = event.key;

            // Set keyboard handlers for visible search suggestions.
            let suggestions = $__default["default"](".srchSuggestionsHeader li");
            if (suggestions.length > 0 &&
                $__default["default"](".srchSuggestionsHeader").is(":visible")) {

                // Set keyboard handlers for suggestions.
                for (let i = 0; i < suggestions.length; i++) {
                    $__default["default"](suggestions[i]).on("keydown",
                        this.searchSuggestionKeyPress.bind(this));
                }
            }

            // down arrow
            if (key === "ArrowDown") {
                event.preventDefault();

                // If there are any search suggestions, set focus on the first.
                if (suggestions.length > 0 &&
                    $__default["default"](".srchSuggestionsHeader").is(":visible")) {

                    suggestions.first().focus();
                }
            }
        }

        searchSuggestionKeyPress(event) {
            var key = event.key;
            var target = event.target;

            // arrow keys, Enter
            if (key === "ArrowDown") {
                event.preventDefault();
                let nextItem = $__default["default"](target).next();
                if (nextItem) {
                    nextItem.focus();
                }
            }
            else if (key === "ArrowUp") {
                event.preventDefault();
                let previousItem = $__default["default"](target).prev();
                if (previousItem.length > 0) {
                    previousItem.focus();
                }
                else {
                    // If there's no previous item, this must be the first
                    // suggestion in the list: set focus on the search field.
                    $__default["default"](".searchBoxHeader").focus();
                }
            }
            else if (key === "Enter") {
                this.acceptSuggestion(event);
            }
        }

        /**
         * registerEventHandlerMobile: Register event handlers for mobile
         */
        registerEventHandlerMobile() {
            // mobile - open lateral menu clicking on the menu icon -- hamburger
            $__default["default"]('.cd-nav-trigger').on('click', (event) => {
                event.preventDefault();
                if ($__default["default"]('.cd-nav-trigger').hasClass('nav-is-visible')) {
                    this.closeNav();
                    if ($__default["default"]('header').hasClass('sticky-header')) {
                      $__default["default"]('body').removeClass('sticky-lock');
                    }
                }
                else {
                    $__default["default"]('.has-promo-mobile').show();
                    if ($__default["default"]('header').hasClass('sticky-header')) {
                      $__default["default"]('body').addClass('sticky-lock');
                    }
                    $__default["default"](event.currentTarget).addClass('nav-is-visible');
                    $__default["default"](event.currentTarget).attr('aria-expanded', 'true');
                    setTimeout(() => {
                        $__default["default"]('.cd-primary-nav').addClass('nav-is-visible');
                        $__default["default"]('.cd-main-header').addClass('nav-is-visible');
                        if(!$__default["default"]('.cd-main-header.sticky-header').length){
                          $__default["default"]('html, body').addClass('overflow-hidden');
                        }
                        $__default["default"]('.cd-nav').addClass('is-visible');
                        $__default["default"]('.cd-overlay').addClass('is-visible');
                        $__default["default"]('.cd-main-content').addClass('nav-is-visible');

                        this.toggleSearch('close');
                    }, 100);
                }
            });

            // close lateral menu on mobile
            $__default["default"]('.cd-overlay').on('swiperight', () => {
                if ($__default["default"]('.cd-primary-nav').hasClass('nav-is-visible')) {
                    this.closeNav();
                }
            });

            $__default["default"]('.nav-on-left .cd-overlay').on('swipeleft', () => {
                if ($__default["default"]('.cd-primary-nav').hasClass('nav-is-visible')) {
                    this.closeNav();
                }
            });

            // submenu items - go back link
            $__default["default"]('.go-back').on('click', (event) => {
                $__default["default"]('.has-promo-mobile').show();
                $__default["default"](event.currentTarget).parent('ul').addClass(
                    'is-hidden').parent('.has-children').parent(
                    'ul').removeClass('moves-out');
            });
        }

        /**
         * readBtnsCookies: Read cookies to show hide membership btns 2 and 3
         */
        readBtnsCookies() {
            const membershipBtnCookie = browserStorageModule__default["default"] ? browserStorageModule__default["default"].getCookie(
                "per_monthlybutton") : false;
            if (membershipBtnCookie === "true") {
                $__default["default"](".membershipBtns.membershipBtns3").removeClass("membershipBtns3");
            }
            else {
                $__default["default"](".membershipBtns.membershipBtns2").removeClass("membershipBtns2");
            }
        }

        /**
         * closeNav: close navigation on go-back and search
         */
        closeNav() {
            $__default["default"]('.cd-nav-trigger').removeClass('nav-is-visible');
            $__default["default"]('.cd-nav-trigger').attr('aria-expanded', 'false');

            // add delay to avoid race conditions with navi menu animation
            setTimeout(() => {
                $__default["default"]('.cd-main-header').removeClass('nav-is-visible');
                $__default["default"]('.cd-primary-nav').removeClass('nav-is-visible');
                $__default["default"]('.cd-overlay').removeClass('is-visible');
                $__default["default"]('.cd-nav').removeClass('is-visible');
                $__default["default"]('.has-children ul').addClass('is-hidden');
                $__default["default"]('.has-children a').removeClass('selected');
                $__default["default"]('.moves-out').removeClass('moves-out');
                $__default["default"]('html, body').removeClass('overflow-hidden');
                $__default["default"]('.cd-main-content').removeClass('nav-is-visible');

                if (!tncUtility__default["default"].checkWindowWidth()) {
                    // for mobile
                    $__default["default"]('.cd-primary-nav').scrollTop(0);
                    $__default["default"]('.cd-secondary-nav').scrollTop(0);
                }
            }, 100);
        }

        /**
         * toggleSearch: toggles the search bar in header
         */
        toggleSearch(type) {
            if ($__default["default"]('.cd-search-trigger').hasClass('search-is-visible')) {
                this.resetSearch();
            }

            if (type === "close" || $__default["default"]('.cd-search').hasClass('is-visible')) {
                // close search
                $__default["default"]('.cd-search').removeClass('is-visible').find(
                    '.searchBoxHeader').removeClass('border-primary');
                $__default["default"]('.cd-search-trigger').removeClass('search-is-visible');

                $__default["default"]('.cd-search-trigger').attr('aria-expanded', 'false');

                var showText = $__default["default"]('.cd-search-trigger').attr('data-show-text');
                $__default["default"]('.cd-search-trigger').contents().get(0).textContent = showText;

                $__default["default"]('.cd-overlay').removeClass('search-is-visible');
                $__default["default"]('.cd-main-header').removeClass('search-visible');
            }
            else {
                // show search
                this.setSearchPosition();
                $__default["default"]('.cd-search').addClass('is-visible').show().find(
                    '.searchBoxHeader').addClass('border-primary');
                $__default["default"]('.cd-search-trigger').addClass('search-is-visible');

                $__default["default"]('.cd-search-trigger').attr('aria-expanded', 'true');

                var hideText = $__default["default"]('.cd-search-trigger').attr('data-hide-text');
                $__default["default"]('.cd-search-trigger').contents().get(0).textContent = hideText;

                $__default["default"]('.cd-overlay').addClass('search-is-visible');
                $__default["default"]('.searchBoxHeader').focus();
                $__default["default"]('.cd-main-header').addClass('search-visible');
            }
        }

        /**
         * setSearchPosition: Set position of search input field from the top
         */
        setSearchPosition() {
            let bannerDisplay = $__default["default"]('.c-alert-banner').css('display');

            if ((bannerDisplay === 'none') || (bannerDisplay === undefined)) {
                let headerHeight = $__default["default"]('.cd-main-header').outerHeight();
                let headerMargin = $__default["default"]('.cd-main-header').css('margin-top');
                if (headerMargin !== undefined) {
                    headerMargin = headerMargin.split('px');
                    let searchMargin = parseInt(headerMargin[0]);
                    $__default["default"]('.cd-search').css('top', headerHeight + searchMargin);
                }
                else {
                    $__default["default"]('.cd-search').css('top', headerHeight);
                }
            }
        }

        /**
         * resetSearch: reset Search input box value on close
         */
        resetSearch() {
            $__default["default"](".search-form .c-field__input").val('');
            $__default["default"]('.auto-complete').hide();
        }

        /**
         * triggerAutoSuggest function:-
         */
        triggerAutoSuggest(srchBox) {
            const input = $__default["default"].trim($__default["default"](srchBox).val());
            var prefixes = '';
            input.split(/[^a-z0-9]/i).forEach(prefix => {
                prefix = prefix.trim();
                if (prefix.length > 0) {
                    prefixes += `(prefix field='suggester' '${prefix}')`;
                }
            });
            const suggestionApi = $__default["default"](srchBox).data('suggestionApi'),
                obj = {
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    url: suggestionApi,
                    data: {
                        q: `(and ${prefixes})`,
                        'q.parser': 'structured',
                        fq: `search_by_domain:'${this.searchByDomain}'`,
                        size: 1000,
                        return: 'title',
                        sort: 'title asc'
                    }
                };
            // cancel any previous call
            this.abortAutoSuggestion();
            xhrModule__default["default"].initXHR(obj).then(
                (suggestions, textStatus, jqXHR) => this.renderAutoSuggest(suggestions, jqXHR, input));
        }

        /**
         * abortAutoSuggestion function:-
         */
        abortAutoSuggestion() {
            if (this.suggestionQueue !== null) {
                this.suggestionQueue.abort();
                this.suggestionQueue = null;
                $__default["default"]('.srchSuggestionsHeader').hide();
            }
        }

        /**
         * renderAutoSuggest function:-
         */
        renderAutoSuggest(suggestedResult, jqXHR, query) {
            this.suggestionQueue = jqXHR;
            if (!suggestedResult.hits.found) {
                return;
            }
            var filteredResult = suggestedResult.hits.hit.filter(function(hit) {
                let title = hit.fields.title;
                if (this.limit < 6 && title &&
                    title.toLowerCase().startsWith(query.toLowerCase())) {
                    this.limit++;
                    return true;
                }
                return false;
            }, {limit: 0});
            console.log(JSON.stringify(filteredResult));
            const suggestionTemplate = `{{#each this}}
            <li class="c-field__input fz-v6 suggestionItemsHeader"
                tabindex="0">{{this.fields.title}}</li>
            {{/each}}`,
                template = Handlebars.compile(suggestionTemplate),
                suggestListHtml = template(filteredResult);

            $__default["default"]('.srchSuggestionsHeader').html(suggestListHtml).show();
        }

        /**
         * getBrowserLocale function:-
         */
        getBrowserLocale() {
            tncUtility__default["default"].checkBrowserLocale();
        }
    }

    var header_component = new Header();

    return header_component;

})($, TNC.BrowserStorage, TNC.XHR, TNC.Utility);
//# sourceMappingURL=header.component.js.map

this.TNC = this.TNC || {};
this.TNC.HomepageFeature = (function ($, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    // Homepage Feature component JS goes here

    /** Homepage Feature Class. */
    class HomepageFeature {
        /**
         * Homepage Feature constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            this.$homeSignup = $__default["default"]('.c-homepage-signup');
            this.emailInput = this.$homeSignup.find('.c-field__input');
            this.signupSubmit = this.$homeSignup.find('.signup-submit');
            this.signupForm = this.signupSubmit.closest("form");
            this.componentUniqueId = this.signupForm.data("componentuniqueid");

            this.emailInput.on('keyup', (event) => {
                if (event.key === 'Enter') {
                    this.validateEmail.bind(this);
                }
            });

            this.email_check_passed = false;
            this.signupSubmit.on('click', this.validateEmail.bind(this));
            this.$homeSignup.find('.error__msg').css('display', 'none');
            this.$homeSignup.find('.i-error').css('display', 'none');
            this.$homeSignup.find('.already-registered-error').css('display', 'none');
            this.$homeSignup.find('.freshaddress-error').css('display', 'none');
        }

        /**
         * Signup Email Validation function
         */
        validateEmail(event) {
    		event.preventDefault();
            const filter = /^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            const $thisEmailForm = $__default["default"](event.target).closest('form');
            const thisEmailInput = $thisEmailForm.find('.c-field__input');
            const componentUniqueId = $thisEmailForm.data("componentuniqueid");
            const errorMsg = $thisEmailForm.find('.error__msg');
            const iError = $thisEmailForm.find('.i-error');
            const alreadyRegisteredError = $thisEmailForm.find('.already-registered-error');
            const freshAddressError = $thisEmailForm.find('.freshaddress-error');

            // clear old errors
            errorMsg.css('display', 'none');
            iError.css('display', 'none');
            alreadyRegisteredError.css('display', 'none');
            freshAddressError.css('display', 'none');

            // else condition need to be ignore for test jsunit, because it will reload the page
            // and page reload will break the karma to run
            /* istanbul ignore else */
            if (!filter.test(thisEmailInput.val())) {
                event.preventDefault();
                errorMsg.css('display', 'block');
                iError.css('display', 'block');

                var _analytics = {
                    'event_name': 'submit_error',
                    'form_type': 'email_signup',
                    'form_name': 'c83_signup_form',
                    'form_field_error_field': 'cons_email',
                    'form_field_error_value': errorMsg.text().trim()
                };
                utl__default["default"].setAnalyticsByPage(_analytics, true);
            } else {
                if ( !this.email_check_passed ) {
                    event.preventDefault();
                    let _self = this;
                    // call Engaging Networks
                    // If email exists, display error, else trigger click with passed test
                    utl__default["default"].checkEmailEngagingNetworks(thisEmailInput.val()).then(function(data) {
                        if (data.result === 'NOT FOUND') {
                            _self.email_check_passed = true;
                            $thisEmailForm.find('.signup-submit').trigger('click');
                        } else {
                            var errorTxt;
                            iError.css('display', 'block');
                            if (data.result === 'EXISTS') {
                                alreadyRegisteredError.css('display', 'block');
                                errorTxt = alreadyRegisteredError.text().trim();
                            } else {
                                // else handle freshaddress response
                                utl__default["default"].handleFreshAddressResponse(data, $thisEmailForm);
                                let errMsgArr = freshAddressError
                                    .find('[style*="display: inline"],[style*="display:inline"]')
                                    .toArray().map((elem) => { return elem.innerText.trim(); });
                                errorTxt = errMsgArr.join(" ");
                            }

                            // SYS-4939: Remove user email from analytics error message
                            errorTxt = errorTxt.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b(?=\?)/i,
                                "<REDACTED>");

                            var _analytics = {
                                'event_name': 'submit_error',
                                'form_type': 'email_signup',
                                'form_name': 'c83_signup_form',
                                'form_field_error_field': 'cons_email',
                                'form_field_error_value': errorTxt
                            };
                            utl__default["default"].setAnalyticsByPage(_analytics, true);
                        }
                    });
                } else {
                    this.email_check_passed = false;
                    // var __analytics = {
                    //   'event_name': 'email_signup',
                    //   'form_type': 'email_signup',
                    //   'form_name': 'c83_signup_form',
                    //   'email_signup_location': 'c83_signup_form'
                    // };
                    // utl.setAnalyticsByPage(__analytics, true);
                    grecaptcha.execute(utl__default["default"].getWidgetId(componentUniqueId + "-grecaptcha"));
                }
            }
        }
    }

    var homepageFeature_component = new HomepageFeature();

    function homepageFeatureCallback(token) {
        let homepageFeature = new HomepageFeature();
        var __analytics = {
          'event_name': 'email_signup',
          'form_type': 'email_signup',
          'form_name': 'c83_signup_form',
          'email_signup_location': 'c83_signup_form'
        };
        utl__default["default"].captchaSubmit(token, homepageFeature.signupForm, __analytics);
    }

    window.homepageFeatureCallback = homepageFeatureCallback;

    return homepageFeature_component;

})($, TNC.Utility);
//# sourceMappingURL=homepage-feature.component.js.map

this.TNC = this.TNC || {};
this.TNC.Timeline = (function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  // Timeline component JS goes here
  /** Timeline Class. */
  class Timeline {
    /**
     * Timeline constructor
     */
    constructor() {
        if ($__default["default"]('.c-timeline__wrapper .carousel-nav').length !== 0) {
          this.initialize();
        }
    }
    /**
     * Initialization function
     */
    initialize() {
      // init Flickity
      $__default["default"]('.c-timeline__wrapper .carousel-nav').flickity({
        "contain": true,
        "prevNextButtons": false,
        "pageDots": false
      });

      let $carouselMain = $__default["default"]('.c-timeline__wrapper .carousel-main').flickity({
        "pageDots": false,
        "cellAlign": "left",
        "contain": true,
        "freeScroll": true,
        "prevNextButtons": true
      });

      // update selected cellButtons
      $carouselMain.on('select.flickity', function (event) {
        let $this = $__default["default"](event.target);
        let $componentInstance = $this.closest('.c-timeline__wrapper');
        // Flickity instance
        let flkty = $this.data('flickity');
        let $cellButtonGroup = $componentInstance.find('.carousel-nav');
        let $cellButtons = $cellButtonGroup.find('.carousel-cell');

        let currentSlideTitle = $this.find('.carousel-cell').eq(flkty.selectedIndex).data('navTitle');
        $cellButtons.filter('.is-nav-selected')
          .removeClass('is-nav-selected border-secondary');

        $cellButtons.filter(`[data-nav="${currentSlideTitle}"]`)
          .addClass('is-nav-selected border-secondary');
      });

      // select cell on button click
      $__default["default"]('.carousel-nav').on('click', '.carousel-cell', function (event) {
        let $this = $__default["default"](event.target);
        let navTitle = $this.data('nav');
        let $componentInstance = $this.closest('.c-timeline__wrapper');
        let $carouselMain = $componentInstance.find('.carousel-main');
        let slideToSelectInMain = $carouselMain.find('.carousel-cell').filter(`[data-nav-title="${navTitle}"]`).eq(0).index();
        $carouselMain.flickity('select', slideToSelectInMain);
      });
    }
  }

  var timeline_component = new Timeline();

  return timeline_component;

})($);
//# sourceMappingURL=timeline.component.js.map

this.TNC = this.TNC || {};
this.TNC.FeaturedContentInitiatives = (function () {
    'use strict';

    // Featured Content Initiatives component JS goes here
    // import ScrollReveal from 'scrollreveal';
    // import $ from 'jquery';
    /** Featured Content Initiatives Class. */
    class FeaturedContentInitiatives {
        /**
         * Featured Content Initiative constructor
         */
        constructor() {
                this.initialize();
            }
            /**
             * Initialization function
             */
        initialize() {
            // this.featureToggle = $(".c-image-credit-feature_toggle.toggle");
            // this.featureToggleOn = $(".c-image-credit-feature_toggle.toggle-on");

            // this.quoteToggle = $(".c-image-credit-quote_toggle.toggle");
            // this.quoteToggleOn = $(".c-image-credit-quote_toggle.toggle-on");

            // window.sr = window.sr || ScrollReveal();
            // window.sr.reveal('.c-initiative__img', { beforeReveal: (el) => { el.classList.add('initiativeScroll'), 200 } });
            // window.sr.reveal('.c-initiative__col', { beforeReveal: (el) => { el.classList.add('initiativeScrollSecond'), 200 } });
            // window.sr.reveal('.c-quote__img', { beforeReveal: (el) => { el.classList.add('initiativeScrollThird'), 200 } });
            // window.sr.reveal('.c-quote__text', { beforeReveal: (el) => { el.classList.add('initiativeScrollFourth'), 200 } });

            // this.featureToggle.on('click', (event) => {
            //     event.preventDefault();
            //     event.stopPropagation();
            //     this.featureToggleView(event);
            // });

            // this.quoteToggle.on('click', (event) => {
            //     event.preventDefault();
            //     event.stopPropagation();
            //     this.quoteToggleView(event);
            // });
        }

        /**
         * Featured Image Credit Toggle function
         */
        // featureToggleView(event) {
        //   let eventTarget = $(event.target);
        //   const componentuniqueid = $(event.target).attr('data-componentuniqueid');
        //   const $contentElement = $(".c-image-credit-feature_content.toggle-content").closest(`[data-componentuniqueid="${componentuniqueid}"]`);
        //   if (!eventTarget.hasClass('toggle-on')) {
        //     $contentElement.css("display", "block").css("height", "62px");
        //     eventTarget.addClass("toggle-on").addClass("is-visible");
        //     return false;
        //   } else {
        //     $contentElement.css("height", "0");
        //     eventTarget.removeClass("toggle-on").removeClass("is-visible");
        //     return false;
        //   }   
        // }

        // /**
        //  * Quote Image Credit Toggle function
        //  */
        // quoteToggleView(event) {
        //   let eventTarget = $(event.target);
        //   const componentuniqueid = $(event.target).attr('data-componentuniqueid');
        //   const $contentElement = $(".c-image-credit-quote_content.toggle-content").closest(`[data-componentuniqueid="${componentuniqueid}"]`);
        //   if (!eventTarget.hasClass('toggle-on')) {
        //     $contentElement.css("display", "block").css("height", "62px");
        //     eventTarget.addClass("toggle-on").addClass("is-visible");
        //     return false;
        //   } else {
        //     $contentElement.css("height", "0");
        //     eventTarget.removeClass("toggle-on").removeClass("is-visible");
        //     return false;
        //   }   
        // }
    }

    var featuredContentInitiatives_component = new FeaturedContentInitiatives();

    return featuredContentInitiatives_component;

})();
//# sourceMappingURL=featured-content-initiatives.component.js.map

this.TNC = this.TNC || {};
this.TNC.FeaturedNumberList = (function () {
    'use strict';

    // Featured Number List component JS goes here
    class FeaturedNumberList {
        /**
         * Featured Number List constructor
         */
        constructor() {
                this.initialize();
            }
            /**
             * Initialization function
             */
        initialize() {
        }

    }

    var featuredNumberList_component = new FeaturedNumberList();

    return featuredNumberList_component;

})();
//# sourceMappingURL=featured-number-list.component.js.map

this.TNC = this.TNC || {};
this.TNC.FindLocalChapter = (function ($, Select, tncUtility) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var Select__default = /*#__PURE__*/_interopDefaultLegacy(Select);
    var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

    class FindLocalChapter {
        constructor() {
            this.initialize();
        }

        initialize() {
            this.targetUrl = "";
            this.locationFlag = true;
            const $chapterContainer = $__default["default"](".c-find-chapter");
            if (!$chapterContainer.length) {
                console.log("Find Local Chapter error: no container found");
                return;
            }

            this.baseElement = $chapterContainer;
            Select__default["default"].initialize(this.baseElement);
            Select__default["default"].setUpHybridSelects();

            this.submitBtn = $__default["default"](".submit-btn");
            this.submitBtn.attr("disabled", true);

            $chapterContainer.find(".submit-btn").on("click",
                this.goToLocalChapter.bind(this));

            this.getGeolocation();
            this.initializeEvents();
        }

        // Activate the button: redirect to a local chapter page.
        goToLocalChapter() {
            let regionSelect = this.baseElement.find("#regionSelectFLC");
            let stateSelect = this.baseElement.find("#stateSelectFLC");

            let countrySelected = regionSelect.val();
            let stateSelected = stateSelect.val();

            let helpTextUsa = this.baseElement.data("locale-help-text-us-region");
            let helpTextOther = this.baseElement.data(
                "locale-help-text-other-region");

            let analyticsStateValue = stateSelected;
            if (stateSelected === "" || stateSelected === helpTextUsa ||
                stateSelected === helpTextOther) {

                analyticsStateValue = undefined;
            }

            let localOppsAnalytics = {
                'event_name': 'find_local_opps',
                'event_action': `${countrySelected} | ${analyticsStateValue}`,
                'local_opp_search': `${countrySelected} | ${analyticsStateValue}`
            };

            // Variation: one-dropdown
            const componentVariation = this.baseElement.data('chooseVariation');
            if (componentVariation === "one-dropdown") {
                let helpTextSingle = this.baseElement.data("help-text-single");

                if (stateSelected === helpTextSingle) {
                    analyticsStateValue = undefined;
                }
                localOppsAnalytics = {
                    'event_name': 'find_local_opps',
                    'event_action': `${analyticsStateValue} | undefined`,
                    'local_opp_search': `${analyticsStateValue} | undefined`
                };
            }

            tncUtility__default["default"].setAnalyticsByPage(localOppsAnalytics, true);

            let regionUrl = regionSelect.find("option:selected").data("path");
            let stateUrl = stateSelect.find("option:selected").data("path");

            this.targetUrl = regionUrl;
            if (stateUrl !== "" && stateSelected !== "" &&
                stateSelected !== helpTextUsa &&
                stateSelected !== helpTextOther) {

                this.targetUrl = stateUrl;
            }

            if (this.locationFlag) {
                window.location.href = this.targetUrl;
            }
        }

        initializeEvents() {
            var that = this;

            let regionSelect = that.baseElement.find("#regionSelectFLC");
            let stateSelect = that.baseElement.find("#stateSelectFLC");

            regionSelect.on("change", function () {
                let selectedRegion = $__default["default"](this).val();

                // Update the label of the state select.

                let newLabel = "", newHelpText = "";
                if (selectedRegion.toLowerCase().replace(
                    / /g, '') === 'unitedstates' ||
                    selectedRegion.toLowerCase().replace(
                    / /g, '') === 'canada') {

                    newLabel = that.baseElement.data("state-label-2");
                    newHelpText = that.baseElement.data(
                        "locale-help-text-us-region");
                }
                else {
                    newLabel = that.baseElement.data("state-label");
                    newHelpText = that.baseElement.data(
                        "locale-help-text-other-region");
                }
                stateSelect.parent().prev("label").text(newLabel);

                // Remove all items.
                stateSelect.find('option').remove();

                // Add the first (help text) item.
                let newOption = document.createElement("option");
                newOption.value = "";
                newOption.text = newHelpText;
                stateSelect.append(newOption);

                // Add all the new items.
                let regionsStatesList = $__default["default"](this).data("regions-states-list");
                let i, item, statesList, regionTitle;
                for (i = 0; i < regionsStatesList.length; i++) {
                    item = regionsStatesList[i];
                    regionTitle = item["regionTitle"];
                    if (regionTitle === selectedRegion) {
                        // Found the states list for this region; add options.
                        statesList = item["statesList"];
                        for (let j = 0; j < statesList.length; j++) {
                            let state = statesList[j];
                            let stateTitle = state["stateTitle"];
                            let stateId = state["stateId"];
                            let statePath = state["statePath"];
                            let stateCode = state["stateCode"];
                            let regionCode = state["regionCode"][0];
                            newOption = document.createElement("option");
                            newOption.value = stateTitle;
                            newOption.text = stateTitle;
                            newOption.setAttribute("data-id", stateId);
                            newOption.setAttribute("data-path", statePath);
                            newOption.setAttribute("data-value", regionTitle);
                            newOption.setAttribute("data-state-code", stateCode);
                            newOption.setAttribute("data-code", regionCode);
                            stateSelect.append(newOption);
                        }
                        break;
                    }
                }
            });

            stateSelect.on("change", function () {
                let selectedState = $__default["default"](this).val();

                // Enable the button if a state is selected.
                if (selectedState !== "") {
                    that.submitBtn.attr("disabled", false);
                }
            });

            $__default["default"](document).on("click", () => {
                setTimeout(function () {
                    $__default["default"]("body").removeClass("cover-footer");
                }, 4);
            });
        }

        // Call geolocation API to get the current user location.
        getGeolocation() {
            const $chapterContainer = $__default["default"](".c-find-chapter");
            const disableGeo = $chapterContainer.data("disableGeoService");
            const componentVariation = $chapterContainer.data("chooseVariation");

            if (componentVariation === "one-dropdown") {
                // Ensure the state select is enabled.
                $chapterContainer.find("#stateSelectFLC").attr("disabled", false);
            }

            if (disableGeo === "no") {
                if (componentVariation === "one-dropdown") {
                    tncUtility__default["default"].checkGeolocation().then((response) =>
                        this.renderGeoLocationNavForOneDD(response));
                }
                else {
                    tncUtility__default["default"].checkGeolocation().then((response) =>
                        this.renderGeoLocationNav(response));
                }
            }
        }

        // Render geolocation navigation link (one-dropdown variation)
        renderGeoLocationNavForOneDD(response) {
            const currentRegion = response.response["pulse-region"].toLowerCase();
            console.log("(geoloc) currentRegion:", currentRegion);

            let stateSelect = this.baseElement.find("#stateSelectFLC");

            // Select the state whose state code matches the geolocation.
            let stateOption = stateSelect.find(
                `option[data-state-code='${currentRegion}']`);
            if (stateOption) {
                stateOption.prop("selected", true);
                // Wait a short time before triggering a change event.
                // This is to ensure any necessary updates will happen.
                setTimeout(function () {
                    stateSelect.trigger("change");
                }, 100);
            }
        }

        // Render geolocation navigation link (two-dropdown variation)
        renderGeoLocationNav(response) {
            // In geolocation naming, their "country" equals our "region" select.
            // Their "city" or "region" equals our "state" select ("city" is for
            // countries other than the US and Canada).
            const currentCountry = response.response["pulse-country"].toLowerCase();
            const currentCity = response.response["pulse-city"].toLowerCase();
            const currentRegion = response.response["pulse-region"].toLowerCase();
            console.log("(geoloc) currentCountry:", currentCountry);
            console.log("(geoloc) currentCity:", currentCity);
            console.log("(geoloc) currentRegion:", currentRegion);

            let regionSelect = this.baseElement.find("#regionSelectFLC");
            let stateSelect = this.baseElement.find("#stateSelectFLC");

            // Select the country whose region code matches the geolocation.
            let regionOption = regionSelect.find(
                `option[data-code='${currentCountry}']`);
            if (regionOption) {
                regionOption.prop("selected", true);
                // Wait a short time before triggering a change event.
                // This is to ensure the state select will be updated.
                setTimeout(function () {
                    regionSelect.trigger("change");
                }, 100);
            }

            // Select the state whose state code matches the geolocation.
            // First, wait a bit for the state select to be updated.
            setTimeout(function () {
                // Use the geoloc. "region" for US and Canada, "city" for others.
                let location = currentCity;
                if (currentCountry === "usa" || currentCountry === "can") {
                    location = currentRegion;
                }
                let stateOption = stateSelect.find(
                    `option[data-state-code='${location}']`);
                if (stateOption) {
                    stateOption.prop("selected", true);
                    // Wait a short time before triggering a change event.
                    // This is to ensure any necessary updates will happen.
                    setTimeout(function () {
                        stateSelect.trigger("change");
                    }, 100);
                }
            }, 500);
        }
    }

    var findALocalChapter_component = new FindLocalChapter();

    return findALocalChapter_component;

})($, TNC.Select, TNC.Utility);
//# sourceMappingURL=find-a-local-chapter.component.js.map

this.TNC = this.TNC || {};
this.TNC.FindALocalEvent = (function ($, tncUtility) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

  // Find A Local Event component JS goes here
  /** Find A Local Event Class. */
  class FindALocalEvent {
    /**
     * Find a Local Event constructor
     */
    constructor() {
      this.initialize();
    }
    /**
     * Initialization function
     */
    initialize() {
      this.target = '';
      this.locationFlag = true;
      let $eventsContainer = $__default["default"]('.c-find-events');
      this.submitBtn = $__default["default"]('.submit-btn');
      this.submitBtn.attr('disabled', true);
      $eventsContainer.find('.state-dd').attr({
        'disabled': true,
        'data-disabled': true
      });

      var regionSelect = $eventsContainer.find('.region-dd');
      var stateSelect = $eventsContainer.find('.state-dd');

      this.eventsUrl = this.submitBtn.data('url');
      this.helptextOther = $eventsContainer.find('.state-class').data('helptext-other');
      this.helptextUsa = $eventsContainer.find('.state-class').data('helptext-usa');
      $eventsContainer.find('.submit-btn').on('click', this.goToLocalEvents.bind(this));

      regionSelect.on('keydown', this.regionKeyPress.bind(this));
      regionSelect.on('click', this.activateRegionSelect);

      stateSelect.on('keydown', this.stateKeyPress.bind(this));
      stateSelect.on('click', this.activateStateSelect);
      stateSelect.on('focus', this.fixStateListDisplay);

      var selectMenuItems = $eventsContainer.find('.dropdown li a');
      selectMenuItems.on('keydown', this.menuItemKeyPress);

      this.getGeolocation();
      this.initializeEvents();
    }

    /**
     * Submit Button Click function
     */
    goToLocalEvents(event) {

      let countrySelected = $__default["default"](event.currentTarget).closest('.c-find-events').find('.region-class').text();
      let stateSelected = $__default["default"](event.currentTarget).closest('.c-find-events').find('.state-class').text();

      let helpTxtUsa = $__default["default"](event.currentTarget).closest('.c-find-events').find('.state-class').data('helptextUsa');
      let helpTxtOther = $__default["default"](event.currentTarget).closest('.c-find-events').find('.state-class').data('helptextOther');
      let helpTxtSingle = '';
      let analyticsStateValue = stateSelected;

      if (stateSelected === helpTxtUsa || stateSelected === helpTxtOther) {
        analyticsStateValue = undefined;
      }

      let localOppsAnalytics = {
        'event_name': 'find_local_opps',
        'event_action': `${countrySelected} | ${analyticsStateValue}`,
        'local_opp_search': `${countrySelected} | ${analyticsStateValue}`
      };

      const $localEventContainer = $__default["default"]('.c-find-events');
      const componentVariation = $localEventContainer.data('chooseVariation');
      if (componentVariation === "one-dropdown") {
        helpTxtSingle = $__default["default"](event.currentTarget).closest('.c-find-events').find('.state-class').data('helptxt');

        if (helpTxtSingle === stateSelected) {
          analyticsStateValue = undefined;
        }
        localOppsAnalytics = {
          'event_name': 'find_local_opps',
          'event_action': `${analyticsStateValue} | undefined`,
          'local_opp_search': `${analyticsStateValue} | undefined`
        };
      }

      tncUtility__default["default"].setAnalyticsByPage(localOppsAnalytics, true);
      if (componentVariation === "one-dropdown") {
        if (stateSelected !== helpTxtSingle) {
          this.target = this.eventsUrl + '?s=' + stateSelected;
        }
      } else {
        this.target = this.eventsUrl + '?r=' + countrySelected;
        /* istanbul ignore else */
        if (stateSelected !== helpTxtUsa && stateSelected !== helpTxtOther) {
          this.target += '&s=' + stateSelected;
        }
      }

      /* istanbul ignore if */
      if (this.locationFlag) {
        window.location.href = this.target;
      }
    }

    /**
     * Select menu click function
     */
    initializeEvents() {
      var that = this;
      $__default["default"]('.c-find-events').find('.region-dd a').on('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        let selectedRegion = $__default["default"](event.target).text();
        let selectedRegionId = $__default["default"](event.target).data('region');
        $__default["default"](event.target).closest('.c-find-events').find('.region-class').html(selectedRegion);
        // hide the region menu
        $__default["default"](event.target).closest('.region-dd').removeClass('is-active icon-drop-down-active txt-clr-p4');
        that.updateRegionTabindexes();
        that.updateStateTabindexes();
        setTimeout(function () {
          $__default["default"]('body').removeClass('cover-footer');
        }, 4);

        $__default["default"](event.target).closest('.c-find-events').find('.state-class').text(this.helptextOther);

        if (selectedRegion.toLowerCase().replace(/ /g, '') === 'unitedstates' || selectedRegion.toLowerCase().replace(/ /g, '') === 'canada') {
          $__default["default"](event.target).closest('.c-find-events').find('.state-class').text(this.helptextUsa);
        }

        $__default["default"](event.target).closest('.c-find-events').find('.state').css('display', 'none');
        let stateList = $__default["default"](event.target).closest('.c-find-events').find('.state#' + selectedRegionId);
        if (stateList.children().length) {
          stateList.css('display', 'block');
          stateList.closest('.state-dd').removeAttr('disabled data-disabled');
          stateList.closest('.state-dd').removeClass('disabled txt-clr-g7');
        } else {
          stateList.closest('.state-dd').attr({ 'disabled': true, 'data-disabled': true });
          stateList.closest('.state-dd').addClass('disabled txt-clr-g7');
        }
        $__default["default"](event.target).closest('.c-find-events').find('.submit-btn').removeAttr('disabled');
      });

      $__default["default"]('.c-find-events').find('.state-dd a').on('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        let selectedState = $__default["default"](event.target).text();
        $__default["default"](event.target).closest('.c-find-events').find('.state-class').html(selectedState);
        // hide the state menu
        $__default["default"](event.target).closest('.state-dd').removeClass('is-active txt-clr-p4 icon-drop-down-active');
        that.updateRegionTabindexes();
        that.updateStateTabindexes();
        setTimeout(function () {
          $__default["default"]('body').removeClass('cover-footer');
        }, 4);

        $__default["default"](event.target).closest('.c-find-events').find('.submit-btn').removeAttr('disabled');
      });

      $__default["default"](document).on('click', () => {
        $__default["default"]('.c-find-events').find('.list-item').removeClass('is-active txt-clr-p4 icon-drop-down-active');
        setTimeout(function () {
          $__default["default"]('body').removeClass('cover-footer');
        }, 4);
      });
    }

      activateRegionSelect(event) {
          $__default["default"]('.c-find-chapter').find('.state-dd').removeClass(
              'is-active icon-drop-down-active');
          $__default["default"](event.currentTarget).toggleClass('is-active icon-drop-down-active');
          event.stopPropagation();

          var listItems = event.currentTarget.querySelectorAll('.dropdown li a');
          var isOpen = $__default["default"](event.currentTarget).hasClass(
              'is-active icon-drop-down-active');

          /* istanbul ignore else */
          if (isOpen) {
              $__default["default"]('body').addClass('cover-footer');

              // Focus on the first item.
              $__default["default"](listItems[0]).focus();
          }
          else {
              setTimeout(function () {
                  $__default["default"]('body').removeClass('cover-footer');
              }, 4);
          }
      }

      activateStateSelect(event) {
          const $eventsContainer = $__default["default"]('.c-find-events');
          const componentVariation = $eventsContainer.data('chooseVariation');
          if (componentVariation === "one-dropdown") {
              $__default["default"](event.currentTarget).closest('.c-find-chapter').find(
                  '.state').css('display', 'block');
          }

          $__default["default"](event.currentTarget).toggleClass('is-active icon-drop-down-active');

          var listItems = event.currentTarget.querySelectorAll(
              '.dropdown[style="display: block;"] li a');
          var isOpen = $__default["default"](event.currentTarget).hasClass(
              'is-active icon-drop-down-active');

          /* istanbul ignore else */
          if (isOpen) {
              $__default["default"]('body').addClass('cover-footer');

              // Focus on the first item.
              $__default["default"](listItems[0]).focus();
          }
          else {
              setTimeout(function () {
                  $__default["default"]('body').removeClass('cover-footer');
              }, 4);
          }

          event.stopPropagation();
      }

      fixStateListDisplay(event) {
          // Fix a bug (SYS-4137) affecting keyboard use by unsetting
          // "display: block" for all state lists except the United States.

          let countrySelected = $__default["default"](event.currentTarget).closest(
              ".c-find-chapter").find(".region-class").text();

          if (countrySelected === "United States") {
              let stateLists = $__default["default"](event.currentTarget).closest(
                  ".c-find-chapter").find(".state-dd ul");
              for (let i = 0; i < stateLists.length; i++) {
                  let item = $__default["default"](stateLists[i]);
                  if (item.attr("id") !== "UnitedStates") {
                      item.css("display", "none");
                  }
              }
          }
      }

    /**
     * getGeolocation: call geo api to get the current user location
     */
    getGeolocation() {
      const $localEventContainer = $__default["default"]('.c-find-events');
      const geoServiceData = $localEventContainer.data('geolocationdatastr');
      const disableGeo = $localEventContainer.data('disableGeoService');
      const componentVariation = $localEventContainer.data('chooseVariation');

      if (componentVariation === "one-dropdown") {
        $localEventContainer.find('.state-dd').attr({
          'disabled': false,
          'data-disabled': false
        });
        $localEventContainer.find('.state-dd').removeClass('disabled txt-clr-g7');
      }

      /* istanbul ignore else */
      if (geoServiceData && disableGeo === 'no') {
        if (componentVariation === "one-dropdown") {
          tncUtility__default["default"].checkGeolocation().then((response) => this.renderGeoLocationNavForOneDD(response, geoServiceData));
        } else {
          tncUtility__default["default"].checkGeolocation().then((response) => this.renderGeoLocationNav(response, geoServiceData));
        }
      }
    }

    renderGeoLocationNavForOneDD(response, geoServiceData) {
      const currentRegion = response.response['pulse-region'].toLowerCase();

      for (var i = 0; i < geoServiceData.length; i++) {
        if (geoServiceData[i].stateCode.indexOf(currentRegion) > -1) {
          $__default["default"]('.c-find-events').find('.state-class').text(geoServiceData[i].stateTitle);
          $__default["default"]('.c-find-events').find('.state-class').attr('data-path', geoServiceData[i].statePath);
          $__default["default"]('.c-find-events').find('.state-dd').removeAttr('disabled data-disabled');
          $__default["default"]('.c-find-events').find('.state-dd').removeClass('disabled txt-clr-g7');
          this.submitBtn.removeAttr('disabled');
          break;
        }
      }
    }

    /**
     * renderGeoLocationNav: renders geolocation navigation link
     */
    renderGeoLocationNav(response, geoServiceData) {
      const currentCountry = response.response['pulse-country'].toLowerCase();
      const currentCity = response.response['pulse-city'].toLowerCase();
      const currentRegion = response.response['pulse-region'].toLowerCase();
      // $.each(geoServiceData, () => {
      /* istanbul ignore next */
      if ((currentCountry === 'usa') || (currentCountry === 'canada')) {
        $__default["default"]('.c-find-events').find('.state-class').text(this.helptextUsa);
      } else {
        $__default["default"]('.c-find-events').find('.state-class').text(this.helptextOther);
      }
      // });
      let loopBreak = false;
      for (var i = 0; i < geoServiceData.length; i++) {
        if (geoServiceData[i].regionCode.indexOf(currentCountry) > -1) {
          $__default["default"]('.c-find-events').find('.region-class').text(geoServiceData[i].regionTitle);
          const regionId = geoServiceData[i].regionId;
          $__default["default"]('.c-find-events').find('ul#' + regionId).css('display', 'block');
          this.submitBtn.removeAttr('disabled');
        }
        for (var j = 0; j < geoServiceData[i].statesList.length; j++) {
          if (currentCountry === "usa" || currentCountry === "can") {
            if (geoServiceData[i].statesList[j].regionCode.indexOf(currentCountry) > -1) {
              $__default["default"]('.c-find-events').find('.region-class').text(geoServiceData[i].regionTitle);
              const regionId = geoServiceData[i].regionId;
              $__default["default"]('.c-find-events').find('ul#' + regionId).css('display', 'block');
              $__default["default"]('.c-find-events').find('.state-dd').removeAttr('disabled data-disabled');
              $__default["default"]('.c-find-events').find('.state-dd').removeClass('disabled txt-clr-g7');

              // if (geoServiceData[i].statesList[j].stateId.toLowerCase() === currentCity) {
              /* istanbul ignore else */
              if (geoServiceData[i].statesList[j].stateCode.indexOf(currentRegion) > -1) {
                $__default["default"]('.c-find-events').find('.state-class').text(geoServiceData[i].statesList[j].stateTitle);
                $__default["default"]('.c-find-events').find('.state-dd').removeAttr('disabled data-disabled');
                $__default["default"]('.c-find-events').find('.state-dd').removeClass('disabled txt-clr-g7');
                this.submitBtn.removeAttr('disabled');
                loopBreak = true;
                break;
              }
            }
          } else {
            if (geoServiceData[i].statesList[j].regionCode.indexOf(currentCountry) > -1 || geoServiceData[i].statesList[j].stateId.toLowerCase() === currentCity) {
              $__default["default"]('.c-find-events').find('.state-class').text(geoServiceData[i].statesList[j].stateTitle);
              $__default["default"]('.c-find-events').find('.region-class').text(geoServiceData[i].regionTitle);
              const regionId = geoServiceData[i].regionId;
              $__default["default"]('.c-find-events').find('ul#' + regionId).css('display', 'block');
              $__default["default"]('.c-find-events').find('.state-dd').removeAttr('disabled data-disabled');
              $__default["default"]('.c-find-events').find('.state-dd').removeClass('disabled txt-clr-g7');
              this.submitBtn.removeAttr('disabled');
              loopBreak = true;
              break;
            }
          }
        }
        if (loopBreak) {
          break;
        }
      }
    }


      /**
       * Region select: handle key presses
       */
      regionKeyPress(event) {
          var key = event.key;
          var target = event.target;

          if (key === " ") {   // Space key
              event.preventDefault();   // Prevent scrolling the page.
              this.activateRegionSelect(event);
          }
          else if (key === "Escape") {
              var menu = $__default["default"](target).closest(".list-item");
              if (menu.hasClass("is-active")) {
                  // Dismiss the menu and leave the closed menu with focus.
                  menu.click();
                  menu.focus();
              }
          }
      }

      /**
       * State select: handle key presses
       */
      stateKeyPress(event) {
          var key = event.key;
          var target = event.target;

          if (key === " ") {   // Space key
              event.preventDefault();   // Prevent scrolling the page.
              this.activateStateSelect(event);
          }
          else if (key === "Escape") {
              var menu = $__default["default"](target).closest(".list-item");
              if (menu.hasClass("is-active")) {
                  // Dismiss the menu and leave the closed menu with focus.
                  menu.click();
                  menu.focus();
              }
          }
      }

      /**
       * Handle menu-item key presses from either select menu.
       */
      menuItemKeyPress(event) {
          var key = event.key;
          var target = event.target;

          var selectList = $__default["default"](event.target).closest("ul.dropdown");
          var numberOfItems = selectList.find("li").length;
          // Find the currently focused item's index.
          var focusedItemIndex = 0;
          var items = selectList.find("a");
          items.each(function (index) {
              var item = $__default["default"](this);
              if (item.is(":focus") === true) {
                  focusedItemIndex = index;
              }
          });

          if (key === " " || key === "Enter") {   // Space key
              target.click();
              var menu = $__default["default"](target).closest('.list-item');
              if (key === " ") {   // Avoid extra menu click if Enter key
                  menu.click();
              }
              menu.focus();
          }
          else if (key === "ArrowUp") {
              if (focusedItemIndex > 0) {
                  var previousItem = $__default["default"](event.target).parent().prev().find("a");
                  if (previousItem) {
                      previousItem.focus();
                  }
              }
              return false;   // prevent menu scrolling
          }
          else if (key === "ArrowDown") {
              if (focusedItemIndex < (numberOfItems - 1)) {
                  var nextItem = $__default["default"](event.target).parent().next().find("a");
                  if (nextItem) {
                      nextItem.focus();
                  }
              }
              return false;   // prevent menu scrolling
          }
      }

      /**
       * For the region menu, update the tabindex values for keyboard access.
       */
      updateRegionTabindexes() {
          var regionSelect = $__default["default"](".region-dd");
          var listItems = regionSelect[0].querySelectorAll('.dropdown li a');
          var isOpen = $__default["default"](regionSelect).hasClass(
              'is-active icon-drop-down-active');
          var tabIndexValue = "-1";   // menu closed; disallow focus on items
          if (isOpen) {
              tabIndexValue = "0";   // menu is open; allow focus on items
          }
          listItems.forEach(function (item) {
              item.setAttribute("tabindex", tabIndexValue);
          });
      }

      /**
       * For the state menu, update the tabindex values for keyboard access.
       */
      updateStateTabindexes() {
          var stateSelect = $__default["default"](".state-dd");
          var listItems = stateSelect[0].querySelectorAll(
              '.dropdown[style="display: block;"] li a');
          var isOpen = $__default["default"](stateSelect).hasClass(
              'is-active icon-drop-down-active');
          var tabIndexValue = "-1";   // menu closed; disallow focus on items
          if (isOpen) {
              tabIndexValue = "0";   // menu is open; allow focus on items
          }
          listItems.forEach(function (item) {
              item.setAttribute("tabindex", tabIndexValue);
          });
      }
  }

  var findALocalEvent_component = new FindALocalEvent();

  return findALocalEvent_component;

})($, TNC.Utility);
//# sourceMappingURL=find-a-local-event.component.js.map

this.TNC = this.TNC || {};
this.TNC.ArticleAggregation = (function ($, ReadTime, tncUtility) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var ReadTime__default = /*#__PURE__*/_interopDefaultLegacy(ReadTime);
    var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

    // Article Aggregation component JS goes here
    /** Article Aggregation Class. */
    class ArticleAggregation {
        /**
         * ArticleAggregation constructor
         */
        constructor() {
            this.baseElement = $__default["default"](".c-article-aggregation");

            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            if ($__default["default"](".articleAggregationDetailsStr").length) {
                if (this.baseElement.length) {
                    ReadTime__default["default"].initialize(this.baseElement);
                }

                this.articleAggregationDetailsStr = $__default["default"](".articleAggregationDetailsStr").length ? JSON.parse($__default["default"].trim($__default["default"](".articleAggregationDetailsStr").text())) : '';

                this.loadMoreItems = 16;
                this.requiredArticleDataBackup = null;
                this.requiredArticleData = null;
                this.currentTarget = false;
                this.pageLoad = true;

                this.registerHbsHelper();
                this.pageLoadFiltering();
                this.initializeHandler();
                this.getQueryString();
            }
        }

        registerHbsHelper() {
            Handlebars.registerHelper('article_equals', function (a, b, options) {
                a = Handlebars.Utils.escapeExpression(a);
                b = Handlebars.Utils.escapeExpression(b);

                if (a !== b) {
                    return options.inverse(this);
                }
                return options.fn(this);
            });
            Handlebars.registerHelper('ifPresent', function(v1, v2, options) {
              if(v1 && v2) {
                return options.fn(this);
              }
              return options.inverse(this);
            });
        }

        initializeHandler() {
            /* istanbul ignore next */
            window.addEventListener('popstate', () => {
                this.getQueryString();
            });

            // filter checkbox
            $__default["default"]('.filterChkBox').on('click', (event) => {
                let chkboxId = $__default["default"](event.target).data('chkid'),
                    chkboxState = $__default["default"](event.target).prop('checked');
                $__default["default"]('.filterChkBox').filter(`[data-chkid="${chkboxId}"]`).prop('checked', chkboxState);
            });

            /* istanbul ignore next */
            // filter checkbox label
            $__default["default"]('.checkboxLabel').on('click', (event) => {
                event.preventDefault();
                $__default["default"](event.currentTarget).prev('.filterChkBox').trigger('click');
            });

            $__default["default"](document).on('click', (event) => {
                // Detect a click outside the filter menu (and button).
                if ($__default["default"](event.target).closest(
                        ".c-articleagg-filter").length === 0 &&
                    $__default["default"](event.target).closest(
                        ".c-article-aggregation__filter-button").length === 0) {

                    // If the filter menu is open, close it.
                    if ($__default["default"](".js-filter-toggle").hasClass("is-open")) {
                        toggleFilter(
                            $__default["default"](".c-article-aggregation__filter-button").get(0));
                    }
                }
            });

            // Hide filter menu upon pressing the Escape key.
            $__default["default"](document).on('keydown', (event) => {
                var key = event.key;
                if (key === 'Escape') {
                    // If the filter menu is open, close it.
                    if ($__default["default"](".js-filter-toggle").hasClass("is-open")) {
                        toggleFilter(
                            $__default["default"](".c-article-aggregation__filter-button").get(0));
                        $__default["default"](".c-article-aggregation__filter-button").focus();
                    }
                }
            });

            function isMobile() {
                let isMobile = false;
                if (/Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent) || $__default["default"](window).width() <= 640) {

                    isMobile = true;
                }
                return isMobile;
            }

            function toggleFilter(currentTarget) {
                const closeLabel = $__default["default"](currentTarget).data('closefilter');
                const openLabel = $__default["default"](currentTarget).data('openfilter');
                const $filterButton = $__default["default"](currentTarget);

                $filterButton.toggleClass("is-open");
                const componentId = $__default["default"](currentTarget).data('componentid');
                $__default["default"](`.articleAgg-${componentId}`).find(
                    ".c-articleagg-filter").toggleClass("is-open");

                if ($filterButton.hasClass('is-open')) {
                    // Close the menu.

                    $__default["default"]('.artaggFilterLbl').html(openLabel);
                    $__default["default"]('body').addClass('filters-opened');
                    $__default["default"](".c-articleagg-filter .filter-title").focus();

                    // On mobile devices, disallow scrolling the page while the
                    // filters menu is open.
                    if (isMobile()) {
                        $__default["default"]("body").css("overflow", "hidden");

                        // Also, hide the header, because it tends to overlap
                        // the open filters menu in some cases.
                        $__default["default"](".cd-main-header").hide();
                    }
                }
                else {
                    // Open the menu.

                    $__default["default"]('.artaggFilterLbl').html(closeLabel);
                    $__default["default"]('body').removeClass('filters-opened');

                    // On mobile devices, allow scrolling the page while the
                    // filters menu is closed.
                    if (isMobile()) {
                        $__default["default"]("body").css("overflow", "scroll");

                        // Also, show the header, which is hidden when the
                        // filters menu is open.
                        $__default["default"](".cd-main-header").show();
                    }
                }

                let isExpanded = ($filterButton.attr("aria-expanded") === "true");
                $filterButton.attr("aria-expanded", !isExpanded);
            }

            //toggle filter view
            $__default["default"](".js-filter-toggle").on("click", (event) => {
                event.preventDefault();
                toggleFilter(event.currentTarget);
            });

            // filter menu close button (mobile)
            $__default["default"](".c-article-aggregation__filter-close").on("click", () => {
                toggleFilter($__default["default"](".c-article-aggregation__filter-button").get(0));
            });

            //clear filter btn click
            $__default["default"](".c-articleagg-filter .clearFilter").on("click", (event, historyFlag = true) => {
                this.currentTarget = false;
                event.preventDefault();
                $__default["default"](".filterChkBox").prop("checked", false);

                // update the URL
                if (historyFlag) {
                    let usrFilters = tncUtility__default["default"].updateQueryString("article_filters", '');
                    tncUtility__default["default"].updateURL(usrFilters);
                }

                // close the filter dropdown
                toggleFilter($__default["default"](".c-article-aggregation__filter-button").get(0));
                $__default["default"](".c-article-aggregation__filter-button").focus();

                this.applyFilter();
                this.setFilterAnalytics('');
            });

            // apply filter btn click
            $__default["default"](".c-articleagg-filter .applyFilter").on("click", () => {
                this.currentTarget = false;

                // update the URL
                let filtersAdded = this.getAllFilterChkBox();
                let usrFilters = tncUtility__default["default"].updateQueryString("article_filters", filtersAdded.join(','));
                tncUtility__default["default"].updateURL(usrFilters);

                // close the filter dropdown
                toggleFilter($__default["default"](".c-article-aggregation__filter-button").get(0));
                $__default["default"](".c-article-aggregation__filter-button").focus();

                this.applyFilter();
            });

            // search form submit
            $__default["default"]('.siteSearch').on('submit', (event) => {
                event.preventDefault();
                $__default["default"]('.usrSearchSubmit').trigger('click');
            });

            // search icon click
            $__default["default"](".usrSearchSubmit").on("click", (event, historyFlag = true) => {
                event.preventDefault();
                this.currentTarget = true;
                let inpVal = $__default["default"].trim($__default["default"](".usrInput").val());
                $__default["default"]('.clearSearch').hide();
                $__default["default"]('.usrSearchSubmit').show();
                if (inpVal) {
                    $__default["default"]('.clearSearch').show();
                    $__default["default"]('.usrSearchSubmit').hide();
                }
                // update the URL
                /* istanbul ignore else */
                if (historyFlag) {
                    let srchWord = tncUtility__default["default"].updateQueryString("article_q", inpVal);
                    tncUtility__default["default"].updateURL(srchWord);
                }
                this.applyFilter();
                $__default["default"]('.searchBox').focus();
            });

            // user input
            $__default["default"]('.usrInput').on('input', () => {
                $__default["default"]('.clearSearch').hide();
                $__default["default"](".usrSearchSubmit").show();
            });

            // clear text
            $__default["default"]('.clearSearch').on('click', (event, historyFlag = true) => {
                this.currentTarget = false;
                $__default["default"]('.usrInput').val('');
                $__default["default"](event.target).hide();
                $__default["default"](".usrSearchSubmit").show();

                // update the URL
                if (historyFlag) {
                    let srchWord = tncUtility__default["default"].updateQueryString("article_q",
                        $__default["default"].trim($__default["default"](".usrInput").val()));
                    tncUtility__default["default"].updateURL(srchWord);
                }

                this.applyFilter(false);
                $__default["default"]('.searchBox').focus();
            });

            // sort by dropdown items
            $__default["default"]('.sortAggDropdown a').on('click', (event) => {
                event.preventDefault();
                this.currentTarget = false;
                const componentId = $__default["default"](event.target).data('componentid');
                const sortValue = $__default["default"](event.target).data('value');
                const sortLabel = $__default["default"](event.target).text();

                $__default["default"](`.selectedSort-${componentId}`).data('value', sortValue).html(sortLabel);
                $__default["default"]('.article-agg-sort-by').trigger('click');
                // update the url
                let sortOrder = tncUtility__default["default"].updateQueryString("article_sortOrder", sortValue);
                tncUtility__default["default"].updateURL(sortOrder);

                // maintain sort in medium view (tab portrait)
                $__default["default"]('.mobileSort').removeClass('mobileSelectedSort border-secondary');
                $__default["default"](`.mobileSort[data-value="${sortValue}"]`).addClass('mobileSelectedSort border-secondary');

                this.applyFilter();
            });

            // Handle a change in the Sort By menu
            $__default["default"]('#sort-agg-dd').off('changed.bs.select').on('changed.bs.select', (event) => {
                const sortValue = $__default["default"](event.target).val();

                let sortOrder = tncUtility__default["default"].updateQueryString("article_sortOrder", sortValue);
                tncUtility__default["default"].updateURL(sortOrder);

                // maintain sort in medium view (tab portrait)
                $__default["default"]('.mobileSort').removeClass('mobileSelectedSort border-secondary');
                $__default["default"](`.mobileSort[data-value="${sortValue}"]`).addClass('mobileSelectedSort border-secondary');

                this.applyFilter();
            });

            // Show the Sort By menu.
            $__default["default"]('#sort-agg-dd').off('show.bs.select').on('show.bs.select', () => {
                // If the filter menu is open, close it.
                if ($__default["default"](".js-filter-toggle").hasClass('is-open')) {
                    toggleFilter(
                        $__default["default"](".c-article-aggregation__filter-button").get(0));
                }
            });

            // Set keyboard handlers for the sort-by menu and its menu items.
            //
            // Use the ‘loaded’ event from the control being used: bootstrap-select
            // https://developer.snapappointments.com/bootstrap-select/methods/
            $__default["default"]("#sort-agg-dd").on("loaded.bs.select", () => {
                $__default["default"](".btnsort-btn").on("keydown", this.sortByKeyPress);
            });

            // Use the ‘shown’ and ‘hidden’ events from bootstrap-select.
            $__default["default"]("#sort-agg-dd").on("shown.bs.select", () => {
                // Set a handler on the menu items to handle the space key
                // when the menu is open.
                $__default["default"](".c-search-filter-sort__col-filter-sort").on("keydown.sortBy",
                    "div.dropdown-menu div.inner", this.sortByMenuItemKeyPress);
            });
            $__default["default"]("#sort-agg-dd").on("hidden.bs.select", () => {
                // Remove the menu item handler when the menu is closed.
                $__default["default"](".c-search-filter-sort__col-filter-sort").off("keydown.sortBy",
                    "div.dropdown-menu div.inner");
            });

            // load more
            $__default["default"]('.moreArticle').on('click', (event) => {
                event.preventDefault();

                let visibleArticles = $__default["default"]('.c-cards-articles__card:visible');
                let initiallyVisible = visibleArticles.length;

                let $moreItems = $__default["default"]('.resultsContainer').children('.hideContent');
                if ($moreItems.length && $moreItems.length >= this.loadMoreItems) {
                    $moreItems.slice(0, this.loadMoreItems - 1).removeClass('hideContent');
                    if ($moreItems.length === this.loadMoreItems) {
                        $__default["default"]('.articleAggLoadMore').addClass('hideContent');
                    }
                } else {
                    $moreItems.removeClass('hideContent');
                    $__default["default"]('.articleAggLoadMore').addClass('hideContent');
                }

                // Now that more articles are loaded, get the full list again.
                visibleArticles = $__default["default"]('.c-cards-articles__card:visible');

                // The first new article's index is one more than the last index
                // of the articles that were initially visible.
                let nowVisibleFirstIndex = (initiallyVisible - 1) + 1;
                let firstNewArticle = visibleArticles.get(nowVisibleFirstIndex);
                if (firstNewArticle) {
                    firstNewArticle.scrollIntoView;
                    firstNewArticle.focus();
                }
            });

            // no result clear btn
            $__default["default"]('.article-clear-btn').on('click', (event) => {
                event.preventDefault();
                $__default["default"]('.clearSearch').trigger('click', [false]);
                $__default["default"]('.clearFilter').trigger('click', [false]);
                // clear sort
                // maintain sort in large view (tab landscape)
                let componentId = $__default["default"](event.target).data('componentid');
                let getDefaultValue = $__default["default"](`.selectedSort-${componentId}`).data('defaultValue');
                let getDefaultLabel = $__default["default"](`.selectedSort-${componentId}`).data('defaultDisplayLabel');
                $__default["default"](`.selectedSort-${componentId}`).html(getDefaultLabel);

                // maintain sort in medium view (tab portrait)
                $__default["default"]('.mobileSort').removeClass('mobileSelectedSort border-secondary');
                $__default["default"](`.mobileSort[data-value="${getDefaultValue}"]`).addClass('mobileSelectedSort border-secondary');

                let usrFilters = tncUtility__default["default"].updateQueryString("article_filters", '');
                let srchWord = tncUtility__default["default"].updateQueryString("article_q", $__default["default"].trim($__default["default"](".usrInput").val()), usrFilters);
                let sort = tncUtility__default["default"].updateQueryString("article_sortOrder", '', srchWord);
                tncUtility__default["default"].updateURL(sort);
            });
        }

        sortByKeyPress(event) {
            var key = event.key;

            if (key === " " || key === "Enter") {   // Space key or Enter key
                event.preventDefault();   // Prevent scrolling the page.

                // Open the sort-by menu.
                $__default["default"]("#sort-agg-dd").selectpicker("toggle");

                // Set initial focus on the currently-selected menu item.
                let selectedItem = $__default["default"](
                    ".selectedSort-aggregation_article_aggregation " +
                    ".dropdown-menu li.selected");
                selectedItem.focus();
            }
        }

        sortByMenuItemKeyPress(event) {
            var key = event.key;

            if (key === " ") {   // Space key
                event.preventDefault();   // Prevent scrolling the page.

                // Determine the just-selected menu item.
                var newSelection = $__default["default"](
                    ".selectedSort-aggregation_article_aggregation " +
                    ".dropdown-menu li.active a");

                // Select the item and close the menu.
                var e = $__default["default"].Event("keydown");
                e.which = 13;   // Enter key
                newSelection.trigger(e);
            }
        }

        pageLoadFiltering() {
            this.requiredArticleDataBackup = this.articleAggregationDetailsStr;

            //reset the un necessary vars
            delete this.articleAggregationDetailsStr;

            $__default["default"](".hiddenVars").remove();
        }

        /**
         * getQueryString function:- get the search param from url when coming from other page
         */
        getQueryString() {
            const searchWord = tncUtility__default["default"].getParameterByName("article_q"),
                filters = tncUtility__default["default"].getParameterByName("article_filters");

            // update the search keyword in the search box from url
            $__default["default"](".usrInput").val(searchWord);

            $__default["default"](`.filterChkBox`).prop("checked", false);
            // update the search filters in the filter dropdown from url
            /* istanbul ignore if */
            if (filters) {
                filters.split(',').forEach((val) => {
                    $__default["default"](`.filterChkBox[value='${val}']`).prop("checked", true);
                });
            }

            let sortOrder = tncUtility__default["default"].getParameterByName("article_sortOrder");
            let sortLabel = '';
            if (!sortOrder) {
                sortOrder = $__default["default"]('.articleAgg').find('.selectedSort').data('defaultValue');
                $__default["default"]('#sort-agg-dd').selectpicker('val', sortOrder);
            } else {
                sortLabel = $__default["default"]('#sort-agg-dd').val();
            }

            $__default["default"]('.selectedSort').html(sortLabel);

            this.applyFilter();
        }

        getAllFilterChkBox() {
            let appliedFilter = [];
            let $selector = $__default["default"]('.c-articleagg-filter');
            $selector.find(".filterChkBox:checked").each((index, ele) => {
                appliedFilter.push(ele.value);
            });
            return appliedFilter;
        }

        applyFilter(clearTxtFlag = true) {
            // reset the article data from requiredArticleDataBackup
            this.requiredArticleData = JSON.parse(JSON.stringify(this.requiredArticleDataBackup));

            /* istanbul ignore if */
            if (!this.requiredArticleData.length) {
                // no data available
                this.renderArticleCards();
                return;
            }

            // get the filter
            let appliedFilter = this.getAllFilterChkBox();

            // get the search word
            const usrInput = $__default["default"].trim($__default["default"](".usrInput").val());

            // filter
            this.requiredArticleData = this.requiredArticleData.filter((articleCard) => {

                let dataFlag = false;

                // filter topics (appliedFilter dd)
                /* istanbul ignore if */
                if (appliedFilter.length) {
                    if (!articleCard.topicTag) {
                        return false;
                    }
                    dataFlag = articleCard.topicTag.some((cardTopic) => appliedFilter.find((topic) => topic === cardTopic));
                    if (!dataFlag) {
                        // no result found
                        return false;
                    }
                }

                // filter with search word
                if (usrInput) {
                    // search the user input word in the results cards
                    const regex = new RegExp(usrInput, 'gi');
                    // const regexHypened = new RegExp(usrInputHypened, 'gi');

                    // search in title / description / contentTypeTag
                    if (regex.test(articleCard.title) ||
                        regex.test(articleCard.description) ||
                        regex.test(articleCard.contentTypeTag)) {
                        return true;
                    }

                    // search in topic
                    if (articleCard.topicTag) {
                        dataFlag = articleCard.topicTag.some((cardTopic) => regex.test(cardTopic));
                        if (dataFlag) {
                            return true;
                        }
                    }

                    // search in articleAuthor
                    if (articleCard.articleAuthor) {
                        dataFlag = articleCard.articleAuthor.some((cardAuthor) => regex.test(cardAuthor));
                        if (dataFlag) {
                            return true;
                        }
                    }

                    // search in placesWeProtectTag
                    if (articleCard.placesWeProtectTag) {
                        dataFlag = articleCard.placesWeProtectTag.some((cardPlaces) => regex.test(cardPlaces));
                        if (dataFlag) {
                            return true;
                        }
                    }

                    // search in geoLocationTag
                    if (articleCard.geoLocationTag) {
                        dataFlag = articleCard.geoLocationTag.some((cardLocation) => regex.test(cardLocation));
                        if (dataFlag) {
                            return true;
                        }
                    }

                    // search in businesstags
                    if (articleCard.businesstags) {
                        dataFlag = articleCard.businesstags.some((cardBusiness) => regex.test(cardBusiness));
                        if (dataFlag) {
                            return true;
                        }
                    }

                    return dataFlag;
                } else {
                    return true;
                }
            });

            let sortOrder = $__default["default"]('#sort-agg-dd').val();

            // as per story newest is the default sort order
            if (sortOrder && sortOrder.toLowerCase() !== "newest") {
                this.requiredArticleData = this.requiredArticleData.reverse();
            }

            if (clearTxtFlag) {
                if (usrInput && this.currentTarget) {
                    this.setSearchAnalytics(usrInput, this.requiredArticleData.length);
                } else {
                    if (!this.pageLoad && this.currentTarget) {
                        this.setSearchAnalytics('undefined', this.requiredArticleData.length);
                    }
                }
            }

            if (appliedFilter.length) {
                let filterValues = (appliedFilter.join(',')).toString();
                this.setFilterAnalytics(filterValues);
            }

            // render result
            this.renderArticleCards();
            this.pageLoad = false;
        }

        handlebarCardsTemplate() {
            return `<h2 class="visually-hidden">Results</h2>
            {{#each this}}
            <div class="bs_col-12 bs_col-md-6 bs_col-sm-6 bs_col-lg-4 bs_d-flex bs_align-items-stretch">
                <a href="{{this.link}}" target="{{this.target}}" class="c-cards-articles__card tertiary-link-v1 txt-clr-g1">
                    <div class="c-cards-articles__card-container border-primary">
                    {{#if this.pageImage.default}}
                        <picture>
                        <source srcset="{{this.pageImage.large}} 1x, {{this.pageImage.large2x}} 2x" media="(min-width: 1280px)">
                        <source srcset="{{this.pageImage.medium}} 1x, {{this.pageImage.medium2x}} 2x" media="(min-width: 768px)">
                        <source srcset="{{this.pageImage.small}} 1x, {{this.pageImage.small2x}} 2x" media="(min-width: 0)">

                        <img class="c-cards-articles__image image-position-desktop__{{this.desktopImageCrop}} image-position-mobile__{{this.mobileImageCrop}}" src="{{this.pageImage.default}}" alt="{{this.pageImageAlt}}"/>
                        </picture>
                    {{else}}
                        <img class="c-cards-articles__image image-position-desktop__{{this.desktopImageCrop}} image-position-mobile__{{this.mobileImageCrop}}" src="{{this.pageImage}}" alt="{{this.pageImageAlt}}"/>
                    {{/if}}

                    <div class="c-cards-articles__content">
                        <h3 class="fz-v12 lh-v15 c-cards-articles__title family-serif">
                        {{this.title}}
                        </h3>

                        <p class="family-sans fz-v7 lh-v9 c-cards-articles__excerpt txt-clr-g2">
                        {{this.description}}
                        </p>
                        {{#article_equals ../hide-article-author-and-date "no"}}
                            <p class="family-sans fw-v4 fz-v4 lh-v2 c-cards-articles__byline txt-clr-g2">
                            {{#if this.articleAuthor.[0]}}By {{ this.articleAuthor.[0] }} {{/if}}
                            {{#if this.hideArticleDate.[0]}}
                              {{else}}
                              {{#ifPresent this.articleAuthor.[0] this.articleDate}} | {{/ifPresent}} {{this.articleDate}}
                            {{/if}}
                            </p>
                        {{/article_equals}}
                        {{#if this.readTimeMinutes}}
                            <p class="c-cards-articles__read-time family-sans
                                fz-v4 lh-v2 txt-clr-g2"><span
                                class="js-read-time"
                                data-minutes="{{this.readTimeMinutes}}"></span>
                            </p>
                        {{/if}}
                    </div>
                    </div>
                </a>
            </div>
            {{/each}}`;
        }

        renderArticleCards(cards = this.requiredArticleData) {
            $__default["default"]('.articleAggLoadMore').addClass('hideContent');
            if (cards.length) {
                cards["hide-article-author-and-date"] = $__default["default"]('.articleAgg').data('hideArticleAuthorAndDate');
                const template = Handlebars.compile(this.handlebarCardsTemplate()),
                    cardsHtml = template(cards);

                $__default["default"]('.resultsContainer').html(cardsHtml);
                $__default["default"]('.dataResultContainer').removeClass('hideContent');
                $__default["default"]('.resultContainerId-noResult').addClass('hideContent');

                let cardsToShow = $__default["default"]('.resultsContainer').children();
                cardsToShow.slice(this.loadMoreItems).addClass('hideContent');

                // load more btn show/hide
                if (cards.length > this.loadMoreItems) {
                    $__default["default"]('.articleAggLoadMore').removeClass('hideContent');
                }
            } else {
                $__default["default"]('.dataResultContainer').addClass('hideContent');
                $__default["default"]('.resultContainerId-noResult').removeClass('hideContent');
            }

            // Add any estimated read times to the rendered cards.
            if (this.baseElement.length) {
                ReadTime__default["default"].showReadTime();
            }
        }

        /**
         * Search Analytics Function
         */

        setSearchAnalytics(key, results) {
            let aggregationTags = {
                'event_name': 'asset_search',
                'event_action': key,
                'event_category': results,
                'search_term': key,
                'search_type': 'article',
                'num_search_results': results
            };

            tncUtility__default["default"].setAnalyticsByPage(aggregationTags, true);
        }

        /**
         * Filter Analytics Function
         */

        setFilterAnalytics(/* values */) {
            /* let aggregationTags = {
                'event_name': 'filter_applied',
                'event_action': values,
                'filter_type': 'aggregation : article'
            };

            tncUtility.setAnalyticsByPage(aggregationTags, true); */
        }
    }

    var articleAggregation_component = new ArticleAggregation();

    return articleAggregation_component;

})($, TNC.ReadTime, TNC.Utility);
//# sourceMappingURL=article-aggregation.component.js.map

this.TNC = this.TNC || {};
this.TNC.PressReleaseAggregation = (function ($, search, tncUtility) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var search__default = /*#__PURE__*/_interopDefaultLegacy(search);
  var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

  // Press Release Aggregation component JS goes here
  /** Press Release Aggregation Class. */
  class PressReleaseAggregation {
    /**
     * Press Release Component Constructor
     */
    constructor() {
      if (!$__default["default"]('.pressreleasedatastr').length) {
        return;
      }
      this.initialize();
    }
    /**
     * Initialization function
     */
    initialize() {
      this.pressCardsData = JSON.parse($__default["default"]('.pressreleasedatastr').text());
      this.loadMoreItems = 9;
      this.$filterPopup = $__default["default"]('.c-cards-press-release-filter-popup');
      this.hideLabel = $__default["default"]('.filter-btn').attr('data-hideFilter');
      this.showLabel = $__default["default"]('.filter-btn').attr('data-showFilter');

      this.lastUpdatedLabel = $__default["default"]('#lastUpdatedLabel').attr('data-value');

      this.currentTargetAnalytics = false;
      this.config = {
        property: ["title", "description", "location", "topicTag", "geoLocationTag"],
        value: "",
        filter: false,
        filterProperty: "topicTag",
        filterValue: []
      };

      this.eventHandler();
      this.renderPressReleaseCards();
      const $pressReleaseContainer = $__default["default"]('.c-cards-press-release-container');
      $pressReleaseContainer.find('#press-filter-toggle').on('click', this.activateFilterDropdown.bind(this));
      $pressReleaseContainer.find('.filter-icon-mobile').on('click', this.activateFilterPopup.bind(this));
      this.getQueryString();
    }

    eventHandler() {
      window.addEventListener('popstate', () => {
        this.getQueryString();
      });
      /**
       * Search form submit
       */
      $__default["default"]('.pressSearch').on('submit', (event) => {
        event.preventDefault();
        // toggle close icon
        $__default["default"]('.search-toggle').addClass('hide-content');
        $__default["default"]('.close-toggle').removeClass('hide-content');
        $__default["default"]('.search-toggle').trigger('click');
      });
      /**
       * Serch Icon click
       */
      $__default["default"]('.search-toggle').on('click', (event, historyFlag = true) => {
        event.preventDefault();
        // Show Close icon
        $__default["default"]('.search-toggle').addClass('hide-content');
        $__default["default"]('.close-toggle').removeClass('hide-content');
        // update the URL
        if (historyFlag) {
          let srchWord = tncUtility__default["default"].updateQueryString('press_q', $__default["default"].trim($__default["default"]('.usrInput').val()));
          tncUtility__default["default"].updateURL(srchWord);
        }

        this.searchKey = $__default["default"]('.usrInput').val();
        if (!this.searchKey) {
          this.config.emptyVal = 'undefined';
        }
        this.currentTargetAnalytics = true;
        this.callSearchFunction();
      });

      /**
       * Search Input
       */
      $__default["default"]('.press-search').on('input', () => {
        $__default["default"]('.close-toggle').addClass('hide-content');
        $__default["default"]('.search-toggle').removeClass('hide-content');
      });

      /**
       * Search Clear button click
       */
      $__default["default"]('.close-toggle').on('click', (event, historyFlag = true) => {
        event.preventDefault();
        // update the URL
        if (historyFlag) {
          let usrFilters = tncUtility__default["default"].updateQueryString('press_q', '');
          tncUtility__default["default"].updateURL(usrFilters);
        }

        $__default["default"]('.c-field__input').val('');
        $__default["default"]('.search-toggle').trigger('click');
        // Hide the close icon
        $__default["default"]('.close-toggle').addClass('hide-content');
        $__default["default"]('.search-toggle').removeClass('hide-content');
        this.config.value = '';
        this.currentTargetAnalytics = false;
        this.callSearchFunction();
      });

      /**
       * Fliter apply click
       */
      $__default["default"]('.filter-apply-btn').on('click', () => {
        this.currentTargetAnalytics = false;
        this.applyFilters();
        $__default["default"]('#press-filter-toggle').trigger('click');
      });

      /**
       * Filter Clear button click
       */
      $__default["default"]('.filter-clear-btn').on('click', (event, historyFlag = true) => {
        event.preventDefault();
        $__default["default"]('.filter-chkbox').prop('checked', false);
        // update the URL
        if (historyFlag) {
          let usrFilters = tncUtility__default["default"].updateQueryString('press_filters', '');
          tncUtility__default["default"].updateURL(usrFilters);
        }
        this.config.filter = false;
        this.currentTargetAnalytics = false;
        this.applyFilters();
        // close the filter dropdown
        $__default["default"]('#press-filter-toggle').trigger('click');
      });

      /**
       * Sort button click
       */
      $__default["default"]('#sort-dd').on('show.bs.select', () => {
        $__default["default"]('.c-press-release-filter').removeClass('is-open');
        $__default["default"]('.press-filter-label').text(this.showLabel);
        $__default["default"]('.filter-btn').find('.toggle--arrow').removeClass('menu-active');
        $__default["default"]('body').removeClass('filters-opened');
      });

      /**
       * Sort value changed
       */
      $__default["default"]('.selectpicker').on('change', (event, historyFlag = true) => {
        this.order = $__default["default"](event.target).val();
        // update the URL
        if (historyFlag) {
          let sortOrder = tncUtility__default["default"].updateQueryString('press_sortOrder', this.order);
          tncUtility__default["default"].updateURL(sortOrder);
        }
        this.currentTargetAnalytics = false;
        this.callSearchFunction();
        // handle mobile sort
        $__default["default"]('.popup-sort-btn').removeClass('popup-sort-selected border-secondary');
        $__default["default"](`.popup-sort-btn[data-value="${this.order}"]`).addClass('popup-sort-selected border-secondary');
      });

      /**
       * Load More button click
       */
      $__default["default"]('.press-load-more').on('click', (event) => {
        event.preventDefault();

        let $moreItems = $__default["default"]('.cards-container').children('.hide-content');

        if ($moreItems.length && $moreItems.length >= this.loadMoreItems) {
          $moreItems.slice(0, this.loadMoreItems).removeClass('hide-content');
          if ($moreItems.length === this.loadMoreItems) {
            $__default["default"]('.press-load-more').addClass('hide-content');
          }
        } else {
          $moreItems.removeClass('hide-content');
          $__default["default"]('.press-load-more').addClass('hide-content');
        }
      });

      /**
      * Clear all click
      */
      $__default["default"]('.press-clear-btn').on('click', () => {
        $__default["default"]('.close-toggle').trigger('click');
        $__default["default"]('.filter-clear-btn').trigger('click');
      });

      /**
       * Popup close click
       */
      this.$filterPopup.find('.popup-close').on('click', () => {
        this.$filterPopup.hide();
        $__default["default"]('body').removeClass('bodyOverflowHidden');
        $__default["default"]('.cards-container').removeClass('hide-content');
      });

      /**
       * Popup apply filter click
       */
      this.$filterPopup.find('.popup-apply-btn').on('click', () => {
        this.$filterPopup.hide();
        $__default["default"]('body').removeClass('bodyOverflowHidden');
        this.currentTargetAnalytics = false;
        this.applyFilters();
        $__default["default"]('.cards-container').removeClass('hide-content');

      });

      /**
       * Popup clear filter click
       */
      this.$filterPopup.find('.popup-clear-btn').on('click', (event, historyFlag = true) => {
        event.preventDefault();
        this.$filterPopup.hide();
        $__default["default"]('body').removeClass('bodyOverflowHidden');
        $__default["default"]('.filter-chkbox').prop('checked', false);
        // update the URL
        if (historyFlag) {
          let usrFilters = tncUtility__default["default"].updateQueryString('press_filters', '');
          tncUtility__default["default"].updateURL(usrFilters);
        }
        this.config.filter = false;
        this.currentTargetAnalytics = false;
        this.applyFilters();
        $__default["default"]('.cards-container').removeClass('hide-content');
      });

      // filter checkbox click
      $__default["default"]('body').on('click', '.filter-chkbox', (event) => {
        let value = $__default["default"](event.target).val(),
          chkboxState = $__default["default"](event.target).prop('checked');

        $__default["default"](`.filter-chkbox[value="${value}"]`).prop('checked', chkboxState);
      });
      /**
       * Popup sort button click
       */
      this.$filterPopup.find('.popup-sort-btn').on('click', (event, historyFlag = true) => {
        event.preventDefault();
        this.$filterPopup.hide();
        $__default["default"]('body').removeClass('bodyOverflowHidden');
        this.order = $__default["default"](event.target).attr('data-value');

        $__default["default"]('.popup-sort-btn').removeClass('popup-sort-selected border-secondary');
        $__default["default"](event.target).addClass('popup-sort-selected border-secondary');
        // handle desktop sort
        $__default["default"]('.pressAggregation').find('select.selectpicker').val(this.order);
        $__default["default"]('.pressAggregation').find('select.selectpicker').selectpicker('render');

        // update the url
        if (historyFlag) {
          let sortOrder = tncUtility__default["default"].updateQueryString('press_sortOrder', this.order);
          tncUtility__default["default"].updateURL(sortOrder);
        }
        this.currentTargetAnalytics = false;
        this.callSearchFunction();
        $__default["default"]('.cards-container').removeClass('hide-content');
      });

      $__default["default"](document).on('click', (event) => {

        if ($__default["default"](event.target).closest('.sort-btn').length === 0) {
          $__default["default"]('.pressAggDropdown').addClass('hide-content');
          $__default["default"]('.sort-btn').find('.sort-toggle--arrow').removeClass('menu-active');
        }

        if ($__default["default"](event.target).closest('.c-press-release-filter').length === 0) {
          if ($__default["default"]('.c-press-release-filter').hasClass('is-open')) {
            $__default["default"]('#press-filter-toggle').trigger('click');
          }
          $__default["default"]('.c-press-release-filter').removeClass('is-open');
          $__default["default"]('body').removeClass('filters-opened');
        }
      });
    }

    /**
     * Apply Filters function
     */
    applyFilters(flag = false, historyFlag = true) {
      // event.preventDefault();
      let usrFilters = null;
      this.appliedFilter = this.getAllFilterChkBox();
      if (!flag && historyFlag) {
        usrFilters = tncUtility__default["default"].updateQueryString('press_filters', this.appliedFilter.join(','));
        tncUtility__default["default"].updateURL(usrFilters);
      }
      this.config.filterValue = this.appliedFilter;
      this.currentTargetAnalytics = false;
      this.callSearchFunction();

    }

    /**
     * Get Filter Checked function
     */
    getAllFilterChkBox() {
      this.appliedFilter = [];
      $__default["default"]('.filter-chkbox:checked').not('.popup-chkbox').each((index, ele) => {
        this.appliedFilter.push(ele.value);
      });
      return this.appliedFilter;
    }

    /**
     * Activate Filter Popup function
     */
    activateFilterPopup() {
      this.$filterPopup.show();
      $__default["default"]('body').addClass('bodyOverflowHidden');
      $__default["default"]('.cards-container').addClass('hide-content');
    }

    /**
     * Activate Filter Dropdown function
     */
    activateFilterDropdown(event) {
      if ($__default["default"]('.selectpicker').closest('.dropdown').hasClass('show')) {
        $__default["default"]('.selectpicker').selectpicker('toggle');
      }

      // $('.press-sort-dd').addClass('hide-content');
      // $('.sort-btn').find('.sort-toggle--arrow').removeClass('menu-active');
      $__default["default"]('.c-press-release-filter').toggleClass('is-open');
      if ($__default["default"]('.c-press-release-filter').hasClass('is-open')) {
        $__default["default"]('.press-filter-label').text(this.hideLabel);
        $__default["default"]('.filter-btn').find('.toggle--arrow').addClass('menu-active');
        $__default["default"]('body').addClass('filters-opened');
      }
      else {
        $__default["default"]('.press-filter-label').text(this.showLabel);
        $__default["default"]('.filter-btn').find('.toggle--arrow').removeClass('menu-active');
        $__default["default"]('body').removeClass('filters-opened');
      }
      $__default["default"]('.list-item').removeClass('is-active');
      event.preventDefault();
      event.stopPropagation();
    }

    /**
     * Search API call function
     */
    callSearchFunction() {
      if (this.searchKey) {
        this.config.value = this.searchKey;
      }
      else {
        this.config.value = '';
      }
      if (this.appliedFilter && this.appliedFilter.length) {
        this.config.filter = true;
        this.config.filterValue = this.appliedFilter;
      }
      else {
        this.config.filter = false;
        this.config.filterValue = '';
      }

      this.config.currentTargetAnalytics = this.currentTargetAnalytics;
      let results = search__default["default"].find(this.pressCardsData, this.config);
      if (results && results.length) {
        this.renderPressReleaseCards(results);
      }
      else {
        $__default["default"]('.cards-container').addClass('hide-content');
        $__default["default"]('.press-load-more').addClass('hide-content');
        $__default["default"]('.resultContainerId-noResult').removeClass('hide-content');
      }
    }

    /**
     * getQueryString function:- get the search param from url when coming from other page
     */
    getQueryString() {
      this.searchKey = tncUtility__default["default"].getParameterByName('press_q'),
        this.checkedFilter = tncUtility__default["default"].getParameterByName('press_filters');

      // update the search keyword in the search box from url
      $__default["default"]('.usrInput').val(this.searchKey);
      if (this.searchKey) {
        $__default["default"]('.search-toggle').addClass('hide-content');
        $__default["default"]('.close-toggle').removeClass('hide-content');
      }
      else {
        $__default["default"]('.search-toggle').removeClass('hide-content');
        $__default["default"]('.close-toggle').addClass('hide-content');
      }

      // update the search filters in the filter dropdown from url
      this.appliedFilter = [];
      if (this.checkedFilter) {
        $__default["default"]('.filter-chkbox').prop('checked', false);
        this.checkedFilter.split(',').forEach((val) => {
          $__default["default"](`.filter-chkbox[value='${val}']`).prop('checked', true);
          this.appliedFilter.push(val);
        });
      }
      else {
        $__default["default"]('.filter-chkbox').prop('checked', false);
        this.appliedFilter.push();
      }

      this.order = tncUtility__default["default"].getParameterByName('press_sortOrder');
      if (this.order) {

        $__default["default"]('.pressAggregation').find('select.selectpicker').val(this.order);
        $__default["default"]('.pressAggregation').find('select.selectpicker').selectpicker('render');

        this.$filterPopup.find('.popup-sort-btn').removeClass('popup-sort-selected border-secondary');
        this.$filterPopup.find(`.popup-sort-btn[data-value="${this.order}"]`).addClass('popup-sort-selected border-secondary');
      }
      else {
        $__default["default"]('.pressAggregation').find('select.selectpicker').val(this.order);
        $__default["default"]('.pressAggregation').find('select.selectpicker').selectpicker('render');
        this.$filterPopup.find(`.popup-sort-btn`).removeClass('popup-sort-selected border-secondary');
        this.$filterPopup.find('.popup-sort-newest').addClass('popup-sort-selected border-secondary');
      }

      this.callSearchFunction();
    }


    /**
     *  Press Release Card Template
     */
    pressReleaseCardsTemplate() {
      return `{{#each this}}
    <div class="bs_col-12 bs_col-md-4 bs_col-sm-6 bs_d-flex bs_align-items-stretch">
      <a href="{{this.link}}" class="c-cards-press-release__card tertiary-link-v1 txt-clr-g1">
        <div class="c-cards-press-release__card-container border-primary">
          <picture>
            <source srcset="{{this.pageImage.large}} 1x, {{this.pageImage.large2x}} 2x" media="(min-width: 1280px)">
            <source srcset="{{this.pageImage.medium}} 1x, {{this.pageImage.medium2x}} 2x" media="(min-width: 768px)">
            <source srcset="{{this.pageImage.small}} 1x, {{this.pageImage.small2x}} 2x" media="(min-width: 0)">
            <img class="c-cards-press-release__image image-position-desktop__{{this.deskTopImageCrop}} image-position-mobile__{{this.mobileImageCrop}}" src="{{this.pageImage.default}}" alt="{{this.pageImageAlt}}"/>
          </picture>
          <div class="c-cards-press-release__content">
            <h4 class="fz-v12 lh-v15 c-cards-press-release__title">{{this.title}}</h4>
            <p class="family-sans fz-v7 lh-v9 c-cards-press-release__excerpt txt-clr-g2">{{this.description}}</p>
            <p class="family-sans fw-v4 fz-v4 lh-v2 c-cards-press-release__byline txt-clr-g2">{{this.location}}{{#if this.location}}{{#if this.pressRealeaseDate}} |{{/if}}{{/if}}{{#if this.lastUpdated}} `+ this.lastUpdatedLabel + ` {{this.lastUpdated}} {{else}} {{this.pressRealeaseDate}}{{/if}}</p>
          </div>
        </div>
      </a>
      </div>
    {{/each}}`;
    }

    /**
     * * renderPressReleaseCards function
     * It renders the press release aggregation cards on page load
     * */
    renderPressReleaseCards(cards = this.pressCardsData) {
      $__default["default"]('.cards-container').removeClass('hide-content');
      $__default["default"]('.press-load-more').addClass('hide-content');
      if (cards && cards.length) {
        if (this.order === 'OLDEST') {
          cards = cards.reverse();
        }
        const template = Handlebars.compile(this.pressReleaseCardsTemplate()),
          cardsHtml = template(cards);

        $__default["default"]('.cards-container').html(cardsHtml);
        $__default["default"]('.resultContainerId-noResult').addClass('hide-content');
        $__default["default"]('.cards-container').removeClass('hide-content');
      }
      else {
        $__default["default"]('.cards-container').addClass('hide-content');
        $__default["default"]('.press-load-more').addClass('hide-content');
        $__default["default"]('.resultContainerId-noResult').removeClass('hide-content');
      }
      let cardsToShow = $__default["default"]('.cards-container').children();
      cardsToShow.slice(this.loadMoreItems).addClass('hide-content');

      // load more btn show/hide
      if (cards && cards.length > this.loadMoreItems) {
        $__default["default"]('.press-load-more').removeClass('hide-content');
      }
    }
  }

  var pressReleaseAggregation_component = new PressReleaseAggregation();

  return pressReleaseAggregation_component;

})($, TNC.SEARCH, TNC.Utility);
//# sourceMappingURL=press-release-aggregation.component.js.map

this.TNC = this.TNC || {};
this.TNC.SearchResults = (function ($, xhrModule, tncUtility) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var xhrModule__default = /*#__PURE__*/_interopDefaultLegacy(xhrModule);
  var tncUtility__default = /*#__PURE__*/_interopDefaultLegacy(tncUtility);

  // Search Results component JS goes here

  class SearchResults {
    /**
     * SearchResults constructor
     */
    constructor() {

      Handlebars.registerHelper("log", function(data){
       console.log(data);
      });
      if (!$__default["default"]('.c-search-results-list__container').length) {
        return;
      }
      this.searchPageMainContainer = $__default["default"]('.c-search-results-list__container');
      this.$searchForm = $__default["default"]('.siteSearch');
      this.$searchBox = $__default["default"]('.searchBox');
      this.$facetsPanelDesktop = $__default["default"]('.facetsPanel');
      this.$facetsPanelMobile = $__default["default"]('.mobileFacetsPanel');
      this.$searchIcon = $__default["default"]('.searchIconBtn');
      this.$clearBtn = $__default["default"](".c-search-results__filter-clear, .mobileFacetsPanel .clearFilter");
      this.$facetApplyBtn = $__default["default"](".c-search-results__filter-apply, .mobileFacetsPanel .applyFilter");
      this.$filterChkBox = $__default["default"]('.custom_check_box');
      this.$facetsToggler = $__default["default"]('.toggler');
      this.$srchResPanel = $__default["default"]('.searchResultPanel ul.c-search-results');
      this.pagingConatiner = this.searchPageMainContainer.find('.paginationContainer');

      this.resultData = null;
      this.itemPerPageDesktop = parseInt(this.searchPageMainContainer.data('pageSizeDesktop'), 10);
      this.itemPerPageMobile = parseInt(this.searchPageMainContainer.data('pageSizeMobile'), 10);
      this.desktopPaginationLimit = 7;
      this.moilePaginationLimit = 3;
      this.currentPage = 1;
      this.selectedFacetQueryString = '';
      this.suggestionQueue = null;

      this.pageLoad = true;
      this.pageLoad1 = true;
      this.analyticsOnPageLoad = true;
      this.facetsApplied = false;
      this.searchByDomain = $__default["default"]('.srchResultAgg').data('searchByDomain');
      this.isRecommended = false;
      this.recommendedSearchResultData = null;

      //Variables set for Analytics
      this.num_search_results = null;
      this.searchString = "";
      this.searchResultState = false;

      this.$facetsPanel = $__default["default"]('.facetsPanel, .mobileFacetsPanel');
      this.activeFilters = "";
      this.initialize();
    }

    /**
     * Initialization function
     */
    initialize() {
      this.initializeHandlers();
      this.getQueryString();
    }

    initializeHandlers() {
      window.addEventListener('popstate', () => {
        this.getQueryString(false);
        this.setAnalytics();
      });

      // mobile events start
      //mobile filter popup -open
      $__default["default"]('.srchResultAgg .filter-icon-mobile').on('click', () => {
        $__default["default"]('.c-cards-srchResult-agg-filter-popup').show();
        $__default["default"]('.popup-scroller').scrollTop(0);
        $__default["default"]('body').addClass('bodyOverflowHidden');
      });

      //mobile filter popup -close
      $__default["default"]('.srchResultAgg .popup-close, .srchResultAgg .mobileFacetsPanel .applyFilter, .srchResultAgg .mobileFacetsPanel .clearFilter').on('click', () => {
        $__default["default"]('.c-cards-srchResult-agg-filter-popup').hide();
        $__default["default"]('body').removeClass('bodyOverflowHidden');
      });

      $__default["default"]('.popup-sort-options').on('click', '.sortOptions', (event) => {
        event.preventDefault();
        $__default["default"]('.sortOptions').removeClass('fw-bold selectedSort border-secondary');
        $__default["default"](event.target).addClass('fw-bold selectedSort border-secondary');
        $__default["default"]('.srchResultAgg .popup-close').trigger('click');

        // maintain sort in large view (tab landscape)
        const sortValue = $__default["default"](event.target).data('value');
        const sortValueText = $__default["default"](event.target).text();
        $__default["default"]('.selectedSort.c-large-view').html(sortValueText).data('value', sortValue);

        this.currentPage = 1;
        this.submitSearch();
      });
      // mobile events ends

      // sort by dropdown
      $__default["default"]('.srch-result-sort-by').on('click', (event) => {
        const componentId = $__default["default"](event.currentTarget).data('componentid');
        $__default["default"]('.sortSrchDropdown').toggleClass('hideContent');
        $__default["default"](`.srch-result-sort-by-parent-${componentId}`).find('.js-filter-toggle--arrow').toggleClass('is-open');
      });

      // close sort by dropdown when click outside
      $__default["default"](document).on('click', (event) => {
        if (!$__default["default"](event.target).closest('.srch-result-sort-by').length) {
          $__default["default"]('.sortSrchDropdown').addClass('hideContent');
          this.searchPageMainContainer.find('.js-filter-toggle--arrow').removeClass('is-open');
        }

        // close auto suggest
        if (!$__default["default"](event.target).closest('.srch-result-sort-by').length) {
          $__default["default"]('.srchSuggestions').hide();
        }
      });

      // sort by dropdown options
      $__default["default"]('.sortSrchDropdown a').on('click', (event) => {
        event.preventDefault();
        const componentId = $__default["default"](event.target).data('componentid');
        const sortValue = $__default["default"](event.target).data('value');
        const sortValueText = $__default["default"](event.target).text();
        $__default["default"](`.selectedSort-${componentId}`).html(sortValueText).data('value', sortValue);
        $__default["default"]('.srch-result-sort-by').trigger('click');

        // maintain sort in medium view (tab portrait)
        $__default["default"]('.popup-sort-options')
          .find('.sortOptions')
          .removeClass('fw-bold selectedSort border-secondary')
          .filter(`[data-value="${sortValue}"]`)
          .addClass('fw-bold selectedSort border-secondary');

        this.currentPage = 1;
        this.submitSearch();
      });

      $__default["default"]('#srch-result-sort-by').on('changed.bs.select', () => {
        this.currentPage = 1;
        const facetRepaintFlag = false,   // default
          historyFlag = true,   // default
          setAnalytics = false;   // don’t fire analytics on sort change
        this.submitSearch(facetRepaintFlag, historyFlag, setAnalytics);
      });

      // facet apply btn click
      this.$facetApplyBtn.on('click', (event, historyFlag = true) => {
        event.preventDefault();
        let facetAndQuery = [];
        let $checkedFilter = null;
        if (tncUtility__default["default"].checkWindowWidth()) {
          $checkedFilter = $__default["default"]('.facetsPanel');
        } else {
          $checkedFilter = $__default["default"]('.mobileFacetsPanel');
        }
        $checkedFilter
          .find('.facetMainCategoryContainer')
          .not('.hideContent')
          .each((i, ele) => {
            let facetOrQuery = [];
            $__default["default"](ele)
              .find('.custom_check_box')
              .not('.off')
              .parent()
              .find('.check_input')
              .each((j, chkBox) => {
                facetOrQuery.push($__default["default"](chkBox).val());
              });

            if (facetOrQuery.length > 1) {
              facetAndQuery.push(`(or ${facetOrQuery.join(' ')})`);
            } else if (facetOrQuery.length === 1) {
              facetAndQuery.push(facetOrQuery[0]);
            }
          });

        if (facetAndQuery.length > 1) {
          this.selectedFacetQueryString = `(and ${facetAndQuery.join(' ')})`;
        } else {
          this.selectedFacetQueryString = facetAndQuery.join(' ');
        }
        this.facetsApplied = true;
        if (historyFlag) {
          this.currentPage = 1;
          this.submitSearch();
        }
      });

      // clear facets btn click
      this.$clearBtn.on('click', (event) => {
        let $ele = null;
        if ($__default["default"](event.target).siblings('.c-accordion').length) {
          $ele = $__default["default"](event.target).siblings('.c-accordion');
        } else {
          $ele = $__default["default"](event.target).closest('.mobileFacetsPanel').find('.c-accordion');
        }

        $ele.find(".c-accordion__item input:checkbox").prop('checked', false);
        $ele.find(".custom_check_box").addClass("off");

        $ele.find(".c-accordion__item .toggler").removeClass('toggle-on');
        $ele.find(".c-accordion__item .toggler-content").hide();

        this.selectedFacetQueryString = '';
        this.currentPage = 1;
        this.submitSearch();
      });

      // toggle facets -- accordion
      this.$facetsToggler.on('click', function (e) {
        e.preventDefault();
        $__default["default"](this).toggleClass("toggle-on");
        $__default["default"](this).siblings('.toggler-content').toggle();
      });

      // facets chk box click
      this.$filterChkBox.on('click', (event) => {
        let $inpChkBox = $__default["default"](event.target).parent().find('.check_input'),
          chkBoxVal = $inpChkBox.val(),
          chkBoxState = $inpChkBox.prop('checked');

        // maintain the facet in tab landscape and portrait
        $__default["default"]('.custom_check_box')
          .parent()
          .find('.check_input')
          .filter(`[value="${chkBoxVal}"]`)
          .prop('checked', !chkBoxState)
          .parents('.facetSubCategory')
          .find('.custom_check_box')
          .toggleClass("off");
      });

      // filter checkbox label
      $__default["default"]('.c-facet-inp-label').on('click', (event) => {
        event.preventDefault();
        $__default["default"](event.currentTarget).closest('.facetSubCategory').find('.custom_check_box').trigger('click');
      });


      // mobile event to show filter --- may be need to remove
      // $(".c-search-results-list__show-hide-filters").click(function () {
      //   $(this).siblings('.c-search-results-list__filter-column').toggle(50);
      //   $(this).toggleClass('opened');
      //   $(this).find('.show-filters, .hide-filters').toggle();
      // });

      //submit Search
      this.$searchForm.on('submit', (event) => {
        event.preventDefault();
        this.currentPage = 1;
        this.selectedFacetQueryString = '';
        this.facetsApplied = false;
        // reset the sort
        let defaultSortOptionTitle = $__default["default"]('.selectedSort').data('defaultTitle');
        let defaultSortOptionValue = $__default["default"]('.selectedSort').data('defaultValue');
        if (tncUtility__default["default"].checkWindowWidth()) {
          $__default["default"]('.selectedSort').data('value', defaultSortOptionValue);
          $__default["default"]('.selectedSort').html(defaultSortOptionTitle);
        } else {
          $__default["default"]('.popup-sort-options').find('.sortOptions.selectedSort').data('value', defaultSortOptionValue);
          $__default["default"]('.popup-sort-options').find('.sortOptions.selectedSort').html(defaultSortOptionTitle);
        }
        // let sortSelected = (tncUtility.checkWindowWidth()) ? $('.selectedSort').data('value') : $('.popup-sort-options').find('.sortOptions.selectedSort').data('value');

        if ($__default["default"].trim(this.$searchBox.val()).length) {
          $__default["default"]('.clearSearch').show();
          $__default["default"](".searchIconBtn").hide();
          // this.submitSearch(true);
        } else {
          $__default["default"]('.clearSearch').hide();
          $__default["default"](".searchIconBtn").show();
          // $('.clearSearch').trigger('click');
        }
        this.submitSearch(true);
        $__default["default"]('.srchSuggestions').hide();
      });

      // search icon click
      this.$searchIcon.on('click', (event) => {
        event.preventDefault();
        this.$searchForm.trigger('submit');
      });

      // search suggestion click
      $__default["default"]('.srchSuggestions').on('click', '.suggestionItems', (event) => {
          this.acceptSuggestion(event);
      });

      // search box input for auto suggestion
      this.$searchBox.on('input', (event) => {
        $__default["default"]('.clearSearch').hide();
        $__default["default"](".searchIconBtn").show();

        if ($__default["default"].trim(event.target.value) && event.target.value.length >= 3) {
          // trigger auto suggest
          this.triggerAutoSuggest(event.target);
        } else {
          // cancel previous call if any
          setTimeout(() => {
            this.abortAutoSuggestion();
          }, 10);
        }
      });

      // clear text
      $__default["default"](".clearSearch").on("click", (event) => {
          this.$searchBox.val("");
          $__default["default"](event.target).hide();
          $__default["default"](".searchIconBtn").show();
          this.facetsApplied = false;
          this.selectedFacetQueryString = "";
          this.$searchBox.focus();
      });

      // pagination nos. click
      this.pagingConatiner.on('click', '.c-pagination__page', (event) => {
        event.preventDefault();
        // set the current Page
        this.currentPage = $__default["default"](event.target).data('page');

        this.submitSearch();
      });

      // Pagination next / prev
      this.pagingConatiner.on('click', '.c-pagination__previous, .c-pagination__next', (event) => {
        event.preventDefault();
        // set the current Page
        this.currentPage += parseInt($__default["default"](event.target).data('page'), 10);

        this.submitSearch();
      });

      // Search field (main content area) keyboard handler
      // (Have to set suggestions handlers later, when they appear.)
      $__default["default"](".searchBox").on("keydown", (event) => {
          this.searchFieldKeyPress(event);
      });

      // Set keyboard handlers for the sort-by menu and its menu items.
      //
      // Use the ‘loaded’ event from the control being used: bootstrap-select
      // https://developer.snapappointments.com/bootstrap-select/methods/
      $__default["default"]("#srch-result-sort-by").on("loaded.bs.select", () => {
          $__default["default"](".srch-result-sort-by").on("keydown", this.sortByKeyPress);
      });

      // Use the ‘shown’ and ‘hidden’ events from bootstrap-select.
      $__default["default"]("#srch-result-sort-by").on("shown.bs.select", () => {
          // Set a handler on the menu items to handle the space key
          // when the menu is open.
          $__default["default"](".c-search-results-list__search-items").on("keydown.sortBy",
              "div.dropdown-menu div.inner", this.sortByMenuItemKeyPress);
      });
      $__default["default"]("#srch-result-sort-by").on("hidden.bs.select", () => {
          // Remove the menu item handler when the menu is closed.
          $__default["default"](".c-search-results-list__search-items").off("keydown.sortBy",
              "div.dropdown-menu div.inner");
      });

      // Set keyboard handlers for the filters and their buttons.
      $__default["default"](".facetMainCategory").on("keydown", (event) => {
          var key = event.key;
          if (key === " ") {   // Space key
              event.preventDefault();   // Prevent scrolling the page.
              // Toggle the filter category’s state.
              $__default["default"](event.target).trigger("click");
          }
      });
      $__default["default"](".facetSubCategory").on("keydown", (event) => {
          var key = event.key;
          if (key === " ") {   // Space key
              event.preventDefault();   // Prevent scrolling the page.
              // Toggle the check box for the filter item.
              $__default["default"](event.target).find(".c-facet-inp-label").trigger("click");
          }
      });
    }

      acceptSuggestion(event) {
          // Accept a search suggestion: put it in the search field and run it.

          let selectedSuggestion = $__default["default"](event.target).text();
          $__default["default"](".searchBox").val(selectedSuggestion);

          // Close the search suggestions menu.
          $__default["default"](".srchSuggestions").hide();

          $__default["default"](".searchIconBtn").trigger("click");
      }

      searchFieldKeyPress(event) {
          var key = event.key;

          // Set keyboard handlers for visible search suggestions (for the
          // search box in the main content area).
          let suggestions = $__default["default"](".srchSuggestions li");
          if (suggestions.length > 0 &&
                  $__default["default"](".srchSuggestions").is(":visible")) {
              // Set keyboard handlers for suggestions.
              for (let i = 0; i < suggestions.length; i++) {
                  $__default["default"](suggestions[i]).on("keydown", (event) => {
                      this.searchSuggestionKeyPress(event);
                  });
              }
          }

          // down arrow
          if (key === "ArrowDown") {
              event.preventDefault();

              // If there are any search suggestions, set focus on the first.
              if (suggestions.length > 0 &&
                      $__default["default"](".srchSuggestions").is(":visible")) {
                  suggestions.first().focus();
              }
          }
      }

      searchSuggestionKeyPress(event) {
          var key = event.key;
          var target = event.target;

          // arrow keys, Enter
          if (key === "ArrowDown") {
              event.preventDefault();
              let nextItem = $__default["default"](target).next();
              if (nextItem) {
                  nextItem.focus();
              }
          }
          else if (key === "ArrowUp") {
              event.preventDefault();
              let previousItem = $__default["default"](target).prev();
              if (previousItem.length > 0) {
                  previousItem.focus();
              }
              else {
                  // If there's no previous item, this must be the first
                  // suggestion in the list: set focus on the search field.
                  $__default["default"](".searchBox").focus();
              }
          }
          else if (key === "Enter") {
              this.acceptSuggestion(event);
          }
      }

      sortByKeyPress(event) {
          var key = event.key;

          if (key === " " || key === "Enter") {   // Space key or Enter key
              event.preventDefault();   // Prevent scrolling the page.

              // Open the sort-by menu.
              $__default["default"]("#srch-result-sort-by").selectpicker("toggle");

              // Set initial focus on the currently-selected menu item.
              let selectedItem = $__default["default"](".selectedSort .dropdown-menu li.selected");
              selectedItem.focus();
          }
      }

      sortByMenuItemKeyPress(event) {
          var key = event.key;

          if (key === " ") {   // Space key
              event.preventDefault();   // Prevent scrolling the page.

              // Determine the just-selected menu item.
              var newSelection = $__default["default"](".selectedSort .dropdown-menu li.active a");

              // Select the item and close the menu.
              var e = $__default["default"].Event("keydown");
              e.which = 13;   // Enter key
              newSelection.trigger(e);
          }
      }

    /**
     * getQueryString function:- get the search param from url when coming from other page
     */
    getQueryString(historyFlag = true) {
      // update currentPage for pagination
      let start = tncUtility__default["default"].getParameterByName('start');
      let itemInAPage = (tncUtility__default["default"].checkWindowWidth()) ? this.itemPerPageDesktop : this.itemPerPageMobile;
      if (parseInt(start, 10)) {
        // start = (this.currentPage - 1) * itemInAPage,
        this.currentPage = (start / itemInAPage) + 1;
      } else {
        this.currentPage = 1;
      }

      // facets
      let facetStr = tncUtility__default["default"].getParameterByName('fq');
      if (facetStr) {
        let facetStrArr = facetStr.split(' ');
        // const reg = "(:')";
        const reg1 = '[(|)]';
        const regex1 = new RegExp(reg1, 'gi');
        // const regex = new RegExp(reg, 'gi');
        for (let i = 0; i < facetStrArr.length; i++) {
          // if (regex.test(facetStrArr[i])) {
          let getFacetName = facetStrArr[i].replace(regex1, '');
          this.$facetsPanel
            .find('.check_input[value="' + getFacetName + '"]')
            .prop('checked', true)
            .parents('.facetSubCategory')
            .find('.custom_check_box')
            .removeClass('off');
          // }
        }

        this.selectedFacetQueryString = facetStr;
        this.facetsApplied = true;
        // this.$facetApplyBtn.trigger('click', [historyFlag]);
      } else {
        this.$facetsPanel
          .find('.check_input')
          .prop('checked', false)
          .parents('.facetSubCategory')
          .find('.custom_check_box')
          .addClass('off');
        this.selectedFacetQueryString = '';
        this.facetsApplied = false;
      }

      // sort
      let sortOrder = tncUtility__default["default"].getParameterByName('sort');
      if (sortOrder) {
        // desktop
        let sortoption = $__default["default"]('.sortSrchDropdown').find(`.ddSort[data-value='${sortOrder}']`);
        $__default["default"]('.selectedSort.c-large-view').text(sortoption.text()).data('value', sortOrder);
        $__default["default"]('select.selectedSort').selectpicker('val', sortOrder);

        // mobile
        $__default["default"]('.popup-sort-options .sortOptions').removeClass('fw-bold selectedSort border-secondary').filter(`[data-value="${sortOrder}"]`).addClass('fw-bold selectedSort border-secondary');
      }

      // serach word
      let srchWord = tncUtility__default["default"].getParameterByName("q");
      this.updateSearchValue(srchWord, historyFlag); // this will internally trigger submit search
    }

    /**
     * updateSearchValue function:- update the search input with the query string
     */
    updateSearchValue(searchedVal, historyFlag = true) {
      this.$searchBox.val(searchedVal);
      if ($__default["default"].trim(this.$searchBox.val()).length) {
        $__default["default"]('.clearSearch').show();
        $__default["default"](".searchIconBtn").hide();
      } else {
        $__default["default"]('.clearSearch').hide();
        $__default["default"](".searchIconBtn").show();
      }
      this.submitSearch(true, historyFlag);
    }

    getFacetsForQueryString() {
      let dataCategory = {};
      let $chkedFilter = null;
      if (tncUtility__default["default"].checkWindowWidth()) {
        $chkedFilter = $__default["default"]('.facetsPanel');
      } else {
        $chkedFilter = $__default["default"]('.mobileFacetsPanel');
      }
      $chkedFilter.find('.facetMainCategory').each((i, ele) => {
        dataCategory[$__default["default"](ele).data('categoryId')] = "{}";
      });
      return dataCategory;
    }
    /**
      * filterSearchKeyWord function : for filtering the search keyword
    */
    filterSearchKeyWord(keyword) {
      return $__default["default"].trim(keyword.replace(/\//g, ' '));
    }
    /**
     * submitSearch function:- submit search to fetch the data from server
     */
    submitSearch(facetRepaintFlag = false, historyFlag = true,
      setAnalytics = true) {

      const searchWord = this.$searchBox.val(),
        queryKeyword = this.filterSearchKeyWord(searchWord),
        itemInAPage = (tncUtility__default["default"].checkWindowWidth()) ? this.itemPerPageDesktop : this.itemPerPageMobile,
        dataFacetQuery = this.getFacetsForQueryString(),
        searchOptions = $__default["default"]('.srchResultAgg').data('searchOptions').split('=');

      let searchUrl = this.$searchForm.attr('action');

        const obj = {
          url: searchUrl,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          data: {
            q: queryKeyword,
            start: (this.currentPage - 1) * itemInAPage,
            size: itemInAPage
          }
        };
        //Match the keywords to something from the list that was injected into HTML
      obj.data[searchOptions[0]] = searchOptions[1];
      if (this.selectedFacetQueryString) {
        dataFacetQuery.fq = `(and search_by_domain:'${this.searchByDomain}'${this.selectedFacetQueryString})`;
      } else {
        dataFacetQuery.fq = `search_by_domain:'${this.searchByDomain}'`;
      }

      let sortSelected = (tncUtility__default["default"].checkWindowWidth()) ? $__default["default"]('select.selectedSort').val() : $__default["default"]('.popup-sort-options').find('.sortOptions.selectedSort').data('value');

      dataFacetQuery.sort = sortSelected;

      $__default["default"].extend(obj.data, dataFacetQuery);

      if (this.pageLoad) {
        this.pageLoad = false;
      } else {
        if (historyFlag) {
          // update the URL for:- search word, facet query string, page start, page size, sort
          let usrFilters = tncUtility__default["default"].updateQueryString("q", encodeURIComponent(searchWord));
          usrFilters = tncUtility__default["default"].updateQueryString("fq", this.selectedFacetQueryString, usrFilters);
          usrFilters = tncUtility__default["default"].updateQueryString("start", (this.currentPage - 1) * itemInAPage, usrFilters);
          usrFilters = tncUtility__default["default"].updateQueryString("size", itemInAPage, usrFilters);
          usrFilters = tncUtility__default["default"].updateQueryString("sort", sortSelected, usrFilters);

          tncUtility__default["default"].updateURL(usrFilters);
        }
      }

      //Clears HTML on seach results panel element on each search
      this.$srchResPanel.empty();

      //Ajax request making request call to post.html
      let $recommendedResultsListEl = $__default["default"]('.search-results-recommendedSearchList');
      let recommendedFormActionURL = $recommendedResultsListEl.data('formAction');
      let recommendedLabel = $recommendedResultsListEl.data("recommendedLabel");

      xhrModule__default["default"].initXHR({
        url: recommendedFormActionURL,
        data: {
          searchTerm: $__default["default"].trim(searchWord).toLowerCase()
        }
      }).then(response => {
        this.processRecommendedSearchData(response, recommendedLabel);
      });

      xhrModule__default["default"].initXHR(obj).then((response) => this.processData(response,
        facetRepaintFlag, historyFlag, setAnalytics));
    }

    /**
     * processRecommendedSearchData function:- process the response for the recommended search
     */
    processRecommendedSearchData(recommendedResultData, recommendedLabel) {
      this.setVisibilityNoResultTemplate();
      this.recommendedSearchResultData = recommendedResultData;

      if (recommendedResultData) {
        // Render Recommended list HTML
        this.recommendedSearchResultData.recommendedLabel = recommendedLabel;
        this.renderRecommended();
      }
    }

    /**
     * processData function:- process the response
     */
    processData(searchResultsData, facetRepaintFlag, historyFlag = true,
      shouldSetAnalytics = true) {

      if (searchResultsData && searchResultsData.hits && searchResultsData.hits.found && parseInt(searchResultsData.hits.found, 10)) {
        this.setVisibilityNoResultTemplate();
        this.resultData = searchResultsData;

        // display facets
        this.showHideFacets(facetRepaintFlag, historyFlag);
        // render Seach list HTML
        this.renderSearchResults();
      } else {
        if (!this.analyticsOnPageLoad && this.facetsApplied && this.selectedFacetQueryString) {
          this.facetsApplied = false;
          this.renderNoResultsFacets();
          this.num_search_results = 0;
          this.searchResultState = false;
          this.pagingConatiner.html('');
          $__default["default"]('.c-search-results-list__search-results').addClass('removeBoderBottom');
        } else {
          this.renderNoResults();
          this.num_search_results = 0;
          this.searchResultState = false;
        }
      }
      const searchWord = this.$searchBox.val();
      if (searchWord) {
        let facetQuery = tncUtility__default["default"].getParameterByName('fq');
        if (facetQuery) {
          this.activeFilters = this.setFilterParam();
        }
        else {
          this.activeFilters = "";
        }

        if (shouldSetAnalytics) {
          this.setAnalytics();
        }
      } 
    }

    setAnalytics() {
      let analyticsObj = {};
      let keyWordInUrlParam = $__default["default"].trim(tncUtility__default["default"].getParameterByName('q'));
      //filter applied analytics
      if (this.activeFilters) {
        analyticsObj = {
          'event_name': 'filter_applied',
          'event_action': this.$searchBox.val(),
          'filter_type': this.activeFilters,
        };
        console.log("setAnalytics: this.activeFilters: about to set:",
          analyticsObj);
        tncUtility__default["default"].setAnalyticsByPage(analyticsObj, true);
      }
      else {
        if (keyWordInUrlParam) {
          analyticsObj = {
            'page_name': (this.searchResultState === true) ? "search results successful" : "search results unsuccessful",
            'event_name': 'header_search',
            'event_action': this.$searchBox.val(),
            'event_category': this.num_search_results,
            'search_term': this.$searchBox.val(),
            'num_search_results': this.num_search_results,
            'event_location': 'search results',
          };
          console.log("setAnalytics: keyWordInUrlParam: about to set:",
            analyticsObj);
          tncUtility__default["default"].setAnalyticsByPage(analyticsObj, true);
        } else {
          if (!this.analyticsOnPageLoad) {
            analyticsObj = {
              'page_name': (this.searchResultState === true) ? "search results successful" : "search results unsuccessful",
              'event_name': 'header_search',
              'event_action': (this.$searchBox.val()) ? this.$searchBox.val() : 'undefined',
              'event_category': this.num_search_results,
              'search_term': (this.$searchBox.val()) ? this.$searchBox.val() : 'undefined',
              'num_search_results': this.num_search_results,
              'event_location': 'search results',
            };
            console.log("setAnalytics: this.!analyticsOnPageLoad: about to set:",
              analyticsObj);
            tncUtility__default["default"].setAnalyticsByPage(analyticsObj, true);
          }
        }
      }
      this.analyticsOnPageLoad = false;
    }


    /* setFilterParam function: gets filters options selected along with the category in a single string */
    setFilterParam() {
      let filterValue = {};
      $__default["default"]('.custom_check_box').not(".off").each((index, element) => {
        let mainCategoryName = $__default["default"](element).closest('.facetMainCategoryContainer').find('.facetMainCategory').text();
        filterValue[mainCategoryName] = true;
      });
      return Object.keys(filterValue).join('|');
    }


    /**
      * renderNoResultsFacets function : show no result when search returns no result for particular facets
    */
    renderNoResultsFacets() {
      $__default["default"]('.c-no-result-facets').removeClass('hideContent');
      $__default["default"]('.c-search-results').addClass('hideContent');
    }

    /**
     * renderNoResults function:- shows no result page
     */
    renderNoResults() {
      $__default["default"]('.filter-icon-mobile').addClass('hideContent').parent().addClass('hideContent');
      $__default["default"]('.srchResultAgg').find('.resultContainerId-noResult').removeClass('hideContent');
      $__default["default"]('.srchResultAgg').find('.c-search-results-list__search-items, .c-search-results-list__search-results, .paginationContainer').addClass('hideContent');
      $__default["default"]('.srchResultAgg').find('.c-search-results-list').addClass('removeBoderBottom');
    }

    /**
     * setVisibilityNoResultTemplate function:-
     */
    setVisibilityNoResultTemplate() {
      $__default["default"]('.filter-icon-mobile').removeClass('hideContent').parent().removeClass('hideContent');
      $__default["default"]('.c-no-result-facets').addClass('hideContent');
      $__default["default"]('.c-search-results').removeClass('hideContent');
      $__default["default"]('.srchResultAgg').find('.c-search-results-list__search-items').removeClass('hideContent');
      $__default["default"]('.srchResultAgg').find('.resultContainerId-noResult').addClass('hideContent');
      $__default["default"]('.srchResultAgg').find('.c-search-results-list__search-results, .paginationContainer').removeClass('hideContent');
      $__default["default"]('.srchResultAgg').find('.c-search-results-list').removeClass('removeBoderBottom');
    }

    /**
     * showHideFacets function:- show hide face panel
     */
    showHideFacets(facetRepaintFlag, historyFlag = true) {
      if (!facetRepaintFlag)
        return false;

      this.resetFacets(historyFlag);
      if (!this.resultData.facets) {
        $__default["default"]('.searchResultPanel').addClass('searchFullWidth');
        return;
      }
      const searchFacets = this.resultData.facets,
        searchFacetsKeys = Object.keys(searchFacets);

      for (let i = 0; i < searchFacetsKeys.length; i++) {
        const keyName = searchFacetsKeys[i];
        for (let j = 0; j < searchFacets[keyName].buckets.length; j++) {
          const subCategoryName = searchFacets[keyName].buckets[j].value,
            combineName = `${keyName}:'${subCategoryName}'`;
          this.$facetsPanel
            .find(`.check_input[value="${combineName}"]`)
            .closest('.facetSubCategory')
            .removeClass('hideContent')
            .closest('.facetMainCategoryContainer')
            .removeClass('hideContent');
        }
      }
      this.$facetsPanel.removeClass('hideContent');
      if (!this.$facetsPanel.has('mobileFacetsPanel')) {
        if (!this.$facetsPanel.find('.facetMainCategoryContainer:visible').length) {
          this.$facetsPanel.addClass('hideContent');
        }
      }


      let facetsExist = $__default["default"]('.facetsPanel').find('.facetSubCategory').not('.hideContent').length;
      if (!facetsExist) {
        this.$facetsPanel.addClass('hideContent');
        $__default["default"]('.searchResultPanel').addClass('searchFullWidth');
      } else {
        this.$facetsPanel.removeClass('hideContent');
        $__default["default"]('.searchResultPanel').removeClass('searchFullWidth');
      }
    }

    /**
     * searchResultHbsTpl function:- returns the HBS tpl for search listing
     */
     searchResultHbsTpl() {
       return `{{#each this.hits.hit}}
               <li class="c-search-result-item">
                 <a href="{{this.fields.link}}" target="{{this.fields.target}}" title="{{this.fields.title}}">
                   <h3 class="family-serif fw-v4 fz-v14 fz-v16-sm lh-v19 c-search-result-item__title">{{this.fields.title}}</h3>
                   {{log this}}
                 </a>
                 <span class="family-sans fw-v4 fz-v7 c-search-result-item__date txt-clr-g2">{{this.fields.publish_date_label}}</span>
                 <p class="family-sans fw-v2 fz-v8 lh-v11 c-search-result-item__content txt-clr-g1">
                   {{{this.fields.description}}}
                 </p>
               </li>
             {{/each}}`;
      }
  /**
  * searchRecommendedResultsHbsTpl function:- returns the HBS tpl for recommended search listing
  **/
    recommendedSearchResultTpl(){
         return `{{#if this.title}}
                <li class="c-search-result-item recommendedItem">
                  <div class="recommended-tag"><span class="icon icon-star"></span>{{this.recommendedLabel}}</div>
                  <a href="{{this.link}}" title="{{this.title}}">
                    <h3 class="family-serif fw-v4 fz-v14 fz-v16-sm lh-v19 c-search-result-item__title">{{this.title}}</h3>
                  </a>
                  <p class="family-sans fw-v2 fz-v8 lh-v11 c-search-result-item__content txt-clr-g1">{{{this.description}}}</p>
                </li>
              {{/if}}`;
       }
  /**
  * recommendedSearchResultTpl function:- to render the recommened search results
  */
    renderRecommended() {
      const template = Handlebars.compile(this.recommendedSearchResultTpl('recommendedResult')),
      srchListHtml = template(this.recommendedSearchResultData);

      this.$srchResPanel.prepend(srchListHtml);
    }
    /**
     * renderSearchResults function:- to render the filtered search results
     */
    renderSearchResults() {
      const template = Handlebars.compile(this.searchResultHbsTpl('results')),
        $resultCountEle = $__default["default"]('.resultCount'),
        labelPrefixTxt = $resultCountEle.data('labelPrefix'),
        singleResultTxt = $resultCountEle.data('singleResult'),
        multipleResultTxt = $resultCountEle.data('multipleResult'),
        srchListHtml = template(this.resultData);

      this.$srchResPanel.append(srchListHtml);
      this.abortAutoSuggestion();
      this.num_search_results = this.resultData.hits.found;
      this.searchResultState = true;
      if (this.resultData.hits.found > 1) {
        $resultCountEle.html(labelPrefixTxt + " " + this.resultData.hits.found + " " + multipleResultTxt);
      } else {
        $resultCountEle.html(labelPrefixTxt + " " + this.resultData.hits.found + " " + singleResultTxt);
      }

      this.pagination();
    }

    /**
     * triggerAutoSuggest function:-
     */
    triggerAutoSuggest(srchBox) {
      const input = $__default["default"].trim($__default["default"](srchBox).val());
      var prefixes = '';
      input.split(/[^a-z0-9]/i).forEach(prefix => {
          prefix = prefix.trim();
          if (prefix.length > 0) {
              prefixes += `(prefix field='suggester' '${prefix}')`;
          }
      });
      const suggestionApi = $__default["default"](srchBox).data('suggestionApi'),
        obj = {
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          url: suggestionApi,
          data: {
            q: `(and ${prefixes})`,
            'q.parser': 'structured',
            fq: `search_by_domain:'${this.searchByDomain}'`,
            size: 1000,
            return: 'title',
            sort: 'title asc'
          }
        };

      setTimeout(() => {
        // cancel any previous call
        this.abortAutoSuggestion();
        xhrModule__default["default"].initXHR(obj).then((suggestions, textStatus, jqXHR) => this.renderAutoSuggest(suggestions, jqXHR, input.toLowerCase()));
      }, 2);
    }

    /**
     * abortAutoSuggestion function:-
     */
    abortAutoSuggestion() {
      if (this.suggestionQueue !== null) {
        this.suggestionQueue.abort();
        this.suggestionQueue = null;
        $__default["default"]('.srchSuggestions').hide();
      }
    }

    /**
     * renderAutoSuggest function:-
     */
    renderAutoSuggest(suggestedResult, jqXHR, query) {
      this.suggestionQueue = jqXHR;
      if (!suggestedResult.hits.found) {
        return;
      }
      var filteredResult = suggestedResult.hits.hit.filter(function(hit) {
          if (this.limit < 6 && hit.fields.title.toLowerCase().startsWith(query)) {
              this.limit++;
              return true;
          }
          return false;
      }, {limit: 0});
      const suggestionHbsTpl = `{{#each this}}
        <li class="bg-clr-g11 c-field__input suggestionItems txt-clr-g1
            txt-clr-p4-hover" tabindex="0">{{this.fields.title}}</li>
        {{/each}}`,
          template = Handlebars.compile(suggestionHbsTpl),
          suggestListHtml = template(filteredResult);

          $__default["default"]('.srchSuggestions').html(suggestListHtml).show();
    }

    /**
     * resetFacets function:- un check already selected filters on facet panel repaint/refresh
     * also hide the facets (restores it to original state)
     */
    resetFacets(historyFlag = true) {
      if (!historyFlag)
        return;
      if (this.pageLoad1) {
        this.pageLoad1 = false;
        return;
      }
      this.$facetsPanel
        .find('.check_input')
        .closest('.facetSubCategory')
        .addClass('hideContent')
        .closest('.facetMainCategoryContainer')
        .addClass('hideContent');

      this.$facetsPanel.addClass('hideContent');

      // reset chk box state
      this.$filterChkBox.not('.off').each((index, ele) => {
        $__default["default"](ele).trigger('click');
      });
    }

    // /**
    //  * pushHistory function:-
    //  */
    // updateHistory() {
    //   //todo
    // }

    pagination() {
      let page,
        paginationTpl = '';
      let _startEnd = (itemPerPage, paginationLimit) => {
        const nItemsInResult = parseInt(this.resultData.hits.found, 10);
        let pageStart,
          pageEnd;

        let totalPages = Math.ceil(nItemsInResult / itemPerPage);

        if (totalPages < paginationLimit) {
          paginationLimit = totalPages;
        }

        if (totalPages <= 1) {
          $__default["default"]('.c-search-results-list__search-results').addClass('removeBoderBottom');
          return false; // pagination html not required
        } else {
          $__default["default"]('.c-search-results-list__search-results').removeClass('removeBoderBottom');
          pageEnd = this.currentPage + Math.floor(paginationLimit / 2);

          if (pageEnd > totalPages) {
            pageEnd = totalPages;
          }

          if (pageEnd < paginationLimit) {
            pageEnd = paginationLimit;
          }

          pageStart = pageEnd - paginationLimit + 1;

          if (!pageStart) {
            pageStart = 1;
          }

          return {
            start: pageStart,
            end: pageEnd,
            totalPages: totalPages
          }
        }
      };

      if (tncUtility__default["default"].checkWindowWidth()) {
        // for desktop
        page = _startEnd(this.itemPerPageDesktop, this.desktopPaginationLimit);
      } else {
        // mobile
        page = _startEnd(this.itemPerPageMobile, this.moilePaginationLimit);
      }

      if (page) {
        paginationTpl = `<div class="c-pagination">
        <a class="c-pagination__previous icon-caret-right-primary
            icon-chevron-right-secondary border-primary" href="#"
            data-page="-1" aria-label="Previous"><span>prev</span></a>
        <span class="c-pagination__inner">`;

        for (let i = page.start; i <= page.end; i++) {
          let activeClass = '';
          if (i === this.currentPage) {
            activeClass = 'is-active border-secondary';
          }
          paginationTpl += `<a class="family-sans fw-v5 fz-v6
            c-pagination__page ${activeClass} txt-clr-g4 border-secondary"
            href="#" data-page="${i}">${i}</a>`;
        }
        paginationTpl += `</span>
        <a class="c-pagination__next icon-caret-right-primary
            icon-chevron-right-secondary border-primary" href="#"
            data-page="1" aria-label="Next"><span>next</span></a>
        </div> `;
      }

      this.pagingConatiner.html(paginationTpl);
      if (this.currentPage === 1) {
        this.pagingConatiner.find('.c-pagination__previous').prop('disabled', true).css('pointer-events', 'none');
      }
      if (this.currentPage === page.totalPages) {
        this.pagingConatiner.find('.c-pagination__next').prop('disabled', true).css('pointer-events', 'none');
      }


       // Help orient the user by scrolling up so they can see the results.
       window.scrollTo(0, 0);
       $__default["default"](".siteSearch .searchBox").focus();
    }
  }

  var searchResults_component = new SearchResults();

  return searchResults_component;

})($, TNC.XHR, TNC.Utility);
//# sourceMappingURL=search-results.component.js.map

this.TNC = this.TNC || {};
this.TNC.PopUp = (function ($, browserStorageModule, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var browserStorageModule__default = /*#__PURE__*/_interopDefaultLegacy(browserStorageModule);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    // Pop Up component JS goes here
    /** Pop Up Class. */
    class PopUp {
        /**
         * PopUp constructor
         */
        constructor() {
          if (!window.localeInterstitialShown) {
            this.initialize();

            $__default["default"](document).on('show-localeInterstitial', () => {
              $__default["default"](`.c-pop-up[data-componentuniqueid=${this.componentuniqueid}]`).addClass("isGhostInTheShell");
            });
          } else {
            $__default["default"](document).on('hide-localeInterstitial', () => {
              this.initialize();
            });
          }

          this.registerHbsHelper();
        }

        /**
         * Initialization function
         */
        initialize() {
            let _self = this;
            $__default["default"](function() {
                let nodeEl = $__default["default"]('.c-pop-up.isGhostInTheShell');
                let count = 0;
                /* istanbul ignore if */
                if (nodeEl && nodeEl.length) {
                    $__default["default"](nodeEl).each(function() {
                        count++;
                        if (count > 1) {
                            $__default["default"](this).remove();
                        } else {
                            _self.init(`${this.id}`);
                        }

                    });
                }
            });
        }

        popUpKeyPress(event) {
            var key = event.key;

            if (key === "Escape") {
                this.closePopUp();
            }
        }

        closeButtonKeyPress(event) {
            var key = event.key;

            if (key === "Enter") {
                this.closePopUp();
            }
        }

        init(id) {
            this.componentuniqueid = $__default["default"](`#${id}`).data('componentuniqueid');
            this.$el = $__default["default"](`#${this.componentuniqueid}`);
            this.variation = this.$el.find(".c-pop-up__container").attr("data-type");
            this.setCookieName = `fantastic-${this.componentuniqueid}-cookie`;
            this.reOpenOnCloseCookie = this.$el.find(".c-pop-up__container").attr("data-close") ? Number(this.$el.find(".c-pop-up__container").attr("data-close")) : 0;
            this.reOpenOnSubmitCookie = this.$el.find(".c-pop-up__container").attr("data-submit") ? Number(this.$el.find(".c-pop-up__container").attr("data-submit")) : 0;
            this.isAuthorView = (this.$el.find("input[name=isEditMode]").val() === "EDIT") ? true : false;

            this.email_check_passed = false;

            let _popupTitle = this.$el.find('h2.c-pop-up__title');
            this.popupTitle = _popupTitle && _popupTitle.length ? $__default["default"].trim(_popupTitle.text()) + '__' + this.componentuniqueid : this.componentuniqueid;

            //TNC-508
            this.cookieParam = "s_lookup";
            this.urlParam01 = "src";
            this.urlParam02 = "lu";

            //events
            let _self = this;
            $__default["default"](`.c-pop-up__close-button[data-id=${this.componentuniqueid}]`).on('click', function(event) {
                event.stopPropagation();
                _self.closePopUp();
            });

            // close popup on click outside the container
            $__default["default"]('body').on('click touchstart', (event) => {
                if (!($__default["default"](event.target).closest('.c-pop-up__container').length)) {
                    if ($__default["default"](`.c-pop-up__close-button[data-id=${this.componentuniqueid}]`).is(':visible')) {
                        $__default["default"](`.c-pop-up__close-button[data-id=${this.componentuniqueid}]`).trigger('click');
                    }
                }
            });

            this.$el.find("input[name=cons_email]").on("keyup", (event) => {
                if (event.key === 'Enter') {
                    this.validateEmail.bind(this);
                }
            });

            // Add a page-wide keyboard handler in order to handle the Escape key.
            $__default["default"]("body").on("keydown", this.popUpKeyPress.bind(this));

            // Add keyboard support for the Close button.
            $__default["default"](`.c-pop-up__close-button[data-id=${this.componentuniqueid}]`).on(
                "keydown", this.closeButtonKeyPress.bind(this));

            //Lightbox CTA Click [TNC-1661]
            //SYS-3253: Removed the code ", .c-pop-up__container[data-type='donation']" from the line below.
            this.$el.find(".c-pop-up__container[data-type='ctaLink']").on("click", "a, button", function() {
                let ctaTxt = $__default["default"](this).text() ? $__default["default"].trim($__default["default"](this).text()) : $__default["default"](this).text();
                let lightbox_name = _self.popupTitle;
                let submiUrl = $__default["default"](this).closest('form').attr('action');

                if (submiUrl && (submiUrl.indexOf("https://support.nature.org") > -1 || submiUrl.indexOf("https://preserve.nature.org") > -1)) {
                    let _tempObj = {
                        'event_name': 'lightbox_member_cta',
                        'event_action': `${ctaTxt}`,
                        'link_name': `${ctaTxt}`,
                        'lightbox_name': `${lightbox_name}`,
                        'member_cta_name': `${lightbox_name}`
                    };
                    utl__default["default"].setAnalyticsByPage(_tempObj, true);
                } else {
                    let _analyticsCta = {
                        'event_name': 'lightbox_click',
                        'lightbox_name': `${lightbox_name}`,
                        'link_name': `${ctaTxt}`
                    };
                    utl__default["default"].setAnalyticsByPage(_analyticsCta, true);
                }
            });

            //form submit event for all variation
            this.$el.find("form").on("submit", this.validateForm.bind(this));

            //init
            this.hasPopUp2Show();

            $__default["default"](window).on('resize', function() {
                /* istanbul ignore else */
                if (_self.isMobile()) {
                    _self.mobileFix();
                }
            });

            /* istanbul ignore else */
            if (_self.isMobile()) {
                _self.mobileFix();
            }

            /* render query parameters as input elements */
    		this.renderQueryparams(this.componentuniqueid);
        }

        //is Mobile view
        isMobile() {
            /* eslint-disable */
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
                return true;
            }
            return false;
            /* eslint-enable */
        }

        //check if exist and is visible
        isVisible(element) {
            if (element.length > 0 && element.css('visibility') !== 'hidden' && element.css('display') !== 'none') {
                return true;
            } else {
                return false;
            }
        }


        //Add days with current day
        //@param {Date} {NUmber}
        addDays(theDate, days) {
            return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
        }

        //TNC-3144 fix
        mobileFix() {
            // let $node = this.$el.find('.c-pop-up__container');
            // const popLimit = 10;
            // let iTop = $node.offset().top;

            // let px = 150;
            // let addPx = function() {
            //     px = px + 10;
            //     $node.css({
            //         top: `${px}px`
            //     });
            //     iTop = $node.offset().top;
            // };


            // if(this.isVisible($node)) {
            //     if (window.matchMedia("(orientation: landscape)").matches) {
            //         while (iTop < popLimit) {
            //             if(iTop === 0) {
            //                 iTop = 11;
            //             }
            //             addPx();
            //         }
            //     }

            //     if (window.matchMedia("(orientation: portrait)").matches) {
            //         $node.css({ top: '20%' });
            //     }

            // }
        }

        //hide the popup if cookie or params are the in browser
        isValidateCookie() {
            browserStorageModule__default["default"].getCookie(this.cookieParam);
            utl__default["default"].getParameterByName(this.urlParam01);
            utl__default["default"].getParameterByName(this.urlParam02);
            let currentDateTime = new Date().getTime();
            let startDateTime = new Date($__default["default"](`#${this.componentuniqueid}`).data('start')).getTime();
            let endDateTime = new Date($__default["default"](`#${this.componentuniqueid}`).data('end')).getTime();
            let reOpenOnCloseCookieDate = browserStorageModule__default["default"].getCookie(`popupRebornOnClose-${this.componentuniqueid}`);
            reOpenOnCloseCookieDate = (reOpenOnCloseCookieDate) ? new Date(reOpenOnCloseCookieDate).getTime() : reOpenOnCloseCookieDate;
            let reOpenOnSubmitCookieDate = browserStorageModule__default["default"].getCookie(`popupRebornOnSubmit-${this.componentuniqueid}`);
            reOpenOnSubmitCookieDate = (reOpenOnSubmitCookieDate) ? new Date(reOpenOnSubmitCookieDate).getTime() : reOpenOnSubmitCookieDate;
            //End TNC: SYS-3449

            //don't show popup : if popup close reponen date is less then current date
            /* istanbul ignore if */
            if (reOpenOnCloseCookieDate) {
                if (reOpenOnCloseCookieDate < currentDateTime) {
                    this.deleteCookieClose();
                    return true;
                }
                return false;
            }

            //don't show popup : if popup submit reponen date is less then current date
            /* istanbul ignore if */
            if (reOpenOnSubmitCookieDate) {
                if (reOpenOnSubmitCookieDate < currentDateTime) {
                    this.deleteCookieSubmit();
                    return true;
                } else {
                    return false;
                }
            }

            //show popup start/end dates are match
            /* istanbul ignore if */
            if (currentDateTime > startDateTime && currentDateTime < endDateTime) {
                return true;
            }

            return false;
        }

        //born popup into world
        hasPopUp2Show() {

            //#IF it's author don't show the pop-up
            /* istanbul ignore if */
            if (this.isAuthorView) {
                return;
            }

            if ((this.isValidateCookie()) && !(this.isMobile())) {
                this.showPopUp();
                //Analytics ~ Lightbox Impression (Open) [TNC-1660]
                let _lightBox = {
                    'event_name': 'lightbox_impression',
                    'lightbox_name': `${this.popupTitle}`
                };
                utl__default["default"].setAnalyticsByPage(_lightBox, true);
            } else {
                this.hidePopUp();
            }

        }

        //validate the form based on the variaton type
        /* istanbul ignore next */
        validateForm(ev) {
            switch (this.variation) {
                case 'email':
                    this.validateEmail(ev);
                    break;
                case 'donation':
                    this.validateDonation(ev);
                    break;
                case 'ctaLink':
                    this.onSubmitSetCookie();
                    break;
                    // default:
                    //     window.log("PopUp Not found");
            }

            /* set selected value to hidden field */
            var radioButtonSelected = $__default["default"]("[name='donationAmount']:checked");
            if (radioButtonSelected.length > 0) {
                $__default["default"]("[name='set.DonationLevel']").val(radioButtonSelected.data("donation-level"));
                $__default["default"]("[name='donationAmount']").remove(); // we delete this field so it is not submitted

            }
        }

        //validate the email id and submit form
        //@param event {Object}
        validateEmail(event) {
            const filter = /^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            const targetForm = this.$el.find("form");
            const emailInput = this.$el.find("input[name=cons_email]");
            const errorMsg = targetForm.find('.error__msg');
            const alreadyRegisteredError = targetForm.find('.already-registered-error');
            const freshAddressError = targetForm.find('.freshaddress-error');
            
            // clear old errors
            alreadyRegisteredError.css('display', 'none');
            freshAddressError.css('display', 'none');
            targetForm.removeClass('is-invalid');
            
            /* istanbul ignore else */
            if (!filter.test(emailInput.val())) {
                targetForm.addClass('is-invalid');
                event.preventDefault();
                let _analytics = {
                    'event_name': 'submit_error',
                    'lightbox_name': `${this.popupTitle}`,
                    'form_field_error_field': 'cons_email',
                    'form_field_error_value': errorMsg.text().trim()
                };
                
                utl__default["default"].setAnalyticsByPage(_analytics, true);
            } else {
                if ( !this.email_check_passed ) {
                    event.preventDefault();
                    let _self = this;
                    //call Engaging Networks
                    //If email exists, display error, else trigger click with passed test
                    utl__default["default"].checkEmailEngagingNetworks(emailInput.val()).then(function(data) {
                        if (data.result === 'NOT FOUND') {
                            _self.email_check_passed = true;
                            targetForm.trigger('submit');
                        } else {
                            let errorTxt;
                            if (data.result === 'EXISTS') {
                                alreadyRegisteredError.css('display', 'block');
                                freshAddressError.css('display', 'none');
                                errorTxt = alreadyRegisteredError.text().trim();
                            // else handle freshaddress response
                            } else {
                                utl__default["default"].handleFreshAddressResponse(data, _self.$el);
                                let errMsgArr = freshAddressError
                                    .find('[style*="display: inline"],[style*="display:inline"]')
                                    .toArray().map((elem) => { return elem.innerText.trim(); });
                                errorTxt = errMsgArr.join(" ");
                            }
                            
                            // SYS-4939: Remove user email from analytics error message
                            errorTxt = errorTxt.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b(?=\?)/i, 
                                "<REDACTED>");
                            
                            let _analytics = {
                                'event_name': 'submit_error',
                                'lightbox_name': `${_self.popupTitle}`,
                                'form_field_error_field': 'cons_email',
                                'form_field_error_value': errorTxt
                            };
                            utl__default["default"].setAnalyticsByPage(_analytics, true);
                        }
                    });
                } else {
                    this.email_check_passed = false;
                    let _analytics = {
                        'event_name': 'lightbox_email_signup', //TNC-4206
                        'event_action': `${this.popupTitle}`,
                        'email_signup_location': `${this.popupTitle}`,
                        'lightbox_name': `${this.popupTitle}`
                    };
                    utl__default["default"].setAnalyticsByPage(_analytics, true);
                    this.onSubmitSetCookie();
                }
            }
        }

        //validate radio buttons and submit the form
        //@param {Event}
        validateDonation(event) {
            const targetForm = this.$el.find("form");
            if (this.$el.find("input[name=donationIndex]").is(':checked') ||
                this.$el.find("input[name=donationAmount]").is(':checked')) {
                targetForm.removeClass('is-invalid');
                let btnName = targetForm.find("button[type='submit']").text();
                let submiUrl = targetForm.attr('action');


                if (submiUrl && ( submiUrl.indexOf("https://support.nature.org") > -1 ||
                submiUrl.indexOf("https://preserve.nature.org") > -1)) {
                    let _analytics = {
                        'event_name': 'lightbox_member_cta',
                        'event_action': btnName,
                        'link_name': btnName,
                        'lightbox_name': `${this.popupTitle}`,
                        'member_cta_name': `${this.popupTitle}`
                    };
                    utl__default["default"].setAnalyticsByPage(_analytics, true);
                } else {
                    /* should this is a donation variation of the form then do not submit analytics because we do that after validating the donation */
                    if ($__default["default"](".c-pop-up__container").data("type") !== 'donation') {
                        let _analyticsCta = {
                            'event_name': 'lightbox_click',
                            'link_name': btnName,
                            'lightbox_name': `${this.popupTitle}`
                        };
                        utl__default["default"].setAnalyticsByPage(_analyticsCta, true);
                    }
                }


                this.onSubmitSetCookie();
            } else {
                targetForm.addClass('is-invalid');
                event.preventDefault();
            }
        }

        //Set cookie on Close event
        setCookieClose() {
            let nextReopenDate = this.addDays(new Date(), this.reOpenOnCloseCookie);
            browserStorageModule__default["default"].deleteCookie(`${this.setCookieName}`);
            browserStorageModule__default["default"].deleteCookie(`popupRebornOnSubmit-${this.componentuniqueid}`);
            browserStorageModule__default["default"].setCookie(`popupRebornOnClose-${this.componentuniqueid}`, nextReopenDate, this.reOpenOnCloseCookie);
        }

        //Delete the cookie on close expiry time comes
        deleteCookieClose() {
            browserStorageModule__default["default"].deleteCookie(`${this.setCookieName}`);
            browserStorageModule__default["default"].deleteCookie(`popupRebornOnClose-${this.componentuniqueid}`);
        }

        //on submit form : set repoen date cookie
        onSubmitSetCookie() {
            let nextReopenDate = this.addDays(new Date(), this.reOpenOnSubmitCookie);
            browserStorageModule__default["default"].deleteCookie(`${this.setCookieName}`);
            browserStorageModule__default["default"].deleteCookie(`popupRebornOnClose-${this.componentuniqueid}`);
            browserStorageModule__default["default"].setCookie(`popupRebornOnSubmit-${this.componentuniqueid}`, nextReopenDate, this.reOpenOnSubmitCookie);
            $__default["default"]('body').removeClass('modal-open');
        }

        //Delete the cookie on submit expiry time comes
        deleteCookieSubmit() {
            browserStorageModule__default["default"].deleteCookie(`${this.setCookieName}`);
            browserStorageModule__default["default"].deleteCookie(`popupRebornOnSubmit-${this.componentuniqueid}`);
        }

        //show poup and set component cookie
        showPopUp() {
            let componentCookie = browserStorageModule__default["default"].getCookie(`${this.setCookieName}`);
            /* istanbul ignore else */
            if (!componentCookie) {
                let startDateTime = new Date($__default["default"](`#${this.componentuniqueid}`).data('start'));
                let endDateTime = new Date($__default["default"](`#${this.componentuniqueid}`).data('end'));
                browserStorageModule__default["default"].setCookie(`${this.setCookieName}`, startDateTime, endDateTime);
            }
            $__default["default"]('body').addClass('modal-open');
            $__default["default"](`.c-pop-up[data-componentuniqueid=${this.componentuniqueid}]`).removeClass("isGhostInTheShell");
        }

        //Hide the popup
        hidePopUp() {
            $__default["default"]('body').removeClass('modal-open');
            $__default["default"](`.c-pop-up[data-componentuniqueid=${this.componentuniqueid}]`).addClass("isGhostInTheShell");
        }

        //Hide the popup and set repoen date cookie on close
        closePopUp() {
            /* istanbul ignore else */
            this.setCookieClose();
            this.hidePopUp();

            // Remove the keyboard handler.
            $__default["default"]("body").unbind("keydown", this.popupKeyPress);
        }

        registerHbsHelper() {
            Handlebars.registerHelper('queryparams', function (url) {
                var inputHtml = "";
                if (url) {
                  /* create input hidden fields for every query parameter in URL */
                  var params = url.split("?")[1];
                  var paramArray = params ? params.split("&") : [];
                  paramArray.forEach ( function(value) {
                    var param = value.split("=");
                    inputHtml += "<input type='hidden' name='" + param[0] + "' value='" + param[1] + "'>";
                  });
                }
                /* create input hidden field for radio button's "donation level" */
                var radioButtonSelected = $__default["default"]("[name='donationAmount']:checked");
                if (radioButtonSelected) {
                    inputHtml += "<input type='hidden' name='set.DonationLevel' value=''>";
                }
                return inputHtml;
            });
        }

        getQueryparamsTemplate() {
            return "{{{queryparams url}}}";
        }

        renderQueryparams(componentuniqueid) {
            var template = Handlebars.compile(this.getQueryparamsTemplate());
            // get query parameters from url
            var $elem = $__default["default"]("[name='frm-" + componentuniqueid + "']");
            var url = { "url": $elem.attr("action")};
            if (url.url) {
              var queryparamsHtml = template(url);
              $elem.append(queryparamsHtml);
              $elem.attr("action", url.url.split("?")[0]);
            }
        }
    }

    var popUp_component = new PopUp();

    return popUp_component;

})($, TNC.BrowserStorage, TNC.Utility);
//# sourceMappingURL=pop-up.component.js.map

this.TNC = this.TNC || {};
this.TNC.EventAggregation = (function ($, Select, utl, xhrModule) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var Select__default = /*#__PURE__*/_interopDefaultLegacy(Select);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);
    var xhrModule__default = /*#__PURE__*/_interopDefaultLegacy(xhrModule);

    // Event Aggregation component JS goes here

    /* eslint-enable */

    /** Event Aggregation Class. */
    class EventAggregation {
        /**
         * Event Aggregation constructor
         */
        constructor() {
            let _self = this;

            $__default["default"](function () {
                _self.$el = $__default["default"](".c-event-aggregation");
                /* istanbul ignore else */
                if (_self.$el.length) {
                  // UX-150 prevent filters from being covered by footer
                  if ($__default["default"]('body').find('.c-footer')) {
                    $__default["default"]('.c-footer').css('z-index', 1);
                  }
                  _self.initialize();
                  _self.windowResizeReInit();
                }
            });

        }

        /**
         * Initialization function
         */
        initialize() {
            let _self = this;

            let baseElement = this.$el;
            Select__default["default"].initialize(baseElement);
            Select__default["default"].setUpHybridSelects();

            this.$results = this.$el.find(".c-cards-events");

            this.startDateClass = "js-start-day";
            this.startDateRangeClass = "js-start-day-range";
            this.endtDateRangeClass = "js-end-day-range";

            let cLabels = this.$el.find("input[name=calenderlabels]");
            this.startDateTxt = cLabels.data('start');
            this.endDateTxt = cLabels.data('end');
            this.applyBtnTxt = cLabels.data('apply');
            this.cancelBtnTxt = cLabels.data('cancel');
            this.clearBtnTxt = cLabels.data('clear');
            this.resultLabel = cLabels.data('results');
            this.invalidDate = cLabels.data('error');
            this.clearKeyword = this.$el.find(
                ".c-event-aggregation__clear-keyword").first();
            this.noResultFound = this.$el.find("input[name=errormsg]").val();
            this.noResultFoundCTA = this.$el.find(
                "input[name=noresultfoundCTA]").val();
            this.noResultButtonText = this.$el.find("input[name=noresultbutton]").val();
            this.dropdownType = this.$el.find("input[name=stateDropdownType]").val();
            this.eventStore = null;
            this.isPageLoad = true;

            this.serviceUrl = this.$el.find("input[name=serviceurl]").val();
            this.pagination = 12; //no of records to be render each call
            this.noOfPaging = 0;
            this.currentPaging = 0;
            this.cachedWidth = 0;
            this.filterButtonClicked = '';
            this.filterTitle = this.$el.find(".filter-title").text();
            this.selectedFilters;
            //init date picker
            this.initDatePicker();
            //check page as region/state query
            this.getGeolocation();
            //hash router events
            this.routerEvents();

            // Window scroll position, for maintaining during date picker use
            this.scrollPosition = 0;

            //Events
            $__default["default"](function () {
                _self.eventHandler();
            });
        }

        unescapeHtml(safeHtml) {
            return safeHtml
                 .replace(/&amp;/g, "&")
                 .replace(/&lt;/g, "<")
                 .replace(/&gt;/g, ">")
                 .replace(/&quot;/g, "\"")
                 .replace(/&#039;/g, "'");
        }


        // Register all events
        eventHandler() {
            let _self = this;

            // Set up region and state select fields

            let regionSelect = this.$el.find("#regionSelect");
            let stateSelect = this.$el.find("#stateSelect");

            regionSelect.on("change", function () {
                let selectedRegion = $__default["default"](this).val();
                $__default["default"]("input[name=regionName]").val(selectedRegion);

                // Update the label of the state select.

                let newLabel = "", newHelpText = "";
                if (selectedRegion.toLowerCase().replace(
                    / /g, '') === 'unitedstates' ||
                    selectedRegion.toLowerCase().replace(
                    / /g, '') === 'canada') {

                    newLabel = $__default["default"](
                        ".c-event-aggregation input[name=stateLabel2]").val();
                    newHelpText = $__default["default"](
                        ".c-event-aggregation input[name=StateDropDown2]").val();
                }
                else {
                    newLabel = $__default["default"](
                        ".c-event-aggregation input[name=stateLabel]").val();
                    newHelpText = $__default["default"](
                        ".c-event-aggregation input[name=StateDropDown]").val();
                }

                stateSelect.parent().prev("label").text(newLabel);

                // Update the state select list for the selected region.

                // Clear the hidden field holding the latest state selection.
                $__default["default"]("input[name=stateName]").val("");

                // Remove all select options.
                stateSelect.find('option').remove();

                let newOption = document.createElement("option");
                newOption.value = "";
                newOption.text = newHelpText;
                stateSelect.append(newOption);

                let regionsList = $__default["default"](this).data("regions-list");
                let i, item, localesList, regionTitle;
                for (i = 0; i < regionsList.length; i++) {
                    item = regionsList[i];
                    regionTitle = item["regionTitle"];
                    if (regionTitle === selectedRegion) {
                        // Found the locales list for this region; add options.
                        localesList = item["localesList"];
                        for (let j = 0; j < localesList.length; j++) {
                            let locale = localesList[j];
                            let localeTitle = locale["localeTitle"];
                            let localeId = locale["localeId"];
                            let regionCode = locale["regionCode"][0];
                            newOption = document.createElement("option");
                            newOption.value = localeTitle;
                            newOption.text = localeTitle;
                            newOption.setAttribute("data-id", localeId);
                            newOption.setAttribute("data-value", regionTitle);
                            newOption.setAttribute("data-code", regionCode);
                            stateSelect.append(newOption);
                        }
                        break;
                    }
                }
            });

            stateSelect.on("change", function () {
                let selectedState = $__default["default"](this).val();
                $__default["default"]("input[name=stateName]").val(selectedState);
            });

            // UX-150
            if (this.$el.find("#js-filter-list")) {
                // filter dropdown handlers
                this.$el.find("#js-filter-list").on("click", _self.filterDropDown);
                this.$el.find("#js-filter-list").on("keydown", function (e) {
                    if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();   // Prevent scrolling the page.
                        _self.filterDropDown(e);
                    }
                });

                // filter: Escape key to close
                this.$el.on("keydown", function (e) {
                    if (e.key === "Escape") {
                        var menu = $__default["default"](".c-event-aggregation-filter").first();
                        if (menu.hasClass("is-open")) {
                            menu.removeClass("is-open");
                        }
                    }
                });

                // filter checkbox key handlers
                this.$el.find("#events-filter-list li").on("keydown", function (e) {
                    if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();   // Prevent scrolling the page.
                        $__default["default"](this).find(".filter-c-box").trigger("click");
                    }
                });

              // on filter apply
              this.$el.find("#events-filter-list > li > input, .c-event-aggregation-filter").on("click", function (e) {
                  e.stopPropagation();
              });

              // close filter box click/enter
              this.$el.find("#js-pl-filter-close").on("click", function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  $__default["default"]('.c-event-aggregation-filter').removeClass('is-open');
              });

              this.$el.find("#js-pl-filter-close").on("keypress",function (e) {
                  var key = e.which;
                  /* istanbul ignore else */
                  if (key === 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    $__default["default"]('.c-event-aggregation-filter').removeClass('is-open');
                  }
              });

              // on filter clear click/enter
              this.$el.find("#js-clear-filter").on("click", function (e) {
                e.stopPropagation();
                $__default["default"]('.filter-c-box').prop('checked', false);
                $__default["default"]('.c-input').val('');
                $__default["default"]('.js-event-search-btn').show();
                _self.clearKeyword.hide();
                this.isClearSearch = true;
                _self.selectedFilters = [];
                let clearSearchQuery = utl__default["default"].updateQueryString("q", '');
                _self.updateURL(clearSearchQuery);
                let _url = _self.getSearchUrl();
                _self.getEventService(_url, false);
              });

              this.$el.find("#js-clear-filter").on("keypress",function (e) {
                  var key = e.which;
                  /* istanbul ignore else */
                  if (key === 13) {
                    e.stopPropagation();
                    $__default["default"]('.filter-c-box').prop('checked', false);
                    $__default["default"]('.c-input').val('');
                    $__default["default"]('.js-event-search-btn').show();
                    _self.clearKeyword.hide();
                    this.isClearSearch = true;
                    _self.selectedFilters = [];
                    let clearSearchQuery = utl__default["default"].updateQueryString("q", '');
                    _self.updateURL(clearSearchQuery);
                    let _url = _self.getSearchUrl();
                    _self.getEventService(_url, false);
                  }
              });

              // on filter apply
              this.$el.find("#js-apply-filter").on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                let selected = _self.getSelectedFilterList();
                if (selected.length > 0) {
                      _self.searchEventsWithFilter(e);
                  }
                $__default["default"]('.c-event-aggregation-filter').toggleClass('is-open');
                _self._setAnalyticsFilter();
              });

              this.$el.find("#js-apply-filter").on("keypress",function (e) {
                  var key = e.which;
                  /* istanbul ignore else */
                  if (key === 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    let selected = _self.getSelectedFilterList();
                    if (selected.length > 0) {
                          _self.searchEventsWithFilter(e);
                      }
                    $__default["default"]('.c-event-aggregation-filter').toggleClass('is-open');
                    _self._setAnalyticsFilter();
                  }
              });
            }

            // On search enter
            this.$el.find("input[name=search-event]").keypress(function (e) {
                var key = e.which;
                /* istanbul ignore else */
                if (key === 13) { // the enter key code
                    $__default["default"]("#selectDateFilter").daterangepicker("close");
                    _self.searchEvents(e);
                    $__default["default"](".c-event-aggregation__keyword-field").focus();
                }
            });

            // on user input
            /* istanbul ignore next */
            $__default["default"]('.c-event-aggregation__keyword-field').on('input', (e) => {
                let fieldValue = $__default["default"](e.target).val();
                if (fieldValue.length > 0) {
                    _self.clearKeyword.show();
                }
                else {
                    _self.clearKeyword.hide();
                }
                $__default["default"](".js-event-search-btn").show();
            });

            // on search button click
            this.$el.find(".js-event-search-btn").on("click", function (e) {
                _self.searchEvents(e);
            });

            // on keyword clear
            this.$el.find(".c-event-aggregation__clear-keyword").on("click",
                function (e) {

                $__default["default"]('.c-event-aggregation__keyword-field').val('');
                $__default["default"]('.js-event-search-btn').show();
                _self.clearKeyword.hide();
                $__default["default"]('.filter-c-box').prop('checked', false);
                this.isClearSearch = true;

                _self.searchEvents(e);

                // Upon clear, set focus back to the search box.
                $__default["default"](".c-event-aggregation__keyword-field").focus();
            });

            /* istanbul ignore next */
            this.$el.find(".c-cards-events__more-events").on("click", "a",
                function (e) {

                e.preventDefault();
                _self.currentPaging = _self.currentPaging + 1;
                _self.eventCardsView(_self.currentPaging, e);
            });

            //show clear button if query string is present on pageload
            /* istanbul ignore next */
            if (this.$el.find("input[name=search-event]").val()) {
                _self.clearKeyword.show();
            }

            // On click anywhere in the document
            $__default["default"](document).click(function (e) {
                // close all dropdowns
                $__default["default"]('.c-event-aggregation-filter').removeClass('is-open');

                // Close an open date picker upon clicking outside it.
                let datePickerVisible = $__default["default"](".tnc-daterangepicker").is(":visible");
                if (datePickerVisible) {
                    let target = $__default["default"](e.target);
                    let isDateButton = target.hasClass(
                        "tnc-daterangepicker-triggerbutton");
                    if (!isDateButton) {
                        let componentParents = target.parents(
                            ".c-event-aggregation");
                        // If the click target has a parent that is the base of
                        // component, then it is considered to have occurred
                        // outside the picker. (The picker's div sit outside the
                        // component, near the end of the document.)
                        let clickedOutsidePicker = (componentParents.length > 0);
                        if (clickedOutsidePicker) {
                            $__default["default"]("#selectDateFilter").daterangepicker("close");
                        }
                    }
                }
            });
        }

        windowResizeReInit() {
            let _self = this;
            this.cachedWidth = $__default["default"](window).width();
            $__default["default"](window).on('resize', () => {
                var newWidth = $__default["default"](window).width();
                if (newWidth !== _self.cachedWidth) {
                    _self.cachedWidth = newWidth;
                    let datePopupFlag = $__default["default"](".tnc-daterangepicker").is(':visible');
                    let getRange = $__default["default"]("#selectDateFilter").daterangepicker("getRange");
                    $__default["default"]("#selectDateFilter").daterangepicker('destroy');
                    $__default["default"]('.ui-front.tnc-daterangepicker-mask').remove();
                    _self.initDatePicker();
                    $__default["default"]("#selectDateFilter").daterangepicker("setRange", getRange);
                    $__default["default"]("#selectDateFilter").next().addClass('dateSelectedWidth');
                    /* istanbul ignore if */
                    if (datePopupFlag) {
                        $__default["default"]("#selectDateFilter").daterangepicker('close');
                        $__default["default"]("#selectDateFilter").daterangepicker('open');
                    }
                }
            });
        }

        //validating MM-DD-YYYY
        //use / - or . as separators
        //@param Date as String
        isValidDate(subject) {
            /* eslint-disable */
            /* istanbul ignore if */
            if (subject.match(/^(?:(0[1-9]|1[012])[\- \/.](0[1-9]|[12][0-9]|3[01])[\- \/.](19|20)[0-9]{2})$/)) {
                return true;
            } else {
                return false;
            }
            /* eslint-enable */
        }

        //check weather the date is past date
        //@param Date, String as Date
        isPastDate(iToday, sDate) {
            /* istanbul ignore else */
            if (iToday && sDate) {
                var selectedDate = new Date(sDate);
                /* istanbul ignore else */
                if (selectedDate < iToday) {
                    return true;
                }
            }
            return false;
        }

        //format date into MMM D, YYYY
        //@param {Date}
        formateDate(d, isYear) {
            if (new Date(d)) {
                var today = new Date(d);
                /* istanbul ignore else */
                if (isYear) {
                    return today.toLocaleDateString("en-US", {
                        month: 'short',
                        day: '2-digit'
                    });
                }
                return today.toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                });
            }
            return d;
        }

        //format and convert to time HH:MM XM
        //@param {Date}
        formatTime(t) {
            /* istanbul ignore else */
            if (new Date(t)) {
                let time = new Date(t).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });

                return time;
            }
            return t;
        }

        //retun today date with YYYY-MM-DD format
        getTodayDate() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            /* istanbul ignore else */
            if (dd < 10) {
                dd = '0' + dd;
            }
            /* istanbul ignore else */
            if (mm < 10) {
                mm = '0' + mm;
            }
            return yyyy + '-' + mm + '-' + dd;
        }

        //add and update the query string in URL
        //@param String, String, String
        updateQueryString(key, value, url) {
            if (!url) url = window.location.href;
            var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
                hash;

            if (re.test(url)) {
                /* istanbul ignore else */
                if (typeof value !== 'undefined' && value !== null)
                    return url.replace(re, '$1' + key + "=" + value + '$2$3');
                else {
                    hash = url.split('#');
                    url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                    if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                        url += '#' + hash[1];
                    return url;
                }
            } else {
                /* istanbul ignore else */
                if (typeof value !== 'undefined' && value !== null) {
                    var separator = url.indexOf('?') !== -1 ? '&' : '?';
                    hash = url.split('#');
                    url = hash[0] + separator + key + '=' + value;
                    /* istanbul ignore else */
                    if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                        url += '#' + hash[1];
                    return url;
                } else
                    return url;
            }
        }

        removeURLParameter(parameter, url) {
            if (!url) url = window.location.href;
            var urlparts = url.split('?');
            /* istanbul ignore if */
            if (urlparts.length >= 2) {

                var prefix = encodeURIComponent(parameter) + '=';
                var pars = urlparts[1].split(/[&;]/g);

                //reverse iteration as may be destructive
                for (var i = pars.length; i-- > 0;) {
                    //idiom for string.startsWith
                    if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                        pars.splice(i, 1);
                    }
                }

                url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
                return url;
            } else {
                return url;
            }
        }

        //get query string values from url
        //@param string, url
        getParameterByName(name, url) {
            /* istanbul ignore else */
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&"); // eslint-disable-line
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        //update window URL
        //@param String
        updateURL(url) {
            /* eslint-disable */
            return history.pushState(null, null, url);
            /* eslint-enable */
        }

        //display error message
        /* istanbul ignore next */
        showErrorMsg() {
            /*eslint-disable */
            alert(this.invalidDate);
            /*eslint-enable */
        }

        //is Mobile view
        isMobile() {
            /* eslint-disable */
            /* istanbul ignore if */
            if (/Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $__default["default"](window).width() <= 640) {
                return true;
            }
            return false;
            /* eslint-enable */
        }

        //get current geo location using service
        getGeolocation() {
            const disableGeo = $__default["default"]('.c-event-aggregation').data('disableGeoService');
            /* istanbul ignore else */
            if (disableGeo === 'no') {
                utl__default["default"].checkGeolocation().then((response) => this.renderEventsByGeoLocation(response));
            }
        }

        /* istanbul ignore next */
        getStateByCode(data, code) {
            return data.filter(
                function (data) {
                    return data.code === code;
                }
            );
        }

        renderEventsByGeoLocation(response) {
            const currentCountry = response.response['pulse-country'].toLowerCase();
            // "currentRegion" is the geolocation data's name for "state"
            const currentRegion = response.response['pulse-region'].toLowerCase();
            console.log("currentCountry:", currentCountry);
            console.log("currentRegion:", currentRegion);
            let geolocationdatastr = $__default["default"](".geolocationdatastr").data(
                "geolocationdatastr");
            console.log("geolocationdatastr:", geolocationdatastr);

            const $regionOption = $__default["default"](
                `#regionSelect [data-code='${currentCountry}']`);
            const $stateOption = $__default["default"](
                `#stateSelect [data-code='${currentCountry}']`);
            console.log("$regionOption:", $regionOption);
            console.log("$stateOption:", $stateOption);

            const _regionValue = this.getParameterByName("r");
            const _stateValue = this.getParameterByName("s");
            let _searchValue = this.getParameterByName("q");
            let geoType = ($regionOption && $regionOption.length) ? 'region' :
                ($stateOption && $stateOption.length) ? 'state' : false;
            let _startDate = this.getParameterByName("start");
            let _endDate = this.getParameterByName("end");
            console.log("(url) _regionValue: " + _regionValue +
                "  (url) _stateValue: " + _stateValue + "  geoType: " + geoType);
            /* istanbul ignore if */
            if (_regionValue || _stateValue) {
                this.renderPageByDeepLink();
                return;
            }

            /* istanbul ignore else */
            var geoDict = {};
            if (geoType === "region") {
                console.log("geoType: region");
                // Put the region value into the select and the hidden form field.
                let _regionValue = $regionOption.text();
                console.log("_regionValue:", _regionValue);
                if (_regionValue) {
                    $__default["default"]("input[name=regionName]").val(_regionValue);
                    $__default["default"]("#regionSelect").val(_regionValue);
                    // Wait a short time before triggering the change event.
                    setTimeout(function () {
                        $__default["default"]("#regionSelect").trigger("change");
                    }, 100);
                }

                // Put the state value into the select and the hidden form field.
                if (geolocationdatastr) {
                    geolocationdatastr.forEach(function (x) {
                        geoDict[x.geoLocationStateCode] = x.geoNavTitle;
                    });
                    let currentRegionText = geoDict[currentRegion];
                    currentRegionText = currentRegionText.replace(/\s/g, '');
                    console.log("currentRegionText:", currentRegionText);
                    // Wait a short time before matching and selecting the state
                    // value and triggering the change event.
                    setTimeout(function () {
                        let _stateValue = $__default["default"](
                            `#stateSelect [data-id='${currentRegionText}']`).text();
                        console.log("_stateValue:", _stateValue);
                        if (_stateValue) {
                            $__default["default"]("input[name=stateName]").val(_stateValue);
                            $__default["default"]("#stateSelect").val(_stateValue);
                            $__default["default"]("#stateSelect").trigger("change");
                        }
                    }, 100);
                }
            }
            else if (geoType === "state") {
                console.log("geoType: state");

                // Note: this is slighly reworked logic originally used with
                // an older version of the user interface, where the state
                // list widget was built differently. It is possible that it
                // might need substantial revision, because previously a
                // state value could be extracted immediately, whereas now
                // one has to set a region first before getting a state.
                // If this approach will not do, an alternative could be to
                // parse the regionList JSON string that is now passed in.

                // Get the state value and set the region and state fields.

                geolocationdatastr.forEach(function (x) {
                    geoDict[x.geoLocationStateCode] = x.geoNavTitle;
                });
                let currentRegionText = geoDict[currentRegion];
                currentRegionText = currentRegionText.replace(/\s/g, '');
                console.log("currentRegionText:", currentRegionText);

                // Set region.
                let _regionValue = $__default["default"](
                    `#regionList li a[data-id='${currentRegionText}']`).text();
                if (_regionValue) {
                    $__default["default"]("input[name=regionName]").val(_regionValue);
                    $__default["default"]("#regionSelect").val(_regionValue);
                    // Wait a short time before triggering the change event.
                    setTimeout(function () {
                        $__default["default"]("#regionSelect").trigger("change");
                    }, 100);
                }

                // Wait a short time before matching and selecting the state
                // value and triggering the change event.
                setTimeout(function () {
                    let _stateValue = $__default["default"](
                        `#stateSelect [data-id='${currentRegionText}']`).text();
                    console.log("_stateValue:", _stateValue);
                    if (_stateValue) {
                        $__default["default"]("input[name=stateName]").val(_stateValue);
                        $__default["default"]("#stateSelect").val(_stateValue);
                        $__default["default"]("#stateSelect").trigger("change");
                    }
                }, 100);
            }

            if (_searchValue) {
                _searchValue = (_searchValue === "*") ? "" : _searchValue;
                this.$el.find("input[name=search-event]").val(_searchValue);
            }
            else {
                this.$el.find("input[name=search-event]").val('');
            }

            /* istanbul ignore if */
            if (_startDate && _endDate) {
                _startDate = new Date(_startDate);
                _endDate = new Date(_endDate);
                $__default["default"]("#selectDateFilter").daterangepicker("setRange", {
                    start: _startDate,
                    end: _endDate
                });
                $__default["default"]("#selectDateFilter").next().addClass('dateSelectedWidth');
            }

            // Wait a short time before running the search, in order to
            // give enough time for initial form values to be set.
            let _self = this;
            setTimeout(function () {
                let _url = _self.getSearchUrl();
                console.log(
                    "(renderEventsByGeoLocation) about to call getEventService");
                _self.getEventService(_url, false);
            }, 200);
        }

        //check page as region/state query
        /* istanbul ignore next */
        renderPageByDeepLink() {
            let _regionValue = this.getParameterByName("r");
            let _stateValue = this.getParameterByName("s");
            let _searchValue = this.getParameterByName("q");
            let _startDate = this.getParameterByName("start");
            let _endDate = this.getParameterByName("end");

            if (!_regionValue && !_stateValue) {
                this.getGeolocation();
                return;
            }

            if (_regionValue) {
                $__default["default"]("input[name=regionName]").val(_regionValue);

                // Select this region value in the select field.
                $__default["default"]("#regionSelect").val(_regionValue);
                // Wait a short time before triggering the change event.
                setTimeout(function () {
                    $__default["default"]("#regionSelect").trigger("change");
                }, 100);
            }

            if (_regionValue) {
                if (_stateValue) {
                    // Wait a short time before selecting the state value and
                    // triggering the change event.
                    setTimeout(function () {
                        $__default["default"]("#stateSelect").val(_stateValue);
                        $__default["default"]("#stateSelect").trigger("change");
                    }, 100);
                    $__default["default"]("input[name=stateName]").val(_stateValue);
                }
            } else if (!_regionValue && _stateValue) {
                let $stateList = $__default["default"]("#StateList");
                $stateList.find("label").html(_stateValue);
                $__default["default"]("input[name=stateName]").val(_stateValue);
            }

            if (_searchValue) {
                _searchValue = (_searchValue === "*") ? "" : _searchValue;
                this.$el.find("input[name=search-event]").val(_searchValue);
            } else {
                this.$el.find("input[name=search-event]").val('');
            }

            if (_startDate && _endDate) {
                _startDate = new Date(_startDate);
                _endDate = new Date(_endDate);
                $__default["default"]("#selectDateFilter").daterangepicker("setRange", {
                    start: _startDate,
                    end: _endDate
                });
                $__default["default"]("#selectDateFilter").next().addClass('dateSelectedWidth');
            }

            let _url = this.getSearchUrl();
            this.getEventService(_url, false);
        }

        /**
         * It happens when user clicks on browser's Back/Forward buttons or when history.back(),
         * history.forward(), history.go() methods are programatically called.
         */
        /* istanbul ignore next */
        routerEvents() {
            let _self = this;
            window.addEventListener('popstate', function () {
                _self.renderPageByDeepLink();
            }, false);
        }

        //Region dropdown list
        //@param : event
        /* istanbul ignore next */
        activateRegionSelect(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            $__default["default"]('body').toggleClass('cover-footer');
            $__default["default"]('#StateList').removeClass('is-active txt-clr-p4');
            $__default["default"](ev.currentTarget).toggleClass('is-active txt-clr-p4');

            var listItems = ev.currentTarget.querySelectorAll('.dropdown li a');
            if ($__default["default"](ev.currentTarget).hasClass('is-active')) {
                $__default["default"]('body').addClass('cover-footer');

                // Focus on the first item.
                $__default["default"](listItems[0]).focus();
            }
            else {
                // Menu is closed: disallow keyboard focus for each menu item.
                setTimeout(function () {
                    $__default["default"]('body').removeClass('cover-footer');
                }, 4);
            }
        }

        //Filter dropdown list
        //@param : event
        filterDropDown(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          $__default["default"]('body').toggleClass('cover-footer');
          $__default["default"](this).toggleClass('_active');
          $__default["default"]('.c-event-aggregation-filter').toggleClass('is-open');
        }

        //Filter dropdown list
        //@param : event
        getSelectedFilterList() {
          let _self = this;
          let selectedFilters = [];
          $__default["default"]('#events-filter-list > li > input:checked').each(function () {
              selectedFilters.push($__default["default"](this).val().replace(/_/g, ' '));
          });
           _self.selectedFilters = selectedFilters;
          return selectedFilters;
        }

        //Search Events with keywords, location
        //@param {Event}
        searchEvents(ev) {
            let _self = this;
            ev.preventDefault();
            ev.stopPropagation();

            let searchQuery = "*";
            let searchField = $__default["default"]("input[name=search-event]");
            if (searchField.length > 0) {
                searchQuery = $__default["default"]("input[name=search-event]").val();
            }
            if (searchQuery) {
                let _searchQuery = _self.updateQueryString("q", searchQuery);
                _self.updateURL(_searchQuery);
            }

            let regionValue = "";
            let regionField = _self.$el.find("select[name=r]");
            if (regionField.length > 0) {
                regionValue = regionField.val();
            }

            let stateValue = "";
            let stateField = _self.$el.find("select[name=s]");
            if (stateField.length > 0) {
                stateValue = stateField.val();
            }

            console.log("(searchEvents) searchQuery: " + searchQuery +
                "  regionValue: " + regionValue +
                "  stateValue: " + stateValue);

            if (regionValue) {
                let _regionQuery = _self.updateQueryString("r", regionValue);
                _self.updateURL(_regionQuery);
            }
            else {
                let _regionQuery = _self.removeURLParameter("r", "");
                _self.updateURL(_regionQuery);
            }

            if (stateValue) {
                let _stateQuery = _self.updateQueryString("s", stateValue);
                _self.updateURL(_stateQuery);
            }
            else {
                let _stateQuery = _self.removeURLParameter("s", "");
                _self.updateURL(_stateQuery);
            }

            _self.filterButtonClicked = false;
            let _url = _self.getSearchUrl();
            _self.getEventService(_url);
        }

        //Search Events with Filter - UX-150
        //@param {Event}
        searchEventsWithFilter(ev) {
            let _self = this;
            ev.preventDefault();
            ev.stopPropagation();
            let searchQuery;
            if (_self.selectedFilters.length > 0) {
              var filterString = _self.selectedFilters.toString();
              var formattedFilterString = filterString.replace(/,/g, '||');
              searchQuery = formattedFilterString;
            }

            if (searchQuery) {
                let _searchQuery = _self.updateQueryString("q", searchQuery);
                _self.updateURL(_searchQuery);
                 _self.filterButtonClicked = true;
                let _url = _self.getSearchUrl();
                _self.getEventService(_url);
            }
        }

        //init the date picker
        initDatePicker() {
            let _self = this;
            this.calender_i18n();
            _self.initialText = $__default["default"]("input[name=calendardropdowntitle]").val();
            _self.numberOfMonths = 2;
            _self.autoFitCalendars = false;
            _self.maxDate = "+24m +1w";
            _self.inputBoxHtml = `<div class="tnc-startEnd-input family-sans
            fz-v9 fw-normal lhr-v1 txt-clr-g2">
            <h3 class="tnc-selectDatesHeading">Select Dates</h3>
            <label class="tnc-startDateLabel">Start Date<input type="text"
                class="tnc-startDate family-sans fz-v9
                fw-v2" placeholder="MM/DD/YYYY">
            </label>
            <span class="txt-clr-g4">_</span>
            <label class="tnc-endDateLabel">End Date<input type="text"
                class="tnc-endDate family-sans fz-v9
                fw-v2" placeholder="MM/DD/YYYY" disabled="disabled">
            </label></div>`;
            if (_self.isMobile()) {
                _self.numberOfMonths = 24;
                _self.inputBoxHtml += `<table
                class="daterangepicker-custom-header family-sans fz-v6
                fw-normal lh-v5 txt-clr-g2"><tr class="custom-daynames"
                ></tr></table>`;
                setTimeout(function () {
                    let headerDays = $__default["default"]('table.ui-datepicker-calendar thead tr').html();
                    $__default["default"]('.custom-daynames').html(headerDays);
                }, 100);
            }
            _self.options = {
                autoFitCalendars: false,
                customInputBoxes: _self.inputBoxHtml,
                initialText: _self.initialText,
                presetRanges: null,
                cancelButtonText: "",
                applyButtonText: _self.applyBtnTxt,
                clearButtonText: _self.clearBtnTxt,
                dateFormat: "mm/dd/yy",
                clear: function /* istanbul ignore next */ () {
                    let _startDate = $__default["default"](".tnc-startDate").val();
                    if (_startDate) {
                        $__default["default"](this).daterangepicker("destroy");
                        $__default["default"](this).daterangepicker(_self.options);
                        $__default["default"](this).daterangepicker("open");
                        _self.datePickerEvents();
                        _self.resetQueryString();
                        _self.renderPageByDeepLink();
                    } else {
                        $__default["default"](this).daterangepicker("close");
                        _self.restoreScrollPosition();
                    }
                    $__default["default"]("#selectDateFilter").next().removeClass('dateSelectedWidth');
                },
                open: function /* istanbul ignore next */ () {
                    // Save the scroll position in order to maintain upon closing.
                    var scrollPosition = $__default["default"](window).scrollTop();
                    _self.scrollPosition = scrollPosition;

                    if (_self.isMobile()) {
                        let _hg = $__default["default"](window).height();
                        $__default["default"]("body").addClass('stop-scrolling');
                        $__default["default"](".mobile-daterangepicker .ui-datepicker-inline.ui-datepicker-multi-24").css({
                            'max-height': _hg - 250
                        });
                    }
                    let _startDate = $__default["default"](".tnc-startDate").val();
                    $__default["default"](".tnc-startDate").addClass("tnc-DateActive");
                    let _endDate = $__default["default"](".tnc-endDate").val();
                    if (_startDate && _endDate) {
                        if (_startDate === _endDate) {
                            _self.setClass2DateElement(_startDate, _self.startDateClass);
                        } else {
                            _self.setClass2DateElement(_startDate, _self.startDateRangeClass);
                            _self.setClass2DateElement(_endDate, _self.endtDateRangeClass);
                        }
                    } else if (_startDate && !_endDate) {
                        _self.setClass2DateElement(_startDate, _self.startDateClass);
                    }

                    // Add keyboard support for previous and next month buttons.
                    $__default["default"](".ui-datepicker-prev, .ui-datepicker-next").attr(
                        "tabindex", "0");
                    $__default["default"](document).on("keydown",
                        ".ui-datepicker-prev, .ui-datepicker-next",
                        function (event) {
                            if (event.key === " " || event.key === "Enter") {
                                event.target.click();
                                $__default["default"](".ui-datepicker-prev, .ui-datepicker-next").attr(
                                    "tabindex", "0");
                            }
                            if (event.key === " ") {
                                return false;   // prevent page scrolling
                            }
                        }
                    );

                    $__default["default"](".tnc-startDate").focus();
                },
                close: function /* istanbul ignore next */ () {
                    let $this = $__default["default"](this);
                    $__default["default"]("body").removeClass('stop-scrolling');
                    setTimeout(function () {
                        let selectedValue = $this.val();
                        if (selectedValue) {
                            selectedValue = JSON.parse(selectedValue);
                            let _startUrl = _self.updateQueryString("start", selectedValue.start);
                            _self.updateURL(_startUrl);
                            let _endUrl = _self.updateQueryString("end", selectedValue.end);
                            _self.updateURL(_endUrl);
                        } else {
                            _self.resetQueryString();
                        }
                    }, 0);
                    $__default["default"](".tnc-daterangepicker-triggerbutton").first().focus();
                },
                datepickerOptions: {
                    firstDay: 0,
                    numberOfMonths: _self.numberOfMonths,
                    minDate: 0,
                    maxDate: _self.maxDate,
                    dateFormat: "mm/dd/yy",
                    showMonthAfterYear: false,
                    countSelect: 1,
                    beforeShowDay: function (d) {
                        let year = d.getFullYear(),
                            month = ("0" + (d.getMonth() + 1)).slice(-2),
                            day = ("0" + (d.getDate())).slice(-2);
                        let uniqueClass = `cell-${day}-${month}-${year}`;
                        return [true, uniqueClass, ''];
                    },
                    onSelect: function /* istanbul ignore next */ (dateText) {
                        if (this.countSelect % 2 !== 0) {
                            // odd number of items selected
                            this.countSelect++;
                            var object = $__default["default"].extend({}, this, {
                                minDate: $__default["default"].datepicker.parseDate("mm/dd/yy", dateText)
                            });

                            $__default["default"]("#selectDateFilter").daterangepicker({
                                datepickerOptions: object
                            });

                            _self.setClass2DateElement(dateText, _self.startDateClass);
                            $__default["default"](".tnc-startDate").val(dateText);
                            $__default["default"](".tnc-startDate").removeClass("tnc-DateActive");
                            $__default["default"](".tnc-endDate").removeAttr("disabled");
                            $__default["default"](".tnc-endDate").addClass("tnc-DateActive");
                            $__default["default"](".tnc-endDate").focus();
                            _self.datePickerEvents();
                        }
                        else {
                            // even number of items selected
                            let sdate = $__default["default"].datepicker.parseDate("mm/dd/yy", $__default["default"](".tnc-startDate").val());
                            $__default["default"](".tnc-endDate").val(dateText);
                            _self.setClass2DateElement(sdate, _self.startDateRangeClass);
                            _self.setClass2DateElement(dateText, _self.endtDateRangeClass);
                            $__default["default"](".ui-priority-primary").focus();

                            this.countSelect++;
                            _self.datePickerEvents();
                        }
                        let sdate = $__default["default"].datepicker.parseDate("mm/dd/yy", $__default["default"](".tnc-startDate").val());
                        let edate = $__default["default"].datepicker.parseDate("mm/dd/yy", $__default["default"](".tnc-endDate").val());
                        $__default["default"]("#selectDateFilter").daterangepicker("setRange", {
                            start: sdate,
                            end: edate
                        });
                        if ($__default["default"](".tnc-startDate").val()) {
                            $__default["default"]("#selectDateFilter").next().addClass('dateSelectedWidth');
                        }
                        else {
                            $__default["default"]("#selectDateFilter").next().removeClass('dateSelectedWidth');
                        }
                    }
                }
            };

            $__default["default"]("#selectDateFilter").daterangepicker(_self.options);
            $__default["default"]("#mySelector").daterangepicker(_self.options);
            this.datePickerEvents();
        }

        /**
         * Internationalization of datepicker
         */
        calender_i18n() {
            let lang = $__default["default"]('html')[0].lang || 'en-US';
            $__default["default"].datepicker.setDefaults( $__default["default"].datepicker.regional[lang]);
        }

        //register events for start and end date input
        datePickerEvents() {
            let _self = this;

            $__default["default"](".tnc-daterangepicker").on("keydown", function (e) {
                if (e.key === "Escape") {
                    $__default["default"]("#selectDateFilter").daterangepicker("close");
                    _self.restoreScrollPosition();
                }
            });

            //on focus/blur event for start date
            $__default["default"]('.tnc-daterangepicker .tnc-startDate').off("focus").on('focus', function () {
                $__default["default"](this).data('placeholder', $__default["default"](this).attr('placeholder'));
                $__default["default"](this).attr('placeholder', $__default["default"](this).attr('title'));
            }).on('blur', function () {
                $__default["default"](this).attr('placeholder', $__default["default"](this).data('placeholder'));
                let _startDate = $__default["default"](this).val();
                _self.setStartDateInCalendar(_startDate);
            });

            //on press enter key event
            $__default["default"](".tnc-daterangepicker .tnc-startDate").keydown(function (e) {
                if (e.keyCode === 13) {
                    let _startDate = $__default["default"](this).val();
                    _self.setStartDateInCalendar(_startDate);
                }
            });

            //on focus/blur event for end date
            /* istanbul ignore next */
            $__default["default"]('.tnc-daterangepicker .tnc-endDate').off('focus.datepickerfs').on('focus.datepickerfs', function () {
                $__default["default"](this).data('placeholder', $__default["default"](this).attr('placeholder'));
                $__default["default"](this).attr('placeholder', $__default["default"](this).attr('title'));
            }).off('blur.datepickerbr').on('blur.datepickerbr', function (e) {
                e.stopImmediatePropagation();
                $__default["default"](this).attr('placeholder', $__default["default"](this).data('placeholder'));
                let _endDate = $__default["default"](this).val();
                _self.setEndDateInCalendar(_endDate);
            });

            //on press enter key event
            /* istanbul ignore next */
            $__default["default"](".tnc-daterangepicker .tnc-endDate").off("keydown").on("keydown", function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $__default["default"](this).off("blur");
                    let _endDate = $__default["default"](this).val();
                    _self.setEndDateInCalendar(_endDate);
                }
            });

            //on apply dates
            /* istanbul ignore next */
            $__default["default"](".tnc-daterangepicker-buttonpanel .ui-priority-primary.ui-button").on(
                "click", function (e) {

                e.stopImmediatePropagation();
                e.preventDefault();
                setTimeout(function () {
                    let dateRange = $__default["default"]("#selectDateFilter").val() ? JSON.parse(
                        $__default["default"]("#selectDateFilter").val()) : null;
                    let startRange = dateRange ? dateRange.start : null;
                    let endRange = dateRange ? dateRange.end : startRange;
                    if (startRange && endRange) {
                        let _url = _self.getSearchUrl();
                        _self.getEventService(_url, false);
                    }
                }, 0);
                _self.restoreScrollPosition();
            });

            $__default["default"](".tnc-daterangepicker-icon-close").on("click", function (e) {
                e.preventDefault();
                $__default["default"]("#selectDateFilter").daterangepicker("close");
                _self.restoreScrollPosition();
            });
        }

        //add class to start date cell
        //@param {Date, String}
        /* istanbul ignore next */
        setClass2DateElement(dateTxt, dateClass) {
            let dateFormat = new Date(dateTxt); // jshint ignore:line
            let year = dateFormat.getFullYear(),
                month = ("0" + (dateFormat.getMonth() + 1)).slice(-2),
                day = ("0" + (dateFormat.getDate())).slice(-2);
            let uniqueClass = `td.cell-${day}-${month}-${year}`;
            setTimeout(function () {
                $__default["default"](".ui-datepicker-calendar td > a").removeClass(dateClass);
                $__default["default"](".ui-datepicker-calendar").find(uniqueClass).addClass(dateClass);
            }, 0);
        }

        //Highlight the selected start date in calendar
        //@param {Date}
        /* istanbul ignore next */
        setStartDateInCalendar(dateTxt) {
            if (dateTxt) {
                if (this.isValidDate(dateTxt)) {
                    if (!this.isPastDate(new Date().setHours(0, 0, 0, 0), dateTxt)) {
                        let dateFormat = new Date(dateTxt); // jshint ignore:line
                        $__default["default"]("#selectDateFilter").daterangepicker("setRange", {
                            start: dateFormat,
                            end: dateFormat
                        });
                        this.setClass2DateElement(dateTxt, this.startDateClass);
                        $__default["default"](".tnc-endDate").removeAttr("disabled");
                        if (this.isValidDate($__default["default"](".tnc-endDate").val())) {
                            this.setClass2DateElement(dateTxt, this.startDateRangeClass);
                            this.setEndDateInCalendar($__default["default"](".tnc-endDate").val());
                        }
                    } else {
                        $__default["default"](".tnc-startDate").val("");
                        $__default["default"]("#selectDateFilter").next().removeClass('dateSelectedWidth');
                    }
                } else {
                    $__default["default"](".tnc-startDate").val("");
                    $__default["default"]("#selectDateFilter").next().removeClass('dateSelectedWidth');
                    this.showErrorMsg();
                }
            }
        }

        //Highlight the seleced end date
        //@param {Date}
        /* istanbul ignore next */
        setEndDateInCalendar(endDateTxt) {
            let _endDate = new Date(endDateTxt); // jshint ignore:line
            let _startDateTxt = $__default["default"](".tnc-startDate").val();
            if (_startDateTxt && _endDate && endDateTxt) {
                let _startDate = new Date(_startDateTxt); // jshint ignore:line
                if (this.isValidDate(endDateTxt)) {
                    if (this.isPastDate(_startDate, endDateTxt)) {
                        $__default["default"](".tnc-endDate").val("");
                        this.showErrorMsg();
                    } else {
                        $__default["default"]("#selectDateFilter").daterangepicker("setRange", {
                            start: _startDate,
                            end: _endDate
                        });
                        this.setClass2DateElement(_startDateTxt, this.startDateRangeClass);
                        this.setClass2DateElement(endDateTxt, this.endtDateRangeClass);
                    }
                } else {
                    this.showErrorMsg();
                }
            }
        }

        //reset start/end date query string form URL
        resetQueryString() {
            let _startUrl = this.removeURLParameter("start");
            this.updateURL(_startUrl);
            let _endUrl = this.removeURLParameter("end");
            this.updateURL(_endUrl);
        }

        // Set the scroll position to the stored value set when the
        // date picker opened.
        restoreScrollPosition() {
            $__default["default"](window).scrollTop(this.scrollPosition);
        }

        //calculate the total no of pages
        calcTotalPaging(data) {
            this.currentPaging = 0;
            let totalPages = Math.ceil(data.found / this.pagination);
            this.noOfPaging = totalPages - 1;
        }

        //Get events details from Services
        getEventService(data, clearTxtFlag = true) {
            let _self = this;

            if (!data) {
                return false; //no url then don't process the request!
            }

            let obj = {
                url: _self.serviceUrl,
                type: "GET",
                data: data,
                dataType: "json"
            };

            xhrModule__default["default"].initXHR(obj).then((data) => {
                if (data && data.hits && data.hits.found && data.hits.hit) {
                    // Results found
                    _self.calcTotalPaging(data.hits);
                    _self.showNoOfResults(data.hits.found);
                    _self.eventCardsModel(data.hits.hit);
                    if (clearTxtFlag && !_self.filterButtonClicked) {
                        _self._setAnalytics();
                    }
                    _self.isPageLoad = false;
                }
                else {
                    // No results found
                    _self.calcTotalPaging(0);
                    _self.showNoOfResults(0);
                    let _noRecord = _self.noResultFoundTemplate();
                    _self.$results.html(_noRecord);
                    _self.registerEventForNoResultsCTALink();
                    _self.registerEventForClearCTA();
                    if (clearTxtFlag && !_self.filterButtonClicked) {
                        _self._setAnalytics();
                    }
                    _self.isPageLoad = false;
                }
            });
        }

        // Construct the URL to make a call to AWS.
        getSearchUrl() {
            var _self = this;
            let facetFilters = _self.selectedFilters;
            let regionValue = $__default["default"]("input[name=regionName]").val();
            let stateValue = $__default["default"]("input[name=stateName]").val();
            let searchQuery = $__default["default"]("input[name=search-event]").val() ?
                $__default["default"]("input[name=search-event]").val() : "*";
            let dateRange = $__default["default"]("#selectDateFilter").val();
            let domainValue = $__default["default"]("input[name=domain]").val();
            let todayDate = this.getTodayDate();
            let startDate = "",
                endDate = "",
                _selectedState = "",
                _selectedRegion = "",
                _domainValue = "",
                _filterQueries = "";

            let urlQuery = "";
            if (searchQuery) {
                urlQuery += `q=${searchQuery}`;

                if (searchQuery === "*") {
                    urlQuery += `&q.parser=lucene`;
                }
            }

            if (facetFilters && facetFilters.length > 0) {
              let filtQueryString = '';
                  // format filters for query ux-150
                  facetFilters.forEach(function (filter) {
                       filtQueryString += "topic_title:'" + filter + "'" + " ";
                  });
                  _filterQueries = `(or ${filtQueryString})`;
            }

            if (regionValue && regionValue !== "undefined") {
                _selectedRegion = `event_region_title:'${regionValue}'`;
            }

            if (stateValue) {
                _selectedState = `event_locale_title:'${stateValue}'`;
            }

            if (domainValue) {
                _domainValue = `search_by_domain:'${domainValue}'`;
            }

            if (dateRange) {
                dateRange = JSON.parse(dateRange);
                startDate = dateRange.start;
                endDate = dateRange.end;
                urlQuery += `&fq=(and template_name:'eventdetailpage'`;
                urlQuery += `${_domainValue}(or geographic_location:'all_locations'`;
                urlQuery += `(and ${_selectedRegion}${_selectedState})`;
                urlQuery += `)event_start_date: ['${startDate}T00:00:00Z','${endDate}T23:59:59Z'})`;
            }
            else if (facetFilters && facetFilters.length > 0) {
                // if there are filters checked
                urlQuery += `&fq=(and template_name:'eventdetailpage'`;
                urlQuery += `${_domainValue}${_filterQueries}`;
                urlQuery += `(or geographic_location:'all_locations'`;
                urlQuery += `(and ${_selectedRegion}${_selectedState})`;
                urlQuery += `)event_start_date: ['${todayDate}T00:00:00Z',})`;
            }
            else {
                urlQuery += `&fq=(and template_name:'eventdetailpage'`;
                urlQuery += `${_domainValue}(or geographic_location:'all_locations'`;
                urlQuery += `(and ${_selectedRegion}${_selectedState})`;
                urlQuery += `)event_start_date: ['${todayDate}T00:00:00Z',})`;
            }

            urlQuery += `&sort=event_start_date_sort asc`;


            if (this.pagination) {
                urlQuery += `&size=200`;
            }

            let searchUrl = encodeURI(urlQuery);
            return searchUrl;
        }

        //get the next closest event date
        //@param {date, array}
        getClosestDate(now, dates) {
            var closest = Infinity;

            dates.forEach(function (d) {
                var date = new Date(d);
                if (date >= now && date < closest) {
                    closest = d;
                }
            });

            return closest;
        }

        //sort the array by data order
        //@parm {object, object}
        /* istanbul ignore next */
        sortByDate(a, b) {
            var a = new Date(a.sortDate).getTime(), // eslint-disable-line
                b = new Date(b.sortDate).getTime(); // eslint-disable-line
            return a > b ? 1 : -1;
            // return a - b;
        }

        //sort the events by date
        //@param {Object}
        sortEventsByDate(data) {
            let _self = this;
            let dateRange = $__default["default"]("#selectDateFilter").val() ? JSON.parse($__default["default"]("#selectDateFilter").val()) : null;
            let startRange = dateRange ? dateRange.start : null;

            if (startRange === null) {
                startRange = new Date(new Date().setHours(0, 0, 0, 0));
            } else {
                startRange = new Date(`${startRange}`);
                startRange.setHours(0, 0, 0, 0);
            }

            $__default["default"].each(data, function (i, d) {
                let sortDate = null;
                if (d.fields.event_recurring === "yes") {
                    sortDate = _self.getClosestDate(startRange, d.fields.event_start_date);
                } else {
                    sortDate = _self.getClosestDate(startRange, d.fields.event_end_date);
                    if (sortDate && sortDate !== Infinity) {
                        sortDate = d.fields.event_start_date[0];
                    }
                }

                if (sortDate && sortDate !== Infinity) {
                    d.sortDate = sortDate;
                }
            });

            data.sort(this.sortByDate);

            this.eventStore = data;
        }

        //@param {Object}
        eventCardsModel(data) {
            this.eventStore = $__default["default"].extend(true, {}, data);
            this.sortEventsByDate(data);
            this.eventCardsView(0);
        }

        //@param {Number}
        eventCardsView(paging, ev) {
            let data = this.eventStore;
            let __start = (this.pagination * paging);
            let __end = (__start + this.pagination);
            var newEventsStore = data.slice(__start, __end);
            if (ev) {
                this.renderEventCards(newEventsStore, true);
            } else {
                this.renderEventCards(newEventsStore, false);
            }
        }

        //check weather is one day event or happing more than one day
        //@param {Date, Date}
        /* istanbul ignore next */
        isOneDayEvent(start, end) {
            let d1 = new Date(start).toDateString(),
                d2 = new Date(end).toDateString();
            if (new Date(d1).getTime() === new Date(d2).getTime()) {
                return true;
            }
            return false;
        }

        //render the event cards
        //@param {Object, Boolen}
        renderEventCards(data, loadMore) {
            let _self = this;
            let htmlString = "";
            $__default["default"].each(data, function (ii, vv) {
                htmlString += _self.templateForEventCards(vv);
            });

            if (loadMore) {
                this.$results.append(htmlString);
            } else {
                this.$results.html(htmlString);
            }
            this.enableLoadMoreEvents(data);
        }

        registerEventForNoResultsCTALink() {
            // Handle activation of a no-results CTA link.
            let noResultCTALink = $__default["default"](".c-event-aggregation__no-result-cta a");
            noResultCTALink.on("click", function () {
                let linkText = noResultCTALink.text();

                // Set analytics for activating the link.
                let tags = {
                    'event_name': 'member_cta',
                    'link_name': linkText,
                    'member_cta_name': 'c61 events aggregation link'
                };
                utl__default["default"].setAnalyticsByPage(tags, true);
            });
        }

        //On click of Clear CTA, reset all form data
        /* istanbul ignore next */
        registerEventForClearCTA() {
            let _self = this;
            $__default["default"]('.clear-button-container').find('.noResultBtn').on('click', function (e) {
                e.preventDefault();
                $__default["default"]("#selectDateFilter").daterangepicker("clearRange");
                $__default["default"]("#selectDateFilter").daterangepicker("close");
                _self.clearKeyword.trigger('click');
                $__default["default"]('#js-clear-filter').trigger('click');
                $__default["default"]("#selectDateFilter").next().removeClass('dateSelectedWidth');

                // Upon clear, set focus back to the search box.
                $__default["default"](".c-search-filter-sort__col-search input").focus();
            });
        }

        //Event cards Template
        //@param {Object}
        templateForEventCards(d) {
            let template = `<div class="bs_col-12 bs_col-md-4 bs_col-sm-6
            bs_d-flex bs_align-items-stretch">`;
            template += `<a href="${d.fields.link}" class="c-cards-events__card
            txt-p2-hover" id="${d.id}">
            <div class="c-cards-events__content">
            <p class="c-cards-events__date family-sans fz-v6 fw-v4 lhr-v3"
                >${d.fields.event_dates}</p>`;
            if (d.fields.event_site) {
                template += `<p class="c-cards-event__site family-sans
                fz-v5">${d.fields.event_site}</p>`;
            }

            template += `<h4 class="c-cards-events__title"
            >${d.fields.event_title ? d.fields.event_title : d.fields.title}</h4>`;
            if (d.fields.event_all_day === "yes") {
                template += `<p class="c-cards-events__time family-sans fw-v2
                fz-v7 txt-clr-g2">All day</p>`;
            }
            else {
                template += `<p class="c-cards-events__time family-sans fw-v2
                fz-v7 txt-clr-g2">${d.fields.event_timings}</p>`;
            }

            template += `<p class="c-cards-events__description family-sans fz-v7
            lh-v10 txt-clr-g2">${d.fields.description}</p>
            <p class="c-cards-events__eventdetails">See Event Details</p>
            </div></a>`;
            template += `</div>`;
            return template;
        }

        //no result found message
        /* istanbul ignore next */
        noResultFoundTemplate() {
            this.enableLoadMoreEvents();
            this.$el.find(".c-result-count").html(0);
            let searchQuery = $__default["default"]("input[name=search-event]").val();
            let url = window.location.toString();
            let hasDates = (url.indexOf("start=") > -1 ||
                url.indexOf("end=") > -1);
            let canClearSearch = (searchQuery.length > 0 || hasDates);

            let template = `<div class="container__inner-narrow mx-auto
            eg-no-result-found">
            <h3 class="c-event-aggregation__no-result-heading">
                ${this.noResultFound}
            </h3>
            <p class="c-event-aggregation__no-result-cta"
                >${this.unescapeHtml(this.noResultFoundCTA)}</p>`;
            if (canClearSearch) {
                template += `
                <div class="clear-button-container"><a href="#"
                class="c-button noResultBtn
                c-feature-one-column__button txt-clr-alt">
                ${this.noResultButtonText}
                </a></div>`;
            }
            template += `<div>`;
            return template;
        }

        //show no of result found label count
        //@param {Number}
        /* istanbul ignore next */
        showNoOfResults(n) {
            if (n > 0) {
                this.$el.find(".c-result-count").html(n);
            }
            else {
                this.$el.find(".c-result-label").hide();
            }
        }

        //show more button based on results
        //@param Object
        /* istanbul ignore next */
        enableLoadMoreEvents() {
            if (this.noOfPaging >= 1 && (this.noOfPaging > this.currentPaging)) {
                this.$el.find(".c-cards-events__more-events").addClass("show-me");
            } else {
                this.$el.find(".c-cards-events__more-events").removeClass("show-me");
            }
        }

        /* istanbul ignore next */
        _setAnalytics() {
            if (!this.isPageLoad) {
                let eventName = "", keywordValue = "";

                let keywordField = this.$el.find("input[name=search-event]");
                if (keywordField.length > 0) {
                    keywordValue = keywordField.val();
                }
                let hasKeyword = (keywordValue.length > 0);

                let regionValue = "";
                let regionField = this.$el.find("select[name=r]");
                if (regionField.length > 0) {
                    regionValue = regionField.val();
                }

                let stateValue = "";
                let stateField = this.$el.find("select[name=s]");
                if (stateField.length > 0) {
                    stateValue = stateField.val();
                }

                let locationValue = "";
                if (regionValue.length > 0 || stateValue.length > 0) {
                    locationValue = regionValue ? regionValue : "undefined";
                    locationValue += " | ";
                    locationValue += stateValue ? stateValue : "undefined";
                }
                let hasLocation = (locationValue.length > 0);

                if (hasKeyword) {
                    eventName = "asset_search";
                }

                if (hasLocation) {
                    if (hasKeyword) {
                        eventName = "search_find_local";
                    }
                    else {
                        eventName = "find_local_opps";
                    }
                }

                let numSearchResults = this.$el.find(
                    ".c-result-count-desktop").text();
                numSearchResults = numSearchResults ? numSearchResults : 0;

                let tags = {
                    "search_type": "events",
                    "event_name": eventName,
                    "num_search_results": numSearchResults
                };
                if (hasKeyword) {
                    tags["search_term"] = keywordValue;
                }
                if (hasLocation) {
                    tags["local_opp_search"] = locationValue;
                }

                utl__default["default"].setAnalyticsByPage(tags, true);
            }
        }

        _setAnalyticsFilter() {
            if (this.selectedFilters.length > 0) {
                let filterType = this.filterTitle.trim();
                let filterTags = {
                    "event_name": "filter_applied",
                    "filter_type": filterType
                };
                utl__default["default"].setAnalyticsByPage(filterTags, true);
            }
        }

    }

    var eventAggregation_component = new EventAggregation();

    return eventAggregation_component;

})($, TNC.Select, TNC.Utility, TNC.XHR);
//# sourceMappingURL=event-aggregation.component.js.map

this.TNC = this.TNC || {};
this.TNC.Forms = (function ($, xhrModule, utl, browserStorageModule) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var xhrModule__default = /*#__PURE__*/_interopDefaultLegacy(xhrModule);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);
    var browserStorageModule__default = /*#__PURE__*/_interopDefaultLegacy(browserStorageModule);

    // Forms component JS goes here

    /** Forms Class. */
    class Forms {

        constructor() {
            this.passedValidation = true; // Set true to pass form with zero required fields
            this.minAgeOfPerson = 0;
            this.initialize();
            this.events();
        }

        /**
         * Initialization function
         */
        initialize() {
            const form = $__default["default"]('form.start-form').first();
            if (form.length === 0) {
                return;
            } else {
                $__default["default"]('#btn-reset').on('click', this.resetForm);
                this.initCountryStateDropdowns();
                this.registerFormSubmitHandler();
                this.checkCookie();

                if (this.isEngagingNetworksForm(form)) {
                    let _this = this;
                    this.fetchEngagingNetworksPageDetails(form).then(function() {
                        // Page Load analytics - if there is no form cookie present
                        if (!_this.formCookie) {
                            _this.initFormLoadAnalytics();
                        }
                    });
                } else if (!this.formCookie) {
                   // Page Load analytics - if there is no form cookie present
                    this.initFormLoadAnalytics();
                }
            }
        }

        /**
         * Creates a promise that will retrieve Engaging Networks page details for 
         * this form and add them to the form as attributes
         *
         * @param form
         * @return promise
         */
        fetchEngagingNetworksPageDetails(form) {
            const pageID = form.find("input[name='pageID']").val();
            const obj = {
                url: '/bin/tnc/supporterservice.pagedetails.html',
                data: {'pageID': pageID},
                type: 'GET',
                dataType: 'json'
            };

            return xhrModule__default["default"].initXHR(obj).then((response) => {
                form.attr('txn6', response['Digital Interaction Code']);
                form.attr('txn7', response['External Vendor ID']);
                form.attr('txn8', response['URL Digital Marketing Code']);
                form.attr('txn9', response['Event Additional Designation']);
                form.attr('txn10', response['Global Digital Tag Attribute']);
                form.attr('campaignId', response['campaignId']);
                form.attr('form_id', response['id']);
            });
        }

        /**
         * Test if the passed form is an Engaging Networks form
         */
        isEngagingNetworksForm(form) {
            return $__default["default"](form).attr('action') === '/bin/tnc/supporterservice.form.html';
        }

        /**
         * Register Events
         */
        events() {
            let self = this;

            //State dropdown render based on country chnage
            $__default["default"]('select.form-control-country').off('changed.bs.select').on('changed.bs.select', function () {
                if($__default["default"](this).val()) {
                    self.populateStateDropdown($__default["default"](this), false);
                }
            });

            //State dropdown render based on country chnage
            $__default["default"]('select.form-control-month').off('changed.bs.select').on('changed.bs.select', function () {
                if($__default["default"](this).val()) {
                    self.populateDates($__default["default"](this));
                }
            });
        }
        checkCookie() {
          var initFormType = $__default["default"]('form.start-form').attr('data-formType');
          var initFormName = $__default["default"]('form.start-form').attr('data-formname');
          //set up cookie string to look for
          var gcCookieName = 'TNC_Gated_Content_' + initFormName.replace(/\s+/g, '_');
          //check that gated content cookie present
          var gcCookie = browserStorageModule__default["default"].getCookie(gcCookieName);
          // if you are on a gated content form page AND a gated content cookie exists
          if (initFormType === 'gated_content' && gcCookie) {
              // remove TNC_Gated_Content_ prefix from cookie
              var cookieFormName = gcCookieName.replace('TNC_Gated_Content_', '');
              //remove underscores from cookie name
              var formattedCookieFormName = cookieFormName.replace(/_/g, ' ');
              //check if newly formatted cookie name matches the form name on page
              if (formattedCookieFormName === initFormName) {
                //if so, do hide/show of containers
                $__default["default"]('.template-intro-container').hide();
                $__default["default"]('.template-body-container').show();
                this.formCookie = true;
              } else {
                this.formCookie = false;
              }
          }
        }
        async initCountryStateDropdowns() {
            this.countryStateData = await this.retrieveCountryStateData();
            this.populateCountryDropdowns();
            
            $__default["default"]('.form-control-state').each((index, element) => {
                let eleMentId = element.getAttribute('id');
                if ($__default["default"](`.form-control-country[data-stateid='${eleMentId}']`).length === 0) {
                    let countryId = element.getAttribute('data-def-countryId');
                    let name = element.getAttribute('data-def-name');
                    if (typeof countryId !== 'undefined' && countryId !== "false" && typeof name !== 'undefined' && name!=="false") {
                        this.populateStateDropdown(element, countryId);
                    }
                }
            });
        }
        validateFormElements() {
            // for input fields
            $__default["default"]('.form-control-input, .form-control-textarea').each((index, element) => {
                let isRequired = $__default["default"](element).attr('data-required');
                let validationText = $__default["default"](element).attr('data-pattern');
                let _pattern = new RegExp(validationText);
                let _value = $__default["default"](element).val();
                if (isRequired === 'true') {
                    if (_value === '' || _value === undefined || _value === null) {
                        $__default["default"](element).parent().find('.error-msg').addClass('has-error txt-clr-err');
                        $__default["default"](element).addClass('border-error icon-error-forms');
                        this.passedValidation = false;
                    } else {
                        this.regExpTest($__default["default"](element), _pattern, _value);
                    }
                }
                else {
                    if (_value !== '' && _value !== undefined && _value !== null &&
                        validationText !== '' && validationText !== undefined && validationText !== null) {
                        this.regExpTest($__default["default"](element), _pattern, _value);
                    }
                }
            });
            // for radio and check-box
            $__default["default"]('.form-control-radio, .form-control-checkbox').each((index, element) => {
                let isRequired = $__default["default"](element).attr('data-required');
                if (isRequired === 'true') {
                    // Fix for TNCE-631
                    let parentElem = $__default["default"](element).parent().find('.error-msg');
                    if (parentElem.length === 0) {
                        parentElem = $__default["default"](element).parents('.form-check').find('.error-msg');
                    }
                    if ($__default["default"](element).prop('checked') === false) {
                        parentElem.addClass('has-error txt-clr-err');
                        this.passedValidation = false;
                    } else {
                        parentElem.removeClass('has-error txt-clr-err');
                    }
                }
            });
            // for dropdowns
            $__default["default"]('select.form-control-select').each((index, element) => {
                this.validateDropDowns(element);
            });
        }
        validateDropDowns(element) {
            let isRequired = $__default["default"](element).attr('data-required');
            let $targetWrapper = $__default["default"](element).closest('.form-group-select');
            if (isRequired === 'true') {
                let selectedValue = $__default["default"](element).val();
                if (selectedValue === '' || selectedValue === undefined || selectedValue === null) {
                    $targetWrapper.find('.error-msg').addClass('has-error txt-clr-err');
                    $targetWrapper.find('button.dropdown-toggle').addClass('border-error');
                    this.passedValidation = false;
                } else {
                    $targetWrapper.find('.error-msg').removeClass('has-error txt-clr-err');
                    $targetWrapper.find('button.dropdown-toggle').removeClass('border-error');
                }
            }
        }
        validateDateElement() {
            // todo validate date range
            let dateArray = [];
            if ($__default["default"]('.form-control-month').length === 0) {
                return;
            } else {
                $__default["default"]('select.form-control-month, select.form-control-date, select.form-control-year').each((index, element) => {
                    this.validateDropDowns(element);
                    let selectedValue = $__default["default"](element).val();
                    if (selectedValue !== undefined && selectedValue !== '') {
                        if (isNaN(parseInt(selectedValue))) {
                            dateArray.push(this.getMonthFromString(selectedValue));
                        } else {
                            dateArray.push(parseInt(selectedValue));
                        }
                    }
                    if ((index + 1) % 3 === 0) {
                        if (dateArray.length === 3) {
                            this.validateFullDate(dateArray, element);
                        } else if (dateArray.length > 0 && dateArray.length < 3) {
                            this.passedValidation = false;
                            $__default["default"](element).parents('.form-group-select').find('.error-msg').addClass('has-error txt-clr-err');
                            $__default["default"](element).parents('.form-group-select').find('.list-item').addClass('border-error');
                        }
                        dateArray = [];
                    }
                });
            }
        }
        validateGroupElements(container, elementType) {
            $__default["default"](container).each((index, element) => {
                let checkedCount = 0;
                let isRequired = $__default["default"](element).attr('data-required');
                if (isRequired === 'true') {
                    $__default["default"](element).children().each((index, childElement) => {
                        if ($__default["default"](childElement).find(elementType).prop('checked')) {
                            checkedCount += 1;
                        }
                    });

                    if (checkedCount > 0) {
                        $__default["default"](element).parent().find('.error-msg').removeClass('has-error txt-clr-err');
                        $__default["default"](element).removeClass('border-error');
                    } else {
                        this.passedValidation = false;
                        $__default["default"](element).parent().find('.error-msg').addClass('has-error txt-clr-err');
                        $__default["default"](element).addClass('border-error');
                    }
                }
            });
        }
        validateFullDate(dateArray, element) {
            let date = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
            let currentDate = new Date();
            let variationType = $__default["default"](element).parents('.form-group-select').find('select.form-control-month').attr('data-variation');
            let error = false;
            if (!isNaN(date.getFullYear()) && date.getFullYear() > 0) {
                let isValidFebDate = date.getMonth() === dateArray[0] - 1 ? true : false;
                if (variationType === 'date') {
                    if (!isValidFebDate) {
                        error = true;
                        this.passedValidation = false;
                    } else {
                        error = false;
                    }
                } else if (variationType === 'date_of_birth') {
                    if ((date.getTime() > currentDate.getTime()) || ((currentDate.getFullYear() - date.getFullYear()) < this.minAgeOfPerson)
                        || !isValidFebDate) {
                        this.passedValidation = false;
                        error = true;
                    } else {
                        error = false;
                    }
                }
            } else {
                this.passedValidation = false;
                error = true;
            }
            if (error) {
                $__default["default"](element).parents('.form-group-select').find('.error-msg').addClass('has-error txt-clr-err error-msg-date');
                $__default["default"](element).parents('.form-group-select').find('.list-item').addClass('border-error');
            } else {
                $__default["default"](element).parents('.form-group-select').find('.error-msg').removeClass('has-error txt-clr-err error-msg-date');
                $__default["default"](element).parents('.form-group-select').find('.list-item').removeClass('border-error');
            }
        }

        /**
         * Register the form submission handler
         *
         */
        registerFormSubmitHandler() {
            $__default["default"]('form.start-form').on('submit', (e) => {
                e.preventDefault();
                let form = $__default["default"]('form.start-form');
                let formSubmitBttn = form.find('.form-button__submit');
                let submitText = form.find('._formSubmitTitle');
                let processingText = form.find('._formProcessingTitle');
                // add 'processing' indicator to submit button and disable button so user can't click submit again during form processing
                formSubmitBttn.attr("disabled", true);
                formSubmitBttn.html(processingText.val());
                form.find('.freshaddress-error').css('display', 'none');
                this.passedValidation = true;
                this.validateFormElements();
                this.validateReCaptcha();
                this.validateDateElement();
                this.validateGroupElements('.form-control-radioGroup-container', '.form-control-radio');
                this.validateGroupElements('.form-control-checkboxGroup-container', '.form-control-checkbox');

                if (this.passedValidation) {
                    let url = $__default["default"]('form.start-form').attr('action');
                    let successUrl = $__default["default"]('form.start-form').attr('data-success-url');
                    if (url === '/bin/tnc/supporterservice.form.html') {
                        // Engaging Networks
                        this.submitToEngagingNetworks(url, successUrl, form);
                    } else {
                        let email = form.find("input[type='email']").val();
                        utl__default["default"].validateEmailAddress(email).then(response => {
                            let isEmailValid = utl__default["default"].handleFreshAddressResponse(response, form);
                            if (isEmailValid) {
                                // Legacy behavior
                                this.submitFormRequest(url, successUrl);
                            } else {
                              // if freshAddress not valid, remove processing indicator from submit button so user can correct errors and submit again
                              formSubmitBttn.attr("disabled", false);
                              formSubmitBttn.text(submitText.val());
                            }
                        });
                    }
                } else {
                    // if not valid, remove processing indicator from submit button so user can correct errors and submit again
                    formSubmitBttn.attr("disabled", false);
                    formSubmitBttn.text(submitText.val());
                    this.scrollToError();
                    this.addFormFailedAnalytics('validation');
                }
            });
        }

        /**
         * Submit the user provided form data to the Engaging Networks web servlet.
         *
         * @param {string} url  the URL of the Engaging Networks servlet
         * @param {string} successUrl  the URL to navigate to if the EN submissions is successful
         * @param {object} form  the submission form element
         */
        submitToEngagingNetworks(url, successUrl, form) {
            const formData = this.constructFormData();
            const requestObj = {
                url: `${url}`,
                data: formData,
                type: 'GET',
                dataType: 'json'
            };

            let formSubmitBttn = form.find('.form-button__submit');
            let submitText = form.find('._formSubmitTitle');

            xhrModule__default["default"].initXHR(requestObj).then((response) => {
                if (response['result'] === "success") {
                    this.formSuccessAnalytics(formData);
                    form.find('.c-field__input[type=email').removeClass('border-error icon-error-forms');
                    form.find('.freshaddress-error').css('display', 'none');
                    window.location.href = successUrl;
                } else if (response['result'] === 'FAIL') {
                    // if failure, remove processing indicator from submit button so user can correct errors and submit again
                    formSubmitBttn.attr("disabled", false);
                    formSubmitBttn.text(submitText.val());
                    this.addFormFailedAnalytics('form_email_en_error_submit', 'Error submitting to EN');
                    this.addFormFailedAnalytics('service');
                    let errorUrl = $__default["default"]('form.start-form').attr('data-error-url');
                    window.location.href = errorUrl;
                } else {
                    utl__default["default"].handleFreshAddressResponse(response, form);
                    // if not valid, remove processing indicator from submit button so user can correct errors and submit again
                    formSubmitBttn.attr("disabled", false);
                    formSubmitBttn.text(submitText.val());
                }
            });
        }

        /**
         * Submit the user provided form data to a specified remote web service URL.
         *
         * @param {string} url  the URL to submit the request to
         * @param {string} successUrl  the URL to navigate to if the submission is successful
         */
        submitFormRequest(url, successUrl) {
            let u = $__default["default"]('input:hidden[name=u]').val();
            let id = $__default["default"]('input:hidden[name=id]').val();
            // new src field for mailchimp lists
            // let src = $('input:hidden[name=src]').val();180
            let formType = $__default["default"]('form.start-form').attr('data-formType');
            let formName = $__default["default"]('form.start-form').attr('data-formname');
            
            const formData = this.constructFormData();
            const requestObj = {
                url: `${url}?u=${u}&id=${id}&c=?`,
                data: formData,
                type: 'GET',
                dataType: 'json'
            };

            xhrModule__default["default"].initXHR(requestObj).then((response) => {
                if (response['result'] === "success") {
                    if (formType === 'gated_content') {
                        // greater specificity w/ gated content cookies using form names
                        // allows for multiple cookies to exist but hide/show to occur on specific form page
                        let gatedContentCookie = 'TNC_Gated_Content_' + formName.replace(/\s+/g, '_');
                        browserStorageModule__default["default"].setCookie(gatedContentCookie, 'gcCookie', 180);
                    }
                    this.formSuccessAnalytics(formData);
                    window.location.href = successUrl;
                    // if already subscribed
                } else if (response['result'] === "error" && response['msg'].indexOf("already subscribed") >= 0) {
                    if (formType === 'gated_content') {
                        let gatedContentCookie = 'TNC_Gated_Content_' + formName.replace(/\s+/g, '_');
                        browserStorageModule__default["default"].setCookie(gatedContentCookie, 'gcCookie', 180);
                    }
                    //log error to tealium - SYS-4342
                    this.addFormFailedAnalytics('form_email_mc_error_submit', response['msg']);
                    // this.formSuccessAnalytics();
                    window.location.href = successUrl;
                } else {
                    // log error to tealium - SYS-4342
                    this.addFormFailedAnalytics('form_email_mc_error_submit', response['msg']);
                    this.addFormFailedAnalytics('service');
                    let errorUrl = $__default["default"]('form.start-form').attr('data-error-url');
                    window.location.href = errorUrl;
                }
            }, () => {
                this.addFormFailedAnalytics('service');
                let errorUrl = $__default["default"]('form.start-form').attr('data-error-url');
                window.location.href = errorUrl;
            });
        }

        /**
         * Function added to move focus to the first error field
         * on form submit.
         */
        scrollToError() {
            let firstErrorElement = $__default["default"]('.has-error').first().parent();
            $__default["default"]('html, body').animate({
                scrollTop: parseInt(firstErrorElement.offset().top)
            }, 200);
            if (firstErrorElement.find('input').length > 0) {
                firstErrorElement.find('input').focus();
            } else if (firstErrorElement.find('textarea').length > 0) {
                firstErrorElement.find('textarea').focus();
            }
        }

        validateReCaptcha() {
            if (!$__default["default"]('#g-recaptcha-response').length) {
                return;
            }
            let recaptcha = $__default["default"]('#g-recaptcha-response').val();
            let path_recaptcha = $__default["default"]('.start-form').attr('data-google-recaptcha-url');

            if (recaptcha === '') {
                this.passedValidation = false;
    			$__default["default"]('#g-recaptcha-response').parents('.form-group').find('.error-msg').addClass('has-error txt-clr-err');
            }

            const obj = {
                url: path_recaptcha,
                data: { 'g-recaptcha-response': recaptcha },
                type: 'GET',
                dataType: 'json',
                cache: false,
                async: false
            };
            xhrModule__default["default"].initXHR(obj).then((response) => {
                if (response.success) {
    				$__default["default"]('#g-recaptcha-response').parents('.form-group').find('.error-msg').removeClass('has-error txt-clr-err');
                    
                } else {
                    this.passedValidation = false;
                }
            }, () => {
                this.passedValidation = false;
            });
        }
        regExpTest($this, pattern, value) {
            if (pattern.test(value)) {
                $this.parent().find('.error-msg').removeClass('has-error txt-clr-err');
                $this.removeClass('border-error icon-error-forms');
            } else {
                $this.parent().find('.error-msg').addClass('has-error txt-clr-err');
                $this.addClass('border-error icon-error-forms');
                this.passedValidation = false;
            }
        }
        populateDates($target) {
            let $parentWrapper = $target.parents(".form-group-select"),
            $dateElement = $parentWrapper.find('select.form-control-date'),
            selectedMonth = $target.val(),
            noOfDays;

            if (selectedMonth === undefined) {
                $target.selectpicker('val', '');
                return;
            }
            switch (selectedMonth) {
                case 'February':
                    noOfDays = 29;
                    break;
                case 'January':
                case 'March':
                case 'May':
                case 'July':
                case 'August':
                case 'October':
                case 'December':
                    noOfDays = 31;
                    break;
                default:
                    noOfDays = 30;
                    break;
            }

            let innerHtml = '';
            $dateElement.empty();
            for (let i = 1; i <= noOfDays; i++) {
                let displayValue = i < 10 ? '0' + i : i;
                innerHtml += `<option value='${i}'>${displayValue}</option>`;
            }
            $dateElement.append(innerHtml);
            $dateElement.selectpicker('refresh');

            // For Dropdown Styles
            $dateElement.prop('disabled', false);

            //onchange render year
            let self = this;
            $dateElement.off('changed.bs.select').on('changed.bs.select', function () {
                self.populateYears($__default["default"](this));
            });
        }
        populateYears($target) {
            let selectedMonth = $target.val(),
            $parentWrapper = $target.parents(".form-group-select"),
            $monthElement = $parentWrapper.find('select.form-control-month'),
            $yearElement = $parentWrapper.find('select.form-control-year');

            if (selectedMonth === undefined) {
                $target.selectpicker('val', '');
                return;
            }
            this.minAgeOfPerson = parseInt($monthElement.attr('data-minage'));
            let startYear = parseInt($monthElement.attr('data-startyear')),
            endYear = parseInt($monthElement.attr('data-endyear')),
            innerHtml = '';
            $yearElement.empty();
            for (let i = 0; i <= endYear - startYear; i++) {
                innerHtml += `<option value='${endYear - i}'>${endYear - i}</option>`;
            }
            $yearElement.append(innerHtml);
            $yearElement.selectpicker('refresh');

            // For Dropdown Styles
            $yearElement.removeClass('disabled');
        }
        getMonthFromString(mon) {
            let tempDate = Date.parse(mon + '1, 2012');
            if (!isNaN(tempDate)) {
                return new Date(tempDate).getMonth() + 1;
            }
            return -1;
        }
        resetForm() {
            this.passedValidation = true;
            $__default["default"]('form.start-form').trigger('reset');
            $__default["default"]('.error-msg').removeClass('has-error');
            $__default["default"]('.border-error').removeClass('border-error');
            $__default["default"]('.icon-error-forms').removeClass('icon-error-forms');

            //reset custom dropdowns
            $__default["default"]("select.form-control-select").each(function(){
                $__default["default"](this).selectpicker('val', '');

                //reset state dropdown if its maped with country
                if($__default["default"](this).hasClass('form-control-state')) {
                    let _id = $__default["default"](this).attr("id");
                    if($__default["default"](`.form-control-country[data-stateid='${_id}']`).length > 0) {
                        $__default["default"](this).prop('disabled', true);
                        $__default["default"](this).selectpicker('refresh');
                    }
                }

            });

            if ($__default["default"]('#g-recaptcha-response').length) {
                grecaptcha.reset();
            }
            this.initializeDefaultCountry();
        }
        
        constructFormData() {
            let form = $__default["default"]('form.start-form');
            let elementArr = form.serializeArray();
            let resultData = {};
            elementArr.forEach((value) => {
                if (value.name !== 'u' && value.name !== 'id'
                    && value.name !== 'g-recaptcha-response' && value.name !== 'subscribe') {
                    resultData[value.name] = value.value;
                }
            });

            this.populateParams(resultData, 'txn1', form);
            this.populateParams(resultData, 'txn6', form);
            this.populateParams(resultData, 'txn7', form);
            this.populateParams(resultData, 'txn8', form);
            this.populateParams(resultData, 'txn9', form);
            this.populateParams(resultData, 'txn10', form);

            return resultData;
        }

        /**
         * txn fields should be assigned a value from the highest precedence source for which
         * a value is defined.  The precedence of sources is as follows:
         * 
         * 1.) URL parameters
         * 2.) Page details fields (should be stashed as form attributes at this point)
         * 3.) Hidden form fields (should already be set as the default txn resultData values at this point)
         */
        populateParams(resultData, param, form) {
            const resultKey = "general." + param;
            const urlKey = "en_" + param;
            const urlParams = new URL(window.location).searchParams;

            if (urlParams.has(urlKey)) {
                resultData[resultKey] = urlParams.get(urlKey);
            } else if (form && form.attr(param)) {
                resultData[resultKey] = form.attr(param);
            }
        }

        populateCountryDropdowns() {
            $__default["default"]('select.form-control-country').each((index, countryElement) => {
                let innerHtml = '';
                $__default["default"](countryElement).empty();
                this.countryStateData.CountriesAndStates.forEach((element) => {
                    //Grab different value for Engaging Networks
                    if ($__default["default"](countryElement).hasClass('form-control-country-en')) {
                        if (element.countryEnValue !== undefined) {
                            innerHtml += `<option value="${element.countryEnValue}">${element.countryName}</option>`;
                        }
                    } else {
                        innerHtml += `<option value="${element.countryValue}">${element.countryName}</option>`;
                    }
                });
                $__default["default"](countryElement).append(innerHtml);

                this.selectDefaultCountry(countryElement);
                //re-register events
                this.events();
            });
        }
        async retrieveCountryStateData() {
            let path_country = $__default["default"]('.start-form').attr('data-country-mapping-url');

            const obj = {
                url: path_country,
                type: 'GET',
                dataType: 'json',
                cache: false,
                async: false
            };

            return xhrModule__default["default"].initXHR(obj);
        }
        selectDefaultCountry(countryElement) {
            let self = this;
            let attachedState = $__default["default"](countryElement).attr('data-stateid');
            let defaultCountry = $__default["default"](`select[id="${attachedState}"]`).attr('data-def-countryId');
            if (typeof defaultCountry !== 'undefined' && defaultCountry !== 'false') {

                //Once Custom dropdown is ready set default selected value
                $__default["default"](countryElement).off('loaded.bs.select').on('loaded.bs.select', function () {
                    $__default["default"](this).val(defaultCountry).selectpicker('refresh');
                });

                //render state dropdown on change/onload
                $__default["default"](countryElement).off('refreshed.bs.select').on('refreshed.bs.select', function () {
                    if($__default["default"](this).val()) {
                        self.populateStateDropdown(countryElement, false);
                    }
                });

            }
        }

        /**
         * Render State Dropdown
         * @param {*} countryElement
         */
        populateStateDropdown(countryElement, countryId = false) {
            let countryData = this.countryStateData,
            innerHtml = '',
            countrySelectedValue,
            populateStateDropdownId,
            $stateDropDown;

            if (countryData !== null && countryData !== undefined) {
                if(countryId) {
                    countrySelectedValue = countryId;
                    $stateDropDown = $__default["default"](countryElement);
                } else {
                    countrySelectedValue = $__default["default"](countryElement).val();
                    populateStateDropdownId =  $__default["default"](countryElement).attr('data-stateid');
                    $stateDropDown = $__default["default"](`select[id='${populateStateDropdownId}'`);
                }

                $__default["default"]($stateDropDown).empty();

                let selectedCountry = countryData.CountriesAndStates.find((element) => {
                    return (element.countryValue === countrySelectedValue ||
                    element.countryEnValue === countrySelectedValue);
                });
                if (selectedCountry !== null && selectedCountry !== undefined) {

                    for (let prop in selectedCountry.States) {
                        if ($stateDropDown.hasClass('form-control-state-en')) {
                            if (selectedCountry.States[prop].envalue !== undefined) {
                                innerHtml += `<option value=${selectedCountry.States[prop].envalue}>${prop}</option> `;
                            }
                        } else {
                            innerHtml += `<option value=${selectedCountry.States[prop].value}>${prop}</option> `;
                        }
                    }
                }
                $__default["default"]($stateDropDown).append(innerHtml);

                // For Dropdown Styles
                $__default["default"]($stateDropDown).prop('disabled', false);
                $__default["default"]($stateDropDown).selectpicker('refresh');
            }
        }

        /**
        * Trigger Analytics call on page load #if form embeded
        **/
        initFormLoadAnalytics() {
            if (typeof utag_data !== "undefined") {
                if (utag_data && utag_data.page_category !== "undefined" && utag_data.page_category === "form_embed") {
                    let form = $__default["default"]('form.start-form').first();
                    let formType = form.attr('data-formType');
                    let formName = form.attr('data-formName');
                    let formLoadData = {
                        'event_name': 'form_embed',
                        'form_type': formType,
                        'form_name': formName
                    };

                    // If EN form, load additional information retrieved from Engaging Networks
                    if (this.isEngagingNetworksForm(form)) {
                        formLoadData.en_campaignId = form.attr('campaignId');
                        formLoadData.form_id = form.attr('form_id');
                    }

                    // Trigger Analytics Utag.Link Call 100ms untill utag available TNCE-637
                    /* eslint-disable */
                    let interval = setInterval(function () {
                        if (typeof utag !== "undefined") {
                            utl__default["default"].setAnalyticsByPage(formLoadData, true);
                            clearInterval(interval);
                            interval = 0;
                        }
                    }, 100);
                    /* eslint-enable */
                }
            }
        }

        /**
        * Trigger Analytics call on form error
        **/
        addFormFailedAnalytics(type, msg) {
            msg = msg || '';
            let formType = $__default["default"]('form.start-form').attr('data-formType');
            let formName = $__default["default"]('form.start-form').attr('data-formName');
            let pageName = (typeof utag_data !== "undefined" && utag_data.page_name) ? utag_data.page_name : 'undefined';
            let formErrorData = {};
            //  SYS-4342 - if there's a msg param, remove user email emailassign to errorMsg
            let emailTxt = 'Email ';
            let errorMsg = emailTxt + msg.substring(msg.indexOf("is already subscribed"));
            // SYS-4342 - send MC error to tealium
            if (type === 'form_email_mc_error_submit') {
              formErrorData = {
                'form_type': formType,
                'form_name': formName,
                'email_signup_location': pageName,
                'event_name': 'form_email_mc_error_submit'
              };
            } else {
              formErrorData = {
                'form_type': formType,
                'form_name': formName,
                'event_name': 'form_error'
              };
            }

            if (type === 'service') {
                formErrorData.form_field_error_field = 'mail chimp field';
                formErrorData.form_field_error_value = 'mail chimp field error';
            } else if (type === 'form_email_mc_error_submit') {
                formErrorData.form_field_error_field = 'Mail Chimp Error';
                //pipe response message from MC call to tealium as error msg
                formErrorData.form_field_error_value = errorMsg;
            } else {
                let errorMessegeString = '', errorElementsString = '';
                let errorElements = $__default["default"]('.has-error').parent().find('.form-control');
                let errorMesseges = $__default["default"]('.has-error');

                $__default["default"](errorElements).each((index, element) => {
                    if ($__default["default"](element).parent().hasClass('form-control-radioGroup-container') ||
                        $__default["default"](element).parent().hasClass('form-control-checkboxGroup-container')) {
                        let groupElementName = $__default["default"](element).parent().attr('data-group-name');
                        if (errorElementsString.indexOf(groupElementName) === -1) {
                            errorElementsString += groupElementName + '|';
                        }
                    } else {
                        if ($__default["default"](element).prop('name') === undefined && $__default["default"](element).attr('name') === undefined) {
                            errorElementsString += $__default["default"](element).attr('data-name') + '|';
                        } else if ($__default["default"](element).prop('name') !== undefined) {
                            errorElementsString += $__default["default"](element).prop('name') + '|';
                        } else {
                            errorElementsString += $__default["default"](element).attr('name') + '|';
                        }
                    }
                });

                $__default["default"](errorMesseges).each((index, element) => {
                    errorMessegeString += $__default["default"](element).text().trim() + '|';
                });

                formErrorData.form_field_error_field = errorElementsString.slice(0, -1);
                formErrorData.form_field_error_value = errorMessegeString.slice(0, -1);
            }

            //Trigger Analytics Utag.Link Call
            utl__default["default"].setAnalyticsByPage(formErrorData, true);
        }

        /**
        * Trigger Analytics on form success [OPT-363]
        **/
        formSuccessAnalytics(formData) {
            let formSuccessData = {};
            let $formEl = $__default["default"]('form.start-form'), formType = $formEl.attr('data-formType'), formName = $formEl.attr('data-formName');
            let emailOptin = $formEl.find('input.form-control-terms[data-condition-type="email-optin"]').prop('checked'),
                textOptin = $formEl.find('input.form-control-terms[data-condition-type="text-optin"]').prop('checked'),
                pageName = (typeof utag_data !== "undefined" && utag_data.page_name) ? utag_data.page_name : 'undefined';

            formSuccessData = {
                'form_type': formType,
                'form_name': formName,
                'email_signup_location': pageName,
                'event_category': 'email sign up',
                'event_action': pageName
            };

            if (this.isEngagingNetworksForm($formEl)) {
                formSuccessData.en_txn6 = formData['general.txn6'];
                formSuccessData.en_txn7 = formData['general.txn7'];
                formSuccessData.en_txn8 = formData['general.txn8'];
                formSuccessData.en_txn9 = formData['general.txn9'];
                formSuccessData.en_txn10 = formData['general.txn10'];

                formSuccessData.en_campaignId = $formEl.attr('campaignId');
                formSuccessData.form_id = $formEl.attr('form_id');
            }

            if (formType !== 'event') {
                if (emailOptin && textOptin) {
                    formSuccessData.event_name = 'frm_emt_emo_txt_submit';
                    formSuccessData.text_signup_location = pageName;
                } else if (emailOptin && !textOptin) {
                    formSuccessData.event_name = 'frm_emt_emo_submit';
                } else if (textOptin && !emailOptin) {
                    formSuccessData.event_name = 'frm_emt_emo_submit';
                    formSuccessData.text_signup_location = pageName;
                } else {
                    formSuccessData.event_name = 'frm_emt_submit';
                }
            } else {
                if (emailOptin && textOptin) {
                    formSuccessData.event_name = 'frm_evt_emt_emo_txt_submit';
                    formSuccessData.text_signup_location = pageName;
                } else if (emailOptin && !textOptin) {
                    formSuccessData.event_name = 'frm_evt_emt_emo_submit';
                } else if (textOptin && !emailOptin) {
                    formSuccessData.event_name = 'frm_evt_emt_txt_submit';
                    formSuccessData.text_signup_location = pageName;
                } else {
                    formSuccessData.event_name = 'frm_evt_emt_submit';
                    formSuccessData.text_signup_location = pageName;
                }
            }
            //Trigger Analytics Utag.Link Call
            utl__default["default"].setAnalyticsByPage(formSuccessData, true);
        }

        hideDropdown(e) {
            var open_dd_containers = $__default["default"](".is-active.icon-drop-down-active");
            if (open_dd_containers.length <= 0) {
                return;
            }
            $__default["default"].each(open_dd_containers, function (key, value) {
                var dd_container = $__default["default"](value);
                if (!dd_container.is(e.target)
                    && dd_container.has(e.target).length === 0) {
                    dd_container.removeClass('is-active icon-drop-down-active');
                }
            });
        }
    }
    var forms_component = new Forms();

    return forms_component;

})($, TNC.XHR, TNC.Utility, TNC.BrowserStorage);
//# sourceMappingURL=forms.component.js.map

this.TNC = this.TNC || {};
this.TNC.RelatedPeopleFeed = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // Related People Feed component JS goes here
    /** Related People Feed Class. */
    class RelatedPeopleFeed {
        /**
         * Footer constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            console.log($__default["default"]);
        }
    }

    var relatedPeopleFeed_component = new RelatedPeopleFeed();

    return relatedPeopleFeed_component;

})($);
//# sourceMappingURL=related-people-feed.component.js.map

this.ALTRIA = this.ALTRIA || {};
this.ALTRIA.PartnerBrandLogo = (function () {
    'use strict';

    // Partner Brand Logo component JS goes here
    // import $ from 'jquery';
    /** Partner Brand Logo Class. */
    class PartnerBrandLogo {
        /**
         * Footer constructor
         */
        constructor() {
            this.initialize();
        }
        /**
         * Initialization function
         */
        initialize() {
            // console.log($);
        }
    }

    var partnerBrandLogo_component = new PartnerBrandLogo();

    return partnerBrandLogo_component;

})();
//# sourceMappingURL=partner-brand-logo.component.js.map

this.TNC = this.TNC || {};
this.TNC.ImageSlider = (function ($, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    // Image Slider component JS goes here
    /* eslint-enable */
    /** Image Slider Class. */
    class ImageSlider {
        /**
         * ImageSlider constructor
         */
        constructor() {
            this.initialize();

        }
        /**
         * Initialization function
         */
        initialize() {

            this.initComparisons();
        }
        initComparisons() {
            $__default["default"]('.ba-slider').each((index, element) => {
                let width;
                let container = $__default["default"](element);
                let sliderOrientation = container.parents('.c-image-slider').attr('data-orientation');

                let directionClassName = sliderOrientation === 'horizontal' ? 'resize-horizontal' : 'resize-vertical';
                width = container.width() + 'px';
                // Adjust the slider
                container.find('.resize').addClass(directionClassName);
                container.find(`.${directionClassName} img`).css('width', width);
                this.drags(container.find('.c-image-slider_slider-handle'), container.find(`.${directionClassName}`), container, sliderOrientation);
            });
            /* istanbul ignore next*/
            $__default["default"](window).resize(function () {
                $__default["default"]('.ba-slider').each(function () {
                    var win = $__default["default"](this);
                    var width = win.width() + 'px';
                    win.find('.resize img').css('width', width);
                });
            });
        }
        drags(dragElement, resizeElement, container, sliderOrientation) {
            // Initialize the dragging event on mousedown.
            /* istanbul ignore else  */
            if (sliderOrientation === 'horizontal') {
                dragElement.on('mousedown touchstart', (event) => this.dragStartHorizontal(event, dragElement, resizeElement,
                    container)).on('mouseup touchend touchcancel', function () {
                        dragElement.removeClass('draggable');
                        resizeElement.removeClass('resizable');
                    });
            } else if (sliderOrientation === 'vertical') {
                dragElement.on('mousedown touchstart', (event) => this.dragStartVertical(event, dragElement, resizeElement,
                    container)).on('mouseup touchend touchcancel', function () {
                        dragElement.removeClass('draggable');
                        resizeElement.removeClass('resizable');
                    });
            }
        }

        dragStartVertical(e, dragElement, resizeElement, container) {
            dragElement.addClass('draggable');
            resizeElement.addClass('resizable');

            //trigger Analytics call
            let isAnalyticsTriggered = container.data('isTriggered');
            if (typeof isAnalyticsTriggered === "undefined") {
                container.data('isTriggered', true);
                this.analyticsCall(container);
            }

            // Check if it's a mouse or touch event and pass along the correct value
            let startX = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX;

            // Get the initial position
            let dragWidth = dragElement.outerWidth(),
                posX = dragElement.offset().left + dragWidth - startX,
                containerOffset = container.offset().left,
                containerWidth = container.outerWidth();

            // Set limits
            let minLeft = containerOffset - dragWidth / 2;
            let maxLeft = containerOffset + containerWidth - dragWidth / 2;

            // Calculate the dragging distance on mousemove.
            dragElement.parents().on("mousemove touchmove", function (e) {

                // Check if it's a mouse or touch event and pass along the correct value
                let moveX = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX;

                let leftValue = moveX + posX - dragWidth / 2;

                // Prevent going off limits
                if (leftValue < minLeft) {
                    leftValue = minLeft;
                } else if (leftValue > maxLeft) {
                    leftValue = maxLeft;
                }

                // Translate the handle's left value to masked divs width.

                // let widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';
                let widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth;

                if (parseFloat(widthValue) > 99) {
                    widthValue = 100.3;
                } else if (parseFloat(widthValue) < 1) {
                    widthValue = 0;
                }
                widthValue += '%';

                // Set the new values for the slider and the handle.
                // Bind mouseup events to stop dragging.
                container.find('.draggable').css('left', widthValue).on('mouseup touchend touchcancel', function () {

                    $__default["default"](this).removeClass('draggable');
                    resizeElement.removeClass('resizable');
                });

                container.find('.resizable').css('width', widthValue);
            }).on('mouseup touchend touchcancel', function () {
                dragElement.removeClass('draggable');
                resizeElement.removeClass('resizable');
            });
            e.preventDefault();
        }
        dragStartHorizontal(e, dragElement, resizeElement, container) {
            dragElement.addClass('draggable');
            resizeElement.addClass('resizable');

            //trigger Analytics call
            let isAnalyticsTriggered = container.data('isTriggered');
            if (typeof isAnalyticsTriggered === "undefined") {
                container.data('isTriggered', true);
                this.analyticsCall(container);
            }

            // Check if it's a mouse or touch event and pass along the correct value

            let startY = (e.pageY) ? e.pageY : e.originalEvent.touches[0].pageY;

            // Get the initial position
            let dragHeight = dragElement.outerHeight(),
                posY = dragElement.offset().top + dragHeight - startY,
                containerOffset = container.offset().top,
                containerHeight = container.outerHeight();

            // Set limits
            let minTop = containerOffset - dragHeight / 2;
            let maxTop = containerOffset + containerHeight - dragHeight / 2;

            // Calculate the dragging distance on mousemove.
            dragElement.parents().on("mousemove touchmove", function (e) {

                // Check if it's a mouse or touch event and pass along the correct value
                let moveY = (e.pageY) ? e.pageY : e.originalEvent.touches[0].pageY;

                let topValue = moveY + posY - dragHeight / 2;

                // Prevent going off limits
                if (topValue < minTop) {
                    topValue = minTop;
                } else if (topValue > maxTop) {
                    topValue = maxTop;
                }

                // Translate the handle's left value to masked divs width.
                // let heightValue = (topValue + dragHeight / 2 - containerOffset) * 100 / containerHeight + '%';
                let heightValue = (topValue + dragHeight / 2 - containerOffset) * 100 / containerHeight;


                // Set the new values for the slider and the handle.
                // Bind mouseup events to stop dragging.
                if (parseFloat(heightValue) > 99) {
                    heightValue = 99.1;
                } else if (parseFloat(heightValue) < 1) {
                    heightValue = 0;
                }

                heightValue += '%';

                container.find('.draggable').css('top', heightValue).on('mouseup touchend touchcancel', function () {

                    $__default["default"](this).removeClass('draggable');
                    resizeElement.removeClass('resizable');
                });

                container.find('.resizable').css('height', heightValue);

            }).on('mouseup touchend touchcancel', function () {
                dragElement.removeClass('draggable');
                resizeElement.removeClass('resizable');
            });
            e.preventDefault();
        }

        analyticsCall(target) {
            let $target = target.closest('.c-image-slider'),
                title = $target.find(".c-image-slider__title").text();
            title = title ? title : 'Undefind';
            let ud = (typeof utag_data === "undefined") ? "Undefind" : utag_data.page_name;
            let page_name = ud,
                analyticsObj = {
                    'event_name': 'image_slider',
                    'generic_engagement_name': title + ':' + page_name
                };
            utl__default["default"].setAnalyticsByPage(analyticsObj, true);

        }
    }

    var imageSlider_component = new ImageSlider();

    return imageSlider_component;

})($, TNC.Utility);
//# sourceMappingURL=image-slider.component.js.map

this.TNC = this.TNC || {};
this.TNC.Audio = (function ($, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    // Audio component JS goes here
    /* eslint-enable */
    /** Audio Class. */
    class Audio {
        /**
         * Audio constructor
         */
        constructor() {
            this.initialize();
            this.events();
        }
        /**
         * Initialization function
         */
        initialize() {
            let self = this;
            //init audio player
            this.players = Array.from(document.querySelectorAll('.audio-play-area')).map(p => self.initAudioPlyr(p));

            /*UX-235 - add hover tool tip to download audio button, and wrap download anchor in div for mobile grid layout*/
            $__default["default"]('.plyr__control[data-plyr="download"]').wrap("<div class='c-audio__download_button'></div>");
            $__default["default"]('.c-audio__download_button').append('<div class="c-audio__download_tooltip family-sans">Download Audio</div>');


        }

        //register events
        events() {
            $__default["default"]('.js-sharethis').on('click', function (e) {
                e.preventDefault();
                $__default["default"](this).closest('.c-audio-share').find('.share-this-popover').toggleClass('show-me');
                $__default["default"](this).closest('.c-audio').find('.c-image-credit_toggle, .plyr__progress input[type=range]').toggleClass('zIndexNormal');
            });

            $__default["default"](document).on('click touchstart', (event) => {
                if (!$__default["default"](event.target).closest('.c-social-share-icon-list').length && !$__default["default"](event.target).closest('.js-sharethis').length) {
                    $__default["default"]('.c-audio').find('.c-audio-share .share-this-popover').removeClass('show-me');
                    $__default["default"]('.c-audio').find('.c-image-credit_toggle, .plyr__progress input[type=range]').removeClass('zIndexNormal');
                }
            });

            //Transcript Box Toggle w/ Analytics
            $__default["default"]('.ex--col_trigger').on('click', function () {
              var transcriptContainer = $__default["default"](this).closest('.c-audio-transcript');
              var toggleContent = transcriptContainer.find('.ex--col_content');
              var toggleTrigger = transcriptContainer.find('.ex--col_trigger');
              transcriptContainer.toggleClass('_opened');
              toggleTrigger.toggleClass("_exp");
              toggleContent.toggle();
              // trigger analytics when transcript is opened
              if (transcriptContainer.hasClass('_opened')) {
                let audioPlayerContainer = transcriptContainer.prevAll(
                    '.c-audio-player-container:first');
                let audioElement = audioPlayerContainer.find('.audio-play-area');
                let audioId = '';
                let audioName = '';
                if (audioElement) {
                    audioId = audioElement.attr('id');
                    audioName = audioElement.data('title');
                }
                var _analytics = {
                  'event_name': 'transcript_open',
                  'audio_name': audioName + ':' + audioId
                };
                utl__default["default"].setAnalyticsByPage(_analytics, true);

                // Set focus on first Collapse button.
                var collapse = transcriptContainer.find('._collapse').first();
                if (collapse) {
                  collapse.focus();
                }
              }
              else {
                // Set focus on Expand button.
                var expand = transcriptContainer.find('._expand');
                if (expand) {
                  expand.focus();
                }
              }
            });

            /* eslint-disable */
            //TNCE-654 - hide volume icon on device
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                $__default["default"](".plyr--audio .plyr__volume").hide();
            } else {
                $__default["default"](".plyr--audio .plyr__volume").show();
            }
            /* eslint-enable */
            $__default["default"](window).on('load', () => {
                $__default["default"](window).trigger('resize');
            });

            $__default["default"](window).on('resize', () => {
                this.adjustTextPostion();
            });

            // Upon pressing Esc, hide some controls if they are visible.
            $__default["default"](document).on('keyup', function (event) {
                var code = event.charCode || event.keyCode;
                if (code === 27) {   // Esc key
                    // Volume slider
                    $__default["default"]('.plyr__volume input[data-plyr="volume"]').hide();

                    // Share This popup
                    $__default["default"]('.c-audio').find('.c-audio-share .share-this-popover').removeClass(
                        'show-me');
                    $__default["default"]('.c-audio').find(
                        '.c-image-credit_toggle, .plyr__progress input[type=range]').removeClass(
                        'zIndexNormal');
                }
            });

            $__default["default"]('.c-audio__download_button a').on('keyup', function (event) {
                var code = event.charCode || event.keyCode;
                if ((code === 32) || (code === 13)) {   // Space or Return
                    var link = $__default["default"](this);
                    link[0].click();
                }
            });
        }

        //audio Plyr events
        plyrEvents(plr) {
            let $plyrEl = plr.closest('.c-audio-player').find('.plyr.plyr--audio');

            // Volume icon:
            //
            // Focus and blur events (for keyboard):
            // When the mute/volume button gets focus, show the volume slider;
            // after then it stays visible in order to allow tabbing forward and
            // backward in a predictable way.
            $plyrEl.find('.plyr__volume button.plyr__control').on(
                'focus', function () {
                    $plyrEl.find('.plyr__volume input[data-plyr="volume"]').show();
                }
            );
            //
            // Hover event (for pointer):
            $plyrEl.find('.plyr__volume button.plyr__control, input[data-plyr="volume"]').hover(
                function () {
                    $plyrEl.find('.plyr__volume input[data-plyr="volume"]').show();
                },
                function () {
                    $plyrEl.find('.plyr__volume input[data-plyr="volume"]').hide();
                }
            );
        }

        //Audio player using Plyr.js
        initAudioPlyr(plr) {
            let _self = this;
            let audioUrl = $__default["default"](plr).find("source").attr("src");
            let uniqueId = $__default["default"](plr).attr("id");
            _self.setAudioId(uniqueId);
            let audioTitle = $__default["default"](plr).data("title");
            _self.setAudioName(audioTitle);
            let format = audioUrl.substr((audioUrl.lastIndexOf('.') + 1));
            let isValid = _self.validateFormat(format);

            let player;

            if($__default["default"](plr).hasClass('c-audio__download')){
                player = new Plyr(plr, {
                    controls: [
                        'play-large', // The large play button in the center
                        // 'restart', // Restart playback
                        // 'rewind', // Rewind by the seek time (default 10 seconds)
                        'play', // Play/pause playback
                        // 'fast-forward', // Fast forward by the seek time (default 10 seconds)
                        'progress', // The progress bar and scrubber for playback and buffering
                        'current-time', // The current time of playback
                        'duration', // The full duration of the media
                        'mute', // Toggle mute
                        'volume', // Volume control
                        // 'captions', // Toggle captions
                        // 'settings', // Settings menu
                        // 'pip', // Picture-in-picture (currently Safari only)
                        // 'airplay', // Airplay (currently Safari only)
                         'download' // Show a download button with a link to either the current source or a custom URL you specify in your options
                        // 'fullscreen', // Toggle fullscreen
                    ]
                });

                var download_btn = $__default["default"](plr).closest('.c-audio').find('.plyr__control[data-plyr="download"]');

                var download_text = $__default["default"](plr).closest('.c-audio').find('.c-audio__download_text');

                download_text.after(download_btn);

               // $(plr).closest('.c-audio').find('.c-audio__download_text').after(download_btn); //move download text to be after download button
                download_text.children().attr("href", download_btn.attr("href"));


            } else {
                player = new Plyr(plr, {
                    controls: [
                        'play-large',
                        'play',
                        'progress',
                        'current-time',
                        'duration',
                        'mute',
                        'volume'
                    ]
                });
                $__default["default"](plr).closest('.c-audio').find('.c-audio__download_text').hide();

            }

            /* eslint-disable */
            /* istanbul ignore next */
            player.on('ready', event => {
                let plyrEl = $__default["default"](plr).closest('.plyr');
                $__default["default"](plyrEl).find(".plyr__time--duration").text(_self.secondsTimeSpanToHMS(player.duration));
            });

            //Analytics - TNCE-596
            /* istanbul ignore next */
            player.on('play', () => {
                let isPlayed = $__default["default"](plr).data('played');
                if (!isPlayed) {
                    $__default["default"](plr).data('played', true);
                    let analyticsObj = {
                        'event_name': 'audio_start',
                        'audio_name': audioTitle + ':' + uniqueId,
                    };

                    utl__default["default"].setAnalyticsByPage(analyticsObj, true);
                }
            });
            /* eslint-enable */

            _self.plyrEvents($__default["default"](plr));

            if (isValid === true) {
                $__default["default"](plr).closest('.c-audio').find(".audio-error-message-1").text("");
                $__default["default"](plr).closest('.c-audio').removeClass('c-not-supported-audio');
            } else {
                //#if error case
                let message = $__default["default"](plr).closest('.c-audio').find(".audio-error-message-1").attr("data-error-message");
                $__default["default"](plr).closest('.c-audio').find(".audio-error-message-1").text(message);
                $__default["default"](plr).closest('.c-audio').addClass('c-not-supported-audio');
            }
        }

        /**
         * Turn seconds into H:M:S format
         */
        secondsTimeSpanToHMS(s) {
            let h = Math.floor(s / 3600); //Get whole hours
            s -= h * 3600;
            let m = Math.floor(s / 60); //Get remaining minutes
            s -= m * 60;
            s = Math.round(s);
            return (h > 0 ? h + ":" : '') + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
        }

        /**
         * Validate Audio Format
         *
         * @param: {String}
         * @return: {Boolen}
         **/
        validateFormat(format) {
            switch(format) {
                case "mp3":
                case "mp4":
                case "mpeg":
                case "wav":
                case "ogg":
                    return true;
                default:
                    return false;
            }
        }

        setAudioName(n) {
          this.audioName = n;
        }

        setAudioId(n) {
          this.audioId = n;
        }

        adjustTextPostion() {
            $__default["default"]('.c-audio').each((indx, wrap) => {
                let variation = $__default["default"](wrap).data('variation');
                if (variation === 'backdrop-as-image') {
                    let imageHeight = $__default["default"](wrap).find('.c-audio-image-container').height();
                    let textHeight = $__default["default"](wrap).find('.c-audio__valign').height();
                    let requiredHeight = (imageHeight - textHeight) / 2;
                    $__default["default"](wrap).find('.c-audio__valign').css('top', requiredHeight + 'px');
                }
            });
        }
    }

    var audio_component = new Audio();

    return audio_component;

})($, TNC.Utility);
//# sourceMappingURL=audio.component.js.map

this.TNC = this.TNC || {};
this.TNC["image-collage"] = (function () {
    'use strict';

    class ImageCollage {
        /**
         * Image constructor
         */
        constructor() {
                this.initialize();
            }
            /**
             * Initialization function
             */
        initialize() {
            // console.log($);
        }
    }

    var imageCollage_component = new ImageCollage();

    return imageCollage_component;

})();
//# sourceMappingURL=image-collage.component.js.map

this.TNC = this.TNC || {};
this.TNC.interactivePointsOverImage = (function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  // Annotated Image class definition
  class AnnotatedImg {

    constructor(elem, options) {
      const defaults = {};

      this.elem = elem;
      this.settings = $__default["default"].extend({}, defaults, options);
      this.initialize();
    }

    initialize() {
      this.baseClass = 'ipoi';
      this.activeMarkerClass = `${this.baseClass}__marker--active`;
      this.activeContentClass = `${this.baseClass}__content--active`;

      this.$container = $__default["default"](this.elem);
      this.$contentContainer = $__default["default"](`.${this.baseClass}__content-container`, this.$container);
      this.$contentContainerInner = $__default["default"](`.${this.baseClass}__content-container-inner`, this.$contentContainer);
      this.$contentCtaContainer = $__default["default"](`.${this.baseClass}__content-cta`, this.$contentContainer);
      this.$imgContainer = $__default["default"](`.${this.baseClass}__img-container`, this.$container);
      this.$markers = $__default["default"](`.${this.baseClass}__marker`, this.$container);
      this.$navBtns = $__default["default"]('[data-update-content]', this.$container).add(this.$markers);
      this.$img = $__default["default"]('img', this.$imgContainer);

      this.defaultImgUrl = this.$img.attr('src');
      this.defaultImgTitle = this.$img.attr('alt');
      this.imgDimensions = this.getImgDimensions();

      this.positionMarkers();
      this.updateContent();
      if (this.$img.get(0).complete) this.fixContentHeight();
      this.bindEvents();
    }

    getImgDimensions() {
      let dataVal = this.$img.data('dimensions');
      let dataArr = dataVal.split(',');
      let img = this.$img.get(0);

      if (dataVal && dataArr.length && dataArr[0] && dataArr[1]) {
        return dataArr;
      } else if (img && img.naturalWidth && img.naturalHeight) {
        return [img.naturalWidth, img.naturalHeight];
      } else {
        console.log('AnnotatedImg Error: Cannot retrieve image dimensions');
      }
    }

    fixContentHeight() {
      if (this.$contentContainer.width() < this.$container.width()) {
        this.$contentContainerInner.css("max-height", (this.$imgContainer.outerHeight() - (this.$contentCtaContainer.outerHeight() || 0 )) + "px");
      } else {
        this.$contentContainerInner.css('max-height', '');
      }
    }

    positionMarkers() {
      let $marker, coords;

      let scale = this.getScale();

      this.$markers.each(function (i, marker) {
        $marker = $__default["default"](marker);

        coords = $marker.data('coords').split(',');

        $marker.css({
          left: `${coords[0] * scale}px`,
          top: `${coords[1] * scale}px`
        });
      });
    }

    getScale() {
      if (this.$img.width() && this.imgDimensions[0]) return this.$img.width() / this.imgDimensions[0];
      return 1;
    }

    updateContent($btn) {
      let contentId;
      let $selectedMarker = null;

      if ($btn) {
        if ($btn.data('updateContent')) {
          contentId = $btn.data('updateContent');
        } else if ($btn.attr('href')) {
          contentId = $btn.attr('href').slice(1);
        }

        if ($btn.hasClass(`${this.baseClass}__marker`)) $selectedMarker = $btn;
      }

      if (!contentId) contentId = 'default';

      let $selectedContent = $__default["default"](`[data-content-id="${contentId}"]`, this.$container);

      if (!$selectedMarker && $selectedContent.data('marker')) {
        $selectedMarker = $__default["default"](`[data-marker-id="${$selectedContent.data('marker')}"]`, this.$container);
      }

      // exit if the selected content is already active
      if ($selectedContent.get(0) === $__default["default"](`.${this.activeContentClass}`, this.$container).get(0)) return;

      // remove active marker and active content
      $__default["default"](`.${this.activeMarkerClass}`, this.$container).removeClass(this.activeMarkerClass);
      $__default["default"](`.${this.activeContentClass}`, this.$container).removeClass(this.activeContentClass);

      // update content and active marker
      if ($selectedContent) $selectedContent.addClass(this.activeContentClass);
      if ($selectedMarker) $selectedMarker.addClass(this.activeMarkerClass);

      // update img
      if ($selectedMarker && $selectedMarker.data('img')) {
        if (this.$img.attr('src') !== $selectedMarker.data('img')) this.$img.attr('src', $selectedMarker.data('img'));
      } else {
        if (this.$img.attr('src') !== this.defaultImgUrl) this.$img.attr('src', this.defaultImgUrl);
      }

      // update img alt text
      if ($selectedMarker && $selectedMarker.data('imgTitle')) {
        if (this.$img.attr('alt') !== $selectedMarker.data('imgTitle')) this.$img.attr('alt', $selectedMarker.data('imgTitle'));
      } else {
        if (this.$img.attr('alt') !== this.defaultImgTitle) this.$img.attr('alt', this.defaultImgTitle);
      }

      // update cta text
  		if (contentId !== 'default') {
        $__default["default"](`.${this.baseClass}__cta`, this.$container).addClass(`${this.baseClass}__cta--active`);
  			$__default["default"](`.${this.baseClass}__cta--default`, this.$container).removeClass(`${this.baseClass}__cta--active`);
  		} else {
  			$__default["default"](`.${this.baseClass}__cta`, this.$container).removeClass(`${this.baseClass}__cta--active`);
        $__default["default"](`.${this.baseClass}__cta--default`, this.$container).addClass(`${this.baseClass}__cta--active`);
  		}

      this.$contentContainerInner.scrollTop(0);
    }

    bindEvents() {
      $__default["default"](window).on('resize', () => {
        this.positionMarkers();
        this.fixContentHeight();
      });

      this.$navBtns.on('click', (evt) => {
        evt.preventDefault();
        this.$markers.removeClass(`${this.baseClass}__marker--animated`);
        this.updateContent($__default["default"](evt.currentTarget));

        try {
          utag.link({
            'event_name' : 'image_point_click',
            'generic_engagement_name' : this.$container.data('title')
          });
        } catch (e) {
          console.log("'utag' not defined");
        }
      });

      this.$container.on('reset.annotatedImg', () => {
        this.updateContent();
        this.$markers.addClass(`${this.baseClass}__marker--animated`);
      });

      this.$img.on('load', () => this.fixContentHeight());
    }
  }

  // jquery plugin definition
  $__default["default"].fn.annotatedImg = function (options) {
    return this.each(function (i, elem) {
      return new AnnotatedImg(elem, options);
    });
  };

  $__default["default"](function () {
    $__default["default"]('.ipoi').annotatedImg();
  });

  var interactivePointsOverImage_component = $__default["default"].fn.annotatedImg;

  return interactivePointsOverImage_component;

})($);
//# sourceMappingURL=interactive-points-over-image.component.js.map

this.TNC = this.TNC || {};
this.TNC.Statistics = (function () {
    'use strict';

    class Statistics {
        constructor() {
            this.initialize();
        }

        initialize() {
        }
    }

    var statistics_component = new Statistics();

    return statistics_component;

})();
//# sourceMappingURL=statistics.component.js.map

this.TNC = this.TNC || {};
this.TNC.PieChart = (function () {
    'use strict';

    const colors = [
        "#005487",
        "#1B75BC",
        "#019ECB",
        "#B8DEDF",
        "#E6B100",
        "#C85D28"
    ];

    class Chart {
        getPostfixConfiguration() {
            const isMobile = document.documentElement.clientWidth < this.mobileWidth;

            return [
                {"number": 1e+6, "suffix": !isMobile ? "Million" : "M"},
                {"number": 1e+9, "suffix": !isMobile ? "Billion" : "B"},
                {"number": 1e+12, "suffix": !isMobile ? "Trillion" : "B"}
            ];
        }

        init(el, type, runAfterInit = true) {
            am4core.options.commercialLicense = true; // eslint-disable-line
            am4core.options.autoSetClassName = true; // eslint-disable-line

            this.selectors = {
                chartContainer: '.chart__object',
                legendElement: '.chart__element',
                chartElementExpanded: 'chart__element--expanded',
                chartElementHovered: 'chart__element--hovered',
                chartElementTitle: '.chart__element-title',
                chartElementName: '.chart__element-name'
            };
            this.elements = {
                el: el,
                chartContainer: el.querySelector(this.selectors.chartContainer),
                legendElements: el.querySelectorAll(this.selectors.legendElement),
            };
            this.type = type;
            this.container = null;

            this.sizes = {
                desktop: {
                    height: 610,
                    width: 610,
                    paddingLeft: 0
                },
                mobile: {
                    height: 264,
                    width: 280, // eslint-disable-line
                    paddingLeft: 0
                }
            };
            this.categoryAxis = null;
            this.valueAxis = null;
            this.mobileWidth = 640;

            if (runAfterInit) {
                this.afterInit();
            }
        }

        afterInit() {
            this.data = this.getDataFromHTML();
            this.chart = this.createChart(this.type);

            if (this.chart) {
                this.attachEvents();
            }
        }

        createChart(type) {
            if (this.elements.chartContainer) {
                const sizes = this.getSizes();

                am4core.useTheme(am4themes_animated); // eslint-disable-line
                const container = am4core.create(this.elements.chartContainer, am4core.Container); // eslint-disable-line

                container.width = sizes.width; // eslint-disable-line
                container.height = sizes.height; // eslint-disable-line
                container.paddingLeft = sizes.paddingLeft;

                this.container = container;

                const chart = container.createChild(type); // eslint-disable-line
                chart.data = this.getData();
                chart.labelText = '';

                chart.events.on("ready", () => {
                    this.elements.el.querySelector('.chart__legend').classList.add('chart__legend--open');
                });

                return chart;
            }
            return null;
        }

        getChartElement(selector) {
            return () => selector;
        }

        attachEvents() {
            let timeout = null;

            window.addEventListener("resize", () => {
                if (!timeout) {
                    const sizes = this.getSizes();

                    this.container.width = sizes.width; // eslint-disable-line
                    this.container.height = sizes.height; // eslint-disable-line
                    this.container.paddingLeft = sizes.paddingLeft;

                    timeout = setTimeout(() => {
                        timeout = null;
                    }, 500);

                    if (this.valueAxis) {
                        this.valueAxis.numberFormatter.bigNumberPrefixes = this.getPostfixConfiguration();
                    }
                }
            });
        }

        getData() {
            return [];
        }

        getDataFromHTML() {
            return Array.from(this.elements.legendElements).map(this.getChartElement(this.selectors.chartElementTitle));
        }

        getColor(index) {
            if (index < 0 || index > (colors.length - 1)) {
                return colors[0];
            }

            return colors[index];
        }

        getSizes() {
            const isPieChart = this.elements.el.classList.contains('pie-chart');
            // chart will be rendered in the right container
            const rightContainerWidth = this.elements.el.querySelector('.right-container') && this.elements.el.querySelector('.right-container').offsetWidth;

            if (isPieChart) {
                return {
                    height: rightContainerWidth,
                    width: rightContainerWidth,
                    paddingLeft: 0
                };
            } else {
                return window.innerWidth > 639 ? this.sizes.desktop : this.sizes.mobile;
            }
        }
    }

    var analitycs = {
        "link_sent": () => ({
            'event_name': 'piechart_click'
        })
    };

    const getSliceObject = (sliceData, id, pulled = true) => {
        const {title, percent, color} = sliceData;

        return {
            title,
            percent,
            color,
            id,
            pulled
        };
    };

    const getPulledObject = (elem, key) => elem.subs && elem.subs.length > 0 ?
        elem.subs.map(sub => getSliceObject(Object.assign({}, elem, sub), key)) :
        getSliceObject(elem, key);

    const createPieSeries = (chart) => {
        const pieSeries = chart.series.push(new am4charts.PieSeries()); // eslint-disable-line
        const text = window.innerWidth < 640 ? '' : "[bold]{category}[/]: {value.percent.formatNumber('#.#')}%";

        pieSeries.dataFields = Object.assign(
            {},
            pieSeries.dataFields,
            {
                value: "percent",
                category: "title"
            }
        );
        pieSeries.slices.template.propertyFields = Object.assign(
            {},
            pieSeries.slices.template.propertyFields,
            {
                fill: "color",
                isActive: "pulled"
            });
        pieSeries.slices.template.strokeWidth = 0;
        pieSeries.slices.template.tooltipText = text;
        pieSeries.labels.template.text = '';
        pieSeries.tooltip.getFillFromObject = false;
        pieSeries.tooltip.background.fill = am4core.color("#FFFFFF"); // eslint-disable-line
        pieSeries.tooltip.label.fill = am4core.color("black"); // eslint-disable-line

        return pieSeries;
    };

    class PieChart extends Chart {
        constructor(el) {
            super();
            super.init(el, am4charts.PieChart); // eslint-disable-line
            this.selectedPie = null;

            if (this.elements.legendElements.length > 4) {
                el.querySelector('.chart__legend').classList.add('chart__legend--long');
            }

            this.updateChartObjectHeight();
        }

        updateChartObjectHeight() {
            // chart will be rendered in the right container
            const rightContainerWidth = this.elements.el.querySelector('.right-container') && this.elements.el.querySelector('.right-container').offsetWidth;
            const chartObjectEl = this.elements.el.querySelector('.chart__object');
            if (chartObjectEl) {
                chartObjectEl.style.height = rightContainerWidth + 'px';
            }
        }

        createChart(type) {
            if (!this.chart) {
                const chart = super.createChart(type);
                if (chart) {
                    this.pieSeries = createPieSeries(chart);
                }

                return chart;
            }
            return this.chart;
        }

        attachEvents() {
            super.attachEvents();
            let timeout = null;

            this.pieSeries.slices.template.events.on("hit", (event) => {
                const currentElement = this.chart.data
                    .find(element => element.id === event.target.dataItem.dataContext.id);

                if (currentElement) {
                    const element = Array.from(this.elements.legendElements).find(element =>
                        element.querySelector(this.selectors.chartElementName).innerHTML === currentElement.title);

                    this.clickOnElement(element, currentElement);
                }
            });

            this.pieSeries.slices.template.events.on("over", (event) => {
                const id = event.target.dataItem.dataContext.id;
                const currentElement = this.chart.data
                    .find(element => element.id === id);

                if (currentElement) {
                    this.hoverOnElement(currentElement);
                }
            });

            this.elements.legendElements.forEach(element => {
                const titleElement = element.querySelector(this.selectors.chartElementTitle);
                const titleElementValue = titleElement.querySelector(this.selectors.chartElementName).innerHTML;

                titleElement.addEventListener('click', () => {
                    const currentElement = this.chart.data.find(({title}) => title === titleElementValue);
                    this.clickOnElement(element, currentElement);
                });
            });

            window.addEventListener("resize", () => {
                if (!timeout) {
                    const text = window.innerWidth < 640 ? '' : "{category}: {value.percent.formatNumber('#.#')}%";
                    this.pieSeries.slices.template.tooltipText = text;
                    this.updateChartObjectHeight();
                    timeout = setTimeout(() => {
                        timeout = null;
                    }, 500);
                }
            });
        }

        hoverOnElement(currentElement) {
            const id = currentElement ? currentElement.id : null;
            if (!id) {
                return ;
            }
            const domID = id - 1;
            const className = this.selectors.chartElementHovered;
            const currentSlice = this.pieSeries.element.node.querySelectorAll(`.amcharts-Slice-group`)[domID];
            const expandedClassName = this.selectors.chartElementExpanded;
            const currentExpanded = this.elements.el.querySelector(`.${expandedClassName}`);

            if (!currentExpanded && currentSlice && this.data[domID].subs && this.data[domID].subs.length > 0) {
                currentSlice.classList.add(className);
            }
        }

        clickOnElement(element, currentElement) {
            const id = currentElement ? currentElement.id : null;
            const className = this.selectors.chartElementExpanded;
            const currentExpanded = this.elements.el.querySelector(`.${className}`);
            const isSameElement = (!id && this.selectedPie) || this.selectedPie === id;

            if (currentExpanded) {
                currentExpanded.classList.remove(className);
            }

            if (!isSameElement && element) {
                element.classList.add(className);
            }

            this.selectedPie = isSameElement ? null : id;
            this.chart.data = this.getData();
            utag.link(analitycs.link_sent());// eslint-disable-line
        }

        getData() {
            const getCurrentObject = (element, key) => (key + 1) === this.selectedPie ? getPulledObject(element, (key + 1))
                : getSliceObject(element, (key + 1), false);

            return this.data.map(getCurrentObject).flat(2).sort((a, b) => b.position - a.position);
        }

        getDataFromHTML() {
            const setObject = (element, position, color) => Object.assign({}, element, {position, color});

            return super.getDataFromHTML().sort((a, b) => b.percent - a.percent)
                .map(
                    (element, index) => {
                        const position = (index + 1) * 10;
                        const color = this.getColor(index);
                        const setCurrentObject = (elem, pos) => setObject(elem, pos, color);

                        if (element.subs && element.subs.length > 0) {
                            element.subs = element.subs.map((sub, index) => setCurrentObject(sub, position + index));
                        }

                        this.elements.el.querySelectorAll('.chart__element').forEach(elem => {
                            const name = elem.querySelector('.chart__element-name');

                            if(name && name.innerHTML === element.title) {
                                elem.classList.add(`chart__element-color-${index}`);
                                elem.style.order = index + 1;
                            }
                        });


                        return setCurrentObject(element, position);
                    }
                );
        }

        getChartElement(parent) {
            return (element) => {
                const titleAndValueSelector = parent ? element.querySelector(parent) : element;
                const chartElement = {
                    title: titleAndValueSelector.querySelector('.chart__element-name').innerHTML,
                    percent: Math.round(parseFloat(titleAndValueSelector.querySelector('.chart__element-value').innerHTML) * 100),
                    subs: []
                };
                const subs = element.querySelectorAll('.chart__element-list .chart_element-list-object');

                if (subs && subs.length > 0) {
                    return Object.assign({}, chartElement, {
                        subs: Array.from(subs).map(this.getChartElement(false, false))
                    });
                }

                return chartElement;
            };
        }
    }

    class Charts {
        constructor() {
            this.initialize();
        }

        initialize() {
            document.querySelectorAll('body .pie-chart.chart').forEach(element => new PieChart(element));
        }
    }

    var pieChart_component = new Charts();

    return pieChart_component;

})();
//# sourceMappingURL=pie-chart.component.js.map

this.TNC = this.TNC || {};
this.TNC.ColumnChart = (function () {
    'use strict';

    const colors = [
        "#005487",
        "#1B75BC",
        "#019ECB",
        "#B8DEDF",
        "#E6B100",
        "#C85D28"
    ];

    class Chart {
        getPostfixConfiguration() {
            const isMobile = document.documentElement.clientWidth < this.mobileWidth;

            return [
                {"number": 1e+6, "suffix": !isMobile ? "Million" : "M"},
                {"number": 1e+9, "suffix": !isMobile ? "Billion" : "B"},
                {"number": 1e+12, "suffix": !isMobile ? "Trillion" : "B"}
            ];
        }

        init(el, type, runAfterInit = true) {
            am4core.options.commercialLicense = true; // eslint-disable-line
            am4core.options.autoSetClassName = true; // eslint-disable-line

            this.selectors = {
                chartContainer: '.chart__object',
                legendElement: '.chart__element',
                chartElementExpanded: 'chart__element--expanded',
                chartElementHovered: 'chart__element--hovered',
                chartElementTitle: '.chart__element-title',
                chartElementName: '.chart__element-name'
            };
            this.elements = {
                el: el,
                chartContainer: el.querySelector(this.selectors.chartContainer),
                legendElements: el.querySelectorAll(this.selectors.legendElement),
            };
            this.type = type;
            this.container = null;

            this.sizes = {
                desktop: {
                    height: 610,
                    width: 610,
                    paddingLeft: 0
                },
                mobile: {
                    height: 264,
                    width: 280, // eslint-disable-line
                    paddingLeft: 0
                }
            };
            this.categoryAxis = null;
            this.valueAxis = null;
            this.mobileWidth = 640;

            if (runAfterInit) {
                this.afterInit();
            }
        }

        afterInit() {
            this.data = this.getDataFromHTML();
            this.chart = this.createChart(this.type);

            if (this.chart) {
                this.attachEvents();
            }
        }

        createChart(type) {
            if (this.elements.chartContainer) {
                const sizes = this.getSizes();

                am4core.useTheme(am4themes_animated); // eslint-disable-line
                const container = am4core.create(this.elements.chartContainer, am4core.Container); // eslint-disable-line

                container.width = sizes.width; // eslint-disable-line
                container.height = sizes.height; // eslint-disable-line
                container.paddingLeft = sizes.paddingLeft;

                this.container = container;

                const chart = container.createChild(type); // eslint-disable-line
                chart.data = this.getData();
                chart.labelText = '';

                chart.events.on("ready", () => {
                    this.elements.el.querySelector('.chart__legend').classList.add('chart__legend--open');
                });

                return chart;
            }
            return null;
        }

        getChartElement(selector) {
            return () => selector;
        }

        attachEvents() {
            let timeout = null;

            window.addEventListener("resize", () => {
                if (!timeout) {
                    const sizes = this.getSizes();

                    this.container.width = sizes.width; // eslint-disable-line
                    this.container.height = sizes.height; // eslint-disable-line
                    this.container.paddingLeft = sizes.paddingLeft;

                    timeout = setTimeout(() => {
                        timeout = null;
                    }, 500);

                    if (this.valueAxis) {
                        this.valueAxis.numberFormatter.bigNumberPrefixes = this.getPostfixConfiguration();
                    }
                }
            });
        }

        getData() {
            return [];
        }

        getDataFromHTML() {
            return Array.from(this.elements.legendElements).map(this.getChartElement(this.selectors.chartElementTitle));
        }

        getColor(index) {
            if (index < 0 || index > (colors.length - 1)) {
                return colors[0];
            }

            return colors[index];
        }

        getSizes() {
            const isPieChart = this.elements.el.classList.contains('pie-chart');
            // chart will be rendered in the right container
            const rightContainerWidth = this.elements.el.querySelector('.right-container') && this.elements.el.querySelector('.right-container').offsetWidth;

            if (isPieChart) {
                return {
                    height: rightContainerWidth,
                    width: rightContainerWidth,
                    paddingLeft: 0
                };
            } else {
                return window.innerWidth > 639 ? this.sizes.desktop : this.sizes.mobile;
            }
        }
    }

    class XYChart extends Chart {
        getSeriesName(index) {
            const prefix = 'serie';

            return `${prefix}-${index}`;
        }

        readValues(query) {
            return Array.from(query).map(element => element.innerHTML);
        }

        creatChartSeries(chart) {
            return chart;
        }

        getCategoryObject(value, series) {
            const seriesObject = series.reduce((prev, current, index) =>
                Object.assign({}, prev, {[this.getSeriesName(index)]: current}), {});

            return Object.assign({}, {
                'mainCategory': value
            }, seriesObject);
        }

        constructor(el) {
            super();
            super.init(el, am4charts.XYChart, false); // eslint-disable-line

            this.currentElements = {
                chartCategories: el.querySelectorAll('.chart__categories > li'),
                titles: el.querySelectorAll(`${this.selectors.legendElement} .chart__element-title`)
            };

            this.isDollar = el.getAttribute('data-value-type') === "dollar";

            super.afterInit();
        }

        createChart(type) {
            const chart = super.createChart(type);

            if (chart) {
                this.creatChartSeries(chart);

                chart.scrollbarX = new am4core.Scrollbar();  // eslint-disable-line
                chart.scrollbarX.marginLeft = 0;
                chart.scrollbarX.type = "XYChartScrollbar";
                chart.scrollbarX.series = ["s1"];
            }

            return chart;
        }

        getData() {
            return this.data.map(({title, values}) => this.getCategoryObject(title, values));
        }

        getDataFromHTML() {
            return Array.from(this.currentElements.chartCategories).map(this.getChartElement());
        }

        getChartElement() {
            return (element) => ({
                title: element.querySelector('.chart__categories-title').innerHTML,
                values: this.readValues(element.querySelectorAll('.chart__element-values li'))
            });
        }

        getSizes() {
            const isLineChart = this.elements.el.classList.contains('line-chart');
            const isTwoColumnVariation = this.elements.el.classList.contains('twoColumn');
            // chart will be rendered in the right container (70% container width)
            const rightContainerWidth = this.elements.el.querySelector('.right-container') && this.elements.el.querySelector('.right-container').offsetWidth;
            // chart will be rendered in the full width container
            const fullContainerWidth = this.elements.el.querySelector('.bs_container') && this.elements.el.querySelector('.bs_container').offsetWidth;
            const width = isTwoColumnVariation ? rightContainerWidth : fullContainerWidth;
            return width > 639 ? {
                height: isLineChart ? 500 : 610,
                width: width,
                paddingLeft: 0
            } : {
                height: 320,
                width: width,
                paddingLeft: -20
            };
        }
    }

    class ColumnChart extends XYChart {
        creatChartSeries(chart) {
            const categoryX = "mainCategory";
            const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis()); // eslint-disable-line

            categoryAxis.dataFields.category = categoryX;
            categoryAxis.fontFamily = "Whitney A";
            categoryAxis.fontSize = 14;
            categoryAxis.fontWeight = 600;
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 10;
            categoryAxis.renderer.cellStartLocation = 0.1;
            categoryAxis.renderer.cellEndLocation = 0.9;
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.id = 'send-font-3';
            this.categoryAxis = categoryAxis;

            const valueAxis = chart.yAxes.push(new am4charts.ValueAxis()); // eslint-disable-line
            valueAxis.min = 0;
            valueAxis.fontFamily = "Whitney A";
            valueAxis.fontSize = 14;
            valueAxis.fontWeight = 600;
            valueAxis.numberFormatter = new am4core.NumberFormatter(); // eslint-disable-line
            valueAxis.numberFormatter.bigNumberPrefixes = this.getPostfixConfiguration();
            valueAxis.numberFormatter.numberFormat = `${this.isDollar ? '$' : ''}#,# a`;
            valueAxis.renderer.grid.template.disabled = true;
            valueAxis.id = 'send-font-4';
            this.valuesAxis = valueAxis;

            return this.readValues(this.currentElements.titles).map((name, index) => {
                const series = chart.series.push(new am4charts.ColumnSeries()); // eslint-disable-line

                series.numberFormatter = new am4core.NumberFormatter(); // eslint-disable-line
                series.numberFormatter.bigNumberPrefixes = this.getPostfixConfiguration();
                series.numberFormatter.numberFormat = (this.isDollar ? ' $' : '') + "#,# a";
                series.dataFields.valueY = this.getSeriesName(index);
                series.dataFields.categoryX = categoryX;
                series.name = name;
                series.columns.template.tooltipText = `[bold]{name}[/]: ${this.isDollar ? ' $' : ''}{valueY.formatNumber("#,# a")} `;
                series.legendSettings.valueText = "{valueY}";
                series.stacked = this.elements.el.getAttribute('data-type') === "stacked";
                series.columns.template.width = am4core.percent(95); // eslint-disable-line
                series.columns.template.stroke = am4core.color(this.getColor(index)); // eslint-disable-line
                series.columns.template.fill = am4core.color(this.getColor(index)); // eslint-disable-line
                series.tooltip.getFillFromObject = false;
                series.tooltip.background.fill = am4core.color("#FFFFFF");// eslint-disable-line
                series.tooltip.label.fill = am4core.color("black");// eslint-disable-line
                series.columns.template.width = am4core.percent(70);// eslint-disable-line

                return series;
            });
        }
    }

    class Charts {
        constructor() {
            this.initialize();
        }

        initialize() {
            document.querySelectorAll('body .column-chart-component-container').forEach(
                element => new ColumnChart(element));
        }
    }

    var columnChart_component = new Charts();

    return columnChart_component;

})();
//# sourceMappingURL=column-chart.component.js.map

this.TNC = this.TNC || {};
this.TNC.LineChart = (function () {
    'use strict';

    const colors = [
        "#005487",
        "#1B75BC",
        "#019ECB",
        "#B8DEDF",
        "#E6B100",
        "#C85D28"
    ];

    class Chart {
        getPostfixConfiguration() {
            const isMobile = document.documentElement.clientWidth < this.mobileWidth;

            return [
                {"number": 1e+6, "suffix": !isMobile ? "Million" : "M"},
                {"number": 1e+9, "suffix": !isMobile ? "Billion" : "B"},
                {"number": 1e+12, "suffix": !isMobile ? "Trillion" : "B"}
            ];
        }

        init(el, type, runAfterInit = true) {
            am4core.options.commercialLicense = true; // eslint-disable-line
            am4core.options.autoSetClassName = true; // eslint-disable-line

            this.selectors = {
                chartContainer: '.chart__object',
                legendElement: '.chart__element',
                chartElementExpanded: 'chart__element--expanded',
                chartElementHovered: 'chart__element--hovered',
                chartElementTitle: '.chart__element-title',
                chartElementName: '.chart__element-name'
            };
            this.elements = {
                el: el,
                chartContainer: el.querySelector(this.selectors.chartContainer),
                legendElements: el.querySelectorAll(this.selectors.legendElement),
            };
            this.type = type;
            this.container = null;

            this.sizes = {
                desktop: {
                    height: 610,
                    width: 610,
                    paddingLeft: 0
                },
                mobile: {
                    height: 264,
                    width: 280, // eslint-disable-line
                    paddingLeft: 0
                }
            };
            this.categoryAxis = null;
            this.valueAxis = null;
            this.mobileWidth = 640;

            if (runAfterInit) {
                this.afterInit();
            }
        }

        afterInit() {
            this.data = this.getDataFromHTML();
            this.chart = this.createChart(this.type);

            if (this.chart) {
                this.attachEvents();
            }
        }

        createChart(type) {
            if (this.elements.chartContainer) {
                const sizes = this.getSizes();

                am4core.useTheme(am4themes_animated); // eslint-disable-line
                const container = am4core.create(this.elements.chartContainer, am4core.Container); // eslint-disable-line

                container.width = sizes.width; // eslint-disable-line
                container.height = sizes.height; // eslint-disable-line
                container.paddingLeft = sizes.paddingLeft;

                this.container = container;

                const chart = container.createChild(type); // eslint-disable-line
                chart.data = this.getData();
                chart.labelText = '';

                chart.events.on("ready", () => {
                    this.elements.el.querySelector('.chart__legend').classList.add('chart__legend--open');
                });

                return chart;
            }
            return null;
        }

        getChartElement(selector) {
            return () => selector;
        }

        attachEvents() {
            let timeout = null;

            window.addEventListener("resize", () => {
                if (!timeout) {
                    const sizes = this.getSizes();

                    this.container.width = sizes.width; // eslint-disable-line
                    this.container.height = sizes.height; // eslint-disable-line
                    this.container.paddingLeft = sizes.paddingLeft;

                    timeout = setTimeout(() => {
                        timeout = null;
                    }, 500);

                    if (this.valueAxis) {
                        this.valueAxis.numberFormatter.bigNumberPrefixes = this.getPostfixConfiguration();
                    }
                }
            });
        }

        getData() {
            return [];
        }

        getDataFromHTML() {
            return Array.from(this.elements.legendElements).map(this.getChartElement(this.selectors.chartElementTitle));
        }

        getColor(index) {
            if (index < 0 || index > (colors.length - 1)) {
                return colors[0];
            }

            return colors[index];
        }

        getSizes() {
            const isPieChart = this.elements.el.classList.contains('pie-chart');
            // chart will be rendered in the right container
            const rightContainerWidth = this.elements.el.querySelector('.right-container') && this.elements.el.querySelector('.right-container').offsetWidth;

            if (isPieChart) {
                return {
                    height: rightContainerWidth,
                    width: rightContainerWidth,
                    paddingLeft: 0
                };
            } else {
                return window.innerWidth > 639 ? this.sizes.desktop : this.sizes.mobile;
            }
        }
    }

    class XYChart extends Chart {
        getSeriesName(index) {
            const prefix = 'serie';

            return `${prefix}-${index}`;
        }

        readValues(query) {
            return Array.from(query).map(element => element.innerHTML);
        }

        creatChartSeries(chart) {
            return chart;
        }

        getCategoryObject(value, series) {
            const seriesObject = series.reduce((prev, current, index) =>
                Object.assign({}, prev, {[this.getSeriesName(index)]: current}), {});

            return Object.assign({}, {
                'mainCategory': value
            }, seriesObject);
        }

        constructor(el) {
            super();
            super.init(el, am4charts.XYChart, false); // eslint-disable-line

            this.currentElements = {
                chartCategories: el.querySelectorAll('.chart__categories > li'),
                titles: el.querySelectorAll(`${this.selectors.legendElement} .chart__element-title`)
            };

            this.isDollar = el.getAttribute('data-value-type') === "dollar";

            super.afterInit();
        }

        createChart(type) {
            const chart = super.createChart(type);

            if (chart) {
                this.creatChartSeries(chart);

                chart.scrollbarX = new am4core.Scrollbar();  // eslint-disable-line
                chart.scrollbarX.marginLeft = 0;
                chart.scrollbarX.type = "XYChartScrollbar";
                chart.scrollbarX.series = ["s1"];
            }

            return chart;
        }

        getData() {
            return this.data.map(({title, values}) => this.getCategoryObject(title, values));
        }

        getDataFromHTML() {
            return Array.from(this.currentElements.chartCategories).map(this.getChartElement());
        }

        getChartElement() {
            return (element) => ({
                title: element.querySelector('.chart__categories-title').innerHTML,
                values: this.readValues(element.querySelectorAll('.chart__element-values li'))
            });
        }

        getSizes() {
            const isLineChart = this.elements.el.classList.contains('line-chart');
            const isTwoColumnVariation = this.elements.el.classList.contains('twoColumn');
            // chart will be rendered in the right container (70% container width)
            const rightContainerWidth = this.elements.el.querySelector('.right-container') && this.elements.el.querySelector('.right-container').offsetWidth;
            // chart will be rendered in the full width container
            const fullContainerWidth = this.elements.el.querySelector('.bs_container') && this.elements.el.querySelector('.bs_container').offsetWidth;
            const width = isTwoColumnVariation ? rightContainerWidth : fullContainerWidth;
            return width > 639 ? {
                height: isLineChart ? 500 : 610,
                width: width,
                paddingLeft: 0
            } : {
                height: 320,
                width: width,
                paddingLeft: -20
            };
        }
    }

    class LineChart extends XYChart {
        creatChartSeries(chart) {
            const categoryX = "mainCategory";

            const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis()); // eslint-disable-line
            categoryAxis.dataFields.category = categoryX;
            categoryAxis.fontFamily = "Whitney A";
            categoryAxis.fontSize = 14;
            categoryAxis.fontWeight = 600;
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.id = 'send-font';
            this.categoryAxis = categoryAxis;

            const valueAxis = chart.yAxes.push(new am4charts.ValueAxis()); // eslint-disable-line
            valueAxis.title.text = "";
            valueAxis.fontFamily = "Whitney A";
            valueAxis.fontSize = 14;
            valueAxis.fontWeight = 600;
            valueAxis.renderer.minLabelPosition = 0.01;
            valueAxis.numberFormatter = new am4core.NumberFormatter(); // eslint-disable-line
            valueAxis.numberFormatter.bigNumberPrefixes = this.getPostfixConfiguration();
            valueAxis.numberFormatter.numberFormat = `${this.isDollar ? '$' : ''}#,# a`;
            valueAxis.renderer.grid.template.disabled = true;
            valueAxis.id = 'send-font-2';

            return this.readValues(this.currentElements.titles).map((name, index) => {
                const series = chart.series.push(new am4charts.LineSeries()); // eslint-disable-line

                series.numberFormatter = new am4core.NumberFormatter(); // eslint-disable-line
                series.numberFormatter.bigNumberPrefixes = this.getPostfixConfiguration();
                series.numberFormatter.numberFormat = (this.isDollar ? ' $' : '') + "#,# a";
                series.dataFields.valueY = this.getSeriesName(index);
                series.dataFields.categoryX = categoryX;
                series.name = name;
                series.stroke = am4core.color(this.getColor(index)); // eslint-disable-line
                series.strokeWidth = 3;
                series.legendSettings.valueText = "{valueY}";
                series.tooltip.getFillFromObject = false;
                series.tooltip.background.fill = am4core.color("#FFFFFF"); // eslint-disable-line
                series.tooltip.label.fill = am4core.color("black"); // eslint-disable-line

                const bullet = series.bullets.push(new am4charts.CircleBullet()); // eslint-disable-line
                bullet.fill = am4core.color(this.getColor(index)); // eslint-disable-line
                bullet.tooltipText = `[bold]{categoryX}:[/]  ${this.isDollar ? ' $' : ''}{valueY.formatNumber("#,# a")}  {name}`;
                bullet.fontFamily = "Whitney A";

                return series;
            });
        }
    }

    class LineCharts {
        constructor() {
            this.initialize();
        }

        initialize() {
            document.querySelectorAll('body .line-chart').forEach(element => new LineChart(element));
        }
    }

    var lineChart_component = new LineCharts();

    return lineChart_component;

})();
//# sourceMappingURL=line-chart.component.js.map

this.TNC = this.TNC || {};
this.TNC.DocumentDownload = (function ($, Flickity) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var Flickity__default = /*#__PURE__*/_interopDefaultLegacy(Flickity);

    const checkTouchDevice = `ontouchstart` in window || `onmsgesturechange` in window;

    class ModalSlider {
        constructor(prefix, el, prepareImages = false) {
            this.prefix = prefix;
            this.currentSlider = {};

            this.elements = {
                el: el,
                modal: $__default["default"](`.${prefix}__modal`, el),
                htmlBody: $__default["default"](`html body`),
                container: $__default["default"](`.${prefix}__container`, el),
                wrappers: $__default["default"](`.${prefix}__modal-wrapper`, el),
                items: $__default["default"](`.${prefix}__modal-item-content`, el),
                modalClose: $__default["default"](`.${prefix}__modal-close`, el)
            };

            this.classes = {
                modalIsOpen: `${prefix}__modal-is-open`,
                modalIsClosed: `${prefix}__modal-is-closed`,
                indexes: `${prefix}__index`,
                total: `${prefix}__total`,
                bodyOpenModal: `c-modal-open`,
                currentWrapperSelected: `album-is-selected`, 
                cModal: `c-modal`,
                tabContainerLinks: `c-tab-container-links`,
                tabContainerWrapper: `c-tab-container-content-wrapper`
            };

            this.lastPosition = 0;
            this.prepareImagesSizes = prepareImages;
            this.isCalculated = false;

            this.attachEvents();
        }

        attachEvents() {
            let that = this;
            this.elements.container.on(`click`, (e) => {
                const indexAttrName = 'data-index';

                if (e.target !== e.currentTarget &&
                    e.target.hasAttribute(indexAttrName) &&
                    e.currentTarget.hasAttribute(indexAttrName)) {

                    e.preventDefault();
                    const sliderId = 0;
                    const index = e.target.getAttribute(indexAttrName) || 0;
                    const currentModalWrapper = $__default["default"](`.${this.prefix}__modal-wrapper[${indexAttrName}=${sliderId}]`, this.elements.el);
                    if (currentModalWrapper.length > 0) {
                        currentModalWrapper.attr('tabindex', 0);
                        currentModalWrapper.addClass(this.classes.currentWrapperSelected);

                        // If an object for the slider doesn't exist yet, create it.
                        if ($__default["default"].isEmptyObject(this.currentSlider)) {
                            this.currentSlider = new Flickity__default["default"](currentModalWrapper[sliderId], {
                                "pageDots": false,
                                "draggable": checkTouchDevice,
                                cellAlign: `left`,
                                contain: true,
                                imagesLoaded: true,
                                setGallerySize: false
                            });

                            // Initialize videos, if there are any.
                            that.initializeVideos();
                        }

                        // SYS-4333, SYS-4560: If the modal is immediately preceeded by tabs, position the modal
                        // below the tabs rather, than over it so that the tabs can be clicked while the modal is
                        // deployed.
                        const tabContainerWrapper = $__default["default"](this.elements.el).parents(`.${this.classes.tabContainerWrapper}`).first();
                        const tabContainerLinks = tabContainerWrapper.prev(`.${this.classes.tabContainerLinks}`);
                        if (tabContainerLinks.length === 1) {
                        	var tabContainerLinksPosition = tabContainerLinks.offset();
                            this.elements.modal.css({top: `32px`, left: 0, position: `fixed`});
                        	$__default["default"](window).scrollTop(tabContainerLinksPosition.top);
                        }
                        this.lastPosition = window.scrollY;
                        this.currentSlider.select(index, true, true);
                        this.elements.modal.removeClass(this.classes.cModal);
                        this.elements.modal.removeClass(this.classes.modalIsClosed);
                        this.elements.htmlBody.addClass(this.classes.bodyOpenModal);
                        this.elements.modal.addClass(this.classes.modalIsOpen);
                        $__default["default"](document).on(`keydown`, this.onCloseModal.bind(this));
                        setTimeout(() => {
                            $__default["default"](currentModalWrapper[sliderId]).focus();
                        }, 500);
                    }
                }
            });

            this.elements.modalClose.on('click touchend', () => {
                this.closeModal();
            });
        }

        initializeVideos() {
            // Initialize tracking for any videos after a short wait.

            console.log("initializing videos");
            let waitMilliseconds = 2500;
            setTimeout(function () {
                let defaults = {
                    milestones: [50],
                    pollingTime: 100
                };

                let settings = $__default["default"].extend(true, {}, defaults, this.options);
                this.settings = settings;

                let youTubeIframes = $__default["default"](
                    '.c-video-aggregation__modal iframe[src*="youtube.com"]');
                youTubeIframes.video(this.settings);

                let vimeoIframes = $__default["default"](
                    '.c-video-aggregation__modal iframe[src*="vimeo.com"]');
                vimeoIframes.video(this.settings);
            }, waitMilliseconds);
        }

        closeModal() {
            this.elements.modal.addClass(this.classes.cModal);
            this.elements.modal.addClass(this.classes.modalIsClosed);
            this.elements.htmlBody.removeClass(this.classes.bodyOpenModal);
            this.elements.modal.removeClass(this.classes.modalIsOpen);
            this.elements.wrappers.removeClass(this.classes.currentWrapperSelected);
            $__default["default"](document).off(`keydown`, this.onCloseModal);

            setTimeout(() => { //Solution
                window.scrollTo(0, this.lastPosition);
            }, 5);
        }

        onCloseModal(e) {
            if (e.which === 27) {
                this.closeModal();
            }
        }
    }

    class ImageMosaicModule {
        constructor(el) {
            new ModalSlider('c-image-mosaic', el, true);
        }
    }

    class ImageMosaic {
        constructor() {
            this.initialize();

            // Add counts below images in modal dialog markup for smartphone view.
            let $modalItems = $__default["default"](".c-image-mosaic__modal-item");
            $modalItems.each(function (index) {
                let $item = $__default["default"](this);
                $item.find(".c-image-mosaic__modal-item-content").append(
                    "<p class='c-image-mosaic__modal-item-count'>" +
                    (index + 1) + " of " + $modalItems.length + "</p>");
            });
        }

        initialize() {
            document.querySelectorAll('.c-image-mosaic').forEach(
                el => new ImageMosaicModule(el));

            this.hideHamburger();
        }

        hideHamburger() {
            const imageModal = document.querySelectorAll('.c-image-mosaic__image-container');
            const closeButton = document.querySelectorAll('.c-image-mosaic__modal-close');
            const hamburgerButton = document.querySelector('.c-anchor-links__mobile-button-container');
            const backToTopButton = document.querySelector('#back-to-top');
            imageModal.forEach(element => {
                element.addEventListener('click', () => {
                    if(hamburgerButton) {
                        hamburgerButton.classList.add('displayClass');
                    }
                    if (backToTopButton) {
                        backToTopButton.setAttribute('style','display: none;');
                    }
                });
            });

            closeButton.forEach(element => {
                element.addEventListener('click', () => {
                    if(hamburgerButton) {
                        hamburgerButton.classList.remove('displayClass');
                    }
                    if (backToTopButton) {
                        backToTopButton.removeAttribute('style','display: none;');
                    }
                });
            });

            document.addEventListener('keydown', (e) => {
                const key = e.key; // const {key} = event; in ES6+
                if (key === "Escape") {
                    if(hamburgerButton) {
                        hamburgerButton.classList.remove('displayClass');
                    }
                    if (backToTopButton) {
                      backToTopButton.removeAttribute('style','display: none;');
                    }
                }
            });
        }

    }

    var imageMosaic_component = new ImageMosaic();

    return imageMosaic_component;

})($, Flickity);
//# sourceMappingURL=image-mosaic.component.js.map

this.TNC = this.TNC || {};
this.TNC.ScrollingSlideshow = (function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  /* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */
  (function () {

    // polyfill
    function polyfill() {
      // aliases
      var w = window;
      var d = document;

      // return if scroll behavior is supported and polyfill is not forced
      if (
        'scrollBehavior' in d.documentElement.style &&
        w.__forceSmoothScrollPolyfill__ !== true
      ) {
        return;
      }

      // globals
      var Element = w.HTMLElement || w.Element;
      var SCROLL_TIME = 468;

      // object gathering original scroll methods
      var original = {
        scroll: w.scroll || w.scrollTo,
        scrollBy: w.scrollBy,
        elementScroll: Element.prototype.scroll || scrollElement,
        scrollIntoView: Element.prototype.scrollIntoView
      };

      // define timing method
      var now =
        w.performance && w.performance.now
          ? w.performance.now.bind(w.performance)
          : Date.now;

      /**
       * indicates if a the current browser is made by Microsoft
       * @method isMicrosoftBrowser
       * @param {String} userAgent
       * @returns {Boolean}
       */
      function isMicrosoftBrowser(userAgent) {
        var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

        return new RegExp(userAgentPatterns.join('|')).test(userAgent);
      }

      /*
       * IE has rounding bug rounding down clientHeight and clientWidth and
       * rounding up scrollHeight and scrollWidth causing false positives
       * on hasScrollableSpace
       */
      var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

      /**
       * changes scroll position inside an element
       * @method scrollElement
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */
      function scrollElement(x, y) {
        this.scrollLeft = x;
        this.scrollTop = y;
      }

      /**
       * returns result of applying ease math function to a number
       * @method ease
       * @param {Number} k
       * @returns {Number}
       */
      function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
      }

      /**
       * indicates if a smooth behavior should be applied
       * @method shouldBailOut
       * @param {Number|Object} firstArg
       * @returns {Boolean}
       */
      function shouldBailOut(firstArg) {
        if (
          firstArg === null ||
          typeof firstArg !== 'object' ||
          firstArg.behavior === undefined ||
          firstArg.behavior === 'auto' ||
          firstArg.behavior === 'instant'
        ) {
          // first argument is not an object/null
          // or behavior is auto, instant or undefined
          return true;
        }

        if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
          // first argument is an object and behavior is smooth
          return false;
        }

        // throw error when behavior is not supported
        throw new TypeError(
          'behavior member of ScrollOptions ' +
            firstArg.behavior +
            ' is not a valid value for enumeration ScrollBehavior.'
        );
      }

      /**
       * indicates if an element has scrollable space in the provided axis
       * @method hasScrollableSpace
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function hasScrollableSpace(el, axis) {
        if (axis === 'Y') {
          return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
        }

        if (axis === 'X') {
          return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
        }
      }

      /**
       * indicates if an element has a scrollable overflow property in the axis
       * @method canOverflow
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function canOverflow(el, axis) {
        var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

        return overflowValue === 'auto' || overflowValue === 'scroll';
      }

      /**
       * indicates if an element can be scrolled in either axis
       * @method isScrollable
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function isScrollable(el) {
        var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
        var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

        return isScrollableY || isScrollableX;
      }

      /**
       * finds scrollable parent of an element
       * @method findScrollableParent
       * @param {Node} el
       * @returns {Node} el
       */
      function findScrollableParent(el) {
        while (el !== d.body && isScrollable(el) === false) {
          el = el.parentNode || el.host;
        }

        return el;
      }

      /**
       * self invoked function that, given a context, steps through scrolling
       * @method step
       * @param {Object} context
       * @returns {undefined}
       */
      function step(context) {
        var time = now();
        var value;
        var currentX;
        var currentY;
        var elapsed = (time - context.startTime) / SCROLL_TIME;

        // avoid elapsed times higher than one
        elapsed = elapsed > 1 ? 1 : elapsed;

        // apply easing to elapsed time
        value = ease(elapsed);

        currentX = context.startX + (context.x - context.startX) * value;
        currentY = context.startY + (context.y - context.startY) * value;

        context.method.call(context.scrollable, currentX, currentY);

        // scroll more if we have not reached our destination
        if (currentX !== context.x || currentY !== context.y) {
          w.requestAnimationFrame(step.bind(w, context));
        }
      }

      /**
       * scrolls window or element with a smooth behavior
       * @method smoothScroll
       * @param {Object|Node} el
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */
      function smoothScroll(el, x, y) {
        var scrollable;
        var startX;
        var startY;
        var method;
        var startTime = now();

        // define scroll context
        if (el === d.body) {
          scrollable = w;
          startX = w.scrollX || w.pageXOffset;
          startY = w.scrollY || w.pageYOffset;
          method = original.scroll;
        } else {
          scrollable = el;
          startX = el.scrollLeft;
          startY = el.scrollTop;
          method = scrollElement;
        }

        // scroll looping over a frame
        step({
          scrollable: scrollable,
          method: method,
          startTime: startTime,
          startX: startX,
          startY: startY,
          x: x,
          y: y
        });
      }

      // ORIGINAL METHODS OVERRIDES
      // w.scroll and w.scrollTo
      w.scroll = w.scrollTo = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scroll.call(
            w,
            arguments[0].left !== undefined
              ? arguments[0].left
              : typeof arguments[0] !== 'object'
                ? arguments[0]
                : w.scrollX || w.pageXOffset,
            // use top prop, second argument if present or fallback to scrollY
            arguments[0].top !== undefined
              ? arguments[0].top
              : arguments[1] !== undefined
                ? arguments[1]
                : w.scrollY || w.pageYOffset
          );

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(
          w,
          d.body,
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : w.scrollX || w.pageXOffset,
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : w.scrollY || w.pageYOffset
        );
      };

      // w.scrollBy
      w.scrollBy = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0])) {
          original.scrollBy.call(
            w,
            arguments[0].left !== undefined
              ? arguments[0].left
              : typeof arguments[0] !== 'object' ? arguments[0] : 0,
            arguments[0].top !== undefined
              ? arguments[0].top
              : arguments[1] !== undefined ? arguments[1] : 0
          );

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(
          w,
          d.body,
          ~~arguments[0].left + (w.scrollX || w.pageXOffset),
          ~~arguments[0].top + (w.scrollY || w.pageYOffset)
        );
      };

      // Element.prototype.scroll and Element.prototype.scrollTo
      Element.prototype.scroll = Element.prototype.scrollTo = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          // if one number is passed, throw error to match Firefox implementation
          if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
            throw new SyntaxError('Value could not be converted');
          }

          original.elementScroll.call(
            this,
            // use left prop, first number argument or fallback to scrollLeft
            arguments[0].left !== undefined
              ? ~~arguments[0].left
              : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
            // use top prop, second argument or fallback to scrollTop
            arguments[0].top !== undefined
              ? ~~arguments[0].top
              : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
          );

          return;
        }

        var left = arguments[0].left;
        var top = arguments[0].top;

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(
          this,
          this,
          typeof left === 'undefined' ? this.scrollLeft : ~~left,
          typeof top === 'undefined' ? this.scrollTop : ~~top
        );
      };

      // Element.prototype.scrollBy
      Element.prototype.scrollBy = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.elementScroll.call(
            this,
            arguments[0].left !== undefined
              ? ~~arguments[0].left + this.scrollLeft
              : ~~arguments[0] + this.scrollLeft,
            arguments[0].top !== undefined
              ? ~~arguments[0].top + this.scrollTop
              : ~~arguments[1] + this.scrollTop
          );

          return;
        }

        this.scroll({
          left: ~~arguments[0].left + this.scrollLeft,
          top: ~~arguments[0].top + this.scrollTop,
          behavior: arguments[0].behavior
        });
      };

      // Element.prototype.scrollIntoView
      Element.prototype.scrollIntoView = function() {
        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scrollIntoView.call(
            this,
            arguments[0] === undefined ? true : arguments[0]
          );

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        var scrollableParent = findScrollableParent(this);
        var parentRects = scrollableParent.getBoundingClientRect();
        var clientRects = this.getBoundingClientRect();

        if (scrollableParent !== d.body) {
          // reveal element inside parent
          smoothScroll.call(
            this,
            scrollableParent,
            scrollableParent.scrollLeft + clientRects.left - parentRects.left,
            scrollableParent.scrollTop + clientRects.top - parentRects.top
          );

          // reveal parent in viewport unless is fixed
          if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
            w.scrollBy({
              left: parentRects.left,
              top: parentRects.top,
              behavior: 'smooth'
            });
          }
        } else {
          // reveal element in viewport
          w.scrollBy({
            left: clientRects.left,
            top: clientRects.top,
            behavior: 'smooth'
          });
        }
      };
    }

    if (typeof exports === 'object' && typeof module !== 'undefined') {
      // commonjs
      module.exports = { polyfill: polyfill };
    } else {
      // global
      polyfill();
    }

  }());

  /*!
  Waypoints - 4.0.1
  Copyright © 2011-2016 Caleb Troughton
  Licensed under the MIT license.
  https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
  */
  !function(){function t(n){if(!n)throw new Error("No options passed to Waypoint constructor");if(!n.element)throw new Error("No element option passed to Waypoint constructor");if(!n.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=t.Adapter.extend({},t.defaults,n),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=n.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1;}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t);},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t);},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key];},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var n in i)e.push(i[n]);for(var o=0,r=e.length;r>o;o++)e[o][t]();},t.destroyAll=function(){t.invokeAll("destroy");},t.disableAll=function(){t.invokeAll("disable");},t.enableAll=function(){t.Context.refreshAll();for(var e in i)i[e].enabled=!0;return this},t.refreshAll=function(){t.Context.refreshAll();},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},t.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t;}(),function(){function t(t){window.setTimeout(t,1e3/60);}function e(t){this.element=t,this.Adapter=o.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,n[t.waypointContextKey]=this,i+=1,o.windowContext||(o.windowContext=!0,o.windowContext=new e(window)),this.createThrottledScrollHandler(),this.createThrottledResizeHandler();}var i=0,n={},o=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh();},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical),i=this.element==this.element.window;t&&e&&!i&&(this.adapter.off(".waypoints"),delete n[this.key]);},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1;}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,o.requestAnimationFrame(t));});},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1;}var e=this;this.adapter.on("scroll.waypoints",function(){(!e.didScroll||o.isTouch)&&(e.didScroll=!0,o.requestAnimationFrame(t));});},e.prototype.handleResize=function(){o.Context.refreshAll();},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var n=e[i],o=n.newScroll>n.oldScroll,r=o?n.forward:n.backward;for(var s in this.waypoints[i]){var l=this.waypoints[i][s];if(null!==l.triggerPoint){var a=n.oldScroll<l.triggerPoint,h=n.newScroll>=l.triggerPoint,p=a&&h,u=!a&&!h;(p||u)&&(l.queueTrigger(r),t[l.group.id]=l.group);}}}for(var d in t)t[d].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll};},e.prototype.innerHeight=function(){return this.element==this.element.window?o.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty();},e.prototype.innerWidth=function(){return this.element==this.element.window?o.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var n=0,o=t.length;o>n;n++)t[n].destroy();},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),n={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};for(var r in t){var s=t[r];for(var l in this.waypoints[r]){var a,h,p,u,d,f=this.waypoints[r][l],c=f.options.offset,w=f.triggerPoint,y=0,g=null==w;f.element!==f.element.window&&(y=f.adapter.offset()[s.offsetProp]),"function"==typeof c?c=c.apply(f):"string"==typeof c&&(c=parseFloat(c),f.options.offset.indexOf("%")>-1&&(c=Math.ceil(s.contextDimension*c/100))),a=s.contextScroll-s.contextOffset,f.triggerPoint=Math.floor(y+a-c),h=w<s.oldScroll,p=f.triggerPoint>=s.oldScroll,u=h&&p,d=!h&&!p,!g&&u?(f.queueTrigger(s.backward),n[f.group.id]=f.group):!g&&d?(f.queueTrigger(s.forward),n[f.group.id]=f.group):g&&s.oldScroll>=f.triggerPoint&&(f.queueTrigger(s.forward),n[f.group.id]=f.group);}}return o.requestAnimationFrame(function(){for(var t in n)n[t].flushTriggers();}),this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in n)n[t].refresh();},e.findByElement=function(t){return n[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll();},o.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e);},o.Context=e;}(),function(){function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),n[this.axis][this.name]=this;}var n={vertical:{},horizontal:{}},o=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t);},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]};},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var n=this.triggerQueues[i],o="up"===i||"left"===i;n.sort(o?e:t);for(var r=0,s=n.length;s>r;r+=1){var l=n[r];(l.options.continuous||r===n.length-1)&&l.trigger([i]);}}this.clearTriggerQueues();},i.prototype.next=function(e){this.waypoints.sort(t);var i=o.Adapter.inArray(e,this.waypoints),n=i===this.waypoints.length-1;return n?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=o.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t);},i.prototype.remove=function(t){var e=o.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1);},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return n[t.axis][t.name]||new i(t)},o.Group=i;}(),function(){function t(t){return t===t.window}function e(e){return t(e)?e:e.defaultView}function i(t){this.element=t,this.handlers={};}var n=window.Waypoint;i.prototype.innerHeight=function(){var e=t(this.element);return e?this.element.innerHeight:this.element.clientHeight},i.prototype.innerWidth=function(){var e=t(this.element);return e?this.element.innerWidth:this.element.clientWidth},i.prototype.off=function(t,e){function i(t,e,i){for(var n=0,o=e.length-1;o>n;n++){var r=e[n];i&&i!==r||t.removeEventListener(r);}}var n=t.split("."),o=n[0],r=n[1],s=this.element;if(r&&this.handlers[r]&&o)i(s,this.handlers[r][o],e),this.handlers[r][o]=[];else if(o)for(var l in this.handlers)i(s,this.handlers[l][o]||[],e),this.handlers[l][o]=[];else if(r&&this.handlers[r]){for(var a in this.handlers[r])i(s,this.handlers[r][a],e);this.handlers[r]={};}},i.prototype.offset=function(){if(!this.element.ownerDocument)return null;var t=this.element.ownerDocument.documentElement,i=e(this.element.ownerDocument),n={top:0,left:0};return this.element.getBoundingClientRect&&(n=this.element.getBoundingClientRect()),{top:n.top+i.pageYOffset-t.clientTop,left:n.left+i.pageXOffset-t.clientLeft}},i.prototype.on=function(t,e){var i=t.split("."),n=i[0],o=i[1]||"__default",r=this.handlers[o]=this.handlers[o]||{},s=r[n]=r[n]||[];s.push(e),this.element.addEventListener(n,e);},i.prototype.outerHeight=function(e){var i,n=this.innerHeight();return e&&!t(this.element)&&(i=window.getComputedStyle(this.element),n+=parseInt(i.marginTop,10),n+=parseInt(i.marginBottom,10)),n},i.prototype.outerWidth=function(e){var i,n=this.innerWidth();return e&&!t(this.element)&&(i=window.getComputedStyle(this.element),n+=parseInt(i.marginLeft,10),n+=parseInt(i.marginRight,10)),n},i.prototype.scrollLeft=function(){var t=e(this.element);return t?t.pageXOffset:this.element.scrollLeft},i.prototype.scrollTop=function(){var t=e(this.element);return t?t.pageYOffset:this.element.scrollTop},i.extend=function(){function t(t,e){if("object"==typeof t&&"object"==typeof e)for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return t}for(var e=Array.prototype.slice.call(arguments),i=1,n=e.length;n>i;i++)t(e[0],e[i]);return e[0]},i.inArray=function(t,e,i){return null==e?-1:e.indexOf(t,i)},i.isEmptyObject=function(t){for(var e in t)return !1;return !0},n.adapters.push({name:"noframework",Adapter:i}),n.Adapter=i;}();

  /*!
  Waypoints - 4.0.1
  Copyright © 2011-2016 Caleb Troughton
  Licensed under the MIT license.
  https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
  */
  (function() {

    var keyCounter = 0;
    var allWaypoints = {};

    /* http://imakewebthings.com/waypoints/api/waypoint */
    function Waypoint(options) {
      if (!options) {
        throw new Error('No options passed to Waypoint constructor')
      }
      if (!options.element) {
        throw new Error('No element option passed to Waypoint constructor')
      }
      if (!options.handler) {
        throw new Error('No handler option passed to Waypoint constructor')
      }

      this.key = 'waypoint-' + keyCounter;
      this.options = Waypoint.Adapter.extend({}, Waypoint.defaults, options);
      this.element = this.options.element;
      this.adapter = new Waypoint.Adapter(this.element);
      this.callback = options.handler;
      this.axis = this.options.horizontal ? 'horizontal' : 'vertical';
      this.enabled = this.options.enabled;
      this.triggerPoint = null;
      this.group = Waypoint.Group.findOrCreate({
        name: this.options.group,
        axis: this.axis
      });
      this.context = Waypoint.Context.findOrCreateByElement(this.options.context);

      if (Waypoint.offsetAliases[this.options.offset]) {
        this.options.offset = Waypoint.offsetAliases[this.options.offset];
      }
      this.group.add(this);
      this.context.add(this);
      allWaypoints[this.key] = this;
      keyCounter += 1;
    }

    /* Private */
    Waypoint.prototype.queueTrigger = function(direction) {
      this.group.queueTrigger(this, direction);
    };

    /* Private */
    Waypoint.prototype.trigger = function(args) {
      if (!this.enabled) {
        return
      }
      if (this.callback) {
        this.callback.apply(this, args);
      }
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/destroy */
    Waypoint.prototype.destroy = function() {
      this.context.remove(this);
      this.group.remove(this);
      delete allWaypoints[this.key];
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/disable */
    Waypoint.prototype.disable = function() {
      this.enabled = false;
      return this
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/enable */
    Waypoint.prototype.enable = function() {
      this.context.refresh();
      this.enabled = true;
      return this
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/next */
    Waypoint.prototype.next = function() {
      return this.group.next(this)
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/previous */
    Waypoint.prototype.previous = function() {
      return this.group.previous(this)
    };

    /* Private */
    Waypoint.invokeAll = function(method) {
      var allWaypointsArray = [];
      for (var waypointKey in allWaypoints) {
        allWaypointsArray.push(allWaypoints[waypointKey]);
      }
      for (var i = 0, end = allWaypointsArray.length; i < end; i++) {
        allWaypointsArray[i][method]();
      }
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/destroy-all */
    Waypoint.destroyAll = function() {
      Waypoint.invokeAll('destroy');
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/disable-all */
    Waypoint.disableAll = function() {
      Waypoint.invokeAll('disable');
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/enable-all */
    Waypoint.enableAll = function() {
      Waypoint.Context.refreshAll();
      for (var waypointKey in allWaypoints) {
        allWaypoints[waypointKey].enabled = true;
      }
      return this
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/refresh-all */
    Waypoint.refreshAll = function() {
      Waypoint.Context.refreshAll();
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/viewport-height */
    Waypoint.viewportHeight = function() {
      return window.innerHeight || document.documentElement.clientHeight
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/viewport-width */
    Waypoint.viewportWidth = function() {
      return document.documentElement.clientWidth
    };

    Waypoint.adapters = [];

    Waypoint.defaults = {
      context: window,
      continuous: true,
      enabled: true,
      group: 'default',
      horizontal: false,
      offset: 0
    };

    Waypoint.offsetAliases = {
      'bottom-in-view': function() {
        return this.context.innerHeight() - this.adapter.outerHeight()
      },
      'right-in-view': function() {
        return this.context.innerWidth() - this.adapter.outerWidth()
      }
    };

    window.Waypoint = Waypoint;
  }())
  ;(function() {

    function requestAnimationFrameShim(callback) {
      window.setTimeout(callback, 1000 / 60);
    }

    var keyCounter = 0;
    var contexts = {};
    var Waypoint = window.Waypoint;
    var oldWindowLoad = window.onload;

    /* http://imakewebthings.com/waypoints/api/context */
    function Context(element) {
      this.element = element;
      this.Adapter = Waypoint.Adapter;
      this.adapter = new this.Adapter(element);
      this.key = 'waypoint-context-' + keyCounter;
      this.didScroll = false;
      this.didResize = false;
      this.oldScroll = {
        x: this.adapter.scrollLeft(),
        y: this.adapter.scrollTop()
      };
      this.waypoints = {
        vertical: {},
        horizontal: {}
      };

      element.waypointContextKey = this.key;
      contexts[element.waypointContextKey] = this;
      keyCounter += 1;
      if (!Waypoint.windowContext) {
        Waypoint.windowContext = true;
        Waypoint.windowContext = new Context(window);
      }

      this.createThrottledScrollHandler();
      this.createThrottledResizeHandler();
    }

    /* Private */
    Context.prototype.add = function(waypoint) {
      var axis = waypoint.options.horizontal ? 'horizontal' : 'vertical';
      this.waypoints[axis][waypoint.key] = waypoint;
      this.refresh();
    };

    /* Private */
    Context.prototype.checkEmpty = function() {
      var horizontalEmpty = this.Adapter.isEmptyObject(this.waypoints.horizontal);
      var verticalEmpty = this.Adapter.isEmptyObject(this.waypoints.vertical);
      var isWindow = this.element == this.element.window;
      if (horizontalEmpty && verticalEmpty && !isWindow) {
        this.adapter.off('.waypoints');
        delete contexts[this.key];
      }
    };

    /* Private */
    Context.prototype.createThrottledResizeHandler = function() {
      var self = this;

      function resizeHandler() {
        self.handleResize();
        self.didResize = false;
      }

      this.adapter.on('resize.waypoints', function() {
        if (!self.didResize) {
          self.didResize = true;
          Waypoint.requestAnimationFrame(resizeHandler);
        }
      });
    };

    /* Private */
    Context.prototype.createThrottledScrollHandler = function() {
      var self = this;
      function scrollHandler() {
        self.handleScroll();
        self.didScroll = false;
      }

      this.adapter.on('scroll.waypoints', function() {
        if (!self.didScroll || Waypoint.isTouch) {
          self.didScroll = true;
          Waypoint.requestAnimationFrame(scrollHandler);
        }
      });
    };

    /* Private */
    Context.prototype.handleResize = function() {
      Waypoint.Context.refreshAll();
    };

    /* Private */
    Context.prototype.handleScroll = function() {
      var triggeredGroups = {};
      var axes = {
        horizontal: {
          newScroll: this.adapter.scrollLeft(),
          oldScroll: this.oldScroll.x,
          forward: 'right',
          backward: 'left'
        },
        vertical: {
          newScroll: this.adapter.scrollTop(),
          oldScroll: this.oldScroll.y,
          forward: 'down',
          backward: 'up'
        }
      };

      for (var axisKey in axes) {
        var axis = axes[axisKey];
        var isForward = axis.newScroll > axis.oldScroll;
        var direction = isForward ? axis.forward : axis.backward;

        for (var waypointKey in this.waypoints[axisKey]) {
          var waypoint = this.waypoints[axisKey][waypointKey];
          if (waypoint.triggerPoint === null) {
            continue
          }
          var wasBeforeTriggerPoint = axis.oldScroll < waypoint.triggerPoint;
          var nowAfterTriggerPoint = axis.newScroll >= waypoint.triggerPoint;
          var crossedForward = wasBeforeTriggerPoint && nowAfterTriggerPoint;
          var crossedBackward = !wasBeforeTriggerPoint && !nowAfterTriggerPoint;
          if (crossedForward || crossedBackward) {
            waypoint.queueTrigger(direction);
            triggeredGroups[waypoint.group.id] = waypoint.group;
          }
        }
      }

      for (var groupKey in triggeredGroups) {
        triggeredGroups[groupKey].flushTriggers();
      }

      this.oldScroll = {
        x: axes.horizontal.newScroll,
        y: axes.vertical.newScroll
      };
    };

    /* Private */
    Context.prototype.innerHeight = function() {
      /*eslint-disable eqeqeq */
      if (this.element == this.element.window) {
        return Waypoint.viewportHeight()
      }
      /*eslint-enable eqeqeq */
      return this.adapter.innerHeight()
    };

    /* Private */
    Context.prototype.remove = function(waypoint) {
      delete this.waypoints[waypoint.axis][waypoint.key];
      this.checkEmpty();
    };

    /* Private */
    Context.prototype.innerWidth = function() {
      /*eslint-disable eqeqeq */
      if (this.element == this.element.window) {
        return Waypoint.viewportWidth()
      }
      /*eslint-enable eqeqeq */
      return this.adapter.innerWidth()
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/context-destroy */
    Context.prototype.destroy = function() {
      var allWaypoints = [];
      for (var axis in this.waypoints) {
        for (var waypointKey in this.waypoints[axis]) {
          allWaypoints.push(this.waypoints[axis][waypointKey]);
        }
      }
      for (var i = 0, end = allWaypoints.length; i < end; i++) {
        allWaypoints[i].destroy();
      }
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/context-refresh */
    Context.prototype.refresh = function() {
      /*eslint-disable eqeqeq */
      var isWindow = this.element == this.element.window;
      /*eslint-enable eqeqeq */
      var contextOffset = isWindow ? undefined : this.adapter.offset();
      var triggeredGroups = {};
      var axes;

      this.handleScroll();
      axes = {
        horizontal: {
          contextOffset: isWindow ? 0 : contextOffset.left,
          contextScroll: isWindow ? 0 : this.oldScroll.x,
          contextDimension: this.innerWidth(),
          oldScroll: this.oldScroll.x,
          forward: 'right',
          backward: 'left',
          offsetProp: 'left'
        },
        vertical: {
          contextOffset: isWindow ? 0 : contextOffset.top,
          contextScroll: isWindow ? 0 : this.oldScroll.y,
          contextDimension: this.innerHeight(),
          oldScroll: this.oldScroll.y,
          forward: 'down',
          backward: 'up',
          offsetProp: 'top'
        }
      };

      for (var axisKey in axes) {
        var axis = axes[axisKey];
        for (var waypointKey in this.waypoints[axisKey]) {
          var waypoint = this.waypoints[axisKey][waypointKey];
          var adjustment = waypoint.options.offset;
          var oldTriggerPoint = waypoint.triggerPoint;
          var elementOffset = 0;
          var freshWaypoint = oldTriggerPoint == null;
          var contextModifier, wasBeforeScroll, nowAfterScroll;
          var triggeredBackward, triggeredForward;

          if (waypoint.element !== waypoint.element.window) {
            elementOffset = waypoint.adapter.offset()[axis.offsetProp];
          }

          if (typeof adjustment === 'function') {
            adjustment = adjustment.apply(waypoint);
          }
          else if (typeof adjustment === 'string') {
            adjustment = parseFloat(adjustment);
            if (waypoint.options.offset.indexOf('%') > - 1) {
              adjustment = Math.ceil(axis.contextDimension * adjustment / 100);
            }
          }

          contextModifier = axis.contextScroll - axis.contextOffset;
          waypoint.triggerPoint = Math.floor(elementOffset + contextModifier - adjustment);
          wasBeforeScroll = oldTriggerPoint < axis.oldScroll;
          nowAfterScroll = waypoint.triggerPoint >= axis.oldScroll;
          triggeredBackward = wasBeforeScroll && nowAfterScroll;
          triggeredForward = !wasBeforeScroll && !nowAfterScroll;

          if (!freshWaypoint && triggeredBackward) {
            waypoint.queueTrigger(axis.backward);
            triggeredGroups[waypoint.group.id] = waypoint.group;
          }
          else if (!freshWaypoint && triggeredForward) {
            waypoint.queueTrigger(axis.forward);
            triggeredGroups[waypoint.group.id] = waypoint.group;
          }
          else if (freshWaypoint && axis.oldScroll >= waypoint.triggerPoint) {
            waypoint.queueTrigger(axis.forward);
            triggeredGroups[waypoint.group.id] = waypoint.group;
          }
        }
      }

      Waypoint.requestAnimationFrame(function() {
        for (var groupKey in triggeredGroups) {
          triggeredGroups[groupKey].flushTriggers();
        }
      });

      return this
    };

    /* Private */
    Context.findOrCreateByElement = function(element) {
      return Context.findByElement(element) || new Context(element)
    };

    /* Private */
    Context.refreshAll = function() {
      for (var contextId in contexts) {
        contexts[contextId].refresh();
      }
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/context-find-by-element */
    Context.findByElement = function(element) {
      return contexts[element.waypointContextKey]
    };

    window.onload = function() {
      if (oldWindowLoad) {
        oldWindowLoad();
      }
      Context.refreshAll();
    };


    Waypoint.requestAnimationFrame = function(callback) {
      var requestFn = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        requestAnimationFrameShim;
      requestFn.call(window, callback);
    };
    Waypoint.Context = Context;
  }())
  ;(function() {

    function byTriggerPoint(a, b) {
      return a.triggerPoint - b.triggerPoint
    }

    function byReverseTriggerPoint(a, b) {
      return b.triggerPoint - a.triggerPoint
    }

    var groups = {
      vertical: {},
      horizontal: {}
    };
    var Waypoint = window.Waypoint;

    /* http://imakewebthings.com/waypoints/api/group */
    function Group(options) {
      this.name = options.name;
      this.axis = options.axis;
      this.id = this.name + '-' + this.axis;
      this.waypoints = [];
      this.clearTriggerQueues();
      groups[this.axis][this.name] = this;
    }

    /* Private */
    Group.prototype.add = function(waypoint) {
      this.waypoints.push(waypoint);
    };

    /* Private */
    Group.prototype.clearTriggerQueues = function() {
      this.triggerQueues = {
        up: [],
        down: [],
        left: [],
        right: []
      };
    };

    /* Private */
    Group.prototype.flushTriggers = function() {
      for (var direction in this.triggerQueues) {
        var waypoints = this.triggerQueues[direction];
        var reverse = direction === 'up' || direction === 'left';
        waypoints.sort(reverse ? byReverseTriggerPoint : byTriggerPoint);
        for (var i = 0, end = waypoints.length; i < end; i += 1) {
          var waypoint = waypoints[i];
          if (waypoint.options.continuous || i === waypoints.length - 1) {
            waypoint.trigger([direction]);
          }
        }
      }
      this.clearTriggerQueues();
    };

    /* Private */
    Group.prototype.next = function(waypoint) {
      this.waypoints.sort(byTriggerPoint);
      var index = Waypoint.Adapter.inArray(waypoint, this.waypoints);
      var isLast = index === this.waypoints.length - 1;
      return isLast ? null : this.waypoints[index + 1]
    };

    /* Private */
    Group.prototype.previous = function(waypoint) {
      this.waypoints.sort(byTriggerPoint);
      var index = Waypoint.Adapter.inArray(waypoint, this.waypoints);
      return index ? this.waypoints[index - 1] : null
    };

    /* Private */
    Group.prototype.queueTrigger = function(waypoint, direction) {
      this.triggerQueues[direction].push(waypoint);
    };

    /* Private */
    Group.prototype.remove = function(waypoint) {
      var index = Waypoint.Adapter.inArray(waypoint, this.waypoints);
      if (index > -1) {
        this.waypoints.splice(index, 1);
      }
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/first */
    Group.prototype.first = function() {
      return this.waypoints[0]
    };

    /* Public */
    /* http://imakewebthings.com/waypoints/api/last */
    Group.prototype.last = function() {
      return this.waypoints[this.waypoints.length - 1]
    };

    /* Private */
    Group.findOrCreate = function(options) {
      return groups[options.axis][options.name] || new Group(options)
    };

    Waypoint.Group = Group;
  }())
  ;(function() {

    var $ = window.jQuery;
    var Waypoint = window.Waypoint;

    function JQueryAdapter(element) {
      this.$element = $(element);
    }

    $.each([
      'innerHeight',
      'innerWidth',
      'off',
      'offset',
      'on',
      'outerHeight',
      'outerWidth',
      'scrollLeft',
      'scrollTop'
    ], function(i, method) {
      JQueryAdapter.prototype[method] = function() {
        var args = Array.prototype.slice.call(arguments);
        return this.$element[method].apply(this.$element, args)
      };
    });

    $.each([
      'extend',
      'inArray',
      'isEmptyObject'
    ], function(i, method) {
      JQueryAdapter[method] = $[method];
    });

    Waypoint.adapters.push({
      name: 'jquery',
      Adapter: JQueryAdapter
    });
    Waypoint.Adapter = JQueryAdapter;
  }())
  ;(function() {

    var Waypoint = window.Waypoint;

    function createExtension(framework) {
      return function() {
        var waypoints = [];
        var overrides = arguments[0];

        if (framework.isFunction(arguments[0])) {
          overrides = framework.extend({}, arguments[1]);
          overrides.handler = arguments[0];
        }

        this.each(function() {
          var options = framework.extend({}, overrides, {
            element: this
          });
          if (typeof options.context === 'string') {
            options.context = framework(this).closest(options.context)[0];
          }
          waypoints.push(new Waypoint(options));
        });

        return waypoints
      }
    }

    if (window.jQuery) {
      window.jQuery.fn.waypoint = createExtension(window.jQuery);
    }
    if (window.Zepto) {
      window.Zepto.fn.waypoint = createExtension(window.Zepto);
    }
  }())
  ;

  /*!
  Waypoints Inview Shortcut - 4.0.1
  Copyright © 2011-2016 Caleb Troughton
  Licensed under the MIT license.
  https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
  */
  (function() {

    function noop() {}

    var Waypoint = window.Waypoint;

    /* http://imakewebthings.com/waypoints/shortcuts/inview */
    function Inview(options) {
      this.options = Waypoint.Adapter.extend({}, Inview.defaults, options);
      this.axis = this.options.horizontal ? 'horizontal' : 'vertical';
      this.waypoints = [];
      this.element = this.options.element;
      this.createWaypoints();
    }

    /* Private */
    Inview.prototype.createWaypoints = function() {
      var configs = {
        vertical: [{
          down: 'enter',
          up: 'exited',
          offset: '100%'
        }, {
          down: 'entered',
          up: 'exit',
          offset: 'bottom-in-view'
        }, {
          down: 'exit',
          up: 'entered',
          offset: 0
        }, {
          down: 'exited',
          up: 'enter',
          offset: function() {
            return -this.adapter.outerHeight()
          }
        }],
        horizontal: [{
          right: 'enter',
          left: 'exited',
          offset: '100%'
        }, {
          right: 'entered',
          left: 'exit',
          offset: 'right-in-view'
        }, {
          right: 'exit',
          left: 'entered',
          offset: 0
        }, {
          right: 'exited',
          left: 'enter',
          offset: function() {
            return -this.adapter.outerWidth()
          }
        }]
      };

      for (var i = 0, end = configs[this.axis].length; i < end; i++) {
        var config = configs[this.axis][i];
        this.createWaypoint(config);
      }
    };

    /* Private */
    Inview.prototype.createWaypoint = function(config) {
      var self = this;
      this.waypoints.push(new Waypoint({
        context: this.options.context,
        element: this.options.element,
        enabled: this.options.enabled,
        handler: (function(config) {
          return function(direction) {
            self.options[config[direction]].call(self, direction);
          }
        }(config)),
        offset: config.offset,
        horizontal: this.options.horizontal
      }));
    };

    /* Public */
    Inview.prototype.destroy = function() {
      for (var i = 0, end = this.waypoints.length; i < end; i++) {
        this.waypoints[i].destroy();
      }
      this.waypoints = [];
    };

    Inview.prototype.disable = function() {
      for (var i = 0, end = this.waypoints.length; i < end; i++) {
        this.waypoints[i].disable();
      }
    };

    Inview.prototype.enable = function() {
      for (var i = 0, end = this.waypoints.length; i < end; i++) {
        this.waypoints[i].enable();
      }
    };

    Inview.defaults = {
      context: window,
      enabled: true,
      enter: noop,
      entered: noop,
      exit: noop,
      exited: noop
    };

    Waypoint.Inview = Inview;
  }())
  ;

  const showImage = (item, el) => {
      const className = 'scrolling-slideshow__static-item-image-container--open';

      if (item && item.length > 0 && !item.hasClass(className)) {
          $__default["default"](`.${className}`, el).removeClass(className);
          item.addClass(className);
      }
  };

  const mobile = 1024;
  const horizontalImageClassName = 'scrolling-slideshow__static-item-image-inside-container--horizontal';
  const isMobile = () => $__default["default"](window).width() < mobile;

  class ScrollingSlideShowModule {
      constructor(el) {
          this.current = null;
          if (el) {
              this.elements = {
                  el: el,
                  items: el.querySelector('.scrolling-slideshow__items'),
                  anchors: el.querySelectorAll('.scrolling-slideshow__item-anchor'),
                  labelsElement: el.querySelector('.scrolling-slideshow__labels'),
                  labels: el.querySelectorAll(`.scrolling-slideshow__labels-element`),
                  toggles: el.querySelectorAll('.image-caption__toggle'),
                  staticContainerImages: el.querySelectorAll('.scrolling-slideshow__static-item-image-inside-container img')
              };
              this.scrollWorking = false;

              if (el.getAttribute('data-mode') === "EDIT") {
                  el.style['max-height'] = '580px';
              } else {
                  this.attachEvents();
                  this.calculateMobileMenu();
                  this.checkImages();
                  this.showFirstMilestone();
              }
          }
      }

      attachEvents() {
          let resize = null;

          this.attachWayPoints();

          window.addEventListener('resize', () => {
              if (!resize) {
                  resize = setTimeout(() => {
                      this.onWindowResize();
                      resize = null;
                  }, 150);
              }
          });

          this.elements.toggles.forEach(element => {
              element.addEventListener('click', (event) => {
                  event.preventDefault();
                  element.parentNode.classList.toggle('toggle-open');
              });
          });

          this.elements.labels.forEach(element => {
              element.addEventListener('click', event => {
                  event.preventDefault();
                  this.clickOnAnchor(element.getAttribute('data-item'));
              });
          });
      }

      attachWayPoints() {
          const $element = $__default["default"](this.elements.el);
          const className = 'fixed';
          const self = this;

          new Waypoint.Inview({ // eslint-disable-line
              element: this.elements.el,
              entered: (direction) => {
                  if (direction === "down") {
                      $element.removeClass(className);
                      $element.addClass('bottom');
                  } else if (direction === "up") {
                      $element.removeClass(className);
                      $element.removeClass('bottom');
                  }
              },
              exit: (direction) => {
                  if (direction === "down" || direction === "up") {
                      $element.addClass(className);
                  }
              }
          });

          $__default["default"](this.elements.anchors).waypoint(function (direction) {
              const $el = direction === "down" ? $__default["default"](this.element) : $__default["default"](this.element).prev().prev();
              const index = $el.attr('data-index');

              if (index !== "last" && !self.scrollWorking) {
                  self.activateMilestone($el, index);
              }
          }, {
              offset: isMobile() ? '0' : '50%'
          });
      }

      clickOnAnchor(attr) {
          if (attr) {
              const elem = this.elements.el.querySelector(`.scrolling-slideshow__item-anchor[data-anchor="${attr}"]`);

              if (elem) {
                  this.scrollWorking = true;
                  const scrollTo = $__default["default"](elem).offset().top - ($__default["default"](window).width() >= 1024 ? 100 : -50);
                  $__default["default"]([document.documentElement, document.body]).animate({
                      scrollTop: scrollTo < 0 ? 0 : scrollTo
                  }, 1500, () =>{
                      this.scrollWorking = false;
                  });

                  this.activateMilestone($__default["default"](elem));
              }
          }
      }

      onWindowResize() {
          this.calculateMobileMenu();
      }

      activateMilestone(elem, index = "0") {
          const attr = elem.attr('data-anchor');

          this.setImage(attr, index);
          this.setOpacityText(elem);
          this.activateLabel(attr);
      }

      showFirstMilestone() {
          $__default["default"]('.scrolling-slideshow__item', this.elements.el).first().addClass('first');
          this.activateMilestone($__default["default"]('.scrolling-slideshow__item-anchor', this.elements.el).first());
      }

      activateLabel(current) {
          const activeLabelClass = 'scrolling-slideshow__labels-element--active';
          const elem = this.elements.el.querySelector(`.scrolling-slideshow__labels-element[data-item="${current}"]`);
          const activeLabel = this.elements.el.querySelector(`.${activeLabelClass}`);

          if (elem) {
              if (activeLabel) {
                  activeLabel.classList.remove(activeLabelClass);
              }

              elem.classList.add(activeLabelClass);
          }
      }

      setOpacityText(anchor) {
          const className = 'no-opacity';

          $__default["default"](`.${className}`, this.elements.el).removeClass(className);
          $__default["default"](anchor).next().addClass(className);
      }

      calculateMobileMenu() {
          const $label = $__default["default"](this.elements.labelsElement);
          const labelContainerWidth = $label.width();

          if (this.elements.labels) {
              const labels = Array.from(this.elements.labels);
              const labelsWidth = labels.reduce((prev, current) => prev + $__default["default"](current).outerWidth(true), 0);
              const cssValue = labelContainerWidth > labelsWidth ? 'center' : '';

              $__default["default"]('.scrolling-slideshow__labels-content', $label).css('justify-content', cssValue);
          }
      }

      checkImages() {
          const images = this.elements.staticContainerImages;

          if (images) {
              Array.from(images).forEach(img => {
                  if (img.naturalWidth > img.naturalHeight) {
                      img.parentNode.parentNode.classList.add(horizontalImageClassName);
                  }
              });
          }
      }

      setImage(attr, index) {
          showImage(this.getStaticImage(attr, index), this.elements.el);
      }

      getStaticImage(attr, index) {
          const selector = `.scrolling-slideshow__static-item-image-container[data-index="${index}"][data-item-index="${attr}"]`;

          return $__default["default"](selector, this.elements.el);
      }

  }

  class ScrollingSlideShow {
      constructor() {
          this.initialize();
      }

      initialize() {
          const elements = document.querySelectorAll('.scrolling-slideshow-container');

          if (elements) {
              Array.from(elements).forEach(el => new ScrollingSlideShowModule(el));
          }

      }
  }

  var scrollingSlideshow_component = new ScrollingSlideShow();

  return scrollingSlideshow_component;

})($);
//# sourceMappingURL=scrolling-slideshow.component.js.map

(function ($, BrowserStorage, Utils) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var BrowserStorage__default = /*#__PURE__*/_interopDefaultLegacy(BrowserStorage);
  var Utils__default = /*#__PURE__*/_interopDefaultLegacy(Utils);

  // component class
  class IntersitialRedirectModal {
    constructor(element, options) {
      window.localeInterstitialShown = false;

      const defaults = {
        siteLocale: 'en_us',
        dismissedCookie: 'localeRedirectDismissed',
        availableLocales: 'en_au,en_ca,en_hk,en_in,en_us,es,es_mx,in,pt_br,zh_cn,zh_hk',
        defaultLocale: '', // is there a default locale?
        defaultCountryLocales: {
          'au': 'en_au',
          'br': 'pt_br',
          'ca': 'en_ca',
          'cn': 'zh_cn',
          'hk': 'zh_hk', // or should this be en_hk?
          'id': 'in',
          'in': 'en_in',
          'mx': 'es_mx'
          //...
        },
        defaultLanguageLocales: {
          'en': 'en_us',
          'es': 'es'
          //...
        }
      };

      this.element = element;
      this.$element = $__default["default"](element);
      this.settings = $__default["default"].extend({}, defaults, options, $__default["default"](element).data(), true);

      this.componentRootClassname = "c-interstitial-modal";
      this.browserLocale = '';
      this.userLanguage = '';
      this.userCountryCode = '';
      this.userLocalization = '';
      this.siteLocalization = '';
      this.suggestedLocalization = '';
      this.availableLocales = [];
      this.defaultLocale = '';
      this.defaultCountryLocales = {};
      this.defaultLanguageLocales = {};

      this.$title = $__default["default"]();
      this.$message = $__default["default"]();
      this.$redirectCta = $__default["default"]();
      this.$dismissCta = $__default["default"]();
      this.$closeBtn = $__default["default"]();

      this.events = {
        show: new window.Event('show-localeInterstitial', {bubbles: true}),
        hide: new window.Event('hide-localeInterstitial', {bubbles: true})
      };

      this.i18nKeys = {
        title: '',
        message: '',
        redirectUrl: '',
        redirectCta: '',
        dismissCta: ''
      };

      this.translations = {
        title: '',
        message: '',
        redirectUrl: '',
        redirectCta: '',
        dismissCta: ''
      };

      // if the Granite.I18n service is undefined, we need to mock the service enough
      // that we're able to test the rest of the functionality.
      this.translationService = (window.Granite && window.Granite.I18n) ? window.Granite.I18n : {
        get(key) {
          return key;
        },
        setLocale(locale) {
          console.log(`setLocale(${locale})`);
        }
      };

      this.init();
    }

    init() {
      try {
        if (!this.wasDismissed()) {
          Utils__default["default"].checkBrowserLocale();

          this.siteLocalization = this.normalizeLocale(this.settings.siteLocale);
          // i18n doesn't accept 'id' as a valid language code, but expects 'in' for Indonesian instead
          if (this.siteLocalization === 'id') this.siteLocalization = 'in';
          this.availableLocales = this.settings.availableLocales.split(',');

          // convert options to json objects if needed
          this.defaultCountryLocales = this.parseDefaultLocaleSetting(this.settings.defaultCountryLocales);
          this.defaultLanguageLocales = this.parseDefaultLocaleSetting(this.settings.defaultLanguageLocales);

          // normalize the default locale options
          this.defaultLocale = this.normalizeLocale(this.settings.defaultLocale);

          for (let i=0;i<this.availableLocales.length;i++) {
            this.availableLocales[i] = this.normalizeLocale(this.availableLocales[i]);
          }

          this.availableLocales = Array.from(new Set(this.availableLocales)); // dedup locales and remove empty items

          this.normalizeDefaultLocaleObject(this.defaultCountryLocales);
          this.normalizeDefaultLocaleObject(this.defaultLanguageLocales);

          this.$title = this.$element.find(`.${this.componentRootClassname}__title`);
          this.$message = this.$element.find(`.${this.componentRootClassname}__message`);
          this.$redirectCta = this.$element.find(`.${this.componentRootClassname}__redirect-cta`);
          this.$dismissCta = this.$element.find(`.${this.componentRootClassname}__dismiss-cta`);
          this.$closeBtn = this.$element.find(`.${this.componentRootClassname}__close-button`);

          this.i18nKeys.title = $__default["default"].trim(this.$title.text());
          this.i18nKeys.message = $__default["default"].trim(this.$message.text());
          this.i18nKeys.redirectUrl = $__default["default"].trim(this.$redirectCta.attr('href'));
          this.i18nKeys.redirectCta = $__default["default"].trim(this.$redirectCta.text());
          this.i18nKeys.dismissCta = $__default["default"].trim(this.$dismissCta.text());

          this.getUserLocalization().then(() => {
            if (this.shouldShow()) {
              this.bindEvents();
              this.translationService.setLocale(this.suggestedLocalization);
              this.$element.addClass('c-modal').removeClass('hide');
              this.updateContent();
              this.show();
            }
          });
        } else {
          BrowserStorage__default["default"].setCookie(this.settings.dismissedCookie, 'true', 365); // reset the cookie expire date
        }
      } catch (err) {
        console.log(err);
      }
    }

    bindEvents() {
      let self = this;

      $__default["default"](document).on('click', function (evt) {
        if ($__default["default"](evt.target).is(self.$closeBtn) || $__default["default"](evt.target).is(self.$element) || $__default["default"](evt.target).is(self.$dismissCta)) {
          evt.preventDefault();
          self.dismiss();
        }
      });

      this.$redirectCta.click(function () {
        Utils__default["default"].setAnalyticsByPage({
          'event_name': 'lightbox_click',
          'lightbox_name': self.translations.title,
          'link_name': self.translations.redirectCta
        }, true);
      });
    }

    show() {
      this.$element.addClass('is-visible');
      $__default["default"]('html, body').addClass('modal-open');
      window.localeInterstitialShown = true;
      this.element.dispatchEvent(this.events.show);
      Utils__default["default"].setAnalyticsByPage({
        'event_name': 'lightbox_impression',
        'lightbox_name': this.translations.title
      }, true);
    }

    hide() {
      this.$element.removeClass('is-visible');
      $__default["default"]('html, body').removeClass('modal-open');
      window.localeInterstitialShown = false;
      this.element.dispatchEvent(this.events.hide);
    }

    dismiss() {
      BrowserStorage__default["default"].setCookie(this.settings.dismissedCookie, 'true', 365);
      this.hide();
    }

    wasDismissed() {
      return BrowserStorage__default["default"].getCookie(this.settings.dismissedCookie);
    }

    shouldShow() {
      // If a Pop Up is present, do not show the Interstitial Modal.
      if ($__default["default"](".c-pop-up").is(":visible")) {
        console.log("Pop Up is visible; don’t show Interstitial Modal");
        return false;
      }

      // in case it was some how initialized in edit mode, we need to make sure it gets blocked
      if (this.settings.cqMode === 'EDIT' || $__default["default"]('body').hasClass('in-edit')) return false;
      if (this.wasDismissed()) return false;

      if (this.userLocalization !== this.siteLocalization) {
        // check to see if the user's localization matches any of the available site localizations
        for (let i=0;i<this.availableLocales.length;i++) {
          if (this.userLocalization === $__default["default"].trim(this.availableLocales[i]).toLowerCase()) {
            this.suggestedLocalization = this.userLocalization;
            break;
          }
        }

        if (!this.suggestedLocalization) this.suggestedLocalization = this.defaultCountryLocales[this.userCountryCode];
        if (!this.suggestedLocalization) this.suggestedLocalization = this.defaultLanguageLocales[this.userLanguage];
        if (!this.suggestedLocalization) this.suggestedLocalization = this.defaultLocale;
        if (this.suggestedLocalization && this.suggestedLocalization !== this.siteLocalization) return true;
      }

      return false;
    }

    getUserLocalization() {
      this.browserLocale = this.normalizeLocale(BrowserStorage__default["default"].getCookie('browserLocale'));

      // do nothing unless the browserLocale makes sense
      switch (this.browserLocale.length) {
        case 2:
          this.userLanguage = this.browserLocale;
        break;

        case 5:
          if (this.browserLocale.includes('_')) this.userLanguage = this.browserLocale.substring(0, 2);
        break;
          // do nothing because the browserLocale makes no sense
      }

      // i18n doesn't accept 'id' as a valid language code, but expects 'in' for Indonesian instead
      if (this.userLanguage === 'id') this.userLanguage = 'in';
      this.userLocalization = this.userLanguage;

      return Utils__default["default"].checkGeolocation().then((response) => {
        this.userCountryCode = this.normalizeLocale(response.response["pulse-two-letter-country"]);
        this.userLocalization = `${this.userLanguage}${this.userCountryCode ? `_${this.userCountryCode}` : ''}`;

        // Since the site code for Indonesia is actually just "id" (which get's converted to "in" for i18n),
        // and users should only be redirected to the Indonesian site if they're actually in Indonesia,
        // the user's localization code should stay as "in" instead of being "in_id" as to match the site's localization
        if (this.userLocalization === 'in_id') this.userLocalization = 'in';
      }).catch((err) => {
        console.log(err);
      });
    }

    updateContent() {
      this.translations.title = this.translationService.get(this.i18nKeys.title) || this.i18nKeys.title;
      this.translations.message = this.translationService.get(this.i18nKeys.message) || this.i18nKeys.message;
      this.translations.redirectUrl = this.translationService.get(this.i18nKeys.redirectUrl) || this.i18nKeys.redirectUrl;
      this.translations.redirectCta = this.translationService.get(this.i18nKeys.redirectCta) || this.i18nKeys.redirectCta;
      this.translations.dismissCta = this.translationService.get(this.i18nKeys.dismissCta) || this.i18nKeys.dismissCta;

      this.$title.text(this.translations.title);
      this.$message.text(this.translations.message);
      this.$redirectCta.attr('href', this.translations.redirectUrl);
      this.$redirectCta.text(this.translations.redirectCta);
      this.$dismissCta.text(this.translations.dismissCta);
    }

    normalizeLocale(locale) {
      return $__default["default"].trim(locale).toLowerCase().replace('-', '_');
    }

    normalizeDefaultLocaleObject(obj) {
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          let noramlizedKey = this.normalizeLocale(key);
          obj[noramlizedKey] = this.normalizeLocale(obj[key]);
          if (key !== noramlizedKey) delete obj[key];
        }
      }
    }

    parseDefaultLocaleSetting(inObj) {
      let result = {};

      switch (typeof inObj) {
        case 'string':
          result = JSON.parse(inObj);
          break;
        case 'object':
          result = inObj;
          break;
          // do nothing
      }

      return result;
    }
  }

  $__default["default"].fn.intersitialRedirectModal = function (options) {
    return this.each(function () {
      return new IntersitialRedirectModal(this, options);
    });
  };

  $__default["default"](document).ready(function () {
    // Don't initialize the modal when in edit mode
    // Is there a better way to determine if AEM is in edit mode?
    if (!$__default["default"]('body').hasClass('in-edit')) $__default["default"]('.c-interstitial-modal').intersitialRedirectModal();
  });

})($, TNC.BrowserStorage, TNC.Utility);
//# sourceMappingURL=interstitial-redirect-modal.component.js.map

this.TNC = this.TNC || {};
this.TNC.ProgressTracker = (function () {
    'use strict';

    class ProgressTracker {
        constructor() {
            this.initialize();
        }

        initialize() {
            this.fixSingleWord();
        }

        fixSingleWord() {
            // Insert a non-breaking space between the last two words
            // to prevent a single word from appearing on the last line.
            var desc = document.querySelector(
                ".c-progress-tracker__description");
            if (desc) {
                var parts = desc.textContent.trim().split(" ");
                var secondToLastPart = parts[parts.length - 2];
                var lastPart = parts[parts.length - 1];
                var newLastPart = secondToLastPart + "&nbsp;" + lastPart;
                parts[parts.length - 2] = newLastPart;
                parts.pop();
                var newText = parts.join(" ");
                desc.innerHTML = newText;
            }
        }
    }

    var progressTracker_component = new ProgressTracker();

    return progressTracker_component;

})();
//# sourceMappingURL=progress-tracker.component.js.map

this.TNC = this.TNC || {};
this.TNC.Table = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    class Table {
        constructor() {
            this.initialize();
        }

        initialize() {
            var that = this;

            // In the AEM authoring UI, customize the configuration dialog.
            $__default["default"](document).on("foundation-contentloaded", function (e) {
                if (e.target.className !== undefined &&
                    e.target.className.length > 0) {

                    // Only act if the event has brought up the dialog.
                    if (e.target.className.indexOf("cq-Dialog") > -1) {
                        var tableDataField = $__default["default"](".table-data-field");
                        // Confirm that this dialog is for the Table component.
                        if (tableDataField.length > 0) {

                            // Check for file upload support in the browser.
                            if (window.File && window.FileReader &&
                                window.FileList && window.Blob) {

                                // Add a file upload element to the dialog.
                                tableDataField.parent().append("<p " +
                                    "class='coral-Form-fieldlabel " +
                                    "table-data-csv-label'>Upload CSV file" +
                                    "</p><input type='file' class='table-data-csv' " +
                                    "accept='text/csv, text/plain'>");
                                // Add an event handler for the file upload element.
                                var fileInput = $__default["default"](".table-data-csv");
                                if (fileInput) {
                                    fileInput.on("change", function () {
                                        that.setTableData();
                                    });
                                }
                            }
                            else {
                                window.alert("Your browser is too old to " +
                                    "support file uploads. Please upgrade.");
                            }
                        }
                    }
                }
            });
        }

        setTableData() {
            // When the Table authoring dialog's CSV file upload element
            // changes, a file has been uploaded. Read the file's contents
            // and put them in the table data textarea element.
            var fileInput = $__default["default"](".table-data-csv");
            if (fileInput) {
                var file = fileInput.get(0).files[0];
                if (file) {
                    var reader = new window.FileReader();

                    reader.onload = function (event) {
                        var textArea = $__default["default"](".table-data-field");
                        var fileContents = event.target.result;
                        textArea.val(fileContents);
                    };

                    var textFile = /text.*/;
                    if (file.type.match(textFile)) {
                        // The file does appears to be text, so read it.
                        reader.readAsText(file);
                    }
                    else {
                        window.alert(
                            "The file does not appear to be a text file.");
                        // Clear the filename.
                        fileInput.val("");
                    }
                }
            }
        }
    }

    var table_component = new Table();

    return table_component;

})($);
//# sourceMappingURL=table.component.js.map

this.TNC = this.TNC || {};
this.TNC.OverviewAndChart = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    class OverviewAndChart {
        constructor() {
            this.initialize();
        }

        initialize() {
            this.setUpDiscloseButton();
        }

        setUpDiscloseButton() {
            // Add, set up, and handle the "See more/See less" button.

            const MIN_BODY_CHARS_CLAMPED = 330;
            const MORE_CLASS = "c-overview-and-chart__disclose--more";
            const CLAMPED_CLASS = "c-overview-and-chart__body--clamped";

            // Support multiple instances of this component on the same page.
            var componentInstances = $__default["default"](".c-overview-and-chart");
            for (var i = 0; i < componentInstances.length; i++) {
                var instance = componentInstances[i];
                var lessText = $__default["default"](instance).data("less-label");
                var moreText = $__default["default"](instance).data("more-label");
                var overview = $__default["default"](instance).find(
                    ".c-overview-and-chart__overview");
                var overviewBody = $__default["default"](instance).find(
                    ".c-overview-and-chart__body");
                if (overviewBody.text().length < MIN_BODY_CHARS_CLAMPED) {
                    // If text is short, skip adding a See more/less button.
                    continue;
                }

                var discloseButtonHTML = "<button " +
                    "class=\"c-overview-and-chart__disclose\">" + lessText +
                    "</button>";
                overview.append(discloseButtonHTML);

                var discloseButton = $__default["default"](instance).find(
                    ".c-overview-and-chart__disclose");
                if (overviewBody && discloseButton) {
                    discloseButton.on("click", (event) => {
                        var button = $__default["default"](event.target);
                        var body = button.parent().find(
                            ".c-overview-and-chart__body");
                        if (button.text() === lessText) {
                            body.addClass(CLAMPED_CLASS);
                            button.text(moreText);
                            button.addClass(MORE_CLASS);
                        }
                        else {
                            body.removeClass(CLAMPED_CLASS);
                            button.text(lessText);
                            button.removeClass(MORE_CLASS);
                        }
                    });
                    // If JS doesn't run or fails early, the entire body text is
                    // shown. Otherwise, if JS runs OK, set the initial state
                    // to closed ("See more").
                    discloseButton.click();
                }
            }
        }

    }

    var overviewAndChart_component = new OverviewAndChart();

    return overviewAndChart_component;

})($);
//# sourceMappingURL=overview-and-chart.component.js.map

this.TNC = this.TNC || {};
this.TNC.ImmersiveHero = (function ($, ReadTime) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var ReadTime__default = /*#__PURE__*/_interopDefaultLegacy(ReadTime);

    class ImmersiveHero {
        constructor() {
            this.baseElement = $__default["default"](".c-immersive-hero");

            this.initialize();
        }

        initialize() {
            // Set up link handler for smooth-moving "Continue" link.
            $__default["default"](".c-immersive-hero__continue").on("click touchend",
                function () {
                    var subsectionElement = $__default["default"](".c-immersive-hero__subsection");

                    // Scroll to the target element.
                    var scrollMilliseconds = 1000,
                        socialShareHeightPixels = 75;
                    var elementId = $__default["default"](subsectionElement).attr("id");
                    var targetHash = "#" + elementId;
                    var target = $__default["default"](targetHash);
                    var scrollPosition = (target.offset().top
                        - socialShareHeightPixels);
                    $__default["default"]([document.documentElement, document.body]).animate({
                        scrollTop: scrollPosition
                    }, scrollMilliseconds, function () {
                        // Callback after animation:
                        // Must set the focus, for accessibility.
                        target.focus();

                        // Update the URL fragment.
                        window.location.hash = targetHash;
                    });
                    return false;
                }
            );

            // Hide the caption and credit text, if present.
            $__default["default"](".c-immersive-hero__image-caption-credit").addClass(
                "c-immersive-hero__image-caption-credit--hidden");

            // Set up button and handler to toggle image caption and credit.
            var ariaLabel = $__default["default"](".c-immersive-hero__image-caption-credit").attr(
                "data-button-aria-label");
            var button = "<button " +
                "class='c-immersive-hero__image-caption-credit-button " +
                "c-image-credit_toggle' aria-label='" + ariaLabel + "'></button>";
            $__default["default"](".c-immersive-hero__image-caption-credit").after(button);
            $__default["default"](".c-immersive-hero__image-caption-credit-button").on(
                    "click touchend", function () {
                $__default["default"](".c-immersive-hero__image-caption-credit").toggleClass(
                    "c-immersive-hero__image-caption-credit--hidden");
            });

            // Show estimated read time, if available.
            if (this.baseElement.length) {
                ReadTime__default["default"].initialize(this.baseElement);
                ReadTime__default["default"].showReadTime();
            }
        }
    }
    var immersiveHero_component = new ImmersiveHero();

    return immersiveHero_component;

})($, TNC.ReadTime);
//# sourceMappingURL=immersive-hero.component.js.map

this.TNC = this.TNC || {};
this.TNC.InteractiveTiles = (function ($, MicroModal, MicroModalConfig, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var MicroModal__default = /*#__PURE__*/_interopDefaultLegacy(MicroModal);
    var MicroModalConfig__default = /*#__PURE__*/_interopDefaultLegacy(MicroModalConfig);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    class InteractiveTiles {
        constructor() {
            this.initialize();
        }

        initialize() {
            // Show the hidden tile navigation items.
            $__default["default"](".c-interactive-tiles__nav").removeClass(
                "c-interactive-tiles__nav--hidden");
            $__default["default"](".c-interactive-tiles__nav").attr("aria-hidden", "false");

            // Initialize MicroModal which will handle the event bindings
            // for showing and hiding the modal dialogs.

            // Initialize MicroModal with a TNC-default configuration object.
            let config = MicroModalConfig__default["default"].defaultConfig;
            console.log("Interactive Tiles MicroModal config:", config);
            MicroModal__default["default"].init(config);

            // Track tile activations in analytics.
            $__default["default"](".c-interactive-tiles__nav-button").on("click", function () {
                let labelText = "";
                let button = $__default["default"](this);
                if (button) {
                    let label = button.find(".c-interactive-tiles__nav-label");
                    if (label) {
                        labelText = label.text();
                    }
                }
                let tileTags = {
                    "event_name": "generic_engagement_click",
                    "generic_engagement_name": labelText
                };

                utl__default["default"].setAnalyticsByPage(tileTags, true);
            });
        }
    }

    var interactiveTiles_component = new InteractiveTiles();

    return interactiveTiles_component;

})($, MicroModal, TNC.MicroModal, TNC.Utility);
//# sourceMappingURL=interactive-tiles.component.js.map

this.TNC = this.TNC || {};
this.TNC.FullBleedCTA = (function (utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    // Full-Bleed CTA Cards component JS

    class FullBleedCTA {
        constructor() {
            this.initialize();
        }

        initialize() {
            console.log("FullBleedCTA: initialize");
            this.breakpoint = this.getBreakpoint();
            this.adjustInteractiveItems();
            this.setEventHandlers();
        }

        // Get the current breakpoint embedded in the HTML by CSS (in common.css).
        getBreakpoint() {
            let breakpoint = window.getComputedStyle(document.body,
                ":before").content.replace(/"/g, "");
            return breakpoint;
        }

        // Adjust interactive items based on screen size.
        adjustInteractiveItems() {
            // Set tab index on -preview items. These function as "buttons"
            // on larger screen sizes, but are not needed on smaller ones
            // because there is no toggling going on.
            let newTabIndex = 0;
            if (this.breakpoint === "xsmall" || this.breakpoint === "small" ||
                    this.breakpoint === "medium") {
                newTabIndex = -1;
            }
            let previewElements = document.querySelectorAll(
                ".c-full-bleed-cta__card-preview");
            previewElements.forEach((previewElement) => {
                previewElement.setAttribute("tabindex", newTabIndex);
            });
        }

        setAnalytics(itemTitle) {
            let itemDetails = {
                "event_name": "cta_card_click",
                "cta_card_title": itemTitle
            };
            console.log("FullBleedCTA: set analytics:",
                itemDetails);
            utl__default["default"].setAnalyticsByPage(itemDetails, true);
        }

        cardShowing(cardsContainer) {
            // Return the card number of the card currently showing
            // for an instance of the component in the mobile view.
            let showing = 0;
            let classList = cardsContainer.classList;
            if (classList.contains(
                    "c-full-bleed-cta__cards--mobile-show-card-1")) {
                showing = 1;
            }
            else if (classList.contains(
                    "c-full-bleed-cta__cards--mobile-show-card-2")) {
                showing = 2;
            }
            else if (classList.contains(
                    "c-full-bleed-cta__cards--mobile-show-card-3")) {
                showing = 3;
            }
            else if (classList.contains(
                    "c-full-bleed-cta__cards--mobile-show-card-4")) {
                showing = 4;
            }

            return showing;
        }

        showCard(cardNumber, cardsContainer) {
            let cards = cardsContainer.querySelectorAll(
                ".c-full-bleed-cta__card");
            let numCards = cards.length;
            if (cardNumber > numCards) {
                console.log("FullBleedCTA: No card to show:", cardNumber);
                return;
            }

            cardsContainer.classList.remove(
                "c-full-bleed-cta__cards--mobile-show-card-1");
            cardsContainer.classList.remove(
                "c-full-bleed-cta__cards--mobile-show-card-2");
            cardsContainer.classList.remove(
                "c-full-bleed-cta__cards--mobile-show-card-3");
            cardsContainer.classList.remove(
                "c-full-bleed-cta__cards--mobile-show-card-4");
            let cardToShow =
                "c-full-bleed-cta__cards--mobile-show-card-" +
                cardNumber;
            cardsContainer.classList.add(cardToShow);

            // Set the current navigation button.
            let buttonsContainer = cardsContainer.closest(
                ".c-full-bleed-cta").querySelector(
                ".c-full-bleed-cta__mobile-navigation");
            let navigationButtons = buttonsContainer.querySelectorAll(
                ".c-full-bleed-cta__mobile-button");
            navigationButtons.forEach((button) => {
                button.removeAttribute("aria-current");
            });
            let currentButtonClass = ".c-full-bleed-cta__mobile-button--" +
                cardNumber;
            let currentButton = buttonsContainer.querySelector(
                currentButtonClass);
            currentButton.setAttribute("aria-current", "true");
        }

        setEventHandlers() {
            // Set a handler for the window resize event.
            var resizeTimer;
            window.addEventListener("resize", () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    // Resizing has finished.
                    console.log("FullBleedCTA: resized");
                    this.breakpoint = this.getBreakpoint();
                    this.adjustInteractiveItems();
                }, 250);
            }, false);

            // Swipe support, based on:
            // https://stackoverflow.com/questions/62823062/
            var touchendX, touchstartX;
            let horizontalSwipeThreshold = 30;
            let cardsContainers = document.querySelectorAll(
                ".c-full-bleed-cta__cards");
            cardsContainers.forEach((cardsContainer) => {
                // Support touch events for swiping left and right.
                cardsContainer.addEventListener("touchstart", (event) => {
                    touchstartX = event.changedTouches[0].screenX;
                }, false);
                cardsContainer.addEventListener("touchend", (event) => {
                    touchendX = event.changedTouches[0].screenX;
                    handleGesture(cardsContainer);
                }, false);
                // Also support similar mouse movements.
                cardsContainer.addEventListener("mousedown", (event) => {
                    touchstartX = event.screenX;
                }, false);
                cardsContainer.addEventListener("mouseup", (event) => {
                    touchendX = event.screenX;
                    handleGesture(cardsContainer);
                }, false);
            });
            const handleGesture = (cardsContainer) => {
                if (touchendX < touchstartX) {
                    // Swipe left
                    if ((touchstartX - touchendX) < horizontalSwipeThreshold) {
                        // Cancel because it probably wasn't an intentional swipe.
                        return;
                    }
                    let currentCard = this.cardShowing(cardsContainer);
                    if (currentCard >= 1 && currentCard <= 3) {
                        this.showCard(currentCard + 1, cardsContainer);
                    }
                }
                if (touchendX > touchstartX) {
                    // Swipe right
                    if ((touchendX - touchstartX) < horizontalSwipeThreshold) {
                        // Cancel because it probably wasn't an intentional swipe.
                        return;
                    }
                    let currentCard = this.cardShowing(cardsContainer);
                    if (currentCard >= 2 && currentCard <= 4) {
                        this.showCard(currentCard - 1, cardsContainer);
                    }
                }
            };

            let cards = document.querySelectorAll(".c-full-bleed-cta__card");
            cards.forEach((card) => {
                // Set keyboard events.
                card.addEventListener("keydown", (event) => {
                    let target = event.target;

                    // At narrow widths, allow moving among the cards using
                    // the left and right arrow keys.
                    if (this.breakpoint === "xsmall" ||
                            this.breakpoint === "small") {
                        let cardsContainer = target.closest(
                            ".c-full-bleed-cta__cards");
                        let currentCard = this.cardShowing(cardsContainer);
                        if (event.key === "ArrowLeft") {
                            // Move to previous card, if present.
                            if (currentCard > 1) {
                                this.showCard(currentCard - 1, cardsContainer);
                            }
                        }
                        else if (event.key === "ArrowRight") {
                            // Move to next card, if present.
                            if (currentCard < 4) {
                                this.showCard(currentCard + 1, cardsContainer);
                            }
                        }
                    }

                    // At wide widths, dismiss an active (full contents) card.
                    if (this.breakpoint !== "xsmall" &&
                            this.breakpoint !== "small") {
                        if (event.key === "Escape") {
                            let card = target.closest(".c-full-bleed-cta__card");
                            card.classList.remove(
                                "c-full-bleed-cta__card--active");
                            if (target.classList.contains(
                                "c-full-bleed-cta__link-anchor")) {

                                // With link hidden, set focus on preview item.
                                let cardLink = target.parentNode;
                                let cardPreview = cardLink.previousSibling;
                                cardPreview.focus();
                            }
                            return;
                        }
                    }

                    // Don't hide or show anything if the keypress is on the link.
                    if (target.classList.contains(
                            "c-full-bleed-cta__link-anchor")) {
                        if (event.key === " ") {
                            event.preventDefault(); // no scrolling on Space key
                        }
                        return;
                    }

                    // At wide widths, toggle the visibility of the card’s
                    // description and link.
                    if (this.breakpoint !== "xsmall" &&
                            this.breakpoint !== "small") {
                        if (target.classList.contains(
                                "c-full-bleed-cta__card-preview")) {
                            if (event.key === " " || event.key === "Enter") {
                                event.preventDefault();   // prevent scrolling
                                let activeClass = "c-full-bleed-cta__card--active";

                                let thisCard = target.parentNode;
                                if (thisCard.classList.contains(activeClass)) {
                                    thisCard.classList.remove(activeClass);
                                }
                                else {
                                    thisCard.classList.add(activeClass);
                                }

                                let cardsContainer = target.closest(
                                    ".c-full-bleed-cta__cards");
                                let allCards = cardsContainer.querySelectorAll(
                                    ".c-full-bleed-cta__card");
                                allCards.forEach((card) => {
                                    if (card !== thisCard) {
                                        card.classList.remove(activeClass);
                                    }
                                });
                            }
                        }
                    }
                });

                // Set mouse and touch events.
                card.addEventListener("click", (event) => {
                    // Don't hide or show anything if the click is on the link.
                    if (event.target.classList.contains(
                            "c-full-bleed-cta__link-anchor")) {
                        console.log("FullBleedCTA: link clicked (click event)");

                        // Get card heading text and set analytics.
                        let cardHeading = card.querySelector("h3").textContent;
                        this.setAnalytics(cardHeading);
                    }
                });

                card.addEventListener("mouseenter", (event) => {
                    if (this.breakpoint !== "xsmall" &&
                            this.breakpoint !== "small") {
                        let activeClass = "c-full-bleed-cta__card--active";

                        if (event.target.classList.contains(activeClass)) {
                            // Full card is already showing; don't hide it.
                            return;
                        }

                        let thisCard = event.target;
                        thisCard.classList.add(activeClass);

                        let cardsContainer = event.target.closest(
                            ".c-full-bleed-cta__cards");
                        let allCards = cardsContainer.querySelectorAll(
                            ".c-full-bleed-cta__card");
                        allCards.forEach((card) => {
                            if (card !== thisCard) {
                                card.classList.remove(activeClass);
                            }
                        });
                    }
                });

                card.addEventListener("mouseleave", (event) => {
                    if (this.breakpoint !== "xsmall" &&
                            this.breakpoint !== "small") {
                        let activeClass = "c-full-bleed-cta__card--active";
                        event.target.classList.remove(activeClass);
                    }
                });
            });

            // Mobile navigation buttons: touch, keyboard, and mouse events
            let buttons1 = document.querySelectorAll(
                ".c-full-bleed-cta__mobile-button--1");
            buttons1.forEach((button1) => {
                button1.addEventListener("click", (event) => {
                    let cardsContainer = event.target.closest(
                        ".c-full-bleed-cta").querySelector(
                        ".c-full-bleed-cta__cards");
                    this.showCard(1, cardsContainer);
                });
            });
            let buttons2 = document.querySelectorAll(
                ".c-full-bleed-cta__mobile-button--2");
            buttons2.forEach((button2) => {
                button2.addEventListener("click", (event) => {
                    let cardsContainer = event.target.closest(
                        ".c-full-bleed-cta").querySelector(
                        ".c-full-bleed-cta__cards");
                    this.showCard(2, cardsContainer);
                });
            });
            let buttons3 = document.querySelectorAll(
                ".c-full-bleed-cta__mobile-button--3");
            buttons3.forEach((button3) => {
                button3.addEventListener("click", (event) => {
                    let cardsContainer = event.target.closest(
                        ".c-full-bleed-cta").querySelector(
                        ".c-full-bleed-cta__cards");
                    this.showCard(3, cardsContainer);
                });
            });
            let buttons4 = document.querySelectorAll(
                ".c-full-bleed-cta__mobile-button--4");
            buttons4.forEach((button4) => {
                button4.addEventListener("click", (event) => {
                    let cardsContainer = event.target.closest(
                        ".c-full-bleed-cta").querySelector(
                        ".c-full-bleed-cta__cards");
                    this.showCard(4, cardsContainer);
                });
            });
        }
    }

    var fullBleedCta_component = new FullBleedCTA();

    return fullBleedCta_component;

})(TNC.Utility);
//# sourceMappingURL=full-bleed-cta.component.js.map

