"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _errors = require("./errors");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function checkNullish(value) {
  return value === null || value === undefined || value === '';
}

function isString(val) {
  return typeof val === 'string';
}

var OKAny = function () {
  function OKAny() {
    var _this = this;

    _classCallCheck(this, OKAny);

    _defineProperty(this, "isOptional", false);

    _defineProperty(this, "requiredMessage", 'Required');

    _defineProperty(this, "tests", []);

    _defineProperty(this, "transforms", []);

    _defineProperty(this, "__parent", void 0);

    _defineProperty(this, "__root", void 0);

    _defineProperty(this, "__path", []);

    _defineProperty(this, "makeAddTest", function () {
      return function (predicate, msg) {
        var testFn = function testFn(val) {
          return predicate(val) ? null : msg;
        };

        _this.tests.push({
          testFn: testFn,
          skipIfNull: true
        });
      };
    });
  }

  _createClass(OKAny, [{
    key: "error",
    value: function error(msg, validationError) {
      return {
        valid: false,
        error: msg,
        validationError: validationError || null
      };
    }
  }, {
    key: "success",
    value: function success() {
      return {
        valid: true,
        error: null,
        validationError: null
      };
    }
  }, {
    key: "getContext",
    value: function getContext() {
      var parent = this.__parent;
      var root = this.__root;
      var path = this.__path;
      return {
        parent: parent,
        root: root,
        path: path
      };
    }
  }, {
    key: "optional",
    value: function optional() {
      this.isOptional = true;
      return this;
    }
  }, {
    key: "transform",
    value: function transform(transformFn) {
      this.transforms.push(transformFn);
      return this;
    }
  }, {
    key: "test",
    value: function test(testFn) {
      this.tests.push({
        testFn: testFn
      });
      return this;
    }
  }, {
    key: "required",
    value: function required(msg) {
      if (msg) {
        this.requiredMessage = msg;
      }

      return this;
    }
  }, {
    key: "cast",
    value: function cast(input) {
      var context = this.getContext();
      return this.transforms.reduce(function (prevValue, fn) {
        return fn(prevValue, context);
      }, input);
    }
  }, {
    key: "handleValidationError",
    value: function handleValidationError(err) {
      if (err instanceof _errors.ValidationRuntimeError) {
        return this.error(err.message, err);
      } else if (err && err.message) {
        var runtimeError = new _errors.ValidationRuntimeError({
          message: err.message,
          originalError: err
        });
        return this.error('Invalid', runtimeError);
      } else {
        var _runtimeError = new _errors.ValidationRuntimeError({
          message: 'Error',
          originalError: err
        });

        return this.error('Invalid', _runtimeError);
      }
    }
  }, {
    key: "validate",
    value: function validate(input) {
      try {
        var value = this.cast(input);
        var isNullish = checkNullish(value);

        if (isNullish && !this.isOptional) {
          return this.error(this.requiredMessage);
        }

        var _context = this.getContext();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.tests[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref2 = _step.value;
            var testFn = _ref2.testFn,
                skipIfNull = _ref2.skipIfNull;

            if (isNullish && skipIfNull) {
              continue;
            }

            var res = testFn(value, _context);
            if (res instanceof Promise) return this.error('Cannot run async test in validate, use validateAsync');else if (res instanceof OKAny) return res.validate(value);else if (isString(res)) return this.error(res);
          }
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

        return this.success();
      } catch (err) {
        return this.handleValidationError(err);
      }
    }
  }, {
    key: "validateAsync",
    value: async function validateAsync(input) {
      try {
        var value = this.cast(input);
        var isNullish = checkNullish(value);

        if (isNullish && !this.isOptional) {
          return this.error(this.requiredMessage);
        }

        var _context2 = this.getContext();

        var testResults = await Promise.all(this.tests.map(async function (_ref3) {
          var testFn = _ref3.testFn,
              skipIfNull = _ref3.skipIfNull;

          if (isNullish && skipIfNull) {
            return null;
          }

          var res = await testFn(value, _context2);
          if (res instanceof OKAny) return res.validateAsync(value).then(function (r) {
            return r.error;
          });else if (isString(res)) return res;else return null;
        }));
        var firstError = testResults.filter(isString)[0];
        if (firstError) return this.error(firstError);else return this.success();
      } catch (err) {
        return this.handleValidationError(err);
      }
    }
  }]);

  return OKAny;
}();

var _default = OKAny;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _any = _interopRequireDefault(require("./any"));

