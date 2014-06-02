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

var config = require('../../config');

var userController = require('./users');

var io = null;

/**
 * Function that initializes the socket interaction
 *
 * @param  {Object}     _io     Instance of socket.io
 */
exports.init = module.exports.init = function(_io) {

    // Store the IO object
    io = _io;

    // Register the events after the connection has been established
    io.sockets.on('connection', function(socket) {

        /*!
         * When the users list is requested
         */
        socket.on(config.events.GET_USERS, function() {
            sendMessageToAllClients(config.events.GET_USERS, {'event': config.events.GET_USERS, 'users': userController.getUsers()});
        });

        /*!
         * When a user connects with the server
         * @param  {String}     data.event  The name of the dispatched event
         */
        socket.on(config.events.USER_CONNECT, function() {

            // Create a new user for the connected peer
            userController.createUser(function(err, users, user) {
                if (err) {
                    console.log(err.msg);
                    socket.emit(config.events.ERROR, {'event': config.events.ERROR, 'err': err})
                }

                sendMessageToClient(socket, config.events.USER_CONNECT, {'event': config.events.USER_CONNECT, 'user': user});
                sendMessageToAllClients(config.events.GET_USERS, {'event': config.events.GET_USERS, 'users': users});
            });
        });

        /*!
         * When a user disconnects from the server
         *
         * @param  {Object}     data        Object containing the message data
         * @param  {User}       data.user   Object representing the disconnected user
         */
        socket.on(config.events.USER_DISCONNECT, function(data) {

            // Remove the disconnected user from the users list
            userController.deleteUser(data.user.id, function(err, users, user) {
                if (err) {
                    console.log(err.msg);
                }

                sendMessageToAllClients(config.events.GET_USERS, {'event': config.events.GET_USERS, 'users': users});
            });
        });
    });
};

/**
 * Function that sends a message to a client
 *
 * @param  {String}     event               The event that needs to be dispatched
 * @param  {Object}     data                The data that needs to be passed with the message
 * @api private
 */
var sendMessageToClient = function(socket, event, data) {
    socket.emit(event, data);
};

/**
 * Function that sends a message to all the clients
 *
 * @param  {String}     event               The event that needs to be dispatched
 * @param  {Object}     data                The data that needs to be passed with the message
 * @api private
 */
var sendMessageToAllClients = function(event, data) {
    io.sockets.emit(event, data);
};
