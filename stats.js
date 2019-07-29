let g1; 
let g2; 
let socket;
let acc  = [];
let rot = [];
let updated = false; 
window.onload = function () {



  let socket = io({
    // option 1
  
    // option 2. WARNING: it leaves you vulnerable to MITM attacks!
    rejectUnauthorized: false,
    forceNew: true
  });

  

    g1 = new Dygraph(
        document.getElementById("graph_1"),
        "Time,AccX,AccY,AccZ,RotA,RotB,RotG\n"+
        `${new Date()}, 0,0,0,0,0,0\n`, // path to CSV file
        {
            drawPoints: false,
            showRoller: false,
            rollPeriod: 0,
            axes: {
              x : {
                drawGrid: false
              },
              y : {
                drawGrid: false
              },
            },
            legend: 'always',
            labels: ['Time', 'AccX (m/s)','AccY (m/s)', 'AccZ (m/s)', 'rotA (deg/s)', 'rotB (deg/s)', 'rotG (deg/s)'],
            labelsSeparateLines: true,
            visibility: [false, false, false, false, false, false]
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
          

    socket.on('new-acc', (data) => {

      let arr = new Int16Array(data);
      console.log('new data');
       // arr[0] = arr[0]/100;
       // arr[1] = arr[1]/100;
       // arr[2] = arr[2]/100;
      //console.log(arr);
     if(!updated) {
      console.log('update');

      updated = true; 
      acc.push([new Date(), arr[0]/100, arr[1]/100, arr[2]/100, arr[3], arr[4], arr[5]]);
     // console.log(row);
      g1.updateOptions({'file': acc }); 
      updated = false; 
     }

      //console.log("new acc");

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


 
  function updateCharts() {
    
    socket.once('new acc', (data) => {
      acc.push([new Date(data.time), Number(data.accX), Number(data.accY), Number(data.accZ)]);
     // console.log(row);
      g1.updateOptions({'file': acc }); 
      //console.log("new acc");

    }); 

    socket.once('new rot', (data) => {
      rot.push([new Date(data.time), Number(data.rotA), Number(data.rotB), Number(data.rotG)]);
      // console.log(row);
       g2.updateOptions({'file': rot }); 
     // console.log("new rot");

    }); 
  

  }


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