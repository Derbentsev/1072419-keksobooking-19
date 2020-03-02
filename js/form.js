'use strict';

(function () {
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
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

  var filtersSection = document.querySelector('.notice');
  var resetButton = filtersSection.querySelector('.ad-form__reset');

  var fieldsets = document.querySelectorAll('fieldset');
  var filterForm = filtersSection.querySelector('.ad-form');
  var filterFormAddress = filtersSection.querySelector('#address');
  var filterFormRooms = filtersSection.querySelector('#room_number');
  var filterFormGuests = filtersSection.querySelector('#capacity');
  var filterFormTitle = filterForm.querySelector('#title');
  var filterFormPrice = filterForm.querySelector('#price');
  var filterFormType = filterForm.querySelector('#type');
  var filterFormTimein = filterForm.querySelector('#timein');
  var filterFormTimeout = filterForm.querySelector('#timeout');

  var documentMain = document.querySelector('main');

  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');


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
    filterForm.classList.toggle('ad-form--disabled');
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
        filterFormRooms.setCustomValidity(TEXT_CAPACITY_ERROR);
      } else {
        filterFormRooms.setCustomValidity('');
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
    filterFormPrice.placeholder = MinPrice[filterFormType.value.toUpperCase()];
  };

  /**
   * Обработчик события при изменении поля "Цена за ночь" и "Тип жилья"
   * @return {void}
   */
  var onInputFormPrice = function () {
    changePricePlaceholder();

    if (filterFormPrice.value > window.const.MAX_PRICE) {
      filterFormPrice.setCustomValidity('Максимальная цена за ночь - ' + window.const.MAX_PRICE + ' рублей.');
    } else if (filterFormPrice.value < MinPrice[filterFormType.value.toUpperCase()]) {
      filterFormPrice.setCustomValidity('Минимальная цена за ночь на этот тип жилья - ' + MinPrice[filterFormType.value.toUpperCase()] + ' рублей.');
    } else {
      filterFormPrice.setCustomValidity('');
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
   * Резет формы и карты
   * @return {void}
   */
  var resetPage = function () {
    filterForm.reset();
    filterFormAddress.value = window.pinMain.getPinCoordinates();
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
    window.backend.uploadOffer(new FormData(filterForm), onSuccessLoadForm, onErrorLoadForm);
  };


  window.form = {
    filterFormAddress: filterFormAddress,
    addResetButtonListener: addResetButtonListener,
    removeResetButtonListener: removeResetButtonListener,
    toggleActivateInputs: toggleActivateInputs,
    changePricePlaceholder: changePricePlaceholder,
    removeFormInputsListener: removeFormInputsListener,
    addFormInputsListener: addFormInputsListener,
    toggleActivateForm: toggleActivateForm
  };

  filterFormAddress.value = window.pinMain.getPinCoordinates();
  changeCapacityRange();
  setCapacityValidation();
  toggleActivateInputs();

  filterForm.addEventListener('submit', onFormSubmit);
})();
