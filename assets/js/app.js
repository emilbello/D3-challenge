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
  }
  // dynamically determining the wrapper dimensions by the width and height 
  // of the browser window
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 20,
    right: 40,
    bottom: 150,
    left: 150
  };
  // dynamically adjusting the chart position with the svg area
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // SVG wrapper, that appends an SVG group that will hold the chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // appending SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  // function used for updating x-scale var upon click on axis label
  // ##### x-axis #####
  // initial x-axis parameters
  var chosenXAxis = 'poverty';
  // function used for updating x-scale var upon click on axis label
  function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
        d3.max(data, d => d[chosenXAxis]) * 1.1])
      .range([0, width]);

    return xLinearScale;
  }
  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    console.log('calling renderXAxes function')
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }

  // ##### y-axis #####
  // initial y-axis parameters
  var chosenYAxis = 'healthcare';
  // function used for updating y-scale var upon click on axis label
  function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.9, 
    d3.max(data, d => d[chosenYAxis]) * 1.1])
    .range([height, 0]);

    return yLinearScale;
  }
  // function used for updating yAxis var upon click on axis label
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newXScale);
    //console.log('calling renderYAxes function')
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  }

  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr('cx', d => newXScale(d[chosenXAxis]))
      .attr('cy', d => newYScale(d[chosenYAxis]));

    return circlesGroup;
  }
  // function used for updating text in circles group with a transition to
  // new text
  function renderText(circlesTextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesTextGroup.transition()
      .duration(1000)
      .attr('tx', d => newXScale(d[chosenXAxis]))
      .attr('ty', d => newYScale(d[chosenYAxis]));

    return circlesTextGroup;
  }
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesTextGroup) {

    var xlabel;

    if (chosenXAxis === 'poverty') {
      xlabel = 'Poverty';
    }
    else if (chosenXAxis === 'age') {
      xlabel = 'Age';
    }
    else {
      xlabel = 'Income';
    }

    var yLabel;

    if (chosenYAxis === 'healthcare') {
      yLabel = 'Healthcare'
    }
    else if (chosenYAxis === 'smokes') {
      yLabel = 'Smokes'
    }
    else {
      yLabel = 'Obesity'
    }

    // defining dynamic tooltip according to axis selection
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .attr('class', 'toolTip')
      .html(function(d) {
        if (chosenXAxis === 'poverty') {
          return (`${d.state}<hr>${yLabel}: ${d[chosenYAxis]}%<br>${xlabel}: ${d[chosenXAxis]}%`);
        }
        else {
          return (`${d.state}<hr>${yLabel}: ${d[chosenYAxis]}%<br>${xlabel}: ${d[chosenXAxis]}`);
        }
      });

    circlesGroup.call(toolTip);
    
    // onmouseover event listener
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d);
    })
      // onmouseout event
      .on("mouseout", function(d, i) {
        toolTip.hide(d);
      });
    
    // circlesTextGroup.on("mouseover", function(d) {
    //  toolTip.show(d);
    //
    return circlesGroup;
  }

  // Retrieve data from the CSV file and execute everything below
  d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    // parsing the data to get numeric values
    data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });

    // xLinearScale function above 
    var xLinearScale = xScale(data, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(data, chosenXAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.obesity))
      .attr("r", 20)
      .attr("fill", "royalblue")
      .attr("opacity", ".5");

    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty') // value to grab for event listener
      .classed('active', true)
      .text("In Poverty (%)");
    
    var ageLabel = labelsGroup.append("text")
      .attr('x', 0)
      .attr('y', 50)
      .attr('value', 'age') // value to grab for event listener
      .classed('active', true)
      .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
      .attr('x', 0)
      .attr('y', 80)
      .attr('value', 'income') // value to grab for event listener
      .classed('active', true)
      .text("Household Income (Median)");

    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text('Obesity');

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
            .attr()  
            .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === 'age') {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  }).catch(function(error) {
    console.log(error);
  });
}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);