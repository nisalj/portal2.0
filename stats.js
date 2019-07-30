let g1; 
let g2; 
let socket;
let acc  = [];
let rot = [];
let updated = false; 
let graphOn = false; 
let started = false;
//let toggle = document.getElementById("toggle-graph");

window.onload = function () {


  let toggle = document.getElementById("toggle-graph");
  let clear = document.getElementById("clear-graph");


  let socket = io({
    // option 1
  
    // option 2. WARNING: it leaves you vulnerable to MITM attacks!
    rejectUnauthorized: false,
    forceNew: true
  });

  

    g1 = new Dygraph(
        document.getElementById("graph_1"),
        `${new Date()}, 0,0,0,0,0,0\n`, // path to CSV file
        {
            drawPoints: false,
            showRoller: false,
            rollPeriod: 0,
            axes: {
              x : {
                drawAxis: true, 
                drawGrid: false
              },
              y : {
                drawGrid: false,
                valueRange: [-20,20]
              
              },
            },
            legend: 'always',
            labels: ['Time', 'AccX (m/s)','AccY (m/s)', 'AccZ (m/s)', 'rotA (rad/s)', 'rotB (rad/s)', 'rotG (rad/s)'],
            labelsSeparateLines: true,
            visibility: [false, false, false, false, false, false],
            dateWindow: [Date.now(), Date.now() + 30000]
        }          // options
      );


    
    // socket = io.connect("https://localhost:5000", {reconnection: false, 
    // secure: true, 
    // rejectUnauthorized: false, 
    // forceNew: true, 
    // timeout: 60000,
    // pingTimeout: 60000,
    // reconnectionDelay: 10000,
    // reconnectionAttempts: Infinity,
    // } );

   // socket = io.connect("https://localhost:5000", {rememberTransport : false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling']});
      socket = io.connect();
    
    socket.on('error', err => {
      console.log('error', err);
    });
          

    clear.addEventListener("click" , () => {
      //console.log("clear");
      toggle.innerText = "Start";
      started = false; 
      acc = []; 
      acc.push([new Date(), 0, 0, 0, 0,0,0]); 
      g1.updateOptions({'file': acc }); 
      socket.off('new-acc');


    }); 


 toggle.addEventListener( "click", () => {
    if (!started) {
      toggle.innerText = "Pause";

      socket.on('new-acc', (data) => {
        g1.updateOptions({dateWindow: [Date.now() - 6000, Date.now()]}); 
        let arr = new Int16Array(data);
        //console.log('new data');
         // arr[0] = arr[0]/100;
         // arr[1] = arr[1]/100;
         // arr[2] = arr[2]/100;
        //console.log(arr);
       if(!updated) {
        //console.log('update');
        updated = true; 
        if(acc.length == 400) {
          acc.splice(0,150);
          //acc = []; 
          //g1.updateOptions({dateWindow: [Date.now(), Date.now() + 6000]}); 

        }
        let d = new Date(); 

        acc.push([d, arr[0]/100, arr[1]/100, arr[2]/100, arr[3]*Math.PI/180, arr[4]*Math.PI/180, arr[5]*Math.PI/180]);
       // console.log(row);
        g1.updateOptions({'file': acc }  
        //{dateWindow: [0, Date.now()]} 
        ); 
        updated = false; 
       }
       
  
        //console.log("new acc");
  
      }); 
      started = true; 
    } else {
      toggle.innerText = "Start";
      started = false; 
      socket.off('new-acc');
    }

  });



    // g2 = new Dygraph(
    //     document.getElementById("graph_2"),
    //     "/rot.csv", // path to CSV file
    //     {
    //         drawPoints: true,
    //         showRoller: true,
    //     }          // options
    //   );

    // setInterval(updateCharts, 5); 

//  window.intervalId = setInterval(function() {
//     //  updateCharts();
//     $.get('/acc.csv', (data) => {


//         g1.updateOptions( { 'file': data } );
//         });
     
//  }, 1000);


//  function updateCharts() {
//     $.get('/acc.csv', (data) => {
//         console.log(data);
//     g1.updateOptions( { 'file': data } );
//     });
//  }



    // var data = [];
    // var t = new Date();
    // for (var i = 10; i >= 0; i--) {
    //   var x = new Date(t.getTime() - i * 1000);
    //   data.push([x, Math.random()]);
    // }

    // var g = new Dygraph(document.getElementById("div_g"), data,
    //                     {
    //                       drawPoints: true,
    //                       showRoller: true,
    //                       valueRange: [0.0, 1.2],
    //                       labels: ['Time', 'Random']
    //                     });
    // // It sucks that these things aren't objects, and we need to store state in window.
    // window.intervalId = setInterval(function() {
    //   var x = new Date();  // current time
    //   var y = Math.random();
    //   data.push([x, y]);
    //   g.updateOptions( { 'file': data } );
    // }, 1000);
  };




  function toggleAccX () {

    var checkBox = document.getElementById("accX");
    if (checkBox.checked == true){
      g1.setVisibility(0, true);
    } else {
      g1.setVisibility(0, false);
    }
  }

  function toggleAccY () {
  
    var checkBox = document.getElementById("accY");
    if (checkBox.checked == true){
      g1.setVisibility(1, true);
    } else {
      g1.setVisibility(1, false);
    }
  }

  function toggleAccZ () {

    var checkBox = document.getElementById("accZ");
    if (checkBox.checked == true){
      g1.setVisibility(2, true);
    } else {
      g1.setVisibility(2, false);
    }
  }
  function toggleRotA () {
    console.log(this);
    console.log('tog');
    var checkBox = document.getElementById("rotA");
    if (checkBox.checked == true){
      g1.setVisibility(3, true);
    } else {
      g1.setVisibility(3, false);
    }
  }
  function toggleRotB () {
    var checkBox = document.getElementById("rotB");
    if (checkBox.checked == true){
      g1.setVisibility(4, true);
    } else {
      g1.setVisibility(4, false);
    }
  }
  function toggleRotG () {
    var checkBox = document.getElementById("rotG");
    if (checkBox.checked == true){
      g1.setVisibility(5, true);
    } else {
      g1.setVisibility(5, false);
    }
  }







// window.onload = function () {

//     var dps = []; // dataPoints
//     var chart = new CanvasJS.Chart("chartContainer", {
//         // theme: "dark2",
//         // backgroundColor: "#060606",
//         title :{
//             text: "Acceleration"
//         },
//         axisY: {
//             includeZero: false
//         },      
//         data: [{
//             type: "line",
//             dataPoints: dps
//         }]
//     });
    
//     var xVal = 0;
//     var yVal = 100; 
//     var updateInterval = 1000;
//     var dataLength = 20; // number of dataPoints visible at any point
    
//     var updateChart = function (count) {
    
//         count = count || 1;
    
//         for (var j = 0; j < count; j++) {
//             yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
//             dps.push({
//                 x: xVal,
//                 y: yVal
//             });
//             xVal++;
//         }
    
//         if (dps.length > dataLength) {
//             dps.shift();
//         }
    
//         chart.render();
//     };
    
//     updateChart(dataLength);
//     setInterval(function(){updateChart()}, updateInterval);
    
//     }