document.addEventListener("DOMContentLoaded", function () {
  const eventSelect = document.getElementById("eventSelect");
  const dateFilter = document.getElementById("dateFilter");
  const performersTableBody = document.querySelector("#performersTable tbody");

  async function fetchEvents() {
    try {
      const response = await fetch("http://localhost:4000/api/events");
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

  async function fetchPerformers(event, date) {
    try {
      const url = date ? `/api/${event}?date=${date}` : `/api/${event}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.data) {
        displayPerformers(result.data);
      } else {
        performersTableBody.innerHTML =
          '<tr><td colspan="4">No data found</td></tr>';
      }
    } catch (error) {
      console.error("Error fetching performers:", error);
      performersTableBody.innerHTML =
        '<tr><td colspan="4">Error loading data</td></tr>';
    }
  }

  function displayPerformers(performers) {
    performersTableBody.innerHTML = "";

    performers.forEach((performer) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${performer.performer}</td>
        <td>${performer.startTime}</td>
        <td>${performer.endTime}</td>
        <td>${performer.timeElapsed}</td>
      `;
      performersTableBody.appendChild(row);
    });
  }

  // Fetch performers when the event select dropdown value changes
  eventSelect.addEventListener("change", function () {
    const selectedEvent = eventSelect.value.toUpperCase();
    const selectedDate = dateFilter.value;
    if (selectedEvent) {
      fetchPerformers(selectedEvent, selectedDate);
    }
  });

  // Fetch performers when the date filter changes
  dateFilter.addEventListener("change", function () {
    const selectedEvent = eventSelect.value.toUpperCase();
    const selectedDate = dateFilter.value;
    if (selectedEvent) {
      fetchPerformers(selectedEvent, selectedDate);
    }
  });

  // Fetch events and performers for the default selected event on page load
  fetchEvents();
  // Ensure fetching performers for the default selected event if it exists
  if (eventSelect.value) {
    fetchPerformers(eventSelect.value.toUpperCase(), dateFilter.value);
  }
});
