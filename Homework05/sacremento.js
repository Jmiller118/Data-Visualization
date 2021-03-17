
const width = 600;
const height = 500;
const file = "./data/sacremento.geojson";
const file2 = "./data/tree_canopy.csv";

const svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);
	
const projection = d3.geoMercator()
	.center([-120.433701, 37.767683])
    .scale(80000)
    .translate([width + 1200, height + 1200]);

const geoPath = d3.geoPath().projection(projection);

const thresholds = [0, 10, 15, 20, 25, 30, 35, 40],
	colors = ["#D7301F", "#EF6548", "#FBB676", "#FEF4B9", "#A8C87D", "#359A4B", "#1B532D", "#12351F"];

const canopyScale = d3.scaleThreshold().domain(thresholds).range(colors);


const map = {};


d3.json(file).then(function(shapes) {
	console.log(shapes);
	map.features = shapes.features;
	draw();
});


Promise.all([
	d3.json(file),
	d3.csv(file2, function(row) {
		return {
			//csv stuff
			name : row.Neighhorhood,
			acres : +row.Acres,
			canopy : +row.Canopy,
			count : +row.id
		}
	})
	]).then(function([shapes, thematic]) {
		console.log(shapes);
		console.log(thematic);
		
		map.features = shapes.features;
		
		map.features.forEach(function(d) {
			//supposed to be the json file data
			const entry = thematic.filter(t => t.name == d.name)[0];
			if (entry) {
				d.properties.name = entry.name;
				d.properties.acres = entry.acres;
				d.properties.canopy = entry.canopy > 0 ? entry.canopy : undefined;
			}
		})
		
		draw();
	});


function draw() {
	
	svg.selectAll("path")
		.data(map.features)
		.enter()
		.append("path")
		.style('stroke', 'white')
		.style('stroke-width', 0.5)
		.attr("d", geoPath)
		.attr("fill", (d,i) => canopyScale(i));
}


/*
