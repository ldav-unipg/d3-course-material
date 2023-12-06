# L3 - Working with Data

## This is the written guide for the second half - part one of L3. Please, refer to the slides for an in-depth theoretical explanation.

<!-- Backtick copypaste: `` -->

# 1. Margin Convention and Axes

- This first section aims to introduce the concept of **margin convention** and to present a series of instructions to easily create axes in visualizations.
- We'll start working in the `line-chart.js` file. As a first line, we load the dataset with `d3.csv()`:

```js
d3.csv("./data/weekly_temperature.csv");
```

- Instead of doing a manual formatting, we will automatically format the types in our dataset with the method `d3.autoType`

```js
d3.csv("./data/weekly_temperature.csv", d3.autoType);
```

- We log the dataset in the console and we pass the data to the `drawLineChart(data)` method that we are going to implement.

```js
d3.csv("./data/weekly_temperature.csv", d3.autoType).then((data) => {
  console.log(data);
  drawLineChart(data);
});

const drawLineChart = (data) => {};
```

## 1.1 Margin Convention

- Let's create the margin object for our line chart. Inside the `drawLineChart` method, we initialize a constant named `margin`.

```js
const drawLineChart = (data) => {
  const margin = { top: 40, right: 170, bottom: 25, left: 40 };
};
```

- In your project, if you want to set the margins, you will probably do a lot of trial and error. This is an educated guess.
- We create now the `innerChart` by defining its dimensions. We first set the `width` and `height` of the svg container. Then, the `innerWidth` and `innerHeight` are propotional to the margins and the svg dimensions.

```js
const width = 1000;
const height = 500;
const innerWidth = width - (margin.left + margin.right);
const innerHeight = height - (margin.top + margin.bottom);
```

- We now append the svg container of our line chart. We set the `viewBox` attribute of the container to make it responsive.

```js
const svg = d3
  .select("#line-chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`);
```

- We create an svg group to move every element in one go. We save this group into a variable called `innerChart`

```js
const innerChart = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
```

## 1.2 Creating Axes

- In D3 we create axes with the `axes()` component generator.
- This method takes a scale as input and returns the SVG elements that compose the axis as an output.

- Let's define the scale for the values on the xAxis. We are going to use the `scaleTime()` scale of D3. It takes a continous input and return a continous output but the data it manipulates are time-related data.

```js
const firstDate = d3.min(data, (d) => d.date);
const lastDate = d3.max(data, (d) => d.date);
const xScale = d3
  .scaleTime()
  .domain([firstDate, lastDate])
  .range([0, innerWidth]);
```

- For the yAxsis scale we also need a continuous to continuous scale. We use the `scaleLinear()`. To compute the domain, we do some preproccessing by computing the max value from the `max_temp_F` variable.

```js
const maxTemp = d3.max(data, (d) => d.max_temp_F);
const yScale = d3.scaleLinear().domain([0, maxTemp]).range([innerHeight, 0]);
```

- The generator for the bottom axis is `d3.axisBottom(xScale)`. We then use the method `call()` to make these elements appear on the screen.
- By default, the axis is displayed at the origin of the selection. To move it in the lower part we translate the whole group.

```js
const bottomAxis = d3.axisBottom(xScale);
innerChart
  .append("g")
  .attr("class", "axis-x")
  .attr("transform", `translate(0, ${innerHeight})`)
  .call(bottomAxis);
```

- Now we need to format the labels of our axis because they are not so great.
- We start by creating the first date to be displayed by using the JS `Date()` constructor. We initialize it to the 1st of January 2021 (Note: the months are zero-indexed).
- We then replace the value from the domain with this new `firstDate`

```js
const firstDate = new Date(2021, 00, 01, 0, 0, 0);
```

```diff
+const firstDate = new Date(2021, 00, 01, 0, 0, 0);
-const firstDate = d3.min(data, (d) => d.date);
const lastDate = d3.max(data, (d) => d.date);
const xScale = d3
  .scaleTime()
  .domain([firstDate, lastDate])
  .range([0, innerWidth]);
