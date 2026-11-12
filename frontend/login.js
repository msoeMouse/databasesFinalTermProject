/**
 * File: login.js
 * Brief: Check if this user exists in the system, then allow the
 * user access to system if true
 * Author: Jack Brickl
 * Date: 11/12/2026
 */

let email = document.getElementById("email")
let password = document.getElementById("password")

fetch('http://your-java-server.com/api/login', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: email,
        password: password
    })
}).then(res => res.json())
    .then(data => console.log(data));