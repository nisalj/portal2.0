import Sharer from './sharer.js'

export default class Operator extends Sharer {
    constructor(ros, title, options, path){
    super(title, options, path);
    this.ros = ros; 
    this.cmdVel = new ROSLIB.Topic({
        ros : this.ros,
        name : 'turtle1/cmd_vel',
        messageType : 'geometry_msgs/Twist'
      });
    
    }



    start() {
    let twist = new ROSLIB.Message({
            linear : {
              x : 0.1,
              y : 0.2,
              z : 0.3
            },
            angular : {
              x : -0.1,
              y : -0.2,
              z : -0.3
            }
    });


    setInterval(this.sendCommand.bind(this, twist), 100); 
        
    }


    



    // //get location from robot gps, 
    getLocation() {

    }


    //get imu/heading data from robot 
    getMotion() {


    }


    sendCommand(vel) {
        this.cmdVel.publish(vel);
    }


    

    




}