this.TNC = this.TNC || {};
this.TNC.BrowserStorage = (function () {
    'use strict';

    /** Modal Module Class. */
    class BrowserStorageModule {
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

        }

        /**
         * Get cookie
         *
         */
        getCookie(name) {
            const match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            if (match) {
                return match[1];
            } else {
                return false;
            }
        }

        /**
         * Set cookie
         * eg: setCookie('testname', 'testvalue', 3);
         */

        setCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        }

        /**
         * Delete cookie
         *
         */
        deleteCookie(name) {
            document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        setSession(name,value){
            if(window.sessionStorage){
                window.sessionStorage.setItem(name,value);
            }
            else {
                this.setCookie(name,value);
            }
        }
        getSession(name){
            if(window.sessionStorage){
                let sessionValue=window.sessionStorage.getItem(name);
                let validSession=(sessionValue===undefined || sessionValue===null) ? true : false;
                if(validSession) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                this.getCookie(name);
            }
        }
        getSessionStorageData(name) {
            if(window.sessionStorage){
                let sessionValue=window.sessionStorage.getItem(name);
                return sessionValue;
            }
        }
    }

    var BrowserStorage_module = new BrowserStorageModule();

    return BrowserStorage_module;

})();
//# sourceMappingURL=BrowserStorage.module.js.map

this.TNC = this.TNC || {};
this.TNC.XHR = (function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  /**
   * XHR Class - for making ajax request
   */
  class XHR {
    constructor() {
      this.ajaxConfig = {
        url: '',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        method: 'GET',
        data: null,
        async: true,
        headers: {},
        beforeSend() {
        },
        complete() {
        },
        statusCode: {
          401: function () {
          }
        }
      };
    }
    /**
     * makeConfigObj function :
     *  default ajax config
     *  accept an object to overwrite the default config object
     */
    makeConfigObj(obj) {
      // merge the default
      $__default["default"].extend(this.ajaxConfig, obj);
      return this.ajaxConfig;
    }
    /**
     * initXHR function :
     *  initiate XHR request with the
     *  ajax config obj provided
     */
    initXHR(obj) {
      const ajaxConfig = this.makeConfigObj(obj);

      if (!ajaxConfig.url) {
        return false;
      }

      function errorCallBack(jqXHR, textStatus, errorThrown) {
        window.log(jqXHR, textStatus, errorThrown);
        throw Error(textStatus);
      }

      return $__default["default"].ajax(ajaxConfig).catch(errorCallBack);
    }
  }

  var XHR_module = new XHR();

  return XHR_module;

})($);
//# sourceMappingURL=XHR.module.js.map

