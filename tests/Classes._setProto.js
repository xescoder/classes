describe.skip('Classes._setProto', function() {

    var Classes,
        obj, Proto;

    before(function() {

        Classes = getClasses();
        Classes.enableTestMode();

        Proto = { field: 123 };
        obj = {};

    });

    it('устанавливает прототип объекту', function() {
        Classes.setProto(obj, Proto);
        assert.strictEqual(obj.field, 123);
    });

});
