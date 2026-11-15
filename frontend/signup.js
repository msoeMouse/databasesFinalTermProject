/**
 * File: signup.js
 * Brief: Send a post request to add a user to the system
 * Author: Jack Brickl
 * Date: 11/12/2026
 */

const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("status");

    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Sign up failed: ${response.status}`);
        }

        status.textContent = "Account created. You can now log in.";
    } catch (error) {
        status.textContent = error.message;
    }
});