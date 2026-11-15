/**
 * File: login.js
 * Brief: Check if this user exists in the system, then allow the
 * user access to system if true
 * Author: Jack Brickl
 * Date: 11/12/2026
 */

const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("status");

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Login failed: ${response.status}`);
        }

        sessionStorage.setItem("accountId", data.accountId);
        status.textContent = "Login successful.";
    } catch (error) {
        status.textContent = error.message;
    }
});