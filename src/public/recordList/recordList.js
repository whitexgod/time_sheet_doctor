document.addEventListener("DOMContentLoaded", function () {
  const eventSelect = document.getElementById("eventSelect");
  const dateFilter = document.getElementById("dateFilter");
  const nameFilter = document.getElementById("nameFilter");
  const performersTableBody = document.querySelector("#performersTable tbody");

  async function fetchEvents() {
    try {
      const response = await fetch(`${apiUrl}/events`);
      const result = await response.json();

      let eventsString = result.events.replace(/'/g, '"');
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
    eventSelect.innerHTML = '<option value="">Select an event</option>';
    events.forEach((event) => {
      const option = document.createElement("option");
      option.value = event;
      option.textContent = event;
      eventSelect.appendChild(option);
    });
  }

  async function fetchPerformers(event, date) {
    try {
      const url = date
        ? `${apiUrl}/${event}?date=${date}`
        : `${apiUrl}/${event}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.data) {
        displayPerformers(result.data);
      } else {
        performersTableBody.innerHTML =
          '<tr><td colspan="5">No data found</td></tr>';
      }
    } catch (error) {
      console.error("Error fetching performers:", error);
      performersTableBody.innerHTML =
        '<tr><td colspan="5">Error loading data</td></tr>';
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
        <td><button class="delete-btn" data-id="${performer._id}">Delete</button></td>
      `;
      performersTableBody.appendChild(row);
    });
    addDeleteHandlers();
  }

  // Add event listeners for delete buttons
  function addDeleteHandlers() {
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async function () {
        const performerId = this.getAttribute("data-id");
        await deletePerformer(performerId);
      });
    });
  }

  async function deletePerformer(id) {
    try {
      const response = await fetch(`${apiUrl}/performers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const selectedEvent = eventSelect.value.toUpperCase();
        const selectedDate = dateFilter.value;
        fetchPerformers(selectedEvent, selectedDate); // Refresh the list
      } else {
        console.error("Error deleting performer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Filter performers by name
  nameFilter.addEventListener("input", function () {
    const filterValue = nameFilter.value.toLowerCase();
    const rows = performersTableBody.querySelectorAll("tr");
    rows.forEach((row) => {
      const performerName = row.querySelector("td").textContent.toLowerCase();
      if (performerName.includes(filterValue)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });

  eventSelect.addEventListener("change", function () {
    const selectedEvent = eventSelect.value.toUpperCase();
    const selectedDate = dateFilter.value;
    if (selectedEvent) {
      fetchPerformers(selectedEvent, selectedDate);
    }
  });

  dateFilter.addEventListener("change", function () {
    const selectedEvent = eventSelect.value.toUpperCase();
    const selectedDate = dateFilter.value;
    if (selectedEvent) {
      fetchPerformers(selectedEvent, selectedDate);
    }
  });

  fetchEvents();
});
