
// wrapping the chart code inside a function that
// automatically resizes the chart
function makeResponsive() {
  console.log('connection successful') // validating connection
  

}
// when the browser loads, makeResponsive() is called.
makeResponsive();

// when the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);