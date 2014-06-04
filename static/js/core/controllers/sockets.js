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

define(['config', 'core.pins', 'core.users'], function(config, pinsController, userController) {

    // Properties
    var socket = null;

    var _isConnected = false;
    var _lastSent = 0;

    /**
     * Function that is executed when an error occurred on the server
     *
     * @param  {Object}     data            Object containing the message data
     * @param  {String}     data.event      The name of the dispatched event
     * @param  {Error}      data.err        Object containing the error code and error message
     * @api private
     */
    var onError = function(data) {
        console.log('_onError');
        console.log(data);
    };

    /**
     * Function that is executed when the userlist is received
     *
     * @param  {Object}     data            Object containing the message data
     * @param  {String}     data.event      The name of the dispatched event
     * @param  {User[]}     data.users      Object containing the active users
     * @api private
     */
    var onGetUsers = function(data) {
        userController.setUsers(data.users);
    };

    /**
     * Function that is executed when the client is connected with the server
     *
     * @param  {Object}     data            Object containing the message data
     * @param  {String}     data.event      The name of the dispatched event
     * @param  {User}       data.user       Object representing the created user
     * @param  {Object}     data.pins       Object containing all the pins
     * @api private
     */
    var onUserConnect = function(data) {
        _isConnected = true;
        userController.setMe(data.user);
        pinsController.addPins(data.pins);
    };

    /**
     * Function that is executed when the server pings the client
     *
     * @api private
     */
    var onUserPing = function() {
        socket.emit(config.events.USER_PING, {'id': userController.getMe().id});
    };

    /**
     * Start listening to UI events
     */
    var addBinding = function() {

        // When a users updates a pin
        $(document).on(config.events.PIN_CHANGING, function(evt, pin) {
            if (_lastSent < (Date.now() - config.pins.interval)) {
                socket.emit(config.events.PIN_CHANGING, {'pin': pin});
                _lastSent = Date.now();
            }
        });

        // When the user creates a new pin
        $(document).on(config.events.CREATE_PIN, function(evt, data) {
            socket.emit(config.events.CREATE_PIN, data);
        });

        // When a user resets the pins
        $(document).on(config.events.PINS_RESET, function() {
            socket.emit(config.events.PINS_RESET);
        });
    };

    return {

        /**
         * Function that initializes the connection with the server and adds eventlisteners
         */
        init: function() {

            // Connect with the server
            socket = io.connect(window.location.host);

            // Error
            socket.on(config.events.ERROR, onError);

            // Users
            socket.on(config.events.GET_USERS, onGetUsers);
            socket.on(config.events.USER_CONNECT, onUserConnect);
            socket.on(config.events.USER_PING, onUserPing);

            // Pins
            socket.on(config.events.PIN_CREATED, pinsController.addPin);
            socket.on(config.events.PIN_CHANGED, pinsController.updatePin);
            socket.on(config.events.PINS_CHANGED, pinsController.updatePins);
            socket.on(config.events.PINS_RESET, pinsController.resetPins);

            // Listen to events dispatched from the UI
            addBinding();

            // Start the application by connecting with the server
            socket.emit(config.events.USER_CONNECT);
        },

        /**
         * Function that returns whether or not the user is connected with the server
         *
         * @return {Boolean}    Whether or not the user is connected with the server
         */
        'isConnected': function() {
            return _isConnected;
        },

        /**
         * Function that is executed when the client disconnects from the server
         */
        'onUserDisconnect': function() {
            _isConnected = false;
            socket.emit(config.events.USER_DISCONNECT, {'user': userController.getMe()});
        }
    }
});
