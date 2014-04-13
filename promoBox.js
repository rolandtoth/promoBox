function promoBox(options) {

    if (!options.imagePath) return false;

    var currentDateEpoch = Math.round(new Date().getTime() / 1000);

    if (options.startDate) {
        var startDate = Math.round(new Date(options.startDate).getTime() / 1000);
        if (currentDateEpoch < startDate) return false;
    }

    if (options.endDate) {
        var endDate = Math.round(new Date(options.endDate).getTime() / 1000);
        if (currentDateEpoch > endDate) return false;
    }

    if (options.showOnHash && options.showOnHash != document.location.hash) return false;

    if (typeof window[options.startCallback] === 'function') window[options.startCallback]();

    var cookie = {
        createCookie: function (name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            }
            document.cookie = name + "=" + value + expires + "; path=/;";
        },
        readCookie: function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
//        eraseCookie: function (name) {
//            cookie.createCookie(name, "", -1);
//        }
    }

    if (options.daysToSeeAgain) {
        if (cookie.readCookie('promoBox')) return false;
        cookie.createCookie('promoBox', '1', options.daysToSeeAgain);
    }

    var promoFx = {
        makeElement: function (tag, attr, text, value) {
            var obj = document.createElement(tag);
            obj.setAttribute(attr, value);
            if (text) obj.innerHTML = text;
            return obj;
        },
        addStyle: function () {
            var css = document.createElement('style');
            css.type = 'text/css';

            var styles = '\
                #promoOverlay { position: fixed; width: 100%; height: 100%; top: 0; left: 0; zoom: 1; z-index: 990; background: rgba(0, 0, 0, 0.6); }\
                #promoContainer { position: fixed; width: 100%; height: 100%; text-align: center; top: 0; left: 0; }\
                #promoContent { position: relative; display: inline-block; z-index: 991; max-width: 80%; top: 16%; max-height: 80%; overflow: auto; border-radius: 4px; border: 8px solid #fff; box-shadow: 0 0 2px #b4b4b4; }\
                #promoContent img { max-width: 100%; height: auto; display: block; }\
                #promoClose { position: absolute; top: 0; right: 0; display: block; line-height: 16px; height: 15px; text-align: right; padding: 13px 18px; color: #000; z-index: 99999; font-family: sans-serif; font-size: 17px; opacity: 0.6; transition: 0.12s all; }\
                #promoClose:hover { opacity: 1; cursor: pointer; }\
            ';

            css.styleSheet ? css.styleSheet.cssText = styles : css.appendChild(document.createTextNode(styles));

            var head = document.getElementsByTagName("head")[0];
            head.firstChild ? head.insertBefore(css, head.firstChild) : head.appendChild(css);
        },
        addLink: function () {
            promo.image.style.cursor = 'pointer';
            promo.image.onclick = function () {
                options.target == '' ? document.location = options.link : window.open(options.link, options.target);
                promoFx.closeEvent();
            }
        },
        startPromo: function () {

            promo.content.appendChild(promo.image);

            if (!options.disableCloseButton) promo.content.appendChild(promo.close);

            promo.container.appendChild(promo.content);

            if (!options.disableOverlay) document.body.appendChild(promo.overlay);

            document.body.appendChild(promo.container);

            if (options.link) promoFx.addLink();
            if (!options.disableOverlayClose) promo.overlay.onclick = promoFx.closeEvent;
            if (!options.disableCloseButton) promo.close.onclick = promoFx.closeEvent;

            if (!options.disableStyles) promoFx.addStyle();
        },
        closeEvent: function () {
            if (promo.overlay && promo.overlay.parentNode) promo.overlay.parentNode.removeChild(promo.overlay);
            if (promo.container && promo.container.parentNode != undefined) promo.container.parentNode.removeChild(promo.container);
            if (typeof window[options.closeCallback] === 'function') window[options.closeCallback]();
            if (autoCloseSeconds) clearTimeout(autoCloseSeconds);
            return false;
        }
    };

    var promo = {
        overlay: promoFx.makeElement('div', 'id', '', 'promoOverlay'),
        container: promoFx.makeElement('div', 'id', '', 'promoContainer'),
        content: promoFx.makeElement('div', 'id', '', 'promoContent'),
        image: promoFx.makeElement('img', 'src', '', options.imagePath),
        close: promoFx.makeElement('a', 'id', options.closeButtonText ? options.closeButtonText : '×', 'promoClose')
    };

    promoFx.startPromo();

    if (options.autoCloseSeconds) {
        var autoCloseSeconds = setTimeout(function () {
            promoFx.closeEvent();
        }, options.autoCloseSeconds * 1000);
    }

    return this;
}