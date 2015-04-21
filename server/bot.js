/*
 * This script contains a GeoChat bot.
 *
 * It starts at a specified (or random) location and slowly moves around, telling where it is and what time it is occasionally.
 *
 */
var Firebase = require('firebase'),
    GeoFire = require('geofire');

var locations = {
  'coralSea': [-16.130262, 153.605347],   // Coral Sea
  'souternOcea': [-66.722541, -167.019653],  // Southern Ocean
  'tasmanSea': [-41.112469, 159.054565],   // Tasman Sea
  'northPacificOcean': [30.902225, -166.66809],     // North Pacific Ocean,
  '345 Spear': [37.7922812,-122.3935105]
};

var root = new Firebase('https://geo-chat.firebaseio.com');

// Get a reference to the presence data in Firebase.
var userListRef = root.child('onlineUsers');
var messagesRef = root.child('messages');

var geoFireUsers = new GeoFire(userListRef);
var geoFireMessages = new GeoFire(messagesRef);

// Generate a reference to a new location for my user with push.
var myUserRef = userListRef.push();

// Get a reference to my own presence status.
var connectedRef = root.child('.info/connected');

var location = locations['345 Spear'];

connectedRef.on('value', function(isOnline) {
   if (isOnline.val()) {
     // If we lose our internet connection, we want ourselves removed from the list.
     myUserRef.onDisconnect().remove();

     // set our (initial) location
     geoFireUsers.set(myUserRef.key(), location);
   }
});

// move the bot around a bit periodically
setInterval(function() {
  location[0] += 0.0001;
  location[1] += 0.0001;
  geoFireUsers.set(myUserRef.key(), location);
}, 5000);

// send a message with the time every minute
setInterval(function() {
  var now = new Date();
  var message = messagesRef.push();
  new geoFireMessages.set(message.key(), location);
  message.update({
    name: myUserRef.key(),
    timestamp: now.getTime(),
    message: 'It is '+now.getHours()+':'+(now.getMinutes()<10 ? '0' : '') + now.getMinutes()
  });
}, 60000);