```

- We want now to display an abbreviation for the name of the months. We can change the format of the axis labels with the method `axis.tickFormat()`.
- In D3, we can format time-related values with the method `d3.timeFormat()`. The `%b` modifier outputs the abbreviation for the month.
- We chain this method to the previous declaration of the `axisBottom()`.

```diff
const bottomAxis = d3.axisBottom(xScale)
+  .tickFormat(d3.timeFormat("%b"));
```

- Now the labels are correctly formatted buy their poisition is incorrect. We want to move them in the middle of two ticks.
- We first select the `.axis-x text` (the labels) and we set a common displacemnt on the `y` direction, a font and a font size.

```js
d3.selectAll(".axis-x text")
  .attr("y", "10px")
  .style("font-family", "Roboto, sans-serif")
  .style("font-size", "14px");
```

- To compute the position of the labels we compute the value of the `x` attribute of the previous selection.
  - We use the JS `getMonth()` method to find the middle point between the current and the next month.

```js
d3.selectAll(".axis-x text")
  .attr("x", (d) => {
    const currentMonth = d;
    const nextMonth = new Date(2021, currentMonth.getMonth() + 1, 1);
    return (xScale(nextMonth) - xScale(currentMonth)) / 2;
  })
  .attr("y", "10px")
  .style("font-family", "Roboto, sans-serif")
  .style("font-size", "14px");
```

- For the `yAxis` everything is simpler. We use the `d3.axisLeft()` to show the axis on the left side of our visualization.

```js
const leftAxis = d3.axisLeft(yScale);
innerChart.append("g").attr("class", "axis-y").call(leftAxis);
```

- Then we set the labels by selecting the group and editing the attributes as before. In order to not repeat the code, we can add the selection to the previous one.

```js
d3.selectAll(".axis-x text, .axis-y text")
  .style("font-family", "Roboto, sans-serif")
  .style("font-size", "14px");

d3.selectAll(".axis-y text").attr("x", "-10px");

d3.selectAll(".axis-x text")
  .attr("x", (d) => {
    const currentMonth = d;
    const nextMonth = new Date(2021, currentMonth.getMonth() + 1, 1);
    return (xScale(nextMonth) - xScale(currentMonth)) / 2;
  })
  .attr("y", "10px");
```

# 2 Drawing a Line Chart

- To create our line chart, we first pass through a middle step.
- The strategy is the following: we draw a scatter plot with our data points. Then we interpolate these points with a line generator function from d3 modules which simplifies the writing of an svg path.

# 2.1 Scatter Plot

- As a first step, we draw the scatter plot using the data binding pattern.

```js
const violet = "#8080ff";
innerChart
  .selectAll("circle")
  .data(data)
  .join("circle")
  .attr("r", 4)
  .attr("cx", (d) => xScale(d.date))
  .attr("cy", (d) => yScale(d.avg_temp_F))
  .attr("fill", violet);
```

- Now that we have the points, we can use a `line generator` to draw the lineChart.
- We can create our own line generator with the `d3.line()` method. Then we add the `x` and `y` position by passing our data points.

```js
const lineGenerator = d3
  .line()
  .x((d) => xScale(d.date))
  .y((d) => yScale(d.avg_temp_F));
```

- Then, we appaend a path to the `innerChart` and we set its `d` attribute by calling the line generator and passing the dataset as an argument.

```js
innerChart
  .append("path")
  .attr("d", lineGenerator(data))
  .attr("fill", "none")
  .attr("stroke", violet);
```

- We can obtain a more pleasing visualization if, instead of a simple line, we choose to use a `curve generator`.

```js
const curveGenerator = d3
  .line()
  .x((d) => xScale(d.date))
  .y((d) => yScale(d.avg_temp_F))
  .curve(d3.curveCatmullRom);

innerChart
  .append("path")
  .attr("d", lineGenerator(data))
  .attr("fill", "none")
  .attr("stroke", violet);
