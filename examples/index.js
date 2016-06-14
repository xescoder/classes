// При помощи C вы легко можете выстрелить себе в ногу. При помощи C++ это сделать сложнее, но если это произойдёт, вам оторвёт всю ногу целиком.
// Бьярн Страуструп, автор C++

var Classes = require('../classes');

/* ----------------------------- БИБЛИОТЕКА (Пишется и поставляется Пупкиным В.) ---------------------------- */

Classes.name('Lib');

Classes.Lib.decl('HashBase', {
    public: {
        getHash: function() {
            return this._hash;
        }
    },

    protected: {
        buildHash: function() {
            var value = this._getRandom(1000000, 100000000),
                base = this._getRandom(24, 36),
                maxLen = 32;

            this._hash = value.toString(base).substr(0, maxLen);
        }
    },

    private: {
        _hash: '',

        _getRandom: function(min, max) {
            return Math.random() * (max - min) + min;
        }
    }
});

Classes.Lib.decl('Hash', {
    extend: Classes.Lib.HashBase,

    public: {
        init: function() {
            this.buildHash();
        },

        toString: function() {
            return this.getHash();
        }
    }
});

/* --------------------------------- ПРИЛОЖЕНИЕ (Пишется Шапкиным Г.) ----------------------------- */

var hash = new Classes.Lib.Hash();

// Попытка изменить приватное поле после инициализации
hash._hash = {};

// Да и вообще отстрелить себе чего-нибудь
hash.getHash = function() {
    return 'fake hash';
};

// Неоднократно...
delete hash.buildHash;
hash._getRandom = 'rnd';

// Но как ни странно console.log выведет hash,
// сгенеренный библиотекой Пупкина,
// как-будто изменений Шапкина и не было.
//
// В Classes нельзя так просто взять и переопределить
// чьё-нибудь приватное поле =)
console.log(String(hash));
