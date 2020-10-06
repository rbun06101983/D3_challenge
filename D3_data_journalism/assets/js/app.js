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
     .html(function(d){
        return (`<strong>${d.state}</br></br>Lacks Healthcare (%):</br>${d.healthcare}</br>Poverty (%):</br>${d.poverty}<strong>`);
     });

     //create tooltip in chart
    svg.call(toolTip);
     
    //create event listeners to display and hide the tooltip
    circleGroups.on("click", function(data){
        toolTip.show(data, this);
    });
    //onmouseover event
    circleGroups.on("mouseover", function(data){
         toolTip.show(data, this);
    });
    //onmouseout event
    circleGroups.on("mouseout", function(data){
         toolTip.hide(data, this);
    });

    //Create axes label
    chartGroup.append('text')
     .attr('transform', "rotate(-90)")
     .attr('y', 0-margin.left+40)
     .attr('x', 0-(chartHeight/2))
     .attr('dy', "1em")
     .attr('class', 'axisText')
     .text("Lacks Healthcare (%")

    chartGroup.append('text')
     .attr('transform', `translate(${chartWidth/2}, ${chartHeight+margin.top+30})`)
     .attr('class','axisText')
     .text('Poverty (%')

    //State Abbreviations in circles
    chartGroup.append('text')
     .attr('class', 'stateText')
     .style('font-size', '10px')
     .style('font-weight', 'bold')
     .selectAll('tspan')
     .data(health_data)
     .enter()
     .append('tspan')
     .attr('x', function(data){
        return xLinearScale(data.poverty);
     })
     .attr('y', function(data){
        return yLinearScale(data.healthcare -0.2);
     })
     .text(function(data){
        return data.abbr
    });

}).catch(function(error){
   console.log(error);

});