// Function to create and populate a table for a specific troop type
function createTroopTable(containerId, data, title) {
    const container = document.getElementById(containerId);

    // Create a new section for the troop type
    const section = document.createElement("div");
    section.className = "section";

    // Create a header for the troop type
    const header = document.createElement("h3");
    header.textContent = title;
    header.style.textAlign = "center";
    header.style.fontSize = "2rem";
    header.style.marginBottom = "1rem";
    section.appendChild(header);

    // Create a table element
    const table = document.createElement("table");
    table.className = "table table-striped";

    // Create table head and body
    const tableHead = document.createElement("thead");
    const tableBody = document.createElement("tbody");

    // Extract keys from the first item to use as headers
    const headers = Object.keys(data[0]);

    // Create header row
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header; // Use the key as the header text
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create data rows
    data.forEach(item => {
        const row = document.createElement("tr");
        headers.forEach(header => {
            const cell = document.createElement("td");
            cell.textContent = item[header] || "N/A"; // Use "N/A" if data is missing
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });

    // Append thead and tbody to the table
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    // Append the table to the section
    section.appendChild(table);

    // Append the section to the container
    container.appendChild(section);
}

// Function to load JSON data and create tables for each troop type
async function loadData() {
    try {
        // Load JSON data
        const troopResponse = await fetch("troop_stats.json");
        const troopData = await troopResponse.json();

        const buildingResponse = await fetch("building_stats.json");
        const buildingData = await buildingResponse.json();

        const trapResponse = await fetch("trap_stats.json");
        const trapData = await trapResponse.json();

        // Clear existing content in the containers
        document.getElementById("troops-container").innerHTML = "";
        document.getElementById("buildings-container").innerHTML = "";
        document.getElementById("traps-container").innerHTML = "";

        // Iterate over each troop type and create a table for it
        for (const troopType in troopData) {
            if (Array.isArray(troopData[troopType])) {
                createTroopTable("troops-container", troopData[troopType], troopType);
            }
        }

        // Iterate over each building type and create a table for it
        for (const buildingType in buildingData) {
            if (Array.isArray(buildingData[buildingType])) {
                createTroopTable("buildings-container", buildingData[buildingType], buildingType);
            }
        }

        // Iterate over each trap type and create a table for it
        for (const trapType in trapData) {
            if (Array.isArray(trapData[trapType])) {
                createTroopTable("traps-container", trapData[trapType], trapType);
            }
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Load data when the page loads
window.onload = loadData;