```

## 2.1 Area Generator

- To draw an area in D3 is very similar to the process of drawing a line or a curve.
- We use the `d3.area()` method.

```js
const areaGenerator = d3
  .area()
  .x((d) => xScale(d.date))
  .y0((d) => yScale(d.min_temp_F))
  .y1((d) => yScale(d.max_temp_F))
  .curve(d3.curveCatmullRom);
```

- To show the area on the chart, we append a path by passing as the parameter of the `d` attribute, the `areaGenerator(data)`.
- We set the opacity to a low value, to not obscure the line chart.

```js
innerChart
  .append("path")
  .attr("d", areaGenerator(data))
  .attr("fill", violet)
  .attr("fill-opacity", 0.2);
```

# 3. Drawing Arcs

- In this section we will learn how to draw a pie chart in D3. We will use a dataset on `daily precipitations` in New York.
- Let's start by open the `arc.js` file.
- We load this new dataset using the `d3.csv()` fetch function, as usual.
- Then, we pass the dataset to a method that will manage the visualization. We call this method `drawArc()`

```js
d3.csv("./data/daily_precipitations.csv", d3.autoType).then((data) => {
  console.log("Precipitations Data:", data);
  drawArc(data);
});

const drawArc = (data) => {};
```

- First, we setup the chart container as previously explained:
  - We set the `width` and the `height` values for this new container.
  - We create a responsive container, as usual, using `viewBox`
  - We append a new svg container in the container with id `#arc` (already present in our html file)

```js
const pieChartWidth = 300;
const pieChartHeight = 300;
const svg = d3
  .select("#arc")
  .append("svg")
  .attr("viewBox", [0, 0, pieChartWidth, pieChartHeight]);
```

- To facilitate the creation of the arcs, we wrap them inside an svg group and we translate this group to the middle of the svg container.
- We do this because we are going to use a polar coordinate system. In this way, the position of the arcs will be set, by default, to the center of the chart.

```js
const innerChart = svg
  .append("g")
  .attr("transform", `translate(${pieChartWidth / 2}, ${pieChartHeight / 2})`);
```

- Before appending our pie chart, we compute the angle for the days with precipitation.
- We filter the days in our year with a precipitation value greater than zero by using the `filter()` method of JS.
- Then we can easily compute the percentage of the days with precipitations.
- We then compute the corresponding angle by multiplying this value to `360` (degrees in a full circle).
- However, we need the value in radians. So we mutiply this degree value by `PI` and we divide everything for `180`.

```js
const numDays = data.length;
const numDaysWithPrec = data.filter((d) => d.total_precip_in > 0).length;
const degreeDaysWithPrec =
  (Math.round((numDaysWithPrec / numDays) * 100) * 360) / 100;
const radiansDaysWithPrec = (degreeDaysWithPrec * Math.PI) / 180;
```

# 3.1 Arc Generator

- We can now use the `arc generator` as we did for the line and area generator. We use the `d3.arc()` generator.
- We need to set the `innerRadius` and `outerRadius`.
- We can also set the `padAngle` and the `cornerRadius` to have as smoother looking chart.

```js
const arcGenerator = d3
  .arc()
  .innerRadius(80)
  .outerRadius(120)
  .padAngle(0.03)
  .cornerRadius(5);
```

- Then, we append a path element to our `innerChart` and we set its `d` attribute by passing the `arcGenerator`.
- The `startAngle` is `0` and the `endAngle` is the value in radians that we previously stored in `radiansDaysWithPrec`.
- At last, we can color this part of the chart with our selected color.

```js
innerChart
  .append("path")
  .attr("d", () => {
    return arcGenerator({
      startAngle: 0,
      endAngle: angleDaysWithPrecipitations_rad,
    });
  })
  .attr("fill", "#6EB7C2");
```

- Then we can generating the remaining part of the chart.

```js
innerChart
  .append("path")
  .attr("d", () => {
    return arcGenerator({
      startAngle: angleDaysWithPrecipitations_rad,
      endAngle: 2 * Math.PI,
    });
  })
  .attr("fill", "#DCE2E2");
```
