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

var bunyan = require('bunyan');

var config = module.exports = {};

/**
 * `config.app`
 *
 * @param  {String}     title            The title of the application
 * @param  {String}     ui               The path to the static files
 */
config.app = {
    'title': 'Pinboard',
    'ui': __dirname + '/static'
};

/**
 * `config.logger`
 *
 * @param  {Stream[]}   streams         The Bunyan streams
 * @param  {Object}     serializers     The Bunyan serializers
 */
config.logger = {
    'streams': [{
        'level': 'info',
        'stream': process.stdout
    }],
    'serializers': {
        'err': bunyan.stdSerializers.err,
        'req': bunyan.stdSerializers.req,
        'res': bunyan.stdSerializers.res
    }
};

/**
 * `config.server`
 *
 * @param  {Number}     port            The network port on which the application can be accessed
 */
config.server = {
    'port': 3500
};

/**
 * `config.events`
 */
config.events = {

    // General
    'ERROR': 'error',

    // Users
    'GET_USERS': 'getUsers',
    'USER_CONNECT': 'userConnect',
    'USER_DISCONNECT': 'userDisconnect',

    // Pins
    'PIN_CHANGED': 'pinChanged',
    'PIN_CHANGING': 'pinChanging',
    'PINS_CHANGED': 'pinsChanged',
    'PIN_CREATED': 'pinCreated',
    'CREATE_PIN': 'createPin'
};

/**
 * `config.pins`
 *
 * @param  {Number}     interval        The interval of sending messages to the clients
 */
config.pins = {
    'interval': 250
};
