# L1 - Manipulating the DOM

## This is the written guide for the second half of L1. Please, refer to the slides for an in-depth theoretical explanation.

- Open `index.html` and put the following lines of code at the end of the `<body>`. In the browser, the library and files are loaded in the order in which they are coded. So, if you invert the position of these two lines, nothing will work.

```html
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="js/main.js"></script>
```

- Now we test the import of the D3 library. Go to the `js` folder and open the `main.js` file. Write the following:

```js
d3.select("h1").style("color", "blue");
```

- If the previous instruction works, you can delete it from the code.

## 1. Selecting Elements

- As we learnt in the first half of the lesson, we need a responsive SVG container.
- To do so, note that in the html we have a `<div/>` with `class = responsive-svg-container`. Let's select it and append an `<svg/>` element inside.

```js
d3.select(".responsive-svg-container").append("svg");
```

- Now we set the `viewBox` attribute of this container to make it responsive.

```js
const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 1200 1600");
```

- We are start to building a **barchart**. Usually, the horizontal lines of the barchart are built with `rect` elements. So we now add a `rect` to our `<svg>`.

```js
const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 1200 1600");

svg.append("rect");
```

- However, even though the element is visible in the DOM, it is not visible in our browser. We need to set some of its attributes. Copy the following snippet.

```js
svg
  .append("rect")
  .attr("x", 10)
  .attr("y", 10)
  .attr("width", 414)
  .attr("height", 16)
  .attr("fill", "orange");
```

- Let's add a border to the `<svg/>` element. We can do it by setting its style.

```js
const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 1200 1600")
  .style("border", "2px solid black");
```

END Tutorial
