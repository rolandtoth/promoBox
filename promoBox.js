/*!
 * promoBox v1.4 - Simple JavaScript Promo Popup
 * https://github.com/rolandtoth/promoBox
 * last update: 2014.06.20.
 *
 * Licensed under the MIT license.
 * Copyright 2014 Roland Toth
 *
 */

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        'use strict';
        var i = (start || 0),
            j = this.length;

        for (i; i < j; i = i + 1) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}

var promoBox = function (o) {
    'use strict';
    /*global window, document */
    /*jslint browser: true */

    var helpers, PB, autoCloseID, interstitialCloseID,
        currentURL = window.location.href;

    helpers = {

        cookie: {

            createCookie: function (name, value, days) {

                var expires = '', date;

                if (days) {
                    date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = '; expires=' + date.toGMTString();
                }

                document.cookie = name + '=' + value + expires + '; path=/;';
            },

            readCookie: function (name) {

                var nameEQ, ca, i, c;

                nameEQ = name + '=';
                ca = document.cookie.split(';');

                for (i = 0; i < ca.length; i += 1) {
                    c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1, c.length);
                    }
                    if (c.indexOf(nameEQ) === 0) {
                        return c.substring(nameEQ.length, c.length);
                    }
                }

                return null;
            },

            eraseCookie: function (name) {
                this.createCookie(name, '', -1);
            }
        },

        addEvent: function (target, type, handler) {
            if (target.addEventListener) {
                target.addEventListener(type, handler, false);
            } else {
                target.attachEvent('on' + type, function (event) {
                    return handler.call(target, event);
                });
            }
        },

        addClass: function (target, className) {
            target.className += ' ' + className;
        },

        makeElement: function (tag, properties, text) {

            var obj = document.createElement(tag),
                i;

            for (i in properties) {
                if (properties.hasOwnProperty(i)) {
                    if (properties[i]) {
                        obj.setAttribute(i, properties[i]);
                    }
                }
            }

            if (text) {
                obj.innerHTML = text;
            }

            return obj;
        },

        callCallBack: function (fx) {
            if (typeof window[fx] === 'function') {
                window[fx]();
            }
        },

        loadSprite: function (src, callback) {
            var sprite = new Image();
            sprite.onload = callback;
            sprite.src = src;
        },

        findInArray: function (search, where, exactMatch) {

            var i;

            search = (typeof search === 'string') ? [search] : search;

            for (i = 0; i < search.length; i = i + 1) {
                if ((exactMatch && search[i] === where) || (!exactMatch && where.indexOf(search[i]) !== -1)) {
                    return true;
                }
            }

            return false;
        },

        preventDefault: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
    };

    PB = {

        addStyles: function () {

            var head = document.getElementsByTagName('head')[0],
                styles = [
                    '#promoContainer { opacity: 0; position: fixed; width: 100%; height: 100%; text-align: center; top: 0; left: 0; z-index: 9991; pointer-events: none; }',
                    '#promoOverlay { position: fixed; width: 100%; height: 100%; top: 0; left: 0; zoom: 1; z-index: 9990; background: #000; background: rgba(0, 0, 0, 0.6); -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)"; filter: alpha(opacity=60); pointer-events: all; }',
                    '#promoContent { position: relative; display: inline-block; top: 10%; max-width: 80%; height: auto; z-index: 9992; pointer-events: all; }',
                    '#promoImage { max-width: 100%; height: auto; width: auto; box-sizing: border-box; display: block; border: 8px solid #fff; }',
                    '#promoClose { position: absolute; top: 0; right: 0; display: block; line-height: 16px; height: 15px; text-align: right; padding: 24px 28px; color: #000; z-index: 9992; font-family: sans-serif; font-size: 17px; opacity: 0.6; transition: 0.1s all; text-decoration: none; }',
                    '#promoClose:hover { opacity: 1; cursor: pointer; }',
                    '#promoButtons { position: absolute; bottom: 0; width: 100%; padding: 24px 0; }',
                    '#promoButtons a { display: inline-block; text-decoration: none; padding: 5px 16px; background: #fff; text-align: center; margin: 0 6px; color: #000; }'
                ].join('');

            if (o.interstitialDuration) {
                styles += [
                    '#promoOverlay { background: #fff; -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)"; filter: alpha(opacity=100);}',
                    '#interstitialText { z-index: 9998; position: fixed; top: 0; left: 0; width: 100%; pointer-events: all; }',
                    '#interstitialSkipText { text-decoration: underline; color: inherit; }',
                    '#promoImage { border: none; }'
                ].join('');
            }

            if (o.fadeInDuration > 0) {
                styles += [
                    '#promoContainer { -webkit-animation: promoFadeIn ' + o.fadeInDuration + 's ease-in; animation: promoFadeIn ' + o.fadeInDuration + 's ease-in; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards; }',
                    '@-webkit-keyframes promoFadeIn { from {opacity: 0} to {opacity: 1} }',
                    '@keyframes promoFadeIn { from {opacity: 0} to {opacity: 1} }'
                ].join('');
            } else {
                // fix showing lightbox if fadeInDuration is 0
                styles += '#promoContainer { opacity: 1 }';
            }

            if (o.fadeOutDuration > 0) {
                styles += [
                    '#promoContainer.fadeOut { -webkit-animation: promoFadeOut ' + o.fadeOutDuration + 's ease-out; animation: promoFadeOut ' + o.fadeOutDuration + 's ease-out; }',
                    '@-webkit-keyframes promoFadeOut { from {opacity: 1} to {opacity: 0} }',
                    '@keyframes promoFadeOut { from {opacity: 1} to {opacity: 0} }'
                ].join('');
            }

            if (this.promo.styles.styleSheet) {
                this.promo.styles.styleSheet.cssText = styles;
            } else {
                this.promo.styles.appendChild(document.createTextNode(styles));
            }

            if (head.firstChild) {
                head.insertBefore(this.promo.styles, head.firstChild);
            } else {
                head.appendChild(this.promo.styles);
            }
        },

        init: function () {

            var currentDateEpoch = Math.round(new Date().getTime() / 1000);

            o.fadeInDuration = o.fadeInDuration || 0;
            o.fadeOutDuration = o.fadeOutDuration || 0;
            o.loadDelay = o.loadDelay || 0;
            o.target = o.target || '_self';

            if (!o.imagePath) {
                return false;
            }

            if (o.deleteCookieOnHash && helpers.findInArray(o.deleteCookieOnHash, document.location.hash, true)) {
                helpers.cookie.eraseCookie('promoBox');
            } else if (o.daysToSeeAgain) {
                if (helpers.cookie.readCookie('promoBox')) {
                    return false;
                }
                helpers.cookie.createCookie('promoBox', '1', o.daysToSeeAgain);
            }

            if (o.startDate) {
                o.startDate = Math.round(new Date(o.startDate).getTime() / 1000);
                if (currentDateEpoch < o.startDate) {
                    return false;
                }
            }

            if (o.endDate) {
                o.endDate = Math.round(new Date(o.endDate).getTime() / 1000);
                if (currentDateEpoch > o.endDate) {
                    return false;
                }
            }

            if (o.showIfUrlContains && !helpers.findInArray(o.showIfUrlContains, currentURL, false)) {
                return false;
            }

            if (o.hideIfUrlContains && helpers.findInArray(o.hideIfUrlContains, currentURL, false)) {
                return false;
            }

            if (o.showOnHash && !helpers.findInArray(o.showOnHash, document.location.hash, true)) {
                return false;
            }

            if (o.interstitialDuration) {
                o.disableOverlay = false;
                o.disableOverlayClose = true;
                o.disableCloseButton = true;
                o.disableKeyClose = true;
                o.closeButtonText = null;
                o.autoCloseSeconds = o.interstitialDuration;
            }

            return true;
        },

        buildPromo: function () {

            var i = 0;

            this.promo = {
                overlay: helpers.makeElement('div', {id: 'promoOverlay'}),
                container: helpers.makeElement('div', {id: 'promoContainer'}),
                content: helpers.makeElement('div', {id: 'promoContent'}),
                image: helpers.makeElement('img', {id: 'promoImage', src: o.imagePath}),
                close: helpers.makeElement('a', {id: 'promoClose', href: '#'}, o.closeButtonText || '×'),
                buttons: helpers.makeElement('div', {id: 'promoButtons'}),
                styles: o.disableStyles ? null : helpers.makeElement('style', {id: 'promoStyle', type: 'text/css'})
            };

            if (o.interstitialDuration) {

                this.promo.interstitialCounter = '<span id="interstitialCounter">' + o.interstitialDuration + '</span>';

                o.interstitialSkipText = o.interstitialSkipText || 'Skip this ad';
                o.interstitialText = (o.interstitialText || 'or wait %s seconds').replace('%s', this.promo.interstitialCounter);

                this.promo.interstitialText = helpers.makeElement('p', {id: 'interstitialText'}, '&nbsp;' + o.interstitialText);
                this.promo.interstitialSkipText = helpers.makeElement('a', {
                    id: 'interstitialSkipText',
                    href: '#'
                }, o.interstitialSkipText);

                this.promo.interstitialText.insertBefore(this.promo.interstitialSkipText, this.promo.interstitialText.firstChild);
                this.promo.container.appendChild(this.promo.interstitialText);

                helpers.addClass(this.promo.container, 'interstitial');
            }

            this.promo.content.appendChild(this.promo.image);

            if (!o.disableOverlay) {
                this.promo.container.appendChild(this.promo.overlay);
            }

            if (!o.disableCloseButton) {
                this.promo.content.appendChild(this.promo.close);
            }

            if (o.actionButtons && o.actionButtons.length) {

                for (i = 0; i < o.actionButtons.length; i = i + 1) {
                    this.promo.buttons.appendChild(
                        helpers.makeElement('a',
                            {
                                'href': o.actionButtons[i][1] || '#promoClose',
                                'target': o.actionButtons[i][2] || '',
                                'class': o.actionButtons[i][3] || ''
                            },
                            o.actionButtons[i][0])
                    );
                }

                this.promo.content.appendChild(this.promo.buttons);
            }

            if (o.className) {
                helpers.addClass(this.promo.container, o.className);
            }

            this.promo.container.appendChild(this.promo.content);

            document.body.appendChild(this.promo.container);
        },

        addListeners: function () {

            var i,
                promoButtons = document.getElementById('promoButtons'),
                setEventProperties = function (event) {
                    return PB.events.openLink(event, this.href || '#promoClose', this.target || '_self');
                };

            if (!o.disableCloseButton) {
                helpers.addEvent(this.promo.close, 'click', this.events.close);
            }

            if (!o.disableOverlayClose) {
                helpers.addEvent(this.promo.overlay, 'click', this.events.close);
            }

            if (promoButtons && promoButtons.childNodes) {
                for (i = 0; i < promoButtons.childNodes.length; i = i + 1) {
                    helpers.addEvent(promoButtons.childNodes[i], 'click', setEventProperties);
                }
            }

            if (o.link) {
                helpers.addEvent(this.promo.image, 'click', function (event) {
                    PB.events.openLink(event, o.link, o.target);
                });
                this.promo.image.style.cursor = 'pointer';
            }

            if (!o.disableKeyClose) {
                helpers.addEvent(document, 'keydown', this.events.keyClose);
            }

            if (o.interstitialDuration) {
                helpers.addEvent(this.promo.interstitialSkipText, 'click', this.events.close);
                interstitialCloseID = setInterval(function () {
                    var counter = document.getElementById('interstitialCounter');
                    if (counter && counter.innerHTML > 0) {
                        counter.innerHTML = counter.innerHTML - 1;
                    } else {
                        return false;
                    }
                }, 1000);
            }

            if (o.autoCloseSeconds) {
                this.events.autoClose();
            }
        },

        events: {

            destroyPromo: function () {

                if (PB.promo.container) {
                    document.body.removeChild(PB.promo.container);
                }

                if (PB.promo.styles) {
                    PB.promo.styles.parentNode.removeChild(PB.promo.styles);
                }

                PB = null;
            },

            close: function (event) {

                if (event) {
                    helpers.preventDefault(event);
                }

                if (!PB) {
                    return false;
                }

                helpers.callCallBack('promoBoxClose');

                if (PB.promo.container) {

                    if (o.fadeOutDuration > 0) {

                        helpers.addClass(PB.promo.container, 'fadeOut');

                        setTimeout(function () {
                            PB.events.destroyPromo();
                        }, o.fadeOutDuration * 1000);

                    } else {
                        PB.events.destroyPromo();
                    }
                }

                if (autoCloseID) {
                    clearTimeout(autoCloseID);
                }

                if (interstitialCloseID) {
                    clearInterval(interstitialCloseID);
                }
            },

            autoClose: function () {
                autoCloseID = setTimeout(function () {
                    PB.events.close();
                }, o.autoCloseSeconds * 1000);
            },

            keyClose: function (event) {
                if (PB && event.keyCode === 27) {
                    PB.events.close();
                }
            },

            openLink: function (event, link, target) {

                if (event) {
                    helpers.preventDefault(event);
                }

                helpers.callCallBack('promoBoxClick');

                if (link.indexOf('#promoClose') === -1) {
                    window.open(link, target);
                }

                PB.events.close();
            }
        },

        startPromo: function () {
            helpers.callCallBack('promoBoxStart');
            PB.buildPromo();
            PB.addListeners();

            if (!o.disableStyles) {
                PB.addStyles();
            }
        }
    };

    if (PB.init()) {
        helpers.loadSprite(o.imagePath, function () {
            setTimeout(function () {
                PB.startPromo();
            }, o.loadDelay * 1000);
        });
    }
};