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

define(['jquery', 'bootstrap', 'config', 'userController'], function($, Bootstrap, config, userController) {

    // Properties
    var socket = null;

    /**
     * Function that initializes the connection with the server and adds eventlisteners
     */
    var init = function() {

        // Connect with the server
        socket = io.connect(window.location.host);

        // When an error occurred on the server
        socket.on(config.events.ERROR, _onError);

        // When the userlist was updated
        socket.on(config.events.GET_USERS, _onGetUsers)

        // When the client is connected with the server
        socket.on(config.events.USER_CONNECT, _onUserConnect);

        // Login on the server
        socket.emit(config.events.USER_CONNECT);
    };

    /**
     * Function that is executed when an error occurred on the server
     *
     * @param  {Object}     data            Object containing the message data
     * @param  {String}     data.event      The name of the dispatched event
     * @param  {Error}      data.err        Object containing the error code and error message
     * @api private
     */
    var _onError = function(data) {
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
    var _onGetUsers = function(data) {

    };

    /**
     * Function that is executed when the client is connected with the server
     *
     * @param  {Object}     data            Object containing the message data
     * @param  {String}     data.event      The name of the dispatched event
     * @param  {User}       data.user       Object representing the created user
     * @api private
     */
    var _onUserConnect = function(data) {
        userController.setMe(data);
    };

    /**
     * Function that adds eventlisteners for events dispatched from the controllers
     */
    var addBinding = function() {

        // On window close / page leave
        $(window).on('beforeunload', function() {
            socket.emit(config.events.USER_DISCONNECT, {'user': userController.getMe()});
        });
    };

    /**
     * Initialization
     */
    $(function() {
        init();
        addBinding();
    });
});