this.TNC = this.TNC || {};
this.TNC.Utility = (function ($, browserStorageModule, xhrModule) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var browserStorageModule__default = /*#__PURE__*/_interopDefaultLegacy(browserStorageModule);
  var xhrModule__default = /*#__PURE__*/_interopDefaultLegacy(xhrModule);

  let utagBuff = [];

  /**
   * Utility Class - for sitewide global utility methods
   */
  class Utility {

    /**
     * Utility constructor function : call your method here which you want to trigger at page load
     */
    constructor() {
      this.consoleLog();
      this.checkGeolocation();
      this.trackDonateCTAEvents();
      this.trackPhoneCallEvents();
      this.env = 'prod';

      /* buffer calls to utag object because utag is loaded asynchronously */
      /* and they perform calls to utag once this becomes available */
      window.addEventListener("load", function() {
        function commitUtag() {
          while(utagBuff.length) {
            let utagItem = utagBuff.shift();
            if (utagItem.event === "link") {
              utag.link (utagItem.obj);
            } else {
              utag.view (utagItem.obj);
            }
          }
        }
        if ((typeof utag !== 'undefined') && utag.handler && utag.handler.iflag === 1) {
          commitUtag();
        } else {
          let timerFunction = window.setInterval(function() {
              if ((typeof utag !== 'undefined') && utag.handler && utag.handler.iflag === 1) {
                commitUtag();
                window.clearInterval(timerFunction);
              }
            }, 2000);
        }
      }, false);
    }

    utagLink(obj) {
      if ((typeof utag !== 'undefined') && utag.handler && utag.handler.iflag === 1 && (typeof timerFunction === 'undefined')) {
        utag.link (obj);
      }
      else {
        utagBuff.push ({"event": "link", "obj": obj});
      }
    }

    utagView(obj) {
      if ((typeof utag !== 'undefined') && utag.handler && utag.handler.iflag === 1 && (typeof timerFunction === 'undefined')) {
        utag.view (obj);
      }
      else {
        utagBuff.push ({"event": "view", "obj": obj});
      }
    }

    consoleLog() {
      /* eslint-disable */
      window.log = function () {
        log.history = log.history || [];
        log.history.push(arguments);
        if (this.console && this.env !== 'prod') {
          console.log(Array.prototype.slice.call(arguments));
        }
      };
      /* eslint-enable */
    }

    /**
     * checkGeolocation: call geo api to get the current user location
     */
    checkGeolocation() {
      const geoServiceAPI = $__default["default"]('body').data('geolocationapi'),
        obj = {
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          url: geoServiceAPI
        };
      if (!geoServiceAPI) {
        const dfdNoUrl = new $__default["default"].Deferred();
        dfdNoUrl.reject("No Url");
        return dfdNoUrl.promise();
      }

      const geoServiceCookieData = browserStorageModule__default["default"].getCookie("geoLocationService");
      if (!geoServiceCookieData) {
        return xhrModule__default["default"].initXHR(obj).then((response) => {
          browserStorageModule__default["default"].setCookie("geoLocationService", JSON.stringify(response));
          return response;
        });
      } else {
        const dfd = new $__default["default"].Deferred();
        dfd.resolve(JSON.parse(geoServiceCookieData));
        return dfd.promise();
      }
    }

    /**
    * check if Email exists on Engaging Networks and respond true or false
    */
    checkEmailEngagingNetworks(email) {
      let encodedEmail = encodeURIComponent(email);
      let url = "/bin/tnc/supporterservice.email.html?cons_email=" + encodedEmail;
      return $__default["default"].ajax({
          url: url,
          type: 'post',
          contentType: 'application/json'
      });
    }

    /**
     * Validates the passed email address using the FreshAddress web API.
     *
     * @param {string} email  the email address to validate
     * @return {object}  a json response describing the validity of the email address
     */
    async validateEmailAddress(email) {
      const obj = {
        url: `/bin/tnc/freshaddress?email=${email}`,
        type: 'GET',
        dataType: 'json'
      };

      return await xhrModule__default["default"].initXHR(obj);
    }

    /**
     * Submit the user provided form data to the Engaging Networks web servlet.
     *
     * @param {object} response a FreshAddress response object indicating the submitted
     *                            email address's validity
     * @param {object} form  the submission form element
     */
    handleFreshAddressResponse(response, form) {
      if (response['FINDING'] === 'VS' || (response['FINDING'] === 'V' && response['SUGG_EMAIL'] === '')) {
        // note that email addresses that are syntactically valid,
        // but are not confirmed to exist ('safe to send') are being considered valid emails.
        return true;
      } else {
        form.find('.c-field__input[type=email').addClass('border-error icon-error-forms').focus();
        form.find('.freshaddress-error').css('display', 'block').children().css('display', 'none');
        // valid with a suggestion means we offer the suggestion because it's not 'safe to send'
        // if there is a warning ('W') with a suggestion, there could be one of several problems, but
        // we should still offer the suggested email.
        if ((response['FINDING'] === 'V' || response['FINDING'] === 'W') && response['SUGG_EMAIL'] !== '') {
          form.find('.freshaddress-error .user-message-1').css("display", "inline");
          form.find('.freshaddress-error .error-response').css("display", "none");
        } else if (response['ERROR_RESPONSE']) {
          // if there is an error response then display it instead of the i18n user-message-1
          form.find('.freshaddress-error .error-response').css("display", "inline");
          form.find('.freshaddress-error .user-message-1').css("display", "none");
        }
        // if there is a suggested email then display i18n user-messsage-2 along with the email
        if (response['SUGG_EMAIL'] !== '') {
          form.find('.freshaddress-error .user-message-2').css("display", "inline");
          form.find('.freshaddress-error .sugg-email').text(response['SUGG_EMAIL']);
        }
        return false;
      }
    }

      // Make a URL fragment from a label string. For example, a label
      // "Country Programs" returns country-programs, for use as
      // #country-programs at the end of a URL.
      getFragment(label) {
          var fragment = label.trim().toLowerCase();
          // Convert separator characters to hyphens.
          fragment = fragment.replaceAll(/[ /]/g, "-");
          // Convert some symbols that could appear in a label into a word.
          fragment = fragment.replaceAll(/[&+]/g, "and");
          fragment = fragment.replaceAll("=", "equals");
          fragment = fragment.replaceAll("%", "percent");
          // Remove punctuation and other symbols.
          fragment = fragment.replaceAll(/[.,'"‘’“”?()$*/]/g, "");
          // Collapse consecutive hyphens.
          fragment = fragment.replaceAll(/-+/g, "-");
          return fragment;
      }

    //add and update the query string in URL
    //@param String, String, String
    updateQueryString(key, value, url) {
      if (!url) url = window.location.href;
      var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

      if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
          return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
          hash = url.split('#');
          url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
          if (typeof hash[1] !== 'undefined' && hash[1] !== null)
            url += '#' + hash[1];
          return url;
        }
      }
      else {
        if (typeof value !== 'undefined' && value !== null) {
          var separator = url.indexOf('?') !== -1 ? '&' : '?';
          hash = url.split('#');
          url = hash[0] + separator + key + '=' + value;
          if (typeof hash[1] !== 'undefined' && hash[1] !== null)
            url += '#' + hash[1];
          return url;
        }
        else
          return url;
      }
    }

    //update window URL
    //@param String
    updateURL(url, stateObj = null) {
      return history.pushState(stateObj, null, url);
    }

    replaceHistory(stateObj = null, title = null, url = null) {
      return history.replaceState(stateObj, title, url);

    }

    //get query string values from url
    //@param string, url
    getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[[]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    /**
     * checkWindowWidth: checks the viewport width
     */
    checkWindowWidth() {
      //if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
      this.MqL = 1024; //Mobile experience happens at this break-point

      //check window width (scrollbar included)
      let e = window,
        a = 'inner';

      if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
      }

      if (e[a + 'Width'] >= this.MqL) {
        return true;  // desktop
      } else {
        return false;  // mobile
      }
    }

    /**
    * trackAnalytics: set analytics data to Tealium
    */
    setAnalyticsBase() {
      if (typeof utag_data !== "undefined") {
        let basictags = utag_data;
        return basictags;
      } else {
        return {};
      }
    }

    //Set data to Tealium view
    //@param Object
    setAnalyticsByPage(tagObj, compFlag) {
      if (tagObj) {
        let baseTags = this.setAnalyticsBase();
        if (baseTags && tagObj) {
          var new_object = $__default["default"].extend({}, baseTags, tagObj);
          if (typeof compFlag === 'undefined') {
            this.utagView(new_object);
          } else {
            this.utagLink(new_object);
          }
        }
      }
    }

    //Analytics Event - Donation CTA click
    async trackDonateCTAEvents() {
      let _self = this;

      const obj = {
        url: "/bin/tnc/donationplatformurls",
        type: 'GET',
        dataType: 'json'
      };

      const response = await xhrModule__default["default"].initXHR(obj);
      const linkUrls = response.platformUrls ? JSON.parse(response.platformUrls) : [];

      for (let linkUrl of linkUrls) {
        $__default["default"]("a[href*='" + linkUrl + "']").off("click").on("click", function() {
          let altTxt = $__default["default"].trim($__default["default"](this).text());
          // General CTA
          let componentName = ($__default["default"](this).closest(".base-component") && $__default["default"](this).closest(".base-component").find('section').attr('id')) ? $__default["default"](this).closest(".base-component").find('section').attr('id') : "General CTA";
          // Top Nav Button
          try {
            componentName = (($__default["default"](this).parent().parent().hasClass("cd-header-buttons")) ? "Top Nav Button" : componentName);
          }  catch (err) { /* it's not a top nav button */ }
          // body_homepage_feature
          try {
            componentName = (($__default["default"](this).hasClass("c-home-featured__button")) ? "body_homepage_feature" : componentName);
          } catch (err) { /* it's not a body homepage feature */}
          // body_featured_content_ini
          try {
            componentName = (($__default["default"](this).hasClass("c-featured-content__button")) ? "body_featured_content_ini" : componentName);
          } catch (err) { /* it's not a body featued content ini */}
          // body_article_cta
          try {
            componentName = (($__default["default"](this).hasClass("c-article-cta__button")) ? "body_article_cta" : componentName);
          } catch (err) { /* it's not a body article cta */}

          let _tempObj = {
            'event_name': 'member_cta',
            'event_action': `${altTxt}`,
            'link_name': `${altTxt}`,
            'member_cta_name': `${componentName}`
          };
          _self.setAnalyticsByPage(_tempObj, true);
        });
      }
    }

    //Analytics Event - Click to Call
    trackPhoneCallEvents() {
      let _self = this;
      $__default["default"]("a[href^='tel:']").click(function () {
        let _phoneObj = {
          'event_name': 'phone_click'
        };
        _self.setAnalyticsByPage(_phoneObj, true);
      });
    }

    /**
     * checkBrowserLocale: get the current user browser locale
     */
    checkBrowserLocale() {
      let browserLocaleCookieData = browserStorageModule__default["default"].getCookie("browserLocale");
      if (!browserLocaleCookieData) {
        browserLocaleCookieData = navigator.userLanguage || navigator.language;
        browserStorageModule__default["default"].setCookie("browserLocale", browserLocaleCookieData);
      }
    }

    getWidgetId(id) {
      let widgetId = 0;
      $__default["default"](".g-recaptcha").each(function(idx) {
          let el = $__default["default"](this);
          if ($__default["default"](el).attr("id") === id) {
              widgetId = idx;
              return false;
          }
      });
      return widgetId;
    }

    captchaSubmit(token, form, pageData) {
      console.log('captcha response: ' + token);
      let recaptchaSuccess = (data) => {
          let successStatus = JSON.parse(data).success;
          if (successStatus) {
              form.trigger("submit");
              this.setAnalyticsByPage(pageData, true);
          } else {
              console.log('suspicious user');
          }
      };
      $__default["default"].ajax({
          method: 'GET',
          url: `/bin/tnc/recaptcha?token=${token}`,
          success: recaptchaSuccess,
          error: function() {
              console.log('error');
          },
      });
    }
  }

  var utility_module = new Utility();

  return utility_module;

})($, TNC.BrowserStorage, TNC.XHR);
//# sourceMappingURL=utility.module.js.map

