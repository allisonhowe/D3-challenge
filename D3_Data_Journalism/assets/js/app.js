// Set up chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(csvData) {
  csvData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.income = +data.income;
  });

  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d.income), d3.max(csvData, d => d.income)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d.obesity), d3.max(csvData, d => d.obesity)])
    .range([height, 0]);


  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Add bottomAxis
  chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);

  // Add leftAxis to the left side of the display
  chartGroup.append("g").call(leftAxis);

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Income");

  // Add points on the graph
  var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "7")
    .attr("fill", "lightblue");

  chartGroup.append('g')
    .selectAll("text")
    .data(csvData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.income))
    .attr("y", d => yLinearScale(d.obesity))
    .attr("font-size", "10")
    .attr("fill", "black")
    .attr("dx", "-0.7em")
    .attr("dy", "0.4em")
    .text(d => d.abbr);

  // Append a div to the body to create tooltips, assign it a class
  var toolTip = d3.select("#scatter").append("div")
    .attr("class", "tooltip");

  // Add an onmouseover event to display a tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.style("display", "block");
    toolTip.style("background-color", "black");
    toolTip.style("color", "white");
    toolTip.style("opacity", "1");
    toolTip.style("text-align", "center");
    toolTip.html(`${d.state} <br> Obesity: ${d.obesity} <br> Income: ${d.income}`)
      .style("left", (xLinearScale(d.income) + 80) + "px")
      .style("top", (yLinearScale(d.obesity) + 20) + "px");
  })
  // Add an onmouseout event to make the tooltip invisible
  .on("mouseout", function() {
    toolTip.style("display", "none");
  });
})
