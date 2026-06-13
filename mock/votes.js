const votes = [
  { _id: "1", stack: "VueJs", points: 3 },
  { _id: "2", stack: "ReactJs", points: 5 },
  { _id: "3", stack: "AngularJs", points: 2 },
  { _id: "4", stack: "NodeJs", points: 4 }
];

let nextId = 5;
const listeners = [];

function getAll() {
  return votes;
}

function addVote(stack) {
  const vote = { _id: String(nextId++), stack, points: 1 };
  votes.push(vote);
  listeners.forEach(fn => fn(vote));
  return vote;
}

function onVote(listener) {
  listeners.push(listener);
}

module.exports = { getAll, addVote, onVote };
