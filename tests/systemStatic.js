describe('System static', function() {
    var Classes;

    before(function() {
        Classes = getClasses();

        Classes.decl('Base');

        Classes.decl('Test', {

            extend: Classes.Base,

            staticPublic: {
                 test: function() {
                     return 123;
                 }
             }

        });
    });

    it('getBody возвращает тело декларации класса', function() {
        assert.isFunction(Classes.Test.getBody().staticPublic.test);
    });

    it('getExtend возвращает базовый класс', function() {
        assert.equal(Classes.Test.getExtend(), Classes.Base);
    });

    it('getFullName возвращает полное имя класса', function() {
        assert.equal(Classes.Test.getFullName(), 'Classes.Test');
    });
});
