var chai = require('chai'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.assert = chai.assert;
global.sinon = require('sinon');
global._ = require('lodash');

global.sinon.assert.expose(global.assert, { prefix: '' });

global.getClasses = function() {
    return requireNoCache('../../classes.js');
};

function requireNoCache(filePath) {
    delete require.cache[require.resolve(filePath)];
    return require(filePath);
}
