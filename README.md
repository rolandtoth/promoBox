promoBox
========

JavaScript function to show promo image popup
**Demo**: [http://codepen.io/rolandtoth/pen/Kkdln](http://codepen.io/rolandtoth/pen/Kkdln)

Compability
-----------
* IE8+ (without some CSS3 animations)
* modern browsers

Options
-----------

**imagePath**

Absolute or full path to the image to display (required)


**link**

url to visit when clicking on the image


**target**

link target (e.g. `_blank`)


**actionButtons**

Array of buttons to add to the lightbox.

Accepts four items per button:
* button text
* button link
* link target
* classes

If only button text is supplied the button will close the promoBox.

Use `#closePromo` as button link to close promoBox on click.


Example:

```javascript
actionButtons: [
    ['Visit GitHub', 'https://github.com/rolandtoth/promoBox', '_blank', 'external github'],
    ['Jump to anchor', '#anchor', '', 'jumpLink'],
    ['Cancel']
]
```

**disableOverlay**

Whether to show the overlay background (`true` or `false`)


**disableOverlayClose**

Whether to enable closing the lightbox clicking on the overlay (`true` or `false`)


**disableStyles**

Whether to add default styles (`true` or `false`)


**disableCloseButton**

Whether to show the close button in the top-right corner (`true` or `false`)


**disableKeyClose**
Whether to disable closing the lightbox with the ESC key (`true` or `false`)


**closeButtonText**

Custom text for the close button (e.g. `Close popup`)


**showOnHash**

Show the popup only if the current url has a given hash (e.g. `#promo`).
Add multiple values as an array (e.g. '["#demo", "#test"]').
Only exact matches count.


**startDate**

Date from the popup should appear (e.g. 'April 12, 2014 02:30:00')


**endDate**

Date until the popup should appear e.g.  'April 16, 2014 19:27:00')


**daysToSeeAgain**

Period of days to show the popup again for a visitor (uses a cookie, e.g. '2')


**deleteCookieOnHash**

Delete cookie set with 'daysToSeeAgain' if the current url has the supplied hash (e.g. `#clear`). 

Add multiple values as an array (e.g. `["#clear", "#test"]`).
Only exact matches count.


**showIfUrlContains**

Show the lightbox only if the current url contains the supplied string (e.g. '/products/', partial match).
Add multiple values as an array (e.g. `["promotion", "freebies/docs"]`).


**hideIfUrlContains** 

Show the lightbox only if the current url does not contain the supplied string (e.g. 'profile', partial match).
Add multiple values as an array (e.g. `["dev.mysite", "mysite.com/about-us"]`).


**fadeInDuration**

Duration of fade-in effect in seconds (e.g. `0.7`)


**fadeOutDuration**

Duration of fade-out effect in seconds (e.g. `0.7`)


**loadDelay**

Delay in seconds to display the lightbox (e.g. `2.5`)


**interstitialDuration**

If set greater than 0 an interstitial will be shown with a countdown timer (seconds, e.g. `30`)


**interstitialSkipText**

Text of the link to close the interstitial (default is `Skip this ad`)


**interstitialText**

Text of the interstitial (default is `or wait %s seconds` where %s is the value of interstitialDuration)


**autoCloseSeconds**

Automatically close the popup after given seconds (e.g. `10`)


**Callback functions**
* `promoBoxStart` is fired when promoBox is started
* `promoBoxClose` is fired when promoBox is closed
* `promoBoxClick` is fired when the main image or action buttons are clicked