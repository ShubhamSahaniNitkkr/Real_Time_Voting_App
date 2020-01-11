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

fetch("http://localhost:3000/poll")
  .then(res => res.json())
  .then(data => {
    console.log(data);
    const stacks = data.votes;
    const totalStack = stacks.length;
    const stackCount = stacks.reduce(
      (acc, stack) => (
        (acc[stack.stack] = (acc[stack.stack] || 0) + parseInt(stack.points)),
        acc
      ),
      {}
    );

    let dataPoints = [
      { label: "VueJs", y: stackCount.VueJs },
      { label: "AngularJs", y: stackCount.AngularJs },
      { label: "ReactJs", y: stackCount.ReactJs },
      { label: "NodeJs", y: stackCount.NodeJs }
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
  });
