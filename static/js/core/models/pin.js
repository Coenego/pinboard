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

define(function() {

    /**
     * A pin model
     *
     * @param  {Number}     id          The pin's id
     * @param  {Number}     posX        The pin's x-position
     * @param  {Number}     posY        The pin's y-position
     * @param  {Number}     index       The pin's z-index
     * @param  {Number}     width       The pin's width
     * @param  {Number}     height      The pin's height
     * @param  {Number}     offsetX     The pin's x-offset
     * @param  {Number}     offsetY     The pin's y-offset
     * @param  {Number}     rotation    The pin's rotation
     * @param  {String}     createdBy   The id of the creator
     * @param  {Blob}       image       The pin's image
     * @param  {Boolean}    stroke      Whether or not the pin has a stroke
     * @param  {Boolean}    locked      Whether or not the pin is locked
     * @return {Pin}                    Object representing a pin
     */
    return function Pin(id, posX, posY, index, width, height, offsetX, offsetY, rotation, createdBy, image, stroke, locked) {
        this.id = id;
        this.posX = posX;
        this.posY = posY;
        this.index = index;
        this.width = width;
        this.height = height;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.rotation = rotation;
        this.createdBy = createdBy;
        this.image = image;
        this.stroke = stroke;
        this.locked = locked;
    }
});
