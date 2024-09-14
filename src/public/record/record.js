document.addEventListener("DOMContentLoaded", async function () {
  const performerSelect = document.getElementById("performer");
  const eventSelect = document.getElementById("event");

  try {
    // Fetch the list of performers
    const performerResponse = await fetch(
      "http://localhost:4000/api/performers"
    );
    const performerData = await performerResponse.json();

    console.log("Fetched performers data:", performerData); // Log data to inspect its structure

    // Extract the performers string
    let performersString = performerData.performers;

    // Replace single quotes with double quotes for valid JSON
    performersString = performersString.replace(/'/g, '"');

    // Convert the JSON string to a JavaScript array
    const performers = JSON.parse(performersString);

    if (Array.isArray(performers)) {
      // Populate the performer dropdown
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
    const eventResponse = await fetch("http://localhost:4000/api/events");
    const eventData = await eventResponse.json();

    console.log("Fetched events data:", eventData); // Log data to inspect its structure

    // Extract the events string
    let eventsString = eventData.events;

    // Replace single quotes with double quotes for valid JSON
    eventsString = eventsString.replace(/'/g, '"');

    // Convert the JSON string to a JavaScript array
    const events = JSON.parse(eventsString);

    if (Array.isArray(events)) {
      // Populate the event dropdown
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
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form data
      const event = document.getElementById("event").value;
      const performer = document.getElementById("performer").value;
      const startTime = new Date(document.getElementById("startTime").value);
      const endTime = new Date(document.getElementById("endTime").value);
      const dateInput = document.getElementById("date").value;
      const date = new Date(dateInput).toISOString().split("T")[0]; // Formats to 'YYYY-MM-DD'

      // Get the user's time zone
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Calculate time elapsed in milliseconds
      const timeElapsedMilliseconds = endTime.getTime() - startTime.getTime();

      // Convert milliseconds to minutes
      const timeElapsed = timeElapsedMilliseconds / (1000 * 60);

      // Validate that the endTime is after startTime
      if (timeElapsed < 0) {
        document.getElementById("response").innerText =
          "End time must be after start time.";
        return;
      }

      // Prepare the data object to be sent to the server
      const recordData = {
        event,
        performer,
        startTime: startTime.toISOString(), // Convert to ISO string
        endTime: endTime.toISOString(), // Convert to ISO string
        timeElapsed,
        date, // Include the formatted date
        timeZone, // Include the time zone
      };

      try {
        // Send the data to your backend API (replace the URL with your backend endpoint)
        const response = await fetch("http://localhost:4000/api/records", {
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
          document.getElementById("recordForm").reset(); // Reset the form after successful submission
        } else {
          document.getElementById("response").innerText =
            "Error: " + result.message;
        }
      } catch (err) {
        console.error("Error submitting record:", err);
        document.getElementById("response").innerText =
          "Error: Could not submit record.";
      }
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
