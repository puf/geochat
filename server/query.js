var Firebase = require('firebase'),
    GeoFire = require('geofire');

var location = [37.7922812,-122.3935105]; // 345 Spear street

var ref = new Firebase('https://geo-chat.firebaseio.com/messages');

var geoFire = new GeoFire(ref);

var geoQuery = geoFire.query({
  center: [37.864181200002385,-122.32161049999762],
  radius: 2.5
});

var onReadyRegistration = geoQuery.on("ready", function() {
  console.log("GeoQuery has loaded and fired all other events for initial data");
});

var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
  console.log(key + " entered query at " + location + " (" + distance + " km from center)");
});

var onKeyExitedRegistration = geoQuery.on("key_exited", function(key, location, distance) {
  console.log(key + " exited query to " + location + " (" + distance + " km from center)");
});

var onKeyMovedRegistration = geoQuery.on("key_moved", function(key, location, distance) {
  console.log(key + " moved within query to " + location + " (" + distance + " km from center)");
});
