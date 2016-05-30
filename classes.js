var Classes = (function() {
    var $ = {}, // public fields
        _ = {}; // private fields

    /**
     * Тестовый режим (по умолчанию выключен)
     */
    _.testMode = false;

    /**
     * Хранилище приватных конструкторов
     */
    _.constructors = {};

    /**
     * Модификаторы доступа
     */
    _.PUBLIC = 'public';
    _.PROTECTED = 'protected';
    _.PRIVATE = 'private';

    /* --------------------------  СЛУЖЕБНЫЕ ВНУТРЕННИЕ МЕТОДЫ  ------------------------------ */

    /**
     * Возвращает true, если переданное значение является функцией
     *
     * @private
     * @param {Mixed} value - Значение
     * @returns {Boolean}
     */
    _.isFunction = function(value) {
        return typeof value === 'function';
    };

    /**
     * Возвращает true, если переданное значение является объектом
     *
     * @private
     * @param {Mixed} value - Значение
     * @returns {Boolean}
     */
    _.isObject = function(value) {
        return value !== null && typeof value === 'object';
    };

    /**
     * Оболочка над Object.prototype.hawOwnProperty
     *
     * @private
     * @param {Object} obj
     * @param {String} key
     * @returns {Boolean}
     */
    _.hasOwn = function(obj, key) {
        return obj.hasOwnProperty(key);
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
     * @returns {Object}
     */
    _.assignExternalInterface = function(obj, source, context) {
        var ignore = ['constructor'], key, value;

        for (key in source) {
            if (source.hasOwnProperty(key) && (ignore.indexOf(key) === -1)) {
                if (_.isFunction(source[key])) {
                    value = _.bind(context, obj, source[key]);
                } else {
                    value = source[key];
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
     * Проверяет, что Child унаследован от Parent
     *
     * @private
     * @param {Function} Child - дочерний класс
     * @param {Function} Parent - родительский класс
     */
    _.isExtend = function(Child, Parent) {
        var parentFullName = Parent.getFullName();

        while (Child && Child.getFullName) {
            if (Child.getFullName() === parentFullName) {
                return true;
            }

            Child = Child.getExtend();
        }

        return false;
    };

    /* ------------------------------------------------  ФАБРИКИ  ---------------------------------------------- */

    /**
     * Создаёт внутреннюю область видимости объекта
     *
     * @private
     * @param {Object} body - Тело декларации класса
     * @param {Object} base - Экземпляр базового класса
     * @returns {Object}
     */
    _.createInternalScope = function(body, base) {
        var scope = {};

        base = base.protected || base.public;

        scope.public = Object.create(base);
        _.assign(scope.public, body.public || {});

        scope.protected = Object.create(scope.public);
        _.assign(scope.protected, body.protected || {});

        scope.private = Object.create(scope.protected);
        _.assign(scope.private, body.private || {}, true);

        scope.private.__base = base;
        scope.private.__self = _.constructors[body.staticPrivate.__fullName];

        return scope;
    };

    /**
     * Создаёт внешнюю область видимости объекта
     *
     * @private
     * @param {Object} internalScope - Внутренняя область видимости объекта
     * @param {Object} base - Экземпляр базового класса
     * @param {String} scopeType - Необходимая область видимости
     * @returns {Object}
     */
    _.createExternalScope = function(internalScope, base, scopeType) {
        var scope = {};

        if (_.testMode) {
            return internalScope;
        }

        scope.public = Object.create(base.public);
        _.assignExternalInterface(scope.public, internalScope.public, internalScope.private);

        if (scopeType === _.PROTECTED) {
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
     * @param {String} scopeType - Необходимая область видимости
     * @returns {Object}
     */
    _.construct = function(body, args, scopeType) {
        var baseBody = body.extend && body.extend.getBody(),
            base = baseBody ? _.construct(baseBody, [], _.PROTECTED) : { public: {} },
            scope = _.createInternalScope(body, base),
            mods = ({
                public: [_.PUBLIC],
                protected: [_.PROTECTED, _.PUBLIC],
                private: [_.PRIVATE, _.PROTECTED, _.PUBLIC]
            })[scopeType];

        for (var i = 0; i < mods.length; i++) {
            if (_.hasOwn(scope[mods[i]], 'constructor') && _.isFunction(scope[mods[i]].constructor)) {
                scope[mods[i]].constructor.apply(scope.private, args);
                break;
            }
        }

        for (var mod in scope) {
            if (_.hasOwn(scope, mod)) {
                delete scope[mod].constructor;
            }
        }

        return scopeType === _.PRIVATE ? scope : _.createExternalScope(scope, base, scopeType);
    };

    /**
     * Добавляет системные статические методы
     *
     * @private
     * @param {String} fullName - Полное имя класса
     * @param {Object} body - Тело декларации класса
     * @returns {Object}
     */
    _.addSystemStaticMethods = function(fullName, body) {
        var scope = {};

        scope.public = body.staticPublic = body.staticPublic || {},
        scope.private = body.staticPrivate = body.staticPrivate || {};

        // Доступ к декларации класса
        scope.private.__body = body;
        scope.public.getBody = function() { return this.__body; };

        // Доступ к базовому классу
        scope.private.__extend = body.extend;
        scope.public.getExtend = function() { return this.__extend; };

        // Полное имя класса
        scope.private.__fullName = fullName;
        scope.public.getFullName = function() { return this.__fullName; };

        // Тип
        scope.private.__type = $.TYPES.CLASS;
        scope.public.getType = function() { return this.__type; };

        // Проверка наследственности
        scope.private.__extends = {};
        scope.public.is = function(Parent) {
            if (!Parent.getFullName) {
                return false;
            }

            var parentFullName = Parent.getFullName();

            if (!this.__extends.hasOwnProperty(parentFullName)) {
                this.__extends[parentFullName] = _.isExtend(this, Parent);
            }

            return this.__extends[parentFullName];
        };

        return body;
    };

    /**
     * Создаёт статичную область видимости класса
     *
     * @private
     * @param {Object} body - Тело декларации класса
     * @param {Function} publicConstructor - Публичный конструктор класса
     * @param {Function} privateConstructor - Приватный конструктор класса
     */
    _.createStaticScope = function(body, publicConstructor, privateConstructor) {
        var staticPublic = body.staticPublic || {},
            staticPrivate = body.staticPrivate || {};

        _.assign(privateConstructor, staticPublic);
        _.assign(privateConstructor, staticPrivate);

        _.assignExternalInterface(publicConstructor, staticPublic, privateConstructor);
    };

    /**
     * Создаёт конструктор класса
     *
     * @private
     * @param {Object} body - Тело декларации класса
     * @returns {Function}
     */
    _.createConstructor = function(body) {
        var constructor = {};

        // Публичный конструктор
        constructor.public = function() {
            var scope = _.construct(body, arguments, _.PUBLIC);

            scope.public.constructor = constructor.public;

            return scope.public;
        };

        // Приватный конструктор
        constructor.private = function() {
            var scope = _.construct(body, arguments, _.PRIVATE);

            scope.private.constructor = constructor.public;

            return scope.private;
        };

        _.createStaticScope(body, constructor.public, constructor.private);

        return constructor;
    };

    /* --------------------------------------  ПРОСТРАНСТВА ИМЁН  ------------------------------------- */

    /**
     * Прототип пространства имён
     */
    _.namespaceProto = {

        /**
         * Возвращает тип пространства имён
         *
         * @returns {String}
         */
        getType: function() {
            return $.TYPES.NAMESPACE;
        },

        /**
         * Декларирует новое пространство имён
         *
         * @param {String} name - Имя пространства имён
         * @returns {Object}
         */
        name: function(name) {
            return _.rname(this, name);
        },

        /**
         * Декларирует новый класс
         *
         * @param {String} name - Имя класса
         * @param {Object} body - Тело декларации класса
         * @returns {Object}
         */
        decl: function(name, body) {
            var fullName = this.getFullName() + '.' + name, constructor;

            if (this.hasOwnProperty(name)) {
                throw new Error('Classes. Не удалось создать класс: имя ' + fullName + ' уже занято.');
            }

            body = _.addSystemStaticMethods(fullName, body);
            constructor = _.createConstructor(body);

            _.constructors[fullName] = constructor.private;
            this[name] = _.testMode ? constructor.private : constructor.public;

            return this[name];
        }
    };

    /**
     * Создаёт пространство имён
     *
     * @param {Object} base - Базовое пространство имён
     * @param {String} name - Создаваемое пространство имён
     * @returns {Object}
     */
    _.name = function(base, name) {
        var fullName = base.getFullName() + '.' + name;

        if (base !== $ && base.getType() !== $.TYPES.NAMESPACE) {
            throw new Error('Classes. ' + base.getFullName() + ' не является пространством имён.');
        }

        if (base.hasOwnProperty(name)) {
            throw new Error('Classes. Не удалось создать пространство имён: имя ' + fullName + ' уже занято.');
        }

        var namespace = base[name] = Object.create(_.namespaceProto);

        namespace.getFullName = function() {
            return fullName;
        };

        return namespace;
    };

    /**
     * Рекурсивно создаёт пространство имён
     *
     * @param {Object} base - Базовое пространство имён
     * @param {String} name - Создаваемое пространство имён
     * @returns {Object}
     */
    _.rname = function(base, name) {
        var names = name.split('.'), i;

        for (i = 0; i < names.length; i++) {
            base = _.name(base, names[i]);
        }

        return base;
    };

    /* --------------------------------  ПУБЛИЧНЫЙ ИНТЕРФЕЙС CLASSES  ------------------------------- */

    /**
     * Перечисление поддерживаемых типов классов
     */
    $.TYPES = {
        NAMESPACE: 'Namespace',
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

        if (_.isFunction(value) && _.isFunction(value.getType)) {
            return value.getType();
        }

        if (_.isObject(value)) {
            if (_.isFunction(value.getType)) {
                return value.getType();
            }

            if (_.isFunction(value.constructor) && _.isFunction(value.constructor.getFullName)) {
                return value.constructor.getFullName();
            }
        }

        return Object.prototype
            .toString
            .call(value)
            .slice(8, -1);
    };

    /**
     * Проверяет принадлежность типу
     *
     * @param {Object} obj - Экземпляр типа
     * @param {Function} Type - Тип
     * @returns {Boolean}
     */
    $.is = function(obj, Type) {
        if (!obj || typeof obj !== 'object' || typeof obj.constructor !== 'function') {
            return false;
        }

        if (typeof Type !== 'function') {
            return false;
        }

        if (obj.constructor === Type) {
            return true;
        }

        if (obj instanceof Type) {
            return true;
        }

        if (typeof obj.constructor.is !== 'function') {
            return false;
        }

        return obj.constructor.is(Type);
    };

    /**
     * Возвращает полное имя корневого пространства имён
     *
     * @returns {String}
     */
    $.getFullName = function() {
        return 'Classes';
    };

    /**
     * Включает тестовый режим работы
     */
    $.enableTestMode = function() {
        _.testMode = true;
        $.__proto__ = _; // jshint ignore:line
    };

    $.name = _.namespaceProto.name;
    $.decl = _.namespaceProto.decl;

    return $;
})();

if (module && module.parent) {
    module.exports = Classes;
    return;
}
