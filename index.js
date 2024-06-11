const express = require("express");
require("./DB/connection");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const Message = require("./Model/msg");
const port = process.env.PORT || 9000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

app.use(express.static(join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("reconnect messages", async (lastDisconnectTime) => {
    try {
      const messages = await Message.find({
        timestamp: { $gt: new Date(lastDisconnectTime) },
      })
        .sort({ timestamp: 1 })
        .exec();
      socket.emit("reconnect messages", messages);
    } catch (err) {
      console.error("Failed to retrieve messages:", err);
    }
  });

  socket.on("chat message", async (msg) => {
    const message = new Message({ content: msg });
    try {
      const savedMessage = await message.save();
      if (!savedMessage) throw new Error("Message saving failed");
      io.emit("chat message", savedMessage.content, savedMessage._id);
    } catch (e) {
      console.error("Failed to save message:", e);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
