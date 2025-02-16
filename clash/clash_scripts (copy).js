// Function to create and populate a table for a specific troop type
function createTroopTable(troopType, data) {
    console.log(`Creating table for ${troopType}`); // Debugging

    // Create a new section for the troop type
    const section = document.createElement("div");
    section.className = "section";

    // Create a header for the troop type
    const header = document.createElement("h3");
    header.textContent = troopType;
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
    console.log("Headers for", troopType, ":", headers); // Debugging

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

    // Append the section to the troops container
    const troopsContainer = document.getElementById("troops-container");
    troopsContainer.appendChild(section);

    console.log(`Table for ${troopType} created successfully!`); // Debugging
}

// Function to load JSON data and create tables for each troop type
async function loadData() {
    console.log("Loading data..."); // Debugging

    try {
        // Load JSON data
        console.log("Fetching troop_stats.json..."); // Debugging
        const troopResponse = await fetch("troop_stats.json");
        if (!troopResponse.ok) {
            throw new Error(`Failed to fetch troop_stats.json: ${troopResponse.statusText}`);
        }
        const troopData = await troopResponse.json();
        console.log("Troop Data:", troopData); // Debugging

        console.log("Fetching building_stats.json..."); // Debugging
        const buildingResponse = await fetch("building_stats.json");
        if (!buildingResponse.ok) {
            throw new Error(`Failed to fetch building_stats.json: ${buildingResponse.statusText}`);
        }
        const buildingData = await buildingResponse.json();
        console.log("Building Data:", buildingData); // Debugging

        console.log("Fetching trap_stats.json..."); // Debugging
        const trapResponse = await fetch("trap_stats.json");
        if (!trapResponse.ok) {
            throw new Error(`Failed to fetch trap_stats.json: ${trapResponse.statusText}`);
        }
        const trapData = await trapResponse.json();
        console.log("Trap Data:", trapData); // Debugging

        // Clear existing content in the troops container
        const troopsContainer = document.getElementById("troops-container");
        troopsContainer.innerHTML = "";

        // Process troop data
        for (const troopType in troopData) {
            if (Array.isArray(troopData[troopType])) {
                if (troopData[troopType].length === 0) {
                    console.warn(`Skipping empty array for type: ${troopType}`); // Debugging
                    createTroopTable(troopType, [{ Message: "No data available" }]); // Add placeholder
                } else {
                    console.log(`Processing troop type: ${troopType}`); // Debugging
                    createTroopTable(troopType, troopData[troopType]);
                }
            } else {
                console.warn(`Skipping non-array data for type: ${troopType}`, troopData[troopType]); // Debugging
            }
        }

        // Process building data (if needed)
        for (const buildingType in buildingData) {
            if (Array.isArray(buildingData[buildingType])) {
                if (buildingData[buildingType].length === 0) {
                    console.warn(`Skipping empty array for type: ${buildingType}`); // Debugging
                    createTroopTable(buildingType, [{ Message: "No data available" }]); // Add placeholder
                } else {
                    console.log(`Processing building type: ${buildingType}`); // Debugging
                    createTroopTable(buildingType, buildingData[buildingType]);
                }
            } else {
                console.warn(`Skipping non-array data for type: ${buildingType}`, buildingData[buildingType]); // Debugging
            }
        }

        // Process trap data (if needed)
        for (const trapType in trapData) {
            if (Array.isArray(trapData[trapType])) {
                if (trapData[trapType].length === 0) {
                    console.warn(`Skipping empty array for type: ${trapType}`); // Debugging
                    createTroopTable(trapType, [{ Message: "No data available" }]); // Add placeholder
                } else {
                    console.log(`Processing trap type: ${trapType}`); // Debugging
                    createTroopTable(trapType, trapData[trapType]);
                }
            } else {
                console.warn(`Skipping non-array data for type: ${trapType}`, trapData[trapType]); // Debugging
            }
        }

        console.log("Data loaded and tables populated successfully!"); // Debugging
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Load data when the page loads
window.onload = loadData;
