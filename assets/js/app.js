// wrapping the chart code inside a function that
// automatically resizes the chart
function makeResponsive() {
  //console.log('connection successful') // validating connection
  
  // if the svg area is not empty whenb the browser leads, 
  // remove it and replace it with a resized version of the chart
  // define svgArea
  var svgArea = d3.select('body').select('svg');
  // clearing if svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove()
  }

  // dynamically determining the wrapper dimensions by the width and height 
  // of the browser window
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;
  // console.log(`${svgWidth} and ${svgHeight}`) // checking dynamic values on the console

  // defining the chart margins from the svg area
  var margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  };

  // dynamically adjusting the chart position with the svg area
  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // appending svg element
  var svg = d3.select('#scatter')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth);

  // appending group element
  var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // reading the data
  d3.csv('assets/data/data.csv').then(function(data) {
    console.log(data)

    // ############ should there be a %, Int parser? ##############
    data.forEach(function(data) {
      data.id = +data.id;
      data.state = +data.state;
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });

    // initial parameters
    var chosenXAxis = 'poverty'

    function xScale(data, chosenXAxis) {
    // create the scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty) * 0.9, d3.max(data, d => d.poverty) * 1.1])
      .range([0, width])

    }



  }).catch(function(error) { // getting error on the console for easier error debugging
      console.log(error);
    });

  


}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
