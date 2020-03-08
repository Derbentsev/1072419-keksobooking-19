'use strict';

(function () {
  var offerRank = {
    TYPE: 1
  };


  /**
   * Определяем ранг предложения о сдаче
   * @param {object} offer - Предложение о сдаче
   * @return {number} Ранг(вес) предложения о сдаче при сортировке
   */
  var getRank = function (offer) {
    var rank = 0;

    if (offer.offer.type === window.form.filterFormType.value) {
      rank += offerRank.TYPE;
    }

    return rank;
  };

  /**
   * Сортируем массив предложений
   * @return {object} Отсортированный массив предложений
   */
  var sortedOffers = function () {
    var sortedOffers = window.pins.offers.sort(function (offer1, offer2) {
      var rankDiff = getRank(offer2) - getRank(offer1);
      return rankDiff;
    });

    window.pins.renderPins(sortedOffers);

    return sortedOffers;
  };

  window.similarOffer = {
    filteredOffers: sortedOffers,
    filterOffers: sortedOffers
  };
})();
