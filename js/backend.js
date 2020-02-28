'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var SUCESS_STATUS = 200;
  var TIMEOUT = 5000;
  var RESPONSE_TYPE = 'json';
  var ERROR_MESSAGE = 'Произошла ошибка соединения с сервером';
  var TIMEOUT_MESSAGE = 'Запрос не успел выполнится за ';

  var INSERT_ELEMENT_STYLE = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red';
  var INSERT_ELEMENT_STYLE_POSITION = 'absolute';
  var INSERT_ELEMENT_LEFT = 0;
  var INSERT_ELEMENT_RIGHT = 0;
  var INSERT_ELEMENT_FONT_SIZE = '30px';
  var INSERT_ELEMENT_POSITION = 'afterbegin';

  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');


  /**
   * Рендерим сообщение об успешной отправке данных на сервер
   * @return {void}
   */
  var renderSuccessMessage = function () {
    var successElement = successTemplate.cloneNode(true);
    successElement.style = INSERT_ELEMENT_STYLE;
    successElement.style.position = INSERT_ELEMENT_STYLE_POSITION;
    successElement.style.left = INSERT_ELEMENT_LEFT;
    successElement.style.right = INSERT_ELEMENT_RIGHT;
    successElement.style.fontSize = INSERT_ELEMENT_FONT_SIZE;

    document.body.insertAdjacentElement(INSERT_ELEMENT_POSITION, successElement);
  };

  /**
   * Рендерим сообщение об ошибке при отправке данных на сервер
   * @return {void}
   */
  var renderErrorMessage = function () {
    var errorElement = errorTemplate.cloneNode(true);
  };

  /**
   * Создаём сообщение при таймауте
   * @param {object} xhr - Объект XMLHTTPRequest
   * @return {string}
   */
  var createTimeoutMessage = function (xhr) {
    return TIMEOUT_MESSAGE + xhr.timeout + 'мс';
  };

  /**
   * Действия при удачной загрузки данных с сервера
   * @param {object} xhr - Объект XMLHttpRequest
   * @param {object} onError - Функция отрисовки сообщения об ошибке для пользователя
   * @param {object} onSuccess - Функция,срабатывающая при загрузке без ошибок
   * @return {void}
   */
  var onServerLoad = function (xhr, onError, onSuccess) {
    return function () {
      if (xhr.status === SUCESS_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    };
  };

  /**
   * Действия при ошибке загрузки данных с сервера
   * @param {object} onError - Функция отрисовки сообщения об ошибке для пользователя
   * @return {void}
   */
  var onServerError = function (onError) {
    return function () {
      onError(ERROR_MESSAGE);
    };
  };

  /**
   * Действия при таймауте загрузки данных с сервера
   * @param {object} xhr - Объект XMLHttpRequest
   * @param {object} onError - Функция отрисовки сообщения об ошибке для пользователя
   * @return {void}
   */
  var onServerTimeout = function (xhr, onError) {
    return function () {
      onError(createTimeoutMessage(xhr));
    };
  };

  /**
   * Загружаем данные с предложениями по недвижимости с сервера
   * @param {object} onError - Функция, которая срабатывает при ошибке загрузки данных с сервера
   * @param {object} onSuccess - Функция, которая срабатывает при успешной загрузке данных с сервера
   * @return {void}
   */
  var loadOffers = function (onError, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = RESPONSE_TYPE;
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', onServerLoad(xhr, onError, onSuccess), {
      once: true
    });
    xhr.addEventListener('error', onServerError(onError), {
      once: true
    });
    xhr.addEventListener('timeout', onServerTimeout(xhr, onError), {
      once: true
    });

    xhr.open('GET', URL_LOAD);
    xhr.send();
  };

  /**
   * Отправляем данные с фильтра объявлений на сервер
   * @param {object} data - Данные, которые загружаем на сервер
   * @param {object} onSuccess - Функция, которая срабатывает при успешной отправке данных на сервер
   * @return {void}
   */
  var uploadOffer = function (data, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responeType = RESPONSE_TYPE;
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', onSuccess(), {
      once: true
    });

    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);
  };


  window.backend = {
    loadOffers: loadOffers,
    uploadOffer: uploadOffer
  };
})();
