'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./ok-form.cjs.min.js');
} else {
  module.exports = require('./ok-form.cjs.js');
}