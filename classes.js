var Classes = (function() {

    var $ = {}, // public fields
        _ = {}; // private fields

    $.TYPES = {
        CLASS: 'Class'
    };

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

    $.enableTestMode = function() {
        _.setProto($, _);
    };

    _.isFunction = function(value) {
        return typeof(value) === 'function';
    };

    _.getProto = function(obj) {
        return obj.__proto__;
    };

    _.setProto = function(obj, proto) {
        obj.__proto__ = proto;
    };

    _.getCache = function(key) {
        return _.cache && _.cache[key];
    };

    _.setCache = function(key, value) {
        _.cache || (_.cache = {});
        _.cache[key] = value;
        return _.cache[key];
    };

    _.isForbiddenName = function(obj, name) {
        return obj[name];
    };

    _.createClass = function(name, constructor) {

        if (_.isForbiddenName($, name)) {
            return;
        }

        constructor.__type__ = $.TYPES.CLASS;
        constructor.prototype.__type__ = name;

        $[name] = constructor;

    };

    _.createModsObjects = function(body) {

        var res = {
                public: {},
                private: {}
            },
            i, mod, obj, key;

        for (mod in res) {

            obj = body[mod] || {};

            for (key in obj) {

                res[mod][key] = obj[key];

                if (_.isFunction(res[mod][key])) {
                    res[mod][key] = res[mod][key].bind(res.private);
                }

            }

        }

        _.setProto(res.private, res.public);

        return res;

    };

    $.decl = function(name, body) {

        var props = _.createModsObjects(body);

        _.createClass(name, function() {

            var public = {};

            for (key in props.public) {
                public[key] = props.public[key];
            }

            if (_.isFunction(public.constructor)) {
                public.constructor.apply(props.private, arguments);
                delete public.constructor;
            }

            _.setProto(public, _.getProto(this));

            return public;

        });

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
            this._value = param;
        },

        getValue: function() {
            return this.getPrefixPublic() + ':' + this._value;
        },

        setPrefix: function(prefix) {
            this._prefix = prefix;
        },

        getPrefixPublic: function() {
            return this._getPrefix();
        }

    },

    private: {

        _getPrefix: function() {
            return this._prefix;
        }

    }

});

var test = new Classes.Test(123),
    test1 = new Classes.Test(2);

test.setPrefix('good');

console.log(Classes);
console.log(test);
console.log(test.getValue());

console.log();

console.log(test instanceof Classes.Test);


