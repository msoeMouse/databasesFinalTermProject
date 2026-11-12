/**
 * File: signup.js
 * Brief: Send a post request to add a user to the system
 * Author: Jack Brickl
 * Date: 11/12/2026
 */

let email = document.getElementById("email")
let password = document.getElementById("password")

fetch('http://your-java-server.com/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: email.value,
        password: password.value
    })
}).then(res => res.json())
    .then(data => console.log(data));