# Portal 2.0 

Portal 2.0 is a web application designed to plan, control and observe the WAVE delivery robot. The navigation bar has four tabs: home, planning, telemetry and engineering view. 

## Planning

The planning tab allows the user to define a path for the robot in terms of GPS waypoints. Whenever the user clicks on the map a waypoint is created, and each two set of waypoints define a "Segment" object. A Segment has the following properties:

* `start` - starting waypoint for the Segment, type google maps marker
* `end` - ending waypoint for the Segment, type google maps marker
* `speed` - cruising speed for the Segment
* `maxSpeed`-  maximum speed for the Segment 
* `bearing` - the bearing in degrees from the start to the end waypoint
* `poly` - a google maps Polyline object which represents the Segment

The main methods available for a Segment are:

*  Getter and setter methods for its properties 
*  Render methods for displaying the start marker, the end marker, and the polyline on a map
*  Clear methods for clearing its display from a map
* `convertSeg()`for converting it to an object suitable to be send as an XMLHttpRequest

A set of Segments make up a "Path" object. A Path object has an array to keep track of its Segments, as well as methods to get, insert and remove Segments from this array. Additionally, a Path object is able to send its list of Segments as an XMLHttpsRequest (using the `convertSeg()` method for each Segment), and is able to receive and convert this request back to an into Path. These methods are called `sendPath()` and `makePath()` respectively. 

The operation of the planning phase can be described as follows:

1. User makes a Path object (which contains a list of Segments) by placing waypoints on the map. The `speed` and `maxSpeed` properties for each segment can be adjusted from the sidebar menu
2. User clicks on the save button to send the Path object as a XMLHttpRequest to the server

## Telemetry 

In the telemetry tab 3 classes are defined: User, Sharer and Viewer. Sharer and Viewer both inherit from User. The purpose of the Sharer is to get the raw data from its sensors (location, heading, acceleration readings) and send it to the server. The purpose of the Viewer is to obtain this data from the server. The User class is common to both, and its purpose is to display the data on the screen of both the Viewer and the Sharer. 

### User

A User has the following properties:

* `lat` - latitude of the user
* `long` - longitude of the user
* `path` - a Google maps polyline representing the path travelled by the user
* `planPath` - a Path object representing the current mission 
* `targetWayPoint` - the next waypoint the User must go to, points to a start or end of a Segment in the Path
* `targetBearing` - the bearing that the User must go at to reach the `targetWayPoint`
* `currentSeg` - the current segment that the User is at. Goes from 0 to the length of the Path.

A user has various methods to calculate and update its properties, as well as methods to display them on the UI. 

### Sharer

A Sharer has methods to obtain data from its sensors and send them to the server. Upon obtaining sensor data it sets them as its properties so that its super class User can display them on the map. A Sharer has the following methods: 

* `getHeading()` - obtains the heading from the magnetometer 
* `getLocation()` - obtains the location from the GPS
* `sharePos()` - post the updated positon to the server as an XMLHttpsRequest
* `shareHeading()` - post the updated heading to the server as an XMLHttpsRequest

### Viewer

A viewer has methods to obtain data from the server. Upon obtaining data it sets them as its properties so that its super class User can display them on the map. A Viewer has the following methods:

* `getHeading()` - obtains the heading from the server via a socket.io connection
* `getSharerPos()` - obtains the location from the server via a socket.io connection

The operation of the telemetry phase can be described as follows: 

1. The User (meaning both Sharer and Viewer) plots the previously planned mission on the map 
2. The Sharer posts its heading and location to Server
3. The server emits an event whenever it receives a new heading or location 
4. The Viewer listens to the events and updates its own variables 
5. The User displays the data on the UI

# Engineering display 

Engineering display shows various plots of data. More to come... 
