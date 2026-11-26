/**
 * File: account_settings.js
 * Brief: Interface that allows a user to change database information if they are signed in
 * Author: Jack Brickl
 * Date: 11/25/2026
 */

if (sessionStorage.getItem("accountId")) {
    //TODO get values from database
    document.getElementById("changeEmail").value = "abdc";
    document.getElementById("changePassword").value = "abdc";

} else {
    //TODO: remove child elements and display a message if you aren't logged in
    document.body.remove();
}