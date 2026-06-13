$('[data-toggle="tooltip"]').tooltip();

const API_BASE = window.location.origin;

function renderChart(dataPoints) {
  const chartDiv = document.querySelector("#chart-container");
  if (!chartDiv) return null;

  const chart = new CanvasJS.Chart("chart-container", {
    theme: "light1",
    animationEnabled: true,
    title: { text: "Stack Result" },
    data: [{ type: "column", dataPoints }]
  });
  chart.render();
  return { chart, dataPoints };
}

function updateChart(chartState, data) {
  chartState.dataPoints = chartState.dataPoints.map(x => {
    if (x.label === data.stack) {
      x.y += data.points;
    }
    return x;
  });
  chartState.chart.render();
}

function buildDataPoints(votes) {
  const stackCount = votes.reduce(
    (acc, stack) => (
      (acc[stack.stack] = (acc[stack.stack] || 0) + parseInt(stack.points, 10)),
      acc
    ),
    {}
  );

  return [
    { label: "VueJs", y: stackCount.VueJs || 0 },
    { label: "AngularJs", y: stackCount.AngularJs || 0 },
    { label: "ReactJs", y: stackCount.ReactJs || 0 },
    { label: "NodeJs", y: stackCount.NodeJs || 0 }
  ];
}

$(".vote-input-group .vote").click(function() {
  $(this).parent().find(".vote").removeClass("selected");
  $(this).addClass("selected");
  const val = $(this).attr("data-value");
  fetch(`${API_BASE}/poll`, {
    method: "post",
    body: JSON.stringify({ stack: val }),
    headers: new Headers({ "Content-Type": "application/json" })
  })
    .then(res => res.json())
    .catch(err => console.log(err));
});

fetch(`${API_BASE}/poll/status`)
  .then(res => res.json())
  .then(status => {
    return fetch(`${API_BASE}/poll`).then(res => res.json()).then(data => ({ status, data }));
  })
  .then(({ status, data }) => {
    const chartState = renderChart(buildDataPoints(data.votes));
    if (!chartState) return;

    if (status.demoMode) {
      const socket = io(API_BASE);
      socket.on("stack-vote", voteData => updateChart(chartState, voteData));
      return;
    }

    if (typeof Pusher !== "undefined" && status.pusherEnabled) {
      const pusher = new Pusher(window.PUSHER_KEY || "", {
        cluster: window.PUSHER_CLUSTER || "ap2",
        forceTLS: true
      });
      const channel = pusher.subscribe("stack-poll");
      channel.bind("stack-vote", voteData => updateChart(chartState, voteData));
    }
  })
  .catch(err => console.log(err));
