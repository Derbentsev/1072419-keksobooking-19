var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var ads = [];

/**
 * Определяем случайное целое число
 * @param {number} max - Максимальное целое число
 * @return {number} Случайное целое число
 */
var randomNumber = function (max) {
    return Math.round(Math.random() + max);
};

/**
 * Создаём массив из 8 объектов-объявлений
 * @return {void}
 */
var createAds = function () {
    ads.push(
        {
        'author': {
        'avatar': 'img/avatars/0' + randomNumber(8) + '.png' 'Адреса изображений не повторяются'
        },
        'offer': {
        'title': 'Объявление',
        'address': строка, адрес предложения. Для простоты пусть пока представляет собой запись вида '{{location.x}}, {{location.y}}', например, '600, 350',
        'price': [randomNumber(10000)],
        'type': OFFER_TYPE[randomNumber(3)],
        'rooms': randomNumber(4),
        'guests': randomNumber(5),
        'checkin': CHECK_TIME[randomNumber(2)],
        'checkout': CHECK_TIME[randomNumber(2)],
        'features': OFFER_FEATURES[randomNumber(5)],
        'description': "строка с описанием",
        'photos': OFFER_PHOTOS[2]
        },
    
        'location': {
        'x': случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
        'y': случайное число, координата y метки на карте от 130 до 630.
        }
    }
    )
}
