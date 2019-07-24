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
    
    this.twist = new ROSLIB.Message({
      linear : {
        x : 0.0,
        y : 0.0,
        z : 0.0
      },
      angular : {
        x : 0.0,
        y : 0.0,
        z : 0.0
      }
  });
      this.movefunc;
      this.publish = true; 


    }



    start() {
  
    this.joystick();
    this.cmdVel.advertise();


    //setInterval(this.sendCommand.bind(this, twist), 100); 
        
    }

    joystick() {
      console.log('joystick');
      let joystick = document.getElementById("joystick"); 
      let options = {
        zone: joystick,
        position: { left: 100 + 'px', bottom: 200 + 'px' },
        mode: 'static',
        size: 150,
        color: '#0066ff',
        restJoystick: true
    };

    let manager = nipplejs.create(options);

    let that = this; 
    manager.on('move', function (evt, nipple) {
            // nipplejs returns direction is screen coordiantes
            // we need to rotate it, that dragging towards screen top will move robot forward
            var direction = nipple.angle.degree - 90;
            if (direction > 180) {
                direction = -(450 - nipple.angle.degree);
            }
            // convert angles to radians and scale linear and angular speed
            // adjust if youwant robot to drvie faster or slower
            var lin = Math.cos(direction / 57.29) * nipple.distance * 0.005;
            var ang = Math.sin(direction / 57.29) * nipple.distance * 0.05;
            // nipplejs is triggering events when joystic moves each pixel
            // we need delay between consecutive messege publications to
            // prevent system from being flooded by messages
            // events triggered earlier than 50ms after last publication will be dropped
            if (lin !== undefined && ang !== undefined){
              that.twist.linear.x = lin;
              that.twist.angular.z = ang;  
            } else {
              that.twist.linear.x = 0;
              that.twist.angular.z = 0;  
            }
     
            //we need to keep publishing even when the joystick is NOT moving. ie when user is holding
            //a position
            if(that.publish){
              that.movefunc = setInterval(that.moveAction.bind(that), 50); 
              that.publish = false; 
            }

        });
        // event litener for joystick release, always send stop message
        manager.on('end', function () {
          clearInterval(that.movefunc)
          that.twist.linear.x = 0;
          that.twist.angular.z = 0;
          that.moveAction();
          that.publish = true;
          console.log('ended move');
        });
    

}

  video() {

  }



    


    



    // //get location from robot gps, 
    getLocation() {

    }


    //get imu/heading data from robot 
    getMotion() {


    }


    moveAction() {
      //console.log(this);
      //let twist = this.twist; 
      // if (lin != undefined && ang != undefined) {
      //     this.twist.linear.x = lin;
      //     this.twist.angular.z = ang;
      //    // console.log(linear, angular);
      //     //console.log(this.twist);
      // } else {
      //     this.twist.linear.x = 0;
      //     this.twist.angular.z = 0;
      // }
      console.log('moving');
      this.cmdVel.publish(this.twist);
  

    }


    

    




}