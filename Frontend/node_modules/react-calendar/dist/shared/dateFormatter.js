'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatShortWeekday = exports.formatMonth = exports.formatMonthYear = exports.formatDate = undefined;

var _getUserLocale = require('get-user-locale');

var _getUserLocale2 = _interopRequireDefault(_getUserLocale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formatterCache = {};

/**
 * Gets Intl-based date formatter from formatter cache. If it doesn't exist in cache
 * just yet, it will be created on the fly.
 */
var getFormatter = function getFormatter(options, locale) {
  if (!locale) {
    // Default parameter is not enough as it does not protect us from null values
    // eslint-disable-next-line no-param-reassign
    locale = (0, _getUserLocale2.default)();
  }

  var stringifiedOptions = JSON.stringify(options);

  if (!formatterCache[locale]) {
    formatterCache[locale] = {};
  }

  if (!formatterCache[locale][stringifiedOptions]) {
    formatterCache[locale][stringifiedOptions] = new Intl.DateTimeFormat(locale, options).format;
  }

  return formatterCache[locale][stringifiedOptions];
};

/**
 * Changes the hour in a Date to ensure right date formatting even if DST is messed up.
 * Workaround for bug in WebKit and Firefox with historical dates.
 * For more details, see:
 * https://bugs.chromium.org/p/chromium/issues/detail?id=750465
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1385643
 *
 * @param {Date} date Date.
 */
var toSafeHour = function toSafeHour(date) {
  var safeDate = new Date(date);
  return new Date(safeDate.setHours(12));
};

var formatDate = exports.formatDate = function formatDate(date, locale) {
  return getFormatter({ day: 'numeric', month: 'numeric', year: 'numeric' }, locale)(toSafeHour(date));
};

var formatMonthYear = exports.formatMonthYear = function formatMonthYear(date, locale) {
  return getFormatter({ month: 'long', year: 'numeric' }, locale)(toSafeHour(date));
};

var formatMonth = exports.formatMonth = function formatMonth(date, locale) {
  return getFormatter({ month: 'long' }, locale)(toSafeHour(date));
};

var formatShortWeekday = exports.formatShortWeekday = function formatShortWeekday(date, locale) {
  return getFormatter({ weekday: 'short' }, locale)(toSafeHour(date));
};