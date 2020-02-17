'use strict';

var OFFER_COUNT = 8;
var MAP_X_MIN = 0;
var MAP_X_MAX = 1200;
var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;
var PIN_WIDTH = 70;
var PIN_HEIGHT = 50;
var MIN_PRICE = 0;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 4;
var MIN_GUESTS = 1;
var MAX_GUESTS = 5;
var MAIN_PIN_PSEUDO_HEIGHT = 22;
var MIN_TITLE_LENGTH = 30;
var MAX_TITLE_LENGTH = 100;

var ENTER_KEY = 'Enter';
var ESC_KEY = 'Escape';

var AVATAR_PATH = 'img/avatars/user0';

var TEXT_CAPACITY_VALIDATE_ERROR = 'К сожалению, вы тут не поместитесь(. Пожалуйста, выберите другое кол-во комнат';

var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var isPageActive = false;

var offers = [];

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

var MinPrice = {
  'flat': 0,
  'bungalo': 1000,
  'house': 5000,
  'palace': 10000
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
var resetButton = filtersSection.querySelector('.ad-form__reset');

var filterForm = filtersSection.querySelector('.ad-form');
var filterFormAddress = filtersSection.querySelector('#address');
var filterFormRooms = filtersSection.querySelector('#room_number');
var filterFormGuests = filtersSection.querySelector('#capacity');
var filterFormTitle = filterForm.querySelector('#title');
var filterFormPrice = filterForm.querySelector('#price');
var filterFormType = filterForm.querySelector('#type');
var filterFormTimein = filterForm.querySelector('#timein');
var filterFormTimeout = filterForm.querySelector('#timeout');

var fieldsets = document.querySelectorAll('fieldset');

var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

var popupCloseButton;


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
 * @param {object} offer - Массив
 * @return {void}
 */
var fillCardContentCapacity = function (card, classSelector, offer) {
  var cardBlock = card.querySelector(classSelector);

  if (offer.offer.rooms && offer.offer.guests) {
    cardBlock.textContent = offer.offer.rooms + ' комнаты для ' + offer.offer.guests + ' гостей';
  } else {
    cardBlock.style.display = 'none';
  }
};

/**
 * Добавляем в заданный блок textContent либо скрываем данный блок
 * @param {object} card - Шаблон карточки
 * @param {object} classSelector - Класс блока
 * @param {object} offer - Массив
 * @return {void}
 */
var fillCardContentType = function (card, classSelector, offer) {
  var cardBlock = card.querySelector(classSelector);

  if (offer.offer.type) {
    cardBlock.textContent = HouseType[offer.offer.type.toUpperCase()];
  } else {
    cardBlock.style.display = 'none';
  }
};

/**
 * Добавляем в заданный блок textContent либо скрываем данный блок
 * @param {object} card - Шаблон карточки
 * @param {object} classSelector - Класс блока
 * @param {object} offer - Массив
 * @return {void}
 */
var fillCardContentTime = function (card, classSelector, offer) {
  var cardBlock = card.querySelector(classSelector);

  if (offer.offer.checkin && offer.offer.checkout) {
    cardBlock.textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
  } else {
    cardBlock.style.display = 'none';
  }
};

/**
 * Добавляем аватар
 * @param {object} card - Шаблон карточки
 * @param {object} classSelector - Класс блока
 * @param {object} src - Путь до фото аватара
 * @return {void}
 */
var fillCardContentAvatar = function (card, classSelector, src) {
  var cardBlock = card.querySelector(classSelector);

  if (src) {
    cardBlock.src = src;
  } else {
    cardBlock.style.display = 'none';
  }
};

/**
 * Копируем вёрстку карточки объявления и задаём ей свои параметры
 * @param {object} offer - Элемент из массива с предложениями по сдаче недвижимости
 * @return {object} Карточка объявления
 */
var createPopup = function (offer) {
  var card = cardTemplate.cloneNode(true);

  fillCardContent(card, CardClass['TITLE'], offer.offer.title);
  fillCardContent(card, CardClass['ADDRESS'], offer.offer.address);
  fillCardContent(card, CardClass['PRICE'], offer.offer.price + '₽/ночь');
  fillCardContentType(card, CardClass['TYPE'], offer);
  fillCardContentCapacity(card, CardClass['CAPACITY'], offer);
  fillCardContentTime(card, CardClass['TIME'], offer);
  fillCardContentFeatures(card, CardClass['FEATURES'], offer);
  fillCardContent(card, CardClass['DESCRIPTION'], offer.offer.description);
  fillCardContentPhotos(card, CardClass['PHOTOS'], offer);
  fillCardContentAvatar(card, CardClass['AVATAR'], offer.author.avatar);

  return card;
};

/**
 * Формируем и вставляем вёрстку попапа - инфо о сдаваемом объекте
 * @param {object} offer - Массив с информацией по объявлениям
 * @return {void}
 */
var renderPopup = function (offer) {
  removeCardPopup();

  var fragment = document.createDocumentFragment();
  fragment.appendChild(createPopup(offer));
  map.appendChild(fragment);

  popupCloseButton = map.querySelector('.popup__close');

  addPopupListeners();
};

/**
 * Активирует карту и отрисовывает карточки предложений
 * @return {void}
 */
var activateOffers = function () {
  offers = createPins();
  renderPins(offers);
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

  addFormInputsListener();
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
    removeFormInputsListener();
    removeResetButtonListener();
    removePinsListeners();
  } else {
    isPageActive = true;
    activateOffers();
    addFormInputsListener();
    addResetButtonListener();
    removeMainPinListeners();
    addPinsListeners();
  }

  filterFormAddress.value = getPinCoordinates();
};

