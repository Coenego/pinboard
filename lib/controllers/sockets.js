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
var fs = require('fs');

var config = require('../../config');
var log = require('../util/logger').logger('sockets');

var PinsController = require('./pins');
var UserController = require('./users');

var io = null;

var lastSent = 0;

/**
 * Function that initializes the socket interaction
 *
 * @param  {Object}     _io     Instance of socket.io
 */
var init = module.exports.init = function(_io) {

    // Store the IO object
    io = _io;

    // Check for inactive users
    checkUserStatus();

    ///////////////
    //  SOCKETS  //
    ///////////////

    // Register the events after the connection has been established
    io.sockets.on('connection', function(socket) {

        /////////////
        //  USERS  //
        /////////////

        /*!
         * When the users list is requested
         */
        socket.on(config.events.GET_USERS, function() {

            // Send the users to the client
            sendMessageToClient(socket, config.events.GET_USERS, {'event': config.events.GET_USERS, 'users': UserController.getUsers()});
        });

        /*!
         * When a user connects with the server
         * @param  {String}     data.event  The name of the dispatched event
         */
        socket.on(config.events.USER_CONNECT, function() {

            // Create a new user for the connected peer
            UserController.createUser(function(err, users, user) {
                if (err) {
                    log().error({'err': err}, 'Error while creating user');
                    socket.emit(config.events.ERROR, {'event': config.events.ERROR, 'err': err})
                }

                // Send the created user object to the user
                sendMessageToClient(socket, config.events.USER_CONNECT, {'event': config.events.USER_CONNECT, 'user': user, 'pins': PinsController.getPins()});

                // Send the users to all the clients
                sendMessageToAllClients(config.events.GET_USERS, {'event': config.events.GET_USERS, 'users': users});
            });
        });

        /*!
         * When a client disconnects from the server
         *
         * @param  {Object}     data        Object containing the message data
         * @param  {User}       data.user   Object representing the disconnected user
         */
        socket.on(config.events.USER_DISCONNECT, function(data) {

            // Remove the disconnected user from the users list
            UserController.deleteUser(data.user.id, function(err, users, user) {
                if (err) {
                    log().error({'err': err}, 'Error while deleting user');
                }

                // Send the users to all the clients
                sendMessageToAllClients(config.events.GET_USERS, {'event': config.events.GET_USERS, 'users': users});
            });
        });

        /*!
         * When a client responds to a ping
         *
         * @param  {Object}     data        Object containing the message data
         * @param  {String}     data.id     The id of the client that responds
         */
        socket.on(config.events.USER_PING, function(data) {

            // Update a user's activity status
            UserController.updateUserStatus(data.id);

            // Send the users to all the clients
            sendMessageToAllClients(config.events.GET_USERS, {'event': config.events.GET_USERS, 'users': UserController.getUsers()});
        });

        ////////////
        //  PINS  //
        ////////////

        /*!
         * When the pins are requested, send the full pin object to the client
         */
        socket.on(config.events.GET_PINS, function() {

            // Send all the pins to the client
            sendMessageToClient(socket, config.events.PINS_CHANGED, {'event': config.events.PINS_CHANGED, 'pins': PinsController.getPins()});
        });

        /*!
         * When a pin is being updated, send a dismantled pin object to all the clients
         */
        socket.on(config.events.PIN_CHANGING, function(data) {

            // Update the pin on the server
            PinsController.updatePin(data, function(err, pin) {
                if (err) {
                    log().error({'err': err, 'data': data}, 'Error while updating pin');
                }

                // Send the updated pin to all the clients
                sendMessageToAllClients(config.events.PIN_CHANGED, {'event': config.events.PIN_CHANGED, 'pin': PinsController.dismantlePin(pin)});
            });
        });

        /*!
         * When a new pin is created, send the full pin object to all the clients
         */
        socket.on(config.events.CREATE_PIN, function(data) {

            // Create a new pin on the server
            PinsController.createPin(data.pin, function(err, pin) {
                if (err) {
                    log().error({'err': err, 'data': data}, 'Error while creating pin');
                    sendMessageToClient(socket, config.events.ERROR, {'event': config.events.ERROR, 'err': err});
                }

                // Send the created pin to all the clients
                sendMessageToAllClients(config.events.PIN_CREATED, {'event': config.events.PIN_CREATED, 'pin': pin});
            });
        });

        /*!
         * When a client resets the pins
         */
        socket.on(config.events.PINS_RESET, function() {

            // Reset the pins
            PinsController.deletePins(function(err) {
                if (err) {
                    log().error({'err': err}, 'Error while deleting pins');
                    sendMessageToClient(socket, config.events.ERROR, {'event': config.events.ERROR, 'err': err});
                }

                // Send the created pin to all the clients
                sendMessageToAllClients(config.events.PINS_RESET, {'event': config.events.PINS_RESET});
            });
        });
    });

    //////////////
    //  EVENTS  //
    //////////////

    /**
     * Send the pins to all the users when they have been changed
     */
    PinsController.on(config.events.PINS_CHANGED, function(data) {

        // To prefend flooding the connection, we check whether or not it's acceptable to send a message to the clients
        if (lastSent < (Date.now() - config.pins.interval)) {

            // Send all the pins to all the users
            sendMessageToAllClients(config.events.PINS_CHANGED, {'event': config.events.PINS_CHANGED, 'pins': data.pins});

            // Update the last sent variable
            lastSent = Date.now();
        }
    });
};

//////////////////////////
//  INTERNAL FUNCTIONS  //
//////////////////////////

/**
 * Function that pings to all the users to see if they are still active
 */
var checkUserStatus = function() {

    // Ping all the clients every 5 seconds
    setInterval(function() {
        sendMessageToAllClients(config.events.USER_PING, {'event': config.events.USER_PING})
    }, 5000);
};

/**
 * Function that sends a message to a client
 *
 * @param  {String}     event               The event that needs to be dispatched
 * @param  {Object}     data                The data that needs to be passed with the message
 * @api private
 */
var sendMessageToClient = function(socket, event, data) {
    socket.emit(event, JSON.stringify(data));
};

/**
 * Function that sends a message to all the clients
 *
 * @param  {String}     event               The event that needs to be dispatched
 * @param  {Object}     data                The data that needs to be passed with the message
 * @api private
 */
var sendMessageToAllClients = function(event, data) {
    io.sockets.emit(event, JSON.stringify(data));
};
