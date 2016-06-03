describe('Classes', function() {
    var Classes;

    before(function() {
        Classes = getClasses();
    });

    it('API библиотеки соответствует заявленному', function() {
        var reference = {
            TYPES: {
                NAMESPACE: 'Namespace',
                CLASS: 'Class'
            },
            decl: Classes.decl,
            name: Classes.name,
            is: Classes.is,
            getType: Classes.getType,
            getFullName: Classes.getFullName,
            enableTestMode: Classes.enableTestMode
        };

        assert.deepEqual(Classes, reference);

        assert.isFunction(Classes.decl);
        assert.isFunction(Classes.name);

        assert.equal(Classes.decl.length, 2, 'Classes.decl должен принимать 2 аргумента');
        assert.equal(Classes.name.length, 1, 'Classes.name должен принимать 1 аргумент');
    });
});
