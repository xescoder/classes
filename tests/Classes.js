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
    });
});
