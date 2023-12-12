//EVENT LISTENERS

function mousedown() {
  if (simulation) simulation.stop();
}

function mouseEnterNode(d) {
  var text = d.cluster
    ? clusterLabel(d)
    : getLabel(d) + " \n " + d.affiliation + " ";

  d3.selectAll("circle.node")
    .select(function (data) {
      return data == d ? this : null;
    })
    .attr("stroke-width", "3")
    .attr("stroke-color", "darkorange")
    .attr("stroke", "darkorange");

  d3.selectAll("line.link")
    .select(function (l) {
      return l.source == d || l.target == d ? this : null;
    })
    .attr("stroke-color", "darkorange")
    .attr("stroke", "darkorange");

  tooltip.transition().duration(200).style("opacity", 0.9);
  tooltip
    .html(text)
    .style("left", d3.event.pageX + "px")
    .style("top", d3.event.pageY - 28 + "px");
}

function mouseLeaveNode(d) {
  d3.selectAll("circle.node")
    .select(function (data) {
      return data == d ? this : null;
    })
    .attr("stroke-width", "3")
    .attr("stroke-color", "grey")
    .attr("stroke", "grey");

  d3.selectAll("line.link")
    .select(function (l) {
      return l.source == d || l.target == d ? this : null;
    })
    .attr("stroke-color", "grey")
    .attr("stroke", "grey");

  tooltip.transition().duration(200).style("opacity", 0);
}

function mouseEnterEdge(d) {
  //highlight edge
  d3.select(this)
    .attr("stroke-color", "darkorange")
    .attr("stroke", "darkorange");
  //highlight source and target node if any
  d3.selectAll("circle.node")
    .select(function (data) {
      return data == d.source || data == d.target ? this : null;
    })
    .attr("stroke-width", "3")
    .attr("stroke-color", "darkorange")
    .attr("stroke", "darkorange");

  tooltip.transition().duration(200).style("opacity", 0.9);

  edgeData = d3.select(this).datum();

  tooltip
    .html(edgeData.label)
    .style("left", d3.event.pageX + "px")
    .style("top", d3.event.pageY - 28 + "px");
}

function mouseLeaveEdge(d) {
  d3.select(this).attr("stroke-color", "grey").attr("stroke", "grey");

  d3.selectAll("circle.node")
    .select(function (data) {
      return data == d.source || data == d.target ? this : null;
    })
    .attr("stroke-width", "3")
    .attr("stroke-color", "grey")
    .attr("stroke", "grey");

  tooltip.transition().duration(200).style("opacity", 0);
}

function updateNodes() {
  node = nodeg.selectAll("circle.node").data(net.nodes, nodeid);

  node
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });

  node.exit().remove();
  node
    .enter()
    .append("circle")
    .attr("class", function (d) {
      return "node" + (d.size ? " cluster" : " leaf");
    })
    .attr("r", function (d) {
      return d.size ? d.size + dr : dr + 1;
    })
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("stroke-width", 3)
    .attr("stroke-color", "grey")
    .attr("stroke", "grey")
    .attr("stroke-opacity", 0.6)
    .moveToBack()
    .merge(node);

  nodeg
    .selectAll("circle.node.leaf")
    .attr("fill", function (d) {
      return colorMapping.get(d.affiliation);
    })
    .on("mouseenter", mouseEnterNode)
    .on("mouseleave", mouseLeaveNode)
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  text = nodeg.selectAll("text").data(net.nodes, nodeid);
  text.exit().remove();
  text.attr("transform", function (d) {
    return "translate(" + d.x + "," + d.y + ")";
  });

  text
    .enter()
    .append("text")
    .each(function (d) {
      // compute the scale threshold for this element. i.e. how big does the scale need to be before I should display
      d.kThreshold = kMap(degSortedList.indexOf(d.degree));
      d.opacityScale = d3
        .scaleLinear()
        .domain([d.kThreshold, d.kThreshold + 1])
        .range([0, 1]);
    })
    .attr("dy", ".35em")
    .attr("dx", ".90em")
    .text(function (d) {
      return getLabel(d);
    })
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("font-family", "sans-serif");

  labelling.handleText(k);
}

function updateEdges() {
  var edges = net.edges.filter((e) => !e.splineData);

  link = linkg
    .selectAll("line.link")
    .data(edges)
    .attr("stroke-width", function (d) {
      return 2 * linkUpperBound(d.size);
    })
    .attr("stroke", "grey")
    .attr("stroke-color", "grey")
    .attr("stroke-opacity", 0.6);

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
    })
    .attr("stroke-opacity", 0.6);

  link.exit().remove();
  link
    .enter()
    .append("line")
    .attr("class", "link")
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
    })
    .attr("stroke-width", function (d) {
      return 2 * linkUpperBound(d.size);
    })
    .attr("stroke", "grey")
    .attr("stroke-color", "grey")
    .attr("stroke-opacity", 0.6)
    .on("mouseenter", mouseEnterEdge)
    .on("mouseleave", mouseLeaveEdge)
    .merge(link);

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
    })
    .attr("stroke-width", function (d) {
      return 2 * linkUpperBound(d.size);
    })
    .attr("stroke", "grey")
    .attr("stroke-color", "grey")
    .attr("stroke-opacity", 0.6)
    .on("mouseenter", mouseEnterEdge)
    .on("mouseleave", mouseLeaveEdge);
}

//Zoom listener function
function zoom_actions() {
  if (currentZoomValue > 15) {
    zoomOut();
  }
  if (currentZoomValue < -15) {
    zoomIn();
  }

  vis.select("g.edges").attr("transform", d3.event.transform);
  vis.select("g.nodes").attr("transform", d3.event.transform);

  k = d3.event.transform.k;

  labelling.handleText(k);

  deltaX = d3.event.transform.x;
  deltaY = d3.event.transform.y;
}

//Drag listener functions
function dragstarted(d) {
  if (!d3.event.active) {
    d.x = d.x;
    d.y = d.y;
  } else {
    d.fx = d.x;
    d.fy = d.y;
  }
  ticked();
}

function dragged(d) {
  d.x = d3.event.x;
  d.y = d3.event.y;
  if (!d3.event.active) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  updateNodes();
  updateEdges();
}

function dragended(d) {
  if (d3.event.active) {
    d.fx = null;
    d.fy = null;
  }
  updateNodes();
  updateEdges();
}
