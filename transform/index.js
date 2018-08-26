var through = require('through'),
    Combiner = require('stream-combiner'),
    geojsonStream = require('geojson-stream');

module.exports = transformStream;
module.exports.transformFeature = transformFeature;

function transformStream(options) {
    return Combiner(geojsonStream.parse(),
        through(function(feature, callback) {
            this.queue(transformFeature(feature, options));
        }),
        geojsonStream.stringify());
}

function transformFeature(feature, options) {
    if (options) {
        if (options.add) {
            Object.entries(options.add).forEach(
                ([key, value]) => {
                    feature.properties[key] = value;
                }
            );
        }

        if (options.modify) {
            Object.entries(options.modify).forEach(
                ([attribute, map]) => {
                    feature.properties[map.key] = map.value[feature.properties[attribute]];
                    delete feature.properties[attribute];
                }
            );
        }
    }
    return feature;
}
