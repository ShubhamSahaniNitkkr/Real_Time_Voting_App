const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const connectDB = require("./config/db");
const { isDemoMode } = require("./config/demo");

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });
app.locals.io = io;

connectDB();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/poll", require("./routes/poll"));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server Started at Port ${PORT}`);
  if (isDemoMode()) {
    console.log("DEMO_MODE: real-time updates via Socket.IO (no Pusher/MongoDB)");
  }
});
