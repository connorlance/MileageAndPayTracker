document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dailyInfoForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Validate form inputs
    if (validateForm()) {
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
    }
  });
});

// Validate form inputs
function validateForm() {
  const date = document.getElementById("date").value;
  const mileageStart = document.getElementById("mileageStart").value;
  const mileageEnd = document.getElementById("mileageEnd").value;
  const pay = document.getElementById("pay").value;
  const company = document.getElementById("company").value;

  //fill all fields
  if (!date || !mileageStart || !mileageEnd || !pay || !company) {
    alert("Please fill in all fields.");
    return false;
  }

  //enter numeric value
  if (isNaN(parseFloat(mileageStart)) || isNaN(parseFloat(mileageEnd)) || isNaN(parseFloat(pay))) {
    alert("Mileage start, mileage end, and pay must be numeric values.");
    return false;
  }

  // No invalid characters
  const invalidCharacters = /[<>&$%?.*;'"`\\\/]/;
  if (invalidCharacters.test(company)) {
    companyError.style.display = "block";
    return false;
  } else {
    companyError.style.display = "none";
  }

  return true; // Return true if all validation checks pass
}
