'use strict';

(function () {
  var MAIN_PIN_PSEUDO_HEIGHT = 22;
  var MAIN_PIN_SIZE = 65;

  var pinMain = window.config.map.querySelector('.map__pin--main');

  var isDragged = false;

  var startCoords;

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
   * Добавляем обработчики перемещения мыши при удерживании на главного пина
   * @param {object} evt - Нажатие на кнопку
   * @return {void}
   */
  var onMouseMove = function (evt) {
    evt.preventDefault();

    isDragged = true;

    var shift = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY
    };

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    if ((pinMain.offsetTop - shift.y) < window.offers.MAP_Y_MAX &&
      (pinMain.offsetTop - shift.y + MAIN_PIN_SIZE) > window.offers.MAP_Y_MIN) {
      pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
    }

    if ((pinMain.offsetLeft - shift.x + MAIN_PIN_SIZE / 2) < window.offers.MAP_X_MAX &&
      (pinMain.offsetLeft - shift.x + MAIN_PIN_SIZE / 2) > window.offers.MAP_X_MIN) {
      pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
    }

    window.form.filterFormAddress.value = window.pinMain.getPinCoordinates();
  };

  /**
   * Добавляем обработчики отпускания кнопки мыши при удерживании на главного пина
   * @param {object} evt - Нажатие на кнопку
   * @return {void}
   */
  var onMouseUp = function (evt) {
    if (evt.button === 0 && !isDragged && !window.config.isPageActive) {
      window.page.toggleActivatePage();
      evt.stopPropagation();
    }

    isDragged = false;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  /**
   * Добавляем обработчик нажатия левой кнопки мыши на главный пин
   * @param {object} evt - Нажатие на кнопку
   * @return {void}
   */
  var onMouseDown = function (evt) {
    evt.preventDefault();

    startCoords = {
      x: evt.clientX,
      y: evt.clienY
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  /**
   * Добавляем обработчики нажатия клавиши Enter на главный пин
   * @param {object} evt - Нажатие на кнопку
   * @return {void}
   */
  var onMainPinPress = function (evt) {
    if (evt.key === window.const.ENTER_KEY && !window.const.isPageActive) {
      window.page.toggleActivatePage();
      evt.stopPropagation();
    }
  };

  /**
   * Добавляем обработчик клика на главный пин
   * @param {object} evt - Нажатие на кнопку
   * @return {void}
   */
  var onMainPinClick = function (evt) {
    evt.stopPropagation();
  };

  /**
   * Добавляем обработчики нажатия клавиш и мыши на главный пин
   * @return {void}
   */
  var addMainPinListeners = function () {
    pinMain.addEventListener('mousedown', onMouseDown);
    pinMain.addEventListener('keydown', onMainPinPress);
    pinMain.addEventListener('click', onMainPinClick);
  };

  /**
   * Удаляем обработчики нажатия клавиш и мыши на главный пин
   * @return {void}
   */
  var removeMainPinListeners = function () {
    // pinMain.removeEventListener('mousedown', onMouseDown);
    pinMain.removeEventListener('keydown', onMainPinPress);
    pinMain.removeEventListener('click', onMainPinClick);
  };


  window.pinMain = {
    getPinCoordinates: getPinCoordinates,
    addMainPinListeners: addMainPinListeners,
    removeMainPinListeners: removeMainPinListeners
  };

  addMainPinListeners();
})();
