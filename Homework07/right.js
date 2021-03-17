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

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg2 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("../data/abortion_2018.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
	  //console.log("d.date", d.data);
	  //console.log("d.rate", d.rate);
      d.rate = +d.rate;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([8, d3.max(data, function(d) { return d.rate; })]);

  // Add the valueline path.
  svg2.append("path")
      .data([data])
      .attr("class", "line2")
      .attr("d", valueline);

  // Add the X Axis
  svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg2.append("g")
      .call(d3.axisLeft(y));
	  
  svg2.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top - 50))
        .attr("text-anchor", "middle")  
        .style("font-size", "26px") 
        .style("text-decoration", "underline")  
        .text("Abortion Rates - Dramatically Increase");
		
   svg2.append("text")
    .attr("class", "axisLabel")
	.style("font-size", "14px") 
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (930 - height) + ")")
    .style("text-anchor", "middle")
    .text("Abortion Rates have increased since 1980");		

});