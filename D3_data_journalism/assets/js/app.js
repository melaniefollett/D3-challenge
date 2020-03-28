// @TODO: YOUR CODE HERE!

//Set up SVG

let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper
let svgContainer = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append SVG group and account for margins
let chartGroup = svgContainer.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("/assets/data/data.csv").then(function(healthRiskData) {
    
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthRiskData.forEach(data => {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
      });
    
    // Step 2: Create scale functions
    // ==============================
    let xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(healthRiskData, data => data.poverty)])
        .range([0, width]);
    let yLinearScale = d3.scaleLinear()
        .domain([15, d3.max(healthRiskData, data => data.obesity)])
        .range([height, 0]);
      
    // Step 3: Create axis functions
    // ==============================
    let xAxis = d3.axisBottom(xLinearScale);
    let yAxis = d3.axisLeft(yLinearScale);
      
    // Step 4: Append Axes to the chart
    // ==============================
      chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);
      chartGroup.append('g')
        .call(yAxis);

    // Step 5: Create Circles
    // ==============================
    let circlesGroup = chartGroup.selectAll("circle")
        .data(healthRiskData)
        .enter()
        .append('circle')
        .attr("class", "stateCircle")
        .attr('cx', data => xLinearScale(data.poverty))
        .attr('cy', data => yLinearScale(data.obesity))
        .attr('r', '8');

    // Step 6: Create text label for circles
    // ==============================
    let stateLabels = chartGroup.selectAll()
        .data(healthRiskData)
        .enter()
        .append("text")
        .text(data => data.abbr)
        .attr("class", "stateText")
        .attr("dx", data => xLinearScale(data.poverty))
        .attr("dy", data => yLinearScale(data.obesity))
        .style("font-size", 9)
        .style("text-anchor", "middle");
    
    // Step 7: Initialize tool tip
    // ==============================
    let toolTip = d3.tip()
        .attr('class', 'toolTip')
        .offset([80, -60])
        .html(function(data){
          return `${data.state}<br />Poverty: ${data.poverty}%<br />Obesity: ${data.obesity}%`;
        });
      
    // Step 8: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
      
    // Step 9: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on('mouseover', function(data){
        toolTip.show(data, this);
      })
        .on('mouseout', function(data){
          toolTip.hide(data);
        });
    
    
    // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obese (%)");
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    
}).catch(function(error) {
      console.log(error);
});