'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
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
   * @param {object} onError - Функция, которая срабатывает при НЕуспешной отправке данных на сервер
   * @return {void}
   */
  var uploadOffer = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responeType = RESPONSE_TYPE;
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', onSuccess, {
      once: true
    });
    xhr.addEventListener('error', onError, {
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
