'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Flex = require('../Flex');

var _Flex2 = _interopRequireDefault(_Flex);

var _dates = require('../shared/dates');

var _dateFormatter = require('../shared/dateFormatter');

var _propTypes3 = require('../shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Weekdays = function (_Component) {
  _inherits(Weekdays, _Component);

  function Weekdays() {
    _classCallCheck(this, Weekdays);

    return _possibleConstructorReturn(this, (Weekdays.__proto__ || Object.getPrototypeOf(Weekdays)).apply(this, arguments));
  }

  _createClass(Weekdays, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _props = this.props,
          calendarType = _props.calendarType,
          locale = _props.locale;


      return nextProps.calendarType !== calendarType || nextProps.locale !== locale;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          calendarType = _props2.calendarType,
          formatShortWeekday = _props2.formatShortWeekday,
          locale = _props2.locale;
      var beginOfMonth = this.beginOfMonth,
          year = this.year,
          monthIndex = this.monthIndex;


      var weekdays = [];

      for (var weekday = 1; weekday <= 7; weekday += 1) {
        var weekdayDate = new Date(year, monthIndex, weekday - (0, _dates.getDayOfWeek)(beginOfMonth, calendarType));

        weekdays.push(_react2.default.createElement(
          'div',
          {
            className: 'react-calendar__month-view__weekdays__weekday',
            key: weekday,
            style: { flexGrow: 1 }
          },
          formatShortWeekday(weekdayDate, locale).replace('.', '')
        ));
      }

      return _react2.default.createElement(
        _Flex2.default,
        {
          className: 'react-calendar__month-view__weekdays',
          count: 7
        },
        weekdays
      );
    }
  }, {
    key: 'beginOfMonth',
    get: function get() {
      var month = this.props.month;


      return (0, _dates.getBeginOfMonth)(month);
    }
  }, {
    key: 'year',
    get: function get() {
      var beginOfMonth = this.beginOfMonth;


      return (0, _dates.getYear)(beginOfMonth);
    }
  }, {
    key: 'monthIndex',
    get: function get() {
      var beginOfMonth = this.beginOfMonth;


      return (0, _dates.getMonthIndex)(beginOfMonth);
    }
  }]);

  return Weekdays;
}(_react.Component);

exports.default = Weekdays;


Weekdays.defaultProps = {
  formatShortWeekday: _dateFormatter.formatShortWeekday
};

Weekdays.propTypes = {
  calendarType: _propTypes3.isCalendarType.isRequired,
  formatShortWeekday: _propTypes2.default.func,
  locale: _propTypes2.default.string,
  month: _propTypes2.default.oneOfType([_propTypes2.default.string, // Only strings that are parseable to integer
  _propTypes2.default.number, _propTypes2.default.instanceOf(Date)]).isRequired
};