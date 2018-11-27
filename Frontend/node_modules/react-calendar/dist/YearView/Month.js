'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Tile = require('../Tile');

var _Tile2 = _interopRequireDefault(_Tile);

var _dates = require('../shared/dates');

var _dateFormatter = require('../shared/dateFormatter');

var _propTypes3 = require('../shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var className = 'react-calendar__year-view__months__month';

var Month = function Month(_ref) {
  var classes = _ref.classes,
      date = _ref.date,
      formatMonth = _ref.formatMonth,
      locale = _ref.locale,
      otherProps = _objectWithoutProperties(_ref, ['classes', 'date', 'formatMonth', 'locale']);

  return _react2.default.createElement(
    _Tile2.default,
    _extends({}, otherProps, {
      classes: [].concat(_toConsumableArray(classes), [className]),
      date: date,
      dateTime: (0, _dates.getISOLocalMonth)(date) + 'T00:00:00.000',
      maxDateTransform: _dates.getEndOfMonth,
      minDateTransform: _dates.getBeginOfMonth,
      view: 'year'
    }),
    formatMonth(date, locale)
  );
};

Month.defaultProps = {
  formatMonth: _dateFormatter.formatMonth
};

Month.propTypes = _extends({}, _propTypes3.tileProps, {
  formatMonth: _propTypes2.default.func,
  locale: _propTypes2.default.string
});

exports.default = Month;