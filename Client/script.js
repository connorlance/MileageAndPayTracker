const socket = new WebSocket("ws://127.0.0.1:3000");

document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to form after the DOM is fully loaded
  document.getElementById("dailyInfoForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    submitDailyInfo(event); // Pass the event object to submitDailyInfo function
  });
});

function submitDailyInfo(event) {
  event.preventDefault(); // Prevent default form submission behavior

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  socket.send(JSON.stringify(data)); // Send data through WebSocket instead of using fetch

  // Optionally, you can still handle the response from the server here if needed
  socket.onmessage = function (event) {
    console.log("Received message from server:", event.data);
  };
}
