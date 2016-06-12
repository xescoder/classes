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
                },

                toString: function() {
                    return this._toJson();
                }
            },

            protected: {
                init: function(params) {
                    if (!params) {
                        return;
                    }

                    console.log('!!!!!!!!!!!!!!!!!!!!!!!');

                    this.setParams(params);
                },

                set: function(param, value) {
                    var params = this.getParams();
                    params[param] = value;
                    this.setParams(params);
                }
            },

            private: {
                _toJson: function() {
                    return JSON.stringify(this.getParams());
                }
            }
        });

        Classes.decl('Test', {
            extend: Classes.Storage,

            public: {
                init: function(params) {
                    // this.__base.init(params);
                },

                getBase: function() {
                    return this.__base;
                },

                getPublicBaseFields: function() {
                    return {
                        get: this.get,
                        toString: this.toString,
                        getParams: this.getParams
                    };
                },

                getProtectedBaseFields: function() {
                    return {
                        set: this.set,
                        setParams: this.setParams
                    };
                },

                getPrivateBaseFields: function() {
                    return {
                        _toJson: this._toJson,
                        _params: this._params
                    };
                }
            }
        });
    });

    it('статичный метод is возвращает true для любого родительского класса из цепочки наследования', function() {
        assert.isTrue(Classes.Test.is(Classes.Storage));
        assert.isTrue(Classes.Test.is(Classes.Base));
    });

    it('публичный интерфейс экземпляра наследуется от всей цепочки базовых классов', function() {
        var storage = new Classes.Test();

        assert.isFunction(storage.get);
        assert.isFunction(storage.toString);
        assert.isFunction(storage.getParams);
    });

    it('y наследника через this есть доступ к публичным методам базовых классов', function() {
        var test = new Classes.Test(),
            fields = test.getPublicBaseFields();

        assert.isFunction(fields.get);
        assert.isFunction(fields.toString);
        assert.isFunction(fields.getParams);
    });

    it('y наследника через this есть доступ к защищённым методам базовых классов', function() {
        var test = new Classes.Test(),
            fields = test.getProtectedBaseFields();

        assert.isFunction(fields.set);
        assert.isFunction(fields.setParams);
    });

    it('у наследника нет доступа к приватным полям базовых классов', function() {
        var test = new Classes.Test(),
            fields = test.getPrivateBaseFields();

        assert.isUndefined(fields._toJson);
        assert.isUndefined(fields._params);
    });

    it('наследник может обращаться к полям базового класса через __base', function() {
        var test = new Classes.Test(),
            base = test.getBase();

        assert.isFunction(base.get);
        assert.isFunction(base.toString);
        assert.isFunction(base.getParams);
        assert.isFunction(base.set);
        assert.isFunction(base.setParams);
    });

    it('__base не раскрывает приватной реализации базового класса', function() {
        var test = new Classes.Test(),
            base = test.getBase();

        assert.isUndefined(base._toJson);
        assert.isUndefined(base._params);
    });

    it.skip('в конструкторе класса можно вызывать конструктор базового класса', function() {
        var test = new Classes.Test({
            param1: 'test',
            param2: 123,
            param3: false
        });

        assert.deepEqual(test.getParams(), {
            param1: 'test',
            param2: 123,
            param3: false
        });
    });
});
