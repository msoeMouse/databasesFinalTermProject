/**
 * File: menu.js
 * Brief: Given a date, populate a list of menu items from the database
 * Author: Jack Brickl
 * Date: 11/12/2026
 */

async function getMenu() {
    const menu = document.getElementById("list");

    try {
        const response = await fetch("/api/menu", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                //date: document.getElementById("date").value
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

            name.textContent = items[i].itemName;
            description.textContent = items[i].itemDescription;
            calories.textContent = items[i].calories + " calories";

            menuItem.appendChild(name);
            menuItem.appendChild(description);
            menuItem.appendChild(calories);

            menu.appendChild(menuItem);
        }


    } catch (error) {
        console.error("Request failed: " + error.message);
    }
}

getMenu();