const express = require("express");
const router = express.Router();

const Pusher = require("pusher");

var pusher = new Pusher({
  appId: "930139",
  key: "1cfa2111b6bc9ec8679d",
  secret: "b4ed3c55f5bf6c7e8178",
  cluster: "ap2",
  encrypted: true
});

router.get("/", (req, res) => {
  res.send("POLL");
});

router.post("/", (req, res) => {
  pusher.trigger("stack-poll", "stack-vote", {
    points: 1,
    stack: req.body.stack
  });
  return res.json({
    success: true,
    message: "Thanks For Voting!"
  });
});
module.exports = router;
