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
    return function () {
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
  };

  /**
   * Вешаем обработчики события изменения фото
   * @return {void}
   */
  var addPhotoListener = function () {
    avatarFileChooser.addEventListener('change', onPhotoChange(avatarFileChooser, avatarPreview));
    offerFileChooser.addEventListener('change', onPhotoChange(offerFileChooser, offerPreview));
  };

  /**
   * Удаляем обработчики события изменения фото
   * @return {void}
   */
  var removePhotoListener = function () {
    avatarFileChooser.removeEventListener('change', onPhotoChange(avatarFileChooser, avatarPreview));
    offerFileChooser.removeEventListener('change', onPhotoChange(offerFileChooser, offerPreview));
  };

  /**
   * 
   */
  var resetPhoto = function() {
    offerPreview.src = OFFER_PREVIEW_SRC;
  };


  window.photo = {
    addPhotoListener: addPhotoListener,
    removePhotoListener: removePhotoListener,
    resetPhoto: resetPhoto
  };
})();
