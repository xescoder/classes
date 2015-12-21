var chai = require('chai');

global.assert = chai.assert;
global.sinon = require('sinon');
global._ = require('lodash');

global.getClasses = function() {
    return requireNoCache('../../classes.js');
};

function requireNoCache(filePath) {
    delete require.cache[require.resolve(filePath)];
    return require(filePath);
}
