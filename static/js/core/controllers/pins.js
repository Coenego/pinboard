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

define(['jquery', 'bootstrap', 'kinetic', 'config', 'core.users', 'model.pin'], function($, Bootstrap, Kinetic, config, userController, Pin) {

    // Kinetic objects
    var stage = null;
    var layer = null;

    //////////////////////////
    //  INTERNAL FUNCTIONS  //
    //////////////////////////

    /**
     * Initialize the form
     *
     * @api private
     */
    var initForm = function() {
        $('#pb-js-file-container').show();
        $('#pb-js-pin-container').hide();
        return false;
    };

    /**
     * Initialize the stage
     *
     * @api private
     */
    var initStage = function() {

        // If a stage was created earlier, reset the stage
        if (stage) {
            stage.destroyChildren();
        }

        // Create a new Kinetic stage
        stage = new Kinetic.Stage({
            'container': 'container'
        });

        // Create a new layer and add it to the stage
        layer = new Kinetic.Layer();
        stage.add(layer);

        onWindowResize();
    };

    /**
     * Function that is executed when the window is resized
     *
     * @param  {Object}     evt         A jQuery event
     * @api private
     */
    var onWindowResize = function() {

        // Get the window's width and height
        var minWidth = 800;
        var minHeight = 600;
        var width = window.innerWidth;
        var height = window.innerHeight;

        // Change the stage's dimensions
        if (stage) {
            stage.setAttr('width', width);
            stage.setAttr('height', height);

            if (layer) {
                layer.setAttr('width', width);
                layer.setAttr('height', height);
                layer.setAttr('offsetX', -(width *.5));
                layer.setAttr('offsetY', -(height * .5));
            }

            var scale = 1;
            if (width < minWidth || height < minHeight) {
                if (width > height) {
                    scale = Math.min((height / minHeight), (width / minWidth));
                }
            }

            // Adjust the scaling
            stage.setAttr('scaleX', scale);
            stage.setAttr('scaleY', scale);
            stage.draw();
        }
    };

    /**
     * Function that adds a pin to the canvas
     *
     * @param  {Pin}    pin         Object representing a pin
     * @api private
     */
    var _addPin = function(pin) {

        // Create a Kinetic image object
        var img = new Image();
        img.onload = function() {
            var pinImage = new Kinetic.Image({
                'id': pin.id,
                'x': pin.posX,
                'y': pin.posY,
                'width': pin.width,
                'height': pin.height,
                'offsetX': pin.offsetX,
                'offsetY': pin.offsetY,
                'rotation': pin.rotation,
                'image': img,
                'draggable': !pin.locked,
                'strokeEnabled': pin.stroke,
                'strokeWidth': 6,
                'stroke': '#FFFFFF',
                'shadowEnabled': pin.stroke,
                'shadowColor': '#333333',
                'shadowOpacity': .6,
                'shadowOffset': {'x': 3,'y': 3}
            });

            // Add an event listener to the created rectangle
            pinImage.on('dragmove', onDragMove);
            pinImage.on('mousedown', onMouseDown);

            // Add the rectangle to the layer
            layer.add(pinImage);
            layer.draw();
        };
        img.src = pin.image;
    };

    /**
     * When an image is uploaded to the stage
     *
     * @param  {Object}     evt         A jQuery event
     * @api private
     */
    var onCreatePin = function(evt) {
        var fileReader = new FileReader();
        fileReader.onload = function(evt) {

            // Get the image details
            var img = new Image();
            img.onload = function() {

                // Create a new pin
                var posX = Math.floor(Math.random() * 50 - 25);
                var posY = Math.floor(Math.random() * 50 - 25);
                var offsetX = img.width * .5;
                var offsetY = img.height * .5;
                var rotation = Math.floor(Math.random() * 20 - 10);
                var stroke = $('#pb-js-stroke').is(':checked');
                var pin = new Pin(null, posX, posY, 0, img.width, img.height, offsetX, offsetY, rotation, userController.getMe().id, evt.target.result, stroke, false);

                // Send the created pin to the server
                $(document).trigger(config.events.CREATE_PIN, {'pin': pin});

                // Close the modal
                $('#pb-modal-upload').modal('hide');

                // Reset the form
                resetForm();
            };
            img.src = fileReader.result;
        };

        var file = document.getElementById('pb-js-image').files[0];
        fileReader.readAsDataURL(file);
        return false;
    };

    /**
     * When the `clear board` button is clicked
     *
     * @param  {Object}     evt         A jQuery event
     * @api private
     */
    var onClearBoardClick = function() {
        $(document).trigger(config.events.PINS_RESET);
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
        var data = {'id': attrs.id, 'posX': attrs.x, 'posY': attrs.y};
        $(document).trigger(config.events.PIN_CHANGING, data);
    };

    /**
     * Function that is executed when a file has been selected
     *
     * @param  {Object}     evt         A jQuery event
     * @api private
     */
    var onImageSelect = function(evt) {
        $('#pb-js-file-container').hide();
        $('#pb-js-pin-container').show();
    };

    /**
     * Function that is executed when an object is focussed
     *
     * @param  {Object}     evt         A Kinetic event
     * @api private
     */
    var onMouseDown = function(evt) {
        var attrs = evt.target.attrs;
        var shape = stage.get('#' + attrs.id)[0];
        shape.moveToTop();
        layer.draw();

        // Update all the pins
        var data = {};
        $.each(layer.getChildren(), function(key, child) {
            data[child.attrs.id] = child.index;
        });
        $(document).trigger(config.events.PINS_CHANGED, data);
    };

    /**
     * Hide the upload modal
     */
    var hideUploadModal = function() {
        $('#pb-modal-upload').modal('hide');
        return false;
    };

    /**
     * When the `new item` button is clicked
     *
     * @param  {Object}     evt         A jQuery event
     * @api private
     */
    var showUploadModal = function() {
        $('#pb-modal-upload').modal('show');
    };

    /**
     * Toggle the stroke
     */
    var toggleStroke = function() {
        var enabled = $('#pb-js-stroke').is(':checked');
        var $box = $('.pb-image-box');
        if (enabled) {
            $box.addClass('border');
        } else {
            $box.removeClass('border');
        }
    };

    /**
     * Reset the form
     *
     * @api private
     */
    var resetForm = function() {
        $('#pb-js-frm-add-image').trigger('reset');
        initForm();
    };

    /**
     * Start listening to UI events
     *
     * @api private
     */
    var addBinding = function() {

        // Cancel the new pin
        $('#pb-js-cancel').on('click', hideUploadModal);

        // Change the chosen image
        $('#pb-js-change-image').on('click', initForm);

        // Clear the pinboard
        $('#pb-js-clear-board').on('click', onClearBoardClick);

        // Create a new pin
        $('#pb-js-frm-add-image').on('submit', onCreatePin);

        // Switch panels when an image has been selected
        $('#pb-js-image').on('change', onImageSelect);

        // Show the upload modal
        $('#pb-js-new-item').on('click', showUploadModal);

        // Toggle the stroke
        $('#pb-js-stroke').on('change', toggleStroke);

        // Reset the form when modal is closed
        $('#pb-modal-upload').on('hidden.bs.modal', resetForm);

        // When the window gets resized
        $(window).on('resize', onWindowResize);
    };

    ////////////////////////
    //  PUBLIC FUNCTIONS  //
    ////////////////////////

    var that = {

        /**
         * Initializes the canvas
         */
        'init': function() {

            // Initialize the form
            initForm();

            // Initialize the stage
            initStage();

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
            data = JSON.parse(data);
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

        'deletePin': function(data) {
            data = JSON.parse(data);
            var shape = stage.get('#' + data.pin)[0];
            shape.remove();
            layer.draw();
        },

        /**
         * Function that updates a specific pin
         *
         * @param  {Object}     data            Object containing the message data
         * @param  {String}     data.event      The name of the message
         * @param  {Object}     data.pins       Object containing the pin
         */
        'updatePin': function(data) {
            data = JSON.parse(data);
            var shape = stage.get('#' + data.pin.id)[0];
            shape.moveToTop();
            var tween = new Kinetic.Tween({
                'node': shape,
                'duration': .25,
                'x': data.pin.posX,
                'y': data.pin.posY
              }).play();
        },

        /**
         * Function that clears the stage and resets the pins
         */
        'resetPins': function() {
            initStage();
        },

        /**
         * Function that updates the pins on the canvas
         *
         * @param  {Object}     data            Object containing the message data
         * @param  {String}     data.event      The name of the message
         * @param  {Object}     data.pins       Object containing the pins
         */
        'updatePins': function(data) {
            data = JSON.parse(data);
            $.each(data.pins, function(id, value) {
                var shape = stage.get('#' + id)[0];
                shape.setZIndex(value.index);
                layer.draw();
                var tween = new Kinetic.Tween({
                    'node': shape,
                    'duration': .25,
                    'x': value.posX,
                    'y': value.posY
                  }).play();
            });
        }
    };

    return that;
});
