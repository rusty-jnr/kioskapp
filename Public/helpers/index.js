// handles all error text display
const errorHandler = (id, value) => {
  $(`#${id}_error`).text(value);
};

// handles getting any input element value and triming it
const retrieveInputValue = (id) => {
  return $(`#${id}`).val()?.trim();
};

// handles putting back values in there respective input elements
const setInputValue = (id, value) => {
  $(`#${id}`).val(value);
};

// Function to validate strong password
const isStrongPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};