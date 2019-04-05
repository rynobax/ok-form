'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var OKAny =
  /*#__PURE__*/
  (function() {
    function OKAny(msg) {
      _classCallCheck(this, OKAny);

      _defineProperty(this, 'isRequired', false);

      _defineProperty(this, 'requiredMsg', 'Required');

      _defineProperty(this, 'validationMsg', 'Invalid');

      if (msg) this.validationMsg = msg;
    }

    _createClass(OKAny, [
      {
        key: 'error',
        value: function error(msg) {
          return {
            valid: false,
            error: msg,
          };
        },
      },
      {
        key: 'success',
        value: function success() {
          return {
            valid: true,
            error: null,
          };
        },
      },
      {
        key: 'required',
        value: function required(msg) {
          this.isRequired = true;
          if (msg) this.requiredMsg = msg;
          return this;
        },
      },
      {
        key: 'validate',
        value: function validate(value) {
          if (this.isRequired) {
            // TODO: I don't think this is good
            // probably just dont check at all
            if (value === null || value === undefined || value === '')
              return this.error(this.requiredMsg);
          }

          return this.success();
        },
      },
    ]);

    return OKAny;
  })();

var _default = OKAny;
exports.default = _default;
('use strict');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _ok = _interopRequireDefault(require('./ok'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _default = _ok.default;
exports.default = _default;
('use strict');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _any = _interopRequireDefault(require('./any'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== 'undefined' && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var parseNumber = function parseNumber(val) {
  if (typeof val === 'string') {
    var isEmpty = val.trim() === '';
    if (isEmpty) return NaN;
    else return Number(val);
  }

  if (typeof val === 'number') return val;
  return NaN;
};

var OKNumber =
  /*#__PURE__*/
  (function(_OKAny) {
    _inherits(OKNumber, _OKAny);

    function OKNumber(msg) {
      var _this;

      _classCallCheck(this, OKNumber);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(OKNumber).call(this, msg || 'Must be a number')
      );

      _defineProperty(_assertThisInitialized(_this), 'mins', []);

      _defineProperty(_assertThisInitialized(_this), 'shouldBeInt', false);

      _defineProperty(
        _assertThisInitialized(_this),
        'shouldBeIntMsg',
        'Must be an integer'
      );

      return _this;
    }

    _createClass(OKNumber, [
      {
        key: 'validate',
        value: function validate(input) {
          // Parent validation
          var superRes = _get(
            _getPrototypeOf(OKNumber.prototype),
            'validate',
            this
          ).call(this, input);

          if (!superRes.valid) return superRes; // Parsing

          var val = parseNumber(input);
          if (Number.isNaN(val)) return this.error(this.validationMsg); // min

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (
              var _iterator = this.mins[Symbol.iterator](), _step;
              !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
              _iteratorNormalCompletion = true
            ) {
              var _ref2 = _step.value;
              var min = _ref2.min,
                msg = _ref2.msg;
              if (val < min) return this.error(msg);
            } // integer
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if (this.shouldBeInt && !Number.isInteger(val)) {
            return this.error(this.shouldBeIntMsg);
          }

          return this.success();
        },
      },
      {
        key: 'min',
        value: function min(_min, msg) {
          this.mins.push({
            min: _min,
            msg: msg || 'Must be greater than or equal to '.concat(_min),
          });
          return this;
        },
      },
      {
        key: 'integer',
        value: function integer(msg) {
          this.shouldBeInt = true;
          if (msg) this.shouldBeIntMsg = msg;
          return this;
        },
      },
    ]);

    return OKNumber;
  })(_any.default);

var _default = OKNumber;
exports.default = _default;
('use strict');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _any = _interopRequireDefault(require('./any'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance');
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== 'undefined' && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var OKNumber =
  /*#__PURE__*/
  (function(_OKAny) {
    _inherits(OKNumber, _OKAny);

    function OKNumber(shape, msg) {
      var _this;

      _classCallCheck(this, OKNumber);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(OKNumber).call(this, msg || 'Must be an object')
      );

      _defineProperty(_assertThisInitialized(_this), 'shape', void 0);

      _this.shape = shape;
      return _this;
    }

    _createClass(OKNumber, [
      {
        key: 'validate',
        value: function validate(input) {
          // Parent validation
          var superRes = _get(
            _getPrototypeOf(OKNumber.prototype),
            'validate',
            this
          ).call(this, input);

          if (!superRes.valid) return superRes; // Parsing

          if (
            _typeof(input) !== 'object' ||
            input === null ||
            Array.isArray(input)
          )
            return this.error(this.validationMsg); // Each key

          var foundError = false;
          var error = {};

          for (
            var _i = 0, _Object$entries = Object.entries(this.shape);
            _i < _Object$entries.length;
            _i++
          ) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              _key = _Object$entries$_i[0],
              ok = _Object$entries$_i[1];

            var val = input[_key];
            var res = ok.validate(val);

            if (!res.valid) {
              foundError = true;
              error[_key] = res.error;
            }
          }

          if (foundError) return this.error(error);
          return this.success();
        },
      },
    ]);

    return OKNumber;
  })(_any.default);

var _default = OKNumber;
exports.default = _default;
('use strict');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _any = _interopRequireDefault(require('./any'));

var _number = _interopRequireDefault(require('./number'));

var _object = _interopRequireDefault(require('./object'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var ok = {
  any: function any() {
    return new _any.default();
  },
  number: function number(msg) {
    return new _number.default(msg);
  },
  object: function object(obj, msg) {
    return new _object.default(obj, msg);
  },
};
var _default = ok;
exports.default = _default;
