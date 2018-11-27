'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _WeekNumber = require('./WeekNumber');

var _WeekNumber2 = _interopRequireDefault(_WeekNumber);

var _Flex = require('../Flex');

var _Flex2 = _interopRequireDefault(_Flex);

var _dates = require('../shared/dates');

var _propTypes3 = require('../shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WeekNumbers = function (_PureComponent) {
  _inherits(WeekNumbers, _PureComponent);

  function WeekNumbers() {
    _classCallCheck(this, WeekNumbers);

    return _possibleConstructorReturn(this, (WeekNumbers.__proto__ || Object.getPrototypeOf(WeekNumbers)).apply(this, arguments));
  }

  _createClass(WeekNumbers, [{
    key: 'render',
    value: function render() {
      var dates = this.dates,
          numberOfWeeks = this.numberOfWeeks,
          weekNumbers = this.weekNumbers;
      var onClickWeekNumber = this.props.onClickWeekNumber;


      return _react2.default.createElement(
        _Flex2.default,
        {
          className: 'react-calendar__month-view__weekNumbers',
          count: numberOfWeeks,
          direction: 'column',
          style: { flexBasis: 'calc(100% * (1 / 8)', flexShrink: 0 }
        },
        weekNumbers.map(function (weekNumber, weekIndex) {
          return _react2.default.createElement(_WeekNumber2.default, {
            date: dates[weekIndex],
            key: weekNumber,
            onClickWeekNumber: onClickWeekNumber,
            weekNumber: weekNumber
          });
        })
      );
    }
  }, {
    key: 'startWeekday',
    get: function get() {
      var _props = this.props,
          activeStartDate = _props.activeStartDate,
          calendarType = _props.calendarType;

      return (0, _dates.getDayOfWeek)(activeStartDate, calendarType);
    }
  }, {
    key: 'numberOfDays',
    get: function get() {
      var activeStartDate = this.props.activeStartDate;

      return (0, _dates.getDaysInMonth)(activeStartDate);
    }
  }, {
    key: 'numberOfWeeks',
    get: function get() {
      var showFixedNumberOfWeeks = this.props.showFixedNumberOfWeeks;


      if (showFixedNumberOfWeeks) {
        return 6;
      }

      var days = this.numberOfDays - (7 - this.startWeekday);
      return 1 + Math.ceil(days / 7);
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
  }, {
    key: 'day',
    get: function get() {
      var activeStartDate = this.props.activeStartDate;

      return (0, _dates.getDay)(activeStartDate);
    }
  }, {
    key: 'dates',
    get: function get() {
      var year = this.year,
          monthIndex = this.monthIndex,
          numberOfWeeks = this.numberOfWeeks,
          day = this.day;
      var calendarType = this.props.calendarType;


      var dates = [];
      for (var index = 0; index < numberOfWeeks; index += 1) {
        dates.push((0, _dates.getBeginOfWeek)(new Date(year, monthIndex, day + index * 7), calendarType));
      }
      return dates;
    }
  }, {
    key: 'weekNumbers',
    get: function get() {
      var dates = this.dates;
      var calendarType = this.props.calendarType;

      return dates.map(function (date) {
        return (0, _dates.getWeekNumber)(date, calendarType);
      });
    }
  }]);

  return WeekNumbers;
}(_react.PureComponent);

exports.default = WeekNumbers;


WeekNumbers.propTypes = {
  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
  calendarType: _propTypes3.isCalendarType.isRequired,
  onClickWeekNumber: _propTypes2.default.func,
  showFixedNumberOfWeeks: _propTypes2.default.bool
};