var chai = require('chai');

global.assert = chai.assert;
global.sinon = require('sinon');
global._ = require('lodash');

global.getClasses = function() {
    return require('../../classes.js');
};
