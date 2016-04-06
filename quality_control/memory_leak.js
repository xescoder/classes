/* global gc */

var Classes = require('../classes.js'),
    startMemoryUsage = 0,
    memoryLeak = 0;

Classes.decl('RandomString', {

    private: {
        _string: 'test test test test test test test test test',
        _number: 123456789
    },

    public: {
        getString: function() {
            return this._string;
        },

        getNumber: function() {
            return this._number;
        }
    }

});

gc();
startMemoryUsage = process.memoryUsage().heapUsed;

var obj, i;

for (i = 0; i < 100000; i++) {
    obj = new Classes.RandomString();
    delete obj; // jshint ignore:line
}

delete i; // jshint ignore:line

gc();
memoryLeak = process.memoryUsage().heapUsed - startMemoryUsage;

if (memoryLeak > 0) {
    console.error('Memory leak: ' + memoryLeak);
} else {
    console.log('Not memory leak');
}
