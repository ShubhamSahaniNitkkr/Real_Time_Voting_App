const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Vote = require("../models/vote");

const Pusher = require("pusher");

var pusher = new Pusher({
  appId: "930139",
  key: "1cfa2111b6bc9ec8679d",
  secret: "b4ed3c55f5bf6c7e8178",
  cluster: "ap2",
  encrypted: true
});

router.get("/", (req, res) => {
  Vote.find().then(votes => res.json({ success: true, votes: votes }));
});

router.post("/", (req, res) => {
  const newVote = {
    stack: req.body.stack,
    points: 1
  };

  new Vote(newVote).save().then(vote => {
    pusher.trigger("stack-poll", "stack-vote", {
      points: parseInt(vote.points),
      stack: vote.stack
    });
    return res.json({
      success: true,
      message: "Thanks For Voting!"
    });
  });
});
module.exports = router;
