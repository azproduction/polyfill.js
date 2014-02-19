/*global test, suite*/
/*jshint expr:true*/

var assert = require('assert');

var polyfill = require('..');

suite('Simple');

test('test feature existence', function() {
    assert.ok(polyfill('Array.prototype.every'));
    assert.ok(polyfill('Array.prototype.filter'));
    assert.ok(polyfill('Array.prototype.forEach'));
    assert.ok(polyfill('Array.prototype.reduce'));
    assert.ok(polyfill('Date.now'));
});

test('test feature non-existence', function() {
    assert.ok(!polyfill('String.prototype.blink'));
    assert.ok(!polyfill('foo'));
});

test('check existence of feature code', function(done) {
    polyfill('Array.prototype.every', function(error, code) {
        assert.ifError(error);
        assert.ok(code.indexOf('Array.prototype.every') >= 0);
        done();
    });
});

test('check existence of all features', function() {
    assert.ok(typeof polyfill() === 'object');
});

test('throws exception if no polyfill', function() {
    polyfill('PewPew', function (error) {
        assert.ok(error !== null, 'Should throw Exception');
    });
});

test('register polyfill', function() {
    var code = 'var MyPolyFill = 42;';

    polyfill.register({
        'MyPolyFill': function () {
            return code;
        }
    });

    polyfill('MyPolyFill', function (error, polyfillCode) {
        assert.ifError(error);
        assert.ok(polyfillCode === code);
    });
});

test('polyfill sync throws exception if no polyfill', function () {
    try {
        polyfill.sync('Undefined');
        assert.ok(false, 'Exception should be thrown');
    } catch (e) {
        assert.ok(true, 'Exception should be thrown');
    }
});

test('polyfill sync loads polyfill from file if it is string', function () {
    var code = polyfill.sync('Array.prototype.every');
    assert.ok(code.indexOf('Array.prototype.every') >= 0);
});

test('polyfill sync calls polyfill if it is function', function () {
    var code = 'var MyPolyFill = 43;';

    polyfill.register({
        'MyPolyFill': function () {
            return code;
        }
    });

    var polyfillCode = polyfill.sync('MyPolyFill');
    assert.ok(polyfillCode === code);
});

test('polyfill.register can overwrite polyfill', function () {
    var code = 'var MyPolyFill = 43;';

    polyfill.register({
        'MyPolyFill': '/dev/null'
    });

    polyfill.register({
        'MyPolyFill': function () {
            return code;
        }
    });

    var polyfillCode = polyfill.sync('MyPolyFill');
    assert.ok(polyfillCode === code);
});
