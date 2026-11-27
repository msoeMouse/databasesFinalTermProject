/**
 * File: account_settings.js
 * Brief: Interface that allows a user to change database information if they are signed in
 * Author: Jack Brickl
 * Date: 11/25/2026
 */

let initialUsername;
let initialPassword;

async function getAccount(){
    try {
        const response = await fetch("/api/account-settings", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: new URLSearchParams({
                id: sessionStorage.getItem("accountId")
            })
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("Error with api request: " + response.statusText);

        } else {
            const item = data.data;
            document.getElementById("changeEmail").value = item[0].email;
            document.getElementById("changePassword").value = item[0].password;
        }
    } catch (error) {
        console.error("Cannot request account information: " + error.message);
    }
}

if (sessionStorage.getItem("accountId")) {
    //TODO get values from database
    getAccount();

} else {
    //TODO: remove child elements and display a message if you aren't logged in
    document.body.remove();
}