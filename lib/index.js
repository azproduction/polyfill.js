var fs = require('fs');
var path = require('path');
var glob = require('glob').sync;
var extend = require('node.extend');

/**
 * Hash of synchronous functions or path strings
 *
 * @type {Object}
 *
 * @example
 *  {
 *      "SomePolyfill": "/full/path/to/SomePolyfill.js",
 *      "Poly.prototype.fill": function () {
 *          return fs.readFileSync("/full/path/to/Poly.prototype.fill.js");
 *      }
 *  }
 */
var polyfills = {
    JSON: path.join(__dirname, 'node_modules/json3/lib/json3.js')
};

// Collect all polyfills from all dirs
glob(path.join(__dirname, '../polyfills/**/*.js')).forEach(function (file) {
    polyfills[path.basename(file, '.js')] = file;
});

/**
 * Returns list of polyfills if no arguments passed
 * Checks polyfill if only `featureName` passed
 * Loads polyfill if `featureName` and `callback` are passed
 *
 *
 * @param {String} [featureName]
 * @param {Function} [callback]
 * @returns {Object|Boolean}
 *
 * @throws Error if no polyfill defined for `featureName`
 */
function fill(featureName, callback) {
    if (!featureName) {
        return Object.keys(polyfills);
    }

    var polyfill = polyfills[featureName];

    if (!callback) {
        return !!polyfill;
    }

    if (!polyfill) {
        callback(new Error('Unknown feature: ' + featureName));
        return;
    }

    if (typeof polyfill === 'function') {
        // Case if polyfill is function
        callback(null, polyfill());
        return;
    }

    // Case if polyfill is string
    fs.readFile(polyfill, 'utf8', callback);
}

/**
 * Loads polyfill if `featureName`
 *
 *
 * @param {String} featureName
 * @returns {String}
 *
 * @throws Error if no polyfill defined for `featureName`
 */
function fillSync(featureName) {
    var polyfill = polyfills[featureName];

    if (!polyfill) {
        throw new Error('Unknown feature: ' + featureName);
    }

    if (typeof polyfill === 'function') {
        // Case if polyfill is function
        return polyfill();
    }

    return fs.readFileSync(polyfill, 'utf8');
}

/**
 * @param {Object} extraPolyfills
 *
 * @example Hash of synchronous functions or path strings
 *
 * register({
 *      "SomePolyfill": "/full/path/to/SomePolyfill.js",
 *      "Poly.prototype.fill": function () {
 *          return fs.readFileSync("/full/path/to/Poly.prototype.fill.js");
 *      }
 * });
 *
 */
function register(extraPolyfills) {
    extend(polyfills, extraPolyfills);
}

module.exports = fill;
module.exports.sync = fillSync;
module.exports.register = register;
