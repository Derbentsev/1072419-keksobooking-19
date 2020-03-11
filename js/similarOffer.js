'use strict';

(function () {
  /**
   * Сортируем массив предложений
   * @return {object} Отсортированный массив предложений
   */
  var filterOffers = function () {
    var filteredOffers = [];

    for (var i = 0; i < window.pins.offers.length; i++) {
      if (filteredOffers.length > window.const.PINS_COUNT) {
        break;
      }

      if (window.pins.offers[i].offer.type === window.form.filtersType.value) {
        filteredOffers.push(window.pins.offers[i]);
      }
    }

    return filteredOffers;
  };

  window.similarOffer = {
    filterOffers: filterOffers
  };
})();
