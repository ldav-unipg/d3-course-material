// Load the data here
d3.csv("./data/daily_precipitations.csv", d3.autoType).then((data) => {
  console.log("Precipitations Data:", data);
  drawArc(data);
});

// Draw the arc here
const drawArc = (data) => {
  const pieChartWidth = 300;
  const pieChartHeight = 300;
  const svg = d3
    .select("#arc")
    .append("svg")
    .attr("viewBox", [0, 0, pieChartWidth, pieChartHeight]);

  const innerChart = svg
    .append("g")
    .attr(
      "transform",
      `translate(${pieChartWidth / 2}, ${pieChartHeight / 2})`
    );

  const numDays = data.length;
  const numDaysWithPrec = data.filter((d) => d.total_precip_in > 0).length;
  const degreeDaysWithPrec =
    (Math.round((numDaysWithPrec / numDays) * 100) * 360) / 100;
  const radiansDaysWithPrec = (degreeDaysWithPrec * Math.PI) / 180;

  const arcGenerator = d3
    .arc()
    .innerRadius(80)
    .outerRadius(120)
    .padAngle(0.03)
    .cornerRadius(5);

  innerChart
    .append("path")
    .attr("d", () => {
      return arcGenerator({
        startAngle: 0,
        endAngle: radiansDaysWithPrec,
      });
    })
    .attr("fill", "#6EB7C2");

  innerChart
    .append("path")
    .attr("d", () => {
      return arcGenerator({
        startAngle: radiansDaysWithPrec,
        endAngle: 2 * Math.PI,
      });
    })
    .attr("fill", "#DCE2E2");
};
