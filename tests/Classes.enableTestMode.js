describe('Classes.enableTestMode', function() {
    var Classes;

    before(function() {
        Classes = getClasses();
    });

    it('является функцией', function() {
        assert.isFunction(Classes.enableTestMode);
    });

    it('не принимает аргументов', function() {
        assert.strictEqual(Classes.enableTestMode.length, 0);
    });

    it('включает тестовый режим', function() {
        Classes.enableTestMode();
        assert.isTrue(Classes.testMode);
    });

    // before(function() {
    //     Classes = getClasses();
    //     Classes.enableTestMode();
    //
    //     Classes.decl('Animal', {
    //
    //         public: {
    //
    //             constructor: function() {
    //                 this._age = 0;
    //             },
    //
    //             getAge: function() {
    //                 return this._getAge();
    //             },
    //
    //             getName: function() {
    //                 return this._getName();
    //             }
    //
    //         },
    //
    //         protected: {
    //
    //             setAge: function(age) {
    //                 this._age = age;
    //             }
    //
    //         },
    //
    //         private: {
    //
    //             _name: 'TempName',
    //
    //             _getName: function() {
    //                 return this._name;
    //             }
    //
    //         }
    //
    //     });
    //
    //     Classes.decl('Test', {
    //
    //         extend: Classes.Animal,
    //
    //         public: {
    //
    //             getPublicBaseMethod: function() {
    //                 return this.__base.getAge;
    //             },
    //
    //             getProtectedBaseMethod: function() {
    //                 return this.__base.setAge;
    //             },
    //
    //             getPrivateBaseMethod: function() {
    //                 return this.__base._getName;
    //             },
    //
    //             getPrivateBaseField: function() {
    //                 return this.__base._name;
    //             },
    //
    //             callProtectedBaseMethod: function(age) {
    //                 return this.__base.setAge(age);
    //             },
    //
    //             callPrivateMethod: function() {
    //                 return this._getPrivateField();
    //             }
    //
    //         },
    //
    //         private: {
    //
    //             _field: 1234,
    //
    //             _getPrivateField: function() {
    //                 return this._field;
    //             }
    //
    //         },
    //
    //         staticPrivate: {
    //
    //             _staticPrivateMethod: function() {
    //                 return 'static private method';
    //             }
    //
    //         }
    //
    //     });
    // });
    //
    // it('enableTestMode включает тестовый режим', function() {
    //     assert.ok(Classes.isFunction, 'внутренние функции Classes не доступны');
    // });
    //
    // it('включает доступ к приватным статичным методам класса', function() {
    //     assert.strictEqual(Classes.Test._staticPrivateMethod(), 'static private method');
    // });
    //
    // it('включает доступ к защищённому экземпляру базового класса', function() {
    //     var test = new Classes.Test();
    //     assert.isFunction(test.__base.setAge);
    // });
    //
    // it('включает доступ к приватным методам экземпляра класса', function() {
    //     var test = new Classes.Test();
    //     assert.strictEqual(test._getPrivateField(), 1234);
    // });
    //
    // it('есть возможность застабить метод базового класса', function() {
    //     var test = new Classes.Test();
    //     test.__base.setAge = sinon.stub().returns('stub');
    //
    //     assert.strictEqual(test.callProtectedBaseMethod(5), 'stub');
    //     assert.isTrue(test.__base.setAge.calledWith(5));
    // });
    //
    // it('есть возможность застабить приватный метод', function() {
    //     var test = new Classes.Test();
    //     test._getPrivateField = sinon.stub().returns('stub');
    //
    //     assert.strictEqual(test.callPrivateMethod(), 'stub');
    //     assert.isTrue(test._getPrivateField.calledOnce);
    // });
});
