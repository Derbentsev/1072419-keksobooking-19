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
var MAIN_PIN_PSEUDO_HEIGHT = 22;

var ENTER_KEY = 'Enter';

var AVATAR_PATH = 'img/avatars/user0';

var TEXT_CAPACITY_VALIDATE_ERROR = 'К сожалению, вы тут не поместитесь(. Пожалуйста, выберите другое кол-во комнат';

var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var isPageActive = false;

var RoomsCapacity = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

var HouseType = {
  FLAT: 'Квартира',
  BUNGALO: 'Бунгало',
  HOUSE: 'Дом',
  PALACE: 'Дворец'
};

var CardClass = {
  TITLE: '.popup__title',
  ADDRESS: '.popup__text--address',
  PRICE: '.popup__text--price',
  TYPE: '.popup__type',
  CAPACITY: '.popup__text--capacity',
  TIME: '.popup__text--time',
  FEATURES: '.popup__features',
  DESCRIPTION: '.popup__description',
  PHOTOS: '.popup__photos',
  AVATAR: '.popup__avatar'
};

var map = document.querySelector('.map');
var pinList = map.querySelector('.map__pins');
var mapText = pinList.querySelector('.map__overlay');
var pinMain = map.querySelector('.map__pin--main');

var filtersSection = document.querySelector('.notice');
var filterForm = filtersSection.querySelector('.ad-form');
var filtersFormAddress = filtersSection.querySelector('#address');
var filtersFormRooms = filtersSection.querySelector('#room_number');
var filtersFormGuests = filtersSection.querySelector('#capacity');
var resetButton = filtersSection.querySelector('.ad-form__reset');

var fieldsets = document.querySelectorAll('fieldset');

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
 * Удаляет все существующие элементы li внутри блока и формирует свои элементы li
 * @param {object} featuresList - Блок, в котором удаляем и создаём элементы
 * @param {object} item - Элемент в массиве объявлений о сдаче
 * @return {void}
 */
var fillFeaturesBlock = function (featuresList, item) {
  while (featuresList.firstChild) {
    featuresList.removeChild(featuresList.firstChild);
  }

  item.offer.features.forEach(function (feature) {
    var featureItem = document.createElement('li');
    featureItem.className = 'popup__feature popup__feature--' + feature;
    featuresList.appendChild(featureItem);
  });
};

/**
 * Удаляет существующий элемент img внутри блока и формирует свои элементы img
 * @param {object} photoList - Блок, в котором удаляем и создаём элементы
 * @param {object} item - Элемент в массиве объявлений о сдаче
 * @return {void}
 */
var fillPhotosBlock = function (photoList, item) {
  var photoElement = photoList.querySelector('.popup__photo');
  photoList.removeChild(photoElement);

  item.offer.photos.forEach(function (photo) {
    var photoElementClone = photoElement.cloneNode(true);
    photoElementClone.src = photo;
    photoList.appendChild(photoElementClone);
  });
};

/**
 * Добавляем в заданный блок textContent либо скрываем данный блок
 * @param {object} card - Шаблон карточки
 * @param {object} classSelector - Класс блока
 * @param {object} item - Текст объявления, который вставляем в блок
 * @return {void}
 */
var fillCardContent = function (card, classSelector, item) {
  var cardBlock = card.querySelector(classSelector);

  if (item) {
    cardBlock.textContent = item;
  } else {
    cardBlock.style.display = 'none';
  }
};

/**
 * Добавляем в заданный блок textContent либо скрываем данный блок
 * @param {object} card - Шаблон карточки
 * @param {object} classSelector - Класс блока
 * @param {object} item - Массив
 * @return {void}
 */
var fillCardContentPhotos = function (card, classSelector, item) {
  var cardBlock = card.querySelector(classSelector);

  if (typeof item.offer.photos !== 'undefined' && item.offer.photos.length > 0) {
    fillPhotosBlock(cardBlock, item);
  } else {
    cardBlock.style.display = 'none';
  }
};

/**
 * Добавляем в заданный блок textContent либо скрываем данный блок
 * @param {object} card - Шаблон карточки
 * @param {object} classSelector - Класс блока
 * @param {object} item - Массив
 * @return {void}
 */
var fillCardContentFeatures = function (card, classSelector, item) {
  var cardBlock = card.querySelector(classSelector);

  if (typeof item.offer.features !== 'undefined' && item.offer.features.length > 0) {
    fillFeaturesBlock(cardBlock, item);
  } else {
    cardBlock.style.display = 'none';
  }
};

