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
var pinsController = module.exports = new events.EventEmitter();

/**
 * Creates a new pin
 *
 * @param  {Pin}        pin             Object containing pin data

 * @param  {Function}   callback        Standard callback function
 * @param  {Pin}        callback.pin    Object representing the created pin
 */
var createPin = module.exports.createPin = function(pin, callback) {

    // Generate a pin ID
    var id = Date.now();

    // Create a new pin object
    var pin = new Pin(id, pin.posX, pin.posY, pin.width, pin.height, pin.rotation, pin.image, pin.locked);

    // Add the pin to the collection
    pins[pin.id] = pin;

    // Return the created pin
    return callback(pin);
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
 * @param  {Pin}        pin             Object representing a pin
 */
var updatePin = module.exports.updatePin = function(pin) {
    pins[pin.id] = _.extend(pins[pin.id], pin);
};
