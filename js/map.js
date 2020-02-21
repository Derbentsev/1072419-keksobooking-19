'use strict';

(function () {
  /**
   * Отключаем/включаем взаимодействие с картой
   * @return {void}
   */
  var toggleActivateMap = function () {
    window.var.map.classList.toggle('map--faded');
  };

  window.map = {
    toggleActivateMap: toggleActivateMap
  };

})();
