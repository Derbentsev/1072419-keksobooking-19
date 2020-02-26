'use strict';

(function () {
  var ESC_KEY = 'Escape';

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

  var HouseType = {
    FLAT: 'Квартира',
    BUNGALO: 'Бунгало',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };

  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  var popupCloseButton;

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

    if (item.offer.photos && item.offer.photos.length > 0) {
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

    if (item.offer.features && item.offer.features.length > 0) {
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
   * Убираем попап
   * @param {*} evt - Событие
   * @return {void}
   */
  var closePopup = function () {
    removeCardPopup();
    removePopupListeners();
    window.pins.addPinsListeners();
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
   * Обработчик события нажатия мышкой на крестик попапа
   * @return {void}
   */
  var onPopupClickClose = function () {
    closePopup();
  };

  /**
   * Удаляем попап карточки объявления
   * @return {void}
   */
  var removeCardPopup = function () {
    window.config.map.querySelectorAll('.popup').forEach(function (item) {
      item.remove();
    });
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
   * Формируем и вставляем вёрстку попапа - инфо о сдаваемом объекте
   * @param {object} offer - Массив с информацией по объявлениям
   * @return {void}
   */
  var renderPopup = function (offer) {
    removeCardPopup();

    var fragment = document.createDocumentFragment();
    fragment.appendChild(createPopup(offer));
    window.config.map.appendChild(fragment);

    popupCloseButton = window.config.map.querySelector('.popup__close');

    addPopupListeners();
  };

  window.popup = {
    removeCardPopup: removeCardPopup,
    renderPopup: renderPopup
  };
})();
