// this is where your implementation for your scatter plot should go 
function ScatterPlot(svg, data, updateFlowDiagram) {

    var margins = {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30
    },
    
	width = 600 - margins.left - margins.right,
	height = 400 - margins.top - margins.bottom;
	
    this.svg = svg;
    
    // grab the bounding box of the container
    var boundingBox = svg.node().getBoundingClientRect();

    //  grab the width and height of our containing SVG
    var svgHeight = boundingBox.height;
    var svgWidth = boundingBox.width;

	var svg = d3.select("#chart")
		.attr("width", svgWidth + margins.left + margins.right)
		.attr("height", svgHeight + margins.top + margins.bottom)
		.attr("transform",
            "translate(" + margins.left + "," + margins.top + ")");
	
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);
	
	x.domain(d3.extent(data, function(d) {return d.v0;}));
	y.domain([0, d3.max(data, function(d) {return d.v1;})]);
	
	var xAxisCall = d3.axisBottom(x);
	
	var xAxis = this.svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(65, " + height + ")");
		
	var yAxisCall = d3.axisLeft(y);	
		
	var yAxis = this.svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(65" + ", 0" + ")");
	
	var line = d3.line()
			.x(function(d) {return x(d.v0);})
			.y(function(d) {return y(d.v1);});
	
	svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

	this.draw = function(data) {
		
		var t = d3.transition().duration(950); 
		
		var new_x = x.domain(d3.extent(data, function(d) {return d.v0;}));
		var new_y = y.domain([0, d3.max(data, function(d) {return d.v1;})]);
		
        var xdata = data.map(function(d) {return d.v0;});
        var ydata = data.map(function(d) {return d.v1;});
        
		xAxis.call(d3.axisBottom(new_x));
		yAxis.call(d3.axisLeft(new_y));
		
		
		var leastSquare = function(xdata, ydata) {
            var ReduceAddition = function(prev, cur) {
                return prev + cur;
            };
            
            var xBar = xdata.reduce(ReduceAddition) * 1.0 / xdata.length;
            var yBar = ydata.reduce(ReduceAddition) * 1.0 / ydata.length;
            
            var squareX = xdata.map(function(d) {
                return Math.pow(d - xBar, 2);
            }).reduce(ReduceAddition);
            
            var squareY = ydata.map(function(d) {
                return Math.pow(d - yBar, 2);
            }).reduce(ReduceAddition);
            
            var meanDiff = xdata.map(function(d,i) {
                return (d - xBar) * (ydata[i] - yBar);
            }).reduce(ReduceAddition);
            
            var slope = meanDiff / squareX;
            var intercept = yBar - (xBar * slope);
            
            return function(j) {
                return j * slope + intercept
            }
        }
		
		var regression = leastSquare(xdata, ydata);
        
		//add the scatterplot
		var plot = this.svg.selectAll("circle")
			.data(data);
		
		var line = d3.line()
            .x(function(d) {return x(d.v0);})
            .y(function(d) {return y(regression(d.v1));});
			//.x(function(d) {return xdata;})
			//.y(function(d) {return ydata;});
		
		
        plot.exit()
			.attr("class", "exit")
			.transition(t)
			.remove();
        
        //update
		plot.attr("class", "update")
		    .transition(t)
			.attr("fill", "orange")
			.attr("cx", function(d) {return x(d.v0);})
			.attr("cy", function(d) {return y(d.v1);})
            .attr("transform", "translate(65" + ", 0" + ")");
        
		//new data
		plot.enter()
			.append("circle")
			.attr("class", "enter")
			.transition(t)
			.attr("transform", "translate(65" + ", 0" + ")")
			.attr("r", 3)
			.attr("cx", function(d) {return x(d.v0);})
			.attr("cy", function(d) {return y(d.v1);})
			.attr("fill", "green");
		
		plot.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
        
		
               
	}
    
	this.draw(data);
    
}
