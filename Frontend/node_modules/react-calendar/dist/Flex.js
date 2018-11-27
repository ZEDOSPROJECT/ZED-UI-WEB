'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var toPercent = function toPercent(num) {
  return num + '%';
};

var Flex = function Flex(_ref) {
  var children = _ref.children,
      className = _ref.className,
      direction = _ref.direction,
      count = _ref.count,
      offset = _ref.offset,
      style = _ref.style,
      wrap = _ref.wrap,
      otherProps = _objectWithoutProperties(_ref, ['children', 'className', 'direction', 'count', 'offset', 'style', 'wrap']);

  return _react2.default.createElement(
    'div',
    _extends({
      className: className,
      style: _extends({
        display: 'flex',
        flexDirection: direction,
        flexWrap: wrap ? 'wrap' : 'no-wrap'
      }, style)
    }, otherProps),
    _react2.default.Children.map(children, function (child, index) {
      return _react2.default.cloneElement(child, _extends({}, child.props, {
        style: {
          flexBasis: toPercent(100 / count),
          maxWidth: toPercent(100 / count),
          overflow: 'hidden',
          marginLeft: offset && index === 0 ? toPercent(100 * offset / count) : null
        }
      }));
    })
  );
};

Flex.propTypes = {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  count: _propTypes2.default.number.isRequired,
  direction: _propTypes2.default.string,
  offset: _propTypes2.default.number,
  style: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])),
  wrap: _propTypes2.default.bool
};

exports.default = Flex;