this.TNC = this.TNC || {};
this.TNC.Video = (function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  // -------------------------------------------
  // </video class definition>
  // -------------------------------------------

  class Video {

    constructor(element, options) {
      this.element = element;
      this.options = options;

      this.initialize();
    }

    initialize() {
      let _self = this;
      let defaults = {
        milestones: [50],
        pollingTime: 100
      };

      _self.events = {
        READY: 'video-ready',
        STATE_CHANGE: 'video-state-change',
        ERROR: 'video-error',
        PLAY: 'video-play',
        START: 'video-start',
        MILESTONE: 'video-milestone-', // milestone # gets appended to create the event names
        PAUSE: 'video-pause',
        BUFFER: 'video-buffer',
        CUE: 'video-cue',
        END: 'video-end',
        UNSTARTED: 'video-unstarted'
      };

      _self.$element = $__default["default"](_self.element);
      _self.settings = $__default["default"].extend(true, {}, defaults, _self.options);
      _self.started = false;
      _self.allMilestonesComplete = false;
      _self.progressPoller = null;
      _self.milestones = {};
      _self.videoType = _self.getVideoType();

      _self.settings.milestones.forEach(function (milestone) {
        _self.milestones[milestone.toString()] = false;
      });

      switch (_self.videoType) {
        case 1: // youtube
          if (window.youtubeApiReady) {
            window.youtubeApiReady.then(function () {
              _self.initPlayer();
            }).catch(function (err) {
              console.log(err);
            });
          } else {
            loadYoutubeApi().then(function () {
              _self.initPlayer();
            }); // this didn't run before for some reason
          }
        break;

        case 2: // vimeo
          if (window.vimeoApiReady) {
            window.vimeoApiReady.then(function () {
              _self.initPlayer();
            }).catch(function (err) {
              console.log(err);
            });
          } else {
            loadVimeoApi().then(function () {
              _self.initPlayer();
            }); // this didn't run before for some reason
          }
        break;
          // do nothing
      }
    }

    /*
    fn: getVideoType()
    purpose: gets the type of video so that the correct API can be bound to it
    return: 0 || 1 || 2
      0: unknown video type
      1: youtube video
      2: vimeo video
    */
    getVideoType() {
      let _self = this;

      if (_self.element.src.includes('youtube')) return 1;

      if (_self.element.src.includes('vimeo')) return 2;

      return 0;
    }

    /*
    fn: initPlayer()
    purpose: initializes the correct player API
    */
    initPlayer() {
      let _self = this;

      switch (_self.videoType) {
        case 1: // youtube
          _self.initYoutubePlayer();
        break;

        case 2: // vimeo
          _self.initVimeoPlayer();
        break;
          // do nothing
      }
    }

    /*
    fn: initYoutubePlayer()
    purpose: initializes the youtube iframe API on the video
    */
    initYoutubePlayer() {
      let _self = this;
      _self.player = new window.YT.Player(_self.element, {
        events: {
          onReady: function () {
            _self.onReady();
          },
          onStateChange: function (evt) {
            _self.createAndDispatchEvent(_self.events.STATE_CHANGE);

            switch (evt.data) {
              case window.YT.PlayerState.UNSTARTED:
                console.log("YouTube event: UNSTARTED");
                _self.onUnstarted();
              break;

              case window.YT.PlayerState.PLAYING:
                console.log("YouTube event: PLAYING");
                _self.onPlay();
              break;

              case window.YT.PlayerState.ENDED:
                console.log("YouTube event: ENDED");
                _self.onEnd();
              break;

              case window.YT.PlayerState.PAUSED:
                console.log("YouTube event: PAUSED");
                _self.onPause();
              break;

              case window.YT.PlayerState.BUFFERING:
                console.log("YouTube event: BUFFERING");
                _self.onBuffer();
              break;

              case window.YT.PlayerState.CUED:
                console.log("YouTube event: CUED");
                _self.onCue();
              break;
                // do nothing because we don't know what happened
            }
          }
        }
      });

      console.log("initYoutubePlayer: _self.player = ", _self.player);

      window.players = window.players || {};
      window.players[_self.element.id] = _self.player;
    }

    /*
    fn: initVideoPlayer()
    purpose: intializes the vimeo SDK API on the video
    */
    initVimeoPlayer() {
      let _self = this;

      _self.player = new window.Vimeo.Player(_self.element);

      _self.player.on('loaded', function () {
          console.log("Vimeo event: loaded");
        _self.onReady();
      });

      _self.player.on('error', function () {
          console.log("Vimeo event: error");
        _self.onError();
      });

      _self.player.on('play', function () {
          console.log("Vimeo event: play");
        _self.onPlay();
      });

      _self.player.on('pause', function () {
          console.log("Vimeo event: pause");
        _self.onPause();
      });

      _self.player.on('ended', function () {
          console.log("Vimeo event: ended");
        _self.onEnd();
      });

      _self.player.on('bufferstart', function () {
          console.log("Vimeo event: bufferstart");
        _self.onBuffer();
      });

      // could be used to replace the progressPoller, but ignored
      // since an equivilant isn't available for the youtube player
      // _self.player.on('timeupdate', function () {
      //   console.log('timeupdate');
      // });

      console.log("initVimeoPlayer: _self.player = ", _self.player);
    }

    /*
    fn: onReady()
    purpose: event handler for when a video is considered ready for playback
    */
    onReady() {
      let _self = this;

      _self.createAndDispatchEvent(_self.events.READY);
    }

    /*
    fn: onUnstarted()
    purpose: event handler for when a video fires an "unstarted" event (youtube only)
    */
    onUnstarted() {
      let _self = this;

      // reset everything because the video hasn't been started before
      _self.createAndDispatchEvent(_self.events.UNSTARTED);
      _self.started = false;
      _self.half = false;

      clearInterval(_self.progressPoller);
    }

    /*
    fn: onError()
    purpose: event handler for when the video fires an error event
    */
    onError() {
      let _self = this;

      _self.createAndDispatchEvent(_self.events.ERROR);
    }

    /*
    fn: onPlay()
    purpose: event handler for when a video fires a play event
    */
    onPlay() {
      let _self = this;

      _self.createAndDispatchEvent(_self.events.PLAY);

      if (!_self.started) _self.onStart();

      if (!_self.allMilestonesComplete) {

        _self.progressPoller = setInterval(function () {
          for (let milestone in _self.milestones) {
            _self.getProgress().then(function (progress) {
              if (Number(progress) >= Number(milestone) && !_self.milestones[milestone]) {
                _self.onPassMilestone(milestone);
              }
            }).catch(function (err) {
              console.log(err);
            });
          }
        }, _self.settings.pollingTime);
      }
    }

    /*
    fn: onStart()
    purpose: event handler for when a video fires a start event
    */
    onStart() {
      let _self = this;

      _self.started = true;

      _self.createAndDispatchEvent(_self.events.START);
    }

    /*
    fn: onEnd()
    purpose: event handler for when a video fires an end/ended event
    */
    onEnd() {
      let _self = this;

      _self.started = false;
      _self.half = false;

      _self.createAndDispatchEvent(_self.events.END);

      clearInterval(_self.progressPoller);
    }

    /*
    fn: onPause()
    purpose: event handler for when a video fires a pause event
    */
    onPause() {
      let _self = this;

      _self.createAndDispatchEvent(_self.events.PAUSE);

      clearInterval(_self.progressPoller);
    }

    /*
    fn: onBuffer()
    purpose: event handler for when a video fires a buffer/bufferStart event
    */
    onBuffer() {
      let _self = this;

      _self.createAndDispatchEvent(_self.events.BUFFER);
    }

    /*
    fn: onCue()
    purpose: event handler for when a video firest a cue/cued event (youtube only)
    */
    onCue() {
      let _self = this;

      _self.createAndDispatchEvent(_self.events.CUE);
    }

    /*
    fn: onPassMilestone()
    params: milestone[INT] (represents playback percentage)
    purpose: event handler for when the video progress passes the playback milestone
    */
    onPassMilestone(milestone) {
      let _self = this;

      _self.milestones[milestone] = true;

      _self.createAndDispatchEvent(_self.events.MILESTONE + milestone);

      for (let milestone in _self.milestones) {

        if (Object.prototype.hasOwnProperty.call(_self.milestones, milestone)) {
          if (_self.milestones[milestone]) {
            _self.allMilestonesComplete = true;
          } else {
            _self.allMilestonesComplete = false;
          }
        }
      }

      if (_self.allMilestonesComplete) {
        clearInterval(_self.progressPoller);
      }
    }

    /*
    fn: getCurrentTime()
    purpose: gets the current playback time of the video in seconds
    return: Promise(INT)
    */
    getCurrentTime() {
      let _self = this;
      let result;

      switch (_self.videoType) {
        case 1: // youtube
          result = Promise.resolve(_self.player.getCurrentTime());
        break;

        case 2: // vimeo
          result = _self.player.getCurrentTime();
        break;

        default: // unknown
          result = Promise.reject('unknown video type');
      }

      result.catch(function (err) {
        console.log('Cannot retrieve video current time', err);
      });

      return result;
    }

    /*
    fn: getDuration()
    purpose: get the duration (total time) of the video in seconds
    return: Promise(INT)
    */
    getDuration() {
      let _self = this;
      let result;

      switch (_self.videoType) {
        case 1: // youtube
          result = Promise.resolve(_self.player.getDuration());
        break;

        case 2: // vimeo
          result = _self.player.getDuration();
        break;

        default: // unknown
          result = Promise.reject('unknown video type');
      }

      result.catch(function (err) {
        console.log('Cannot retrieve video duration', err);
      });

      return result;
    }

    /*
    fn: getProgress()
    purpose: get the progress percentage of the video
    return: Promise(FLOAT)
    */
    getProgress() {
      let _self = this;
      let result = _self.getDuration().then(function (duration) {
        return _self.getCurrentTime().then(function (currTime) {
          return (currTime / duration) * 100;
        });
      });

      result.catch(function (err) {
        console.log('Cannot retrieve video progress', err);
      });

      return result;
    }

    /*
    fn: getVideoTitle()
    purpose: get the video's title
    return: Promise(STR)
    */
    getVideoTitle() {
      let _self = this;
      let result;

      switch (_self.videoType) {
        case 1: // youtube
          result = Promise.resolve(_self.player.playerInfo.videoData.title);
        break;

        case 2: // vimeo
          result = _self.player.getVideoTitle();
        break;

        default: // unknown
          result = Promise.reject('unknown video type');
      }

      result.catch(function (err) {
        console.log('Cannot retrieve video title', err);
      });

      return result;
    }

    /*
    fn: getVideoId()
    purpose: get the video's ID
    return: Promise(STR)
    */
    getVideoId() {
      let _self = this;
      let result;

      switch (_self.videoType) {
        case 1: // youtube
          result = Promise.resolve(_self.player.playerInfo.videoData.video_id);
        break;

        case 2: // vimeo
          result = _self.player.getVideoId();
        break;

        default: // unknown
          result = Promise.reject('unknown video type');
      }

      result.catch(function (err) {
        console.log('Cannot retrieve video ID', err);
      });

      return result;
    }

    /*
    fn: getMediaType()
    purpose: determine if the video is embedded directly on the page or within a modal
    return: 'video:lightbox' || 'video:embedded'
    */
    getMediaType() {
      let _self = this;
      let result = _self.$element.closest('.c-modal').length > 0 ? 'video:lightbox' : 'video:embedded';

      return result;
    }

    /*
    fn: createAndDispatchEvent()
    params: evtName[STR]
    purpose: create a new CustomEvent of "evtName", and dispatch it from the video.
             CustomEvent contains video data within the `details` property.
    */
    createAndDispatchEvent(evtName) {
      let _self = this;
      let details = {
        mediaType: _self.getMediaType(),
        playerType: _self.videoType === 1 ? 'youtube' : _self.videoType === 2 ? 'vimeo' : 'unknown'
      };

      _self.getDuration().then(function (duration) {
        details['duration'] = duration;

        return _self.getCurrentTime();
      }).then(function (currTime) {
        details['currentTime'] = currTime;

        return _self.getProgress();
      }).then(function (progress) {
        details['progress'] = Math.round(progress);

        return _self.getVideoTitle();
      }).then(function (title) {
        details['title'] = title;

        return _self.getVideoId();
      }).then(function (videoId) {
        details['videoId'] = videoId;
      }).then(function () {
        let event = new window.CustomEvent(evtName, {
          bubbles: true,
          detail: details
        });

        _self.element.dispatchEvent(event);
      });
    }
  }

  // -------------------------------------------
  // </video class definition>
  // -------------------------------------------

  // -------------------------------------------
  // <jquery video plugin definition>
  // -------------------------------------------

  $__default["default"].fn.video = function (options) {
    return this.each(function (i, elem) {
      return new Video(elem, options);
    });
  };

  // -------------------------------------------
  // </jquery video plugin definition>
  // -------------------------------------------

  // -------------------------------------------
  // <API loaders>
  // -------------------------------------------

  /*
  fn: loadYoutubeApi()
  purpose: load the youtube iframe API asyncronously if it hasn't been previously loaded,
           and create a global promise object to use to determine once the API is ready to use.
  return: Promise(BOOL)
  */
  function loadYoutubeApi () {
    if (!window.youtubeApiReady) {
      window.youtubeApiReady = new Promise(function (resolve, reject) {
        if (window.YT && window.YT.loaded) {
          resolve(true);
        } else {
          // SYS-4993: Should no longer attempt to override window.onYouTubeIframeAPIReady
          // Able Player (introduced by UX-556) also overrides window.onYouTubeIframeAPIReady creating conflict
          // Instead, busy wait here until Youtube is loaded.
          let checkYoutubeLoaded = setInterval(function(){
            if (window.YT && window.YT.loaded) {
              clearInterval(checkYoutubeLoaded);
              resolve(true);
            }
          }, 50);

          // api not loaded
          let scripts = document.querySelectorAll('script');
          let apiSrc = 'https://www.youtube.com/iframe_api';
          let api = document.createElement('script');

          scripts.forEach(function (script) {
            if (script.src === apiSrc) {
              api = script;
              return; // exit the loop
            }
          });

          api.onerror = function () {
            reject('Youtube API failed to load');
          };

          if (!api.src) {
            // load the script
            api.src = apiSrc;
            scripts[0].parentNode.insertBefore(api, scripts[0]);
          }
        }
      });
    }

    return window.youtubeApiReady;
  }

  /*
  fn: loadVimeoApi()
  purpose: load the Vimeo SDK API asyncronously if it hasn't been previously loaded,
           and create a global promise object to use to determine once the API is ready to use.
  return: Promise(BOOL)
  */
  function loadVimeoApi () {
    if (!window.vimeoApiReady) {
      window.vimeoApiReady = new Promise(function (resolve, reject) {
        if (window.Vimeo && window.Vimeo.Player) {
          resolve(true);
        } else {
          // api not loaded
          let scripts = document.querySelectorAll('script');
          let apiSrc = 'https://player.vimeo.com/api/player.js';
          let api = document.createElement('script');

          scripts.forEach(function (script) {
            if (script.src === apiSrc) {
              api = script;
              return; // exit the loop
            }
          });

          api.onload = function () {
            resolve(true);
          };

          api.onerror = function () {
            reject('Vimeo API failed to load');
          };

          if (!api.src) {
            // load the script
            api.src = apiSrc;
            scripts[0].parentNode.insertBefore(api, scripts[0]);
          }
        }
      });
    }

    return window.vimeoApiReady;
  }

  // -------------------------------------------
  // </API loaders>
  // -------------------------------------------

  // load the APIs if they're not already loaded on the page
  loadYoutubeApi();
  loadVimeoApi();

  return Video;

})($);
//# sourceMappingURL=video.module.js.map

