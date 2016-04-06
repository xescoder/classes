describe.skip('Classes.decl', function() {
    var Classes;

    before(function() {
        Classes = getClasses();
        Classes.enableTestMode();
    });

    it('вызывает функции для создания класса в правильном порядке', function() {
        var body = {},
            createClassSpy = sinon.spy(),
            createPublicConstructorSpy = sinon.stub().returnsArg(0);

        Classes.setPrivate('createClass', createClassSpy);
        Classes.setPrivate('createPublicConstructor', createPublicConstructorSpy);

        Classes.decl('Test', body);

        assert.isTrue(createPublicConstructorSpy.calledWith(body));
        assert.isTrue(createPublicConstructorSpy.calledOnce);

        assert.isTrue(createClassSpy.calledAfter(createPublicConstructorSpy));
        assert.isTrue(createClassSpy.calledWith('Test', body));
        assert.isTrue(createClassSpy.calledOnce);
    });
});
