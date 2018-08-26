var through = require('through'),
    Combiner = require('stream-combiner'),
    geojsonStream = require('geojson-stream'),
    hash = require('object-hash');

module.exports = removeDuplicateStream;
module.exports.hashFeature = hashFeature;

var hashes = {};
function removeDuplicateStream(options) {
    return Combiner(geojsonStream.parse(),
        through(function(feature, callback) {
            this.queue(hashFeature(feature));
        }),
        geojsonStream.stringify());
}

function hashFeature(feature) {
    var featureHash = hash(feature);
    if (featureHash in hashes) {
        // FIXME not sure how to simply drop this feature
        return {
            type: 'Feature',
            properties: {},
            geometry: null
        };
    } else {
        hashes[featureHash] = true;
        return feature;
    }
}
