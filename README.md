# Pinboard

This is just a little Node.js experiment that combines Express.js, Socket.io and Kinetic.js.

## Todo
- **Fix z-index bug when selecting image**
- **Crop the uploaded images**
- ~~Add delete functionality for pins~~
- ~~Put selected pin on top of the stack~~
- ~~Remove inactive users~~
- ~~Only pass the changed pins in the socked message data~~
- ~~Add Bunyan logger~~
- ~~Add Bower to install front-end dependencies~~
- ~~Allow users to add new rectangles~~
- ~~Add image upload functionality~~
- ~~Randomly rotate and position the rectangles~~
- ~~Add real-time dragging with Socket.io~~
- ~~Add Kinetic functionality~~
- ~~Setup Express server~~

## Install

#### Get the latest version from GitHub
* run `git clone https://github.com/Coenego/pinboard.git`
* run `cd pinboard`

#### Install Pinboard automatically
* run `bin/install.sh`

#### Install Pinboard manually
* run `bower install`
* run `npm install -d`
* run `node app.js | bunyan`
