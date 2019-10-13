import StateUpdater from './stateUpdater.js';

export default class RosUpdater extends StateUpdater {
constructor(med, ros){
    super(med); 
    this.ros = ros; 

    this.headingListener = new ROSLIB.Topic({
        ros: this.ros,
        name: '/sensed/yaw',
        messageType: 'std_msgs/Float64'
      }); 
  
      this.fixListener = new ROSLIB.Topic({
        ros: this.ros,
        name: '/ublox_gps/fix',
        messageType: 'sensor_msgs/NavSatFix'
      });

    this.speedListener = new ROSLIB.Topic ({
      ros: this.ros, 
      name: '/mobile_base_controller/sensed_vel',
      messageType: 'geometry_msgs/Twist',
    })
  
}

getWheelSpeed() {
let that = this; 
that.speedListener.subscribe(function (message) {
  let linear = message.linear.x; 
  let angular = message.angular.z; 
  that.updateWheelSpeed(linear, angular); 
});

}

getLocation() {
  console.log('started loc');
    let that = this;
    that.fixListener.subscribe(function(message) {
      console.log('updating');
      let lat = message.latitude;
      let long = message.longitude;
      let fixMode = message.status.service;
      let uncertRadius = Math.sqrt(message.position_covariance[0]);
      that.updateLocation(lat, long, undefined, uncertRadius, fixMode);  
     // that.shareLocation();
     // that.plotPath();
     // that.shareDetails(); 
    });
    this.getWheelSpeed(); 


  }


  getHeading() {
    let that = this; 
    that.headingListener.subscribe(function(message) {
      let heading = that.convertFromRosHeading(message.data).toFixed(0);
      that.updateHeading(heading)
     // that.shareHeading(that.heading);
     // that.showHeading(that.heading);
    }

    )}


    convertFromRosHeading(heading) {
        if (heading < 0)
        return  -heading;
        else 
        return 360 - heading;
    
       }
      
  
      convertToRosHeading(heading) {
        if ( heading >= 0 && heading <= 180)
        return -heading
        else 
        return 360 - heading; 
  
    }

};