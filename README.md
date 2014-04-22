promoBox
========

JavaScript function to show promo image popup

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
* **showOnHash:** show the popup only if the current url contains a given hash (e.g. '#promo')
* **startDate:** date from the popup should appear (e.g. 'April 12, 2014 02:30:00')
* **endDate:** date until the popup should appear e.g.  'April 16, 2014 19:27:00')
* **daysToSeeAgain:** period of days to show the popup again for a visitor (uses a cookie, e.g. '2')
* **startCallback:** function name that is fired before showing the popup (string, e.g. 'beforePromo')
* **closeCallback:** function name that is fired before showing the popup (string, e.g. 'afterPromo')
* **autoCloseSeconds:** automatically close the popup after given seconds (e.g. '10')
