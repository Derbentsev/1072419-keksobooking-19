'use strict';

(function () {
  /**
   * Фильтруем массив предложений
   * @return {object} Отсортированный массив предложений
   */
  var filterOffers = function () {
    var price = {
      'low': {
        minPrice: 0,
        maxPrice: 9999
      },
      'middle': {
        minPrice: 10000,
        maxPrice: 49999
      },
      'high': {
        minPrice: 50000,
        maxPrice: 10000000000000
      }
    };

    var filteredOffers = [];

    var filterFeatures = window.form.filterFeaturesFieldset.querySelectorAll('input[type = "checkbox"]:checked');


    for (var i = 0; i < window.pins.offers.length; i++) {
      var isHaveFeatures = true;

      if (filteredOffers.length >= window.const.PINS_COUNT) {
        break;
      }

      if ((window.form.filtersType.value === 'any' ||
          window.pins.offers[i].offer.type === window.form.filtersType.value) &&
        (window.form.filterPrice.value === 'any' ||
          window.pins.offers[i].offer.price >= price[window.form.filterPrice.value].minPrice &&
          window.pins.offers[i].offer.price <= price[window.form.filterPrice.value].maxPrice) &&
        (window.form.filterRooms.value === 'any' ||
          window.pins.offers[i].offer.rooms.toString() === window.form.filterRooms.value.toString()) &&
        (window.form.filterGuests.value === 'any' ||
          window.pins.offers[i].offer.guests.toString() === window.form.filterGuests.value.toString())) {

        filterFeatures.forEach(function (item) {
          if (!window.pins.offers[i].offer.features.includes(item.value)) {
            isHaveFeatures = false;
          }
        });

        if (isHaveFeatures) {
          filteredOffers.push(window.pins.offers[i]);
        }
      }
    }

    return filteredOffers;
  };


  window.similarOffer = {
    filterOffers: filterOffers
  };
})();
