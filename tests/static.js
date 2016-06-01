describe('Static', function() {
    var Classes;

    before(function() {
        Classes = getClasses();

        Classes.decl('Test', {

            public: {
                getStaticField: function() {
                    return this.__self.getFullName() + '.field === ' + this.__self.field;
                }
            },

            private: {
                getName: function() {
                    return 'Test';
                }
            },

            staticPublic: {
                getStaticField: function() {
                    return this.field;
                },

                getInstance: function() {
                    return new this();
                }
            },

            staticPrivate: {
                field: 123
            }

        });
    });

    it('есть доступ к статичным методам через класс', function() {
        assert.isFunction(Classes.Test.getStaticField);
    });

    it('статические методы имеют доступ к приватым статическим свойствам', function() {
        assert.strictEqual(Classes.Test.getStaticField(), 123);
    });

    it('нет доступа к приватным статическим свойствам', function() {
        assert.isUndefined(Classes.Test.field);
    });

    it('у экземпляра класса есть доступ к приватной статической области видимости через __self', function() {
        var test = new Classes.Test();
        assert.strictEqual(test.getStaticField(), 'Classes.Test.field === 123');
    });

    it('через this можно создать экземпляр класса', function() {
        assert.strictEqual(Classes.Test.getInstance().getStaticField(), 'Classes.Test.field === 123');
    });

    it('созданный в статичном методе объект не раскрывает приватной области видимости', function() {
        assert.isUndefined(Classes.Test.getInstance().getName);
    });
});
