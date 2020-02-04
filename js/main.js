'use strict';

var OFFER_COUNT = 8;
var MAP_X_MIN = 0;
var MAP_X_MAX = 1200;
var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;
var PIN_WIDTH = 70;
var PIN_HEIGHT = 50;
var MIN_PRICE = 0;
var MAX_PRICE = 9000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 4;
var MIN_GUESTS = 1;
var MAX_GUESTS = 5;

var AVATAR_PATH = 'img/avatars/user0';

var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');
var pinList = map.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

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
      'price': [getRandomNumber(MIN_PRICE, MAX_PRICE)],
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
    pins.push(createOffer(i + 1));
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

  pinElement.style.left = item.location.x + PIN_WIDTH + 'px';
  pinElement.style.top = item.location.y + PIN_HEIGHT + 'px';

  pinImage.style.src = item.author.avatar;
  pinImage.style.alt = item.offer.title;

  pinImage.src = item.author.avatar;

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

/**
 * Копируем вёрстку карточки объявления и задаём ей свои параметры
 * @param {object} item - Элемент из массива с предложениями по сдаче недвижимости
 * @return {object} Карточка объявления
 */
var renderCard = function (item) {
  var cardElement = cardTemplate.cloneNode(true);

  var cardTitle = cardElement.querySelector('.popup__title');
  if (item.offer.title !== '') {
    cardTitle.textContent = item.offer.title;
  } else {
    cardTitle.style.display = 'none';
  }

  var cardAddress = cardElement.querySelector('.popup__text--address');
  if (item.offer.address !== '') {
    cardAddress.textContent = item.offer.address;
  } else {
    cardAddress.style.display = 'none';
  }

  var cardPrice = cardElement.querySelector('.popup__text--price');
  if (item.offer.address !== '') {
    cardPrice.textContent = item.offer.price + '₽/ночь';
  } else {
    cardPrice.style.display = 'none';
  }

  var cardType = cardElement.querySelector('.popup__type');
  switch (item.offer.type) {
    case 'flat':
      cardType.textContent = 'Квартира';
      break;
    case 'bungalo':
      cardType.textContent = 'Бунгало';
      break;
    case 'house':
      cardType.textContent = 'Дом';
      break;
    case 'palace':
      cardType.textContent = 'Дворец';
      break;
    default:
      cardType.style.display = 'none';
  }

  var cardCapacity = cardElement.querySelector('.popup__text--capacity');
  if (item.offer.rooms !== '' || item.offer.guests !== '') {
    cardCapacity.textContent = item.offer.rooms + ' комнаты для ' + item.offer.guests + ' гостей';
  } else {
    cardCapacity.style.display = 'none';
  }

  var cardTime = cardElement.querySelector('.popup__text--time');
  if (item.offer.checkin !== '' || item.offer.checkout !== '') {
    cardTime.textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
  } else {
    cardTime.style.display = 'none';
  }

  var featuresList = cardElement.querySelector('.popup__features');
  if (item.offer.feature !== '') {
    while (featuresList.firstChild) {
      featuresList.removeChild(featuresList.firstChild);
    }

    item.offer.features.forEach(function (feature) {
      var featureItem = document.createElement('li');
      featureItem.className = 'popup__feature popup__feature--' + feature;
      featuresList.appendChild(featureItem);
    });
  } else {
    featuresList.style.display = 'none';
  }

  var cardDescription = cardElement.querySelector('.popup__description');
  if (item.offer.description !== '') {
    cardDescription.textContent = item.offer.description;
  } else {
    cardDescription.style.display = 'none';
  }

  var photoList = cardElement.querySelector('.popup__photos');
  if (item.offer.photo !== '') {
    var photoElement = photoList.querySelector('.popup__photo');
    photoList.removeChild(photoElement);

    item.offer.photos.forEach(function (photo) {
      var photoElementClone = photoElement.cloneNode(true);
      photoElementClone.src = photo;
      photoList.appendChild(photoElementClone);
    });
  } else {
    photoList.style.display = 'none';
  }

  var cardAvatar = cardElement.querySelector('.popup__avatar');
  if (item.offer.avatar !== '') {
    cardAvatar.src = item.author.avatar;
  } else {
    cardAvatar.style.display = 'none';
  }

  return cardElement;
};

/**
 * Формируем и вставляем вёрстку карточек - предложений о сдаче
 * @param {object} offers - Массив с информацией по объявлениям
 * @return {void}
 */
var renderCards = function (offers) {
  var fragment = document.createDocumentFragment();

  offers.forEach(function (item) {
    fragment.appendChild(renderCard(item));
  });

  map.appendChild(fragment);
};

map.classList.remove('map--faded');
var offers = createPins();
renderPins(offers);
renderCards(offers);
