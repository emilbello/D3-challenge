
// wrapping the chart code inside a function that
// automatically resizes the chart
function makeResponsive() {
  console.log('connection successful') // validating connection
  
    // if the svg area is not empty whenb the browser leads, 
    // remove it and replace it with a resized version of the chart
    // define svgArea
    var svgArea = d3.select('body').select('svg');
    // clearing if svg is not empty
    if (!svgArea.empty()) {
        svgArea.remove()
    };

    // dynamically determining the wrapper dimensions by the width and height 
    // of the browser window
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
    // console.log(`dynamic width: ${svgWidth} and height: ${svgHeight}`) // checking results
    // defining the chart margins from the svg area
    var margin = {
        top: 50,
        bottom: 150,
        left: 50,
        right: 150
    };

    // appending svg element
    var svg = d3.select('#scatter')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth);

    // appending group element
    var chartGroup = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // defining initial parameters
    var chosenXAxis = 'poverty';
    var chosenYAxis = 'healthcare';

    // functions used to updates scale variables upon click on axis labels
    function xScale(data, chosenXAxis) {
        // creating the scales
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.9, 
            d3.max(data, d => d[chosenXAxis]) * 1.1])
        .range([0, width])
    
        return xLinearScale
    }

    function yScale(data, chosenYAxis) {
        // creating the scales
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.9, 
            d3.max(data, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);
    
        return yLinearScale;
    }

    // functions used for updating axes variables upon click on axis label
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
        
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
    
        return xAxis;
    }
    
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
            .duration(100)
            .call(leftAxis);

        return yAxis
    }

    


}
// when the browser loads, makeResponsive() is called.
makeResponsive();

// when the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);