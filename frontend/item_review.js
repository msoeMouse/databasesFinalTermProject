/**
 * File: item_review.js
 * Brief: Submit a review of the item currently onscreen
 * Author: Jack Brickl
 * Date: 11/17/2026
 */

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
                accountID: 1,
                menuItem: 1,
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