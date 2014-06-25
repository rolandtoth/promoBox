/*!
 * promoBox v1.7 - Simple JavaScript Promo Popup
 * https://github.com/rolandtoth/promoBox
 * last update: 2014.06.25.
 *
 * Licensed under the MIT license.
 * Copyright 2014 Roland Toth (tpr)
 *
 */

/*global window, document */
/*jslint browser: true */

var PBlib = (function () {
    'use strict';

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
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

    return {

        cookie: {

            createCookie: function (name, value, days) {

                var expires = '', date;

                if (days && days !== 'session') {
                    date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = '; expires=' + date.toGMTString();
                }

                document.cookie = name + '=' + value + expires + '; path=/;';
            },

            readCookie: function (name) {

                var i, c,
                    nameEQ = name + '=',
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

            var obj = document.createElement(tag), i;

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

        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },

        findInArray: function (search, where) {

            var i;

            if (!search) {
                return false;
            }

            if (PBlib.isArray(search) && search.length === 0) {
                return false;
            }

            search = (typeof search === 'string') ? [search] : search;

            for (i = 0; i < search.length; i = i + 1) {
                if (where.indexOf(search[i]) !== -1) {
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
        },

        checkRandomSeed: function (rate) {
            var seed = Math.floor(Math.random() * (1 / rate));
            return seed === 0;
        }
    };
}());

var promoBox = function (o) {
    'use strict';

    var PB, autoCloseID, interstitialCloseID,
        head = document.getElementsByTagName('head')[0],
        body = document.body,
        currentUrl = window.location.href;

    PB = {

        addStyles: function () {

            if (o.disableStyles) {
                return false;
            }

            var styles = [
                '#promoContainer { opacity: 0; position: fixed; width: 100%; height: 100%; text-align: center; top: 0; left: 0; z-index: 9991; pointer-events: none; }',
                '#promoOverlay { position: fixed; width: 100%; height: 100%; top: 0; left: 0; zoom: 1; z-index: 9990; background: #000; background: rgba(0, 0, 0, 0.6); -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)"; filter: alpha(opacity=60); pointer-events: all; }',
                '#promoContent { position: relative; display: inline-block; top: 10%; max-width: 80%; height: auto; z-index: 9992; pointer-events: all; }',
                '#promoImage { height: auto; width: auto; max-width: 100%; max-height: 75%; box-sizing: border-box; display: block; border: 8px solid #fff; }',
                '#promoClose { position: absolute; top: 0; right: 0; display: block; line-height: 16px; text-align: right; padding: 24px 28px; color: #000; z-index: 9992; font-family: sans-serif; font-size: 17px; opacity: 0.6; transition: 0.1s all; text-decoration: none; }',
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

            if (!o.showScrollbar) {
                styles += 'html { overflow: hidden !important; }';
                if (window.innerHeight < body.scrollHeight) {
                    styles += 'body { width: ' + body.offsetWidth + 'px; }';
                }
            }

            PB.styles = PBlib.makeElement('style', {id: 'promoStyle', type: 'text/css'});

            if (PB.styles.styleSheet) {
                PB.styles.styleSheet.cssText = styles;
            } else {
                PB.styles.appendChild(document.createTextNode(styles));
            }

            if (head.firstChild) {
                head.insertBefore(PB.styles, head.firstChild);
            } else {
                head.appendChild(PB.styles);
            }
        },

        init: function () {

            var forceOnUrl, deleteCookie, randomWeight, showOnUrl, hideOnUrl,
                currentDateEpoch = Math.round(new Date().getTime() / 1000);

            if (!o.imagePath) {
                return false;
            }

            o.actionButtons = o.actionButtons || null;
            o.autoCloseSeconds = o.autoCloseSeconds || null;
            o.className = o.className || null;
            o.closeButtonText = o.closeButtonText || null;
            o.deleteCookieOnUrl = o.deleteCookieOnUrl || null;
            o.disableCloseButton = o.disableCloseButton || null;
            o.disableCloseOnClick = o.disableCloseOnClick || false;
            o.disableOverlay = o.disableOverlay || null;
            o.disableOverlayClose = o.disableOverlayClose || null;
            o.disableStyles = o.disableStyles || null;
            o.endDate = o.endDate || null;
            o.fadeInDuration = o.fadeInDuration || 0;
            o.fadeOutDuration = o.fadeOutDuration || 0;
            o.forceOnUrl = o.forceOnUrl || null;
            o.frequency = o.frequency || null;
            o.hideOnUrl = o.hideOnUrl || null;
            o.interstitialDuration = o.interstitialDuration || null;
            o.interstitialSkipText = o.interstitialSkipText || 'Skip this ad';
            o.interstitialText = o.interstitialText || 'or wait %s secs';
            o.link = o.link || null;
            o.loadDelay = o.loadDelay || null;
            o.randomWeight = o.randomWeight || 1;
            o.showOnUrl = o.showOnUrl || null;
            o.showScrollbar = o.showScrollbar || false;
            o.startDate = o.startDate || null;
            o.target = o.target || '_self';

            randomWeight = o.randomWeight && !PBlib.checkRandomSeed(o.randomWeight);
            forceOnUrl = !!o.forceOnUrl && PBlib.findInArray(o.forceOnUrl, currentUrl);
            deleteCookie = !!o.deleteCookieOnUrl && PBlib.findInArray(o.deleteCookieOnUrl, currentUrl);

            showOnUrl = (function (obj) {
                if (!obj || (PBlib.isArray(obj) && !obj.length)) {
                    return false;
                }
                if (!!obj && !PBlib.findInArray(obj, currentUrl)) {
                    return true;
                }
            }(o.showOnUrl));

            hideOnUrl = !!o.hideOnUrl && PBlib.findInArray(o.hideOnUrl, currentUrl);

            if (!forceOnUrl) {

                if (randomWeight) {
                    return false;
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

                if (deleteCookie) {
                    PBlib.cookie.eraseCookie('promoBox');
                }

                if (o.frequency) {
                    if (PBlib.cookie.readCookie('promoBox')) {
                        return false;
                    }
                    if (!deleteCookie) {
                        PBlib.cookie.createCookie('promoBox', '1', o.frequency);
                    }
                }

                if (showOnUrl) {
                    return false;
                }

                if (hideOnUrl) {
                    return false;
                }
            }

            if (deleteCookie) {
                PBlib.cookie.eraseCookie('promoBox');
            }

            if (o.interstitialDuration) {
                o.disableOverlay = false;
                o.disableOverlayClose = true;
                o.disableCloseButton = true;
                o.closeButtonText = null;
                o.autoCloseSeconds = o.interstitialDuration;
            }

            return true;
        },

        buildPromo: function () {

            var i = 0;

            this.promo = {
                overlay: PBlib.makeElement('div', {id: 'promoOverlay'}),
                container: PBlib.makeElement('div', {id: 'promoContainer'}),
                content: PBlib.makeElement('div', {id: 'promoContent'}),
                image: PBlib.makeElement('img', {id: 'promoImage', src: o.imagePath}),
                close: PBlib.makeElement('a', {id: 'promoClose', href: '#'}, o.closeButtonText || '×'),
                buttons: PBlib.makeElement('div', {id: 'promoButtons'})
            };

            if (o.interstitialDuration) {

                this.promo.interstitialCounter = '<span id="interstitialCounter">' + o.interstitialDuration + '</span>';

                o.interstitialText = o.interstitialText.replace('%s', this.promo.interstitialCounter);

                this.promo.interstitialText = PBlib.makeElement('p', {id: 'interstitialText'}, '&nbsp;' + o.interstitialText);
                this.promo.interstitialSkipText = PBlib.makeElement('a', {
                    id: 'interstitialSkipText',
                    href: '#'
                }, o.interstitialSkipText);

                this.promo.interstitialText.insertBefore(this.promo.interstitialSkipText, this.promo.interstitialText.firstChild);
                this.promo.container.appendChild(this.promo.interstitialText);

                PBlib.addClass(this.promo.container, 'interstitial');
            }

            if (o.link) {
                this.promo.link = PBlib.makeElement('a', {id: 'promoLink', href: o.link, target: o.target});
                this.promo.content.appendChild(this.promo.link);
                this.promo.link.appendChild(this.promo.image);
            } else {
                this.promo.content.appendChild(this.promo.image);
            }

            if (!o.disableOverlay) {
                this.promo.container.appendChild(this.promo.overlay);
            }

            if (!o.disableCloseButton) {
                this.promo.content.appendChild(this.promo.close);
            }

            if (o.actionButtons && o.actionButtons.length) {

                for (i = 0; i < o.actionButtons.length; i = i + 1) {
                    this.promo.buttons.appendChild(
                        PBlib.makeElement('a',
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
                PBlib.addClass(this.promo.container, o.className);
            }

            this.promo.container.appendChild(this.promo.content);

            body.appendChild(this.promo.container);
        },

        addListeners: function () {

            var i,
                promoButtons = document.getElementById('promoButtons'),
                setEventProperties = function (event) {
                    return PB.events.openLink(event, this.href || '#promoClose', this.target || '_self');
                };

            if (!o.disableCloseButton) {
                PBlib.addEvent(this.promo.close, 'click', this.events.close);
            }

            if (!o.disableOverlayClose) {
                PBlib.addEvent(this.promo.overlay, 'click', this.events.close);
            }

            if (promoButtons && promoButtons.childNodes) {
                for (i = 0; i < promoButtons.childNodes.length; i = i + 1) {
                    PBlib.addEvent(promoButtons.childNodes[i], 'click', setEventProperties);
                }
            }

            if (o.link) {
                PBlib.addEvent(this.promo.link, 'click', function (event) {
                    PB.events.openLink(event, o.link, o.target);
                });
            }

            if (!o.disableKeyClose) {
                PBlib.addEvent(document, 'keydown', this.events.keyClose);
            }

            if (o.interstitialDuration) {
                PBlib.addEvent(this.promo.interstitialSkipText, 'click', this.events.close);
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
                    body.removeChild(PB.promo.container);
                }

                if (PB.styles) {
                    PB.styles.parentNode.removeChild(PB.styles);
                }

                PB = null;
            },

            close: function (event) {

                if (event) {
                    PBlib.preventDefault(event);
                }

                if (!PB) {
                    return false;
                }

                PBlib.callCallBack('promoBoxClose');

                if (PB.promo.container) {

                    if (o.fadeOutDuration > 0) {

                        PBlib.addClass(PB.promo.container, 'fadeOut');

                        setTimeout(function () {
                            if (PB) {
                                PB.events.destroyPromo();
                            }
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
                    PBlib.preventDefault(event);
                }

                PBlib.callCallBack('promoBoxClick');

                if (link.indexOf('#promoClose') === -1) {
                    window.open(link, target);
                }

                if (!o.disableCloseOnClick || link.indexOf('#promoClose') !== -1) {
                    PB.events.close();
                }
            }
        },

        startPromo: function () {
            PBlib.callCallBack('promoBoxStart');
            PB.addStyles();
            PB.buildPromo();
            PB.addListeners();
        }
    };

    if (PB.init()) {
        PBlib.loadSprite(o.imagePath, function () {
            window.promoBoxInstanceID = clearTimeout(window.promoBoxInstanceID) || setTimeout(function () {
                PB.startPromo();
            }, o.loadDelay * 1000);
        });
    }
};