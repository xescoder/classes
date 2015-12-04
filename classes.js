var Classes = (function() {

    var $ = {}, // public fields
        _ = {}; // private fields

    $.getType = function(value) {

        if (value === null) {
            return 'Null';
        }

        if ((typeof(value) === 'object') && value.__className__) {
            return value.__className__;
        }

        return Object.prototype
            .toString
            .call(value)
            .slice(8, -1);

    };

    _.isFunction = function(value) {
        return typeof(value) === 'function';
    };

    _.isForbiddenName = function(obj, name) {
        return obj[name];
    };

    _.createClass = function(name, constructor) {

        if (_.isForbiddenName($, name)) {
            return;
        }

        $[name] = constructor;
        $[name].prototype.__className__ = name;

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

        res.private.__proto__ = res.public;

        return res;

    };

    $.decl = function(name, body) {

        var props = _.createModsObjects(body);

        _.createClass(name, function Class() {

            if (_.isFunction(props.public.constructor)) {
                props.public.constructor.apply(props.private, arguments);
                delete props.public.constructor;
            }

            props.public.__proto__ = this.__proto__;

            return props.public;

        });

    };

    return $;

})();


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

var test = new Classes.Test(123);
test.setPrefix('good');

console.log(Classes);
console.log(test);
console.log(test.getValue());

console.log();

console.log(Classes.getType(false));
console.log(Classes.getType(-1));
console.log(Classes.getType(null));
console.log(Classes.getType(function(){}));
console.log(Classes.getType(undefined));
console.log(Classes.getType([]));
console.log(Classes.getType(test));

console.log();
console.log(test instanceof Classes.Test);


