d3.csv("./data/weekly_temperature.csv", d3.autoType).then((data) => {
  console.log(data);
  drawLineChart(data);
  createTooltip();
  handleMouseEvents();
});

d3.csv("./data/daily_precipitations.csv", d3.autoType).then((data) => {
  console.log("Precipitations Data:", data);
  drawArc(data);
});
