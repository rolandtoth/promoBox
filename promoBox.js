/*!
 * promoBox 1.0 - Simple JavaScript Promo Popup
 * https://github.com/rolandtoth/promoBox
 *
 * Licensed under the MIT license.
 * Copyright 2014 Roland Toth
 *
 */

var promoBox = function (o) {
    'use strict';
    /*global window, document */
    /*jslint browser: true */

    var helpers, PB;

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

        makeElement: function (tag, properties, text) {

            var obj = document.createElement(tag),
                i;

            for (i in properties) {
                if (properties.hasOwnProperty(i)) {
                    obj.setAttribute(i, properties[i]);
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
        }
    };

    PB = {

        addStyles: function () {

            var head = document.getElementsByTagName('head')[0],
                styles = [
                    '#promoContainer { position: fixed; width: 100%; height: 100%; text-align: center; top: 0; left: 0; z-index: 9991; pointer-events: none; }',
                    '#promoOverlay { position: fixed; width: 100%; height: 100%; top: 0; left: 0; zoom: 1; z-index: 9990; background: #333; background: rgba(0, 0, 0, 0.6); pointer-events: all; }',
                    '#promoContent { position: relative; display: inline-block; top: 10%; max-width: 80%; height: auto; z-index: 9992; pointer-events: all; }',
                    '#promoImage { max-width: 100%; height: auto; box-sizing: border-box; display: block; border: 8px solid #fff; }',
                    '#promoClose { position: absolute; top: 0; right: 0; display: block; line-height: 16px; height: 15px; text-align: right; padding: 18px 20px; color: #000; z-index: 9992; font-family: sans-serif; font-size: 17px; opacity: 0.6; transition: 0.1s all; }',
                    '#promoClose:hover { opacity: 1; cursor: pointer; }'
                ].join('');

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

            if (!o.imagePath) {
                return false;
            }

            if (o.deleteCookieOnHash && o.deleteCookieOnHash === document.location.hash) {
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

            if (o.showOnHash && o.showOnHash !== document.location.hash) {
                return false;
            }

            return true;
        },

        buildPromo: function () {

            this.promo = {
                overlay: helpers.makeElement('div', {id: 'promoOverlay'}),
                container: helpers.makeElement('div', {id: 'promoContainer'}),
                content: helpers.makeElement('div', {id: 'promoContent'}),
                image: helpers.makeElement('img', {id: 'promoImage', src: o.imagePath}),
                close: helpers.makeElement('a', {id: 'promoClose'}, o.closeButtonText || '×'),
                styles: o.disableStyles ? null : helpers.makeElement('style', {id: 'promoStyle', type: 'text/css'})
            };

            this.promo.content.appendChild(this.promo.image);

            if (!o.disableOverlay) {
                this.promo.container.appendChild(this.promo.overlay);
            }

            if (!o.disableCloseButton) {
                this.promo.content.appendChild(this.promo.close);
            }

            this.promo.container.appendChild(this.promo.content);

            document.body.appendChild(this.promo.container);
        },

        addListeners: function () {

            if (!o.disableCloseButton) {
                helpers.addEvent(this.promo.close, 'click', this.events.close);
            }

            if (!o.disableOverlayClose) {
                helpers.addEvent(this.promo.overlay, 'click', this.events.close);
            }

            if (o.link) {
                helpers.addEvent(this.promo.image, 'click', this.events.addLink);
                this.promo.image.style.cursor = 'pointer';
            }

            if (!o.disableKeyClose) {
                helpers.addEvent(document, 'keydown', this.events.keyClose);
            }

            if (o.autoCloseSeconds) {
                this.events.autoClose();
            }
        },

        events: {

            close: function () {
                if (PB.promo.container) {
                    document.body.removeChild(PB.promo.container);
                }
                if (PB.promo.styles) {
                    PB.promo.styles.parentNode.removeChild(PB.promo.styles);
                }
                helpers.callCallBack('promoBoxClose');
                if (PB.events.autoCloseID) {
                    clearTimeout(PB.events.autoCloseID);
                }
                PB = null;
            },

            autoClose: function () {
                this.autoCloseID = setTimeout(function () {
                    PB.events.close();
                }, o.autoCloseSeconds * 1000);
            },

            keyClose: function () {
                if (PB && event.keyCode === 27) {
                    PB.events.close();
                }
            },

            addLink: function () {
                helpers.callCallBack('promoBoxClick');
                if (o.target === '') {
                    document.location = o.link;
                } else {
                    window.open(o.link, o.target);
                }
                PB.events.close();
            }
        }
    };

    if (PB.init()) {
        helpers.callCallBack('promoBoxStart');
        PB.buildPromo();
        PB.addListeners();
        if (!o.disableStyles) {
            PB.addStyles();
        }
    }
};