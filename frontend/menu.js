/**
 * File: menu.js
 * Brief: Given a date, populate a list of menu items from the database
 * Author: Jack Brickl
 * Date: 11/12/2026
 */

/**
 * Reset the menu list without refreshing the page
 */
function resetMenu() {
    //https://www.geeksforgeeks.org/javascript/how-to-clear-the-content-of-a-div-using-javascript/
    const menu = document.getElementById("list");
    while (menu.firstChild) {
        menu.removeChild(menu.firstChild);
    }
}

/**
 * Get every item in the menu list and put it on the front page
 * @returns {Promise<void>} Promise that the fetch request is successful
 */
async function getMenu() {
    resetMenu()

    const menu = document.getElementById("list");

    try {
        const response = await fetch("/api/menu", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                date: document.getElementById("dateInput").value
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Failed to get menu today: ${response.status}`);
        }

        console.log("data: " + JSON.stringify(data));

        //for each element in the response json, convert it into an element then append it
        const items = data.data;
        console.log("items: " + JSON.stringify(items));

        for (let i = 0; i < items.length; i += 1) {
            const menuItem = document.createElement("div");
            const name = document.createElement("p");
            const description = document.createElement("p");
            const calories = document.createElement("p");
            const reviewMe = document.createElement("a");

            name.textContent = items[i].itemName;
            description.textContent = items[i].itemDescription;
            calories.textContent = items[i].calories + " calories";
            reviewMe.textContent = "Review Me!";
            reviewMe.href = "/item_review.html?itemid=" + items[i].itemId;
            //+ "&date=" + items[i].date;

            menuItem.appendChild(name);
            menuItem.appendChild(description);
            menuItem.appendChild(calories);
            menuItem.appendChild(reviewMe);

            menuItem.className = "menuItem";

            menu.appendChild(menuItem);
        }


    } catch (error) {
        console.error("Request failed: " + error.message);
    }
}

getMenu();