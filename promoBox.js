var promoBox = function (o) {
    'use strict';

    /*global window, document */
    /*jslint browser: true */

    var promo,
        PB = {

            helpers: {

                cookie: {
                    createCookie: function (name, value, days) {
                        var expires = "",
                            date;
                        if (days) {
                            date = new Date();
                            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                            expires = "; expires=" + date.toGMTString();
                        }
                        document.cookie = name + "=" + value + expires + "; path=/;";
                    },

                    readCookie: function (name) {
                        var nameEQ, ca, i, c;
                        nameEQ = name + "=";
                        ca = document.cookie.split(';');
                        for (i = 0; i < ca.length; i += 1) {
                            c = ca[i];
                            while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
                            if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
                        }
                        return null;
                    },

                    eraseCookie: function (name) {
                        PB.helpers.cookie.createCookie(name, "", -1);
                    }
                },

                addEvent: function (target, type, handler) {
                    if (target.addEventListener) {
                        target.addEventListener(type, handler, false);
                    } else {
                        target.attachEvent("on" + type, function (event) {
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
                    if (text) { obj.innerHTML = text; }
                    return obj;
                }
            },

            addStyles: function () {
                var head = document.getElementsByTagName('head')[0],
                    styles = [
                        '#promoContainer { position: fixed; width: 100%; height: 100%; text-align: center; top: 0; left: 0; z-index: 9991; pointer-events: none; }',
                        '#promoOverlay { position: fixed; width: 100%; height: 100%; top: 0; left: 0; zoom: 1; z-index: 9990; background: #333; background: rgba(0, 0, 0, 0.6); pointer-events: all; }',
                        '#promoContent { position: relative; display: inline-block; top: 10%; max-width: 80%; height: auto; z-index: 9992; pointer-events: all; }',
                        '#promoImage { max-width: 100%; height: auto; box-sizing: border-box; display: block; border: 8px solid #fff; border-radius: 4px; }',
                        '#promoClose { position: absolute; top: 0; right: 0; display: block; line-height: 16px; height: 15px; text-align: right; padding: 18px 20px; color: #000; z-index: 9992; font-family: sans-serif; font-size: 17px; opacity: 0.6; transition: 0.1s all; }',
                        '#promoClose:hover { opacity: 1; cursor: pointer; }'
                    ].join('');

                if (promo.styles.styleSheet) {
                    promo.styles.styleSheet.cssText = styles;
                } else {
                    promo.styles.appendChild(document.createTextNode(styles));
                }

                if (head.firstChild) {
                    head.insertBefore(promo.styles, head.firstChild);
                } else {
                    head.appendChild(promo.styles);
                }
            },

            init: function () {
                var currentDateEpoch = Math.round(new Date().getTime() / 1000);

                if (!o.imagePath) { return false; }

                if (o.daysToSeeAgain) {
                    if (PB.helpers.cookie.readCookie('promoBox')) { return false; }
                    PB.helpers.cookie.createCookie('promoBox', '1', o.daysToSeeAgain);
                }

                if (o.startDate) {
                    o.startDate = Math.round(new Date(o.startDate).getTime() / 1000);
                    if (currentDateEpoch < o.startDate) { return false; }
                }

                if (o.endDate) {
                    o.endDate = Math.round(new Date(o.endDate).getTime() / 1000);
                    if (currentDateEpoch > o.endDate) { return false; }
                }

                if (o.showOnHash && o.showOnHash !== document.location.hash) { return false; }

                if (typeof window[o.startCallback] === 'function') { window[o.startCallback](); }

                return true;
            },

            startPromo: function () {
                if (this.init()) {
                    this.buildPromo();
                    this.addListeners();
                    if (!o.disableStyles) { this.addStyles(); }
                    return true;
                }
            },

            buildPromo: function () {
                promo = {
                    overlay: this.helpers.makeElement('div', { id: 'promoOverlay' }),
                    container: this.helpers.makeElement('div', { id: 'promoContainer' }),
                    content: this.helpers.makeElement('div', { id: 'promoContent' }),
                    image: this.helpers.makeElement('img', { id: 'promoImage', src: o.imagePath }),
                    close: this.helpers.makeElement('a', { id: 'promoClose' }, o.closeButtonText || '×'),
                    styles: o.disableStyles ? null : this.helpers.makeElement('style', { id: 'promoStyle', type: 'text/css' })
                };

                if (!o.disableOverlay) { promo.container.appendChild(promo.overlay); }
                promo.content.appendChild(promo.image);
                if (!o.disableCloseButton) { promo.content.appendChild(promo.close); }
                promo.container.appendChild(promo.content);
                document.body.appendChild(promo.container);
            },

            addListeners: function () {
                if (!o.disableCloseButton) { PB.helpers.addEvent(promo.close, 'click', PB.events.close); }
                if (!o.disableOverlayClose) { PB.helpers.addEvent(promo.overlay, 'click', PB.events.close); }
                if (o.link) { PB.helpers.addEvent(promo.image, 'click', PB.events.addLink); promo.image.style.cursor = 'pointer'; }
                if (!o.disableKeyClose) { PB.helpers.addEvent(document, 'keydown', PB.events.keyClose); }
                if (o.autoCloseSeconds) { PB.events.autoClose(); }
            },

            events: {
                close: function () {
                    if (promo.container) { document.body.removeChild(promo.container); }
                    if (promo.styles) { promo.styles.parentNode.removeChild(promo.styles); }
                    if (typeof window[o.closeCallback] === 'function') { window[o.closeCallback](); }
                    if (promo.autoCloseID) { clearTimeout(promo.autoCloseID); }
                    PB = null;
                    return false;
                },

                autoClose: function () {
                    promo.autoCloseID = setTimeout(function () {
                        PB.events.close();
                    }, o.autoCloseSeconds * 1000);
                },

                keyClose: function () {
                    if (PB && event.keyCode === 27) {
                        PB.events.close();
                    }
                },

                addLink: function () {
                    if (o.target === '') {
                        document.location = o.link;
                    } else {
                        window.open(o.link, o.target);
                    }
                    PB.events.close();
                }
            }
        };

    PB.startPromo();

};
