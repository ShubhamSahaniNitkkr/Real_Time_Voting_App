const express = require("express");
const router = express.Router();
const Vote = require("../models/vote");
const { isDemoMode } = require("../config/demo");
const mockVotes = require("../mock/votes");

let pusher = null;

if (!isDemoMode() && process.env.PUSHER_APP_ID) {
  const Pusher = require("pusher");
  pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER || "ap2",
    encrypted: true
  });
}

router.get("/status", (req, res) => {
  res.json({ demoMode: isDemoMode(), pusherEnabled: !!pusher });
});

router.get("/", (req, res) => {
  if (isDemoMode()) {
    return res.json({ success: true, votes: mockVotes.getAll(), demoMode: true });
  }

  Vote.find().then(votes => res.json({ success: true, votes }));
});

router.post("/", (req, res) => {
  const newVote = {
    stack: req.body.stack,
    points: 1
  };

  if (isDemoMode()) {
    const vote = mockVotes.addVote(newVote.stack);
    if (req.app.locals.io) {
      req.app.locals.io.emit("stack-vote", {
        points: parseInt(vote.points, 10),
        stack: vote.stack
      });
    }
    return res.json({ success: true, message: "Thanks For Voting!" });
  }

  new Vote(newVote).save().then(vote => {
    if (pusher) {
      pusher.trigger("stack-poll", "stack-vote", {
        points: parseInt(vote.points, 10),
        stack: vote.stack
      });
    }
    return res.json({ success: true, message: "Thanks For Voting!" });
  });
});

module.exports = router;
