document.addEventListener("DOMContentLoaded", function () {
  // Function to validate dailyInfoForm inputs
  function validateDailyInfoForm() {
    const form = document.getElementById("dailyInfoForm");
    const date = form.querySelector("input[name='date']").value;
    const mileageStart = form.querySelector("input[name='mileageStart']").value;
    const mileageEnd = form.querySelector("input[name='mileageEnd']").value;
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

    return true; // Return true if all validation checks pass
  }

  // Function to validate companyForm inputs
  function validateCompanyForm() {
    const form = document.getElementById("companyForm");
    const insertCompany = form.querySelector("input[name='insertCompany']").value;

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

    return true; // Return true if all validation checks pass
  }

  // Attach event listener to dailyInfoForm
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
          })
          .catch((err) => console.error("Error: ", err));
        this.reset(); // Reset the form
      }
    });
  }

  // Attach event listener to companyForm
  if (document.getElementById("companyForm")) {
    document.getElementById("companyForm").addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateCompanyForm()) {
        const insertCompany = this.querySelector("input[name='insertCompany']").value;
        console.log("Company Name:", insertCompany); // Log the company name

        const formData = new FormData();
        formData.append("insertCompany", insertCompany);

        fetch("/createCompany", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Response:", data); // Log the response from the server
            if (data.error) {
              console.error("Error checking table existence:", data.error);
            } else {
              if (data.exists) {
                alert(`The company "${insertCompany}" already exists.`);
              } else {
                alert(`${insertCompany} added successfully.`);
              }
            }
            // After successful insertion, update the dropdown menu
            updateDropdownMenu();
          })
          .catch((err) => console.error("Error: ", err));

        this.reset(); // Reset the form
      }
    });
  }

  // Function to update dropdown menu with company names
  function updateRemoveCompanyDropdownMenu() {
    // Fetch company names from server
    fetch("/companyNames")
      .then((response) => response.json())
      .then((data) => {
        const companyDropdown = document.getElementById("companyDropdown");

        // Clear any existing options
        companyDropdown.innerHTML = "";

        // Add the default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Company";
        companyDropdown.appendChild(defaultOption);

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

  // Fetch company names from server when the DOM content is loaded
  updateRemoveCompanyDropdownMenu();
});
