$(document).ready(function () {
  $("#addTimeSlot").on("click", function () {
    const dateInput = $("#dateInput");
    const timeInput = $("#timeInput");
    const timeSlotsList = $("#timeSlotsList");

    if (timeInput.val() && dateInput.val()) {
      // Construct the date-time string
      const dateTimeString = `${dateInput.val()} - ${timeInput.val()}`;

      // Check if the time slot already exists in the list
      const isDuplicate = $("#timeSlotsList")
        .children()
        .toArray()
        .some(function (li) {
          return $(li).contents().get(0).nodeValue.trim() === dateTimeString;
        });

      if (isDuplicate) {
        alert("This time slot for the selected date has already been added.");
        return; // Prevent adding duplicate entry
      }

      // Create a new list item for the added time slot
      const li = $("<li>")
        .addClass(
          "list-group-item d-flex justify-content-between align-items-center"
        )
        .text(dateTimeString);

      // Add a remove button to each time slot
      const removeBtn = $("<button>")
        .addClass("btn btn-sm btn-danger")
        .text("Remove")
        .on("click", function () {
          li.remove();
          updateTimeSlotsInput();
        });

      li.append(removeBtn);
      timeSlotsList.append(li);

      // Clear the input and update the hidden input field
      timeInput.val("");
      updateTimeSlotsInput();
    }
  });

  function updateTimeSlotsInput() {
    const timeSlots = $("#timeSlotsList")
      .children()
      .map(function () {
        return $(this).contents().get(0).nodeValue;
      })
      .get();

    $("#timeSlotsInput").val(timeSlots.join(","));
  }

  $("#appointmentForm").on("submit", function (e) {
    const dateInput = $("#dateInput").val();

    if (!dateInput) {
      e.preventDefault();
      alert("Please select a date.");
      return;
    }

    // Parse the selected date and the current date
    const selectedDate = new Date(dateInput);
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
