//labelling strategy pattern
var Labelling = function () {
  this.type = "";
};

Labelling.prototype = {
  setStrategy: function (type) {
    this.type = type;
  },

  rightClick: function (d) {
    return this.type.rightClick(d);
  },

  handleText: function (k) {
    if (net) return this.type.handleText(k);
    else return null;
  },
};

var NoLabels = function () {
  (this.rightClick = function (d) {
    if (d3.event) d3.event.preventDefault();
    var text = vis
      .select("g.nodes")
      .selectAll("text")
      .select(function (t) {
        return t.label == d.label ? this : null;
      });
    d.clicked = !d.clicked;
    text.style("font-size") == "0px"
      ? text
          .style(
            "font-size",
            k > 1 ? labelSize / Math.sqrt(k) + "px" : labelSize + "px"
          )
          .attr("opacity", 1)
      : text.style("font-size", 0);
  }),
    (this.handleText = function (k) {
      vis
        .select("g.nodes")
        .selectAll("text")
        .style("font-size", function (d) {
          if (d.clicked)
            return k > 1 ? labelSize / Math.sqrt(k) + "px" : labelSize + "px";
          else {
            return 0;
          }
        });
    });
};

var LabellingWithZooming = function () {
  (this.rightClick = function (d) {
    if (d3.event) d3.event.preventDefault();
    var text = vis
      .select("g.nodes")
      .selectAll("text")
      .select(function (t) {
        return t.label == d.label ? this : null;
      });
    d.clicked = !d.clicked;
    text.style("font-size") == "0px"
      ? text
          .style(
            "font-size",
            k > 1 ? labelSize / Math.sqrt(k) + "px" : labelSize + "px"
          )
          .attr("opacity", 1)
      : text.style("font-size", 0);
    if (text.style("font-size") == "0px") d.clicked = false;
    else d.clicked = true;
  }),
    (this.handleText = function (k) {
      var texts = vis.select("g.nodes").selectAll("text");
      vis
        .select("g.nodes")
        .selectAll("text")
        .style("font-size", function (d) {
          if (typeof d.clicked == "undefined") {
            if (k >= d.kThreshold)
              return k > 1 ? labelSize / Math.sqrt(k) + "px" : labelSize + "px";
            else return 0 + "px";
          } else {
            if (d.clicked)
              return k > 1 ? labelSize / Math.sqrt(k) + "px" : labelSize + "px";
            else return "0px";
          }
        })
        .attr("opacity", function (d) {
          if (typeof d.clicked == "undefined") {
            if (k >= d.kThreshold) return d.opacityScale(k);
            else return 0;
          } else {
            if (d.clicked) return 1;
          }
        });
    });
};

var AllLabelsShown = function () {
  (this.rightClick = function (d) {
    if (d3.event) d3.event.preventDefault();
    var text = vis
      .select("g.nodes")
      .selectAll("text")
      .select(function (t) {
        return t.label == d.label ? this : null;
      });
    d.clicked = !d.clicked;
    text.style("font-size") != "0px"
      ? text.style("font-size", 0)
      : text.style(
          "font-size",
          k > 1 ? labelSize / Math.sqrt(k) + "px" : labelSize + "px"
        );
  }),
    (this.handleText = function (k) {
      vis
        .select("g.nodes")
        .selectAll("text")
        .style("font-size", function (d) {
          if (d.clicked)
            return k > 1 ? labelSize / Math.sqrt(k) + "px" : labelSize + "px";
          else {
            return 0;
          }
        });
    });
};