/**
 * Добавляем в заданный блок textContent либо скрываем данный блок
 * @param {object} card - Шаблон карточки
 * @param {object} classSelector - Класс блока
 * @param {object} item - Массив
 * @return {void}
 */
var fillCardContentCapacity = function (card, classSelector, item) {
  var cardBlock = card.querySelector(classSelector);

  if (item.offer.rooms && item.offer.guests) {
    cardBlock.textContent = item.offer.rooms + ' комнаты для ' + item.offer.guests + ' гостей';
  } else {
    cardBlock.style.display = 'none';
  }
};

/**
 * Добавляем в заданный блок textContent либо скрываем данный блок
 * @param {object} card - Шаблон карточки
 * @param {object} classSelector - Класс блока
 * @param {object} item - Массив
 * @return {void}
 */
var fillCardContentType = function (card, classSelector, item) {
  var cardBlock = card.querySelector(classSelector);

  if (item.offer.type) {
    cardBlock.textContent = HouseType[item.offer.type.toUpperCase()];
  } else {
    cardBlock.style.display = 'none';
  }
};

/**
 * Добавляем в заданный блок textContent либо скрываем данный блок
 * @param {object} card - Шаблон карточки
 * @param {object} classSelector - Класс блока
 * @param {object} item - Массив
 * @return {void}
 */
var fillCardContentTime = function (card, classSelector, item) {
  var cardBlock = card.querySelector(classSelector);

  if (item.offer.checkin && item.offer.checkout) {
    cardBlock.textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
  } else {
    cardBlock.style.display = 'none';
  }
};

/**
 * Копируем вёрстку карточки объявления и задаём ей свои параметры
 * @param {object} item - Элемент из массива с предложениями по сдаче недвижимости
 * @return {object} Карточка объявления
 */
var renderCard = function (item) {
  var card = cardTemplate.cloneNode(true);

  fillCardContent(card, CardClass['TITLE'], item.offer.title);
  fillCardContent(card, CardClass['ADDRESS'], item.offer.address);
  fillCardContent(card, CardClass['PRICE'], item.offer.price + '₽/ночь');
  fillCardContentType(card, CardClass['TYPE'], item);
  fillCardContentCapacity(card, CardClass['CAPACITY'], item);
  fillCardContentTime(card, CardClass['TIME'], item);
  fillCardContentFeatures(card, CardClass['FEATURES'], item);
  fillCardContent(card, CardClass['DESCRIPTION'], item.offer.description);
  fillCardContentPhotos(card, CardClass['PHOTOS'], item);
  fillCardContent(card, CardClass['AVATAR'], item.author.avatar);

  return card;
};

/**
 * Формируем и вставляем вёрстку карточек - предложений о сдаче
 * @param {object} offer - Массив с информацией по объявлениям
 * @return {void}
 */
var renderCards = function (offer) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderCard(offer));
  map.appendChild(fragment);
};

/**
 * Активирует карту и отрисовывает карточки предложений
 * @return {void}
 */
var activateOffers = function () {
  var offers = createPins();
  renderPins(offers);
  renderCards(offers[0]);
};

/**
 * Отключаем/включаем взаимодействие с картой
 * @return {void}
 */
var toggleActivateMap = function () {
  map.classList.toggle('map--faded');
  filterForm.classList.toggle('ad-form--disabled');
};

/**
 * Отключаем/включаем редактирование полей для ввода данных
 * @return {void}
 */
var toggleActivateInputs = function () {
  fieldsets.forEach(function (item) {
    item.toggleAttribute('disabled');
  });

  addFormRoomsListener();
};

/**
 * Отключаем/включаем взаимодействие со страницей
 * @return {void}
 */
var toggleActivatePage = function () {
  toggleActivateMap();
  toggleActivateInputs();

  if (isPageActive) {
    isPageActive = false;
    removeFormRoomsListener();
    removeResetButtonListener();
  } else {
    isPageActive = true;
    activateOffers();
    addFormRoomsListener();
    addResetButtonListener();
    removeMainPinListeners();
  }

  filtersFormAddress.value = getPinCoordinates();
};

/**
 * Добавляем обработчик нажатия левой кнопки мыши на главный пин
 * @param {object} evt - Нажатие на кнопку
 * @return {void}
 */
var clickOnMainPin = function (evt) {
  if (evt.button === 0) {
    toggleActivatePage();
  }
};

/**
 * Добавляем обработчики нажатия клавиши Enter на главный пин
 * @param {object} evt - Нажатие на кнопку
 * @return {void}
 */
