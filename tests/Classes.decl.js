describe('Classes.decl', function() {
    var Classes;

    before(function() {
        Classes = getClasses();
    });

    it('нельзя перезаписать существующий класс', function() {
        Classes.decl('Test', {});

        var test = function() {
            Classes.decl('Test', {});
        };

        assert.throw(test, 'Classes. Не удалось создать класс: имя Classes.Test уже занято.');
    });
});