this.TNC = this.TNC || {};
this.TNC.Modal = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    /** Modal Module Class. */
    class ModalModule {
        /**
         * constructor
         */
        constructor() {
            this.scrollPos = 0;
            this.toggledArr = [];
            this.initialize();
        }

        /**
         * Initialization function
         */
        initialize() {
            this.modal = $__default["default"]('.c-modal');
            this.body = $__default["default"]('body');
            this.documentClick = false;
            let self = this;

            // TNCE-827 :: fix for device scroll issue
            $__default["default"](document).on('touchstart', function () {
                self.documentClick = true;
            });

            $__default["default"](document).on('touchmove', function () {
                self.documentClick = false;
            });

            $__default["default"]('.triggerModal').on('click touchend', (event) => {
                if (event.type === "click") {
                    self.documentClick = true;
                }
                if (self.documentClick) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.scrollPos = $__default["default"](window).scrollTop();
                    this.showModal(event);
                }
            });

            if ($__default["default"]('.print-modal').length) {
                this.body.on('click touchend', '.print-modal', (event) => {
                    this.printModal(event);
                });
            }

            this.body.on('click touchend', '.close-button', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.hideModal(event);
            });

            this.body.on('touchend', '.c-modal', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            $__default["default"](window).on('click touchstart', (event) => {
                this.windowOnClick(event);
            });

            $__default["default"](document).keydown((event) => {
                if (event.keyCode === 27) {   // Esc key
                    this.hideModal();
                }
            });
        }

        /**
         * Toggle modal element
         */
        showModal(event) {
            let self = this;
            const $eventTarget = $__default["default"](event.currentTarget);
            const componentuniqueid = $eventTarget.data('componentuniqueid');
            const $modalElement = $__default["default"](
                `.c-modal[data-componentuniqueid="${componentuniqueid}"]`);

            // Prevent background scrolling while open.
            $__default["default"]("body").css("overflow", "hidden");
            $__default["default"]("body").addClass('open-modal');

            // Hide all elements that might obscure or interfere with the dialog.
            $__default["default"]("*").filter(function () {
                if (($__default["default"](this).css("position") === "fixed" ||
                    $__default["default"](this).css("position") === "sticky" ||
                    $__default["default"](this).hasClass("header") ||
                    $__default["default"](this).is("#back-to-top"))
                    && this !== $modalElement.get(0)) {

                    self.toggledArr.push(this);
                    $__default["default"](this).hide();
                }
            });

            const $srcElement = $__default["default"](`#hidden-${componentuniqueid}`);
            $modalElement.addClass('is-visible');
            if ($srcElement.length) {
                const iframeId = "video_" + componentuniqueid;
                const $iFrameItem = $__default["default"](`<iframe src="${$srcElement.val()}"
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
                id="` + iframeId + `"></iframe>`);
                const $iframeBox = $modalElement.find('.iFrameContainer');
                $iframeBox.html($iFrameItem);
                $iFrameItem.video();
            }

            let $modalContent = $__default["default"]('.c-modal__content');
            let marginTop = $modalContent.css('margin-top');
            $modalContent.closest('.c-modal').scrollTop(
                ($modalContent[0].offsetTop - parseInt(marginTop)));

            // Set focus on the first focusable element in the modal dialog
            // (currently the Close button) so the dialog is ready for keyboard
            // use immediately. As with other elements, the focus state will
            // only be visible if the dialog is activated using the keyboard.
            $__default["default"](".c-modal__button.close-button").focus();
        }

        hideModal(event) {
            try {
                if (event) {
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                }
            }
            catch (e) {
                console.log("Exception in hideModal: ", e);
            }
            // show all previously hidden elements
            $__default["default"].each(this.toggledArr, function(idx, el) {
                $__default["default"](el).show();
            });
            $__default["default"]('.c-modal').removeClass('is-visible');

            // Remove style that prevents background scrolling while open.
            $__default["default"]("body").css("overflow", "");
            $__default["default"]("body").removeClass('open-modal');

            $__default["default"]('.isGhostInTheShell').css('display','none');
            $__default["default"]('.iFrameContainer').html('');
        }

        /**
         * Print Modal
         */
        printModal(event) {
            event.preventDefault();
            const $eventTarget = $__default["default"](event.currentTarget);
            const $htmlContainer = $eventTarget.parents(
                '.c-modal__content').find('.print-container');
            $__default["default"]('.modal-container').html($htmlContainer.html());
            window.print();
        }

        /**
         * Hide the modal dialog upon clicking outside its content area.
         */
        windowOnClick(event) {
            var modalDialogIsVisible = ($__default["default"](".c-modal.is-visible").length > 0);

            if (modalDialogIsVisible) {
                var target = $__default["default"](event.target);
                var targetIsContent = target.hasClass("c-modal__content");
                var targetParentIsContent = (target.parents(
                    ".c-modal__content").length > 0);

                if (targetIsContent === false &&
                    targetParentIsContent === false) {

                    this.hideModal(event);
                }
            }
        }
    }

    var modal_module = new ModalModule();

    return modal_module;

})($);
//# sourceMappingURL=modal.module.js.map

