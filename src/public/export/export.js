document.addEventListener("DOMContentLoaded", function () {
  const eventSelect = document.getElementById("eventSelect");
  const exportButton = document.getElementById("exportButton");

   // Assume that `window.apiUrl` is set from your server
   const apiUrl = window.apiUrl;

  async function fetchEvents() {
    try {
      const response = await fetch(`${apiUrl}/events`);
      const result = await response.json();

      // Extract the events string
      let eventsString = result.events;

      // Replace single quotes with double quotes for valid JSON
      eventsString = eventsString.replace(/'/g, '"');

      // Convert the JSON string to a JavaScript array
      const events = JSON.parse(eventsString);

      if (events) {
        populateEventSelect(events);
      } else {
        console.error("No events data found");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  function populateEventSelect(events) {
    // Clear existing options
    eventSelect.innerHTML = '<option value="">Select an event</option>';

    // Add new options
    events.forEach((event) => {
      const option = document.createElement("option");
      option.value = event; // Adjust based on your data structure
      option.textContent = event; // Adjust based on your data structure
      eventSelect.appendChild(option);
    });
  }

  async function exportRecords(event) {
    try {
      // Construct the URL for the export records API
      const url = `/export-records/${event}`;

      // Open the URL in a new tab
      window.open(url, "_blank");

      // Optionally, you can also use `window.location.href = url;` to open the file in the same tab
      // window.location.href = url;

      console.log(`Attempted to export records for event: ${event}`);
    } catch (error) {
      console.error("Error in exportRecords:", error);
    }
  }

  // Export button click event
  exportButton.addEventListener("click", function () {
    const selectedEvent = eventSelect.value;
    if (selectedEvent) {
      exportRecords(selectedEvent);
    } else {
      alert("Please select an event first.");
    }
  });

  // Fetch events on page load
  fetchEvents();
});
