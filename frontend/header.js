/**
 * File: header.js
 * Brief: A header that is present on top of most pages. The header contains
 * information about current user information and a log-out button if a user
 * is signed in, otherwise contain a log-in and sign up option.
 * Author: Jack Brickl
 * Date: 11/23/2026
 */

let header = document.getElementById("header")

if (sessionStorage.getItem("accountId")) {
    let accountName = document.createElement("p");
    accountName.setAttribute("value", sessionStorage.getItem("email"));

    let logout = document.createElement("p");
    logout.textContent = "Log Out Button";

    header.appendChild(accountName);
    header.appendChild(logout);
} else {
    const login = document.createElement("a");
    login.textContent = "Log In";
    login.href = "/login.html";
    const signup = document.createElement("a");
    signup.textContent = "Sign Up";
    signup.href = "/signup.html";

    header.appendChild(login);
    header.appendChild(signup);
}