'use strict';

(function () {
  var PIN_WIDTH = 70;
  var PIN_HEIGHT = 50;

  var offers = [];

  var pinList = window.config.map.querySelector('.map__pins');

  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  /**
   * Копируем вёрстку метки объявления из шаблона
   * @param {object} item - Объявление о сдаче недвижимости
   * @param {number} i - Порядковый номер объявления
   * @return {object} Возвращаем объект-вёрстку объявления (метка на карте)
   */
  var renderPin = function (item, i) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.style.left = item.location.x + PIN_WIDTH + 'px';
    pinElement.style.top = item.location.y + PIN_HEIGHT + 'px';

    pinImage.style.src = item.author.avatar;
    pinImage.style.alt = item.offer.title;

    pinImage.src = item.author.avatar;

    pinElement.dataset.key = i;

    return pinElement;
  };

  /**
   * Добавляем метки одну за другой к вёрстке
   * @param {object} items - Массив с объявлениями
   * @return {void}
   */
  var renderPins = function (items) {
    var fragment = document.createDocumentFragment();

    items.forEach(function (item, i) {
      fragment.appendChild(renderPin(item, i));
    });

    pinList.appendChild(fragment);
  };

  /**
   * Обработчик события нажатия на пин объявления
   * @param {*} evt - Событие нажатия на пин
   * @return {void}
   */
  var onPinClick = function (evt) {
    if (evt.target.parentElement.dataset.key) {
      window.popup.renderPopup(offers[evt.target.parentElement.dataset.key]);
    }
  };

  /**
   * Обработчик события нажатия Enter на пин объявления
   * @param {*} evt - Событие нажатия на пин
   * @return {void}
   */
  var onPinEnterPress = function (evt) {
    if (evt.key === window.const.ENTER_KEY) {
      window.popup.renderPopup(offers[evt.target.dataset.key]);
    }
  };

  /**
   * Добавляем отслеживание кликов на пины объявлений
   * @return {void}
   */
  var addPinsListeners = function () {
    pinList.addEventListener('click', onPinClick);
    pinList.addEventListener('keydown', onPinEnterPress);
  };

  /**
   * Удаляем отслеживание кликов на пины объявлений
   * @return {void}
   */
  var removePinsListeners = function () {
    pinList.removeEventListener('click', onPinClick);
    pinList.removeEventListener('keydown', onPinEnterPress);
  };

  /**
   * Удаляем все метки с объявлениями с карты
   * @return {void}
   */
  var removePins = function () {
    window.config.map.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (item) {
      item.remove();
    });
  };

  /**
   * Отрисовывает карточки предложений
   * @return {void}
   */
  var activateOffers = function () {
    offers = window.offers.createOffers();
    renderPins(offers);
  };

  window.pins = {
    removePins: removePins,
    addPinsListeners: addPinsListeners,
    removePinsListeners: removePinsListeners,
    activateOffers: activateOffers,
    PIN_HEIGHT: PIN_HEIGHT
  };
})();
