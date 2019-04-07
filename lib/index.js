function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { ValidationRuntimeError } from './errors';

function checkNullish(value) {
  // null, undefined, empty string all considered nullish
  return value === null || value === undefined || value === '';
}

class OKAny {
  /* Instance keeping track of stuff */
  // @internal
  // @internal
  // @internal
  // No validation message, because any excepts anything!
  constructor() {
    _defineProperty(this, "isNullable", false);

    _defineProperty(this, "requiredMessage", 'Required');

    _defineProperty(this, "tests", []);

    _defineProperty(this, "transforms", []);

    _defineProperty(this, "__parent", void 0);

    _defineProperty(this, "__root", void 0);

    _defineProperty(this, "__path", []);

    _defineProperty(this, "makeAddTest", () => (predicate, msg) => {
      const testFn = val => predicate(val) ? null : msg;

      this.tests.push({
        testFn,
        skipIfNull: true
      });
    });
  }
  /* Internal */


  error(msg, validationError) {
    return {
      valid: false,
      error: msg,
      validationError: validationError || null
    };
  }

  success() {
    return {
      valid: true,
      error: null,
      validationError: null
    };
  }

  getContext() {
    const parent = this.__parent;
    const root = this.__root;
    const path = this.__path;
    return {
      parent,
      root,
      path
    };
  } // If the predicate returns true, the test passes, and the value is ok
  // if it returns false, the error message will be returned
  // These tests will be skipped if the value is null and field is marked
  // nullable, because it doesn't make sense to apply them to a null value


  /**
   * Build schema
   */
  nullable() {
    this.isNullable = true;
    return this;
  }

  transform(transformFn) {
    this.transforms.push(transformFn);
    return this;
  }

  test(testFn) {
    this.tests.push({
      testFn
    });
    return this;
  }
  /**
   * @param msg Error message if field is empty (empty string, null, undefined)
   */


  required(msg) {
    if (msg) {
      this.requiredMessage = msg;
    }

    return this;
  }
  /**
   * Call after schema is defined
   */


  cast(input) {
    const context = this.getContext();
    return this.transforms.reduce((prevValue, fn) => fn(prevValue, context), input);
  }

  validate(input) {
    try {
      const value = this.cast(input);
      const isNullish = checkNullish(value);

      if (isNullish && !this.isNullable) {
        return this.error(this.requiredMessage);
      }

      const context = this.getContext();

      for (const _ref of this.tests) {
        const {
          testFn,
          skipIfNull
        } = _ref;

        if (isNullish && skipIfNull) {
          continue;
        }

        const res = testFn(value, context);
        if (res instanceof OKAny) return res.validate(value);else if (typeof res === 'string') return this.error(res);
      }

      return this.success();
    } catch (err) {
      // An error thrown by use (ex: impossible cast request)
      if (err instanceof ValidationRuntimeError) {
        return this.error(err.message, err);
      } else {
        // Unknown error
        const runtimeError = new ValidationRuntimeError({
          message: err.message,
          originalError: err
        });
        return this.error('Invalid', runtimeError);
      }
    }
  }

}

export default OKAny;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import OKAny from './any';
import { ValidationRuntimeError } from './errors';

class OKArray extends OKAny {
  constructor(shape, msg) {
    super();

    _defineProperty(this, "shape", void 0);

    _defineProperty(this, "parseErrorMsg", 'Must be an array');

    _defineProperty(this, "addTest", this.makeAddTest());

    this.shape = shape;
    if (msg) this.parseErrorMsg = msg;
    this.addTest(v => Array.isArray(v), this.parseErrorMsg);
  }

  setContext(input, ndx) {
    // If input in null return immediately
    if (!input) return;
    this.shape.__parent = input; // If this already has a root, pass in that one

    this.shape.__root = this.__root || input;
    this.shape.__path = this.__path.concat(String(ndx));
  }
  /* Call after schema is defined */


  validate(input) {
    // Generic validation
    const superRes = super.validate(input);
    if (!superRes.valid) return superRes;
    const errors = input.map((el, ndx) => {
      this.setContext(input, ndx);
      return this.shape.validate(el);
    });
    const foundError = errors.some(e => !e.valid); // typescript cannot comprehend that they are all of the same type

    if (foundError) return this.error(errors.map(e => e.error));
    return this.success();
  } // Override cast behavior so that all elements get cast


  cast(input) {
    // If we are trying to cast something that is not an array give up
    if (!Array.isArray(input)) {
      throw new ValidationRuntimeError({
        message: this.parseErrorMsg,
        originalError: new Error(`Cannot cast ${typeof input} to array`)
      });
    }

    return input.map(el => this.shape.cast(el));
  }

}

export default OKArray;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import OKAny from './any';

const parseBoolean = val => {
  if (typeof val === 'string') {
    // For strings, any string of spaces is considered empty
    const isEmpty = val.trim() === '';
    if (isEmpty) return null; // If it isn't empty, check if it is the string true or false
    else if (val === 'true') return true;else if (val === 'false') return false;else return val;
  } // Everything else is returned directly


  return val;
};

class OKBoolean extends OKAny {
  constructor(msg) {
    super();

    _defineProperty(this, "addTest", this.makeAddTest());

    this.transform(parseBoolean);
    this.addTest(v => typeof v === 'boolean', msg || 'Must be a boolean');
  }

}

