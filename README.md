promoBox
========

JavaScript function to show promo image popup.


Features
-----------

* display a popup image in a lightbox when the page loads
* add buttons to the lightbox with custom text, link and target
* set start/end date of showing the popup
* set number of days after the popup should be shown again
* specify urls or hashes to show or hide the popup
* interstitial feature with countdown timer and skip link
* delayed start and autoclose options
* configurable display frequency
* easy deployment: one JavaScript file, no markup, no library dependency 
* easy styling: custom CSS classes
* localization: all texts configurable
* callback functions on start, button click and close

**Demo**: [http://codepen.io/rolandtoth/pen/Kkdln](http://codepen.io/rolandtoth/pen/Kkdln)

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


**showScrollbar**

Whether to show the page scrollbar (`true` or `false`, default is `false`).


**disableKeyClose**

Whether to disable closing promoBox with the ESC key (`true` or `false`).


**closeButtonText**

Custom text for the close button (e.g. `Close popup`).


**showOnHash**

Show the popup only if the current url has a given hash (e.g. `#promo`).

Add multiple values as an array (e.g. `["#demo", "#test"]`).

Only exact matches count.


**randomFrequency**

Sets how often should the popup displayed (e.g. `0.5`, meaning about 50% probability).

Accepts values from `0.1` to `1`, higher values mean more frequent displays.


**startDate**

Date from the popup should appear (e.g. `April 12, 2014 02:30:00`).


**endDate**

Date until the popup should appear (e.g. `April 16, 2014 19:27:00`).


**cookieLifetime**

Number of days to show the popup again for a visitor (uses a cookie, e.g. `2` or `0.33`).

Set value to `session` to show the popup again after reopening the browser.


**deleteCookieOnHash**

Delete cookie set with 'cookieLifetime' if the current url has the supplied hash (e.g. `#clear`). 

Add multiple values as an array (e.g. `["#clear", "#test"]`).

Only exact matches count.


**showIfUrlContains**

Show promoBox only if the current url contains the supplied string (e.g. `/products/`).

Add multiple values as an array (e.g. `["promotion", "freebies/docs"]`).

Partial matches are allowed.


**hideIfUrlContains** 

Show promoBox only if the current url does not contain the supplied string (e.g. `profile`).

Add multiple values as an array (e.g. `["dev.mysite", "mysite.com/about-us"]`).

Partial matches are allowed.


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