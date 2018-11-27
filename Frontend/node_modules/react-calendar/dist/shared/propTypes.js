'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tileProps = exports.tileGroupProps = exports.isView = exports.isClassName = exports.isViews = exports.isValue = exports.isMaxDate = exports.isMinDate = exports.isCalendarType = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var calendarTypes = ['ISO 8601', 'US', 'Arabic', 'Hebrew'];
var allViews = ['century', 'decade', 'year', 'month'];

var isCalendarType = exports.isCalendarType = _propTypes2.default.oneOf(calendarTypes);

var isMinDate = exports.isMinDate = function isMinDate(props, propName, componentName) {
  var minDate = props[propName];


  if (minDate) {
    if (!(minDate instanceof Date)) {
      return new Error('Invalid prop `' + propName + '` of type `' + (typeof minDate === 'undefined' ? 'undefined' : _typeof(minDate)) + '` supplied to `' + componentName + '`, expected instance of `Date`.');
    }

    var maxDate = props.maxDate;


    if (maxDate && minDate > maxDate) {
      return new Error('Invalid prop `' + propName + '` of type `' + (typeof minDate === 'undefined' ? 'undefined' : _typeof(minDate)) + '` supplied to `' + componentName + '`, minDate cannot be larger than maxDate.');
    }
  }

  // Everything is fine
  return null;
};

var isMaxDate = exports.isMaxDate = function isMaxDate(props, propName, componentName) {
  var maxDate = props[propName];


  if (maxDate) {
    if (!(maxDate instanceof Date)) {
      return new Error('Invalid prop `' + propName + '` of type `' + (typeof maxDate === 'undefined' ? 'undefined' : _typeof(maxDate)) + '` supplied to `' + componentName + '`, expected instance of `Date`.');
    }

    var minDate = props.minDate;


    if (minDate && maxDate < minDate) {
      return new Error('Invalid prop `' + propName + '` of type `' + (typeof maxDate === 'undefined' ? 'undefined' : _typeof(maxDate)) + '` supplied to `' + componentName + '`, maxDate cannot be smaller than minDate.');
    }
  }

  // Everything is fine
  return null;
};

var isValue = exports.isValue = _propTypes2.default.oneOfType([_propTypes2.default.instanceOf(Date), _propTypes2.default.arrayOf(_propTypes2.default.instanceOf(Date))]);

var isViews = exports.isViews = _propTypes2.default.arrayOf(_propTypes2.default.oneOf(allViews));

var isClassName = exports.isClassName = _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]);

var isView = exports.isView = function isView(props, propName, componentName) {
  var view = props[propName];
  var views = props.views;


  var allowedViews = views || allViews;

  if (allowedViews.indexOf(view) === -1) {
    return new Error('Invalid prop `' + propName + '` of value `' + view + '` supplied to `' + componentName + '`, expected one of [' + ['a', 'b', 'c', 'd', 'e'].map(function (a) {
      return '"' + a + '"';
    }).join(', ') + '].');
  }

  // Everything is fine
  return null;
};

isView.isRequired = function (props, propName, componentName) {
  var view = props[propName];


  if (!view) {
    return new Error('The prop `' + propName + '` is marked as required in `' + componentName + '`, but its value is `' + view + '`.');
  }

  return isView(props, propName, componentName);
};

var tileGroupProps = exports.tileGroupProps = {
  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
  hover: _propTypes2.default.instanceOf(Date),
  maxDate: isMaxDate,
  minDate: isMinDate,
  onClick: _propTypes2.default.func,
  onMouseOver: _propTypes2.default.func,
  tileClassName: _propTypes2.default.oneOfType([_propTypes2.default.func, isClassName]),
  tileContent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]),
  value: isValue,
  valueType: _propTypes2.default.string
};

var tileProps = exports.tileProps = {
  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
  classes: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
  date: _propTypes2.default.instanceOf(Date).isRequired,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onClick: _propTypes2.default.func,
  onMouseOver: _propTypes2.default.func,
  style: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])),
  tileClassName: _propTypes2.default.oneOfType([_propTypes2.default.func, isClassName]),
  tileContent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]),
  tileDisabled: _propTypes2.default.func
};