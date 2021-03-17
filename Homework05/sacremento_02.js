var url2 = "./data/canopy.json";
var url1 = "./data/sacremento.geojson";

var q = d3_queue.queue(1)
	.defer(d3.json, url1)
	.defer(d3.json, url2)
	.awaitAll(draw);
	

function draw(error, data) {
	"use strict";
	
	if (error) throw error;
	
	var margin = 50,
        width = window.innerWidth,
        height = window.innerHeight;
        
        console.log(height);
        console.log(width);
        
	var canopyScale = d3.scaleThreshold()
		.domain([0, 10, 15, 20, 25, 30, 35, 40])
		.range(["#D7301F", "#EF6548", "#FBB676", "#FEF4B9", "#A8C87D", "#359A4B", "#1B532D", "#12351F"]);
		
	var projection = d3.geoMercator()
		.center([-122.433701, 37.767683])
		//.center([0,5])
		.scale(50000)
		//.translate([width / 500, height / 0.5]);
		.translate([-300, height / 0.55]);
	
	var svg = d3.select("div.center").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");
	
	var path = d3.geoPath()
		.projection(projection);
	
    
	var map = d3.select('#map')
        //.append("svg")
        .attr("height", height)
        .attr("width", width)
		.attr("align", "center")
		.selectAll("path")
		.data(data[0].features)
		.enter()
		.append("path")
		.attr("cx", function(d) {return d.x;})
		.attr("d", path)
		.style("stroke", "white")
		.style("stroke-width", 0.5)
		
        .on("keydown", key);
        
        	
	map.datum(function(d) {
		var normalized = d.properties.name
          .replace(/ /g, '_')
          .replace(/\//g, '_');
	
    d.properties.name = normalized;
	d.count = data[1][d.properties.name];
	
    return d;
  });
  
    var key = function() {
        if (code == 'c') {
            
        }
    }
  
	var tooltip = d3.select("body")
		.append("div")
		.append("class", "tooltip")
		.append("opacity", .5)
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "1px")
		.style("border-radius", "5px")
		.style("padding", "5px")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden"); 
	
	
	var mouseover = function(d,i) {
        tooltip
            .style("opacity", 1)
            .style("visibility", "visible")
            .html(d + " Canopy Percentage: " + i); 
	}

    var mousemove = function(d,i) {
      tooltip
        .style("top", (d3.event.pageY-10)+"px")
        .style("left",(d3.event.pageX+10)+"px"); 
	}
      
    var mouseleave = function(d,i) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("visibility", "hidden");
    }
	
    var clock = d3.now() - start;
	d3.select("html").on("keydown", function() {
        if (d3.event.keyCode == 67) {
            d3.selectAll("path").transition().duration(1000).attr("fill", "white");
            var x = 15;
            var timer = d3.interval(function(clock) {
				console.log(x);
                animation(map, x);
                x = x + 5;
                
                if (x > 60) {
                    timer.stop();
                }
                
                if (x == 60) {
                    x = x + 10;
                }}, 2500);
        }
    });
    
     
	var start = d3.now();
    
    
    var animation = function(map, x) {
        var t = d3.transition().duration(1000);
        
        d3.selectAll("path")
        .filter(function(d) {
            if (d.count <= x) { 
                console.log(d.count);
				return d.count;
            }}
        )
			.transition(t)
            .attr("fill", function(d) {return canopyScale(d.count);});
    }            
       
	var x = d3.scaleLinear()
        .domain([1, 40])
        .range([0, 240]);
        
	var xAxis = d3.axisBottom(x)
       .scale(x)
       .tickSize(7)
       .tickValues(canopyScale.domain());
       
	var g = d3.select('g');
   
	g.select(".domain");
      
	g.selectAll("rect")
        .data(canopyScale.range().map(function(color) {
        var d = canopyScale.invertExtent(color);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
    return d;
	}))
	.enter().insert("rect", ".tick")
		.attr("height", 10)
		.attr("y", -250)
		.attr("align", "center")
		.attr("x", function(d) { return x(d[0]); })
		.attr("width", function(d) { return x(d[1]) - x(d[0]); })
		.attr("fill", function(d) { return canopyScale(d[0]); })

    g.append("text")
		.attr("fill", "#000")
		.attr("font-weight", "bold")
		.attr("text-anchor", "start")
		.attr("y", -225)
		.text("Tree Canopy Percentage");
  
	map
		.attr("class", function(d) {
			return d.properties.name; })
		.attr("fill", function(d) {
			return canopyScale(d.count); })
			.on("mouseover", function(d, i) {return mouseover(d.properties.name, d.count); })
		.on("mousemove", function(d, i) {return mousemove(d.properties.name, d.count); })
		.on("mouseleave", function(d, i) {return mouseleave(d.properties.name, d.count); })
		.attr("transform", "translate(60" + ", 70" + ")");

}