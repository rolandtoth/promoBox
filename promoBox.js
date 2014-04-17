function promoBox(options) {
    'use strict';

    /*global window, document */
    /*jslint browser: true */

    var startDate,
        endDate,
        cookie,
        promoFx,
        styles,
        head,
        promo,
        autoCloseSeconds,
        currentDateEpoch = Math.round(new Date().getTime() / 1000);

    if (!options.imagePath) { return false; }

    if (options.startDate) {
        startDate = Math.round(new Date(options.startDate).getTime() / 1000);
        if (currentDateEpoch < startDate) { return false; }
    }

    if (options.endDate) {
        endDate = Math.round(new Date(options.endDate).getTime() / 1000);
        if (currentDateEpoch > endDate) { return false; }
    }

    if (options.showOnHash && options.showOnHash !== document.location.hash) { return false; }

    if (typeof window[options.startCallback] === 'function') { window[options.startCallback](); }

    cookie = {
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
            cookie.createCookie(name, "", -1);
        }
    };

    if (options.daysToSeeAgain) {
        if (cookie.readCookie('promoBox')) { return false; }
        cookie.createCookie('promoBox', '1', options.daysToSeeAgain);
    }

    promoFx = {
        makeElement: function (tag, attr, text, value) {
            var obj = document.createElement(tag);
            obj.setAttribute(attr, value);
            if (text) { obj.innerHTML = text; }

            return obj;
        },
        addStyle: function () {
            var css = document.createElement('style');
            css.type = 'text/css';
            css.id = 'promoStyle';

            styles = [
                '#promoContainer { position: fixed; width: 100%; height: 100%; text-align: center; top: 0; left: 0; z-index: 9991; pointer-events: none; }',
                '#promoOverlay { position: fixed; width: 100%; height: 100%; top: 0; left: 0; zoom: 1; z-index: 9990; background: rgba(0, 0, 0, 0.6); pointer-events: all; }',
                '#promoContent { position: relative; display: inline-block; max-width: 80%; top: 16%; max-height: 80%; border-radius: 4px; border: 8px solid #fff; box-shadow: 0 0 2px #b4b4b4; z-index: 9992; pointer-events: all; }',
                '#promoContent img { max-width: 100%; height: auto; display: block; }',
                '#promoClose { position: absolute; top: 0; right: 0; display: block; line-height: 16px; height: 15px; text-align: right; padding: 13px 18px; color: #000; z-index: 9992; font-family: sans-serif; font-size: 17px; opacity: 0.6; transition: 0.12s all; }',
                '#promoClose:hover { opacity: 1; cursor: pointer; }'
            ].join('');

            if (css.styleSheet) {
                css.styleSheet.cssText = styles;
            } else {
                css.appendChild(document.createTextNode(styles));
            }

            head = document.getElementsByTagName("head")[0];
            if (head.firstChild) {
                head.insertBefore(css, head.firstChild);
            } else {
                head.appendChild(css);
            }
        },
        addLink: function () {
            promo.image.style.cursor = 'pointer';
            promo.image.onclick = function () {
                if (options.target === '') {
                    document.location = options.link;
                } else {
                    window.open(options.link, options.target);
                }
                promoFx.closeEvent();
            };
        },
        startPromo: function () {

            if (!options.disableOverlay) { promo.container.appendChild(promo.overlay); }

            promo.content.appendChild(promo.image);
            if (!options.disableCloseButton) { promo.content.appendChild(promo.close); }

            promo.container.appendChild(promo.content);

            document.body.appendChild(promo.container);

            if (options.link) { promoFx.addLink(); }
            if (!options.disableOverlayClose) { promo.overlay.onclick = promoFx.closeEvent; }
            if (!options.disableCloseButton) { promo.close.onclick = promoFx.closeEvent; }

            if (!options.disableStyles) { promoFx.addStyle(); }
        },
        closeEvent: function (seconds) {
            if (promo.overlay && promo.overlay.parentNode) { promo.overlay.parentNode.removeChild(promo.overlay); }
            if (promo.container && promo.container.parentNode !== undefined) { promo.container.parentNode.removeChild(promo.container); }
            if (document.getElementById('promoStyle')) { document.getElementById('promoStyle').parentNode.removeChild(document.getElementById('promoStyle')); }
            if (typeof window[options.closeCallback] === 'function') { window[options.closeCallback](); }
            if (seconds) { clearTimeout(autoCloseSeconds); }
            return false;
        }
    };

    promo = {
        overlay: promoFx.makeElement('div', 'id', '', 'promoOverlay'),
        container: promoFx.makeElement('div', 'id', '', 'promoContainer'),
        content: promoFx.makeElement('div', 'id', '', 'promoContent'),
        image: promoFx.makeElement('img', 'src', '', options.imagePath),
        close: promoFx.makeElement('a', 'id', options.closeButtonText || '×', 'promoClose')
    };

    promoFx.startPromo();

    if (options.autoCloseSeconds) {
        autoCloseSeconds = setTimeout(function () {
            promoFx.closeEvent(options.autoCloseSeconds);
        }, options.autoCloseSeconds * 1000);
    }

}