'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _dates = require('../shared/dates');

var _dateFormatter = require('../shared/dateFormatter');

var _propTypes3 = require('../shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Navigation = function (_PureComponent) {
  _inherits(Navigation, _PureComponent);

  function Navigation() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Navigation);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Navigation.__proto__ || Object.getPrototypeOf(Navigation)).call.apply(_ref, [this].concat(args))), _this), _this.onClickPrevious = function () {
      var _this$props = _this.props,
          date = _this$props.activeStartDate,
          view = _this$props.view,
          setActiveStartDate = _this$props.setActiveStartDate;

      setActiveStartDate((0, _dates.getBeginPrevious)(view, date));
    }, _this.onClickNext = function () {
      var _this$props2 = _this.props,
          date = _this$props2.activeStartDate,
          view = _this$props2.view,
          setActiveStartDate = _this$props2.setActiveStartDate;

      setActiveStartDate((0, _dates.getBeginNext)(view, date));
    }, _this.onClickPrevious2 = function () {
      var _this$props3 = _this.props,
          date = _this$props3.activeStartDate,
          view = _this$props3.view,
          setActiveStartDate = _this$props3.setActiveStartDate;

      setActiveStartDate((0, _dates.getBeginPrevious2)(view, date));
    }, _this.onClickNext2 = function () {
      var _this$props4 = _this.props,
          date = _this$props4.activeStartDate,
          view = _this$props4.view,
          setActiveStartDate = _this$props4.setActiveStartDate;

      setActiveStartDate((0, _dates.getBeginNext2)(view, date));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Navigation, [{
    key: 'render',
    value: function render() {
      var label = this.label;
      var _props = this.props,
          date = _props.activeStartDate,
          drillUp = _props.drillUp,
          navigationLabel = _props.navigationLabel,
          next2Label = _props.next2Label,
          nextLabel = _props.nextLabel,
          prev2Label = _props.prev2Label,
          prevLabel = _props.prevLabel,
          view = _props.view;


      var className = 'react-calendar__navigation';

      return _react2.default.createElement(
        'div',
        {
          className: className,
          style: { display: 'flex' }
        },
        prev2Label !== null && view !== 'century' && _react2.default.createElement(
          'button',
          {
            className: className + '__arrow ' + className + '__prev2-button',
            disabled: this.prev2ButtonDisabled,
            onClick: this.onClickPrevious2,
            type: 'button'
          },
          prev2Label
        ),
        _react2.default.createElement(
          'button',
          {
            className: className + '__arrow ' + className + '__prev-button',
            disabled: this.prevButtonDisabled,
            onClick: this.onClickPrevious,
            type: 'button'
          },
          prevLabel
        ),
        _react2.default.createElement(
          'button',
          {
            className: 'react-calendar__navigation__label',
            onClick: drillUp,
            disabled: !this.drillUpAvailable,
            style: { flexGrow: 1 },
            type: 'button'
          },
          navigationLabel ? navigationLabel({ date: date, view: view, label: label }) : label
        ),
        _react2.default.createElement(
          'button',
          {
            className: className + '__arrow ' + className + '__next-button',
            disabled: this.nextButtonDisabled,
            onClick: this.onClickNext,
            type: 'button'
          },
          nextLabel
        ),
        next2Label !== null && view !== 'century' && _react2.default.createElement(
          'button',
          {
            className: className + '__arrow ' + className + '__next2-button',
            disabled: this.next2ButtonDisabled,
            onClick: this.onClickNext2,
            type: 'button'
          },
          next2Label
        )
      );
    }
  }, {
    key: 'drillUpAvailable',
    get: function get() {
      var _props2 = this.props,
          view = _props2.view,
          views = _props2.views;

      return views.indexOf(view) > 0;
    }
  }, {
    key: 'prevButtonDisabled',
    get: function get() {
      var _props3 = this.props,
          date = _props3.activeStartDate,
          minDate = _props3.minDate,
          view = _props3.view;

      var previousActiveStartDate = (0, _dates.getBeginPrevious)(view, date);
      if (previousActiveStartDate.getFullYear() < 1000) {
        return true;
      }
      var previousActiveEndDate = (0, _dates.getEndPrevious)(view, date);
      return minDate && minDate >= previousActiveEndDate;
    }
  }, {
    key: 'prev2ButtonDisabled',
    get: function get() {
      var _props4 = this.props,
          date = _props4.activeStartDate,
          minDate = _props4.minDate,
          view = _props4.view;

      var previousActiveStartDate = (0, _dates.getBeginPrevious2)(view, date);
      if (previousActiveStartDate.getFullYear() < 1000) {
        return true;
      }
      var previousActiveEndDate = (0, _dates.getEndPrevious2)(view, date);
      return minDate && minDate >= previousActiveEndDate;
    }
  }, {
    key: 'nextButtonDisabled',
    get: function get() {
      var _props5 = this.props,
          date = _props5.activeStartDate,
          maxDate = _props5.maxDate,
          view = _props5.view;

      var nextActiveStartDate = (0, _dates.getBeginNext)(view, date);
      return maxDate && maxDate <= nextActiveStartDate;
    }
  }, {
    key: 'next2ButtonDisabled',
    get: function get() {
      var _props6 = this.props,
          date = _props6.activeStartDate,
          maxDate = _props6.maxDate,
          view = _props6.view;

      var nextActiveStartDate = (0, _dates.getBeginNext2)(view, date);
      return maxDate && maxDate <= nextActiveStartDate;
    }
  }, {
    key: 'label',
    get: function get() {
      var _props7 = this.props,
          date = _props7.activeStartDate,
          formatMonthYear = _props7.formatMonthYear,
          locale = _props7.locale,
          view = _props7.view;


      switch (view) {
        case 'century':
          return (0, _dates.getCenturyLabel)(date);
        case 'decade':
          return (0, _dates.getDecadeLabel)(date);
        case 'year':
          return (0, _dates.getYear)(date);
        case 'month':
          return formatMonthYear(date, locale);
        default:
          throw new Error('Invalid view: ' + view + '.');
      }
    }
  }]);

  return Navigation;
}(_react.PureComponent);

exports.default = Navigation;


Navigation.defaultProps = {
  formatMonthYear: _dateFormatter.formatMonthYear,
  next2Label: '»',
  nextLabel: '›',
  prev2Label: '«',
  prevLabel: '‹'
};

Navigation.propTypes = {
  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
  drillUp: _propTypes2.default.func.isRequired,
  formatMonthYear: _propTypes2.default.func,
  locale: _propTypes2.default.string,
  maxDate: _propTypes2.default.instanceOf(Date),
  minDate: _propTypes2.default.instanceOf(Date),
  next2Label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  nextLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  navigationLabel: _propTypes2.default.func,
  prev2Label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  prevLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  setActiveStartDate: _propTypes2.default.func.isRequired,
  view: _propTypes3.isView.isRequired,
  views: _propTypes3.isViews.isRequired
};