this.TNC = this.TNC || {};
this.TNC.Common = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    /** Common Module Class */
    class CommonModule {

        /**
         * constructor
         */
        constructor() {
            this.initialize();
            // this.debounceTimeout = null;
        }

        /**
         * Initialization function
         */
        initialize() {
            // Scroll Reveal Animation
            if ($__default["default"]('.scrollAnimation:not(.showScroll)').length && window.screen.width > 1024) {
                $__default["default"](window).on('load scroll resize', () => {
                    // if (this.debounceTimeout) {
                    //     clearTimeout(this.debounceTimeout);
                    // }
                    // this.debounceTimeout = setTimeout(() => {
                    //     this.reveal();
                    // }, 300);
                    this.reveal();
                });
            } else if (window.screen.width <= 1024) {
                $__default["default"]('.scrollAnimation:not(.showScroll)').each((index, element) => {
                    element.classList.add('showScroll');
                });
            }

            // Image Credit button
            if ($__default["default"]('.c-image-credit_toggle').length) {
                this.toggle = $__default["default"](".c-image-credit_toggle.toggle");
                this.toggle.on('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.toggleView(event);
                });
                this.toggle.on("keypress", (event) => {
                    // Generally it is best to use a button element for this
                    // toggle, but if the element used is an anchor, add support
                    // for the Space key to make it behave like a button.
                    if ($__default["default"](event.target).is("a")) {
                        if (event.key === " ") {   // Space key
                            event.preventDefault();
                            event.stopPropagation();
                            this.toggleView(event);
                        }
                    }
                });
            }
        }

        /**
         * Check scroll position and apply scroll animation
         *
         */
        reveal() {
            if ($__default["default"]('.scrollAnimation:not(.showScroll)').length === 0) {
                return;
            }
            let top_of_screen = $__default["default"](window).scrollTop();
            let bottom_of_screen = top_of_screen + window.innerHeight;
            $__default["default"]('.scrollAnimation:not(.showScroll)').each((index, element) => {
                let top_of_el = $__default["default"](element).offset().top - $__default["default"](element).innerHeight();
                let bottom_of_el = top_of_el + $__default["default"](element).outerHeight();
                if ((bottom_of_screen > top_of_el) && (top_of_screen < bottom_of_el)) {
                    element.classList.add('showScroll');
                }
            });
        }

        /**
         * Toggle Image Credit
         */
        toggleView(event) {
            let eventTarget = $__default["default"](event.target);
            const $contentElement = eventTarget.siblings(
                ".c-image-credit_content.toggle-content");
          //  if (!eventTarget.hasClass("toggle-on")) {
               // $contentElement.css("opacity", "0");
               // $contentElement.css("height", "auto");
                let itemHeight = $contentElement.height();
                if( itemHeight > 0 ) {
                    $__default["default"]($contentElement).css('height','0');
                    eventTarget.addClass("toggle-on");
                    eventTarget.addClass("is-visible");
                } else {
                     $__default["default"]($contentElement).clone()
                                .css({'position':'absolute','visibility':'hidden','height':'auto','display':'block'})
                                .addClass('slideClone')
                                .appendTo($contentElement.parent());
                    var newHeight = $__default["default"](".slideClone").height();
                    $__default["default"](".slideClone").remove();
                    $__default["default"]($contentElement).css('height',newHeight + 'px');
                    $__default["default"]($contentElement).css('display','block');
                    eventTarget.removeClass("toggle-on");
                     eventTarget.removeClass("is-visible");
                }
                // $contentElement.css("height", 0);
                // $contentElement.css("opacity", "1");
                // $contentElement.css("height", itemHeight);
                // eventTarget.addClass("toggle-on");
                // eventTarget.addClass("is-visible");
          //  }
            // else {
            //     $contentElement.css("height", "0");
            //     eventTarget.removeClass("toggle-on");
            //     eventTarget.removeClass("is-visible");
            // }
            return false;
        }
    }

    var common_module = new CommonModule();

    return common_module;

})($);
//# sourceMappingURL=common.module.js.map

this.TNC = this.TNC || {};
this.TNC.ReadTime = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // TNC ReadTime module: show estimated read time for written pieces

    class ReadTime {
        constructor() {
        }

        initialize(baseElement) {
            this.baseElement = $__default["default"](baseElement);

            this.readTimeTemplate = this.baseElement.data("read-time-template");
            this.minuteLabelMultiple = this.baseElement.data(
                "minute-label-multiple");
            this.minuteLabelOne = this.baseElement.data("minute-label-one");
        }

        showReadTime() {
            /* Look for read-time elements for this component. If found, show
                a label with the number of minutes of read time for each. */
            if (this.baseElement.length) {
                // Read-time elements are expected to be <span>, because
                // they can sometimes appear in an existing paragraph with
                // other text. The CSS-class "hook" is namespaced with js-
                // which is meant to be used only for JS (no styles).
                let readTimeElements = this.baseElement.find(".js-read-time");
                let _self = this;
                readTimeElements.each(function () {
                    let readTimeElement = $__default["default"](this);
                    if (readTimeElement.length) {
                        // The read-time element is expected to be empty. If it is
                        // not, this read-time code probably already ran somehow,
                        // so skip running it again.
                        if (readTimeElement.text().trim() !== "") {
                            return;
                        }

                        // If there are any items already in the paragraph where
                        // the label will go, a separator will be needed.
                        let needsSeparator = true;
                        let paragraph = readTimeElement.parent();
                        if (paragraph.length) {
                            if (paragraph.text().trim() === "") {
                                needsSeparator = false;
                            }
                        }

                        // Format the label text.
                        let templateString = _self.readTimeTemplate;
                        let minutesString = readTimeElement.data("minutes");
                        let minutes = parseInt(minutesString);
                        if (minutes > 0) {
                            let minuteLabel = _self.minuteLabelMultiple;
                            if (minutes === 1) {
                                minuteLabel = _self.minuteLabelOne;
                            }
                            let readTimeText = "";
                            if (templateString && minuteLabel) {
                                let template = eval("`" + templateString + "`");
                                readTimeText = template;
                            }

                            // Show the label.
                            if (readTimeText.length > 0) {
                                let label = "";
                                if (needsSeparator) {
                                    label += " | " + readTimeText;
                                }
                                else {
                                    // If label will appear alone, capitalize.
                                    label += readTimeText.charAt(
                                        0).toUpperCase() + readTimeText.slice(1);
                                }
                                readTimeElement.text(label);
                                readTimeElement.show();
                            }
                        }
                    }
                });   // end each
            }   // end if
        }

    }

    var readTime_module = new ReadTime();

    return readTime_module;

})($);
//# sourceMappingURL=readTime.module.js.map

