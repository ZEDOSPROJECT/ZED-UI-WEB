'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TileGroup = require('../TileGroup');

var _TileGroup2 = _interopRequireDefault(_TileGroup);

var _Day = require('./Day');

var _Day2 = _interopRequireDefault(_Day);

var _dates = require('../shared/dates');

var _propTypes3 = require('../shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Days = function (_PureComponent) {
  _inherits(Days, _PureComponent);

  function Days() {
    _classCallCheck(this, Days);

    return _possibleConstructorReturn(this, (Days.__proto__ || Object.getPrototypeOf(Days)).apply(this, arguments));
  }

  _createClass(Days, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var monthIndex = this.monthIndex;

      var _props = this.props,
          showNeighboringMonth = _props.showNeighboringMonth,
          otherProps = _objectWithoutProperties(_props, ['showNeighboringMonth']);

      return _react2.default.createElement(_TileGroup2.default, _extends({}, otherProps, {
        className: 'react-calendar__month-view__days',
        count: 7,
        dateTransform: function dateTransform(day) {
          return new Date(_this2.year, monthIndex, day);
        },
        dateType: 'day',
        end: this.end,
        offset: this.offset,
        start: this.start,
        tile: _Day2.default
        // Tile props
        , currentMonthIndex: monthIndex
      }));
    }
  }, {
    key: 'offset',
    get: function get() {
      var _props2 = this.props,
          showFixedNumberOfWeeks = _props2.showFixedNumberOfWeeks,
          showNeighboringMonth = _props2.showNeighboringMonth;


      if (showFixedNumberOfWeeks || showNeighboringMonth) {
        return 0;
      }

      var _props3 = this.props,
          activeStartDate = _props3.activeStartDate,
          calendarType = _props3.calendarType;


      return (0, _dates.getDayOfWeek)(activeStartDate, calendarType);
    }

    /**
     * Defines on which day of the month the grid shall start. If we simply show current
     * month, we obviously start on day one, but if showNeighboringMonth is set to
     * true, we need to find the beginning of the week the first day of the month is in.
     */

  }, {
    key: 'start',
    get: function get() {
      var _props4 = this.props,
          showFixedNumberOfWeeks = _props4.showFixedNumberOfWeeks,
          showNeighboringMonth = _props4.showNeighboringMonth;


      if (showFixedNumberOfWeeks || showNeighboringMonth) {
        var _props5 = this.props,
            activeStartDate = _props5.activeStartDate,
            calendarType = _props5.calendarType;

        return -(0, _dates.getDayOfWeek)(activeStartDate, calendarType) + 1;
      }

      return 1;
    }

    /**
     * Defines on which day of the month the grid shall end. If we simply show current
     * month, we need to stop on the last day of the month, but if showNeighboringMonth
     * is set to true, we need to find the end of the week the last day of the month is in.
     */

  }, {
    key: 'end',
    get: function get() {
      var _props6 = this.props,
          activeStartDate = _props6.activeStartDate,
          showFixedNumberOfWeeks = _props6.showFixedNumberOfWeeks,
          showNeighboringMonth = _props6.showNeighboringMonth;

      var daysInMonth = (0, _dates.getDaysInMonth)(activeStartDate);

      if (showFixedNumberOfWeeks) {
        // Always show 6 weeks
        return this.start + 6 * 7 - 1;
      }

      if (showNeighboringMonth) {
        var year = this.year,
            monthIndex = this.monthIndex;
        var calendarType = this.props.calendarType;

        var activeEndDate = new Date(year, monthIndex, daysInMonth);
        return daysInMonth + (7 - (0, _dates.getDayOfWeek)(activeEndDate, calendarType) - 1);
      }

      return daysInMonth;
    }
  }, {
    key: 'year',
    get: function get() {
      var activeStartDate = this.props.activeStartDate;

      return (0, _dates.getYear)(activeStartDate);
    }
  }, {
    key: 'monthIndex',
    get: function get() {
      var activeStartDate = this.props.activeStartDate;

      return (0, _dates.getMonthIndex)(activeStartDate);
    }
  }]);

  return Days;
}(_react.PureComponent);

exports.default = Days;


Days.propTypes = _extends({
  calendarType: _propTypes3.isCalendarType.isRequired,
  showFixedNumberOfWeeks: _propTypes2.default.bool,
  showNeighboringMonth: _propTypes2.default.bool
}, _propTypes3.tileGroupProps);