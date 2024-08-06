document.addEventListener("DOMContentLoaded", function () {
  // Function to validate dailyInfoForm inputs
  function validateDailyInfoForm() {
    const form = document.getElementById("dailyInfoForm");
    const date = form.querySelector("input[name='date']").value;
    let mileageStart = form.querySelector("input[name='mileageStart']").value;
    let mileageEnd = form.querySelector("input[name='mileageEnd']").value;
    const pay = form.querySelector("input[name='pay']").value;
    const company = form.querySelector("input[name='company']").value;

    // Fill all fields
    if (!date || !mileageStart || !mileageEnd || !pay || !company) {
      alert("Please fill in all fields.");
      return false;
    }

    // Enter numeric value
    if (isNaN(parseFloat(mileageStart)) || isNaN(parseFloat(mileageEnd)) || isNaN(parseFloat(pay))) {
      alert("Mileage start, mileage end, and pay must be numeric values.");
      return false;
    }

    // MileageEnd must be larger than MileageStart
    if (mileageEnd <= mileageStart) {
      alert("Mileage end must be larger than mileage start.");
      return false;
    }

    // No invalid characters
    const invalidCharacters = /[<>&$%?.*;'"`\\\/]/;
    if (invalidCharacters.test(company)) {
      alert("Company name cannot contain invalid characters.");
      return false;
    }

    // Remove commas from mileageStart and mileageEnd
    mileageStart = mileageStart.replace(/,/g, "");
    mileageEnd = mileageEnd.replace(/,/g, "");

    return true;
  }

  // Function to validate companyForm inputs
  function validateInsertCompanyForm() {
    const insertCompany = document.querySelector("#companyForm input[name='insertCompany']").value;

    // Check if insertCompany is empty
    if (!insertCompany) {
      alert("Please enter a company name.");
      return false;
    }

    // Enter letters
    if (!insertCompany.match(/^[a-zA-Z\s]*$/)) {
      alert("Company name can only contain letters and spaces.");
      return false;
    }

    return true;
  }

  // Function to validate companyForm inputs
  function validateRemoveCompanyForm() {
    const companyName = document.getElementById("companyDropdown").value;

    // Check if the input value is empty
    if (!companyName) {
      alert("Please select a company name.");
      return false;
    }

    // Enter letters
    if (!companyName.match(/^[a-zA-Z\s]*$/)) {
      alert("Company name can only contain letters and spaces.");
      return false;
    }

    return true;
  }

  // Sort buttons
  let currentIntervalSortMethod = "daily";

  const intervalSortButtons = document.querySelectorAll("#intervalSortButtons button");

  // Function to highlight the selected button
  function highlightButton(button) {
    intervalSortButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  }

  // Function to fetch sorted data and update the page
  function fetchSortedPartial(sortType) {
    fetch(`/sort/${sortType}`)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("IntervalSortedData").innerHTML = data;
      })
      .catch((err) => console.error("Error fetching sorted data:", err));
  }

  // Add click event listeners to sort buttons
  intervalSortButtons.forEach((button) => {
    button.addEventListener("click", function () {
      highlightButton(this);
      fetchSortedPartial(this.value);
      currentIntervalSortMethod = this.value;
    });
  });

  // Fetch daily data on page load and highlight the daily button
  window.addEventListener("load", () => {
    const dailyButton = document.querySelector("#intervalSortButtons button[value='daily']");
    if (dailyButton) {
      highlightButton(dailyButton);
      fetchSortedPartial("daily");
    }
  });

  // dailyInfoForm
  if (document.getElementById("dailyInfoForm")) {
    document.getElementById("dailyInfoForm").addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateDailyInfoForm()) {
        const formData = new FormData(this);

        fetch("/dailyInfoForm", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.text())
          .then((data) => {
            console.log(data);
            fetchSortedPartial(currentIntervalSortMethod);
          })
          .catch((err) => console.error("Error: ", err));
        this.reset();
      }
    });
  }

  // insertCompanyForm
  if (document.getElementById("companyForm")) {
    document.getElementById("companyForm").addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateInsertCompanyForm()) {
        const insertCompany = this.querySelector("input[name='insertCompany']").value;
        const formData = new FormData(this);

        fetch("/createCompany", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            if (data.exists) {
              alert(`The company "${insertCompany}" already exists.`);
            } else {
              alert(`${insertCompany} added successfully.`);
            }
            updateRemoveCompanyDropdownMenu();
          })
          .catch((err) => console.error("Error: ", err));
        this.reset();
      }
    });
  }

  // Function to update dropdown menu with company names
  function updateRemoveCompanyDropdownMenu() {
    const companyDropdown = document.getElementById("companyDropdown");
    if (!companyDropdown) {
      return;
    }

    fetch("/companyNames")
      .then((response) => response.json())
      .then((data) => {
        companyDropdown.innerHTML = "";

        companyDropdown.innerHTML = "<option value=''>Select Company</option>";
        companyDropdown.selectedIndex = -1;

        // Add the company names as options
        data.companyNames.forEach((companyName) => {
          const option = document.createElement("option");
          option.value = companyName;
          option.textContent = companyName;
          companyDropdown.appendChild(option);
        });
      })
      .catch((err) => console.error("Error fetching company names:", err));
  }

  // Function to remove a company
  if (document.getElementById("removeCompanyForm")) {
    document.getElementById("removeCompanyForm").addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateRemoveCompanyForm()) {
        const companyName = document.getElementById("companyDropdown").value;

        fetch("/removeCompany", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json", // Correct syntax for setting headers
          },
          body: JSON.stringify({ companyName: companyName }), // Send JSON data
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            updateRemoveCompanyDropdownMenu();
          })
          .catch((err) => console.error("Error: ", err));
        this.reset();
      }
    });
  }

  // Fetch company names from server when the DOM content is loaded
  updateRemoveCompanyDropdownMenu();
});
