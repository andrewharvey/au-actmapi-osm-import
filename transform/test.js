var test = require('tap').test,
    transform = require('./');

test('transformFeature', function(t) {
    t.deepEqual(transform.transformFeature({
        type: 'Feature',
        properties: { a: 1, b: 2 }
    }, {
        add: {
            'new key': 'new value'
        }
    }), {
        type: 'Feature',
        properties: { a: 1, b: 2, 'new key': 'new value' },
    }, 'add key');

    t.deepEqual(transform.transformFeature({
        type: 'Feature',
        properties: { a: 1, b: 2 }
    }, {
        modify: {
            a: {
                key: 'c',
                value: {
                    1: '9',
                    2: '8'
                }
            }
        }
    }), {
        type: 'Feature',
        properties: { c: 9, b: 2 },
    }, 'modify key');
    t.end();
});
