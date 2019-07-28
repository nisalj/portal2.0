import Viewer from './viewer.js';

export default class Operator extends Viewer {
    constructor(path, socket, ros){
    super(path, socket);
    this.ros = ros; 
    this.cmdVel = new ROSLIB.Topic({
        ros : this.ros,
        name : '/mobile_base_controller/cmd_vel',
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
      this.video = document.getElementById("robotFrontCamera"); 
      this.robot_IP = "127.0.0.1";
      this.turnSpotFunc;
      this.pidFunc; 
      this.stopbutton = document.getElementById("stopbutton")
      this.initialTurn = 0;

    }



    start() {
  
    this.joystick();
    this.cmdVel.advertise();
    this.video.style.display = "block";
    //$.post('/start', 'mission start');
 
    this.stopbutton.addEventListener("click", () => {
      if(this.turnSpotFunc)
      clearInterval(this.turnSpotFunc);
      if(this.pidFunc)
      clearInterval(this.pidFunc);
      if(this.movefunc)
      clearInterval(this.movefunc);
      this.twist.linear.x = 0;
      this.twist.angular.z = 0;
      this.moveAction();
   
    }); 

    this.makePlan(); 
    setTimeout(this.getLocation.bind(this), 200);
    setTimeout(this.getHeading.bind(this), 300);
    
    //setTimeout(this.getMotion.bind(this),400);

   // this.video.src = "http://" + this.robot_IP + ":8080/stream/video.mjpeg";
   // this.video.src = "http://127.0.0.1:8080/stream_viewer?topic=/webcam/image_raw&type=mjpeg&quality=80"
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
            var ang = Math.sin(direction / 57.29) * nipple.distance * 0.02;
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



  updateTargetWayPoint() {
       console.log('op');
       if(this.pidFunc)
       clearInterval(this.pidFunc);   
>>>>>>> f9328c8d3c571566988478433bd2664eb4b8e11a
    if (this.atSegStart) {
      this.targetWayPoint = this.getCurrentSeg().getEnd(); 
      this.atSegStart = false; 
      //console.log('update');
      console.log(this.planPlath.segNo());
      this.turnSpotFunc = setInterval(this.turnToWaypoint.bind(this), 50);
      //this.turnToWaypoint();
     // setTimeout(this.turnToWaypoint.bind(this), 1000);
      
    } else if(this.currentSeg != this.planPlath.segNo()) {
      this.updateCurrentSeg(); 
      this.targetWayPoint = this.getCurrentSeg().getStart(); 
      this.atSegStart = true; 
      this.turnSpotFunc= setInterval(this.turnToWaypoint.bind(this), 50);

      
   //   this.turnToWaypoint();
  //    setTimeout(this.turnToWaypoint.bind(this), 1000);

    } else {
      clearInterval(this.pidFunc);
      console.log("Mission complete"); 
    }
    console.log(this.targetBearing); 
  }


  turnToWaypoint() {
  
    let correction_cw = 0.3;
    let correction_ccw = -0.3; 
    if(this.initialTurn <= 35) 
    {

        correction_cw = 0.5;
        correction_ccw = -0.5;
      
     
      this.initialTurn++; 
    } else{
      correction_cw = 0.3;
      correction_ccw = -0.3;
    }

   
    if(this.pidFunc)
    clearInterval(this.pidFunc);
  
    this.twist.linear.x = 0; 
    if (Math.abs(this.correction) < 10) {
      this.twist.linear.x = 0; 
      this.twist.angular.z = 0;
      this.moveAction();
      clearInterval(this.turnSpotFunc);
      this.initialTurn = 0;
      this.pidFunc = setInterval(this.magnetoPID.bind(this), 50); 
     // setImmediate(this.magnetoPID);
      console.log('here');
      return;
    } else if (this.correction < 0) {
      this.twist.angular.z = correction_cw;
      this.moveAction();
    } else {
      this.twist.angular.z = correction_ccw;
      this.moveAction();
    }


  }


  magnetoPID() {

    let correction_cw = 0.1;
    let correction_ccw = -0.1
    let move_forward = 0.3; 
    this.twist.linear.x = move_forward; 
    console.log('here pid');
      if (Math.abs(this.correction) < 10) {
        this.twist.linear.x = move_forward; 
        this.twist.angular.z = 0;
        this.moveAction();
        //return;
       // clearInterval(this.turnSpotFunc);
      } else if (this.correction < 0) {
        this.twist.linear.x = move_forward; 
        this.twist.angular.z = correction_cw;
        this.moveAction();
      } else {
        this.twist.linear.x = move_forward; 
        this.twist.angular.z = correction_ccw;
        this.moveAction();
      }
  
    

  }
    


    



    // //get location from robot gps, 
    // getLocation() {

    // }


    // //get imu/heading data from robot 
    // getMotion() {


    // }


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

 

    




