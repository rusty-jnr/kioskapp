/*jshint esversion: 8 */

$(document).ready(() => {
  $("#loginForm").submit((e) => {
    let isValid = true;

    const username = retrieveInputValue("login_username");
    if (!username) {
      isValid = false;
      errorHandler("login_username", "Username is required.");
    } else {
      errorHandler("login_username", "");
    }
    setInputValue("login_username", username);

    const password = retrieveInputValue("login_password");
    if (!password) {
      isValid = false;
      errorHandler("login_password", "Password is required.");
    } else {
      errorHandler("login_password", "");
    }
    setInputValue("login_password", password);

    if (!isValid) {
      e.preventDefault();
    }
  });

  // Validation for the signup form
  $("#signupForm").submit((e) => {
    let isValid = true;

    // Username validation
    const username = retrieveInputValue("username");
    if (!username) {
      isValid = false;
      errorHandler("username", "Username is required.");
    } else {
      errorHandler("username", "");
    }
    setInputValue("username", username);

    // Password validation
    const password = retrieveInputValue("password");
    if (!password) {
      isValid = false;
      errorHandler("password", "Password is required.");
    } else if (!isStrongPassword(password)) {
      isValid = false;
      errorHandler(
        "password",
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    } else {
      errorHandler("password", "");
    }
    setInputValue("password", password);

    // Confirm Password validation
    const cPassword = retrieveInputValue("cPassword");
    if (!cPassword) {
      isValid = false;
      errorHandler("cPassword", "Confirm password is required.");
    } else if (cPassword !== password) {
      isValid = false;
      errorHandler("cPassword", "Confirm password does not match Password");
    } else {
      errorHandler("cPassword", "");
    }
    setInputValue("cPassword", cPassword);

    // User Type validation
    const userType = retrieveInputValue("userType");
    if (!userType) {
      isValid = false;
      errorHandler("userType", "Please select a user type.");
    } else {
      errorHandler("userType", "");
    }

    // Prevent form submission if validation fails
    if (!isValid) {
      e.preventDefault();
    }
  });
});
