'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var SUCESS_STATUS = 200;
  var TIMEOUT = 5000;
  var RESPONSE_TYPE = 'json';
  var ERROR_MESSAGE = 'Произошла ошибка соединения с сервером';
  var TIMEOUT_MESSAGE = 'Запрос не успел выполнится за ';

  /**
   * Создаём сообщение при таймауте
   * @param {object} xhr - Объект XMLHTTPRequest
   * @return {string}
   */
  var createTimeoutMessage = function (xhr) {
    return TIMEOUT_MESSAGE + xhr.timeout + 'мс';
  };

  /**
   * Действия при удачной загрузки с сервера
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
   * Действия при ошибке сервера
   * @param {object} onError - Функция отрисовки сообщения об ошибке для пользователя
   * @return {void}
   */
  var onServerError = function (onError) {
    return function () {
      onError(ERROR_MESSAGE);
    };
  };

  /**
   * Действия при таймауте от сервера
   * @param {object} xhr - Объект XMLHttpRequest
   * @param {object} onError - Функция отрисовки сообщения об ошибке для пользователя
   * @return {void}
   */
  var onServerTimeout = function (xhr, onError) {
    return function () {
      onError(createTimeoutMessage(xhr));
    };
  };

  var loadOffers = function (onError, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = RESPONSE_TYPE;
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', onServerLoad(xhr, onError, onSuccess));
    xhr.addEventListener('error', onServerError(onError));
    xhr.addEventListener('timeout', onServerTimeout(xhr, onError));

    xhr.open('GET', URL_LOAD);
    xhr.send();
  };

  window.backend = {
    loadOffers: loadOffers
  };
})();
