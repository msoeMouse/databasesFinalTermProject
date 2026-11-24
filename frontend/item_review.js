/**
 * File: item_review.js
 * Brief: Submit a review of the item currently onscreen
 * Author: Jack Brickl
 * Date: 11/17/2026
 */

//from Bing AI search
const url = window.location.href;
const start = url.indexOf("?");
const separator = url.indexOf("&");

let menuItemId = (start !== -1 && separator !== -1) ?
    url.substring(start + 8, separator) : "";
let date = url.substring(separator + 6);

console.log(menuItemId);
console.log(date);

async function getInfo() {
    try {
        const response = await fetch("/api/menu-item", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                menuItem: menuItemId
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Failed to submit review: ${response.status}`);
        }

        const item = data.data;

        console.log(item);

        document.getElementById("name").textContent = item[0].itemName;
        document.getElementById("description").textContent = item[0].itemDescription;
        document.getElementById("calories").textContent = item[0].calories + " calories";

    } catch (error) {
        console.error("Request failed: " + error.message);
    }
}

async function submitReview(rating) {
    if (rating < 1 || rating > 5) {
        console.error("Rating is out of bounds for 1-5");
        return;
    }

    if (!sessionStorage.getItem("accountId")) {
        console.error("Not logged in!");
        return;
    }

    try {
        const response = await fetch("/api/submit-review", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                rating: rating,
                accountID: sessionStorage.getItem("accountId"),
                menuItem: menuItemId,
                menuDate: "2026-11-17",
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Failed to submit review: ${response.status}`);
        }

    } catch (error) {
        console.error("Request failed: " + error.message);
    }
}

getInfo();