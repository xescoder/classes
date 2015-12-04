describe('Пробный тест', function() {

    it('classes', function() {
        assert.ok(Classes.decl);
    });

    it('ошибочный кейс', function() {
        _.map([1,2,3], function(i){
            assert.ok(i);
        })
        assert.notOk(true, '123');
    });

});
