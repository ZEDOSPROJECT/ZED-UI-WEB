'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WeekNumber = function WeekNumber(_ref) {
  var date = _ref.date,
      onClickWeekNumber = _ref.onClickWeekNumber,
      weekNumber = _ref.weekNumber;
  return onClickWeekNumber ? _react2.default.createElement(
    'button',
    {
      className: 'react-calendar__tile',
      onClick: function onClick() {
        return onClickWeekNumber(weekNumber, date);
      },
      style: { flexGrow: 1 },
      type: 'button'
    },
    _react2.default.createElement(
      'span',
      null,
      weekNumber
    )
  ) : _react2.default.createElement(
    'div',
    {
      className: 'react-calendar__tile',
      style: { flexGrow: 1 }
    },
    _react2.default.createElement(
      'span',
      null,
      weekNumber
    )
  );
};

WeekNumber.propTypes = {
  date: _propTypes2.default.instanceOf(Date).isRequired,
  onClickWeekNumber: _propTypes2.default.func,
  weekNumber: _propTypes2.default.number.isRequired
};

exports.default = WeekNumber;