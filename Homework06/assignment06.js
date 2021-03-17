var height = 1000;
var width = 1000;
var margin = 100;

var field = "Afghanistan";

const colorScale = d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl)

d3.csv("../data/countries_processed_v3.csv", function(result) {
        console.log("tabular data", result);
        const nested = d3.nest()
                        
                        .key(d => d.Continent)
                        //.key(d => d.Pop_Density)
                        //.key(d => d.Birthrate)
						//.key(d => d.Deathrate)
						.key(d => d.Country)
                        .rollup(d => d.map(c => ({area: +c.Area, population: +c.Population})))
                        .entries(result);
        console.log("nested data", nested);
		
		var root = d3.hierarchy(makeRoot(nested, false))
			.sum(d => d.data.population);
			
		var pack = d3.pack()
			.size([width-50, height-50])
			.padding(1);
			
		var nodes = pack(root).descendants();
		
		colorScale.domain(d3.extent(nodes, n => n.height));
		
	   draw(pack(root).descendants());	   
    });

/*    
function makeRoot(items) {
	var object = {
		key : "World",
		values: items
	};
	return makeSubtree(object);
}

function makeSubtree(item) {
	var object = {
		id: item.key,
		data: {population: 0, area: 0},
	};
	
	if (item.values) {
		if (item.values.length == 1) {
			object = makeSubtree(item.values[0]);
		} else {
			object.children = [];
			item.values.forEach(function(value) {
				var subtree = makeSubtree(value);
				object.children.push(subtree);
				object.data.population += subtree.data.population;
				object.data.area += subtree.data.area;
			});
		} 
	} else if (item.value) {
		object.data = item.value[0];
	} return object;
}
*/

function makeRoot(items, nesting) {
	var object = {
		key : "World",
		values: items
	};
	return makeSubtree(object, nesting);
}

function makeSubtree(item, nesting) {
	var object = {
		id: item.key,
		data: {population: 0, area: 0},
	};
	
	if (item.values) {
        if (nesting) {
            if (item.values.length == 1) {
                object = makeSubtree(item.values[0], nesting);
            } else {
                object.children = [];
                item.values.forEach(function(value) {
                    const subtree = makeSubtree(value, nesting);
                    object.children.push(subtree);
                    object.data.population += subtree.data.population;
                    object.data.area += subtree.data.area;
                });
            }
        } else {
            object.children = [];
            item.values.forEach(function (value) {
                const subtree = makeSubtree(value, nesting);
                object.children.push(subtree);
                object.data.population += subtree.data.population;
                object.data.area += subtree.data.area;
            });
        }
    } else if(item.value) {
        object.data = item.value[0];
    }
    return object;
}
		
function draw(data) {
	//const offsetX = margin/2 + width/2;
	//const offsetY = margin/2 + height/2;
	
	const svg = d3.select("body").append("svg").attr("height", height).attr("width", width);
	const chart = svg.append("g").attr("transform", d => `translate(${[25,25]})`);
	//const chart = svg.append("g").attr("transform", d => `translate(${[offsetX, offsetY]})`);
	

	const zoom = d3.zoom()
        .on('zoom', function() {
            chart.attr("transform",
                   d3.event.transform); //(offsetX, offsetY));
        });
	svg.call(zoom);
	
	packCirlces(chart, data);
	drawText(chart, data);
}


function packCirlces(g, data) {
	console.log("pack data", data);
	g.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("transform", d => `translate(${[d.x, d.y]})`)
        .attr("r", d => d.r)
        .attr("fill", function(d) {
            return colorScale(d.height); })
        .attr("stroke", function(d) {
            return d3.color(colorScale(d.value)).darker(); });
		
		
}


function drawText(g, data) {
        var tooltip = d3.select("body")
			.append("div")
			.append("class", "tooltip")
			.append("opacity", .5)
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "1px")
			.style("border-radius", "5px")
			.style("padding", "10px")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden"); 
	
	
	var mouseover = function(d,i) {
        tooltip
            .style("opacity", 1)
            .style("visibility", "visible")
            .html("Country: " + d + " Population: " + i); 
	}

    var mousemove = function(d,i) {
      tooltip
        .style("top", (d3.event.pageY-10)+"px")
        .style("left",(d3.event.pageX+10)+"px"); 
	}
      
    var mouseleave = function(d,i) {
        tooltip
            .style("opacity", 0);
        //d3.select(this)
         //   .style("stroke", "none")
        //    .style("visibility", "hidden");
    }
		
		g.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("transform", d => `translate(${[d.x, d.y]})`)
            .text(d => d.data.id)
            //.style("font-size", "0.5px")
            .style("font-size", function(d) {
                const size = Math.min(2*d.r, (2*d.r - 8) / this.getComputedTextLength() * 9);
                if (size > 0) {
                    return size + "px";
                } 
                return 0;
            })
            .attr("y", function(d) {
                return +this.style.fontSize.split('px')[0]/4;
            })
            .attr("opacity", d => d.r > 2  && !d.children ? 1 : 0)
			.on("mouseover", function(d, i) {return mouseover(d.data.id, d.data.data.population); })
			.on("mousemove", function(d, i) {return mousemove(d.data.id, d.data.data.population); })
			.on("mouseleave", function(d, i) {return mouseleave(d.data.id, d.data.data.population); })
            .on("click", function(d) {
                d3.select(this);
                console.log(this);
                console.log("id", d.data.id);
                updateBar(d.data.id);
		});
						
    }	