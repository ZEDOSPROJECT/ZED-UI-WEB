'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Flex = require('./Flex');

var _Flex2 = _interopRequireDefault(_Flex);

var _utils = require('./shared/utils');

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var TileGroup = function TileGroup(_ref) {
  var className = _ref.className,
      count = _ref.count,
      dateTransform = _ref.dateTransform,
      dateType = _ref.dateType,
      end = _ref.end,
      hover = _ref.hover,
      offset = _ref.offset,
      start = _ref.start,
      step = _ref.step,
      Tile = _ref.tile,
      value = _ref.value,
      valueType = _ref.valueType,
      tileProps = _objectWithoutProperties(_ref, ['className', 'count', 'dateTransform', 'dateType', 'end', 'hover', 'offset', 'start', 'step', 'tile', 'value', 'valueType']);

  var tiles = [];
  for (var point = start; point <= end; point += step) {
    var date = dateTransform(point);

    tiles.push(_react2.default.createElement(Tile, _extends({
      classes: (0, _utils.getTileClasses)({
        value: value, valueType: valueType, date: date, dateType: dateType, hover: hover
      }),
      date: date,
      point: point,
      key: date.getTime()
    }, tileProps)));
  }

  return _react2.default.createElement(
    _Flex2.default,
    {
      className: className,
      count: count,
      offset: offset,
      wrap: true
    },
    tiles
  );
};

TileGroup.propTypes = _extends({}, _propTypes3.tileGroupProps, {
  activeStartDate: _propTypes2.default.instanceOf(Date),
  count: _propTypes2.default.number,
  dateTransform: _propTypes2.default.func.isRequired,
  offset: _propTypes2.default.number,
  tile: _propTypes2.default.func.isRequired,
  step: _propTypes2.default.number
});

TileGroup.defaultProps = {
  count: 3,
  step: 1
};

exports.default = TileGroup;