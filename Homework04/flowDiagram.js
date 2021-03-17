// this is where your implementation for your flow diagram should go 
function FlowDiagram(svg, data) {
    this.svg = svg;
    
    // grab the bounding box of the container
    var boundingBox = svg.node().getBoundingClientRect();

    //  grab the width and height of our containing SVG
    var svgHeight = boundingBox.height;
    var svgWidth = boundingBox.width;

	var bandScale = d3.scaleBand()
		.domain(["enter", "update", "exit"])
        .range([0, svgWidth])
        .padding(2);


    // this is where your code should go to generate the flow diagram from the random dat
   this.draw = function(data) {
        //transition function
        var t = d3.transition().duration(750); 
		
		//new data to old elements
		var text = this.svg.selectAll("text")
			.data(data, function(d) {return d.name; });
    
    
        var Exit1;
        var Exit2;
        var j = 0;
        var k = 0;

		//exit old, color red
		text.exit()
			.attr("class", "exit")
			.transition(t)
			.attr("x", 300)
            //.attr("y", function(d,i) {return i * 15;})
			.attr("y", function() 
                { if (Exit1)
                    {k=0; Exit1=false;} 
                else {
                    k++;
               } return k * 15;})
            .style("fill", "red")
            .attr("width", bandScale.bandwidth())
			.remove();
			
		//update the old in the new, color orage	
		text.attr("class", "update")
			.style("fill", "orange")
			.style("fill-opacity", 1)
            .attr("x", 150)
            .attr("y", function(d,i) {return i * 15;})
			.transition(t)
            .attr("width", bandScale.bandwidth());

		//new elements
		text.enter().append("text")
			.attr("class", "enter")
            .attr("x", 0)
            //.attr("y", function(d,i) {return i * 15;})
            .attr("y", function() 
                { if (Exit1)
                    {j=0; Exit1=false;} 
                else {
                    j++;
               } return j * 15;})
            .attr("width", bandScale.bandwidth())
            .style("fill", "green")
			.text(d => d.name)
			.transition(t)
			.style("fill-opacity", 1);
            
        //make the words actually words    
        text.text(function(d) {return d.name;});
        
	}
    
    //have to have an intial one
	this.draw(data); 
}	