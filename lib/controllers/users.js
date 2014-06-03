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

var ShortId = require('ShortId');

var log = require('../util/logger').logger('users');

var User = require('../models/user').User;

var users = {};

/**
 * Function that creates a new user
 *
 * @param  {Function}   callback            Standard callback function
 * @param  {Error}      callback.err        Error object containing the error code and error message
 * @param  {User[]}     callback.users      An array of active users
 * @param  {User}       callback.user       Object representing the created user
 */
exports.createUser = module.exports.createUser = function(callback) {

    // Generate a user ID
    var id = ShortId.generate();

    // Generate a random color
    var color = '#' + Math.random().toString(16).substring(4);

    // Create and add a new user to the users list
    var user = new User(id, color);
    users[user.id] = user;

    // Return the users
    return callback(null, users, user);
};

/**
 * Function that removes a user from the users list
 *
 * @param  {String}     id                  The id of the user that needs to be deleted
 * @param  {Error}      callback.err        Error object containing the error code and error message
 * @param  {User[]}     callback.users      An array of active users
 * @param  {User}       callback.user       Object representing the created user
 */
exports.deleteUser = module.exports.deleteUser = function(id, callback) {
    if (!id) {
        log().error({'code': 400, 'msg': 'No user ID specified'}, 'Error while deleting user');
        return callback({'code': 400, 'msg': 'No user ID specified'});
    }

    // Delete the user from the list
    delete users[id];

    // Return the updated user list
    return callback(null, users);
};

/**
 * Function that returns the users
 *
 * @return {User[]}                         An array of active users
 */
exports.getUsers = module.exports.getUsers = function() {
    return users;
};