/**
 * Добавляем обработчик нажатия левой кнопки мыши на главный пин
 * @param {object} evt - Нажатие на кнопку
 * @return {void}
 */
var clickOnMainPin = function (evt) {
  if (evt.button === 0) {
    toggleActivatePage();
    evt.stopPropagation();
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
 * Удаляем возможность выбора в поле 'Количество мест' те варианты, которые не соответствуют выбранному кол-ву комнат
 * @return {void}
 */
var changeCapacityRange = function () {
  if (filterFormGuests.options.length) {
    [].forEach.call(filterFormGuests.options, function (item) {
      item.selected = (RoomsCapacity[filterFormRooms.value][0] === item.value) ? true : false;
      item.disabled = (RoomsCapacity[filterFormRooms.value].indexOf(item.value) >= 0) ? false : true;
    });
  }
};

/**
 * Устанавливаем свой текст на валидацию поля по количеству комнат
 * @return {void}
 */
var setCapacityValidation = function () {
  if (filterFormGuests.options.length) {
    if (RoomsCapacity[filterFormRooms.value].indexOf(filterFormGuests.value) < 0) {
      filterFormRooms.setCustomValidity(TEXT_CAPACITY_VALIDATE_ERROR);
    } else {
      filterFormRooms.setCustomValidity('');
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
 * Обработчик события при изменении поля "Заголовок объявления"
 * @param {object} evt - Событие изменения поля
 * @return {void}
 */
var onInputFormTitle = function (evt) {
  if (evt.target.value.length < MIN_TITLE_LENGTH) {
    evt.target.setCustomValidity('Заголовок должен состоять минимум из ' + MIN_TITLE_LENGTH + ' символов.');
  } else if (evt.target.value.length > MAX_TITLE_LENGTH) {
    evt.target.setCustomValidity('Заголовок должен состоять максимум из ' + MAX_TITLE_LENGTH + ' символов.');
  } else {
    evt.target.setCustomValidity('');
  }
};

/**
 * Обработчик события при изменении поля "Цена за ночь"
 * @param {object} evt - Событие изменения поля
 * @return {void}
 */
var onInputFormPrice = function (evt) {
  if (filterFormPrice.value > MAX_PRICE) {
    filterFormPrice.setCustomValidity('Максимальная цена за ночь - ' + MAX_PRICE + ' рублей.');
  } else if (filterFormPrice.value < MinPrice[filterFormType.value]) {
    evt.target.setCustomValidity('Минимальная цена за ночь на этот тип жилья - ' + MinPrice[filterFormType.value] + ' рублей.');
  }
};

/**
 * Обработчик события при изменении поля "Время заезда"
 * @param {object} evt - Событие изменения поля
 * @return {void}
 */
var onChangeFormTimein = function (evt) {
  filterFormTimeout.value = evt.target.value;
};

/**
 * Обработчик события при изменении поля "Время выезда"
 * @param {object} evt - Событие изменения поля
 * @return {void}
 */
var onChangeFormTimeout = function (evt) {
  filterFormTimein.value = evt.target.value;
};

/**
 * Вешаем обработчик события при изменении кол-ва комнат
 * @return {void}
 */
var addFormInputsListener = function () {
  filterFormRooms.addEventListener('change', onChangeFormRooms);

  filterFormTitle.addEventListener('input', onInputFormTitle);
  filterFormPrice.addEventListener('input', onInputFormPrice);
  filterFormType.addEventListener('change', onInputFormPrice);
  filterFormTimein.addEventListener('change', onChangeFormTimein);
  filterFormTimeout.addEventListener('change', onChangeFormTimeout);
};

/**
 * Удаляем обработчик события при изменении кол-ва комнат
 * @return {void}
 */
var removeFormInputsListener = function () {
  filterFormRooms.removeEventListener('change', onChangeFormRooms);

  filterFormTitle.removeEventListener('input', onInputFormTitle);
  filterFormPrice.removeEventListener('input', onInputFormPrice);
  filterFormType.removeEventListener('input', onInputFormPrice);
  filterFormTimein.removeEventListener('input', onChangeFormTimein);
  filterFormTimeout.removeEventListener('input', onChangeFormTimeout);
};

/**
 * Обработчик события при изменении кол-ва комнат
 * @return {void}
 */
var onPressResetButton = function () {
  filterForm.reset();
  filterFormAddress.value = getPinCoordinates();
  changeCapacityRange();
  setCapacityValidation();
  toggleActivatePage();
  removePins();
  removeCardPopup();
  addMainPinListeners();
  removeFormInputsListener();
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

/**
 * Обработчик события нажатия на пин объявления
 * @param {*} evt - Событие нажатия на пин
 * @return {void}
 */
var onPinClick = function (evt) {
  if (evt.target.parentElement.dataset.key) {
    renderPopup(offers[evt.target.parentElement.dataset.key]);
  }
};

/**
 * Обработчик события нажатия Enter на пин объявления
 * @param {*} evt - Событие нажатия на пин
 * @return {void}
 */
var onPinEnterPress = function (evt) {
  if (evt.key === ENTER_KEY) {
    renderPopup(offers[evt.target.dataset.key]);
  }
};

/**
 * Убираем попап
 * @param {*} evt - Событие нажатия на пин
 * @return {void}
 */
var closePopup = function () {
  removeCardPopup();
  removePopupListeners();
  addPinsListeners();
};

/**
 * Обработчик события нажатия ESC на попап объявления
 * @param {*} evt - Событие нажатия на пин
 * @return {void}
 */
var onPopupEscPress = function (evt) {
  if (evt.key === ESC_KEY) {
    closePopup();
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
 * Добавляем отслеживание нажатия клавиш на попап
 * @return {void}
 */
var addPopupListeners = function () {
  document.addEventListener('keydown', onPopupEscPress);
  popupCloseButton.addEventListener('click', onPopupClickClose);
};

/**
 * Удаляем отслеживание нажатия клавиш на попап
 * @return {void}
 */
var removePopupListeners = function () {
  document.removeEventListener('keydown', onPopupEscPress);
};

/**
 * Обработчик события нажатия мышкой на крестик попапа
 * @return {void}
 */
var onPopupClickClose = function () {
  closePopup();
};


filterFormAddress.value = getPinCoordinates();
addMainPinListeners();
changeCapacityRange();
setCapacityValidation();
toggleActivateInputs();
