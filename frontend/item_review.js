/**
 * File: item_review.js
 * Brief: Submit a review of the item currently onscreen
 * Author: Jack Brickl
 * Date: 11/17/2026
 */

//Bing AI search helped me get these variables from search bar
const url = window.location.href;
const start = url.indexOf("?");
const separator = url.indexOf("&");

let menuItemId = (start !== -1 && separator !== -1) ?
    url.substring(start + 8, separator) : "";
let date = url.substring(separator + 6);
//

let reviewRating = 3;

function createStar(rating) {
    let star = document.createElement("img");
    star.alt = "Star that gives a rating of " + rating;
    star.src = (reviewRating >= rating) ? "star-selected.png" : "star-not-selected.png";
    star.width = "60";
    star.height = "60";
    star.onclick = function () {
        reviewRating = rating
    };
    let toAppend = document.getElementById("star-div");
    toAppend.appendChild(star);
}

function submitReviewButton() {
    let button = document.createAttribute("button");
    button.onClick = submitReview(reviewRating);
    button.textContent = "Submit Review";

    let toAppend = document.getElementById("star-div");
    toAppend.appendChild(button);
}

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

createStar(1);
createStar(2);
createStar(3);
createStar(4);
createStar(5);
getInfo();
submitReviewButton();