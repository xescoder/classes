describe('Classes.is', function() {

     var Classes, obj;

     before(function() {

        Classes = getClasses();

        Classes.decl('A', {});

        Classes.decl('B', {
            extend: Classes.A
        });

        Classes.decl('C', {
            extend: Classes.B
        });

        Classes.decl('D', {});

        obj = new Classes.C();

    });

    it('возвращает true, если объект унаследован от класса', function() {
        assert.isTrue(Classes.is(obj, Classes.C));
        assert.isTrue(Classes.is(obj, Classes.B));
        assert.isTrue(Classes.is(obj, Classes.A));
    });

    it('возвращает false, если объект не унаследован от класса', function() {
        assert.isFalse(Classes.is(obj, Classes.D));
    });

});
