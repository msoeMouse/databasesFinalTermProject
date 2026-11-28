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
let dateToUse = url.substring(separator + 6);
//

let reviewRating = 0;

function updateStars() {
    const stars = document.querySelectorAll("#star-div img");

    stars.forEach((star, index) => {
        const rating = index + 1;

        star.src = (reviewRating >= rating)
            ? "star-selected.png"
            : "star-not-selected.png";
    });
}

function createStar(rating) {
    let star = document.createElement("img");
    star.alt = "Star that gives a rating of " + rating;
    star.src = (reviewRating >= rating) ? "star-selected.png" : "star-not-selected.png";
    star.width = "60";
    star.height = "60";
    star.style.cursor = "pointer";
    star.onclick = function () {
        reviewRating = rating;
        updateStars();
    };
    document.getElementById("star-div").appendChild(star);
}

function submitReviewButton() {
    let button = document.createElement("button");
    button.onclick = () => submitReview(reviewRating);
    button.textContent = "Submit Review";

    document.getElementById("star-div").appendChild(button);
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
                menuDate: dateToUse,
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