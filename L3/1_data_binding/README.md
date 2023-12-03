# L3 - Working with Data

## This is the written guide for the first half of L3. Please, refer to the slides for an in-depth theoretical explanation.

<!-- Backtick copypaste: `` -->

# 1. Loading the Dataset

- Our Dataset is a `.csv` file. So we go inside the `/data` folder and we use the `d3.csv()` fetch method to load our dataset. Open the `main.js` file and write the following:

```javascript
d3.csv("./data/data.csv");
```

- The **row conversion method** takes the dataset row by row. If we want to test this functionality in the console, just type:

```js
d3.csv("./data/data.csv", (d) => {
  console.log(d);
});
```

## 1.1 Formatting the Dataset

- We need now to convert the values from `count` from strings to numbers. To convert it, we use the `+` operator. We can directly do this (and test it), in the callback function of `d3.csv()`:

```js
d3.csv("./data/data.csv", (d) => {
  return { technology: d.technology, count: +d.count };
});
```

### 1.2.1 JS Promise

- `d3.csv()` gives us a Promise, the result of an **asynchronous** operation. A simple way to retrieve a Promise is by chaining the `then()` method.

```js
d3.csv("./data/data.csv", (d) => {
  return { technology: d.technology, count: +d.count };
}).then((data) => {
  console.log(data);
});
```

## 1.2 Measuring the Dataset

- Now, we can retrieve some informations from the Dataset. For example, if we want to know how many elements it contains, we can simply print the `data.length` to the console:

```js
d3.csv("./data/data.csv", (d) => {
  return { technology: d.technology, count: +d.count };
}).then((data) => {
  console.log(data.length);
});
```

- Probably, we are also interested in the `max` and `min` value in our dataset. In order to retrieve it, we can use one of these `d3` methods.
  - The `d3.extent()` method takes the dataset as a parameter and returns an array containing two elements, the min and the max.

```js
d3.csv("./data/data.csv", (d) => {
  return { technology: d.technology, count: +d.count };
}).then((data) => {
  console.log(data.length);

  d3.max(data, (d) => d.count); // => 1078
  d3.min(data, (d) => d.count); // => 20
  d3.extent(data, (d) => d.count); // => [20, 1078]
});
```

- Data visualization is presented in such a way that the data appear to be easily readable. To do so, we need to sort our dataset.
- Let's add this line of code inside our `then()` callback.

```js
data.sort((a, b) => b.count - a.count);
```

- In the end, we add a method which takes all the data and creates a visualization. We can easily call this method `createViz()`.

```js
d3
  .csv("./data/data.csv", (d) => {
    return { technology: d.technology, count: +d.count };
  })
  .then((data) => {
    console.log(data.length);

    d3.max(data, (d) => d.count); // => 1078
    d3.min(data, (d) => d.count); // => 20
    d3.extent(data, (d) => d.count); // => [20, 1078]

    data.sort((a, b) => b.count - a.count);

    createViz(data);
  });

  const createViz = data => {} #ToDo
```

# 2. Binding Data to DOM

- We can now start writing the method to build our visualization.
- To do so, we begin by binding the data to DOM elements. In this case we bind the data to rects inside the svg.
- To achieve this, we use the paradigm `select().data().join()`

```js
const createViz = (data) => {
  svg.selectAll("rect").data(data).join("rect");
};
```

- Now we can interact with the data in the svg. At first, we assign a class to every single rect:

```js
const createViz = (data) => {
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", (d) => {
      console.log(d);
      return `bar bar-${d.technology}`;
    });
};
```

- However, we are not able to see any bar yet. To do so, we need to assing the height and width values.
- For the height, we first create a variable `barHeight` that we can change whenever we want.
- For the width, we bind it to the value of `d.count`. So, the bigger the count, the longer will be the bar in the bar chart.

```js
const barHeight = 20;

const createViz = (data) => {
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", (d) => {
      console.log(d);
      return `bar bar-${d.technology}`;
    })
    .attr("height", barHeight)
    .attr("width", (d) => d.count);
};
```

- We can see only one big bar in the browser. This is because we also need to properly move the bars.
- The value of the x-coordinate is `0` for every bar.
- The value of the y-coordinate is computed with an incrementing index + a padding space set to `5`.

```js
const barHeight = 20;

const createViz = (data) => {
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", (d) => {
      console.log(d);
      return `bar bar-${d.technology}`;
    })
    .attr("height", barHeight)
    .attr("width", (d) => d.count)
    .attr("x", 0)
    .attr("y", (d, i) => (barHeight + 5) * i);
};
```

- As a last step, we can color the bars. We will highlight the bar for D3 with another color. To do so, we use a common structure called `ternary if`
  - `condition ? executedIfTrue : executedIfFalse`

