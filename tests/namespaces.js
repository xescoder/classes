describe.only('Namespaces', function() {

    var Classes;

    beforeEach(function() {
        Classes = getClasses();
    });

    it('name создаёт новое пространство имён', function() {
        var TestNamespace = Classes.name('TestNamespace');

        assert.equal(TestNamespace, Classes.TestNamespace);
        assert.equal(TestNamespace.getType(), Classes.TYPES.NAMESPACE);
    });

    it('нельзя перезаписать существующее пространство имён', function() {

        Classes.name('TestNamespace');

        var test = function() {
            Classes.name('TestNamespace');
        };

        assert.throw(test, 'Classes. Не удалось создать пространство имён: имя Classes.TestNamespace уже занято.');
    });

    it('name позволяет создавать пространства имён произвольной вложенности', function() {
        Classes.name('System.IO.Ports');
        assert.equal(Classes.System.IO.Ports.getType(), Classes.TYPES.NAMESPACE);
    });

    it('внутри пространства имён можно создать новое пространство имён', function() {
        Classes.name('System');
        Classes.System.name('IO');
        assert.equal(Classes.System.IO.getType(), Classes.TYPES.NAMESPACE);
    });

    it('внутри пространства имён можно создать класс', function() {
        Classes.name('System');
        Classes.System.decl('Console', {});
        assert.equal(Classes.System.Console.getType(), Classes.TYPES.CLASS);
    });

});
