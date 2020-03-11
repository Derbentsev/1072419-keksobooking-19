'use strict';

(function () {
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
  var DEBOUNCE_TIME = 500;

  var ESC_KEY = 'Escape';
  var TEXT_CAPACITY_ERROR = 'К сожалению, вы тут не поместитесь(. Пожалуйста, выберите другое кол-во комнат';
  var INSERT_ELEMENT_POSITION = 'afterbegin';

  var RoomsCapacity = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var MinPrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var fieldsets = document.querySelectorAll('fieldset');

  var filters = document.querySelector('.map__filters-container form');
  var filtersType = filters.querySelector('#housing-type');
  var filterPrice = filters.querySelector('#housing-price');
  var filterRooms = filters.querySelector('#housing-rooms');
  var filterGuests = filters.querySelector('#housing-guests');
  var filterFeaturesFieldset = filters.querySelector('#housing-features');
  var filterFeatures = filterFeaturesFieldset.querySelectorAll('input[type = "checkbox"]');

  var filtersSection = document.querySelector('.notice');
  var resetButton = filtersSection.querySelector('.ad-form__reset');
  var offerForm = filtersSection.querySelector('.ad-form');
  var offerFormAddress = filtersSection.querySelector('#address');
  var offerFormRooms = filtersSection.querySelector('#room_number');
  var offerFormGuests = filtersSection.querySelector('#capacity');
  var offerFormTitle = offerForm.querySelector('#title');
  var offerFormPrice = offerForm.querySelector('#price');
  var offerFormType = offerForm.querySelector('#type');
  var offerFormTimein = offerForm.querySelector('#timein');
  var offerFormTimeout = offerForm.querySelector('#timeout');

  var documentMain = document.querySelector('main');

  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var lastTimeout;


  /**
   * Удаляем элемент из вёрстки
   * @param {object} element - Нода удаляемого элемента
   * @return {void}
   */
  var elementRemove = function (element) {
    element.remove();
  };

  /**
   * При клике на окне удаляем сообщение о статусе отправки данных
   * @param {object} element - Нода удаляемого элемента
   * @return {void}
   */
  var onDocumentClick = function (element) {
    return function () {
      elementRemove(element);
    };
  };

  /**
   * При нажатии на ESC удаляем сообщение о статусе отправки данных
   * @param {object} element - Нода удаляемого элемента
   * @return {void}
   */
  var onDocumentKeydown = function (element) {
    return function (evt) {
      if (evt.key === ESC_KEY) {
        elementRemove(element);
      }
    };
  };

  /**
   * Рендерим сообщение об успешной отправке данных на сервер
   * @return {void}
   */
  var renderSuccessMessage = function () {
    var successElement = successTemplate.cloneNode(true);
    document.body.insertAdjacentElement(INSERT_ELEMENT_POSITION, successElement);

    document.addEventListener('click', onDocumentClick(successElement), {
      once: true
    });
    document.addEventListener('keydown', onDocumentKeydown(successElement), {
      once: true
    });
  };

  /**
   * Рендерим сообщение об ошибке при отправке данных на сервер
   * @return {void}
   */
  var renderErrorMessage = function () {
    var errorElement = errorTemplate.cloneNode(true);
    documentMain.insertAdjacentElement(INSERT_ELEMENT_POSITION, errorElement);

    document.addEventListener('click', onDocumentClick(errorElement), {
      once: true
    });
    document.addEventListener('keydown', onDocumentKeydown(errorElement), {
      once: true
    });
  };

  /**
   * Отключаем/включаем взаимодействие с формой
   * @return {void}
   */
  var toggleActivateForm = function () {
    offerForm.classList.toggle('ad-form--disabled');
  };

  /**
   * Удаляем возможность выбора в поле 'Количество мест' те варианты, которые не соответствуют выбранному кол-ву комнат
   * @return {void}
   */
  var changeCapacityRange = function () {
    if (offerFormGuests.options.length) {
      [].forEach.call(offerFormGuests.options, function (item) {
        item.selected = (RoomsCapacity[offerFormRooms.value][0] === item.value) ? true : false;
        item.disabled = (RoomsCapacity[offerFormRooms.value].indexOf(item.value) >= 0) ? false : true;
      });
    }
  };

  /**
   * Устанавливаем свой текст на валидацию поля по количеству комнат
   * @return {void}
   */
  var setCapacityValidation = function () {
    if (offerFormGuests.options.length) {
      if (RoomsCapacity[offerFormRooms.value].indexOf(offerFormGuests.value) < 0) {
        offerFormRooms.setCustomValidity(TEXT_CAPACITY_ERROR);
      } else {
        offerFormRooms.setCustomValidity('');
      }
    }
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
   * Изменяем плейсхолдер минимальной цены, исходя из типа жилья
   * @return {void}
   */
  var changePricePlaceholder = function () {
    offerFormPrice.placeholder = MinPrice[offerFormType.value.toUpperCase()];
  };

  /**
   * Обработчик события при изменении поля "Цена за ночь" и "Тип жилья"
   * @return {void}
   */
  var onInputFormPrice = function () {
    changePricePlaceholder();

    if (offerFormPrice.value > window.const.MAX_PRICE) {
      offerFormPrice.setCustomValidity('Максимальная цена за ночь - ' + window.const.MAX_PRICE + ' рублей.');
    } else if (offerFormPrice.value < MinPrice[offerFormType.value.toUpperCase()]) {
      offerFormPrice.setCustomValidity('Минимальная цена за ночь на этот тип жилья - ' + MinPrice[offerFormType.value.toUpperCase()] + ' рублей.');
    } else {
      offerFormPrice.setCustomValidity('');
    }

    window.form.offerFormType = offerFormType;
  };

  /**
   * Обработчик события при изменении поля "Время заезда"
   * @param {object} evt - Событие изменения поля
   * @return {void}
   */
  var onChangeFormTimein = function (evt) {
    offerFormTimeout.value = evt.target.value;
  };

  /**
   * Обработчик события при изменении поля "Время выезда"
   * @param {object} evt - Событие изменения поля
   * @return {void}
   */
  var onChangeFormTimeout = function (evt) {
    offerFormTimein.value = evt.target.value;
  };

  /**
   * Резет формы и карты
   * @return {void}
   */
  var resetPage = function () {
    offerForm.reset();
    offerFormAddress.value = window.pinMain.getPinCoordinates();
    changeCapacityRange();
    setCapacityValidation();
    window.page.toggleActivatePage();
    window.pins.removePins();
    window.popup.removeCardPopup();
    window.pinMain.addMainPinListeners();
    removeFormInputsListener();
  };

  /**
   * Обработчик события при нажатии на кнопку "Очистить"
   * @return {void}
   */
  var onPressResetButton = function () {
    resetPage();
  };

  /**
   * Обработчик события корректной отправки формы
   * @return {void}
   */
  var onSuccessLoadForm = function () {
    resetPage();
    renderSuccessMessage();
  };

  /**
   * Обработчик события НЕкорректной отправки формы
   * @return {void}
   */
  var onErrorLoadForm = function () {
    renderErrorMessage();
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
   * Обработчик события изменения фильтров
   * @return {void}
   */
  var onChangeForm = function () {
    window.popup.closePopup();

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(function () {
      var filteredOffers = window.similarOffer.filterOffers();
      window.pins.renderPins(filteredOffers);
    }, DEBOUNCE_TIME);
  };

  /**
   * Вешаем обработчики события на изменения полей Вашего объявления
   * @return {void}
   */
  var addFormInputsListener = function () {
    filters.addEventListener('change', onChangeForm);
    offerFormRooms.addEventListener('change', onChangeFormRooms);
    offerFormTitle.addEventListener('input', onInputFormTitle);
    offerFormPrice.addEventListener('input', onInputFormPrice);
    offerFormType.addEventListener('change', onInputFormPrice);
    offerFormTimein.addEventListener('change', onChangeFormTimein);
    offerFormTimeout.addEventListener('change', onChangeFormTimeout);
  };

  /**
   * Удаляем обработчики события на изменения полей Вашего объявления
   * @return {void}
   */
  var removeFormInputsListener = function () {
    filters.removeEventListener('change', onChangeForm);
    offerFormRooms.removeEventListener('change', onChangeFormRooms);
    offerFormTitle.removeEventListener('input', onInputFormTitle);
    offerFormPrice.removeEventListener('input', onInputFormPrice);
    offerFormType.removeEventListener('input', onInputFormPrice);
    offerFormTimein.removeEventListener('input', onChangeFormTimein);
    offerFormTimeout.removeEventListener('input', onChangeFormTimeout);
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
   * Выполняем отправку данных на сервер
   * @param {object} evt - Событие отправки формы
   * @return {void}
   */
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.uploadOffer(new FormData(offerForm), onSuccessLoadForm, onErrorLoadForm);
  };


  window.form = {
    offerFormAddress: offerFormAddress,
    addResetButtonListener: addResetButtonListener,
    removeResetButtonListener: removeResetButtonListener,
    toggleActivateInputs: toggleActivateInputs,
    changePricePlaceholder: changePricePlaceholder,
    removeFormInputsListener: removeFormInputsListener,
    addFormInputsListener: addFormInputsListener,
    toggleActivateForm: toggleActivateForm,
    filtersType: filtersType,
    filterPrice: filterPrice,
    filterRooms: filterRooms,
    filterGuests: filterGuests,
    filterFeaturesFieldset: filterFeaturesFieldset,
    filterFeatures: filterFeatures
  };

  offerFormAddress.value = window.pinMain.getPinCoordinates();
  changeCapacityRange();
  setCapacityValidation();
  toggleActivateInputs();
  offerForm.addEventListener('submit', onFormSubmit);
})();
