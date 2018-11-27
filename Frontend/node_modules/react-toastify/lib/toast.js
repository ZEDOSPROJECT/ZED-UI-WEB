"use strict";

exports.__esModule = true;
exports.default = void 0;

var _eventManager = _interopRequireDefault(require("./utils/eventManager"));

var _constant = require("./utils/constant");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var container = null;
var queue = [];
var toastId = 0;

var noop = function noop() {
  return false;
};
/**
 * Merge provided options with the defaults settings and generate the toastId
 */


function mergeOptions(options, type) {
  return _extends({}, options, {
    type: type,
    toastId: generateToastId(options)
  });
}
/**
 * Generate the toastId either automatically or by provided toastId
 */


function generateToastId(options) {
  if (options && (typeof options.toastId === 'number' && !isNaN(options.toastId) || typeof options.toastId === 'string')) {
    return options.toastId;
  }

  return ++toastId;
}
/**
 * Dispatch toast. If the container is not mounted, the toast is enqueued
 */


function emitEvent(content, options) {
  if (container !== null) {
    _eventManager.default.emit(_constant.ACTION.SHOW, content, options);
  } else {
    queue.push({
      action: _constant.ACTION.SHOW,
      content: content,
      options: options
    });
  }

  return options.toastId;
}

var toast = _extends(function (content, options) {
  return emitEvent(content, mergeOptions(options, options && options.type || _constant.TYPE.DEFAULT));
}, {
  success: function success(content, options) {
    return emitEvent(content, mergeOptions(options, _constant.TYPE.SUCCESS));
  },
  info: function info(content, options) {
    return emitEvent(content, mergeOptions(options, _constant.TYPE.INFO));
  },
  warn: function warn(content, options) {
    return emitEvent(content, mergeOptions(options, _constant.TYPE.WARNING));
  },
  warning: function warning(content, options) {
    return emitEvent(content, mergeOptions(options, _constant.TYPE.WARNING));
  },
  error: function error(content, options) {
    return emitEvent(content, mergeOptions(options, _constant.TYPE.ERROR));
  },
  dismiss: function dismiss(id) {
    if (id === void 0) {
      id = null;
    }

    return container && _eventManager.default.emit(_constant.ACTION.CLEAR, id);
  },
  isActive: noop,
  update: function update(toastId, options) {
    setTimeout(function () {
      if (container && typeof container.collection[toastId] !== 'undefined') {
        var _container$collection = container.collection[toastId],
            oldOptions = _container$collection.options,
            oldContent = _container$collection.content;
        var updateId = oldOptions.updateId ? oldOptions.updateId + 1 : 1;

        var nextOptions = _extends({}, oldOptions, options, {
          toastId: toastId,
          updateId: updateId
        });

        var content = typeof nextOptions.render !== 'undefined' ? nextOptions.render : oldContent;
        delete nextOptions.render;
        emitEvent(content, nextOptions);
      }
    }, 0);
  },
  onChange: function onChange(callback) {
    if (typeof callback === 'function') {
      _eventManager.default.on(_constant.ACTION.ON_CHANGE, callback);
    }
  },
  POSITION: _constant.POSITION,
  TYPE: _constant.TYPE
});
/**
 * Wait until the ToastContainer is mounted to dispatch the toast
 * and attach isActive method
 */


_eventManager.default.on(_constant.ACTION.DID_MOUNT, function (containerInstance) {
  container = containerInstance;

  toast.isActive = function (id) {
    return container.isToastActive(id);
  };

  queue.forEach(function (item) {
    _eventManager.default.emit(item.action, item.content, item.options);
  });
  queue = [];
}).on(_constant.ACTION.WILL_UNMOUNT, function () {
  container = null;
  toast.isActive = noop;
  toastId = 0;
});

var _default = toast;
exports.default = _default;