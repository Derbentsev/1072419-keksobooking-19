'use strict';

var OFFER_COUNT = 8;
var MAP_WIDTH = 1200;
var PIN_SIZE = 65;
var MAX_PRICE = 9000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 4;
var MIN_GUESTS = 1;
var MAX_GUESTS = 5;

var AVATAR_PATH = 'img/avatars/0';

var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');
var pinList = map.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

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
  var locationX = getRandomNumber(0, MAP_WIDTH);
  var locationY = getRandomNumber(130, 630);

  var offer = {
    'author': {
      'avatar': AVATAR_PATH + i + '.png'
    },
    'offer': {
      'title': 'заголовок предложения ' + i,
      'address': locationX + ',' + locationY,
      'price': [getRandomNumber(0, MAX_PRICE)],
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
var createPins = function () {
  var pins = [];

  for (var i = 0; i < OFFER_COUNT; i++) {
    pins.push(createOffer(i));
  }

  return pins;
};

/**
 * Копируем вёрстку метки объявления из шаблона
 * @param {object} item - Объявление о сдаче недвижимости
 * @return {object} Возвращаем объект-вёрстку объявления (метка на карте)
 */
var renderPin = function (item) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImage = pinElement.querySelector('img');

  pinElement.style.left = item.location.x + PIN_SIZE + 'px';
  pinElement.style.top = item.location.y + PIN_SIZE + 'px';

  pinImage.style.src = item.author.avatar;
  pinImage.style.alt = item.offer.title;

  return pinElement;
};

/**
 * Добавляем метки одну за другой к вёрстке
 * @param {object} offers - Массив с объявлениями
 * @return {void}
 */
var renderPins = function (offers) {
  var fragment = document.createDocumentFragment();

  offers.forEach(function (item) {
    fragment.appendChild(renderPin(item));
  });

  pinList.appendChild(fragment);
};

map.classList.remove('map--faded');
var offers = createPins();
renderPins(offers);
