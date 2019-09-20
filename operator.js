import Sharer from './sharer.js'; 

export default class Operator extends Sharer {
    constructor(options, path, ros, plan){
    super(options, path, plan);
    this.ros = ros; 


  this.configLeftSpeedClient = new ROSLIB.Service({
      ros : this.ros,
      name : '/left_wheel_pid/set_parameters',
      serviceType : 'dynamic_reconfigure/Reconfigure' 
   });
  
   this.configRightSpeedClient = new ROSLIB.Service({
    ros : this.ros,
    name : '/right_wheel_pid/set_parameters',
    serviceType : 'dynamic_reconfigure/Reconfigure' 
  });
  
  
  
  this.configHeadingClient = new ROSLIB.Service({
     ros: this.ros, 
     name: '/heading_pid/set_parameters',
     serviceType : 'dynamic_reconfigure/Reconfigure' 
    });
  

    this.cmdVel = new ROSLIB.Topic({
        ros : this.ros,
        name : '/mobile_base_controller/cmd_vel',
        messageType : 'geometry_msgs/Twist'
      });

    this.headingListener = new ROSLIB.Topic({
      ros: this.ros,
      name: '/sensed/yaw',
      messageType: 'std_msgs/Float64'
    }); 

    this.fixListener = new ROSLIB.Topic({
      ros: this.ros,
      name: '/fix',
      messageType: 'sensor_msgs/NavSatFix'
    })

    this.headingRefPublisher = new ROSLIB.Topic({
      ros: this.ros,
      name: '/ref/yaw',
      messageType: 'std_msgs/Float64'
    })
    
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


 


      this.wayPointButton = document.getElementById("start-waypoint");
      this.movefunc;
      this.publish = true;
      this.video = document.getElementById("robotFrontCamera"); 
      this.robot_IP = "127.0.0.1";
      this.turnSpotFunc;
      this.pidFunc; 
      this.pausebutton = document.getElementById("view")
      this.initialTurn = 0;
    }

  

    getLocation() {
      let that = this;
      that.fixListener.subscribe(function(message) {
        that.lat = message.latitude;
        that.long = message.longitude;
        if (message.status.status == 2)
        that.dgps = true;
        that.fixMode = message.status.service;
        that.longError = message.position_covariance[0];
        that.latError = message.position_covariance[4];
        that.uncertRadius = Math.sqrt(Math.pow(that.latError,2) + Math.pow(that.longError,2))
        that.shareLocation();
        that.plotPath();
        that.shareDetails(); 
      });


    }


    publishRefHeading() {

    }


    getHeading() {
      let that = this; 
      that.headingListener.subscribe(function(message) {
        that.heading = that.convertFromRosHeading(message.data).toFixed(0);
        that.shareHeading(that.heading);
        that.showHeading(that.heading);
      }

      )}

    sendRefHeading() {
      if (this.targetBearing == undefined) 
      return; 
      let heading = this.convertToRosHeading(this.targetBearing);
      this.headingRefPublisher.publish(heading);
      console.log('publishing ref');
    } 



    




    updatePID(type, coeff, value) {
      if(coeff == 'Kd')
      return; 

  let request = new ROSLIB.ServiceRequest({
    config: {
        doubles: [
            {name: coeff, value: value},       
        ]    
    }
   });



     if(type == 'speed') {
      this.configLeftSpeedClient.callService(request, function(result) {
        console.log('hey');
        console.log('Result for service call on '
            + configLeftSpeedClient.name
            + ': '
            + JSON.stringify(result, null, 2));
      });
      this.configRightSpeedClient.callService(this.request, function(result) {
        console.log('Result for service call on '
            + configRightSpeedClient.name
            + ': '
            + JSON.stringify(result, null, 2));
      });

     } else {
       //console.log(request);
       this.configHeadingClient.callService(this.request, function(result){
        console.log('Result for service call on '
        + configHeadingClient.name
        + ': '
        + JSON.stringify(result, null, 2));
       });

     }

    }
    




     convertFromRosHeading(heading) {
      if (heading < 0)
      return  -heading;
      else 
      return 360 - heading;
  
     }
    

    convertToRosHeading(heading) {
      if (heading <= 180)
      return -heading
      else 
      return 360 - heading; 

    }



    startheadingPID() {
      setInterval(this.sendRefHeading, 50); 
    }

    stopheadingPID() {
      clearInterval(this.sendRefHeading); 
    }
 


    start() {
  
    this.joystick();
    this.cmdVel.advertise();
    this.headingRefPublisher.advertise();

    this.wayPointButton.addEventListener("click", () => {
      if(!this.waypointStarted) {
        this.waypointStarted = true;
        this.wayPointButton.innerHTML = '<i class="fa fa-pause"</i>';

       // this.wayPointButton.className = "fa fa-pause";
        this.startheadingPID(); 
      } else {
        this.wayPointButton.innerHTML = '<i class="fa fa-play"</i>';
        this.waypointStarted = false;
        this.stopheadingPID();
      }
    });

   // this.video.style.display = "block";
    //$.post('/start', 'mission start');
 

   // this.makePlan(); 
    setTimeout(this.getLocation.bind(this), 200);
    setTimeout(this.getHeading.bind(this), 300);
    
    //setTimeout(this.getMotion.bind(this),400);
   // this.video.src = "http://115.70.221.82:8888/mjpg/video.mjpg";
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
            var lin = Math.cos(direction / 57.29) * nipple.distance * 0.01;
            var ang = Math.sin(direction / 57.29) * nipple.distance * 0.015;
            // nipplejs is triggering events when joystic moves each pixel
            // we need delay between consecutive messege publications to
            // prevent system from being flooded by messages
            // events triggered earlier than 50ms after last publication will be dropped
            if (lin !== undefined && ang !== undefined){
              that.twist.linear.x = -lin;
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
    // getLocation() {

    // }


    // //get imu/heading data from robot 
    // getMotion() {


    // }


    moveAction() {
      console.log('moving');
      this.cmdVel.publish(this.twist);
  

    }
  
  }

 

    




