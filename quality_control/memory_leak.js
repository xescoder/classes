var Classes = require('../classes.js');

Classes.decl('Base', {

    public: {
        constructor: function() {
            this._number = this._getRandom(0, 10000);
        },

        getNumber: function() {
            return this._number;
        }
    },

    protected: {
        generateStr: function() {
            var len = this._getLength(),
                str = '', i;

            for (i = 0; i < len; i++) {
                str += this._getChar();
            }

            return str;
        }
    },

    private: {
        _getRandom: function(min, max) {
            return Math.random() * (max - min) + min;
        },

        _getChar: function() {
            var code = this._getRandom(0, 256);
            return String.fromCharCode(code);
        },

        _getLength: function() {
            return this._getRandom(100, 1000);
        }
    }
});

Classes.decl('Test', {

    extend: Classes.Base,

    public: {
        constructor: function() {
            this._string = this.generateStr();
        },

        getString: function() {
            return this._string;
        }
    }

});

var obj, i;

// Если будут утечки памяти скрипт просто помрёт
for (i = 0; i < 1000000; i++) {
    obj = new Classes.Test();
    delete obj; // jshint ignore:line

    if (i % 10000 === 0) {
        console.log(i + ': ' + process.memoryUsage().heapUsed);
    }
}

console.log();
console.log('Not memory leak');
