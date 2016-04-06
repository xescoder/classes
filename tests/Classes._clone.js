describe('Classes._clone', function() {
    var Classes;

    before(function() {
        Classes = getClasses();
        Classes.enableTestMode();
    });

    it('должен неизменно возвращать значение простого типа, а также null, undefined и функцию', function() {
        assert.strictEqual(Classes.clone(5), 5);
        assert.strictEqual(Classes.clone(true), true);
        assert.strictEqual(Classes.clone('qwe'), 'qwe');
        assert.strictEqual(Classes.clone(null), null);
        assert.strictEqual(Classes.clone(undefined), undefined);
        assert.strictEqual(Classes.clone(_.noop), _.noop);
    });

    it('должен клонировать дату', function() {
        var value = new Date(),
            copy = Classes.clone(value);

        assert.notStrictEqual(value, copy);
        assert.strictEqual(value.getTime(), copy.getTime());
    });

    it('должен клонировать массив', function() {
        var value = [null, 1, true, _.noop],
            copy = Classes.clone(value);

        assert.notStrictEqual(value, copy);

        for (var i = 0, len = value.length; i++; i < len) {
            assert.strictEqual(value[i], copy[i]);
        }
    });

    it('должен клонировать объект произвольной вложенности', function() {
        var value = {
                obj: { field1: 1, field2: false, field3: _.noop },
                arr: [null, 1, 2, 3],
                str: 'qwe',
                bool: true
            },
            copy = Classes.clone(value);

        test(value, copy);

        function test(val1, val2) {
            if (val1 === null || typeof val1 !== 'object') {
                assert.strictEqual(val1, val2);
            } else {
                assert.notStrictEqual(val1, val2);

                _.forEach(val1, function(v, k) {
                    test(v, val2[k]);
                });
            }
        }
    });
});
