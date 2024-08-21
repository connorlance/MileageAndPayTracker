document.addEventListener("DOMContentLoaded", function () {
  // Function to validate dailyInfoForm inputs
  function validateDailyInfoForm() {
    const form = document.getElementById("dailyInfoForm");
    const date = form.querySelector("input[name='date']").value;
    let mileageStart = form.querySelector("input[name='mileageStart']").value;
    let mileageEnd = form.querySelector("input[name='mileageEnd']").value;
    const pay = form.querySelector("input[name='pay']").value;
    const company = form.querySelector("select[name='company']").value;

    // Check if all fields are filled
    if (!date || !mileageStart || !mileageEnd || !pay || !company) {
      alert("Please fill in all fields.");
      return false;
    }

    // Ensure numeric values for mileageStart, mileageEnd, and pay
    if (isNaN(parseFloat(mileageStart)) || isNaN(parseFloat(mileageEnd)) || isNaN(parseFloat(pay))) {
      alert("Mileage start, mileage end, and pay must be numeric values.");
      return false;
    }

    // MileageEnd must be larger than MileageStart
    if (mileageEnd <= mileageStart) {
      alert("Mileage end must be larger than mileage start.");
      return false;
    }

    // Check for invalid characters in company name
    const invalidCharacters = /[<>&$%?.*;'"`\\\/]/;
    if (invalidCharacters.test(company)) {
      alert("Company name cannot contain invalid characters.");
      return false;
    }

    // Remove commas from mileageStart and mileageEnd
    mileageStart = mileageStart.replace(/,/g, "");
    mileageEnd = mileageEnd.replace(/,/g, "");

    // Update the form fields with the cleaned values
    form.querySelector("input[name='mileageStart']").value = mileageStart;
    form.querySelector("input[name='mileageEnd']").value = mileageEnd;

    return true;
  }

  // Function to validate insertCompanyForm inputs
  function validateInsertCompanyForm() {
    const insertCompany = document.querySelector("#companyForm input[name='insertCompany']").value;

    // Check if insertCompany is empty
    if (!insertCompany) {
      alert("Please enter a company name.");
      return false;
    }

    // Ensure insertCompany contains only letters and spaces
    if (!insertCompany.match(/^[a-zA-Z\s]*$/)) {
      alert("Company name can only contain letters and spaces.");
      return false;
    }

    return true;
  }

  // Function to validate removeCompanyForm inputs
  function validateRemoveCompanyForm() {
    const companyName = document.getElementById("removeCompanyDropdown").value;

    // Check if companyName is empty
    if (!companyName) {
      alert("Please select a company name.");
      return false;
    }

    // Ensure companyName contains only letters and spaces
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
            fetchMapRowsData(currentMapRowsMethod);
            this.querySelector("input[name='pay']").value = "";
            this.querySelector("select[name='company']").value = "";
          })
          .catch((err) => console.error("Error: ", err));
      }
    });
  }

  //MAP Row sort buttons
  // Mileage and Pay Method
  let currentMapRowsMethod = "all";

  // Function to highlight the selected button
  function highlightMapRowsButton(button) {
    document.querySelectorAll("#mapRowsButtons button").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  }

  // Function to fetch map rows data and update the page
  function fetchMapRowsData(company) {
    fetch(company === "all" ? "/mapRows" : `/mapRows?company=${encodeURIComponent(company)}`)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("MapRowsData").innerHTML = data;
      })
      .catch((err) => console.error("Error fetching map rows data:", err));
  }

  // Add click event listeners to map rows buttons
  document.querySelectorAll("#mapRowsButtons button").forEach((button) => {
    button.addEventListener("click", function () {
      highlightMapRowsButton(this);
      fetchMapRowsData(this.value);
      currentMapRowsMethod = this.value;
    });
  });

  // Fetch all map rows data on page load and highlight the 'All' button
  window.addEventListener("load", () => {
    const allButton = document.querySelector("#mapRowsButtons button[value='all']");
    if (allButton) {
      highlightMapRowsButton(allButton);
      fetchMapRowsData("all");
    }
  });

  // MAP Rows delete button
  if (document.getElementById("MapRowsData")) {
    document.getElementById("MapRowsData").addEventListener("click", async function (event) {
      if (event.target.matches(".delete-btn")) {
        const button = event.target;
        const id = button.getAttribute("data-id");
        const date = button.getAttribute("data-date");
        const totalMiles = button.getAttribute("data-total-miles");
        const pay = button.getAttribute("data-pay");

        try {
          const response = await fetch(`/deleteRow/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ date, totalMiles, pay }),
          });
          fetchMapRowsData(currentMapRowsMethod);
          fetchSortedPartial(currentIntervalSortMethod);
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred while deleting the row.");
        }
      }
    });
  }

  // insertCompanyForm
  if (document.getElementById("companyForm")) {
    document.getElementById("companyForm").addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateInsertCompanyForm()) {
        const formData = new FormData(this);

        fetch("/createCompany", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            populateCompanyDropdowns();
            fetchMapRowsButtons();
            fetchMapRowsData(currentMapRowsMethod);
            fetchSortedPartial(currentIntervalSortMethod);
          })
          .catch((err) => console.error("Error: ", err));
        this.reset();
      }
    });
  }

  // Function to populate company dropdowns
  function populateCompanyDropdowns() {
    const companyDropdowns = document.querySelectorAll("#companyDropdownDaily, #removeCompanyDropdown");
    if (companyDropdowns.length === 0) {
      return;
    }

    fetch("/companyNames")
      .then((response) => response.json())
      .then((data) => {
        const options = "<option value=''>Select Company</option>" + data.companyNames.map((companyName) => `<option value='${companyName}'>${companyName}</option>`).join("");

        companyDropdowns.forEach((dropdown) => {
          dropdown.innerHTML = options;
        });
      })
      .catch((err) => console.error("Error fetching company names:", err));
  }

  // Function to remove a company
  if (document.getElementById("removeCompanyForm")) {
    document.getElementById("removeCompanyForm").addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateRemoveCompanyForm()) {
        const companyName = document.getElementById("removeCompanyDropdown").value;

        fetch("/removeCompany", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ companyName: companyName }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            populateCompanyDropdowns();
            fetchMapRowsButtons();
            fetchMapRowsData(currentMapRowsMethod);
            fetchSortedPartial(currentIntervalSortMethod);
          })
          .catch((err) => console.error("Error: ", err));
        this.reset();
      }
    });
  }

  function fetchMapRowsButtons() {
    fetch("/mapRowsButtons")
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("mapRowsButtons").innerHTML = html;
      })
      .catch((error) => console.error("Error fetching map rwos buttons:", error));
  }

  // Populate the company dropdowns when the page loads
  populateCompanyDropdowns();
});
