const form = document.querySelector("form");
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Get form data as an object
  const formData = new FormData(form);
  const data = {
    authorName: formData.get("authorName"),
    messageText: formData.get("messageText"),
  };

  // Check if fields are empty FIRST
  if (!data.authorName.trim() || !data.messageText.trim()) {
    alert("Please fill in both name and message");
    return; // Stop here, don't send the request
  }

  // Send as JSON (only if validation passes)
  const response = await fetch("/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const newMessage = await response.json();

  // Clear the form
  form.reset();

  // Clone existing message structure
  const existingMessage = document.querySelector("main .message");
  const messageDiv = existingMessage.cloneNode(true);

  // Update content safely
  messageDiv.querySelector(".message-user").textContent = newMessage.user;
  messageDiv.querySelector(".message-text").textContent = newMessage.text;
  messageDiv.querySelector(".message-date").textContent = new Date(
    newMessage.date
  ).toLocaleDateString("en-GB");

  // Update avatar
  messageDiv.querySelector(".avatar").style.backgroundColor =
    newMessage.avatarColor;
  messageDiv.querySelector(".avatar").textContent = newMessage.avatarInitials;

  // Add to page before the form
  const formElement = document.querySelector("form");
  const main = document.querySelector("main");
  main.insertBefore(messageDiv, formElement);
});
