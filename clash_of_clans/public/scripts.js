// Function to populate a table
function populateTable(tableId, data) {
    console.log(`Populating table: ${tableId}`); // Debug: Log table ID
    const table = document.getElementById(tableId);
    console.log("Table element:", table); // Debug: Log table element

    if (!table) {
        console.error(`Table with ID ${tableId} not found!`); // Debug: Log error if table is missing
        return;
    }

    const tableBody = table.querySelector("tbody");
    const tableHead = table.querySelector("thead");

    // Clear existing content
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (data.length === 0) {
        console.warn(`No data found for table ${tableId}`); // Debug: Log warning if data is empty
        return;
    }

    // Extract keys from the first item to use as headers
    const headers = Object.keys(data[0]);
    console.log("Headers:", headers); // Debug: Log headers

    // Create header row
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header; // Use the key as the header text
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create data rows
    data.forEach((item, index) => {
        console.log(`Processing row ${index + 1}:`, item); // Debug: Log each row of data
        const row = document.createElement("tr");
        headers.forEach(header => {
            const cell = document.createElement("td");
            cell.textContent = item[header] || "N/A"; // Use "N/A" if data is missing
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });

    console.log(`Table ${tableId} populated successfully!`); // Debug: Log success
}

// Function to flatten JSON data
function flattenData(data) {
    console.log("Flattening data:", data); // Debug: Log raw data
    const flattenedData = [];
    for (const key in data) {
        if (Array.isArray(data[key])) {
            console.log(`Processing key: ${key}`); // Debug: Log each key
            data[key].forEach((item, index) => {
                console.log(`Processing item ${index + 1} for key ${key}:`, item); // Debug: Log each item
                flattenedData.push({ Type: key, ...item });
            });
        }
    }
    console.log("Flattened data:", flattenedData); // Debug: Log flattened data
    return flattenedData;
}

// Function to load JSON data and populate tables
async function loadData() {
    console.log("Loading data..."); // Debug: Log start of data loading
    try {
        // Load JSON data
        console.log("Fetching troop data..."); // Debug: Log troop data fetch
        const troopResponse = await fetch("troop_stats.json");
        console.log("Troop response:", troopResponse); // Debug: Log troop response
        const troopData = await troopResponse.json();
        console.log("Troop data (raw):", troopData); // Debug: Log raw troop data
        const flattenedTroopData = flattenData(troopData);
        console.log("Troop data (flattened):", flattenedTroopData); // Debug: Log flattened troop data

        console.log("Fetching building data..."); // Debug: Log building data fetch
        const buildingResponse = await fetch("building_stats.json");
        console.log("Building response:", buildingResponse); // Debug: Log building response
        const buildingData = await buildingResponse.json();
        console.log("Building data (raw):", buildingData); // Debug: Log raw building data
        const flattenedBuildingData = flattenData(buildingData);
        console.log("Building data (flattened):", flattenedBuildingData); // Debug: Log flattened building data

        console.log("Fetching trap data..."); // Debug: Log trap data fetch
        const trapResponse = await fetch("trap_stats.json");
        console.log("Trap response:", trapResponse); // Debug: Log trap response
        const trapData = await trapResponse.json();
        console.log("Trap data (raw):", trapData); // Debug: Log raw trap data
        const flattenedTrapData = flattenData(trapData);
        console.log("Trap data (flattened):", flattenedTrapData); // Debug: Log flattened trap data

        // Populate tables
        console.log("Populating troops table..."); // Debug: Log troops table population
        populateTable("troops-table", flattenedTroopData);

        console.log("Populating buildings table..."); // Debug: Log buildings table population
        populateTable("buildings-table", flattenedBuildingData);

        console.log("Populating traps table..."); // Debug: Log traps table population
        populateTable("traps-table", flattenedTrapData);

        console.log("Data loaded and tables populated successfully!"); // Debug: Log success
    } catch (error) {
        console.error("Error loading data:", error); // Debug: Log error
    }
}

// Load data when the page loads
console.log("Initializing page..."); // Debug: Log page initialization
window.onload = loadData;
