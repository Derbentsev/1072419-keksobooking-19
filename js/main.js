'use strict';

var OFFER_COUNT = 8;
var MAP_WIDTH = 1200;
var PIN_SIZE = 65;

var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var offers = [];

var map = document.querySelector('.map');
var pinList = map.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

/**
 * Определяем случайное целое число
 * @param {number} max - Максимальное целое число
 * @return {number} Случайное целое число
 */
var randomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

/**
 * Создаем и добавляем в массив элемент-объявление
 * @return {void}
 */
var createOffers = function () {

  for (var i = 0; i < OFFER_COUNT; i++) {
    var locationX = randomNumber(0, MAP_WIDTH);
    var locationY = randomNumber(130, 630);

    offers.push({
      'author': {
        'avatar': 'img/avatars/0' + i + '.png'
      },
      'offer': {
        'title': 'заголовок предложения ' + i,
        'address': locationX + ',' + locationY,
        'price': [randomNumber(0, 9000)],
        'type': OFFER_TYPE[randomNumber(0, 3)],
        'rooms': randomNumber(1, 4),
        'guests': randomNumber(1, 5),
        'checkin': CHECK_TIME[randomNumber(0, 2)],
        'checkout': CHECK_TIME[randomNumber(0, 2)],
        'features': OFFER_FEATURES[randomNumber(0, 5)],
        'description': 'строка с описанием ' + i,
        'photos': OFFER_PHOTOS[randomNumber(0, 2)]
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    })
  }
};

/**
 * Копируем вёрстку метки объявления из шаблона
 * @return {object} Возвращаем объект-вёрстку объявления (метка на карте)
 */
var renderOffer = function (item, i) {
  var offerElement = pinTemplate.cloneNode(true);
  var offerImage = offerElement.querySelector('img');

  offerElement.style.left = item.location.x + PIN_SIZE + 'px';
  offerElement.style.top = item.location.y + PIN_SIZE + 'px';

  offerImage.style.src = item.author.avatar;
  offerImage.style.alt = item.offer.title;

  return offerElement;
};

/**
 * Добавляем объявление одно за другим к вёрстке
 * @return {void} 
 */
var offersAdd = function () {
  var fragment = document.createDocumentFragment();

  offers.forEach(function (item, i) {
    fragment.appendChild(renderOffer(item, i));
  });

  pinList.appendChild(fragment);
};

map.classList.remove('map--faded');
createOffers();
offersAdd();
