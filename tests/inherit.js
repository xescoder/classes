describe('Наследование', function() {
    var Classes;

    before(function() {
        Classes = getClasses();

        Classes.decl('Base', {
            public: {
                getParams: function() {
                    return this._params;
                }
            },

            protected: {
                setParams: function(params) {
                    this._params = params;
                }
            },

            private: {
                _params: {}
            }
        });

        Classes.decl('Storage', {
            extend: Classes.Base,

            public: {
                get: function(param) {
                    return this.getParams()[param];
                }
            },

            protected: {
                constructor: function(params) {
                    this.setParams(params);
                },

                set: function(param, value) {
                    var params = this.getParams();
                    params[param] = value;
                    this.setParams(params);
                }
            }
        });

        Classes.decl('JsonStorage', {
            extend: Classes.Storage,

            public: {
                constructor: function(json) {
                    if (!json) {
                        return;
                    }

                    var params = JSON.parse(json);
                    this.__base.constructor(params);
                },

                toJson: function() {
                    var params = this.getParams();
                    return JSON.stringify(params);
                },

                getBase: function() {
                    return this.__base;
                },

                toString: function() {
                    return this.toJson();
                }
            }
        });
    });

    it('статичный метод is возвращает true для любого родительского класса из цепочки наследования', function() {
        assert.isTrue(Classes.JsonStorage.is(Classes.Storage));
        assert.isTrue(Classes.JsonStorage.is(Classes.Base));
    });

    it('публичный интерфейс экземпляра наследуется от всей цепочки базовых классов', function() {
        var storage = new Classes.JsonStorage();

        assert.isFunction(storage.get);
        assert.isFunction(storage.getParams);
    });

    it.skip('y наследника есть доступ к публичным методам базового класса', function() {
        var test = new Classes.Test();
        assert.isFunction(test.getPublicBaseMethod());
    });

    it.skip('y наследника есть доступ к защищённым методам базового класса', function() {
        var test = new Classes.Test();
        assert.isFunction(test.getProtectedBaseMethod());
    });

    it.skip('у наследника нет доступа к приватным методам базового класса', function() {
        var test = new Classes.Test();
        assert.isUndefined(test.getPrivateBaseMethod());
    });

    it.skip('у наследника нет доступа к приватным полям базового класса', function() {
        var test = new Classes.Test();
        assert.isUndefined(test.getPrivateBaseField());
    });
});
