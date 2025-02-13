// Function to populate a table
function populateTable(tableId, data, troopType) {
    const table = document.getElementById(tableId);
    const tableBody = table.querySelector("tbody");
    const tableHead = table.querySelector("thead");

    // Clear existing content
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (data.length === 0) {
        console.warn(`No data found for table ${tableId}`);
        return;
    }

    // Add a header above the table with the troop type
    const section = table.closest('.section');
    const header = document.createElement('h3');
    header.textContent = troopType;
    header.style.fontSize = '2rem'; // Make the text big
    header.style.marginBottom = '1rem'; // Add some spacing
    section.insertBefore(header, table);

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
}

// Function to flatten JSON data
function flattenData(data) {
    const flattenedData = [];
    for (const key in data) {
        if (Array.isArray(data[key])) {
            data[key].forEach(item => {
                flattenedData.push({ Type: key, ...item });
            });
        }
    }
    return flattenedData;
}

// Function to load JSON data and populate tables
async function loadData() {
    try {
        // Load JSON data
        const troopResponse = await fetch("troop_stats.json");
        const troopData = await troopResponse.json();
        const flattenedTroopData = flattenData(troopData);

        const buildingResponse = await fetch("building_stats.json");
        const buildingData = await buildingResponse.json();
        const flattenedBuildingData = flattenData(buildingData);

        const trapResponse = await fetch("trap_stats.json");
        const trapData = await trapResponse.json();
        const flattenedTrapData = flattenData(trapData);

        // Populate tables
        populateTable("troops-table", flattenedTroopData, "Barbarian"); // Pass the troop type
        populateTable("buildings-table", flattenedBuildingData, "Buildings"); // Pass the building type
        populateTable("traps-table", flattenedTrapData, "Traps"); // Pass the trap type
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Load data when the page loads
window.onload = loadData;
