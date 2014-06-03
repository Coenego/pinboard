/*
 * The MIT License (MIT)
 *
 * Copyright(c) 2014 Mathieu Decoene
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var util = require('util');

var config = require('./config');

var pins = require('./lib/controllers/pins');
var server = require('./lib/controllers/server');
var sockets = require('./lib/controllers/sockets');

/**
 * Initialize the server
 */
var init = function() {

    // Create a new server
    server.createServer(function(err, io, app) {
        if (err) {
            return console.log(util.format('Unable to start %s', config.app.title));
        }

        console.log(util.format('%s started at http://localhost:%s', config.app.title, config.server.port));

        // Register the routes
        app.get('/', function(req, res) {
            res.sendfile(__dirname + '/index.html');
        });

        // Initialize the sockets
        sockets.init(io);
    });
};

init();
