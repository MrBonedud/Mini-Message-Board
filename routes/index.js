const express = require("express");

const indexRouter = express.Router();

function formatDate(date) {
  return date.toLocaleDateString("en-GB");
}

function getUserInitials(username) {
  const name = username.trim();
  return name[0].toUpperCase();
}

function getAvatarColor(username) {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to a hue value (0-360 for HSL)
  const hue = Math.abs(hash) % 360;

  // Return HSL color with fixed saturation and lightness
  return `hsl(${hue}, 70%, 50%)`;
}

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    date: new Date(),
  },
  {
    text: "Hello World!",
    user: "Charles",
    date: new Date(),
  },
];

indexRouter.get("/", (req, res) =>
  res.render("index", {
    messages: messages,
    formatDate: formatDate,
    getUserInitials: getUserInitials,
    getAvatarColor: getAvatarColor,
  })
);

indexRouter.post("/new", (req, res) => {
  const authorName = req.body.authorName;
  const messageText = req.body.messageText;

  const newMessage = {
    text: messageText,
    user: authorName,
    date: new Date(),
  };

  if (
    !authorName ||
    !messageText ||
    !authorName.trim() ||
    !messageText.trim()
  ) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  messages.push(newMessage);

  // Send back message data WITH avatar info
  res.json({
    ...newMessage,
    avatarColor: getAvatarColor(authorName),
    avatarInitials: getUserInitials(authorName),
  });
});

module.exports = indexRouter;
