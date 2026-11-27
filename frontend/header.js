/**
 * File: header.js
 * Brief: A header that is present on top of most pages. The header contains
 * information about current user information and a log-out button if a user
 * is signed in, otherwise contain a log-in and sign up option.
 * Author: Jack Brickl
 * Date: 11/23/2026
 */

let header = document.getElementById("account-header")

// if logged in, display account settings. if not logged in, provide options to log in or sign up
if (sessionStorage.getItem("accountId")) {
    let accountName = document.createElement("p");
    accountName.textContent = ("Account: " + sessionStorage.getItem("accountEmail"));

    let accountSettings = document.createElement("button");
    accountSettings.textContent = "Account Settings";
    accountSettings.onclick = () => {
        location.href = "/account_settings.html"
    }

    let logout = document.createElement("button");
    logout.textContent = "Log Out";
    logout.onclick = () => {
        sessionStorage.removeItem("accountId");
        sessionStorage.removeItem("accountEmail");
        location.reload();
    }

    header.appendChild(accountName);
    header.appendChild(accountSettings);
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