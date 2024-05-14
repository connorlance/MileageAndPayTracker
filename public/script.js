document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dailyInfoForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch("/dailyInfoForm", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.error("Error: ", err));
  });
});
