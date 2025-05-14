
const apiUrl = "https://localhost:7164/api";

// Utility to get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
    };
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            document.getElementById("loginMessage").textContent = data.message || "";

            if (response.ok) {
                localStorage.setItem("token", data.token);
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error("Login error:", error);
            document.getElementById("loginMessage").textContent = "An error occurred during login.";
        }
    });
}

// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    const registerButton = document.getElementById("registerButton");

    if (registerButton) {
        registerButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (!name || !email || !password) {
                alert("All fields are required.");
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/auth/register`, {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                document.getElementById("registerMessage").textContent = data.message || "Registered!";

                if (response.ok) {
                    alert("Registration successful!");
                    window.location.href = "login.html";
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert("There was an error registering the user.");
            }
        });
    }
}

// SUBMIT REVIEW
const reviewForm = document.getElementById("reviewForm");
if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const eventId = document.getElementById("eventid").value;
        const rating = document.getElementById("rating").value;

        try {
            const response = await fetch(`${apiUrl}/reviews`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ eventId, rating })
            });

            const data = await response.json();
            document.getElementById("reviewMessage").textContent = data.message || "Review submitted!";
        } catch (error) {
            console.error("Review error:", error);
            document.getElementById("reviewMessage").textContent = "Error submitting review.";
        }
    });
}

// FETCH EVENTS
const eventList = document.getElementById("eventList");
if (eventList) {
    fetch(`${apiUrl}/events`, {
        headers: getAuthHeaders()
    })
        .then(res => res.json())
        .then(events => {
            eventList.innerHTML = events.map(e => `
                <div class="event-card">
                    <h3>${e.title}</h3>
                    <p>${e.description}</p>
                    <p><strong>Date:</strong> ${new Date(e.date).toLocaleDateString()}</p>
                </div>
            `).join("");
        })
        .catch(error => {
            console.error("Event fetch error:", error);
            eventList.innerHTML = "<p>Could not load events</p>";
        });
}

// NEWSLETTER
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector("input[type=email]").value;
        alert(`Thank you for subscribing with ${email}`);
        newsletterForm.reset();
    });
}

// LOGOUT BUTTON
const logoutBtn = document.getElementById("logout");
if (logoutBtn && localStorage.getItem("token")) {
    logoutBtn.style.display = "inline";
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.reload();
    });
}
