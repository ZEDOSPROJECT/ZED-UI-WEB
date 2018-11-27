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

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _mergeClassNames = require('merge-class-names');

var _mergeClassNames2 = _interopRequireDefault(_mergeClassNames);

var _Navigation = require('./Calendar/Navigation');

var _Navigation2 = _interopRequireDefault(_Navigation);

var _CenturyView = require('./CenturyView');

var _CenturyView2 = _interopRequireDefault(_CenturyView);

var _DecadeView = require('./DecadeView');

var _DecadeView2 = _interopRequireDefault(_DecadeView);

var _YearView = require('./YearView');

var _YearView2 = _interopRequireDefault(_YearView);

var _MonthView = require('./MonthView');

var _MonthView2 = _interopRequireDefault(_MonthView);

var _dates = require('./shared/dates');

var _propTypes3 = require('./shared/propTypes');

var _utils = require('./shared/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var allViews = ['century', 'decade', 'year', 'month'];
var allValueTypes = [].concat(_toConsumableArray(allViews.slice(1)), ['day']);

var datesAreDifferent = function datesAreDifferent(date1, date2) {
  return date1 && !date2 || !date1 && date2 || date1 && date2 && date1.getTime() !== date2.getTime();
};

/**
 * Returns views array with disallowed values cut off.
 */
var getLimitedViews = function getLimitedViews(minDetail, maxDetail) {
  return allViews.slice(allViews.indexOf(minDetail), allViews.indexOf(maxDetail) + 1);
};

var getView = function getView(view, minDetail, maxDetail) {
  if (view && getLimitedViews(minDetail, maxDetail).indexOf(view) !== -1) {
    return view;
  }

  return getLimitedViews(minDetail, maxDetail).pop();
};

/**
 * Determines whether a given view is allowed with currently applied settings.
 */
var isViewAllowed = function isViewAllowed(view, minDetail, maxDetail) {
  var views = getLimitedViews(minDetail, maxDetail);

  return views.indexOf(view) !== -1;
};

/**
 * Returns value type that can be returned with currently applied settings.
 */
var getValueType = function getValueType(maxDetail) {
  return allValueTypes[allViews.indexOf(maxDetail)];
};

var getValueFrom = function getValueFrom(value) {
  if (!value) {
    return null;
  }

  var rawValueFrom = value instanceof Array && value.length === 2 ? value[0] : value;

  if (!rawValueFrom) {
    return null;
  }

  var valueFromDate = new Date(rawValueFrom);

  if (isNaN(valueFromDate.getTime())) {
    throw new Error('Invalid date: ' + value);
  }

  return valueFromDate;
};

var getDetailValueFrom = function getDetailValueFrom(value, minDate, maxDate, maxDetail) {
  var valueFrom = getValueFrom(value);

  if (!valueFrom) {
    return null;
  }

  var detailValueFrom = (0, _dates.getBegin)(getValueType(maxDetail), valueFrom);

  return (0, _utils.between)(detailValueFrom, minDate, maxDate);
};

var getValueTo = function getValueTo(value) {
  if (!value) {
    return null;
  }

  var rawValueTo = value instanceof Array && value.length === 2 ? value[1] : value;

  if (!rawValueTo) {
    return null;
  }

  var valueToDate = new Date(rawValueTo);

  if (isNaN(valueToDate.getTime())) {
    throw new Error('Invalid date: ' + value);
  }

  return valueToDate;
};

var getDetailValueTo = function getDetailValueTo(value, minDate, maxDate, maxDetail) {
  var valueTo = getValueTo(value);

  if (!valueTo) {
    return null;
  }

  var detailValueTo = (0, _dates.getEnd)(getValueType(maxDetail), valueTo);

  return (0, _utils.between)(detailValueTo, minDate, maxDate);
};

var getDetailValueArray = function getDetailValueArray(value, minDate, maxDate, maxDetail) {
  if (value instanceof Array) {
    return value;
  }

  return [getDetailValueFrom(value, minDate, maxDate, maxDetail), getDetailValueTo(value, minDate, maxDate, maxDetail)];
};

var getActiveStartDate = function getActiveStartDate(props) {
  var activeStartDate = props.activeStartDate,
      maxDate = props.maxDate,
      maxDetail = props.maxDetail,
      minDate = props.minDate,
      minDetail = props.minDetail,
      value = props.value,
      view = props.view;


  var rangeType = getView(view, minDetail, maxDetail);
  var valueFrom = getDetailValueFrom(value, minDate, maxDate, maxDetail) || activeStartDate || new Date();
  return (0, _dates.getBegin)(rangeType, valueFrom);
};

var Calendar = function (_Component) {
  _inherits(Calendar, _Component);

  function Calendar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Calendar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.setActiveStartDate = function (activeStartDate) {
      var onActiveDateChange = _this.props.onActiveDateChange;


      _this.setState({ activeStartDate: activeStartDate }, function () {
        var view = _this.state.view;


        (0, _utils.callIfDefined)(onActiveDateChange, {
          activeStartDate: activeStartDate,
          view: view
        });
      });
    }, _this.drillDown = function (activeStartDate) {
      if (!_this.drillDownAvailable) {
        return;
      }

      var _this$props = _this.props,
          maxDetail = _this$props.maxDetail,
          minDetail = _this$props.minDetail,
          onDrillDown = _this$props.onDrillDown;


      var views = getLimitedViews(minDetail, maxDetail);

      _this.setState(function (prevState) {
        var nextView = views[views.indexOf(prevState.view) + 1];
        return {
          activeStartDate: activeStartDate,
          view: nextView
        };
      }, function () {
        var view = _this.state.view;


        (0, _utils.callIfDefined)(onDrillDown, {
          activeStartDate: activeStartDate,
          view: view
        });
      });
    }, _this.drillUp = function () {
      if (!_this.drillUpAvailable) {
        return;
      }

      var _this$props2 = _this.props,
          maxDetail = _this$props2.maxDetail,
          minDetail = _this$props2.minDetail,
          onDrillUp = _this$props2.onDrillUp;


      var views = getLimitedViews(minDetail, maxDetail);

      _this.setState(function (prevState) {
        var nextView = views[views.indexOf(prevState.view) - 1];
        var activeStartDate = (0, _dates.getBegin)(nextView, prevState.activeStartDate);

        return {
          activeStartDate: activeStartDate,
          view: nextView
        };
      }, function () {
        var _this$state = _this.state,
            activeStartDate = _this$state.activeStartDate,
            view = _this$state.view;


        (0, _utils.callIfDefined)(onDrillUp, {
          activeStartDate: activeStartDate,
          view: view
        });
      });
    }, _this.onChange = function (value) {
      var _this$props3 = _this.props,
          onChange = _this$props3.onChange,
          selectRange = _this$props3.selectRange;


      var nextValue = void 0;
      var callback = void 0;
      if (selectRange) {
        var previousValue = _this.state.value;
        // Range selection turned on

        if (!previousValue || [].concat(previousValue).length !== 1 // 0 or 2 - either way we're starting a new array
        ) {
            // First value
            nextValue = (0, _dates.getBegin)(_this.valueType, value);
          } else {
          // Second value
          nextValue = (0, _dates.getValueRange)(_this.valueType, previousValue, value);
          callback = function callback() {
            return (0, _utils.callIfDefined)(onChange, nextValue);
          };
        }
      } else {
        // Range selection turned off
        nextValue = _this.getProcessedValue(value);
        callback = function callback() {
          return (0, _utils.callIfDefined)(onChange, nextValue);
        };
      }

      _this.setState({ value: nextValue }, callback);
    }, _this.onMouseOver = function (value) {
      _this.setState({ hover: value });
    }, _this.onMouseOut = function () {
      _this.setState({ hover: null });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Calendar, [{
    key: 'getProcessedValue',


    /**
     * Gets current value in a desired format.
     */
    value: function getProcessedValue(value) {
      var _props = this.props,
          minDate = _props.minDate,
          maxDate = _props.maxDate,
          maxDetail = _props.maxDetail,
          returnValue = _props.returnValue;


      switch (returnValue) {
        case 'start':
          return getDetailValueFrom(value, minDate, maxDate, maxDetail);
        case 'end':
          return getDetailValueTo(value, minDate, maxDate, maxDetail);
        case 'range':
          return getDetailValueArray(value, minDate, maxDate, maxDetail);
        default:
          throw new Error('Invalid returnValue.');
      }
    }
  }, {
    key: 'renderContent',
    value: function renderContent() {
      var _props2 = this.props,
          calendarType = _props2.calendarType,
          locale = _props2.locale,
          maxDate = _props2.maxDate,
          minDate = _props2.minDate,
          renderChildren = _props2.renderChildren,
          selectRange = _props2.selectRange,
          tileClassName = _props2.tileClassName,
          tileContent = _props2.tileContent,
          tileDisabled = _props2.tileDisabled;
      var _state = this.state,
          activeStartDate = _state.activeStartDate,
          hover = _state.hover,
          value = _state.value,
          view = _state.view;
      var onMouseOver = this.onMouseOver,
          valueType = this.valueType;


      var commonProps = {
        activeStartDate: activeStartDate,
        hover: hover,
        locale: locale,
        maxDate: maxDate,
        minDate: minDate,
        onMouseOver: selectRange ? onMouseOver : null,
        tileClassName: tileClassName,
        tileContent: tileContent || renderChildren, // For backwards compatibility
        tileDisabled: tileDisabled,
        value: value,
        valueType: valueType
      };

      var clickAction = this.drillDownAvailable ? this.drillDown : this.onChange;

      switch (view) {
        case 'century':
          {
            var onClickDecade = this.props.onClickDecade;


            return _react2.default.createElement(_CenturyView2.default, _extends({
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickDecade)
            }, commonProps));
          }
        case 'decade':
          {
            var onClickYear = this.props.onClickYear;


            return _react2.default.createElement(_DecadeView2.default, _extends({
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickYear)
            }, commonProps));
          }
        case 'year':
          {
            var _props3 = this.props,
                formatMonth = _props3.formatMonth,
                onClickMonth = _props3.onClickMonth;


            return _react2.default.createElement(_YearView2.default, _extends({
              formatMonth: formatMonth,
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickMonth)
            }, commonProps));
          }
        case 'month':
          {
            var _props4 = this.props,
                formatShortWeekday = _props4.formatShortWeekday,
                onClickDay = _props4.onClickDay,
                onClickWeekNumber = _props4.onClickWeekNumber,
                showFixedNumberOfWeeks = _props4.showFixedNumberOfWeeks,
                showNeighboringMonth = _props4.showNeighboringMonth,
                showWeekNumbers = _props4.showWeekNumbers;


            return _react2.default.createElement(_MonthView2.default, _extends({
              calendarType: calendarType,
              formatShortWeekday: formatShortWeekday,
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickDay),
              onClickWeekNumber: onClickWeekNumber,
              showFixedNumberOfWeeks: showFixedNumberOfWeeks,
              showNeighboringMonth: showNeighboringMonth,
              showWeekNumbers: showWeekNumbers
            }, commonProps));
          }
        default:
          throw new Error('Invalid view: ' + view + '.');
      }
    }
  }, {
    key: 'renderNavigation',
    value: function renderNavigation() {
      var showNavigation = this.props.showNavigation;


      if (!showNavigation) {
        return null;
      }

      var _props5 = this.props,
          formatMonthYear = _props5.formatMonthYear,
          locale = _props5.locale,
          maxDate = _props5.maxDate,
          maxDetail = _props5.maxDetail,
          minDate = _props5.minDate,
          minDetail = _props5.minDetail,
          next2Label = _props5.next2Label,
          nextLabel = _props5.nextLabel,
          navigationLabel = _props5.navigationLabel,
          prev2Label = _props5.prev2Label,
          prevLabel = _props5.prevLabel;
      var _state2 = this.state,
          activeRange = _state2.activeRange,
          activeStartDate = _state2.activeStartDate,
          view = _state2.view;


      return _react2.default.createElement(_Navigation2.default, {
        activeRange: activeRange,
        activeStartDate: activeStartDate,
        drillUp: this.drillUp,
        formatMonthYear: formatMonthYear,
        locale: locale,
        maxDate: maxDate,
        minDate: minDate,
        next2Label: next2Label,
        nextLabel: nextLabel,
        navigationLabel: navigationLabel,
        prev2Label: prev2Label,
        prevLabel: prevLabel,
        setActiveStartDate: this.setActiveStartDate,
        view: view,
        views: getLimitedViews(minDetail, maxDetail)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props6 = this.props,
          className = _props6.className,
          selectRange = _props6.selectRange;
      var value = this.state.value;
      var onMouseOut = this.onMouseOut;

      var valueArray = [].concat(value);

      return _react2.default.createElement(
        'div',
        {
          className: (0, _mergeClassNames2.default)('react-calendar', selectRange && valueArray.length === 1 && 'react-calendar--selectRange', className),
          onMouseOut: selectRange ? onMouseOut : null,
          onBlur: selectRange ? onMouseOut : null
        },
        this.renderNavigation(),
        this.renderContent()
      );
    }
  }, {
    key: 'drillDownAvailable',
    get: function get() {
      var _props7 = this.props,
          maxDetail = _props7.maxDetail,
          minDetail = _props7.minDetail;
      var view = this.state.view;


      var views = getLimitedViews(minDetail, maxDetail);

      return views.indexOf(view) < views.length - 1;
    }
  }, {
    key: 'drillUpAvailable',
    get: function get() {
      var _props8 = this.props,
          maxDetail = _props8.maxDetail,
          minDetail = _props8.minDetail;
      var view = this.state.view;


      var views = getLimitedViews(minDetail, maxDetail);

      return views.indexOf(view) > 0;
    }
  }, {
    key: 'valueType',
    get: function get() {
      var maxDetail = this.props.maxDetail;


      return getValueType(maxDetail);
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var minDate = nextProps.minDate,
          maxDate = nextProps.maxDate,
          minDetail = nextProps.minDetail,
          maxDetail = nextProps.maxDetail;


      var nextState = {};

      /**
       * If the next activeStartDate is different from the current one, update
       * activeStartDate (for display) and activeStartDateProps (for future comparisons)
       */
      var nextActiveStartDate = getActiveStartDate(nextProps);
      if (datesAreDifferent(nextActiveStartDate, prevState.activeStartDateProps)) {
        nextState.activeStartDate = nextActiveStartDate;
        nextState.activeStartDateProps = nextActiveStartDate;
      }

      /**
       * If the next view is different from the current one, and the previously set view is not
       * valid based on minDetail and maxDetail, get a new one.
       */
      var nextView = getView(nextProps.view, minDetail, maxDetail);
      if (nextView !== prevState.viewProps && !isViewAllowed(prevState.view, minDetail, maxDetail)) {
        nextState.view = nextView;
        nextState.viewProps = nextView;
      }

      /**
       * If the next value is different from the current one (with an exception of situation in
       * which values provided are limited by minDate and maxDate so that the dates are the same),
       * get a new one.
       */
      var values = [nextProps.value, prevState.valueProps];
      if (nextState.view // Allowed view changed
      || datesAreDifferent.apply(undefined, _toConsumableArray(values.map(function (value) {
        return getValueFrom(value, minDate, maxDate, maxDetail);
      }))) || datesAreDifferent.apply(undefined, _toConsumableArray(values.map(function (value) {
        return getValueTo(value, minDate, maxDate, maxDetail);
      })))) {
        nextState.value = nextProps.value;
        nextState.valueProps = nextProps.value;
      }

      if (!nextProps.selectRange && prevState.hover) {
        nextState.hover = null;
      }

      return nextState;
    }

    /**
     * Called when the user uses navigation buttons.
     */

  }]);

  return Calendar;
}(_react.Component);

