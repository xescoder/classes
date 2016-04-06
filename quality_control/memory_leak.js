var Classes = require('../classes.js'),
    startMemoryUsage = 0,
    memoryLeak = 0;

Classes.decl('RandomString', {

    private: {

        _getRandom: function(min, max) {
            return Math.random() * (max - min) + min;
        },

        _getChar: function() {
            var code = this._getRandom(0, 256);
            return String.fromCharCode();
        },

        _getLength: function() {
            return this._getRandom(10, 100);
        },

        _generateStr: function() {
            var len = this._getLength(), i;

            this._str = '';
            for (i = 0; i < len; i++) {
                this._str += this._getChar();
            }
        }

    },

    public: {

        constructor: function() {
            this._generateStr();
        },

        getString: function() {
            return this._str;
        }
    }

});

startMemoryUsage = process.memoryUsage().heapUsed;

var list = [], i;

for (i = 0; i < 100000; i++) {
    list.push(new Classes.RandomString());
}

delete list;
delete i;
gc();

memoryLeak = process.memoryUsage().heapUsed - startMemoryUsage;

if (memoryLeak > 0) {
    console.error('Memory leak');
} else {
    console.log('Not memory leak');
}