var _errors = require("./errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var OKArray = function (_OKAny) {
  _inherits(OKArray, _OKAny);

  function OKArray(shape, msg) {
    var _this;

    _classCallCheck(this, OKArray);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OKArray).call(this));

    _defineProperty(_assertThisInitialized(_this), "shape", void 0);

    _defineProperty(_assertThisInitialized(_this), "parseErrorMsg", 'Must be an array');

    _defineProperty(_assertThisInitialized(_this), "addTest", _this.makeAddTest());

    _this.shape = shape;
    if (msg) _this.parseErrorMsg = msg;

    _this.addTest(function (v) {
      return Array.isArray(v);
    }, _this.parseErrorMsg);

    return _this;
  }

  _createClass(OKArray, [{
    key: "setContext",
    value: function setContext(input, ndx) {
      if (!input) return;
      this.shape.__parent = input;
      this.shape.__root = this.__root || input;
      this.shape.__path = this.__path.concat(String(ndx));
    }
  }, {
    key: "validate",
    value: function validate(input) {
      var _this2 = this;

      var superRes = _get(_getPrototypeOf(OKArray.prototype), "validate", this).call(this, input);

      if (!superRes.valid) return superRes;
      var errors = input.map(function (el, ndx) {
        _this2.setContext(input, ndx);

        return _this2.shape.validate(el);
      });
      var foundError = errors.some(function (e) {
        return !e.valid;
      });
      if (foundError) return this.error(errors.map(function (e) {
        return e.error;
      }));
      return this.success();
    }
  }, {
    key: "validateAsync",
    value: async function validateAsync(input) {
      var _this3 = this;

      var superRes = await _get(_getPrototypeOf(OKArray.prototype), "validateAsync", this).call(this, input);
      if (!superRes.valid) return superRes;
      var errors = await Promise.all(input.map(function (el, ndx) {
        _this3.setContext(input, ndx);

        return _this3.shape.validateAsync(el);
      }));
      var foundError = errors.some(function (e) {
        return !e.valid;
      });
      if (foundError) return this.error(errors.map(function (e) {
        return e.error;
      }));
      return this.success();
    }
  }, {
    key: "cast",
    value: function cast(input) {
      var _this4 = this;

      if (!Array.isArray(input)) {
        throw new _errors.ValidationRuntimeError({
          message: this.parseErrorMsg,
          originalError: new Error("Cannot cast ".concat(_typeof(input), " to array"))
        });
      }

      return input.map(function (el) {
        return _this4.shape.cast(el);
      });
    }
  }, {
    key: "length",
    value: function length(len, msg) {
      this.addTest(function (v) {
        return v.length === len;
      }, msg || "Must have length ".concat(len));
      return this;
    }
  }, {
    key: "min",
    value: function min(_min, msg) {
      this.addTest(function (v) {
        return v.length >= _min;
      }, msg || "Must have length greater than or equal to ".concat(_min));
      return this;
    }
  }, {
    key: "max",
    value: function max(_max, msg) {
      this.addTest(function (v) {
        return v.length <= _max;
      }, msg || "Must have length less than or equal to ".concat(_max));
      return this;
    }
  }]);

  return OKArray;
}(_any.default);

var _default = OKArray;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _any = _interopRequireDefault(require("./any"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var parseBoolean = function parseBoolean(val) {
  if (typeof val === 'string') {
    var isEmpty = val.trim() === '';
    if (isEmpty) return null;else if (val === 'true') return true;else if (val === 'false') return false;else return val;
  }

  return val;
};

var OKBoolean = function (_OKAny) {
  _inherits(OKBoolean, _OKAny);

  function OKBoolean(msg) {
    var _this;

    _classCallCheck(this, OKBoolean);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OKBoolean).call(this));

    _defineProperty(_assertThisInitialized(_this), "addTest", _this.makeAddTest());

    _this.transform(parseBoolean);

    _this.addTest(function (v) {
      return typeof v === 'boolean';
    }, msg || 'Must be a boolean');

    return _this;
  }

  return OKBoolean;
}(_any.default);

var _default = OKBoolean;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationRuntimeError = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ValidationRuntimeError = function (_Error) {
  _inherits(ValidationRuntimeError, _Error);

  function ValidationRuntimeError(params) {
    var _this;

    _classCallCheck(this, ValidationRuntimeError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ValidationRuntimeError).call(this));

    _defineProperty(_assertThisInitialized(_this), "originalError", void 0);

    _this.message = params.message;
    _this.originalError = params.originalError;
    return _this;
  }

  return ValidationRuntimeError;
}(_wrapNativeSuper(Error));

