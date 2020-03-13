'use strict';

(function () {
  var MAP_X_MIN = 0;
  var MAP_X_MAX = 1200;
  var MAP_Y_MIN = 130;
  var MAP_Y_MAX = 630;


  /**
   * Отключаем/включаем взаимодействие с картой
   * @return {void}
   */
  var toggleActivateMap = function () {
    window.config.map.classList.toggle('map--faded');
  };

  window.map = {
    toggleActivateMap: toggleActivateMap,
    MAP_Y_MIN: MAP_Y_MIN,
    MAP_Y_MAX: MAP_Y_MAX,
    MAP_X_MIN: MAP_X_MIN,
    MAP_X_MAX: MAP_X_MAX
  };

})();
