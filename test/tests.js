(function () {

    var load   = require('load-script'),
        type   = require('component-type'),
        assert = require('component-assert');

    suite('load-script');

    test('can load by src string with callback', function (done) {
        load('//cdnjs.cloudflare.com/ajax/libs/angular.js/1.1.1/angular.min.js', function () {
            done();
        });
    });

    test('returns the script element', function () {
        var script = load('//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.9.0/dropbox.min.js');
        assert(type(script) === 'object');
    });

    test('can load protocol-specific src', function (done) {
        var http = 'http://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js';
        var https = 'https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js';
        var script = load({
            http  : http,
            https : https
        }, function () {
            done();
        });
        assert(script.src === http);
    });

}());