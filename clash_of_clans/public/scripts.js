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

// Function to flatten JSON data
function flattenData(data) {
    const flattenedData = [];
    for (const trapName in data) {
        if (Array.isArray(data[trapName])) {
            data[trapName].forEach(level => {
                flattenedData.push({ Trap: trapName, ...level });
            });
        }
    }
    return flattenedData;
}

// Function to load JSON data and populate tables
async function loadData() {
    try {
        // Load JSON data
        const trapResponse = await fetch("trap_stats.json");
        const trapData = await trapResponse.json();

        // Flatten the data
        const flattenedTrapData = flattenData(trapData);

        // Populate tables
        populateTable("traps-table", flattenedTrapData);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Load data when the page loads
window.onload = loadData;