this.TNC = this.TNC || {};
this.TNC.SEARCH = (function ($, utl) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);
    var utl__default = /*#__PURE__*/_interopDefaultLegacy(utl);

    /**
     * XHR Class - for making ajax request
     */
    class Search {
        constructor() {
            let _self = this;
            this.ret = {
                filteredJSON: []
            };
            this.returnObject = null;
            this.filteredJSON = null;
            this.prop = null;
            this.sorted = false;

            //available map types
            this.typeMap = {
                "STRING": "[object String]",
                "NUMBER": "[object Number]",
                "BOOLEAN": "[object Boolean]",
                "ARRAY": "[object Array]",
                "OBJECT": "[object Object]",
                "FUNCTION": "[object Function]"
            };

            //default configuration for search and filter
            this.config = {
                property: null, // property used to filter the objects, required.
                value: "", // optional, provide this if we want to search for a particular value
                wrapper: true, // returning the parent object is turned off by default
                checkContains: true, // is required only when we are matching against a value, will match value with in the string
                startsWith: false, // is required only when we are matching against a value, will match value at the beginning of the string
                matchCase: false, // case insensitive matching is on by default
                avoidDuplicates: true, // avoid duplicates is off by default
                filter: false, // filter is off default
                filterProperty: null, // optional, if this isn't provided then the property provided in the config would be used.
                filterValue: "", // optional, provide this if we want to search for a particular value
                sort: false, // sorting is off by default
                sortOrder: "asc", // "desc" is the other value
                sortProperty: null, // optional, if this isn't provided then the property provided in the config would be used.
                sortEmptyString: false,
                comparator: function (a, b) { // optional, default comparator function for sorting
                    var order = (_self.config.sortOrder !== "asc") ? -1 : 1,
                        p = _self.config.sortProperty || _self.config.property[0] || _self.config.property,
                        a = a[p] || a, // eslint-disable-line
                        b = b[p] || b; // eslint-disable-line

                    a = $__default["default"].trim(a); // eslint-disable-line
                    b = $__default["default"].trim(b); // eslint-disable-line
                    a = new Date(a) ? new Date(a) : a; // eslint-disable-line
                    b = new Date(b) ? new Date(b) : b; // eslint-disable-line

                    // Do not consider empty strings while sorting.
                    if (!_self.config.sortEmptyStrings && (a === "" || b === "")) {
                        return 0;
                    }

                    if (new Date(a) && (a.getTime() < b.getTime())) {
                        return -1 * order;
                    }

                    if (new Date(a) && (a.getTime() > b.getTime())) {
                        return 1 * order;
                    }

                    if (a < b) {
                        return -1 * order;
                    }

                    if (a > b) {
                        return 1 * order;
                    }

                    return 0;
                }
            };
        }

        //return the object type
        getObjectType(o) {
            return Object.prototype.toString.call(o);
        }


        //loop through json object and find the matching json object
        //@param: JSON, Object
        filterJSONLoop(json, config) {
            let _self = this;
            let errorMsg = null;
            if ($__default["default"].isEmptyObject(config.property) || !config.property[0]) {
                errorMsg = "config.property is required to filter the JSON object.";
            }
            if (!$__default["default"].isEmptyObject(errorMsg)) {
                return;
            }

            if (json && typeof json === "object") {
                // iterating through each property in the JSON Object
                $__default["default"].each(json, function (key, j) {
                    // checking to see if current "key" is one of the properties
                    // in the property array passed in the config.
                    if ($__default["default"].inArray(key, config.property) !== -1) {
                        let constructReturnObject = function (wrapperValue, plainValue) {
                            var _value = config.wrapper ? wrapperValue : plainValue;

                            if (config.avoidDuplicates) {
                                // avoiding duplicate objects in case of multiple property check.
                                if ($__default["default"].inArray(_value, _self.ret.filteredJSON) === -1) {
                                    _self.ret.filteredJSON.push(_value);
                                }
                            } else {
                                _self.ret.filteredJSON.push(_value);
                            }
                        };

                        if (config.value) {
                            var valueArray = $__default["default"].isArray(config.value) ? config.value : [config.value],
                                internalConfig = {},
                                type = _self.getObjectType(j),
                                innerComparo = function (type, originalValue, valueToCompare) {
                                    if (type === _self.typeMap.STRING) {
                                        var originalValueLowerCase = originalValue.toLowerCase(),
                                            valueToCompareLowerCase = valueToCompare.toLowerCase();

                                        if (!config.matchCase) {
                                            if (originalValueLowerCase === valueToCompareLowerCase ||
                                                (!config.startsWith && config.checkContains && originalValueLowerCase.indexOf(valueToCompareLowerCase) !== -1) ||
                                                (config.startsWith && originalValueLowerCase.indexOf(valueToCompareLowerCase) === 0)) {
                                                constructReturnObject(json, originalValue);
                                            }
                                        } else {
                                            if (originalValue === valueToCompare ||
                                                (!config.startsWith && config.checkContains && originalValue.indexOf(valueToCompare) !== -1) ||
                                                (config.startsWith && originalValue.indexOf(valueToCompare) === 0)) {
                                                constructReturnObject(json, originalValue);
                                            }
                                        }
                                    } else if (type === _self.typeMap.NUMBER) {
                                        if (originalValue === parseInt(valueToCompare) || originalValue === parseFloat(valueToCompare)) {
                                            constructReturnObject(json, originalValue);
                                        }
                                    } else if (type === _self.typeMap.BOOLEAN) {
                                        /*
                                            Note:
                                            Boolean(anyString other than blankString) is true
                                            Boolean(anyNumber, even negative number but other than 0) is true
                                            Boolean(true) is true abd Boolean(false) is false
                                            */
                                        var booleanvalueToCompare = false;
                                        if (_self.getObjectType(valueToCompare) === _self.typeMap.STRING) {
                                            if (valueToCompare.toLowerCase() == "true") { // eslint-disable-line
                                                booleanvalueToCompare = true;
                                            }
                                        }
                                        if (originalValue === booleanvalueToCompare) {
                                            constructReturnObject(json, originalValue);
                                        }
                                    } else if (type === _self.typeMap.ARRAY) {
                                        if (originalValue.length > 0) {
                                            for (let k in originalValue) {
                                                innerComparo(_self.getObjectType(originalValue[k]), originalValue[k], valueToCompare);
                                            }
                                        }
                                    } else if (type === _self.typeMap.OBJECT) {
                                        $__default["default"].extend(internalConfig, config, {
                                            value: valueToCompare
                                        });
                                        _self.filterJSONLoop(originalValue, internalConfig);
                                    }
                                };

                            // forEach iterates over enumerable properties
                            if (valueArray.forEach) {
                                valueArray.forEach(function (element, index) { // eslint-disable-line
                                    innerComparo(type, j, element);
                                });
                            } else {
                                // fall-back for IE8
                                for (let k in valueArray) {
                                    if (Object.prototype.hasOwnProperty.call(
                                            valueArray, k)) {

                                        innerComparo(type, j, valueArray[k]);
                                    }
                                }
                            }
                        } else {
                            constructReturnObject(json, j);
                        }
                    }
                    _self.filterJSONLoop(j, config);
                });
            }
            return _self.ret;
        }

        //filter the json based on given prop and value
        //@param: JSON, Object
        filterByJson(json, config) {
            let filteredItems = [];
            let _filterByProp = config.filterProperty;
            let _filterByValue = config.filterValue;

            $__default["default"].each(json, function (i, n) {
                let isInList = 0;
                if (n[_filterByProp]) {
                    $__default["default"].each(n[_filterByProp], function (ii, nn) { // eslint-disable-line
                        if ($__default["default"].inArray(nn, _filterByValue) !== -1) {
                            isInList++;
                        }
                    });
                }
                if (isInList > 0) {
                    filteredItems.push(n);
                }
            });
            return filteredItems;
        }

        setAnalyticsEvents(type, obj) {
            let aggregationTags = false;
            if (type === "search") {
                if (this.config.emptyVal) {
                    aggregationTags = {
                        'event_name': 'asset_search', //filter_applied
                        'event_action': this.config.emptyVal,
                        'event_category': obj.noOfresults,
                        'search_term': this.config.emptyVal,
                        'num_search_results': obj.noOfresults,
                        'search_type': 'press release'
                    };
                } else {
                    if (this.config.value !== '') {
                        aggregationTags = {
                            'event_name': 'asset_search', //filter_applied
                            'event_action': this.config.value,
                            'event_category': obj.noOfresults,
                            'search_term': this.config.value,
                            'num_search_results': obj.noOfresults,
                            'search_type': 'press release'
                        };
                    }
                }
                if (aggregationTags && aggregationTags.search_term !== 'undefined') {
                    utl__default["default"].setAnalyticsByPage(aggregationTags, true);
                }
            }
        }

        //filter the json based on config
        //@param JOSN, Object
        //return filtered object
        find(json, _config) {
            let _self = this;

            //reset value
            this.ret = {
                filteredJSON: []
            };

            if (!_config) {
                return json;
            }

            // extend the default config with the ones passed in by the user.
            $__default["default"].extend(this.config, _config);

            this.prop = this.config.property;
            // check to see if the property has been passed as a string.
            if (this.getObjectType(this.prop) === this.typeMap.STRING) {
                // remove extra spaces if any.
                this.prop = this.prop.replace(/\s/g, "");
                // convert the input property string into an array.
                // note: even if it is a single property, this will convert it into an array.
                this.config.property = this.prop.split(",");
            }
            this.prop = null;

            // Setting avoidDuplicates to true in case
            // - config.wrapper is set to true and
            // - multiple properties in config.property and
            // - config.avoidDuplicates property is not set by the user.
            if (this.config.wrapper && (this.config.property && this.config.property.length > 1) &&
                _config.avoidDuplicates === undefined) {
                this.config.avoidDuplicates = true;
            }

            this.returnObject = this.filterJSONLoop(json, this.config);

            //search
            if (this.returnObject && this.returnObject.filteredJSON) {
                this.filteredJSON = this.returnObject.filteredJSON.length > 0 ? this.returnObject.filteredJSON : this.returnObject.filteredJSON[0];
                //Analytics
                let _fj_ = this.filteredJSON ? this.filteredJSON.length : 0;
                let __obj = {
                    noOfresults: _fj_
                };
                if (_config.currentTargetAnalytics) {
                    this.setAnalyticsEvents("search", __obj);
                }
            }

            //filter
            if (this.config.filter && this.getObjectType(this.filteredJSON) === this.typeMap.ARRAY) {
                if (this.config.filterProperty && this.getObjectType(this.config.filterValue) === this.typeMap.ARRAY) {
                    if (this.getObjectType(this.filteredJSON[0]) === this.typeMap.OBJECT) {
                        this.filteredJSON = _self.filterByJson(_self.filteredJSON, _self.config);
                        if (_config.currentTargetAnalytics) {
                            this.setAnalyticsEvents("filter", {});
                        }
                    }
                }
            }

            //sorting
            if (this.config.sort && this.getObjectType(this.filteredJSON) === this.typeMap.ARRAY) {
                if (this.config.comparator && this.getObjectType(this.config.comparator) === this.typeMap.FUNCTION) {
                    if (this.getObjectType(this.filteredJSON[0]) === this.typeMap.OBJECT) {
                        this.filteredJSON.sort(this.config.comparator);
                        this.sorted = true;
                    }
                } !this.sorted && this.filteredJSON.sort(this.config.comparator);
            }

            return this.filteredJSON;
        }
    }

    var search_module = new Search();

    return search_module;

})($, TNC.Utility);
//# sourceMappingURL=search.module.js.map

