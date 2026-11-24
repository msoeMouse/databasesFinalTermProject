/**
 * File: item_review.js
 * Brief: Submit a review of the item currently onscreen
 * Author: Jack Brickl
 * Date: 11/17/2026
 */

let menuItemId;
let date;

async function getInfo() {
    try {
        const response = await fetch("/api/menu-item", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                menuItem: 1
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Failed to submit review: ${response.status}`);
        }

        const item = data.data;

        console.log(item);

        menuItemId = item[0].menuItemId;

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