exports.ValidationRuntimeError = ValidationRuntimeError;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ok = _interopRequireDefault(require("./ok"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _ok.default;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _any = _interopRequireDefault(require("./any"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var parseNumber = function parseNumber(val) {
  if (typeof val === 'string') {
    var isEmpty = val.trim() === '';
    if (isEmpty) return null;else return Number(val);
  }

  if (typeof val === 'number' || val === null || val === undefined) return val;
  return NaN;
};

var OKNumber = function (_OKAny) {
  _inherits(OKNumber, _OKAny);

  function OKNumber(msg) {
    var _this;

    _classCallCheck(this, OKNumber);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OKNumber).call(this));

    _defineProperty(_assertThisInitialized(_this), "addTest", _this.makeAddTest());

    _this.transform(parseNumber);

    _this.addTest(function (v) {
      return typeof v === 'number' && !Number.isNaN(v);
    }, msg || 'Must be a number');

    return _this;
  }

  _createClass(OKNumber, [{
    key: "min",
    value: function min(_min, msg) {
      this.addTest(function (v) {
        return v >= _min;
      }, msg || "Must be greater than or equal to ".concat(_min));
      return this;
    }
  }, {
    key: "max",
    value: function max(_max, msg) {
      this.addTest(function (v) {
        return v <= _max;
      }, msg || "Must be less than or equal to ".concat(_max));
      return this;
    }
  }, {
    key: "lessThan",
    value: function lessThan(x, msg) {
      this.addTest(function (v) {
        return v < x;
      }, msg || "Must be less than ".concat(x));
      return this;
    }
  }, {
    key: "moreThan",
    value: function moreThan(x, msg) {
      this.addTest(function (v) {
        return v > x;
      }, msg || "Must be greater than ".concat(x));
      return this;
    }
  }, {
    key: "positive",
    value: function positive(msg) {
      this.addTest(function (v) {
        return v > 0;
      }, msg || "Must be positive");
      return this;
    }
  }, {
    key: "negative",
    value: function negative(msg) {
      this.addTest(function (v) {
        return v < 0;
      }, msg || "Must be negative");
      return this;
    }
  }, {
    key: "integer",
    value: function integer(msg) {
      this.addTest(function (v) {
        return Number.isInteger(v);
      }, msg || 'Must be an integer');
      return this;
    }
  }, {
    key: "transform",
    value: function transform(transformFn) {
      this.transforms.push(transformFn);
      return this;
    }
  }]);

  return OKNumber;
}(_any.default);

var _default = OKNumber;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _any = _interopRequireDefault(require("./any"));

var _errors = require("./errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isObject(v) {
  return _typeof(v) === 'object' && v !== null && !Array.isArray(v);
}

var OKObject = function (_OKAny) {
  _inherits(OKObject, _OKAny);

  function OKObject(shape, msg) {
    var _this;

    _classCallCheck(this, OKObject);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OKObject).call(this));

    _defineProperty(_assertThisInitialized(_this), "shape", void 0);

    _defineProperty(_assertThisInitialized(_this), "parseErrorMsg", 'Must be an object');

    _defineProperty(_assertThisInitialized(_this), "addTest", _this.makeAddTest());

    _this.shape = shape;
    if (msg) _this.parseErrorMsg = msg;

    _this.addTest(isObject, _this.parseErrorMsg);

    return _this;
  }

  _createClass(OKObject, [{
    key: "iterateShape",
    value: function iterateShape(input) {
      var _this2 = this;

      if (!input) return [];
      return Object.keys(this.shape).map(function (key) {
        var ok = _this2.shape[key];
        var val = input[key];
        return {
          ok: ok,
          val: val,
          key: key
        };
      });
    }
  }, {
    key: "setContext",
    value: function setContext(input) {
      var _this3 = this;

      if (!input) return;
      Object.keys(this.shape).forEach(function (key) {
        var ok = _this3.shape[key];
        ok.__parent = input;
        ok.__root = _this3.__root || input;
        ok.__path = _this3.__path.concat(key);
      });
    }
  }, {
    key: "validate",
    value: function validate(input) {
      this.setContext(input);

      var superRes = _get(_getPrototypeOf(OKObject.prototype), "validate", this).call(this, input);

      if (!superRes.valid) return superRes;
      var foundError = false;
      var error = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.iterateShape(input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref2 = _step.value;
          var ok = _ref2.ok,
              val = _ref2.val,
              _key = _ref2.key;
          var res = ok.validate(val);

          if (!res.valid) {
            foundError = true;
            error[_key] = res.error;
          }
        }
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

      if (foundError) return this.error(error);
      return this.success();
    }
  }, {
    key: "validateAsync",
    value: async function validateAsync(input) {
      this.setContext(input);
      var superRes = await _get(_getPrototypeOf(OKObject.prototype), "validateAsync", this).call(this, input);
      if (!superRes.valid) return superRes;
      var foundError = false;
      var error = {};
      await Promise.all(this.iterateShape(input).map(async function (_ref3) {
        var ok = _ref3.ok,
            val = _ref3.val,
            key = _ref3.key;
        var res = await ok.validateAsync(val);

        if (!res.valid) {
          foundError = true;
          error[key] = res.error;
        }
      }));
      if (foundError) return this.error(error);
      return this.success();
    }
  }, {
    key: "cast",
    value: function cast(input) {
      if (!isObject(input)) {
        throw new _errors.ValidationRuntimeError({
          message: this.parseErrorMsg,
          originalError: new Error("Cannot cast ".concat(_typeof(input), " to object"))
        });
      }

      var newInput = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.iterateShape(input)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ref5 = _step2.value;
          var ok = _ref5.ok,
              val = _ref5.val,
              _key2 = _ref5.key;
          newInput[_key2] = ok.cast(val);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var context = this.getContext();
      return this.transforms.reduce(function (prevValue, fn) {
        return fn(prevValue, context);
      }, newInput);
    }
  }]);

  return OKObject;
}(_any.default);

