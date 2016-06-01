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
        assert.isFunction(Classes.is);
        assert.isFunction(Classes.getType);
        assert.isFunction(Classes.getFullName);
        assert.isFunction(Classes.enableTestMode);

        assert.equal(Classes.decl.length, 2, 'Classes.decl должен принимать 2 аргумента');
        assert.equal(Classes.name.length, 1, 'Classes.name должен принимать 1 аргумент');
        assert.equal(Classes.is.length, 2, 'Classes.is должен принимать 2 аргумента');
        assert.equal(Classes.getType.length, 1, 'Classes.getType должен принимать 1 аргумент');
        assert.equal(Classes.getFullName.length, 0, 'Classes.getFullName не должен принимать аргументов');
        assert.equal(Classes.enableTestMode.length, 0, 'Classes.enableTestMode не должен принимать аргументов');
    });
});