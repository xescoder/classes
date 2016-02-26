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

                callPublicMethod: function() {
                    return this.__base.getAge();
                },

                callProtectedMethid: function() {
                    return this.__base.setAge(11);
                },

                callPrivateMethod: function() {
                    return this.__base._getName();
                },

                getPrivateField: function() {
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

});
