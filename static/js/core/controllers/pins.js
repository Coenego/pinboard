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

define(['jquery', 'bootstrap', 'kinetic', 'config', 'model.pin'], function($, Bootstrap, Kinetic, config, Pin) {

    // Kinetic objects
    var stage = null;
    var layer = null;

    var numPins = 0;

    /**
     * Function that adds a pin to the canvas
     *
     * @param  {Pin}    pin         Object representing a pin
     * @api private
     */
    var _addPin = function(pin) {

        // Keep track of how many pins we have
        numPins++;

        // Create a new layer
        layer = new Kinetic.Layer();

        // Create a Kinetic image object
        var img = new Image();
        img.onload = function() {
            var myImage = new Kinetic.Image({
                'id': pin.id,
                'x': pin.posX,
                'y': pin.posY,
                'width': pin.width,
                'height': pin.height,
                'rotation': pin.rotation,
                'image': img,
                'draggable': !pin.locked,
                'strokeEnabled': true,
                'strokeWidth': 6,
                'stroke': '#FFFFFF',
                'shadowEnabled': true,
                'shadowColor': '#000000',
                'shadowOpacity': .4,
                'shadowOffset': {'x': 3,'y': 3}
            });

            // Add an event listener to the created rectangle
            myImage.on('dragmove', onDragMove);
            myImage.on('mousedown', onMouseDown);

            // Add the rectangle to the layer
            layer.add(myImage);

            // Add the layer to the canvas
            stage.add(layer);
        };
        img.src = pin.image;
    };

    /**
     * Function that is executed when an object is being dragged
     *
     * @param  {Object}     evt         A Kinetic event
     * @api private
     */
    var onDragMove = function(evt) {
        var attrs = evt.target.attrs;
        var index = evt.target.index;
        var pin = new Pin(attrs.id, index, attrs.x, attrs.y, attrs.width, attrs.height, attrs.rotation);
        $(document).trigger(config.events.PIN_CHANGING, pin);
    };

    /**
     * Functin that is executed when an object is focussed
     *
     * @param  {Object}     evt         A Kinetic event
     * @api private
     */
    var onMouseDown = function(evt) {
        var attrs = evt.target.attrs;
        var shape = stage.get('#' + attrs.id)[0];
        var zIndex = numPins - 1;
        var pin = new Pin(attrs.id, zIndex, attrs.x, attrs.y, attrs.width, attrs.height, attrs.rotation);
        shape.moveUp();
        shape.parent.draw();
        $(document).trigger(config.events.PIN_CHANGING, pin);
    };

    /**
     * Start listening to UI events
     */
    var addBinding = function() {

        // Show the upload modal
        $('#btn-new-item').on('click', function() {
            $('#pb-modal-upload').modal('show');
        });

        $('#btn-clear-board').on('click', function() {
            $(document).trigger(config.events.PINS_RESET);
        });

        // Create a new image
        $('#pb-add-image').on('click', function() {

            var fileReader = new FileReader();
            fileReader.onload = function(evt) {

                // Get the image details
                var img = new Image();
                img.onload = function() {

                    // Create a new pin
                    var posX = (window.innerWidth * .5);
                    var posY = (window.innerHeight * .5);
                    var rotation = Math.floor(Math.random() * 20 - 10);
                    var pin = new Pin(null, 0, posX, posY, img.width, img.height, rotation, evt.target.result, false);

                    // Send the created pin to the server
                    $(document).trigger(config.events.CREATE_PIN, {'pin': pin});

                    // Close the modal
                    $('#pb-modal-upload').modal('hide');
                };
                img.src = fileReader.result;
            };

            var file = document.getElementById('uploadimage').files[0];
            fileReader.readAsDataURL(file);
        });
    };

    return {

        /**
         * Initializes the canvas
         */
        'init': function() {

            // Create a new Kinetic stage
            stage = new Kinetic.Stage({
                'container': 'container',
                'width': window.innerWidth,
                'height': window.innerHeight
            });

            // Start listening to UI events
            addBinding();
        },

        /**
         * Function that adds a pin to the canvas
         *
         * @param  {Object}     data            Object containing the message data
         * @param  {String}     data.event      The name of the message
         * @param  {Pin}        data.pin        Object representing the created pin
         */
        'addPin': function(data) {
            _addPin(data.pin);
        },

        /**
         * Function that adds the pins for the first time
         *
         * @param  {Object}     pins            Object containing the pins
         */
        'addPins': function(pins) {
            $.each(pins, function(id, pin) {
                _addPin(pin);
            });
        },

        'resetPins': function() {
            numPins = 0;
            stage.clear();
        },

        /**
         * Function that updates a specific pin
         *
         * @param  {Object}     data            Object containing the message data
         * @param  {String}     data.event      The name of the message
         * @param  {Object}     data.pins       Object containing the pin
         */
        'updatePin': function(data) {
            var shape = stage.get('#' + data.pin.id)[0];
            shape.setZIndex(data.pin.zIndex);
            shape.parent.draw();
            var tween = new Kinetic.Tween({
                'node': shape,
                'duration': .15,
                'x': data.pin.posX,
                'y': data.pin.posY
              }).play();
        },

        /**
         * Function that updates the pins on the canvas
         *
         * @param  {Object}     data            Object containing the message data
         * @param  {String}     data.event      The name of the message
         * @param  {Object}     data.pins       Object containing the pins
         */
        'updatePins': function(data) {
            $.each(data.pins, function(id, value) {
                var shape = stage.get('#' + id)[0];
                var tween = new Kinetic.Tween({
                    'node': shape,
                    'duration': .1,
                    'x': value.posX,
                    'y': value.posY
                  }).play();
            });
        }
    };
});