export default OKBoolean;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class ValidationRuntimeError extends Error {
  constructor(params) {
    super();

    _defineProperty(this, "originalError", void 0);

    this.message = params.message;
    this.originalError = params.originalError;
  }

}
import ok from './ok';
export default ok;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import OKAny from './any';

const parseNumber = val => {
  if (typeof val === 'string') {
    // For strings, any string of spaces is considered empty
    const isEmpty = val.trim() === '';
    if (isEmpty) return null; // If it isn't empty, it is parsed with Number
    else return Number(val);
  } // Numbers, null, undefined are returned directly


  if (typeof val === 'number' || val === null || val === undefined) return val; // Everything else is considered not a number

  return NaN;
};

class OKNumber extends OKAny {
  constructor(msg) {
    super();

    _defineProperty(this, "addTest", this.makeAddTest());

    this.transform(parseNumber);
    this.addTest(v => typeof v === 'number' && !Number.isNaN(v), msg || 'Must be a number');
  }

  min(min, msg) {
    this.addTest(v => v >= min, msg || `Must be greater than or equal to ${min}`);
    return this;
  }

  max(max, msg) {
    this.addTest(v => v <= max, msg || `Must be less than or equal to ${max}`);
    return this;
  }

  integer(msg) {
    this.addTest(v => Number.isInteger(v), msg || 'Must be an integer');
    return this;
  }

  transform(transformFn) {
    this.transforms.push(transformFn);
    return this;
  }

}

export default OKNumber;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import OKAny from './any';
import { ValidationRuntimeError } from './errors';

function isObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

class OKObject extends OKAny {
  constructor(shape, msg) {
    super();

    _defineProperty(this, "shape", void 0);

    _defineProperty(this, "parseErrorMsg", 'Must be an object');

    _defineProperty(this, "addTest", this.makeAddTest());

    this.shape = shape;
    if (msg) this.parseErrorMsg = msg;
    this.addTest(isObject, this.parseErrorMsg);
  }

  // Returns list of shape, with child OK's populated with parent + root
  iterateShape(input) {
    // If input in null return immediately
    if (!input) return [];
    return Object.entries(this.shape).map(([key, ok]) => {
      const val = input[key];
      return {
        ok,
        val,
        key
      };
    });
  }

  setContext(input) {
    // If input in null return immediately
    if (!input) return;
    Object.entries(this.shape).forEach(([key, ok]) => {
      ok.__parent = input; // If this already has a root, pass in that one

      ok.__root = this.__root || input;
      ok.__path = this.__path.concat(key);
    });
  }
  /* Call after schema is defined */


  validate(input) {
    this.setContext(input); // Generic validation

    const superRes = super.validate(input);
    if (!superRes.valid) return superRes; // Each key

    let foundError = false;
    const error = {};

    for (const _ref of this.iterateShape(input)) {
      const {
        ok,
        val,
        key
      } = _ref;
      const res = ok.validate(val);

      if (!res.valid) {
        foundError = true;
        error[key] = res.error;
      }
    }

    if (foundError) return this.error(error);
    return this.success();
  } // Override cast behavior so that children get cast


  cast(input) {
    // If we are trying to cast something that is not an object give up
    if (!isObject(input)) {
      throw new ValidationRuntimeError({
        message: this.parseErrorMsg,
        originalError: new Error(`Cannot cast ${typeof input} to object`)
      });
    }

    const newInput = {};

    for (const _ref2 of this.iterateShape(input)) {
      const {
        ok,
        val,
        key
      } = _ref2;
      newInput[key] = ok.cast(val);
    }

    const context = this.getContext();
    return this.transforms.reduce((prevValue, fn) => fn(prevValue, context), newInput);
  }

}

export default OKObject;
import OKAny from './any';
import OKArray from './array';
import OKBoolean from './boolean';
import OKNumber from './number';
import OKObject from './object';
import OKString from './string';
const ok = {
  any: () => new OKAny(),
  array: (shape, msg) => new OKArray(shape, msg),
  boolean: msg => new OKBoolean(msg),
  number: msg => new OKNumber(msg),
  object: (shape, msg) => new OKObject(shape, msg),
  string: msg => new OKString(msg)
};
export default ok;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import { isEmail, isURL } from 'validator';
const isEmail = str => true;

const isURL = str => true;

import OKAny from './any';

const parseString = val => {
  if (val === null || val === undefined) return val;else if (typeof val === 'string') return val;else if (typeof val === 'object') return val;else return String(val);
};

class OKString extends OKAny {
  constructor(msg) {
    super();

    _defineProperty(this, "addTest", this.makeAddTest());

    this.transform(parseString);
    this.addTest(v => typeof v === 'string', msg || 'Must be a string');
  }

  length(len, msg) {
    this.addTest(v => v.length === len, msg || `Must have length ${len}`);
    return this;
  }

  min(min, msg) {
    this.addTest(v => v.length >= min, msg || `Must have length greater than or equal to ${min}`);
    return this;
  }

  max(max, msg) {
    this.addTest(v => v.length <= max, msg || `Must have length less than or equal to ${max}`);
    return this;
  }

  matches(regex, msg) {
    this.addTest(v => regex.test(v), msg || `Must match regular expression: ${regex.toString()}`);
    return this;
  }

  email(msg) {
    this.addTest(v => isEmail(v), msg || `Must be an email address`);
    return this;
  }

  url(msg) {
    this.addTest(v => isURL(v), msg || `Must be a url`);
    return this;
  }

}

export default OKString;

//# sourceMappingURL=index.js.map