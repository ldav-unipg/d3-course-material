# L4 - Force Directed

## This is the written guide for the L4 lecture. Please, refer to the slides for an in-depth theoretical explanation. You can find the material of this guide in the **code** folder.

### This simulation was taken from [Steve Haroz](https://gist.github.com/steveharoz/8c3e2524079a8c440df60c1ab72b5d03).

- The following code mainly involves setting up the **force simulation**, defining forces like charge, centering, collision, and linking, initializing the display components (nodes and links), handling simulation ticks, drag events, and providing functionality for updating forces and display.

- It's a modular structure that sets up the foundation for a **force-directed** graph visualization using D3.js.

## Code Overview

### Loading Data

- `d3.json("./data/miserables.json").then((data) => { ... })`: Loads JSON data from the `miserables.json` file and initializes the visualization.

### SVG Initialization

- `var svg = d3.select("svg")`: Selects the SVG element in the HTML.
- `width` and `height` variables: Determine the dimensions of the SVG by getting its bounding rectangle width and height.

### Force Simulation Setup

- `var simulation = d3.forceSimulation()`: Creates a force simulation.
- `initializeSimulation()`: Sets up the force simulation and defines the event to update locations after each tick.

### Force Properties

- `forceProperties`: Contains various properties for different forces like centering, charge, collision, positioning, and linking.

### Forces Initialization

- `initializeForces()`: Initializes different forces (e.g., charge, center, collide) for the simulation.
- `updateForces()`: Updates force properties and applies them to respective forces in the simulation.

### Display Initialization

- `initializeDisplay()`: Generates SVG objects (links and nodes) and sets their initial properties.
- `updateDisplay()`: Updates the display based on force properties.

### Simulation and Display Updates

- `ticked()`: Updates display positions after each simulation tick.
- **Drag Functions** (`dragstarted, dragged, dragended`): Functions handling drag events for nodes.

### UI Events

- **resize event listener**: Updates dimensions on window resize.
- `updateAll()`: Convenience function to update both forces and display.

---

# 1. Loading Data

```js
d3.json("./data/miserables.json", function (error, _graph) {
  if (error) throw error;
  graph = _graph;
  initializeDisplay();
  initializeSimulation();
});
```

- `d3.json("./data/miserables.json").then((data) => { ... })`: This snippet uses D3's d3.json function to asynchronously load JSON data from the file "miserables.json". Once the data is loaded, it triggers a promise that executes the function inside the .then() block.
- `(data) => { ... }`: This arrow function handles the loaded data. It assigns the loaded data to the graph variable and then calls two functions: `initializeDisplay()` and `initializeSimulation()`.

# 2. SVG initialization

```js
var svg = d3.select("svg"),
  width = +svg.node().getBoundingClientRect().width,
  height = +svg.node().getBoundingClientRect().height;
```

- `var svg = d3.select("svg")`: Uses D3's select method to select the SVG element in the HTML document.
- `width` and `height` variables: These variables determine the dimensions of the SVG element. It extracts the width and height of the SVG element's bounding rectangle using [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).

# 3. Force Simulation Setup

```js
var simulation = d3.forceSimulation();
```

- `var simulation = d3.forceSimulation();`: Creates a force simulation object using d3.forceSimulation().

```js
function initializeSimulation() {
  simulation.nodes(graph.nodes);
  initializeForces();
  simulation.on("tick", ticked);
}
```

- `initializeSimulation()`: This function sets up the force simulation by assigning nodes to the simulation, initializing forces, and defining an event listener for the tick event, which triggers the `ticked()` function.

## Forces Initialization

```js
function initializeForces() {
  simulation
    .force("link", d3.forceLink())
    .force("charge", d3.forceManyBody())
    .force("collide", d3.forceCollide())
    .force("center", d3.forceCenter())
    .force("forceX", d3.forceX())
    .force("forceY", d3.forceY());
  updateForces();
}
```

- `initializeForces()`: This function initializes various forces using D3's force simulation. It adds forces like `link, charge, collide, center, forceX,` and `forceY` to the simulation.

## Force Properties

```js
forceProperties = {
  center: {
    x: 0.5,
    y: 0.5,
  },
  charge: {
    enabled: true,
    strength: -30,
    distanceMin: 1,
    distanceMax: 2000,
  },
  collide: {
    enabled: true,
    strength: 0.7,
    iterations: 1,
    radius: 5,
  },
  forceX: {
    enabled: false,
    strength: 0.1,
    x: 0.5,
  },
  forceY: {
    enabled: false,
    strength: 0.1,
    y: 0.5,
  },
  link: {
    enabled: true,
    distance: 30,
    iterations: 1,
  },
};
```

