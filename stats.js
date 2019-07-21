window.onload = function () {
  

    g2 = new Dygraph(
        document.getElementById("div_g"),
        "/motion.csv", // path to CSV file
        {}          // options
      );




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