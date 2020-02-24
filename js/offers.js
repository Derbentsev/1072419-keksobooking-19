'use strict';

(function () {
  var MAP_X_MIN = 0;
  var MAP_X_MAX = 1200;
  var MAP_Y_MIN = 130;
  var MAP_Y_MAX = 630;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 4;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 5;
  var OFFER_COUNT = 8;

  var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var CHECK_TIME = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var AVATAR_PATH = 'img/avatars/user0';

  /**
   * Определяем случайное целое число
   * @param {number} min - Минимальное целое число
   * @param {number} max - Максимальное целое число
   * @return {number} Случайное целое число
   */
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  /**
   * Формируем массив из случайных элементов заданного массива
   * @param {object} arr - Массив, из которого будем выбирать случайные элементы
   * @return {object} Случайный массив из преимуществ
   */
  var generateArray = function (arr) {
    var arrNew = [];

    arr.forEach(function (item) {
      if (getRandomNumber(0, 1) === 1) {
        arrNew.push(item);
      }
    });

    if (arrNew.length === 0) {
      arrNew.push(arr[getRandomNumber(0, arr.length - 1)]);
    }

    return arrNew;
  };

  /**
   * Создаем элемент-объявление
   * @param {number} i - Номер объявления
   * @return {object} Объявление с заполненными данными по объекту сдачи
   */
  var createOffer = function (i) {
    var locationX = getRandomNumber(MAP_X_MIN, MAP_X_MAX);
    var locationY = getRandomNumber(MAP_Y_MIN, MAP_Y_MAX);

    var offer = {
      'author': {
        'avatar': AVATAR_PATH + i + '.png'
      },
      'offer': {
        'title': 'заголовок предложения ' + i,
        'address': locationX + ',' + locationY,
        'price': [getRandomNumber(window.const.MIN_PRICE, window.const.MAX_PRICE)],
        'type': OFFER_TYPE[getRandomNumber(0, OFFER_TYPE.length - 1)],
        'rooms': getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        'guests': getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        'checkin': CHECK_TIME[getRandomNumber(0, CHECK_TIME.length - 1)],
        'checkout': CHECK_TIME[getRandomNumber(0, CHECK_TIME.length - 1)],
        'features': generateArray(OFFER_FEATURES),
        'description': 'строка с описанием ' + i,
        'photos': generateArray(OFFER_PHOTOS)
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    };

    return offer;
  };

  /**
   * Добавляем элемент-объявление в массив
   * @return {object} Возвращаем массив со сгенерированными объявлениями
   */
  var createOffers = function () {
    var pins = [];

    for (var i = 0; i < OFFER_COUNT; i++) {
      pins.push(createOffer(i + 1));
    }

    return pins;
  };

  window.offers = {
    createOffers: createOffers
  };
})();
