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
var bunyan = require('bunyan');

var config = require('../../config');

var SYSTEM_LOGGER_NAME = 'system';
var loggers = {};

/**
 * Create / retrieve a logger with the provided name.
 *
 * @param  {String}     name        The name of the logger
 * @return {Function}               A function that can be used to retrieve the logger
 */
var logger = module.exports.logger = function(name) {
    name = name || SYSTEM_LOGGER_NAME;

    // Lazy-load the logger and cache it so new loggers don't have to be recreated all the time
    if (!loggers[name]) {
        loggers[name] = _createLogger(name);
    }

    return function() {
        return loggers[name];
    };
};

//////////////////////////
//  INTERNAL FUNCTIONS  //
//////////////////////////

/**
 * Create a logger with the provided name.
 *
 * @param  {String}     name        The name to assign to the created logger
 * @api private
 */
var _createLogger = function(name) {
    var _config = _.extend({}, config.logger);
    _config.name = name;
    return bunyan.createLogger(_config);
};