var _default = OKObject;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _any = _interopRequireDefault(require("./any"));

var _array = _interopRequireDefault(require("./array"));

var _boolean = _interopRequireDefault(require("./boolean"));

var _number = _interopRequireDefault(require("./number"));

var _object = _interopRequireDefault(require("./object"));

var _string = _interopRequireDefault(require("./string"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ok = {
  any: function any() {
    return new _any.default();
  },
  array: function array(shape, msg) {
    return new _array.default(shape, msg);
  },
  boolean: function boolean(msg) {
    return new _boolean.default(msg);
  },
  number: function number(msg) {
    return new _number.default(msg);
  },
  object: function object(shape, msg) {
    return new _object.default(shape, msg);
  },
  string: function string(msg) {
    return new _string.default(msg);
  }
};
var _default = ok;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _any = _interopRequireDefault(require("./any"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var parseString = function parseString(val) {
  if (val === null || val === undefined) return val;else if (typeof val === 'string') return val;else if (_typeof(val) === 'object') return val;else return String(val);
};

var OKString = function (_OKAny) {
  _inherits(OKString, _OKAny);

  function OKString(msg) {
    var _this;

    _classCallCheck(this, OKString);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OKString).call(this));

    _defineProperty(_assertThisInitialized(_this), "addTest", _this.makeAddTest());

    _this.transform(parseString);

    _this.addTest(function (v) {
      return typeof v === 'string';
    }, msg || 'Must be a string');

    return _this;
  }

  _createClass(OKString, [{
    key: "length",
    value: function length(len, msg) {
      this.addTest(function (v) {
        return v.length === len;
      }, msg || "Must have length ".concat(len));
      return this;
    }
  }, {
    key: "min",
    value: function min(_min, msg) {
      this.addTest(function (v) {
        return v.length >= _min;
      }, msg || "Must have length greater than or equal to ".concat(_min));
      return this;
    }
  }, {
    key: "max",
    value: function max(_max, msg) {
      this.addTest(function (v) {
        return v.length <= _max;
      }, msg || "Must have length less than or equal to ".concat(_max));
      return this;
    }
  }, {
    key: "matches",
    value: function matches(regex, msg) {
      this.addTest(function (v) {
        return regex.test(v);
      }, msg || "Must match regular expression: ".concat(regex.toString()));
      return this;
    }
  }, {
    key: "email",
    value: function email(msg) {
      this.addTest(function (v) {
        return emailRegex.test(v);
      }, msg || "Must be an email address");
      return this;
    }
  }]);

  return OKString;
}(_any.default);

var _default = OKString;
exports.default = _default;

//# sourceMappingURL=index.js.map