this.TNC = this.TNC || {};
this.TNC.Select = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // TNC Select module: setup for hybrid-native select elements

    class Select {
        constructor() {
        }

        initialize(baseElement) {
            this.baseElement = baseElement;

            this.RESET_AFTER_MS = 1000;
            this.keysCache = [];
            this.keysCacheTimer = null;
        }

        isSafariDesktop() {
            const userAgent = navigator.userAgent;
            const vendor = navigator.vendor;
            let isSafariDesktop = false;
            if (/Safari/i.test(userAgent) && /Apple Computer/.test(vendor) &&
                !/Mobi|Android/i.test(userAgent)) {

                isSafariDesktop = true;
            }
            return isSafariDesktop;
        }

        clearKeysCache() {
            while (this.keysCache.length > 0) {
                this.keysCache.pop();
            }
        }

        resetCacheTimer() {
            // Clear any current timer.
            if (this.keysCacheTimer !== null) {
                clearTimeout(this.keysCacheTimer);
            }
            // Start a new timer.
            this.keysCacheTimer = window.setTimeout(
                this.clearKeysCache.bind(this), this.RESET_AFTER_MS);
        }

        syncCustomItems(nativeSelect, customSelect) {
            var customList = customSelect.find(".c-select__custom-list");
            if (customList) {
                // Clear the existing custom list items.
                var items = customSelect.find(".c-select__custom-item");
                items.remove();

                // Add a new custom list item for each native option.
                var options = nativeSelect.find("option");
                options.each(function () {
                    var option = $__default["default"](this);
                    var code = option.val();
                    var label = option.text();
                    var item = $__default["default"]("<li>")
                        .addClass("c-select__custom-item")
                        .attr("data-value", code)
                        .attr("tabindex", "-1")
                        .text(label);
                    customList.append(item);
                });
            }
        }

        findListItem(startsWithString) {
            // Look for the custom list item that starts with the specified string.
            // If found, set focus on it.
            let isFound = false;
            let start = startsWithString.toLowerCase();
            let customSelect = this.baseElement.find(".c-select__custom-list");

            let items = customSelect.find("li");
            for (const item of items) {
                let lowerCaseItem = $__default["default"](item).text().toLowerCase();
                if (lowerCaseItem.startsWith(start)) {
                    $__default["default"](item).focus();
                    isFound = true;
                    break;
                }
            }
            return isFound;
        }

        setUpHybridSelects() {
            /* Set up "hybrid" selects, which use a native select for
                keyboard and touch interaction, but a custom select for
                mouse interaction. These bring the accessibility and usability
                benefits of native selects to where they are most needed, and
                allows a custom select appearance for people using a mouse.
            */

            // Handle opening and closing a custom select.
            this.baseElement.find(".c-select__select").on("pointerdown", (event) => {
                if (event.pointerType === "touch") {
                    return true;   // touch: use native select, not custom
                }
                if ($__default["default"](event.target).prop("disabled") === true) {
                    return false;  // select is disabled; don't display anything
                }

                $__default["default"](event.target).focus();

                var customSelect = $__default["default"](event.target).closest(
                    ".c-select").find(".c-select__custom").first();
                if (customSelect) {
                    // Close other custom selects that might be open.
                    // (Note: only "sibling" selects are handled for now.)
                    var siblingSelects = customSelect.closest(
                        ".c-select").siblings(".c-select");
                    siblingSelects.each(function () {
                        var select = $__default["default"](this);
                        var customSelect = select.find(
                            ".c-select__custom").first();
                        customSelect.addClass("c-select__custom--hidden");
                    });

                    // Synchronize the list of items before opening each time.
                    if (customSelect.hasClass(
                        "c-select__custom--hidden") === true) {

                        this.syncCustomItems($__default["default"](event.target), customSelect);
                    }

                    // Set the direction to open (up, down) depending on room.
                    var selectBox = customSelect.closest(".c-select");
                    var selectOffset = selectBox.offset().top;
                    var selectList = customSelect.find(".c-select__custom-list");
                    var verticalMidpoint = ($__default["default"](window).height() / 2) +
                        $__default["default"](document).scrollTop();
                    if (selectOffset > verticalMidpoint) {
                        selectList.addClass("c-select__custom-list--upward");
                    }
                    else {
                        selectList.removeClass("c-select__custom-list--upward");
                    }

                    // Open or close the custom menu.
                    //customSelect.toggleClass("c-select__custom--hidden");
                    let hiddenClass = "c-select__custom--hidden";
                    if (customSelect.hasClass(hiddenClass)) {
                        customSelect.removeClass(hiddenClass);
                    }
                    else {
                        customSelect.addClass(hiddenClass);
                    }

                    // If custom menu is open, focus on selected item.
                    var isOpen = (customSelect.hasClass(
                        "c-select__custom--hidden") === false);
                    if (isOpen) {
                        var selectedValue = selectBox.find(
                            ".c-select__select").val();
                        if (selectedValue) {
                            // Focus on the corresponding custom list item.
                            var items = selectList.find(".c-select__custom-item");
                            items.each(function () {
                                var item = $__default["default"](this);
                                if (item.data("value") === selectedValue) {
                                    item.focus();
                                    return false;   // break loop
                                }
                            });
                        }
                        else {
                            // Focus on the first item.
                            items = selectList.find(".c-select__custom-item");
                            items.first().focus();
                        }
                    }

                    // Make it so the native select doesn't show.
                    return false;
                }
            });

            // Handle selecting an item in a custom select.
            // (This starts with the parent list, but works on the
            // list items, which are dynamically re-created.)
            this.baseElement.find(".c-select__custom-list").on("mousedown",
                ".c-select__custom-item", (event) => {

                var item = $__default["default"](event.target);
                if (item) {
                    var code = item.data("value");
                    // Select the item in the native component.
                    var options = item.closest(".c-select").find(
                        "option");
                    options.each(function () {
                        var option = $__default["default"](this);
                        if (option.val() === code) {
                            option.prop("selected", "true");
                            option.trigger("change");
                            return false;   // break loop
                        }
                    });

                    // Close the custom select menu.
                    var customSelect = $__default["default"](event.target).closest(
                        ".c-select").find(".c-select__custom").first();
                    if (customSelect) {
                        customSelect.toggleClass(
                            "c-select__custom--hidden");
                    }

                    // Ensure the select retains focus.
                    $__default["default"](event.target).closest(".c-select").find(
                        ".c-select__select").focus();
                }
            });

            // Handle some keyboard events on custom list items.
            // (This starts with the parent list, but works on the
            // list items, which are dynamically re-created.)
            this.baseElement.find(".c-select__custom-list").on("keydown",
                ".c-select__custom-item", (event) => {

                var key = event.key;

                var numberOfItems = $__default["default"](event.target).closest(
                    ".c-select").find(".c-select__custom-item").length;
                var customSelect = $__default["default"](event.target).closest(
                    ".c-select").find(".c-select__custom").first();
                var selectElement = $__default["default"](event.target).closest(
                    ".c-select").find(".c-select__select").first();

                // Find the currently focused item's index.
                var selectList = $__default["default"](event.target).closest(
                    ".c-select").find(".c-select__custom-list");
                var focusedItemIndex = 0;
                var items = selectList.find(".c-select__custom-item");
                items.each(function (index) {
                    var item = $__default["default"](this);
                    if (item.is(":focus") === true) {
                        focusedItemIndex = index;
                    }
                });

                if (selectElement) {
                    key = event.key;
                    if (key === "Escape") {
                        // Close the custom select.
                        customSelect.addClass("c-select__custom--hidden");
                    }
                    else if (key === "ArrowUp") {
                        if (focusedItemIndex > 0) {
                            var previousItem = $__default["default"](event.target).prev();
                            if (previousItem) {
                                previousItem.focus();
                            }
                        }
                        return false;   // prevent menu scrolling
                    }
                    else if (key === "ArrowDown") {
                        if (focusedItemIndex < (numberOfItems - 1)) {
                            var nextItem = $__default["default"](event.target).next();
                            if (nextItem) {
                                nextItem.focus();
                            }
                        }
                        return false;   // prevent menu scrolling
                    }
                    else if ((key === " " && this.keysCache.length === 0) ||
                        key === "Enter") {
                        // If either:
                        // - Space is pressed but not within shortcut keystrokes,
                        // or
                        // - Enter is pressed,
                        // select the focused item.
                        $__default["default"](event.target).trigger("mousedown");

                        return false;   // prevent scrolling or form submit
                    }
                    else {
                        // Handle one or more keystrokes to act as shortcuts
                        // to a list item, like the native select.

                        // Cache this keypress in order to allow a short
                        // sequence of keystrokes to accumulate.
                        this.keysCache.push(key);

                        // Reset the timer for expiring the keys cache. This
                        // has the effect of continuing to cache keystrokes
                        // until significant time passes between keypresses.
                        this.resetCacheTimer();

                        // Take the contents of the keys cache and try to match
                        // to the start of an item; if item matches, set focus.
                        //
                        // (Note: with a native select on Mac, if user presses
                        // something like a punctuation key or numeral, focus goes
                        // to the first list item; not implemented here yet.)
                        //
                        let cachedKeystrokes = this.keysCache.join("");
                        this.findListItem(cachedKeystrokes);

                        return false;   // prevent scrolling or form submit
                    }
                }
            });

            // Close an open menu when focus goes away from it.
            // (This starts with the parent list, but works on the
            // list items, which are dynamically re-created.)
            this.baseElement.find(".c-select__custom-list").on("blur",
                ".c-select__custom-item", (event) => {

                var customSelect = $__default["default"](event.target).closest(
                    ".c-select").find(".c-select__custom").first();

                if (event.relatedTarget) {
                    var relatedTarget = $__default["default"](event.relatedTarget);
                    if (relatedTarget.hasClass("c-select__custom-item")) {
                        // Focus is on another menu item; keep the menu open.
                        return;
                    }
                    else if (relatedTarget.hasClass("c-select__select")) {
                        // Focus went to the select box. Let the menu's
                        // open-and-close handler elsewhere take over.
                        return;
                    }
                }

                // Check to see if the menu is already closed, which it may
                // have been by selecting an item.
                if (customSelect) {
                    var isClosed = (customSelect.hasClass(
                        "c-select__custom--hidden"));
                    if (isClosed) {
                        return;
                    }

                    // Bug affecting Safari desktop, only under our AEM site:
                    // clicking on the open menu's scrollbar closes the menu
                    // instead of scrolling. Workaround: leave the menu open
                    // on that browser. (Alternate workaround for better usability
                    // could be to just show the native select on Safari desktop.)
                    if (this.isSafariDesktop()) {
                        // Leave menu open.
                        return;
                    }

                    // Otherwise, close the menu.
                    customSelect.addClass("c-select__custom--hidden");
                }
            });
        }
    }

    var select_module = new Select();

    return select_module;

})($);
//# sourceMappingURL=select.module.js.map