```js
const barHeight = 20;

const createViz = (data) => {
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", (d) => {
      console.log(d);
      return `bar bar-${d.technology}`;
    })
    .attr("height", barHeight)
    .attr("width", (d) => d.count)
    .attr("x", 0)
    .attr("y", (d, i) => (barHeight + 5) * i)
    .attr("fill", (d) => (d.technology == "D3.js" ? "orange" : "teal"));
};
```

# 3. Adapting Data to the Screen

- As a first step, we change some of the parameter of our container.
- In the `main.css` file:

```diff
.responsive-svg-container {
  margin-right: auto;
  margin-left: auto;
  width: 100%;
- max-width: 1200px;
+ max-width: 600px;
}
```

- In the `main.js`:

```diff
const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
- .attr("viewBox", "0 0 1200 1600")
+ .attr("viewBox, "0 0 600 700")
  .style("border", "1px solid black");
```

- The rectangles are now too big to fit the `viewBox`. We need to scale it to fit the new view.

- We declare two scales: `xScale` to map the values in the x-axis, `yScale` to map the values in the y-axis.

- Starting from the `xScale`, we map continue values to continue values.
  - First we create the scale,
  - Then, we apply the scale to the `width` attribute of the rectangles

```js
const createViz = (data) => {
  const xScale = d3.scaleLinear().domain([0, 1078]).range([0, 450]);

  // Data binding step
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    ...
    .attr("width", (d) => xScale(d.count))
    ...
    .attr("x", 100) // we move the starting point
    ;
};
```

- The `yScale` maps qualitative values (names), to a position in the box. We use the `scaleBand()` to achieve this goal.
- We also change the height of the bars with the method `bandwidth()` of the band scale.

```js
const yScale = d3
  .scaleBand()
  .domain(data.map((d) => d.technology))
  .range([0, 700]);

svg
  .selectAll("rect")
  .data(data)
  .join("rect")
  ...
  .attr("y", (d) => yScale(d.technology))
  ...
  .attr("height", (d) => yScale.bandwidth())
  ...
```

- Then we can add a small padding to the bars:

```diff
const yScale = d3
  .scaleBand()
  .domain(data.map((d) => d.technology))
  .range([0, 700])
+ .paddingInner(0.2);
```

# 4. Adding Labels to the Chart

- In order to add the labels to our chart, we need to refactor our code a bit. We create a group for every data point with these scheme in mind: **d.technology - bar - d.count**

```js
const barAndLabel = svg
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("transform", (d) => `translate(0, ${yScale(d.technology)})`);

barAndLabel
  .append("rect")
  .attr("width", (d) => xScale(d.count))
  .attr("height", yScale.bandwidth())
  .attr("x", 100)
  .attr("y", 0)
  .attr("fill", (d) => (d.technology === "D3.js" ? "orange" : "teal"));
```

- So, this is a summary of this step (the rectangles look exactly as before):

```diff
+const barAndLabel = svg
+  .selectAll("g")
+  .data(data)
+  .join("g")
+  .attr("transform", (d) => `translate(0, ${yScale(d.technology)})`);

-svg
-   .selectAll("rect")
-   .data(data)
-   .join("rect").
-   .attr("width", (d) => xScale(d.count))
-   .attr("height", yScale.bandwidth())
-   .attr("x", 100)
-   .attr("y", (d) => yScale(d.technology))
-   .attr("fill", (d) => (d.technology === "D3.js" ? "orange" : "teal"));

+barAndLabel
+  .append("rect")
+  .attr("width", (d) => xScale(d.count))
+  .attr("height", yScale.bandwidth())
+  .attr("x", 100)
+  .attr("y", 0)
+  .attr("fill", (d) => (d.technology === "D3.js" ? "orange" : "teal"));

```

- Now we can add the labels. We start with the technology on the left side:

```js
barAndLabel
  .append("text")
  .text((d) => d.technology)
  .attr("x", 96)
  .attr("y", 12)
  .attr("text-anchor", "end")
  .style("font-family", "sans-serif")
  .style("font-size", "11px");
```

- Meanwhile, if we want to add the labels to the right part of the code we need to add:

```js
barAndLabel
  .append("text")
  .text((d) => d.count)
  .attr("x", (d) => 100 + xScale(d.count) + 4)
  .attr("y", 12)
  .style("font-family", "sans-serif")
  .style("font-size", "9px");
```

- And then, we also add a simple vertical black line to separate this labels from the starting point of the bar:

```js
svg
  .append("line")
  .attr("x1", 100)
  .attr("y1", 0)
  .attr("x2", 100)
  .attr("y2", 700)
  .attr("stroke", "black");
```