exports.default = Calendar;


Calendar.defaultProps = {
  maxDetail: 'month',
  minDetail: 'century',
  returnValue: 'start',
  showNavigation: true,
  showNeighboringMonth: true,
  view: 'month'
};

Calendar.propTypes = {
  activeStartDate: _propTypes2.default.instanceOf(Date),
  calendarType: _propTypes3.isCalendarType,
  className: _propTypes3.isClassName,
  formatMonth: _propTypes2.default.func,
  formatMonthYear: _propTypes2.default.func,
  formatShortWeekday: _propTypes2.default.func,
  locale: _propTypes2.default.string,
  maxDate: _propTypes3.isMaxDate,
  maxDetail: _propTypes2.default.oneOf(allViews),
  minDate: _propTypes3.isMinDate,
  minDetail: _propTypes2.default.oneOf(allViews),
  navigationLabel: _propTypes2.default.func,
  next2Label: _propTypes2.default.node,
  nextLabel: _propTypes2.default.node,
  onActiveDateChange: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onClickDay: _propTypes2.default.func,
  onClickDecade: _propTypes2.default.func,
  onClickMonth: _propTypes2.default.func,
  onClickWeekNumber: _propTypes2.default.func,
  onClickYear: _propTypes2.default.func,
  onDrillDown: _propTypes2.default.func,
  onDrillUp: _propTypes2.default.func,
  prev2Label: _propTypes2.default.node,
  prevLabel: _propTypes2.default.node,
  renderChildren: _propTypes2.default.func, // For backwards compatibility
  returnValue: _propTypes2.default.oneOf(['start', 'end', 'range']),
  selectRange: _propTypes2.default.bool,
  showFixedNumberOfWeeks: _propTypes2.default.bool,
  showNavigation: _propTypes2.default.bool,
  showNeighboringMonth: _propTypes2.default.bool,
  showWeekNumbers: _propTypes2.default.bool,
  tileClassName: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes3.isClassName]),
  tileContent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]),
  tileDisabled: _propTypes2.default.func,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes3.isValue]),
  view: _propTypes2.default.oneOf(allViews)
};

(0, _reactLifecyclesCompat.polyfill)(Calendar);