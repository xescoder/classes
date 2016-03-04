describe.skip('Classes._getProto', function() {

    var Classes,
        obj, Constructor, Proto;

    before(function() {

        Classes = getClasses();
        Classes.enableTestMode();

        Proto = { field: 123 };
        Constructor = function() {};

        Constructor.prototype = Proto;

        obj = new Constructor();

    });

    it('возвращает прототип объекта', function() {
        var proto = Classes.getProto(obj);
        assert.strictEqual(proto.field, 123);
        assert.strictEqual(proto, Proto);
    });

});
