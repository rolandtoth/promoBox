promoBox
========

JavaScript function to show promo image popup.


Features
-----------

* show a popup image in a lightbox
* allow or restrict popup on specific urls
* set start/end date, display frequency
* interstitial feature with countdown timer and skip link
* custom action buttons
* delayed start and autoclose
* randomize popup display
* localization: configurable texts
* easy deployment: one JavaScript file, no markup, no library dependency 
* easy styling: add custom CSS classes
* callback functions on start, button click and close

Demo
----------- 
[http://codepen.io/rolandtoth/pen/Kkdln](http://codepen.io/rolandtoth/pen/Kkdln)

[http://rawgit.com/rolandtoth/promoBox/master/index.html](http://rawgit.com/rolandtoth/promoBox/master/index.html)


Compatibility
-----------
* IE8+ (without some CSS3 animations)
* modern browsers

Styling
-----------
promoBox comes with a minimalistic default style included in promoBox.js.

To modify, simply override rules in your CSS file (no need to use the `important!` property).

To completely remove built-in styles, set `disableStyles: true` (see below).


Options
-----------

**imagePath**

Absolute or relative path to the image to display (**required**).


**link**

URL to visit when clicking on the main image.


**target**

Target of the main image link (e.g. `_blank`).


**actionButtons**

Buttons to add to the lightbox.

Four option can be set per button:
* button text
* button link
* link target
* classes

If only button text is supplied the button will close the promoBox.

Example:
```javascript
actionButtons: [
    ['Visit GitHub', 'https://github.com/rolandtoth/promoBox', '_blank', 'external github'],
    ['Jump to anchor', '#anchor', '', 'jumpLink'],
    ['Cancel']
]
```


**className**

Custom class(es) to add to the promoBox container (e.g. `myPromo` or `myPromo container`).


**disableOverlay**

Whether to show the overlay background (`true` or `false`).


**disableOverlayClose**

Whether to enable closing promoBox by clicking on the overlay (`true` or `false`).


**disableStyles**

Whether to add default styles (`true` or `false`).


**disableCloseButton**

Whether to show the close button in the top-right corner (`true` or `false`).


**disableCloseOnClick**

Whether to close the popup when clicking on the main image or action buttons (`true` or `false`).

Ignored if link url is `#promoClose` (closes the popup).


**showScrollbar**

Whether to show the page scrollbar (`true` or `false`, default is `false`).


**disableKeyClose**

Whether to disable closing promoBox with the ESC key (`true` or `false`).


**closeButtonText**

Custom text for the close button (e.g. `Close popup`).


**frequency**

Number of days to show the popup again for a visitor (e.g. `2` or `0.33`, uses a cookie).

Setting to `session` will show the popup again after re-opening the browser.


**randomWeight**

Sets what probability the popup should be displayed (e.g. `0.5`, meaning about 50% of the time).

Accepts values from `0.1` to `1`, with higher values meaning more frequent displays.


**startDate**

Date from the popup should appear (e.g. `April 12, 2014 02:30:00`).


**endDate**

Date until the popup should appear (e.g. `April 16, 2014 19:27:00`).


**deleteCookieOnHash**

Remove cookie set with `cookieLifetime` if the current url contains the supplied string (e.g. `#clear`). 

Add multiple values as an array (e.g. `["#clear", "#test"]`).

Only exact matches count.


**showOnUrl**

Show promoBox only if the current url contains the supplied string (e.g. `/products/`, `#promo`).

Add multiple values as an array (e.g. `["/products/", "freebies/docs"]`).


**hideOnUrl** 

Do not show promoBox if the current url contains the supplied string (e.g. `profile`, `#disable`).

Add multiple values as an array (e.g. `["profile", "dev.mysite"]`).


**forceOnUrl**

Force showing promoBox if the current url contains the supplied string (e.g. `/public`, `#force`).

Add multiple values as an array (e.g. `["/public", "dev"]`).

Overrides any other validation except `imagePath`.


**fadeInDuration**

Duration of fade-in effect in seconds (e.g. `0.7`).


**fadeOutDuration**

Duration of fade-out effect in seconds (e.g. `0.7`).


**loadDelay**

Delay in seconds to display promoBox (e.g. `2.5`).


**interstitialDuration**

If set greater than 0 an interstitial will be shown with a countdown timer (seconds, e.g. `30`).


**interstitialSkipText**

Text of the link to close the interstitial (default is `Skip this ad`).


**interstitialText**

Text of the interstitial (default is `or wait %s seconds` where %s is the value of interstitialDuration).


**autoCloseSeconds**

Automatically close the popup after given seconds (e.g. `10`).


**Callback functions**
* `promoBoxStart` when promoBox is starting
* `promoBoxClose` when promoBox is closing
* `promoBoxClick` when the main image or action buttons are clicked
