const apiUrl = window.apiUrl;

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          errorMessage.textContent = "";
          alert("Login successful!");
          window.location.href = "/add-record";
        } else {
          errorMessage.textContent =
            result.message || "Invalid email or password.";
        }
      } else {
        errorMessage.textContent = "Server error. Please try again.";
      }
    } catch (error) {
      console.error("Error:", error);
      errorMessage.textContent = "Network error. Please try again.";
    }
  });
