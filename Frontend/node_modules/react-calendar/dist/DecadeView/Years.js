'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TileGroup = require('../TileGroup');

var _TileGroup2 = _interopRequireDefault(_TileGroup);

var _Year = require('./Year');

var _Year2 = _interopRequireDefault(_Year);

var _dates = require('../shared/dates');

var _propTypes = require('../shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Years = function (_PureComponent) {
  _inherits(Years, _PureComponent);

  function Years() {
    _classCallCheck(this, Years);

    return _possibleConstructorReturn(this, (Years.__proto__ || Object.getPrototypeOf(Years)).apply(this, arguments));
  }

  _createClass(Years, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_TileGroup2.default, _extends({}, this.props, {
        className: 'react-calendar__decade-view__years',
        dateTransform: function dateTransform(year) {
          return new Date(year, 0, 1);
        },
        dateType: 'year',
        end: this.end,
        start: this.start,
        tile: _Year2.default
      }));
    }
  }, {
    key: 'start',
    get: function get() {
      var activeStartDate = this.props.activeStartDate;

      return (0, _dates.getBeginOfDecadeYear)(activeStartDate);
    }
  }, {
    key: 'end',
    get: function get() {
      return this.start + 9;
    }
  }]);

  return Years;
}(_react.PureComponent);

exports.default = Years;


Years.propTypes = _extends({}, _propTypes.tileGroupProps);