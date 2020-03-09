'use strict';

(function () {
  /**
   * Сортируем массив предложений
   * @return {object} Отсортированный массив предложений
   */
  var filterOffers = function () {
    var filteredOffers = window.pins.offers.filter(function (offer) {
      return offer.offer.type === window.form.filterFormType.value;
    });

    return filteredOffers;
  };

  window.similarOffer = {
    filterOffers: filterOffers
  };
})();