this.TNC = this.TNC || {};
this.TNC.MicroModal = (function ($) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    // MicroModal TNC-default configuration:

    class MicroModalConfig {
        constructor() {
            this.defaultConfig = {
                debugMode: true,
                disableFocus: true,
                disableScroll: true,
                onClose: modal => {
                    console.info(`${modal.id} is hidden`);

                    // Show header, which had been temporarily hidden.
                    $__default["default"](".nature .header").css("display", "block");

                    // Show a few other elements (if present).
                    $__default["default"](".c-anchor-links").show();
                    $__default["default"](".c-anchor-links__mobile-button-container").show();
                    $__default["default"](".c-tab-container-links").show();
                    $__default["default"]("#back-to-top").show();
                },
                onShow: modal => {
                    console.info(`${modal.id} is shown`);

                    // Hide header, which overlays the modal dialog.
                    $__default["default"](".nature .header").css("display", "none");

                    // Hide a few other elements (if present) temporarily.
                    $__default["default"](".c-anchor-links").hide();
                    $__default["default"](".c-anchor-links__mobile-button-container").hide();
                    $__default["default"](".c-tab-container-links").hide();
                    $__default["default"]("#back-to-top").hide();

                    // Set initial focus on the close button.
                    // Intended to be used with MicroModal's 'disableFocus'
                    // option, which this replaces.
                    // The idea is that focus must be visible when the dialog
                    // opens, but it shouldn't scroll down if the content is
                    // long, so just set focus on the close button at top.
                    $__default["default"](".micromodal--shown .micromodal__close").focus();
                },
                openClass: "micromodal--shown"
            };
        }

    }

    var MicroModal_module = new MicroModalConfig();

    return MicroModal_module;

})($);
//# sourceMappingURL=MicroModal.module.js.map

