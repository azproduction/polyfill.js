module.exports = process.env.POLYFILL_COVERAGE ?
    require('./lib-cov') :
    require('./lib');
