$(".vote-input-group .vote").click(function() {
  $(this)
    .parent()
    .find(".vote")
    .removeClass("selected");
  $(this).addClass("selected");
  var val = $(this).attr("data-value");
  const data = { stack: val };
  fetch("http://localhost:3000/poll", {
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  })
    .then(res => res.json())
    .catch(err => console.log(err));
});

let dataPoints = [
  { label: "VueJs", y: 0 },
  { label: "AngularJs", y: 0 },
  { label: "ReactJs", y: 0 },
  { label: "NodeJs", y: 0 }
];

const chartDiv = document.querySelector("#chart-container");
if (chartDiv) {
  var chart = new CanvasJS.Chart("chart-container", {
    theme: "light1", // "light2", "dark1", "dark2"
    animationEnabled: true,
    title: {
      text: "Stack Result"
    },
    data: [
      {
        type: "column",
        dataPoints: dataPoints
      }
    ]
  });
  chart.render();

  // Enable pusher logging - don't include this in production
  Pusher.logToConsole = false;

  var pusher = new Pusher("1cfa2111b6bc9ec8679d", {
    cluster: "ap2",
    forceTLS: true
  });

  var channel = pusher.subscribe("stack-poll");
  channel.bind("stack-vote", function(data) {
    dataPoints = dataPoints.map(x => {
      if (x.label === data.stack) {
        x.y += data.points;
        return x;
      } else {
        return x;
      }
    });
    chart.render();
  });
}
