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

var _ = require('underscore');
var express = require('express');
var os = require('os');
var util = require('util');

var config = require('./config');

var sockets = require('./lib/controllers/sockets');

/**
 * Create a new express server
 *
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing the error code and error message
 * @param  {Express}        callback.app        The ExpressJS app object
 * @param  {HttpServer}     callback.server     The HTTP Server object that is listening
 */
var createServer = module.exports.createServer = function(callback) {

    var app = express();
    app.use(express.static(__dirname + '/static'));

    // Try and listen on the specified port
    var server = app.listen(config.server.port);
    var io = require('socket.io').listen(server);

    // When the server successfully begins listening, invoke the callback
    server.once('listening', function() {
        server.removeAllListeners('error');
        return callback(null, io, app);
    });

    // If there is an error connecting, try another port
    server.once('error', function(err) {
        server.removeAllListeners('listening');
        return callback({'code': 400, 'msg': err});
    });
};

/**
 * Initialize the server
 */
var init = function() {

    // Create a new server
    createServer(function(err, io, app) {
        if (err) {
            return console.log(util.format('Unable to start %s', config.app.title));
        }

        var networkInterfaces = os.networkInterfaces();
        var address = networkInterfaces['en0'][1]['address'];
        console.log(config.app.title + ' started at http://' + address +':' + config.server.port);

        // Register the routes
        app.get('/', function(req, res) {
            res.sendfile(__dirname + '/index.html');
        });

        // Initialize the sockets
        sockets.init(io);
    });
};

init();
