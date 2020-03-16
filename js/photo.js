'use strict';

(function () {
  var OFFER_PREVIEW_SRC = 'img/muffin-grey.svg';

  var avatarFileChooser = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var offerFileChooser = document.querySelector('.ad-form__upload input[type=file]');
  var offerPreview = document.querySelector('.ad-form__photo img');


  /**
   * При выборе фото размещаем ее в нужном месте
   * @param {object} fileChooser - Элемент выбора файла
   * @param {object} preview - Элемент для отображения выбранного фото
   * @return {void}
   */
  var onPhotoChange = function (fileChooser, preview) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = window.const.PHOTO_FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  /**
   * Переключатель отслеживания загрузки фотографий пользователя и оффера
   * @param {string} handler - Название поля объекта
   * @return {void}
   */
  var togglePhotoListener = function (handler) {
    avatarFileChooser[handler]('change', function () {
      onPhotoChange(avatarFileChooser, avatarPreview);
    });
    offerFileChooser[handler]('change', function () {
      onPhotoChange(offerFileChooser, offerPreview);
    });
  };

  /**
   * Возвращаем путь до фото оффера в первоначальное состояние
   * @return {void}
   */
  var resetPhoto = function () {
    offerPreview.src = OFFER_PREVIEW_SRC;
  };


  window.photo = {
    togglePhotoListener: togglePhotoListener,
    resetPhoto: resetPhoto
  };
})();
