// Function to populate a table
function populateTable(tableId, data) {
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

// Function to load JSON data and populate tables
async function loadData() {
    try {
        // Load JSON data
        const troopResponse = await fetch("clash_of_clans/public/troop_stats.json");
        const troopData = await troopResponse.json().catch(() => []); // Fallback to empty array

        const buildingResponse = await fetch("clash_of_clans/public/building_stats.json");
        const buildingData = await buildingResponse.json().catch(() => []); // Fallback to empty array

        const trapResponse = await fetch("clash_of_clans/public/trap_stats.json");
        const trapData = await trapResponse.json().catch(() => []); // Fallback to empty array

        // Populate tables
        populateTable("troops-table", troopData);
        populateTable("buildings-table", buildingData);
        populateTable("traps-table", trapData);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Load data when the page loads
window.onload = loadData;
