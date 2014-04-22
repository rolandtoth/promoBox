var promoBox = function (o) {
    'use strict';
    /*global window, document */
    /*jslint browser: true */
    var PB = {
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
                    this.createCookie(name, "", -1);
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
            if (PB.promo.styles.styleSheet) {
                PB.promo.styles.styleSheet.cssText = styles;
            } else {
                PB.promo.styles.appendChild(document.createTextNode(styles));
            }
            if (head.firstChild) {
                head.insertBefore(PB.promo.styles, head.firstChild);
            } else {
                head.appendChild(PB.promo.styles);
            }
        },
        init: function () {
            var currentDateEpoch = Math.round(new Date().getTime() / 1000);
            if (!o.imagePath) { return false; }
            if (o.daysToSeeAgain) {
                if (this.helpers.cookie.readCookie('promoBox')) { return false; }
                this.helpers.cookie.createCookie('promoBox', '1', o.daysToSeeAgain);
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
            this.promo = {
                overlay: PB.helpers.makeElement('div', { id: 'promoOverlay' }),
                container: PB.helpers.makeElement('div', { id: 'promoContainer' }),
                content: PB.helpers.makeElement('div', { id: 'promoContent' }),
                image: PB.helpers.makeElement('img', { id: 'promoImage', src: o.imagePath }),
                close: PB.helpers.makeElement('a', { id: 'promoClose' }, o.closeButtonText || '×'),
                styles: o.disableStyles ? null : PB.helpers.makeElement('style', { id: 'promoStyle', type: 'text/css' })
            };
            if (!o.disableOverlay) { PB.promo.container.appendChild(PB.promo.overlay); }
            PB.promo.content.appendChild(PB.promo.image);
            if (!o.disableCloseButton) { PB.promo.content.appendChild(PB.promo.close); }
            PB.promo.container.appendChild(PB.promo.content);
            document.body.appendChild(PB.promo.container);
        },
        addListeners: function () {
            if (!o.disableCloseButton) { this.helpers.addEvent(PB.promo.close, 'click', this.events.close); }
            if (!o.disableOverlayClose) { this.helpers.addEvent(PB.promo.overlay, 'click', this.events.close); }
            if (o.link) { this.helpers.addEvent(PB.promo.image, 'click', this.events.addLink); PB.promo.image.style.cursor = 'pointer'; }
            if (!o.disableKeyClose) { this.helpers.addEvent(document, 'keydown', this.events.keyClose); }
            if (o.autoCloseSeconds) { this.events.autoClose(); }
        },
        events: {
            close: function () {
                if (PB.promo.container) { document.body.removeChild(PB.promo.container); }
                if (PB.promo.styles) { PB.promo.styles.parentNode.removeChild(PB.promo.styles); }
                if (typeof window[o.closeCallback] === 'function') { window[o.closeCallback](); }
                if (PB.promo.autoCloseID) { clearTimeout(PB.promo.autoCloseID); }
                PB = null;
                return false;
            },
            autoClose: function () {
                PB.promo.autoCloseID = setTimeout(function () {
                    PB.events.close();
                }, o.autoCloseSeconds * 1000);
            },
            keyClose: function () {
                if (PB && event.keyCode === 27) { PB.events.close(); }
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
