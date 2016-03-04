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

        if (typeRegExp.test(typeof(value))) {
            if (value.__type__) {
                return value.__type__;
            }

            if (typeof(value.constructor === 'function') && value.constructor.getFullName) {
                return value.constructor.getFullName();
            }
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
     * Привязывает контекст к функции
     *
     * @private
     * @param {Object} context - Привязываемый контекст
     * @param {Object} fakeContext - Возвращаемый функцией контекст
     * @param {Function} func - Функция
     * @returns {Function}
     */
    _.bind = function(context, fakeContext, func) {

        return function() {
            var res = func.apply(context, arguments);
            return res === context ? fakeContext : res;
        };

    };

    /**
     * Копирует свойства объекта
     *
     * @private
     * @param {Object} obj - Объект назначения
     * @param {Object} source - Исходный объект
     * @param {Boolean} isFullClone - Полностью скопировать объект
     * @returns {Object}
     */
    _.assign = function(obj, source, isFullClone) {

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                obj[key] = isFullClone ? _.clone(source[key]) : source[key];
            }
        }

        return obj;

    };

    /**
     * Копирует свойства объекта
     * Предназначен для внешнего интерфейса
     *
     * @private
     * @param {Object} obj - Объект назначения
     * @param {Object} source - Исходный объект
     * @param {Object} context - Контекст для функций
     * @param {Boolean} isFullClone - Полностью скопировать объект
     * @returns {Object}
     */
    _.assignExternalInterface = function(obj, source, context, isFullClone) {

        var ignore = ['constructor'], key, value;

        for (key in source) {

            if (source.hasOwnProperty(key) && !~ignore.indexOf(key)) {

                if (_.isFunction(source[key])) {
                    value = _.bind(context, obj, source[key]);
                } else {
                    value = isFullClone ? _.clone(source[key]) : source[key];
                }

                Object.defineProperty(obj, key, {
                    configurable: false,
                    enumerable: true,
                    writable: false,
                    value: value
                });

            }

        }

        return obj;

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
            throw new Error('Classes. Не удалось создать класс: имя ' + name + ' уже занято.');
        }

        constructor.__type__ = $.TYPES.CLASS;
        constructor.prototype.__type__ = name;

        $[name] = constructor;

    };

    /**
     * Создаёт внутреннюю область видимости объекта
     *
     * @private
     * @param {Object} body - Тело декларации класса
     * @param {Object} base - Экземпляр базового класса
     * @returns {Object}
     */
    _.createInternalScope = function(body, base) {

        var scope = {},
            base = base.protected || base.public;

        scope.public = Object.create(base);
        _.assign(scope.public, body.public || {});

        scope.protected = Object.create(scope.public);
        _.assign(scope.protected, body.protected || {});

        scope.private = Object.create(scope.protected);
        _.assign(scope.private, body.private || {}, true);

        scope.private.__base = base;

        return scope;

    };

    /**
     * Создаёт внешнюю область видимости объекта
     *
     * @private
     * @param {Object} internalScope - Внутренняя область видимости объекта
     * @param {Object} base - Экземпляр базового класса
     * @param {Boolean} isProtectedNeeded - Необходим модификатор protected
     * @returns {Object}
     */
    _.createExternalScope = function(internalScope, base, isProtectedNeeded) {

        var scope = {};

        scope.public = Object.create(base.public);
        _.assignExternalInterface(scope.public, internalScope.public, internalScope.private);

        if (isProtectedNeeded) {
            scope.protected = Object.create(base.protected || base.public);
            _.assign(scope.protected, scope.public);
            _.assignExternalInterface(scope.protected, internalScope.protected, internalScope.private);
        }

        return scope;

    };

    /**
     * Создаёт экземпляр класса
     *
     * @private
     * @param {Object} body - Тело декларации класса
     * @param {Object} args - Аргументы, передаваемые в конструктор
     * @param {Boolean} isProtectedNeeded - Необходима область видимости protected в экземпляре
     * @returns {Object}
     */
    _.construct = function(body, args, isProtectedNeeded) {

        var baseBody = body.extend && body.extend.getBody(),
            base = baseBody ? _.construct(baseBody, [], true) : { public: {} };

        var internalScope = _.createInternalScope(body, base),
            externalScope = _.createExternalScope(internalScope, base, isProtectedNeeded);

        if (isProtectedNeeded) {
            if (_.isFunction(internalScope.protected.constructor)) {
                internalScope.protected.constructor.apply(internalScope.private, args);
            }
        } else {
            if (_.isFunction(internalScope.public.constructor)) {
                internalScope.public.constructor.apply(internalScope.private, args);
            }
        }

        for (var mod in internalScope) {
            delete internalScope[mod].constructor;
        }

        return externalScope;

    };

    /**
     * Добавляет системные статические методы
     *
     * @private
     * @param {Object} body - Тело декларации класса
     * @returns {Object}
     */
    _.addSystemStaticMethods = function(name, body) {

        var public = body.staticPublic = body.staticPublic || {},
            private = body.staticPrivate = body.staticPrivate || {};

        // Доступ к декларации класса
        private.__body = body;
        public.getBody = function() { return this.__body; };

        // Доступ к базовому классу
        private.__extend = body.extend;
        public.getExtend = function() { return this.__extend; };

        // Полное имя класса
        private.__fullName = 'Classes.' + name;
        public.getFullName = function() { return this.__fullName; };

        return body;

    }

    /**
     * Создаёт статичную область видимости класса
     *
     * @private
     * @param {Object} body - Тело декларации класса
     * @returns {Object}
     */
    _.createStaticScope = function(body) {

        var scope = {};

        scope.public = {};
        scope.private = Object.create(scope.public);

        _.assign(scope.private, body.staticPrivate || {});
        _.assignExternalInterface(scope.public, body.staticPublic || {}, scope.private);

        return scope;

    };

    /**
     * Создаёт публичный конструктор класса
     *
     * @private
     * @param {Object} body - Тело декларации класса
     * @returns {Function}
     */
    _.createPublicConstructor = function(body) {

        var Constructor = function() {

                var scope = _.construct(body, arguments);

                scope.public.constructor = Constructor;

                return scope.public;

            },
            staticScope = _.createStaticScope(body);

        _.assign(Constructor, staticScope.public);

        return Constructor;

    };

    /**
     * Декларирует новый класс
     *
     * @param {String} name - Имя класса
     * @param {Object} body - Тело класса
     */
    $.decl = function(name, body) {
        body = _.addSystemStaticMethods(name, body);
        _.createClass(name, _.createPublicConstructor(body));
    };

    return $;

})();

if (module && module.parent) {
    module.exports = Classes;
    return;
}
