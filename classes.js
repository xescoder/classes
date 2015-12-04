var Classes = (function() {

    var $ = {}, // public fields
        _ = {}; // private fields

    _.isForbiddenName = function(obj, name) {
        return obj[name];
    };

    _.createClass = function(name, constructor) {

        if (_.isForbiddenName($, name)) {
            return;
        }

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

                if (typeof(res[mod][key]) === 'function') {
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

            if (typeof(props.public.constructor) === 'function') {
                props.public.constructor.apply(props.private, arguments);
                delete props.public.constructor;
            }

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
