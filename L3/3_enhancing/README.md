# L3 - Working with Data

## This is the written guide for the second half - part two of L3. Please, refer to the slides for an in-depth theoretical explanation.

<!-- Backtick copypaste: `` -->

# 1. Labels

- In this last section we will add some adjustment to enhance the visualization, starting with some labels.
- Open the `line-chart.js`: as a first easy step, we can add a name to the yAxis to clarify the values we are reading.

```js
svg
  .append("text")
  .text("Temperature (°F)")
  .attr("y", 20)
  .attr("font-family", "sans-serif");
```

- Then, we can append a label for the `Average Temperature` of the last data point.

```js
innerChart
  .append("text")
  .text("Average temperature")
  .attr("x", xScale(lastDate) + 10)
  .attr("y", yScale(data[data.length - 1].avg_temp_F))
  .attr("fill", violet);
```

- We can select three different values for the position of the label: `dominant-baseline: auto/middle/hanging`. We are going to use `middle` for our visualization.

```js
innerChart
  .append("text")
  .text("Average temperature")
  .attr("x", xScale(lastDate) + 10)
  .attr("y", yScale(data[data.length - 1].avg_temp_F))
  .attr("dominant-baseline", "middle")
  .attr("fill", violet);
```

- Next, we add two more labels: one to show a maximum value for a specific day and one to point the minimum value for another day. We also add two lines to point these values.
- Starting from the minimum:

```js
innerChart
  .append("text")
  .text("Minimum temperature")
  .attr("x", xScale(data[data.length - 3].date) + 13)
  .attr("y", yScale(data[data.length - 3].min_temp_F) + 20)
  .attr("alignment-baseline", "hanging")
  .attr("fill", violet);
innerChart
  .append("line")
  .attr("x1", xScale(data[data.length - 3].date))
  .attr("y1", yScale(data[data.length - 3].min_temp_F) + 3)
  .attr("x2", xScale(data[data.length - 3].date) + 10)
  .attr("y2", yScale(data[data.length - 3].min_temp_F) + 20)
  .attr("stroke", violet)
  .attr("stroke-width", 2);
```

- Moving to the other one

```js
innerChart
  .append("text")
  .text("Maximum temperature")
  .attr("x", xScale(data[data.length - 4].date) + 13)
  .attr("y", yScale(data[data.length - 4].max_temp_F) - 20)
  .attr("fill", violet);
innerChart
  .append("line")
  .attr("x1", xScale(data[data.length - 4].date))
  .attr("y1", yScale(data[data.length - 4].max_temp_F) - 3)
  .attr("x2", xScale(data[data.length - 4].date) + 10)
  .attr("y2", yScale(data[data.length - 4].max_temp_F) - 20)
  .attr("stroke", violet)
  .attr("stroke-width", 2);
```

# 2. Tooltips

- Let's add some `Tooltips`: when we mouseover a datapoint we want to show the value of the temperature, when we mouseleave, this value must disappear.
- Tooltips are a very simple but effective tool to show more data about our visualization, without overcrodwing the chart.
- Open the `tooltip.js` file and start editing the method `createTooltip()`
- We first add two constants for the `height` and `width` of the tooltip in the `shared_variables.js` file.

```js
const tooltipWidth = 65;
const tooltipHeight = 32;
```

- Then, we append a tooltip to the innerChart. A tooltip is a `rect` element with the same color we always used. We can change and fix the value of the opacity to make it stand out.

```js
let purple = "#6465aa";

const tooltip = innerChart.append("g").attr("class", "tooltip");

tooltip
  .append("rect")
  .attr("width", tooltipWidth)
  .attr("height", tooltipHeight)
  .attr("rx", 3)
  .attr("ry", 3)
  .attr("fill", purple)
  .attr("fill-opacity", 0.75);
```

- We then append a plain formatted text inside the tooltip:

```js
tooltip
  .append("text")
  .text("00.0°F")
  .attr("x", tooltipWidth / 2)
  .attr("y", tooltipHeight / 2 + 1)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("fill", "white")
  .style("font-weight", 900);
```

- Now the tooltip is in the top-left corner. For the moment, we want to hide it. It must only appear during a mouseover event on a datapoint. So, we add the following code:

```diff
const tooltip = innerChart
  .append("g")
  .attr("class", "tooltip")
+ .style("opacity", 0);

```

- Now we write the code to handle the mouse events.
- In D3, we have two main events: the `on("mouseenter")` and the `on("mouseleave")`.
- Let's start from the mouse enter.
  - **Note**: if the mouse interaction is not working, one problem could be that the circles for the data points need to be drawn in front of everything else. In D3, the drawing is delivered with a LIFI (last in - first in) logic. So, just change the position of the `selectAll("circle")` in your code and put it last.
- Inside the second method `handleMouseEvents`, copy this snippet:

```js
innerChart.selectAll("circle").on("mouseenter", (e, d) => {
  console.log("DOM event", e);
  console.log("Attached datum", d);

  // Update the text in the tooltip
  d3.select(".tooltip text").text(`${d3.format(".3")(d.avg_temp_F)}°F`);

  // Position the tooltip above the hovered circle
  const cx = e.target.getAttribute("cx");
  const cy = e.target.getAttribute("cy");
  console.log(cx, cy);
  d3.select(".tooltip")
    .attr(
      "transform",
      `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.5 * tooltipHeight})`
    )
    .transition()
    .duration(200)
    .style("opacity", 1);
});
```

- Here, we retrieve some information about the datapoints with the `event.target.getAttribute()` method.
- The `.transition().duration(200)` is used to add a little animation to the tooltip.

- For the mouseLeave event, chain the following to the previous selction:

```js
.on("mouseleave", (e, d) => {
      // Hide the tooltip and move it away from the chart.
      d3.select(".tooltip")
        .style("opacity", 0)
        .attr("transform", `translate(0, 500)`);
    });
};
```

- We move the tooltip out of the way, otherwise it would obstruct other mouse events.

# 3. Centroids

- For the last feature, we are going to add a label with the `percentage` of days with precipitations to the centroid of the pie chart.
- To do so, open the file `arc.js`
- At the end of the code, we can simply calculate the position of the centroid with the `centroid()` method of the arc generator we previously wrote.

```js
const centroid = arcGenerator
  .startAngle(0)
  .endAngle(radiansDaysWithPrec)
  .centroid();
```

- Then we can simply append the text to the innerChart:

```js
innerChart
  .append("text")
  .text((d) =>
    d3.format(".0%")(Math.round((numDaysWithPrec / numDays) * 100) / 100)
  )
  .attr("x", centroid[0])
  .attr("y", centroid[1])
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "white")
  .style("font-weight", 500);
```
