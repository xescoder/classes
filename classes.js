var Classes = (function() {

    var $ = {}, // public fields
        _ = {}; // private fields

    /**
     * Перечисление поддерживаемых типов классов
     */
    $.TYPES = {
        CLASS: 'Class'
    };

    /**
     * Возвращает название типа
     *
     * @param {Mixed} value - Значение
     * @returns {String}
     */
    $.getType = function(value) {

        if (value === null) {
            return 'Null';
        }

        // Ленивая инициализация regexp для определения типа
        var key = 'typeRegExp',
            typeRegExp = _.getCache(key) || _.setCache(key, /object|function/);

        if (typeRegExp.test(typeof(value)) && value.__type__) {
            return value.__type__;
        }

        return Object.prototype
            .toString
            .call(value)
            .slice(8, -1);

    };

    /**
     * Включает тестовый режим работы
     */
    $.enableTestMode = function() {
        _.setProto($, _);
    };

    /**
     * Устанавливает значение приватного поля Classes
     *
     * @private
     * @param {String} prop - Название приватного поля
     * @param {Mixes} value - Устанавливаемое значение
     */
    _.setPrivate = function(prop, value) {
        _[prop] = value;
    };

    /**
     * Возвращает true, если переданное значение является функцией
     *
     * @private
     * @param {Mixed} value - Значение
     * @returns {Boolean}
     */
    _.isFunction = function(value) {
        return typeof(value) === 'function';
    };

    /**
     * Возвращает прототип объекта
     *
     * @private
     * @param {Object} obj - Объект
     * @returns {Object}
     */
    _.getProto = function(obj) {
        return obj.__proto__;
    };

    /**
     * Устанавливает прототип объекту
     *
     * @private
     * @param {Object} obj - Объект
     * @param {Object} proto - Прототип
     */
    _.setProto = function(obj, proto) {
        obj.__proto__ = proto;
    };

    /**
     * Возвращает значение из внутреннего кэша по ключу
     *
     * @private
     * @param {String} key - Ключ
     * @returns {Mixed}
     */
    _.getCache = function(key) {
        return _.cache && _.cache[key];
    };

    /**
     * Сохраняет значение во внутренний кэш и возвращает его
     *
     * @private
     * @param {String} key - Ключ
     * @param {Mixed} value - Значение
     * @returns {Mixed}
     */
    _.setCache = function(key, value) {
        _.cache || (_.cache = {});
        _.cache[key] = value;
        return _.cache[key];
    };

    /**
     * Клонирует значение переменной
     *
     * @private
     * @param {Mixed} value - Клонируемое значение
     * @returns {Mixed}
     */
    _.clone = function(value) {

        var copy, type;

        // Для простых типов, а также Null, Undefined и Function
        if (value === null || typeof value !== 'object') {
            return value;
        }

        type = $.getType(value);

        // Для Date
        if (type === 'Date') {

            copy = new Date();
            copy.setTime(value.getTime());
            return copy;

        }

        // Для Array
        if (type === 'Array') {

            copy = [];
            for (var i = 0, len = value.length; i < len; i++) {
                copy[i] = _.clone(value[i]);
            }
            return copy;

        }

        // Для всех остальных (Object)
        copy = {};
        for (var attr in value) {
            if (value.hasOwnProperty(attr)) {
                copy[attr] = _.clone(value[attr]);
            }
        }
        return copy;

    };

    /**
     * Возвращает true если имя класса недопустимо
     *
     * @private
     * @param {Object} obj - Объект, в котором будет сохранён класс
     * @param {String} name - Имя класса
     * @returns {Boolean}
     */
    _.isForbiddenName = function(obj, name) {
        return obj.hasOwnProperty(name);
    };

    /**
     * Создаёт новый класс
     *
     * @private
     * @param {String} name - Имя класса
     * @param {Function} constructor - Конструктор класса
     */
    _.createClass = function(name, constructor) {

        if (_.isForbiddenName($, name)) {
            return;
        }

        constructor.__type__ = $.TYPES.CLASS;
        constructor.prototype.__type__ = name;

        $[name] = constructor;

    };

    /**
     * Копирует свойства объекта
     *
     * @private
     * @param {Object} body - Тело декларации класса
     * @returns {Object}
     */
    _.copyProps = function(body) {

        var props = {
                public: null,
                private: null
            },
            mod, key;

        // Копируем свойства объекта из декларации
        for (mod in props) {
            props[mod] = _.clone(body[mod] || {});
        }

        // Устанавливаем контекст для всех функций
        for (mod in props) {
            for (key in props[mod]) {
                if (_.isFunction(props[mod][key])) {
                    props[mod][key] = props[mod][key].bind(props.private);
                }
            }
        }

        // Связываем приватную область видимости и публичную
        _.setProto(props.private, props.public);

        return props;

    };

    /**
     * Создаёт публичный конструктор класса
     *
     * @private
     * @param {Object} body - Тело декларации класса
     * @returns {Function}
     */
    _.createPublicConstructor = function(body) {

        return function() {

            var props = _.copyProps(body),
                constructor = props.public.constructor;

            delete props.public.constructor;

            for (var key in props.public) {
                this[key] = props.public[key];
            }

            if (_.isFunction(constructor)) {
                constructor.apply(props.private, arguments);
            }

        };

    };

    /**
     * Декларирует новый класс
     *
     * @param {String} name - Имя класса
     * @param {Object} body - Тело класса
     */
    $.decl = function(name, body) {
        _.createClass(name, _.createPublicConstructor(body));
    };

    return $;

})();

if (module && module.parent) {
    module.exports = Classes;
    return;
}


/* ================================ Проверка ================================== */

Classes.decl('Test', {

    public: {

        constructor: function(param) {
            this._param.value = param;
        },

        getValue: function() {
            return this.getPrefixPublic() + ':' + this._param.value;
        },

        setPrefix: function(prefix) {
            this._prefix = prefix;
        },

        getPrefixPublic: function() {
            return this._getPrefix();
        }

    },

    private: {

        _param: {
            value: 1
        },

        _getPrefix: function() {
            return this._prefix;
        }

    }

});

var test = new Classes.Test(123),
    test1 = new Classes.Test(2);

test.setPrefix('good');

console.log(Classes);
console.log();

console.log(test);
console.log();

console.log(test.getValue());
console.log();

console.log(test instanceof Classes.Test);


