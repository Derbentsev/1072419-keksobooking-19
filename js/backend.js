'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';

  /**
   * Действия при удачной загрузки с сервера
   * @param {object} xhr - Объект XMLHttpRequest
   * @param {object} onError - Функция отрисовки сообщения об ошибке для пользователя
   * @param {object} onSuccess - Функция,срабатывающая при загрузке без ошибок
   * @return {void}
   */
  var onServerLoad = function (xhr, onError, onSuccess) {
    return function () {
      if (xhr.status === 200) {
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
      onError('Произошла ошибка соединения с сервером');
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
      onError('Запрос не успел выполнится за ' + xhr.timeout + 'мс');
    };
  };

  var loadOffers = function (onError, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 5000;

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
