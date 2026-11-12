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

    try {
        const response = await fetch("http://localhost:PORT/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Could not log in:", error);
    }
});