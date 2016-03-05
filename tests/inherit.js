describe('Inherit', function() {

    var Classes;

    before(function() {

        Classes = getClasses();

        Classes.decl('Animal', {

            public: {

                constructor: function() {
                    this._age = 0;
                },

                getAge: function() {
                    return this._getAge();
                },

                getName: function() {
                    return this._getName();
                }

            },

            protected: {

                setAge: function(age) {
                    this._age = age;
                }

            },

            private: {

                _name: 'TempName',

                _getName: function() {
                    return this._name;
                }

            }

        });

        Classes.decl('Test', {

            extend: Classes.Animal,

            public: {

                getPublicBaseMethod: function() {
                    return this.__base.getAge;
                },

                getProtectedBaseMethod: function() {
                    return this.__base.setAge;
                },

                getPrivateBaseMethod: function() {
                    return this.__base._getName;
                },

                getPrivateBaseField: function() {
                    return this.__base._name;
                }

            }

        });

    });

    it('публичный интерфейс экземпляра наследуюется от базового класса', function() {

        var test = new Classes.Test();

        assert.property(test, 'getAge');
        assert.isFunction(test.getAge);

        assert.property(test, 'getName');
        assert.isFunction(test.getName);

    });

    it('y наследника есть доступ к публичным методам базового класса', function() {
        var test = new Classes.Test();
        assert.isFunction(test.getPublicBaseMethod());
    });

    it('y наследника есть доступ к защищённым методам базового класса', function() {
        var test = new Classes.Test();
        assert.isFunction(test.getProtectedBaseMethod());
    });

    it('у наследника нет доступа к приватным методам базового класса', function() {
        var test = new Classes.Test();
        assert.isUndefined(test.getPrivateBaseMethod());
    });

    it('у наследника нет доступа к приватным полям базового класса', function() {
        var test = new Classes.Test();
        assert.isUndefined(test.getPrivateBaseField());
    });

});
