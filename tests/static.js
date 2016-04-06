describe('Static', function() {
    var Classes;

    before(function() {
        Classes = getClasses();

        Classes.decl('Test', {

            staticPublic: {
                getStaticField: function() {
                    return this.field;
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
        assert.equal(Classes.Test.getStaticField(), 123);
    });

    it('нет доступа к приватным статическим свойствам', function() {
        assert.isUndefined(Classes.Test.field);
    });
});
