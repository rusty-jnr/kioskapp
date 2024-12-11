/*jshint esversion: 8 */

$(document).ready(() => {

  $("#gTestForm").submit((e) => {
    let isValid = true;

    const carMake = retrieveInputValue("carMake");
    if (!carMake) {
        isValid = false;
        errorHandler("carMake", "Car make is required.");
    } else {
        errorHandler("carMake", "");
    }
    setInputValue("carMake", carMake);

    const carModel = retrieveInputValue("carModel");
    if (!carModel) {
        isValid = false;
        errorHandler("carModel", "Car model is required.");
    } else {
        errorHandler("carModel", "");
    }
    setInputValue("carModel", carModel);

    const carYear = retrieveInputValue("carYear");
    const currentYear = new Date().getFullYear();
    if (!carYear) {
        isValid = false;
        errorHandler("carYear", "Car year is required.");
    } else if (carYear.length !== 4 || carYear < 1990 || carYear > currentYear) {
        isValid = false;
        errorHandler("carYear", `Car year must be a 4-digit year and between 1990 & ${currentYear}.`);
    } else {
        errorHandler("carYear", "");
    }
    setInputValue("carYear", carYear);

    const plateNumber = retrieveInputValue("plateNumber");
    if (!plateNumber) {
        isValid = false;
        errorHandler("plateNumber", "Plate number is required.");
    } else if (!/^[a-zA-Z0-9-]+$/.test(plateNumber)) {
        isValid = false;
        errorHandler("plateNumber", "Plate number must only contain letters, numbers, and hyphens.");
    } else {
        errorHandler("plateNumber", "");
    }
    setInputValue("plateNumber", plateNumber);

    if (!isValid) {
      e.preventDefault();
    }
  });

  $("#availableDateForm").on("submit", function (e) {
    const dateInputValue = $("#datePicker").val();

    if (!dateInputValue) {
      e.preventDefault();
      alert("Please select a date.");
      return;
    }

    // Parse the selected date and the current date
    const selectedDate = new Date(dateInputValue);
    const currentDate = new Date();

    // Remove time from the current date for comparison
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      e.preventDefault();
      alert("Please select a current or future date.");
      return;
    }
  });
});
