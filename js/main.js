/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

let data, flag= true;
let margin = {top: 20, right: 40, bottom: 150, left: 100},
    width = 960 - margin.left - margin.right,
    height =  500 - margin.top -margin.bottom;

let transitionTime = d3.transition().duration(750)

// create x axis labels
let x = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

// create y axis labels
let y = d3.scaleLinear()
    .range([height, 0])

let svg = d3.select("#chart-area")
    .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

let xAxisGroup = svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0, " + height + ")")


let yAxisGroup = svg.append("g")
.attr("class", "y-axis")

d3.json("data/revenues.json")
.then(result => {
    result.forEach(element => {
        element.revenue = +element.revenue;
        element.profit = +element.profit
    });

    data = result;
    d3.interval(() =>{
        update(data)
        flag = !flag
    }, 1000);

    update(data);
}).catch(err => console.log(err));


// Add labels to each axis
svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + 140)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month")

let yLabel = svg.append("text")
    .attr("class", "y-axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue")

function update(data)
{
    let value = flag ? 'revenue' : 'profit'
    x.domain(data.map(d=>d.month))
    y.domain([0, d3.max(data, d=> d[value])]);

    let xAxisCall = d3.axisBottom(x);

    let yAxisCall = d3.axisLeft(y)
    .ticks(10)
    .tickFormat(d => "$"+d)

    xAxisGroup.transition(transitionTime).call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-15")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    yAxisGroup.transition(transitionTime).call(yAxisCall)

    // JOIN new data with old elements
    let bars = svg.selectAll('rect')
        .data(data);

    // EXIT old elements not present in new data
    bars.exit()
        .attr("fill", "red") // change colour of exiting bars to red
        .transition(transitionTime)
            .attr("y", y(0))
            .attr("height", 0)
            .remove();

    // UPDATE old elements present in new data
    bars.transition(transitionTime)
        .attr("x", d => x(d.month))
            .attr("y", d => y(d[value]))
            .attr("width", x.bandwidth)
            .attr("height", d => height - y(d[value]));

    //ENTER new elements present in new data
    // append data to chart
    bars.enter()
        .append("rect")
            .attr("x", d => x(d.month))
            .attr("width", x.bandwidth)
            .attr("y", y(0))
            .attr("height", 0)
            .merge(bars)
            .transition(transitionTime)
                .attr("x", d => x(d.month))
                .attr("width", x.bandwidth)
                .attr("fill", d=>d[value] > 25000 ? "red" : "gray")
                .attr("height", d => height - y(d[value]))
                .attr("y", d => y(d[value]))

    let label = flag ? "Revenue": "Profit";
    yLabel.transition(transitionTime).text(label);
}

