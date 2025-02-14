// Function to create and populate a table for a specific troop type
function createTroopTable(troopType, data) {
    console.log(`Creating table for ${troopType}`); // Debug: Log troop type

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
    console.log("Headers for", troopType, ":", headers); // Debug: Log headers

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
        console.log(`Processing row ${index + 1} for ${troopType}:`, item); // Debug: Log each row of data
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

    console.log(`Table for ${troopType} created successfully!`); // Debug: Log success
}

// Function to load JSON data and create tables for each troop type
async function loadData() {
    console.log("Loading data..."); // Debug: Log start of data loading
    try {
        // Load JSON data
        console.log("Fetching troop data..."); // Debug: Log troop data fetch
        const troopResponse = await fetch("troop_stats.json");
        console.log("Troop response:", troopResponse); // Debug: Log troop response
        const troopData = await troopResponse.json();
        console.log("Troop data (raw):", troopData); // Debug: Log raw troop data

        // Clear existing content in the troops container
        const troopsContainer = document.getElementById("troops-container");
        troopsContainer.innerHTML = "";

        // Iterate over each troop type and create a table for it
        for (const troopType in troopData) {
            if (Array.isArray(troopData[troopType])) {
                console.log(`Processing troop type: ${troopType}`); // Debug: Log troop type
                createTroopTable(troopType, troopData[troopType]);
            }
        }

        console.log("Data loaded and tables populated successfully!"); // Debug: Log success
    } catch (error) {
        console.error("Error loading data:", error); // Debug: Log error
    }
}

// Load data when the page loads
console.log("Initializing page..."); // Debug: Log page initialization
window.onload = loadData;
