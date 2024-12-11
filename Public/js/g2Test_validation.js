/*jshint esversion: 8 */

$(document).ready(() => {
  $("#g2Form").submit((e) => {
    let isValid = true;

    const firstName = retrieveInputValue("firstName");
    if (!firstName) {
      isValid = false;
      errorHandler("firstName", "First name is required.");
    } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      isValid = false;
      errorHandler("firstName", "First name must only contain characters.");
    } else {
      errorHandler("firstName", "");
    }
    setInputValue("firstName", firstName);

    const lastName = retrieveInputValue("lastName");
    if (!lastName) {
      isValid = false;
      errorHandler("lastName", "Last name is required.");
    } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      isValid = false;
      errorHandler("lastName", "Last name must only contain characters.");
    } else {
      errorHandler("lastName", "");
    }
    setInputValue("lastName", lastName);

    const licenseNumber = retrieveInputValue("licenseNumber");
    if (!licenseNumber) {
      isValid = false;
      errorHandler("licenseNumber", "License number is required.");
    } else if (!/^[a-zA-Z0-9]+$/.test(licenseNumber)) {
      isValid = false;
      errorHandler(
        "licenseNumber",
        "License number must not contain special characters."
      );
    } else if (licenseNumber.length !== 8) {
      isValid = false;
      errorHandler("licenseNumber", "License number must be 8 characters");
    } else {
      errorHandler("licenseNumber", "");
    }
    setInputValue("licenseNumber", licenseNumber);

    const age = retrieveInputValue("age");
    if (!age) {
      isValid = false;
      errorHandler("age", "Age is required.");
    } else if (age < 18) {
      isValid = false;
      errorHandler("age", "You must be 18 or older.");
    } else {
      errorHandler("age", "");
    }
    setInputValue("age", age);

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
    } else if (
      carYear.length !== 4 ||
      carYear < 1990 ||
      carYear > currentYear
    ) {
      isValid = false;
      errorHandler(
        "carYear",
        `Car year must be a 4-digit year and between 1990 & ${currentYear}.`
      );
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
      errorHandler(
        "plateNumber",
        "Plate number must only contain letters, numbers, and hyphens."
      );
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
