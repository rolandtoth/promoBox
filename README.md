promoBox
========

JavaScript function to show promo image popup

Compability
-----------
* IE8+ (without some CSS3 animations)
* modern browsers

Options
-----------

* **imagePath:** absolute or full path to the image to display (required)
* **link:** url to visit when clicking on the image
* **target:** link target (e.g. '_blank')
* **disableOverlay:** whether to show the overlay background (true/false)
* **disableOverlayClose:** whether to enable closing the lightbox clicking on the overlay (true/false)
* **disableStyles:** whether to add default styles (true/false)
* **disableCloseButton:** whether to show the close button in the top-right corner
* **disableKeyClose:** set to true to disable closing the lightbox with ESC key
* **closeButtonText:** use custom text for the close button (e.g. 'Close popup')
* **showOnHash:** show the popup only if the current url has a given hash (e.g. '#promo', exact match). For multiple values use an array (e.g. '["#demo", "#test"]').
* **startDate:** date from the popup should appear (e.g. 'April 12, 2014 02:30:00')
* **endDate:** date until the popup should appear e.g.  'April 16, 2014 19:27:00')
* **daysToSeeAgain:** period of days to show the popup again for a visitor (uses a cookie, e.g. '2')
* **deleteCookieOnHash:** delete cookie set with 'daysToSeeAgain' if the current url has the supplied hash (e.g. '#clear', exact match). For multiple values use an array (e.g. '["#clear", "#test"]').
* **showIfUrlContains:** show the lightbox only if the current url contains the supplied string (e.g. '/products/', partial match). For multiple values use an array (e.g. '["promotion", "freebies/docs"]').
* **hideIfUrlContains:** show the lightbox only if the current url does not contain the supplied string (e.g. 'profile', partial match). For multiple values use an array (e.g. '["dev.mysite", "mysite.com/about-us"]').
* **fadeInDuration:** duration of fade-in effect in seconds (e.g. '0.7')
* **fadeOutDuration:** duration of fade-out effect in seconds (e.g. '0.7')
* **loadDelay:** delay in seconds to display the lightbox (e.g. '2.5')
* **interstitialDuration:** if set greater than 0 an interstitial will be shown with a countdown timer (seconds, e.g. '30')
* **interstitialSkipText:** text of the link to close the interstitial (default is 'Skip this ad')
* **interstitialText:** text of the interstitial (default is 'or wait %s seconds' where %s is the value of interstitialDuration)
* **autoCloseSeconds:** automatically close the popup after given seconds (e.g. '10')
* **Callback functions:** 'promoBoxStart', 'promoBoxClick' and 'promoBoxClose' functions are automatically fired if they exist

Demo: [http://codepen.io/rolandtoth/pen/Kkdln](http://codepen.io/rolandtoth/pen/Kkdln)
