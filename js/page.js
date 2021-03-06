'use strict';

(function () {
  /**
   * Отключаем/включаем взаимодействие со страницей
   * @return {void}
   */
  var toggleActivatePage = function () {
    window.map.toggleActivateMap();
    window.form.toggleActivateForm();
    window.form.toggleActivateInputs();
    window.form.changePricePlaceholder();

    if (window.config.isPageActive) {
      window.config.isPageActive = false;
      window.form.removeFormInputsListener();
      window.form.removeResetButtonListener();
      window.pins.removePinsListeners();
      window.pinMain.setCoordsMainPinOnStart();
      // window.photo.removePhotoListener();
      window.photo.togglePhotoListener('removeEventListener');
    } else {
      window.config.isPageActive = true;
      window.pins.activateOffers();
      window.form.addFormInputsListener();
      window.form.addResetButtonListener();
      window.pinMain.removeMainPinListeners();
      window.pins.addPinsListeners();
      // window.photo.addPhotoListener();
      window.photo.togglePhotoListener('addEventListener');
    }

    window.form.offerFormAddress.value = window.pinMain.getPinCoordinates();
  };

  window.page = {
    toggleActivatePage: toggleActivatePage
  };
})();
