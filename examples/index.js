var Classes = require('../classes');

/* ----------------------------- БИБЛИОТЕКА (Пишется и поставляется Пупкиным В.) ---------------------------- */

Classes.name('Lib');

Classes.Lib.decl('Base', {
    public: {
        constructor: function() {
            this._hash = 'empty';
        },

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
    extend: Classes.Lib.Base,

    public: {
        constructor: function() {
            this.buildHash();
        },

        toString: function() {
            return this.getHash();
        }
    }
});

/* --------------------------------- ПРИЛОЖЕНИЕ (Пишется Шапкиным Г.) ----------------------------- */

Classes.name('App');

Classes.App.decl('Helpers', {
    staticPublic: {
        getHash: function() {
            var hash = new Classes.Lib.Hash();

            // Попытка изменить приватное поле после инициализации
            hash._hash = null;

            // Да и вообще отстрелить себе чего-нибудь =)
            hash.toString = function() {
                return 'fake hash';
            }

            return String(hash);
        }
    }
});

// Выведет hash, сгенеренный библиотекой Пупкина,
// как-будто изменений Шапкина и не было.
//
// В Classes нельзя так просто взять и переопределить
// чьё-нибудь приватное поле =)
console.log(Classes.App.Helpers.getHash());
