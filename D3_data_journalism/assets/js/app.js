// @TODO: YOUR CODE HERE!
//creating the svg container
var svgHeight=600;
var svgWidth=800;

//creating the margins
var margin={
    top: 50,
    right: 50,
    bottom: 125,
    left: 125
};

//calculating chart areas minue margins
var chartWidth=svgWidth-margin.left-margin.right;
var chartHeight=svgHeight-margin.top-margin.bottom;

//creating the SVG wrapper, append to SVG group that will hold the chart, and shift the latter by left and top margins
var svg=d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var chartGroup=svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


//import the csv data
d3.csv("assets/data/data.csv").then(function(health_data){
    console.log(health_data);

    //Parse Data as numbers
    health_data.forEach(function(data){
        data.healthcare=+data.healthcare;
        data.poverty=+data.poverty;
    });

    //Create scale functions
    var yLinearScale=d3.scaleLinear()
     .domain([d3.min(health_data, d=>d.healthcare)-2, d3.max(health_data, d=>d.healthcare)+2])
     .range([chartHeight,0]);

    var xLinearScale=d3.scaleLinear()
    .domain([d3.min(health_data, d=>d.poverty)-1, d3.max(health_data, d=>d.poverty)+1])
    .range([0, chartWidth]);

    //Create the axis functions
    var yAxis=d3.axisLeft(yLinearScale);
    var xAxis=d3.axisBottom(xLinearScale);

    //Append the axis to the chart
    chartGroup.append('g')
     .attr('transform', `translate(0, ${chartHeight})`)
     .call(xAxis);

    chartGroup.append('g')
     .call(yAxis);
    
    //Create the circles
    var circleGroups=chartGroup.selectAll('circle')
     .data(health_data)
     .enter()
     .append('circle')
     .attr('cy', d=>yLinearScale(d.healthcare))
     .attr('cx', d=>xLinearScale(d.poverty))
     .attr('r', "10")
     .attr('opacity', "0.75")
     .attr('class', 'stateCircle')
     .attr('stroke', 'black');

     //Initializing tooltip in the chart
     var toolTip=d3.tip()
     .attr('class', 'd3-tip')
     .offset([0,0])
     .html(function(d))
    
})