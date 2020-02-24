'use strict';

(function () {
  var MAIN_PIN_PSEUDO_HEIGHT = 22;

  var pinMain = window.config.map.querySelector('.map__pin--main');

  /**
   * Определяем координаты главного пина
   * @return {void}
   */
  var getPinCoordinates = function () {
    if (window.config.isPageActive) {
      return Math.round(pinMain.offsetTop - pinMain.offsetHeight / 2) + ', ' + Math.round(pinMain.offsetLeft + MAIN_PIN_PSEUDO_HEIGHT);
    } else {
      return Math.round(pinMain.offsetTop - pinMain.offsetHeight / 2) + ', ' + Math.round(pinMain.offsetLeft - pinMain.offsetWidth / 2);
    }
  };

  /**
   * Добавляем обработчик нажатия левой кнопки мыши на главный пин
   * @param {object} evt - Нажатие на кнопку
   * @return {void}
   */
  var clickOnMainPin = function (evt) {
    if (evt.button === 0) {
      window.page.toggleActivatePage();
      evt.stopPropagation();
    }
  };

  /**
   * Добавляем обработчики нажатия клавиши Enter на главный пин
   * @param {object} evt - Нажатие на кнопку
   * @return {void}
   */
  var pressOnMainPin = function (evt) {
    if (evt.key === window.const.ENTER_KEY && !window.const.isPageActive) {
      window.page.toggleActivatePage();
      evt.stopPropagation();
    }
  };

  /**
   * Добавляем обработчики нажатия клавиш и мыши на главный пин
   * @return {void}
   */
  var addMainPinListeners = function () {
    pinMain.addEventListener('mousedown', clickOnMainPin);
    pinMain.addEventListener('keydown', pressOnMainPin);
    pinMain.addEventListener('click', function (evt) {
      evt.stopPropagation();
    });
  };

  /**
   * Удаляем обработчики нажатия клавиш и мыши на главный пин
   * @return {void}
   */
  var removeMainPinListeners = function () {
    pinMain.removeEventListener('mousedown', clickOnMainPin);
    pinMain.removeEventListener('keydown', pressOnMainPin);
  };


  window.pinMain = {
    getPinCoordinates: getPinCoordinates,
    addMainPinListeners: addMainPinListeners,
    removeMainPinListeners: removeMainPinListeners
  };

  addMainPinListeners();
})();
