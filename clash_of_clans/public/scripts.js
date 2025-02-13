// Function to populate a table with flattened data
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

// Function to flatten JSON data
function flattenData(data) {
    const flattenedData = [];
    for (const key in data) {
        if (Array.isArray(data[key])) {
            data[key].forEach(item => {
                flattenedData.push({ Type: key, ...item }); // Add the type (e.g., "Barbarian") as a "Type" field
            });
        }
    }
    return flattenedData;
}

// Function to load JSON data and populate tables
async function loadData() {
    try {
        // Load JSON data
        const [troopResponse, buildingResponse, trapResponse] = await Promise.all([
            fetch("troop_stats.json"),
            fetch("building_stats.json"),
            fetch("trap_stats.json")
        ]);

        // Check if responses are OK
        if (!troopResponse.ok || !buildingResponse.ok || !trapResponse.ok) {
            throw new Error("Failed to fetch JSON data");
        }

        const troopData = await troopResponse.json();
        const buildingData = await buildingResponse.json();
        const trapData = await trapResponse.json();

        // Flatten the data
        const flattenedTroopData = flattenData(troopData);
        const flattenedBuildingData = flattenData(buildingData);
        const flattenedTrapData = flattenData(trapData);

        console.log("Flattened Troop Data:", flattenedTroopData);
        console.log("Flattened Building Data:", flattenedBuildingData);
        console.log("Flattened Trap Data:", flattenedTrapData);

        // Populate tables
        populateTable("troops-table", flattenedTroopData);
        populateTable("buildings-table", flattenedBuildingData);
        populateTable("traps-table", flattenedTrapData);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Load data when the page loads
window.onload = loadData;
