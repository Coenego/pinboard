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

define([], function() {

    // Stores the current user
    var _me = null;

    // Stores the active users
    var _users = [];

    //////////////////////////
    //  INTERNAL FUNCTIONS  //
    //////////////////////////

    /**
     * Function that updates the navigation bar
     *
     * @api private
     */
    var updateNavigation = function() {

        // Set the number of users watching
        var numUsers = Object.keys(_users).length;
        var str = (numUsers === 1) ? 'user' : 'users';
        $('#pb-top-navbar').find('#pb-top-navbar-users').text(numUsers + ' ' + str + ' watching');
    };

    ////////////////////////
    //  PUBLIC FUNCTIONS  //
    ////////////////////////

    var that = {

        /**
         * Returns the current user
         *
         * @return {User}                   Object representing the current user
         */
        'getMe': function() {
            return _me;
        },

        /**
         * Function that sets the current user
         *
         * @param  {User}       user        Object representing the current user
         */
        'setMe': function(user) {
            _me = user;
        },

        /**
         * Returns the active users
         *
         * @return {User[]}                 Collection of active users
         */
        'getUsers': function() {
            return _users;
        },

        /**
         * Function that sets the active users
         *
         * @param  {User[]}     users       Collection of active users
         */
        'setUsers': function(users) {
            _users = users;

            // Update the navigation
            updateNavigation();
        }
    };

    return that;
});
