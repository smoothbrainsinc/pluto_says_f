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

    // Create a header above the table with the troop type in big letters
    const header = document.createElement("h3");
    header.textContent = troopType;
    header.style.textAlign = "center";
    header.style.fontSize = "2rem";
    header.style.marginBottom = "1rem";
    table.parentNode.insertBefore(header, table);

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

        // Populate tables with troop type headers
        populateTable("troops-table", flattenedTroopData, "Barbarian");
        populateTable("buildings-table", flattenedBuildingData, "Buildings");
        populateTable("traps-table", flattenedTrapData, "Traps");
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Load data when the page loads
window.onload = loadData;
