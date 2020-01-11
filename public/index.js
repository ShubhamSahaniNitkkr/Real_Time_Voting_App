$(".vote-input-group .vote").click(function() {
  $(this)
    .parent()
    .find(".vote")
    .removeClass("selected");
  $(this).addClass("selected");
  var val = $(this).attr("data-value");
  //   $(this)
  //     .parent()
  //     .find("input")
  //     .val(val);
  const data = { stack: val };
  fetch("http://localhost:3000/poll", {
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
});