- `forceProperties``: Contains properties for different forces used in the simulation, such as centering, charge, collision, positioning, and linking

## Updating Forces

```js
function updateForces() {
  // get each force by name and update the properties
  simulation
    .force("center")
    .x(width * forceProperties.center.x)
    .y(height * forceProperties.center.y);
  simulation
    .force("charge")
    .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
    .distanceMin(forceProperties.charge.distanceMin)
    .distanceMax(forceProperties.charge.distanceMax);
  simulation
    .force("collide")
    .strength(
      forceProperties.collide.strength * forceProperties.collide.enabled
    )
    .radius(forceProperties.collide.radius)
    .iterations(forceProperties.collide.iterations);
  simulation
    .force("forceX")
    .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
    .x(width * forceProperties.forceX.x);
  simulation
    .force("forceY")
    .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
    .y(height * forceProperties.forceY.y);
  simulation
    .force("link")
    .id(function (d) {
      return d.id;
    })
    .distance(forceProperties.link.distance)
    .iterations(forceProperties.link.iterations)
    .links(forceProperties.link.enabled ? graph.links : []);

  // updates ignored until this is run
  // restarts the simulation (important if simulation has already slowed down)
  simulation.alpha(1).restart();
}
```

- `updateForces()`: This function updates the properties of each force in the simulation based on the `forceProperties` object. It sets properties like strength, distance, and enabled status for each force. Finally, it restarts the simulation by setting the alpha value to 1 and calling `.restart()`.

# 4. Display Initialization

- These elements ensure that the visualization remains responsive to window size changes and user interactions, updating both the forces (which govern the simulation behavior) and the displayed elements accordingly.
- The `ticked()` function specifically handles the positioning of nodes and links during each tick of the simulation.

```js
function initializeDisplay() {
  // set the data and properties of link lines
  link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line");

  // set the data and properties of node circles
  node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  // node tooltip
  node.append("title").text(function (d) {
    return d.id;
  });
  // visualize the graph
  updateDisplay();
}
```

- `initializeDisplay()`: This function initializes the display components of the force-directed graph visualization. It creates SVG elements for links (`line`) and nodes (`circle`). Each link and node is bound to the data (`graph.links` for links and `graph.nodes` for nodes). Additionally, it sets up drag behavior for nodes and adds tooltips to each node displaying their id.

```js
function updateDisplay() {
  // Updating attributes for nodes
  node
    .attr("r", forceProperties.collide.radius)
    .attr("stroke", forceProperties.charge.strength > 0 ? "blue" : "red")
    .attr(
      "stroke-width",
      forceProperties.charge.enabled == false
        ? 0
        : Math.abs(forceProperties.charge.strength) / 15
    );

  // Updating attributes for links
  link
    .attr("stroke-width", forceProperties.link.enabled ? 1 : 0.5)
    .attr("opacity", forceProperties.link.enabled ? 1 : 0);
}
```

- `updateDisplay()`: This function updates the display attributes for nodes and links based on the properties defined in `forceProperties`. It adjusts the radius, stroke color, and width for nodes based on collision forces and charge properties. It also updates the stroke width and opacity for links based on the link force's enabled status.

## ticked() Function

```js
function ticked() {
  link
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });

  node
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });

  d3.select("#alpha_value").style("flex-basis", simulation.alpha() * 100 + "%");
}
```

- `ticked()` Function Purpose: This function updates the positions of nodes and links on the display after each simulation tick.
- `Link Position Update`: For each link (`<line>`), it updates the `x1, y1` (starting point) and `x2, y2` (ending point) attributes based on the current positions of the source and target nodes of each link.
- `Node Position Update`: For each node (`<circle>`), it updates the `cx` (x-coordinate) and `cy` (y-coordinate) attributes based on the current node positions.
- `d3.select("#alpha_value")...`: This line updates a UI element with the ID `alpha_value` (could be a progress bar or similar) to visually represent the alpha value of the force simulation.
- The `flex-basis` CSS property is updated to reflect the alpha value as a percentage of the width.

## UI Events

```js
// Update size-related forces on window resize
d3.select(window).on("resize", function () {
  width = +svg.node().getBoundingClientRect().width;
  height = +svg.node().getBoundingClientRect().height;
  updateForces();
});

// Update everything (forces and display) after UI input
function updateAll() {
  updateForces();
  updateDisplay();
}
```

- `Window Resize Event`: The code attaches an event listener to the `resize` event on the window. When the window is resized, it updates the `height` and `height` variables with the new dimensions of the SVG element and triggers an update of forces (`updateForces()`).
- `updateAll()` Function: This function is called to update both forces and the display based on user input or any other triggering event. It sequentially calls `updateForces()` to update the forces and `updateDisplay()` to update the display components according to the updated force properties.

---

# HTML

- The following `HTML pattern` is used to create a labeled slider input that allows users to interactively adjust a value, affecting the `forceProperties` and triggering an update of the visualization.
- We take, as a reference, the label for the `XSliderOutput`.
- It creates a slider input with a label and an output element displaying the slider's current value. The slider allows users to modify the `forceProperties.center.x` value, triggering updates to the force simulation and the visualization when the slider value changes.
- The `oninput` attribute contains inline JavaScript to handle the slider's value change event and update the necessary components accordingly.

```html
<label>
  x
  <output id="center_XSliderOutput">.5</output>
  <input
    type="range"
    min="0"
    max="1"
    value=".5"
    step="0.01"
    oninput="d3.select('#center_XSliderOutput').text(value); forceProperties.center.x=value; updateAll();"
  />
</label>
```
- `<label>` Element: Represents a label associated with a form control (in this case, the slider input).
- `Text Content (x)`: Displays the text `x` next to the slider.
- `<output>` Element: Displays the current value of the slider. The id attribute (`center_XSliderOutput`) is used to target this output element.
- `<input>` Element (Slider): Represents the slider input.
    - `type="range"`: Indicates it's a range input (slider).
    - `min="0"` and `max="1"`: Specifies the minimum and maximum values of the slider.
    - `value=".5"`: Sets the initial value of the slider to 0.5.
    - `step="0.01"`: Defines the incremental step when adjusting the slider.
    - `oninput="..."`: Inline JavaScript that executes when the slider value changes (oninput event).
    - `d3.select('#center_XSliderOutput').text(value)`: Uses D3.js to select the output element with the ID `center_XSliderOutput` and updates its text content to reflect the current value of the slider.
    - `forceProperties.center.x=value;`: Updates the forceProperties object. Specifically, it modifies the center.x property of the force to the current slider value.
    - `updateAll()`: Calls the `updateAll()` function, which updates both forces and the display based on the new `forceProperties` values.