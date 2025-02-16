// Function to populate a table
function populateTable(tableId, data) {
    console.log(`Populating table: ${tableId}`); // Debugging
    console.log("Data received:", data); // Debugging

    const table = document.getElementById(tableId);
    const tableBody = table.querySelector("tbody");
    const tableHead = table.querySelector("thead");

    // Clear existing content
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
        console.warn(`No data found for table ${tableId}`);
        return;
    }

    // Extract keys from the first item to use as headers
    const headers = Object.keys(data[0]);
    console.log("Headers:", headers); // Debugging

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

    console.log(`Table ${tableId} populated successfully.`); // Debugging
}

// Function to flatten nested JSON data
function flattenData(data) {
    console.log("Flattening data:", data); // Debugging

    if (!data || typeof data !== "object") {
        console.warn("Invalid data format:", data);
        return [];
    }

    const flattened = [];
    for (const type in data) {
        if (Array.isArray(data[type])) {
            if (data[type].length === 0) {
                console.warn(`Skipping empty array for type: ${type}`); // Debugging
                continue; // Skip empty arrays
            }
            data[type].forEach(item => {
                if (item && typeof item === "object") {
                    item.Type = type; // Add the type to each item
                    flattened.push(item);
                } else {
                    console.warn(`Skipping invalid item for type: ${type}`, item); // Debugging
                }
            });
        } else {
            console.warn(`Skipping non-array data for type: ${type}`, data[type]); // Debugging
        }
    }

    console.log("Flattened data:", flattened); // Debugging
    return flattened;
}

// Function to load JSON data and populate tables
async function loadData() {
    console.log("Loading data..."); // Debugging

    try {
        // Load JSON data
        console.log("Fetching troop_stats.json..."); // Debugging
        const troopResponse = await fetch("troop_stats.json");
        const troopData = await troopResponse.json();
        console.log("Troop Data:", troopData); // Debugging

        console.log("Fetching building_stats.json..."); // Debugging
        const buildingResponse = await fetch("building_stats.json");
        const buildingData = await buildingResponse.json();
        console.log("Building Data:", buildingData); // Debugging

        console.log("Fetching trap_stats.json..."); // Debugging
        const trapResponse = await fetch("trap_stats.json");
        const trapData = await trapResponse.json();
        console.log("Trap Data:", trapData); // Debugging

        // Flatten nested data
        console.log("Flattening troop data..."); // Debugging
        const flattenedTroopData = flattenData(troopData);
        console.log("Flattened Troop Data:", flattenedTroopData); // Debugging

        console.log("Flattening building data..."); // Debugging
        const flattenedBuildingData = flattenData(buildingData);
        console.log("Flattened Building Data:", flattenedBuildingData); // Debugging

        console.log("Flattening trap data..."); // Debugging
        const flattenedTrapData = flattenData(trapData);
        console.log("Flattened Trap Data:", flattenedTrapData); // Debugging

        // Populate tables
        console.log("Populating troops table..."); // Debugging
        populateTable("troops-table", flattenedTroopData);

        console.log("Populating buildings table..."); // Debugging
        populateTable("buildings-table", flattenedBuildingData);

        console.log("Populating traps table..."); // Debugging
        populateTable("traps-table", flattenedTrapData);

        console.log("Data loading and table population complete."); // Debugging
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Load data when the page loads
window.onload = loadData;
