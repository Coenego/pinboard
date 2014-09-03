# Pinboard

This is just a little Node.js experiment that combines Express.js, Socket.io and Kinetic.js.

## Todo
- **Remove the oldest pin when a new one is added**
- **Show a message when an error occurs**
- **Preload images of created pins on entering application**
- **Big images should be resized on upload**
- **Users should be able to delete pins individually**
- ~~Show a notification when a user enters the application~~
- ~~Show a notification when a user leaves the application~~
- ~~Fix z-index bug when selecting image~~
- ~~Put selected pin on top of the stack~~
- ~~Remove inactive users~~
- ~~Only pass the changed pins in the socked message data~~
- ~~Add Bunyan logger~~
- ~~Add Bower to install front-end dependencies~~
- ~~Add image upload functionality~~
- ~~Randomly rotate and position the rectangles~~
- ~~Add real-time dragging with Socket.io~~
- ~~Allow users to add new rectangles~~
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
