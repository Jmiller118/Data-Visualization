// set the dimensions and margins of the graph
var margin = {
    top: 0,
    right: 20,
    bottom: 10,
    left: 40
  },
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


// define the line
var valueline = d3.line()
    .x(function(d) {return x(d.years);})
    .y(function(d) {return y(d.Chinatown);});  

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

var svg = d3.select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
 
// Get the data
d3.csv("./data/2010-2017_review.csv", function(error, data) {
    if (error) throw error;

  //format the data
  data.forEach(function(d) {
    d.year = parseTime(d.years);
    d.Chinatown = +d.Chinatown;
  });
  

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) {
    return d.years;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.Chinatown;
  })]).nice();

  var tooltip = d3.select("body")
	.append("div")
	.append("class", "tooltip")
	.append("opacity", 1)
	.style("background-color", "white")
	.style("border", "solid")
	.style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
	.style("position", "absolute")
    .style("z-index", "10")
	.style("visibility", "hidden"); 
  
  
   // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line2")
        .attr("d", valueline)
        .attr("transform", "translate(62" + ", 70" + ")")
        .on("mouseover", function(d,i) {
            tooltip
                .style("opacity", 1)
                .style("visibility", "visible")
                .html(d.count);}) ;
 

  // Add the X Axis
  var marginB = 460;
 
  svg.append("g")
    .attr("transform", "translate(60," + marginB + ")")
    .call(d3.axisBottom(x)
      .tickFormat(d3.format(".4r")));
 
 svg.append("text")
    .attr("class", "axisLabel")
    .attr("transform",
      "translate(" + (width / 2.5 + 110) + " ," +
      (height + 110) + ")")
    .style("text-anchor", "middle")
    .text("Years");
 
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(60" + ", 70" + ")")
        .call(d3.axisLeft(y)
            .ticks(5));
 
  svg.append("text")
    .attr("class", "axisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left - 40)
    .attr("x", 0 - (height / 2) - 78)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Reviews"); 

    drawChart(field);
    
});
  
var drawChart = function(field) {  
    d3.select("#chart").select(".y.axis").remove();
    d3.select("#chart").select("path.line2").remove();
 
    svg.select("text")
        .attr("x", width/2)
        .attr("y", -400)
        .text(field);
        
    // Get the data
    d3.csv("./data/2010-2017_review.csv", function(error, data) {
        if (error) throw error;

    //format the data
    data.forEach(function(d) {
        d.year = parseTime(d.years);
        d[field] = +d[field];
  });    
   
    x.domain(d3.extent(data, function(d) {
    return d.years;
    }));
    y.domain([0, d3.max(data, function(d) {
    return d[field];
    })]).nice();
    
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(65" + ", 70" + ")")
        .call(d3.axisLeft(y)
            .ticks(5));
    
    var valueline = d3.line()
    .x(function(d) {return x(d.years);})
    .y(function(d) {return y(d[field]);});

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line2")
        .attr("d", valueline)
        .attr("transform", "translate(62" + ", 70" + ")");
        
  
})};
