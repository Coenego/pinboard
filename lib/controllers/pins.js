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

var _ = require('underscore')
var events = require('events');
var ShortId = require('ShortId');

var config = require('../../config');
var log = require('../util/logger').logger('pins');

var Pin = require('../models/pin').Pin;

var pins = {};

/**
 * The `pinsEmitter`, as enumerated in `config.events`, emits the following events:
 *
 * * `pinsCreated(pins)`: A collection of pins that were created
 */
var PinsController = module.exports = new events.EventEmitter();

/**
 * Creates a new pin
 *
 * @param  {Pin}        pin             Object containing pin data

 * @param  {Function}   callback        Standard callback function
 * @param  {Object}     callback.err    Object containing the error code and error message
 * @param  {Pin}        callback.pin    Object representing the created pin
 */
var createPin = module.exports.createPin = function(pin, callback) {
    try {

        // Generate a pin ID
        var id = Date.now();

        // Create a new pin object
        var zIndex = _.keys(pins).length;
        var pin = new Pin(id, zIndex, pin.posX, pin.posY, pin.width, pin.height, pin.rotation, pin.createdBy, pin.image, pin.locked);

        // Add the pin to the collection
        pins[pin.id] = pin;

        // Return the created pin
        return callback(null, pin);

    } catch(err) {
        log().error({'code': 400, 'msg': err}, 'Error while deleting pins');
        return callback({'code': 400, 'msg': 'Error while creating pin'});
    }
};

/**
 * Deletes all the pins
 *
 * @param  {Function}   callback        Standard callback function
 * @param  {Object}     callback.err    Object containing the error code and error message
 */
var deletePins = module.exports.deletePins = function(callback) {
    try {
        pins = {};
        return callback();

    } catch(err) {
        log().error({'code': 400, 'msg': err}, 'Error while deleting pins');
        return callback({'code': 400, 'msg': 'Error while deleting pins'});
    }
};

/**
 * Returns the pins
 *
 * @return {Object}     pins            Object containing a collection of pins
 */
var getPins = module.exports.getPins = function() {
    return pins;
};

/**
 * Updates a pin
 *
 * @param  {Object}     data            Object containing pin update data
 * @param  {Function}   callback        Standard callback function
 * @param  {Object}     callback.err    Object containing the error code and error message
 * @param  {Pin}        callback.pin    Object representing the updated pin
 */
var updatePin = module.exports.updatePin = function(data, callback) {
    if (pins[data.id]) {
        pins[data.id] = _.extend(pins[data.id], data);
        return callback(null, pins[data.id]);
    }
};

/**
 * Function that removes all the unnecessary values from a pin before sending
 *
 * @param  {Pin}        pin             The pin that needs to be dismantled
 * @return {Pin}                        The dismantled pin
 */
var dismantlePin = module.exports.dismantlePin = function(pin) {
    pin = _.clone(pin);
    delete pin['image'];
    delete pin['width'];
    delete pin['height'];
    return pin;
};