var pressOnMainPin = function (evt) {
  if (evt.key === ENTER_KEY && !isPageActive) {
    toggleActivatePage();
  }
};

/**
 * Добавляем обработчики нажатия клавиш и мыши на главный пин
 * @return {void}
 */
var addMainPinListeners = function () {
  pinMain.addEventListener('mousedown', clickOnMainPin);
  pinMain.addEventListener('keydown', pressOnMainPin);
};

/**
 * Удаляем обработчики нажатия клавиш и мыши на главный пин
 * @return {void}
 */
var removeMainPinListeners = function () {
  pinMain.removeEventListener('mousedown', clickOnMainPin);
  pinMain.removeEventListener('keydown', pressOnMainPin);
};

/**
 * Определяем координаты главного пина
 * @return {void}
 */
var getPinCoordinates = function () {
  if (isPageActive) {
    return Math.round(pinMain.offsetTop - pinMain.offsetHeight / 2) + ', ' + Math.round(pinMain.offsetLeft + MAIN_PIN_PSEUDO_HEIGHT);
  } else {
    return Math.round(pinMain.offsetTop - pinMain.offsetHeight / 2) + ', ' + Math.round(pinMain.offsetLeft - pinMain.offsetWidth / 2);
  }
};

/**
 * Удаляем возможность выбора в поле 'Количество мест' те варианты, которые не соответствуют выбранному кол-ву комнат
 * @return {void}
 */
var changeCapacityRange = function () {
  if (filtersFormGuests.options.length) {
    [].forEach.call(filtersFormGuests.options, function (item) {
      item.selected = (RoomsCapacity[filtersFormRooms.value][0] === item.value) ? true : false;
      item.disabled = (RoomsCapacity[filtersFormRooms.value].indexOf(item.value) >= 0) ? false : true;
    });
  }
};

/**
 * Устанавливаем свой текст на валидацию поля по количеству комнат
 * @return {void}
 */
var setCapacityValidation = function () {
  if (filtersFormGuests.options.length) {
    if (RoomsCapacity[filtersFormRooms.value].indexOf(filtersFormGuests.value) < 0) {
      filtersFormRooms.setCustomValidity(TEXT_CAPACITY_VALIDATE_ERROR);
    } else {
      filtersFormRooms.setCustomValidity('');
    }
  }
};

/**
 * Удаляем попап карточки объявления
 * @return {void}
 */
var removeCardPopup = function () {
  for (var k = 0; k < map.children.length; k++) {
    if (map.children[k].classList.contains('popup')) {
      map.children[k].remove();
      k--;
    }
  }
};

/**
 * Удаляем все метки с объявлениями с карты
 * @return {void}
 */
var removePins = function () {
  for (var i = 0; i < pinList.children.length; i++) {
    if (pinList.children[i] !== pinMain && pinList.children[i] !== mapText) {
      pinList.children[i].remove();
      i--;
    }
  }
};

/**
 * Обработчик события при изменении кол-ва комнат
 * @return {void}
 */
var onChangeFormRooms = function () {
  changeCapacityRange();
  setCapacityValidation();
};

/**
 * Вешаем обработчик события при изменении кол-ва комнат
 * @return {void}
 */
var addFormRoomsListener = function () {
  filtersFormRooms.addEventListener('change', onChangeFormRooms);
};

/**
 * Удаляем обработчик события при изменении кол-ва комнат
 * @return {void}
 */
var removeFormRoomsListener = function () {
  filtersFormRooms.removeEventListener('change', onChangeFormRooms);
};

/**
 * Обработчик события при изменении кол-ва комнат
 * @return {void}
 */
var onPressResetButton = function () {
  filterForm.reset();
  filtersFormAddress.value = getPinCoordinates();
  changeCapacityRange();
  setCapacityValidation();
  toggleActivatePage();
  removePins();
  removeCardPopup();
  addMainPinListeners();
  removeFormRoomsListener();
};

/**
 * Вешаем обработчик события при нажатии на кнопку "Очистить"
 */
var addResetButtonListener = function () {
  resetButton.addEventListener('click', onPressResetButton);
};

/**
 * Удаляем обработчик события при нажатии на кнопку "Очистить"
 */
var removeResetButtonListener = function () {
  resetButton.removeEventListener('click', onPressResetButton);
};


filtersFormAddress.value = getPinCoordinates();
addMainPinListeners();
changeCapacityRange();
setCapacityValidation();
toggleActivateInputs();
