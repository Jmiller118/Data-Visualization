var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rate); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("../data/abortion_orginal.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.rate = +d.rate;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  //y.domain([0, d3.max(data, function(d) { return d.rate; })]);
	y.domain([0, 200]);

  // Add the valueline path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
	  
  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top - 50))
        .attr("text-anchor", "middle")  
        .style("font-size", "26px") 
        .style("text-decoration", "underline")  
        .text("Abortion Rates - Near Constant");

  svg.append("text")
    .attr("class", "axisLabel")
	.style("font-size", "14px") 
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (930 - height) + ")")
    .style("text-anchor", "middle")
    .text("Abortion Rates have remained constant since 1980");		
		

});