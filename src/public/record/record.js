document.addEventListener("DOMContentLoaded", async function () {
  const performerSelect = document.getElementById("performer");
  const eventSelect = document.getElementById("event");
  const dateInput = document.getElementById("date");

  // Set today's date as default in the date input field
  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format
  dateInput.value = today;

  // Assume that `window.apiUrl` is set from your server
  const apiUrl = window.apiUrl;

  try {
    // Fetch the list of performers
    const performerResponse = await fetch(`${apiUrl}/performers`);
    const performerData = await performerResponse.json();

    console.log("Fetched performers data:", performerData); // Log data to inspect its structure

    let performersString = performerData.performers;
    performersString = performersString.replace(/'/g, '"');
    const performers = JSON.parse(performersString);

    if (Array.isArray(performers)) {
      performers.forEach((performer) => {
        const option = document.createElement("option");
        option.value = performer;
        option.textContent = performer;
        performerSelect.appendChild(option);
      });
    } else {
      console.error(
        "Error: Expected an array of performers but received:",
        performers
      );
    }

    // Fetch the list of events
    const eventResponse = await fetch(`${apiUrl}/events`);
    const eventData = await eventResponse.json();

    console.log("Fetched events data:", eventData); // Log data to inspect its structure

    let eventsString = eventData.events;
    eventsString = eventsString.replace(/'/g, '"');
    const events = JSON.parse(eventsString);

    if (Array.isArray(events)) {
      events.forEach((event) => {
        const option = document.createElement("option");
        option.value = event;
        option.textContent = event;
        eventSelect.appendChild(option);
      });
    } else {
      console.error("Error: Expected an array of events but received:", events);
    }
  } catch (err) {
    console.error("Error fetching data:", err);
  }

  // Handle form submission
  document
    .getElementById("recordForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const event = document.getElementById("event").value;
      const performer = document.getElementById("performer").value;
      const dateInput = document.getElementById("date").value;
      const date = new Date(dateInput).toISOString().split("T")[0];

      const startTimeInput = document.getElementById("startTime").value;
      const endTimeInput = document.getElementById("endTime").value;

      const startTime = new Date(`${date}T${startTimeInput}:00`);
      const endTime = new Date(`${date}T${endTimeInput}:00`);

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timeElapsedMilliseconds = endTime.getTime() - startTime.getTime();
      const timeElapsed = timeElapsedMilliseconds / (1000 * 60);

      // Validate the time
      if (timeElapsed < 0) {
        document.getElementById("response").innerText =
          "End time must be after start time.";
        return;
      }

      // Prepare the record data object
      const recordData = {
        event,
        performer,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        timeElapsed,
        date,
        timeZone,
      };

      // Populate the confirmation modal with the details
      const modalDetails = `
        Event: ${event}<br>
        Performer: ${performer}<br>
        Date: ${date}<br>
        Start Time: ${startTimeInput}<br>
        End Time: ${endTimeInput}<br>
        Time Elapsed: ${timeElapsed} minutes<br>
        Time Zone: ${timeZone}
      `;
      document.getElementById("modalDetails").innerHTML = modalDetails;

      // Show the confirmation modal
      const modal = document.getElementById("confirmationModal");
      modal.style.display = "flex";

      // If the user confirms, submit the form
      document.getElementById("confirmButton").onclick = async function () {
        try {
          const response = await fetch(`${apiUrl}/records`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(recordData),
          });

          const result = await response.json();

          if (response.ok) {
            document.getElementById("response").innerText =
              "Record saved successfully!";
            document.getElementById("recordForm").reset(); // Reset the form
          } else {
            document.getElementById("response").innerText =
              "Error: " + result.message;
          }
        } catch (err) {
          console.error("Error submitting record:", err);
          document.getElementById("response").innerText =
            "Error: Could not submit record.";
        }

        modal.style.display = "none"; // Hide the modal after confirmation
        dateInput.value = today;
      };

      // If the user cancels, close the modal
      document.getElementById("cancelButton").onclick = function () {
        modal.style.display = "none";
      };
    });

  // Redirect to /record-details on button click
  document
    .getElementById("redirectButtonToRecordDetails")
    .addEventListener("click", function () {
      window.location.href = "/record-details";
    });

  document
    .getElementById("redirectButtonToExportData")
    .addEventListener("click", function () {
      window.location.href = "/export-data";
    });
});
