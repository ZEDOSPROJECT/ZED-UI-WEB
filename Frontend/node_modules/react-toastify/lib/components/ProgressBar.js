"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _constant = require("./../utils/constant");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ProgressBar(_ref) {
  var delay = _ref.delay,
      isRunning = _ref.isRunning,
      closeToast = _ref.closeToast,
      type = _ref.type,
      hide = _ref.hide,
      className = _ref.className,
      userStyle = _ref.style,
      rtl = _ref.rtl;

  var style = _extends({}, userStyle, {
    animationDuration: delay + "ms",
    animationPlayState: isRunning ? 'running' : 'paused',
    opacity: hide ? 0 : 1
  });

  var classNames = (0, _classnames.default)('Toastify__progress-bar', "Toastify__progress-bar--" + type, {
    'Toastify__progress-bar--rtl': rtl
  }, className);
  return _react.default.createElement("div", {
    className: classNames,
    style: style,
    onAnimationEnd: closeToast
  });
}

ProgressBar.propTypes = {
  /**
   * The animation delay which determine when to close the toast
   */
  delay: _propTypes.default.number.isRequired,

  /**
   * Whether or not the animation is running or paused
   */
  isRunning: _propTypes.default.bool.isRequired,

  /**
   * Func to close the current toast
   */
  closeToast: _propTypes.default.func.isRequired,

  /**
   * Support rtl content
   */
  rtl: _propTypes.default.bool.isRequired,

  /**
   * Optional type : info, success ...
   */
  type: _propTypes.default.string,

  /**
   * Hide or not the progress bar
   */
  hide: _propTypes.default.bool,

  /**
   * Optionnal className
   */
  className: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object])
};
ProgressBar.defaultProps = {
  type: _constant.TYPE.DEFAULT,
  hide: false
};
var _default = ProgressBar;
exports.default = _default;